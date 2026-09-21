import prisma from '../../config/prisma';
import { AppError, ErrorCode } from '../../error/AppError';
import type { CreateOrderInput } from './order.validation';

/**
 * Platform fee percentage applied to every order.
 * Stored as a constant here — can be moved to a config table
 * or environment variable when dynamic fee tiers are introduced.
 */
const PLATFORM_FEE_PERCENT = 10;

export class OrderService {
  /**
   * Initiates a new order for the authenticated client.
   *
   * Flow (server-authoritative):
   *   1. Fetch gig from DB (single source of truth for pricing)
   *   2. Validate the gig is purchasable (ACTIVE, not owned by client)
   *   3. Calculate subtotal, platform fee, and total from DB price
   *   4. Create an Order record in PENDING status
   *   5. Return the order with its pricing breakdown
   */
  static async initiateOrder(clientId: string, input: CreateOrderInput) {
    // ── Step 1: Fetch gig ─────────────────────────────────────
    const gig = await prisma.gig.findUnique({
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

    // ── Step 2: Validate purchasability ───────────────────────
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

    // ── Step 4: Create Order in PENDING status ────────────────
    const order = await prisma.order.create({
      data: {
        clientId,
        freelancerId: gig.freelancerId,
        gigId: gig.id,
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
  }
}
