'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to load orders.';
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

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800';
      case 'SUBMITTED':
        return 'bg-purple-100 text-purple-800';
      case 'REVISION':
        return 'bg-pink-100 text-pink-800';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED':
      case 'PAYMENT_FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col text-[#2c3437]">
      <AppNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
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
          <div className="flex items-center gap-1.5 p-1 bg-[#eaeff2] rounded-2xl self-start sm:self-auto text-xs font-semibold">
            {(['all', 'client', 'freelancer'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-all ${
                  roleFilter === r
                    ? 'bg-white text-[#4a4bd7] shadow-sm'
                    : 'text-[#596064] hover:text-[#2c3437]'
                }`}
              >
                {r === 'all' ? 'All Roles' : r === 'client' ? 'Bought by Me' : 'Sold by Me'}
              </button>
            ))}
          </div>
        </div>

        {/* Virtual Skill Wallet & Settlement Summary (shown for Freelancers) */}
        {earnings && (roleFilter === 'freelancer' || (session?.user as SessionUser | undefined)?.role === 'FREELANCER') && (
          <div className="bg-gradient-to-br from-[#2c3437] to-[#1f2528] rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400" style={{ fontSize: '24px' }}>
                  account_balance_wallet
                </span>
                <div>
                  <h2 className="font-headline font-bold text-sm sm:text-base">
                    Freelancer Virtual Skill Wallet
                  </h2>
                  <p className="text-xs text-white/60">
                    Auto-settled earnings & escrow reserve (10% platform fee applied)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full self-start sm:self-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Settlement
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                  Available Wallet
                </span>
                <span className="text-xl sm:text-2xl font-black text-green-400 mt-1 block">
                  ₹{earnings.walletBalanceInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-white/40">Released from Escrow</span>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                  Held in Escrow
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-300 mt-1 block">
                  ₹{earnings.pendingEscrowInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-white/40">Active Project Funds</span>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                  Platform Cut (10%)
                </span>
                <span className="text-xl sm:text-2xl font-black text-white/80 mt-1 block">
                  ₹{earnings.totalPlatformFeeInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-white/40">Commission Retained</span>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                  Settled Orders
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#7073ff] mt-1 block">
                  {earnings.completedOrdersCount}
                </span>
                <span className="text-[10px] text-white/40">Completed Milestones</span>
              </div>
            </div>
          </div>
        )}


        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-[#dce4e8]/80 pb-1 text-sm font-semibold">
          {[
            { key: 'active', label: 'Active Projects' },
            { key: 'completed', label: 'Completed' },
            { key: 'all', label: 'All History' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-xl transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#4a4bd7]/10 text-[#4a4bd7]'
                  : 'text-[#596064] hover:text-[#2c3437]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Order Cards List */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-3 border-[#4a4bd7]/20 border-t-[#4a4bd7] rounded-full animate-spin" />
            <p className="text-xs font-semibold text-[#596064]">Loading your orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map(({ order, pricing }) => {
              const isBuyer = session?.user?.id === order.clientId;
              const thumbnail = order.gig?.images?.[0];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8]/80 shadow-[0_10px_25px_-10px_rgba(44,52,55,0.06)] hover:border-[#4a4bd7]/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={order.gig?.title ?? 'Gig'}
                        className="w-16 h-16 rounded-2xl object-cover ring-1 ring-black/5 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4a4bd7] to-[#842cd3] flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {order.gig?.title?.charAt(0) ?? 'G'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(
                            order.status,
                          )}`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-[#596064]">
                          {isBuyer ? 'Seller: ' : 'Buyer: '}
                          <span className="font-semibold text-[#2c3437]">
                            {isBuyer ? order.freelancer?.name : 'Client'}
                          </span>
                        </span>
                      </div>

                      <h3 className="font-headline font-bold text-sm sm:text-base text-[#2c3437] mt-1.5 truncate">
                        {order.gig?.title}
                      </h3>

                      <div className="flex items-center gap-4 mt-2 text-xs text-[#596064]">
                        <span>Quantity: {order.quantity}</span>
                        <span>•</span>
                        <span className="font-bold text-[#4a4bd7]">
                          {formatPrice(pricing.total)}
                        </span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white text-xs font-bold hover:opacity-95 transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        dashboard
                      </span>
                      Workspace
                    </Link>
                    <Link
                      href={`/messages?orderId=${order.id}`}
                      className="p-2.5 rounded-xl bg-[#eaeff2] hover:bg-[#dce4e8] text-[#2c3437] transition-colors"
                      title="Open Chat"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        chat
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-[#dce4e8] p-8 space-y-3">
            <span className="material-symbols-outlined text-[#596064]/40" style={{ fontSize: '48px' }}>
              inventory_2
            </span>
            <h3 className="font-headline font-bold text-base text-[#2c3437]">No orders found</h3>
            <p className="text-xs text-[#596064] max-w-sm mx-auto">
              You do not have any active or past orders matching this filter.
            </p>
            <div className="pt-2">
              <Link
                href="/find-work"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4a4bd7] text-white text-xs font-bold hover:opacity-90 transition-opacity"
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
