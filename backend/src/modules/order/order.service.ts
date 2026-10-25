import { randomUUID } from 'crypto';
import prisma from '../../config/prisma';
import { AppError, ErrorCode } from '../../error/AppError';
import type { CreateOrderInput } from './order.validation';
import { Prisma, type OrderStatus } from '../../../../lib/generated/prisma';

/**
 * Platform fee percentage applied to every order.
 * Stored as a constant here — can be moved to a config table
 * or environment variable when dynamic fee tiers are introduced.
 */
const PLATFORM_FEE_PERCENT = 10;

/**
 * Standard relational include for order queries
 */
const ORDER_INCLUDE = {
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
  payment: true,
  deliverables: true,
};

/**
 * Helper to structure standardized locked pricing snapshots
 */
function formatOrderPricing(order: {
  unitPrice: number | null;
  amount: number;
  quantity: number;
  subtotal: number | null;
  platformFee: number | null;
}) {
  return {
    currency: 'INR',
    unit: 'paise',
    unitPrice: order.unitPrice ?? order.amount,
    quantity: order.quantity,
    subtotal: order.subtotal ?? order.amount,
    platformFeePercent: PLATFORM_FEE_PERCENT,
    platformFee: order.platformFee ?? 0,
    total: order.amount,
  };
}

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
   * Initiates a new order for the authenticated client with Idempotency.
   *
   * Flow (server-authoritative + idempotent):
   *   1. Resolve or generate idempotency key.
   *   2. Check if an order with this idempotency key already exists.
   *      - If it exists and belongs to this client:
   *        Verify consistent payload (gigId & quantity).
   *        Return the existing order record (HTTP 200).
   *      - If it exists and belongs to another client:
   *        Throw 409 Conflict.
   *   3. If new: Fetch gig from DB and validate purchasability.
   *   4. Calculate subtotal, platform fee, and total in paise.
   *   5. Create the Order record in PENDING status with the idempotencyKey.
   *   6. Return the created order with pricing snapshot (HTTP 201).
   *   7. Catch concurrent race conditions (P2002 on idempotencyKey) and gracefully return existing order.
   */
  static async initiateOrder(clientId: string, input: CreateOrderInput) {
    const finalIdempotencyKey = input.idempotencyKey?.trim() || randomUUID();

    try {
      return await prisma.$transaction(async (tx) => {
        // ── Step 1: Idempotency Check within transaction ────────
        const existingOrder = await tx.order.findUnique({
          where: { idempotencyKey: finalIdempotencyKey },
          include: ORDER_INCLUDE,
        });

        if (existingOrder) {
          if (existingOrder.clientId !== clientId) {
            throw new AppError(
              'Idempotency key conflict: This key was previously used by another client.',
              409,
              ErrorCode.CONFLICT,
            );
          }

          if (existingOrder.gigId !== input.gigId || existingOrder.quantity !== input.quantity) {
            throw new AppError(
              'Idempotency key conflict: This key was previously used with different order parameters.',
              409,
              ErrorCode.CONFLICT,
            );
          }

          return {
            order: existingOrder,
            pricing: formatOrderPricing(existingOrder),
            isExisting: true,
          };
        }

        // ── Step 2: Fetch gig within transaction ─────────────────
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

        // ── Step 3: Validate purchasability within transaction ───
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

        // ── Step 4: Server-authoritative pricing (Paise) ─────────
        const unitPrice = Math.round(gig.price * 100);
        const subtotal = unitPrice * input.quantity;
        const platformFee = Math.round((subtotal * PLATFORM_FEE_PERCENT) / 100);
        const total = subtotal + platformFee;

        // ── Step 5: Create Order in PENDING status with idempotency key ──
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
            idempotencyKey: finalIdempotencyKey,
          },
          include: ORDER_INCLUDE,
        });

        // ── Step 6: Return order with pricing breakdown ────────────
        return {
          order,
          pricing: formatOrderPricing(order),
          isExisting: false,
        };
      });
    } catch (error: unknown) {
      // Step 7: Handle concurrency race condition (Prisma P2002 on idempotencyKey)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        (error.meta.target as string[]).includes('idempotencyKey')
      ) {
        const concurrentOrder = await prisma.order.findUnique({
          where: { idempotencyKey: finalIdempotencyKey },
          include: ORDER_INCLUDE,
        });

        if (concurrentOrder && concurrentOrder.clientId === clientId) {
          return {
            order: concurrentOrder,
            pricing: formatOrderPricing(concurrentOrder),
            isExisting: true,
          };
        }
      }

      throw error;
    }
  }

  /**
   * Retrieves an order by its unique idempotency key.
   */
  static async getOrderByIdempotencyKey(idempotencyKey: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { idempotencyKey },
      include: ORDER_INCLUDE,
    });

    if (!order) {
      throw new AppError(
        'Order not found for the provided idempotency key.',
        404,
        ErrorCode.NOT_FOUND,
      );
    }

    if (order.clientId !== userId && order.freelancerId !== userId) {
      throw new AppError('You are not authorized to view this order.', 403, ErrorCode.FORBIDDEN);
    }

    return {
      order,
      pricing: formatOrderPricing(order),
    };
  }

  /**
   * Retrieves an order by ID for the cart/checkout review.
   * Returns the locked pricing snapshot agreed at booking time,
   * regardless of whether the gig price was subsequently changed.
   */
  static async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: ORDER_INCLUDE,
    });

    if (!order) {
      throw new AppError('Order not found.', 404, ErrorCode.NOT_FOUND);
    }

    if (order.clientId !== userId && order.freelancerId !== userId) {
      throw new AppError('You are not authorized to view this order.', 403, ErrorCode.FORBIDDEN);
    }

    return {
      order,
      pricing: formatOrderPricing(order),
    };
  }

  /**
   * Retrieves all orders placed by the authenticated client.
   */
  static async getClientOrders(clientId: string) {
    const orders = await prisma.order.findMany({
      where: { clientId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      order,
      pricing: formatOrderPricing(order),
    }));
  }

  /**
   * Retrieves all orders assigned to the authenticated freelancer.
   */
  static async getFreelancerOrders(freelancerId: string) {
    const orders = await prisma.order.findMany({
      where: { freelancerId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      order,
      pricing: formatOrderPricing(order),
    }));
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
    options?: { razorpayOrderId?: string },
  ) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: ORDER_INCLUDE,
      });

      if (!order) {
        throw new AppError('Order not found.', 404, ErrorCode.NOT_FOUND);
      }

      const isClient = order.clientId === userId;
      const isFreelancer = order.freelancerId === userId;
      if (!isClient && !isFreelancer) {
        throw new AppError(
          'You are not authorized to update this order.',
          403,
          ErrorCode.FORBIDDEN,
        );
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

      if (targetStatus === 'SUBMITTED' && !isFreelancer) {
        throw new AppError(
          'Only the freelancer can submit deliverables for this order.',
          403,
          ErrorCode.FORBIDDEN,
        );
      }

      if (targetStatus === 'REVISION' && !isClient) {
        throw new AppError(
          'Only the client can request revisions for this order.',
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

      // If the order is already in the target status (e.g. repeated request due to network timeout),
      // treat this transition as idempotent and return the current order state.
      if (order.status === targetStatus) {
        return {
          order,
          pricing: formatOrderPricing(order),
          transition: {
            from: order.status,
            to: targetStatus,
            reason: reason ?? null,
            timestamp: order.updatedAt,
            alreadyInState: true,
          },
        };
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
        include: ORDER_INCLUDE,
      });

      // When moving to PAID, ensure Escrow Payment record and ChatRoom are provisioned
      if (targetStatus === 'PAID') {
        const paymentId =
          options?.razorpayOrderId?.trim() || `pay_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
        await tx.payment.upsert({
          where: { orderId },
          update: {
            razorpayOrderId: paymentId,
            escrowStatus: 'HELD',
          },
          create: {
            orderId,
            razorpayOrderId: paymentId,
            amount: updatedOrder.amount,
            platformFee: updatedOrder.platformFee ?? 0,
            escrowStatus: 'HELD',
          },
        });

        // Initialize chat room between client and freelancer if not already created
        const existingRoom = await tx.chatRoom.findUnique({ where: { orderId } });
        if (!existingRoom) {
          await tx.chatRoom.create({
            data: { orderId },
          });
        }
      }

      // When order is COMPLETED, release escrow payment to freelancer
      if (targetStatus === 'COMPLETED') {
        await tx.payment.updateMany({
          where: { orderId },
          data: { escrowStatus: 'RELEASED' },
        });
      }

      // When order is CANCELLED, mark escrow payment as REFUNDED
      if (targetStatus === 'CANCELLED') {
        await tx.payment.updateMany({
          where: { orderId },
          data: { escrowStatus: 'REFUNDED' },
        });
      }

      return {
        order: updatedOrder,
        pricing: formatOrderPricing(updatedOrder),
        transition: {
          from: order.status,
          to: targetStatus,
          reason: reason ?? null,
          timestamp: new Date(),
          alreadyInState: false,
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
  static async markPaid(orderId: string, userId: string, options?: { razorpayOrderId?: string }) {
    return this.transitionStatus(orderId, userId, 'PAID', undefined, options);
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
   * IN_PROGRESS / REVISION -> SUBMITTED
   * Freelancer submits completed deliverables (file URLs and text proof)
   */
  static async submitDeliverable(
    orderId: string,
    freelancerId: string,
    input: { fileUrls: string[]; textProof?: string },
  ) {
    return prisma.$transaction(async (tx) => {
      // Transition order status
      const transitionResult = await this.transitionStatus(orderId, freelancerId, 'SUBMITTED');

      // Count existing deliverables to determine current revision cycle count
      const existingCount = await tx.deliverable.count({
        where: { orderId },
      });

      // Persist the deliverable submission
      const deliverable = await tx.deliverable.create({
        data: {
          orderId,
          fileUrls: input.fileUrls,
          textProof: input.textProof ?? null,
          revisionCount: existingCount,
        },
      });

      // Refetch full order with latest deliverables
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: ORDER_INCLUDE,
      });

      return {
        order: order!,
        deliverable,
        pricing: transitionResult.pricing,
        transition: transitionResult.transition,
      };
    });
  }

  /**
   * SUBMITTED -> REVISION
   * Client requests changes on submitted deliverables
   */
  static async requestRevision(orderId: string, clientId: string, reason: string) {
    return this.transitionStatus(orderId, clientId, 'REVISION', reason);
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

  /**
   * IN_PROGRESS / SUBMITTED / REVISION -> DISPUTED
   * Client or Freelancer escalates the order to dispute
   */
  static async disputeOrder(orderId: string, userId: string, reason: string) {
    return this.transitionStatus(orderId, userId, 'DISPUTED', reason);
  }

  /**
   * Calculates revenue splitting and virtual wallet balances for a freelancer:
   * - Platform cut (10% of subtotal)
   * - Released earnings (virtual wallet balance in paise & INR)
   * - In-escrow funds (pending orders)
   * - Completed order breakdown
   */
  static async getFreelancerEarnings(freelancerId: string) {
    const orders = await prisma.order.findMany({
      where: { freelancerId },
      include: {
        gig: { select: { id: true, title: true, category: true } },
        client: { select: { id: true, name: true, image: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let walletBalancePaise = 0;
    let totalGrossPaise = 0;
    let totalPlatformFeePaise = 0;
    let pendingEscrowPaise = 0;

    const settlementHistory: Array<{
      orderId: string;
      gigTitle: string;
      clientName: string;
      completedAt: Date;
      grossPaise: number;
      platformFeePaise: number;
      netPayoutPaise: number;
      status: string;
      escrowStatus: string;
    }> = [];

    for (const order of orders) {
      const netPayout = order.subtotal ?? (order.amount - (order.platformFee ?? 0));
      if (order.status === 'COMPLETED') {
        walletBalancePaise += netPayout;
        totalGrossPaise += order.amount;
        totalPlatformFeePaise += order.platformFee ?? 0;
        settlementHistory.push({
          orderId: order.id,
          gigTitle: order.gig?.title ?? 'Gig',
          clientName: order.client?.name ?? 'Client',
          completedAt: order.updatedAt,
          grossPaise: order.amount,
          platformFeePaise: order.platformFee ?? 0,
          netPayoutPaise: netPayout,
          status: order.status,
          escrowStatus: order.payment?.escrowStatus ?? 'RELEASED',
        });
      } else if (['PAID', 'IN_PROGRESS', 'SUBMITTED', 'REVISION'].includes(order.status)) {
        pendingEscrowPaise += netPayout;
      }
    }

    return {
      currency: 'INR',
      summary: {
        walletBalancePaise,
        walletBalanceInr: walletBalancePaise / 100,
        pendingEscrowPaise,
        pendingEscrowInr: pendingEscrowPaise / 100,
        totalGrossPaise,
        totalGrossInr: totalGrossPaise / 100,
        totalPlatformFeePaise,
        totalPlatformFeeInr: totalPlatformFeePaise / 100,
        completedOrdersCount: settlementHistory.length,
      },
      settlementHistory,
    };
  }
}

