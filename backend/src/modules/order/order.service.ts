import prisma from '../../config/prisma';
import { AppError, ErrorCode } from '../../error/AppError';
import type { CreateOrderInput } from './order.validation';
import type { OrderStatus } from '../../../../lib/generated/prisma';

/**
 * Platform fee percentage applied to every order.
 * Stored as a constant here — can be moved to a config table
 * or environment variable when dynamic fee tiers are introduced.
 */
const PLATFORM_FEE_PERCENT = 10;

/**
 * Valid order state transition matrix.
 *
 * Happy path:
 * PENDING -> PAYMENT_PENDING -> PAID -> IN_PROGRESS -> COMPLETED
 *
 * Failure and cancellation paths:
 * PENDING -> CANCELLED
 * PENDING -> PAYMENT_FAILED
 * PAYMENT_PENDING -> CANCELLED
 * PAYMENT_PENDING -> PAYMENT_FAILED
 * PAYMENT_FAILED -> PAYMENT_PENDING (retry payment)
 * PAYMENT_FAILED -> CANCELLED
 */
export const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAYMENT_PENDING', 'CANCELLED', 'PAYMENT_FAILED'],
  PAYMENT_PENDING: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAID: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['SUBMITTED', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
  SUBMITTED: ['REVISION', 'COMPLETED', 'DISPUTED'],
  REVISION: ['SUBMITTED', 'COMPLETED', 'DISPUTED'],
  COMPLETED: [],
  CANCELLED: [],
  PAYMENT_FAILED: ['PAYMENT_PENDING', 'CANCELLED'],
  DISPUTED: ['COMPLETED', 'CANCELLED'],
};

export class OrderService {
  /**
   * Initiates a new order for the authenticated client.
   *
   * Flow (server-authoritative):
   *   1. Fetch gig from DB (single source of truth for pricing)
   *   2. Validate the gig is purchasable (ACTIVE, not owned by client)
   *   3. Calculate subtotal, platform fee, and total in paise
   *   4. Create an Order record in PENDING status (NEVER 'PAID' at creation)
   *   5. Return the order with its locked pricing snapshot
   */
  static async initiateOrder(clientId: string, input: CreateOrderInput) {
    return prisma.$transaction(async (tx) => {
      // ── Step 1: Fetch gig within transaction ─────────────────
      const gig = await tx.gig.findUnique({
        where: { id: input.gigId },
        include: {
          freelancer: {
            select: { id: true, name: true },
          },
        },
      });

      if (!gig) {
        throw new AppError('Gig not found. It may have been removed.', 404, ErrorCode.NOT_FOUND);
      }

      // ── Step 2: Validate purchasability within transaction ───
      if (gig.status !== 'ACTIVE') {
        throw new AppError(
          'This gig is not currently available for purchase.',
          422,
          ErrorCode.VALIDATION_ERROR,
        );
      }

      if (gig.freelancerId === clientId) {
        throw new AppError('You cannot order your own gig.', 422, ErrorCode.VALIDATION_ERROR);
      }

      // ── Step 3: Server-authoritative pricing (Smallest Currency Unit: Paise) ──
      // All monetary amounts are handled and stored in paise (1 INR = 100 paise)
      // to eliminate floating-point precision issues and match payment gateway requirements.
      const unitPrice = Math.round(gig.price * 100);
      const subtotal = unitPrice * input.quantity;
      const platformFee = Math.round((subtotal * PLATFORM_FEE_PERCENT) / 100);
      const total = subtotal + platformFee;

      // ── Step 4: Create Order in PENDING status with price snapshot ────
      // Creating an order reserves the booking in PENDING status.
      // Payment is a separate state transition: PENDING -> PAYMENT_PENDING -> PAID.
      const order = await tx.order.create({
        data: {
          clientId,
          freelancerId: gig.freelancerId,
          gigId: gig.id,
          unitPrice,
          quantity: input.quantity,
          subtotal,
          platformFee,
          amount: total,
          status: 'PENDING',
        },
        include: {
          gig: {
            select: {
              id: true,
              title: true,
              category: true,
              deliveryTime: true,
              images: true,
            },
          },
          freelancer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      // ── Step 5: Return order with pricing breakdown ────────────
      return {
        order,
        pricing: {
          currency: 'INR',
          unit: 'paise',
          unitPrice,
          quantity: input.quantity,
          subtotal,
          platformFeePercent: PLATFORM_FEE_PERCENT,
          platformFee,
          total,
        },
      };
    });
  }

  /**
   * Retrieves an order by ID for the cart/checkout review.
   * Returns the locked pricing snapshot agreed at booking time,
   * regardless of whether the gig price was subsequently changed.
   */
  static async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            category: true,
            deliveryTime: true,
            images: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found.', 404, ErrorCode.NOT_FOUND);
    }

    if (order.clientId !== userId && order.freelancerId !== userId) {
      throw new AppError('You are not authorized to view this order.', 403, ErrorCode.FORBIDDEN);
    }

    return {
      order,
      pricing: {
        currency: 'INR',
        unit: 'paise',
        unitPrice: order.unitPrice ?? order.amount,
        quantity: order.quantity,
        subtotal: order.subtotal ?? order.amount,
        platformFeePercent: PLATFORM_FEE_PERCENT,
        platformFee: order.platformFee ?? 0,
        total: order.amount,
      },
    };
  }

  /**
   * Validates and transitions an order across lifecycle states.
   * Enforces valid state machine pathways and participant roles.
   */
  static async transitionStatus(
    orderId: string,
    userId: string,
    targetStatus: OrderStatus,
    reason?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          gig: {
            select: {
              id: true,
              title: true,
              category: true,
              deliveryTime: true,
              images: true,
            },
          },
          freelancer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!order) {
        throw new AppError('Order not found.', 404, ErrorCode.NOT_FOUND);
      }

      const isClient = order.clientId === userId;
      const isFreelancer = order.freelancerId === userId;
      if (!isClient && !isFreelancer) {
        throw new AppError('You are not authorized to update this order.', 403, ErrorCode.FORBIDDEN);
      }

      // Role-specific transition guards
      if (
        (targetStatus === 'CANCELLED' ||
          targetStatus === 'PAYMENT_PENDING' ||
          targetStatus === 'PAYMENT_FAILED') &&
        !isClient
      ) {
        throw new AppError(
          'Only the client can modify payment or cancel pending orders.',
          403,
          ErrorCode.FORBIDDEN,
        );
      }

      if (targetStatus === 'IN_PROGRESS' && !isFreelancer) {
        throw new AppError(
          'Only the freelancer can start work on this order.',
          403,
          ErrorCode.FORBIDDEN,
        );
      }

      if (targetStatus === 'COMPLETED' && !isClient) {
        throw new AppError(
          'Only the client can approve and complete this order.',
          403,
          ErrorCode.FORBIDDEN,
        );
      }

      // State machine transition validation
      const allowed = ALLOWED_ORDER_TRANSITIONS[order.status] ?? [];
      if (!allowed.includes(targetStatus)) {
        throw new AppError(
          `Cannot transition order from '${order.status}' to '${targetStatus}'. Allowed next states: [${allowed.join(', ')}]`,
          400,
          ErrorCode.VALIDATION_ERROR,
        );
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: targetStatus },
        include: {
          gig: {
            select: {
              id: true,
              title: true,
              category: true,
              deliveryTime: true,
              images: true,
            },
          },
          freelancer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return {
        order: updatedOrder,
        pricing: {
          currency: 'INR',
          unit: 'paise',
          unitPrice: updatedOrder.unitPrice ?? updatedOrder.amount,
          quantity: updatedOrder.quantity,
          subtotal: updatedOrder.subtotal ?? updatedOrder.amount,
          platformFeePercent: PLATFORM_FEE_PERCENT,
          platformFee: updatedOrder.platformFee ?? 0,
          total: updatedOrder.amount,
        },
        transition: {
          from: order.status,
          to: targetStatus,
          reason: reason ?? null,
          timestamp: new Date(),
        },
      };
    });
  }

  /**
   * PENDING -> PAYMENT_PENDING
   */
  static async markPaymentPending(orderId: string, clientId: string) {
    return this.transitionStatus(orderId, clientId, 'PAYMENT_PENDING');
  }

  /**
   * PAYMENT_PENDING -> PAID
   */
  static async markPaid(orderId: string, userId: string) {
    return this.transitionStatus(orderId, userId, 'PAID');
  }

  /**
   * PAID -> IN_PROGRESS
   */
  static async startProgress(orderId: string, freelancerId: string) {
    return this.transitionStatus(orderId, freelancerId, 'IN_PROGRESS');
  }

  /**
   * IN_PROGRESS -> COMPLETED
   */
  static async completeOrder(orderId: string, clientId: string) {
    return this.transitionStatus(orderId, clientId, 'COMPLETED');
  }

  /**
   * PENDING / PAYMENT_PENDING -> CANCELLED
   */
  static async cancelOrder(orderId: string, clientId: string, reason?: string) {
    return this.transitionStatus(orderId, clientId, 'CANCELLED', reason);
  }

  /**
   * PENDING / PAYMENT_PENDING -> PAYMENT_FAILED
   */
  static async failPayment(orderId: string, clientId: string, reason?: string) {
    return this.transitionStatus(orderId, clientId, 'PAYMENT_FAILED', reason);
  }
}
