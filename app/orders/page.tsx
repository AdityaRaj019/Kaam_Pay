'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet, LayoutDashboard, MessageSquare, Package } from 'lucide-react';
import { useSession } from '@/lib/auth/auth-client';
import api from '@/lib/axios';
import { AppNavbar } from '@/components/AppNavbar';
import { formatPrice } from '@/components/find-work/utils';
import type { OrderItem, OrderPricing } from '@/types/order';
import toast from 'react-hot-toast';

interface OrderListEntry {
  order: OrderItem;
  pricing: OrderPricing;
}

interface EarningsSummary {
  walletBalancePaise: number;
  walletBalanceInr: number;
  pendingEscrowPaise: number;
  pendingEscrowInr: number;
  totalGrossPaise: number;
  totalGrossInr: number;
  totalPlatformFeePaise: number;
  totalPlatformFeeInr: number;
  completedOrdersCount: number;
}

interface SessionUser {
  id?: string;
  role?: 'CLIENT' | 'FREELANCER' | 'ADMIN';
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [orders, setOrders] = useState<OrderListEntry[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'freelancer'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get<{ success: boolean; data: OrderListEntry[] }>('/orders/my-orders');
      setOrders(res.data.data || []);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Failed to load orders.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEarnings = useCallback(async () => {
    try {
      const res = await api.get<{
        success: boolean;
        data: { summary: EarningsSummary };
      }>('/orders/earnings');
      if (res.data.data?.summary) {
        setEarnings(res.data.data.summary);
      }
    } catch {
      // Ignore if not a seller
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.push('/login?redirect=/orders');
      return;
    }

    if (session?.user) {
      fetchOrders();
      fetchEarnings();
    }
  }, [session, sessionLoading, router, fetchOrders, fetchEarnings]);

  const filteredOrders = orders.filter(({ order }) => {
    // Tab filter
    if (activeTab === 'active') {
      if (['COMPLETED', 'CANCELLED', 'PAYMENT_FAILED'].includes(order.status)) return false;
    } else if (activeTab === 'completed') {
      if (order.status !== 'COMPLETED') return false;
    }

    // Role filter
    if (roleFilter === 'client' && order.clientId !== session?.user?.id) return false;
    if (roleFilter === 'freelancer' && order.freelancerId !== session?.user?.id) return false;

    return true;
  });

  const getStatusConfig = (status: OrderItem['status']) => {
    switch (status) {
      case 'PAID':
        return { label: 'Escrow Funded', badge: 'bg-blue-50 text-blue-700 border-blue-200/80' };
      case 'IN_PROGRESS':
        return { label: 'In Progress', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' };
      case 'SUBMITTED':
        return { label: 'Delivered', badge: 'bg-purple-50 text-purple-700 border-purple-200/80' };
      case 'REVISION':
        return { label: 'Revision', badge: 'bg-pink-50 text-pink-700 border-pink-200/80' };
      case 'COMPLETED':
        return { label: 'Completed', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' };
      case 'CANCELLED':
        return { label: 'Cancelled', badge: 'bg-red-50 text-red-700 border-red-200/80' };
      case 'DISPUTED':
        return { label: 'Disputed', badge: 'bg-amber-50 text-amber-800 border-amber-200/80' };
      case 'PAYMENT_PENDING':
      case 'PENDING':
      default:
        return { label: 'Payment Pending', badge: 'bg-amber-50 text-amber-700 border-amber-200/80' };
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col text-[#2c3437]">
      <AppNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 space-y-6">
        {/* Header & Role Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-[#2c3437]">
              My Orders & Projects
            </h1>
            <p className="text-xs sm:text-sm text-[#596064] mt-1">
              Manage client purchases, deliverables, and assignments in Escrow.
            </p>
          </div>

          {/* Role Filter Toggles */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#dce4e8] rounded-2xl shadow-xs self-start sm:self-auto text-xs font-semibold">
            {(['all', 'client', 'freelancer'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-[#4a4bd7] text-white shadow-sm shadow-[#4a4bd7]/25'
                    : 'text-[#596064] hover:text-[#2c3437]'
                }`}
              >
                {r === 'all' ? 'All Roles' : r === 'client' ? 'Bought by Me' : 'Sold by Me'}
              </button>
            ))}
          </div>
        </div>

        {/* Virtual Skill Wallet & Settlement Summary (shown for Freelancers) */}
        {earnings &&
          (roleFilter === 'freelancer' ||
            (session?.user as SessionUser | undefined)?.role === 'FREELANCER') && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#dce4e8] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#4a4bd7]/10 flex items-center justify-center text-[#4a4bd7] shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-base text-[#2c3437]">
                      Freelancer Earnings & Escrow
                    </h2>
                    <p className="text-xs text-[#596064]">
                      Auto-settled earnings & protected escrow reserve (10% platform fee applied)
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 self-start sm:self-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Settlement
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 bg-emerald-500/[0.06] rounded-2xl border border-emerald-500/15">
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                    Available Wallet
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">
                    ₹
                    {earnings.walletBalanceInr.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-[10px] text-emerald-700/70 font-medium">Released from Escrow</span>
                </div>

                <div className="p-4 bg-amber-500/[0.06] rounded-2xl border border-amber-500/15">
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
                    Held in Escrow
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-700 mt-1 block">
                    ₹
                    {earnings.pendingEscrowInr.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-[10px] text-amber-700/70 font-medium">Active Project Funds</span>
                </div>

                <div className="p-4 bg-[#f7f9fb] rounded-2xl border border-[#dce4e8]">
                  <span className="text-[11px] font-semibold text-[#596064] uppercase tracking-wider block">
                    Platform Cut (10%)
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#2c3437] mt-1 block">
                    ₹
                    {earnings.totalPlatformFeeInr.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-[10px] text-[#596064]">Commission Retained</span>
                </div>

                <div className="p-4 bg-[#4a4bd7]/[0.05] rounded-2xl border border-[#4a4bd7]/15">
                  <span className="text-[11px] font-semibold text-[#4a4bd7] uppercase tracking-wider block">
                    Settled Orders
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#4a4bd7] mt-1 block">
                    {earnings.completedOrdersCount}
                  </span>
                  <span className="text-[10px] text-[#4a4bd7]/70 font-medium">Completed Milestones</span>
                </div>
              </div>
            </div>
          )}

        {/* Tab Selection — consistent with /find-work */}
        <div className="flex items-center gap-6 border-b border-[#dce4e8] pb-0">
          {[
            { key: 'active', label: 'Active Projects' },
            { key: 'completed', label: 'Completed' },
            { key: 'all', label: 'All History' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`font-headline font-bold text-sm sm:text-base relative transition-colors pb-3 cursor-pointer ${
                activeTab === tab.key
                  ? 'text-[#4a4bd7]'
                  : 'text-[#596064]/70 hover:text-[#2c3437]'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-[#4a4bd7] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Order Cards List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-[#dce4e8] animate-pulse flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-[#dce4e8] shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#dce4e8] rounded-full w-24" />
                    <div className="h-5 bg-[#dce4e8] rounded-full w-2/3" />
                    <div className="h-3 bg-[#dce4e8] rounded-full w-1/3" />
                  </div>
                </div>
                <div className="h-10 w-28 bg-[#dce4e8] rounded-2xl shrink-0" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map(({ order, pricing }) => {
              const isBuyer = session?.user?.id === order.clientId;
              const thumbnail = order.gig?.images?.[0];
              const statusConfig = getStatusConfig(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] hover:shadow-lg hover:border-[#4a4bd7]/30 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={order.gig?.title ?? 'Gig'}
                        className="w-16 h-16 rounded-2xl object-cover ring-1 ring-[#dce4e8] shrink-0 bg-white"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4a4bd7]/15 to-[#842cd3]/15 flex items-center justify-center text-[#4a4bd7] font-bold text-xl shrink-0">
                        {order.gig?.title?.charAt(0) ?? 'G'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${statusConfig.badge}`}
                        >
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-[#596064]">
                          {isBuyer ? 'Seller: ' : 'Buyer: '}
                          <span className="font-semibold text-[#2c3437]">
                            {isBuyer ? order.freelancer?.name : 'Client'}
                          </span>
                        </span>
                      </div>

                      <h3 className="font-headline font-bold text-base text-[#2c3437] mt-1 truncate">
                        {order.gig?.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#596064]">
                        <span className="font-extrabold text-[#4a4bd7]">
                          {formatPrice(pricing.total)}
                        </span>
                        <span>•</span>
                        <span>{order.quantity} milestone{order.quantity > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white text-xs font-bold hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm shadow-[#4a4bd7]/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Workspace</span>
                    </Link>
                    <Link
                      href={`/messages?orderId=${order.id}`}
                      className="w-10 h-10 rounded-2xl bg-[#f7f9fb] hover:bg-[#4a4bd7]/10 text-[#596064] hover:text-[#4a4bd7] border border-[#dce4e8] transition-colors flex items-center justify-center cursor-pointer"
                      title="Open Chat"
                      aria-label="Open Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-[#dce4e8] p-8 space-y-3">
            <Package className="w-12 h-12 text-[#596064]/40 mx-auto stroke-[1.5]" />
            <h3 className="font-headline font-bold text-base text-[#2c3437]">No orders found</h3>
            <p className="text-xs text-[#596064] max-w-sm mx-auto">
              You do not have any active or past orders matching this filter.
            </p>
            <div className="pt-2">
              <Link
                href="/find-work"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#4a4bd7] text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
