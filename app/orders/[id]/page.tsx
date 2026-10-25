'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/lib/auth/auth-client';
import api from '@/lib/axios';
import { AppNavbar } from '@/components/AppNavbar';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { DeliverablesCard } from '@/components/orders/DeliverablesCard';
import { OrderActionsPanel } from '@/components/orders/OrderActionsPanel';
import { OrderDetailsSummary } from '@/components/orders/OrderDetailsSummary';
import type { OrderItem, OrderPricing, GetOrderResponse } from '@/types/order';
import toast from 'react-hot-toast';

interface OrderWorkspacePageProps {
  params: Promise<{ id: string }>;
}

export default function OrderWorkspacePage({ params }: OrderWorkspacePageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [order, setOrder] = useState<OrderItem | null>(null);
  const [pricing, setPricing] = useState<OrderPricing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isSubmittingDeliverable, setIsSubmittingDeliverable] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get<GetOrderResponse>(`/orders/${orderId}`);
      setOrder(res.data.data.order);
      setPricing(res.data.data.pricing);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to load order details.';
      toast.error(msg);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.push(`/login?redirect=/orders/${orderId}`);
      return;
    }

    if (orderId && session?.user) {
      fetchOrder();
    }
  }, [orderId, session, sessionLoading, router, fetchOrder]);

  const isClient = session?.user?.id === order?.clientId;
  const isFreelancer = session?.user?.id === order?.freelancerId;

  // Action: Freelancer begins work
  const handleStartProgress = async () => {
    try {
      setIsActionLoading(true);
      await api.post(`/orders/${orderId}/start`);
      toast.success('Work marked as In Progress!');
      await fetchOrder();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to update order status.';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Action: Freelancer submits deliverable
  const handleSubmitDeliverable = async (data: { fileUrls: string[]; textProof?: string }) => {
    try {
      setIsSubmittingDeliverable(true);
      await api.post(`/orders/${orderId}/deliver`, data);
      toast.success('Deliverables submitted for client approval!');
      await fetchOrder();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to submit deliverables.';
      toast.error(msg);
    } finally {
      setIsSubmittingDeliverable(false);
    }
  };

  // Action: Client requests revision
  const handleRequestRevision = async (reason: string) => {
    try {
      setIsActionLoading(true);
      await api.post(`/orders/${orderId}/revision`, { reason });
      toast.success('Revision request sent to the freelancer.');
      await fetchOrder();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to request revision.';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Action: Client approves order & releases escrow
  const handleApproveOrder = async () => {
    try {
      setIsActionLoading(true);
      await api.post(`/orders/${orderId}/complete`);
      toast.success('Order completed and escrow released to freelancer!');
      await fetchOrder();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to complete order.';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Action: Client cancels pending order
  const handleCancelOrder = async (reason?: string) => {
    try {
      setIsActionLoading(true);
      await api.post(`/orders/${orderId}/cancel`, { reason });
      toast.success('Order cancelled.');
      await fetchOrder();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to cancel order.';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Action: Client or Freelancer escalates order to dispute
  const handleDisputeOrder = async (reason: string) => {
    try {
      setIsActionLoading(true);
      await api.post(`/orders/${orderId}/dispute`, { reason });
      toast.success('Dispute raised. Platform mediation requested.');
      await fetchOrder();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to dispute order.';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };


  if (sessionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-10 h-10 border-4 border-[#4a4bd7]/20 border-t-[#4a4bd7] rounded-full animate-spin" />
            <p className="text-sm font-semibold text-[#596064]">Loading Order Workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order || !pricing) return null;

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col text-[#2c3437]">
      <AppNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Workspace Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#596064] mb-1">
              <Link href="/orders" className="hover:text-[#4a4bd7] transition-colors">
                My Orders
              </Link>
              <span>/</span>
              <span className="text-[#2c3437]">Workspace #{order.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-[#2c3437]">
              Order Workspace
            </h1>
          </div>

          {/* Quick Chat Link */}
          <Link
            href={`/messages?orderId=${order.id}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#eaeff2] hover:bg-[#dce4e8] text-[#2c3437] font-bold text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '20px' }}>
              forum
            </span>
            Chat with {isClient ? order.freelancer?.name : 'Client'}
          </Link>
        </div>

        {/* Milestone Lifecycle Stepper */}
        <OrderTimeline status={order.status} />

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Deliverables history & submission widget */}
          <div className="lg:col-span-8 space-y-8">
            <DeliverablesCard
              deliverables={order.deliverables}
              isFreelancer={isFreelancer}
              orderStatus={order.status}
              isSubmitting={isSubmittingDeliverable}
              onSubmit={handleSubmitDeliverable}
            />
          </div>

          {/* Right Column: Order summary and Actions Panel */}
          <div className="lg:col-span-4 space-y-6">
            <OrderActionsPanel
              order={order}
              isClient={isClient}
              isFreelancer={isFreelancer}
              isActionLoading={isActionLoading}
              onStartProgress={handleStartProgress}
              onApproveOrder={handleApproveOrder}
              onRequestRevision={handleRequestRevision}
              onCancelOrder={handleCancelOrder}
              onDisputeOrder={handleDisputeOrder}
            />

            <OrderDetailsSummary order={order} pricing={pricing} />
          </div>
        </div>
      </main>
    </div>
  );
}
