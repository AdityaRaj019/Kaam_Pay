import crypto from 'crypto';
import prisma from '../../config/prisma';
import razorpay from '../../config/razorpay';
import { AppError, ErrorCode } from '../../error/AppError';
import { OrderService } from '../order/order.service';
import type {
  CreateRazorpayOrderInput,
  VerifyRazorpayPaymentInput,
} from './payment.validation';

export class PaymentService {
  /**
   * Generates a new Razorpay order for an existing KaamPay order in PENDING / PAYMENT_PENDING status.
   *
   * Flow:
   *   1. Look up KaamPay order and verify the requesting user is the client.
   *   2. Validate order status is payable (PENDING or PAYMENT_PENDING).
   *   3. Transition order to PAYMENT_PENDING if currently PENDING.
   *   4. Call Razorpay API: `razorpay.orders.create({ amount, currency: 'INR', receipt: orderId })`.
   *   5. Return the Razorpay order details and public key to the frontend client.
   */
  static async createPaymentOrder(clientId: string, input: CreateRazorpayOrderInput) {
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      include: {
        gig: { select: { title: true } },
        client: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      throw new AppError('Order not found.', 404, ErrorCode.NOT_FOUND);
    }

    if (order.clientId !== clientId) {
      throw new AppError(
        'You are not authorized to make a payment for this order.',
        403,
        ErrorCode.FORBIDDEN,
      );
    }

    if (order.status !== 'PENDING' && order.status !== 'PAYMENT_PENDING') {
      throw new AppError(
        `Order is not in a payable state. Current status: ${order.status}`,
        400,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    // Ensure order transitions to PAYMENT_PENDING
    if (order.status === 'PENDING') {
      await OrderService.markPaymentPending(order.id, clientId);
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const keyId = process.env.RAZORPAY_KEY_ID;

    // Check if real keys are configured
    const isMockEnv = !keyId || !keySecret || keyId === 'rzp_test_your_key_id';

    let razorpayOrder: { id: string; amount: number; currency: string; receipt: string };

    if (!isMockEnv) {
      try {
        const rzpResponse = await razorpay.orders.create({
          amount: Math.round(order.amount), // in paise
          currency: 'INR',
          receipt: order.id,
          notes: {
            kaampayOrderId: order.id,
            gigTitle: order.gig?.title ?? '',
            clientId: order.clientId,
          },
        });

        razorpayOrder = {
          id: rzpResponse.id,
          amount: Number(rzpResponse.amount),
          currency: rzpResponse.currency,
          receipt: rzpResponse.receipt ?? order.id,
        };
      } catch (err: unknown) {
        console.error('[PaymentService] Razorpay order creation failed:', err);
        throw new AppError(
          'Failed to initialize payment with payment gateway. Please try again.',
          502,
          ErrorCode.INTERNAL_ERROR,
        );
      }
    } else {
      // Graceful fallback for local development without live/test keys
      const mockRzpId = `order_${crypto.randomBytes(8).toString('hex')}`;
      razorpayOrder = {
        id: mockRzpId,
        amount: Math.round(order.amount),
        currency: 'INR',
        receipt: order.id,
      };
    }

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      kaampayOrderId: order.id,
      keyId: isMockEnv ? 'rzp_test_mock_key' : keyId,
      customer: {
        name: order.client.name,
        email: order.client.email,
      },
    };
  }

  /**
   * Verifies the cryptographic HMAC SHA-256 signature returned by Razorpay Checkout.
   *
   * Formula:
   *   expectedSignature = HMAC-SHA256(razorpayOrderId + '|' + razorpayPaymentId, keySecret)
   *
   * If valid:
   *   - Transitions KaamPay order status from PAYMENT_PENDING to PAID.
   *   - Persists Razorpay transaction identifiers & platform fee in the Escrow Payment table.
   *   - Proactively provisions the ChatRoom so buyer and seller can immediately collaborate.
   */
  static async verifyPayment(clientId: string, input: VerifyRazorpayPaymentInput) {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError('Order not found.', 404, ErrorCode.NOT_FOUND);
    }

    if (order.clientId !== clientId) {
      throw new AppError('You are not authorized to verify this payment.', 403, ErrorCode.FORBIDDEN);
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isMockEnv = !keySecret || keySecret === 'your_razorpay_key_secret';

    if (!isMockEnv) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        // Record payment failure on signature mismatch
        await OrderService.failPayment(order.id, clientId, 'Invalid payment signature');
        throw new AppError(
          'Payment verification failed: Signature mismatch.',
          400,
          ErrorCode.VALIDATION_ERROR,
        );
      }
    }

    // Transition order to PAID status and persist Payment model with genuine razorpayOrderId
    const transitionResult = await OrderService.markPaid(order.id, clientId, {
      razorpayOrderId,
    });

    return {
      order: transitionResult.order,
      pricing: transitionResult.pricing,
      payment: {
        razorpayOrderId,
        razorpayPaymentId,
        escrowStatus: 'HELD',
      },
    };
  }
}
