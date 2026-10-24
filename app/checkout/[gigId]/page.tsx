'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/auth-client';
import api from '@/lib/axios';
import { AppNavbar } from '@/components/AppNavbar';
import { OrderSummaryCard } from '@/components/checkout/OrderSummaryCard';
import { FreelancerCard } from '@/components/checkout/FreelancerCard';
import { EscrowBadge } from '@/components/checkout/EscrowBadge';
import { PaymentActionCard } from '@/components/checkout/PaymentActionCard';
import { formatPrice } from '@/components/find-work/utils';
import type { GigDetail, GigDetailResponse } from '@/types/gig';
import type { InitiateOrderResponse } from '@/types/order';
import toast from 'react-hot-toast';

interface CheckoutPageProps {
  params: Promise<{ gigId: string }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const resolvedParams = use(params);
  const gigId = resolvedParams.gigId;
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [gig, setGig] = useState<GigDetail | null>(null);
  const [loadingGig, setLoadingGig] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Client-side generated idempotency key per checkout attempt
  // Ensures repeated clicks or retries do not generate multiple duplicate orders in DB
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  useEffect(() => {
    // Generate unique UUID-like key once per gig and quantity session
    const key = `order_checkout_${gigId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setIdempotencyKey(key);
  }, [gigId]);

  // Fetch gig details
  useEffect(() => {
    let isMounted = true;
    async function loadGig() {
      try {
        setLoadingGig(true);
        const res = await api.get<GigDetailResponse>(`/client/gigs/${gigId}`);
        if (isMounted) {
          setGig(res.data.data);
        }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
            ?.error?.message || 'Failed to load gig details.';
        toast.error(msg);
        router.push('/find-work');
      } finally {
        if (isMounted) {
          setLoadingGig(false);
        }
      }
    }

    if (gigId) {
      loadGig();
    }

    return () => {
      isMounted = false;
    };
  }, [gigId, router]);

  // Auth gate
  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      toast.error('Please sign in to proceed with checkout.');
      router.push(`/login?redirect=/checkout/${gigId}`);
    }
  }, [session, sessionLoading, gigId, router]);

  // Prevent ordering own gig
  useEffect(() => {
    if (session?.user && gig && session.user.id === gig.freelancer.id) {
      toast.error('You cannot order your own gig.');
      router.push('/find-work');
    }
  }, [session, gig, router]);

  const handleOrderInitiation = useCallback(async () => {
    if (!gig) return;

    if (!session?.user) {
      toast.error('Please sign in to order.');
      router.push(`/login?redirect=/checkout/${gigId}`);
      return;
    }

    try {
      setIsProcessing(true);

      // ── Step 1: Send server-authoritative & idempotent order creation ──
      const res = await api.post<InitiateOrderResponse>(
        '/orders',
        {
          gigId: gig.id,
          quantity,
          idempotencyKey,
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        },
      );

      const createdOrder = res.data?.data?.order;
      const isExisting = res.data?.data?.isExisting;

      if (!createdOrder?.id) {
        throw new Error('Order creation failed to return order identifier.');
      }

      // ── Step 2: Transition order to PAYMENT_PENDING ──
      await api.post(`/orders/${createdOrder.id}/payment-pending`);

      // ── Step 3: Complete Mock Escrow Payment (PAID status) ──
      // Transitions order to PAID, locks payment in HELD escrow, and initializes ChatRoom
      await api.post(`/orders/${createdOrder.id}/pay`);

      toast.success(
        isExisting
          ? 'Existing order loaded and payment confirmed!'
          : 'Payment successful! Order is in Escrow.',
      );

      // ── Step 4: Direct to real-time messaging / order workspace ──
      router.push(`/messages?orderId=${createdOrder.id}`);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Failed to complete checkout. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  }, [gig, session, quantity, idempotencyKey, gigId, router]);

  if (sessionLoading || loadingGig) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-10 h-10 border-4 border-[#4a4bd7]/20 border-t-[#4a4bd7] rounded-full animate-spin" />
            <p className="text-sm font-semibold text-[#596064]">Loading Checkout Summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gig) return null;

  const totalPaise = Math.round(gig.price * quantity * 1.1);
  const totalFormatted = formatPrice(totalPaise);

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col text-[#2c3437]">
      <AppNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-[#596064]">
          <button
            onClick={() => router.push('/find-work')}
            className="hover:text-[#4a4bd7] flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_back
            </span>
            Marketplace
          </button>
          <span>/</span>
          <span className="text-[#2c3437] font-semibold">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Summary and Freelancer Details */}
          <div className="lg:col-span-7 space-y-6">
            <OrderSummaryCard
              gig={gig}
              quantity={quantity}
              onQuantityChange={(q) => {
                setQuantity(q);
                // Update idempotency key when booking parameters change
                setIdempotencyKey(
                  `order_checkout_${gigId}_${q}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                );
              }}
              disabled={isProcessing}
            />

            <FreelancerCard freelancer={gig.freelancer} />
          </div>

          {/* Right Column: Escrow Info & Payment Action */}
          <div className="lg:col-span-5 space-y-6">
            <PaymentActionCard
              totalFormatted={totalFormatted}
              isProcessing={isProcessing}
              onInitiateOrder={handleOrderInitiation}
              idempotencyKey={idempotencyKey}
            />

            <EscrowBadge />
          </div>
        </div>
      </main>
    </div>
  );
}
