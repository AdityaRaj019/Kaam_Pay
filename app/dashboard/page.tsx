'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wallet,
  ShieldCheck,
  Clock,
  Layers,
  Plus,
  Search,
  MessageSquare,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  User,
  Sparkles,
  ExternalLink,
  Briefcase,
  Package,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useSession } from '@/lib/auth/auth-client';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/axios';
import { AppNavbar } from '@/components/AppNavbar';
import { Footer } from '@/components/Footer';
import { formatPrice } from '@/components/find-work/utils';
import type { OrderItem, OrderPricing } from '@/types/order';
import type { Gig } from '@/types/gig';

interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string | null;
  role?: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  createdAt?: string | Date;
}

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

interface FreelancerGig {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  status: string;
  images: string[];
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { setUser } = useAuthStore();

  const userRole = ((session?.user as SessionUser)?.role ?? 'CLIENT');
  const [activeView, setActiveView] = useState<'freelancer' | 'client'>('client');
  const [orders, setOrders] = useState<OrderListEntry[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [myGigs, setMyGigs] = useState<FreelancerGig[]>([]);
  const [marketGigs, setMarketGigs] = useState<Gig[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Sync active view based on user's primary role once loaded
  useEffect(() => {
    if (session?.user) {
      const role = (session.user as SessionUser).role;
      if (role === 'FREELANCER') {
        setActiveView('freelancer');
      } else {
        setActiveView('client');
      }
    }
  }, [session]);

  // Populate Zustand store when session is loaded
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified ?? false,
        image: session.user.image ?? null,
        role: (session.user as SessionUser).role ?? 'CLIENT',
        createdAt: session.user.createdAt
          ? new Date(session.user.createdAt).toISOString()
          : new Date().toISOString(),
      });
    }
  }, [session, setUser]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [isPending, session, router]);

  // Check onboarding for freelancers
  useEffect(() => {
    async function checkOnboarding() {
      if (!session?.user) return;
      const role = (session.user as SessionUser).role ?? 'CLIENT';
      if (role !== 'FREELANCER') return;

      try {
        const response = await api.get('/auth/me');
        const user = response.data?.data?.user;
        if (user && (!user.profile || !user.profile.title)) {
          router.push('/onboarding');
        }
      } catch (err) {
        console.error('Error checking profile onboarding:', err);
      }
    }

    if (session) {
      checkOnboarding();
    }
  }, [session, router]);

  // Fetch live dashboard statistics & data
  const loadDashboardData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [ordersRes, earningsRes, myGigsRes, marketGigsRes] = await Promise.allSettled([
        api.get<{ success: boolean; data: OrderListEntry[] }>('/orders/my-orders'),
        api.get<{ success: boolean; data: { summary: EarningsSummary } }>('/orders/earnings'),
        api.get<{ success: boolean; data: FreelancerGig[] }>('/gigs/my-gigs'),
        api.get<{ success: boolean; data: { gigs: Gig[] } }>('/client/gigs', {
          params: { limit: 4 },
        }),
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.data) {
        setOrders(ordersRes.value.data.data);
      }
      if (earningsRes.status === 'fulfilled' && earningsRes.value.data?.data?.summary) {
        setEarnings(earningsRes.value.data.data.summary);
      }
      if (myGigsRes.status === 'fulfilled' && myGigsRes.value.data?.data) {
        setMyGigs(myGigsRes.value.data.data);
      }
      if (marketGigsRes.status === 'fulfilled' && marketGigsRes.value.data?.data?.gigs) {
        setMarketGigs(marketGigsRes.value.data.data.gigs);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      void loadDashboardData();
    }
  }, [session, loadDashboardData]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-between">
        <div className="h-16 bg-white border-b border-[#dce4e8]" />
        <div className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 animate-pulse space-y-8">
          <div className="h-44 bg-[#dce4e8]/60 rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-3xl border border-[#dce4e8]" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-80 bg-white rounded-3xl border border-[#dce4e8]" />
            <div className="lg:col-span-4 h-80 bg-white rounded-3xl border border-[#dce4e8]" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  // Derived metrics
  const activeOrders = orders.filter(
    ({ order }) => !['COMPLETED', 'CANCELLED', 'PAYMENT_FAILED'].includes(order.status),
  );
  const completedOrders = orders.filter(({ order }) => order.status === 'COMPLETED');

  // Client-specific derived metrics
  const clientOrders = orders.filter(({ order }) => order.clientId === user.id);
  const activeClientOrders = clientOrders.filter(
    ({ order }) => !['COMPLETED', 'CANCELLED', 'PAYMENT_FAILED'].includes(order.status),
  );
  const totalCommittedInr = activeClientOrders.reduce(
    (sum, { pricing }) => sum + pricing.total,
    0,
  );

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
    <div className="min-h-screen bg-[#f7f9fb] font-inter flex flex-col justify-between text-[#2c3437]">
      <div>
        <AppNavbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 space-y-8">
          {/* Top Switcher Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                Overview & Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-[#2c3437] mt-0.5">
                Dashboard
              </h1>
            </div>

            {/* Mode Toggle (Freelancer vs Client View) */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#dce4e8] rounded-2xl shadow-xs self-start sm:self-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveView('freelancer')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'freelancer'
                    ? 'bg-[#4a4bd7] text-white shadow-sm shadow-[#4a4bd7]/25'
                    : 'text-[#596064] hover:text-[#2c3437]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Freelancer Hub</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('client')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeView === 'client'
                    ? 'bg-[#4a4bd7] text-white shadow-sm shadow-[#4a4bd7]/25'
                    : 'text-[#596064] hover:text-[#2c3437]'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Client Hub</span>
              </button>
            </div>
          </div>

          {/* Hero Welcome Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#3b3ecb] via-[#4a4bd7] to-[#7073ff] text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-[#4a4bd7]/15 overflow-hidden">
            {/* Background Decorative Mesh Orb */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activeView === 'freelancer' ? 'Freelancer Account' : 'Client Account'}</span>
                  </span>
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                      <span>Verified Profile</span>
                    </span>
                  ) : null}
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-extrabold tracking-tight leading-tight">
                  {greeting}, {user.name}!
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  {activeView === 'freelancer'
                    ? 'Track your active client deliverables, escrow settlements, and micro-skill performance in real time.'
                    : 'Manage your commissioned projects, protected escrow milestones, and discover top verified talent across India.'}
                </p>
              </div>

              {/* Action Buttons inside Hero */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {activeView === 'freelancer' ? (
                  <>
                    <Link
                      href="/dashboard/create-gig"
                      className="px-5 py-3 rounded-2xl bg-white text-[#4a4bd7] font-bold text-xs sm:text-sm hover:bg-white/95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-black/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Gig</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>Public Profile</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/find-work"
                      className="px-5 py-3 rounded-2xl bg-white text-[#4a4bd7] font-bold text-xs sm:text-sm hover:bg-white/95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-black/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>Browse Marketplace</span>
                    </Link>
                    <Link
                      href="/orders"
                      className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeView === 'freelancer' ? (
              <>
                {/* Metric 1: Available Wallet */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                      Available Wallet
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-headline">
                      ₹
                      {earnings
                        ? earnings.walletBalanceInr.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })
                        : '0.00'}
                    </span>
                    <p className="text-xs text-[#596064] mt-1">Released & ready for payout</p>
                  </div>
                </div>

                {/* Metric 2: Held in Escrow */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                      Held in Escrow
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-headline">
                      ₹
                      {earnings
                        ? earnings.pendingEscrowInr.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })
                        : '0.00'}
                    </span>
                    <p className="text-xs text-[#596064] mt-1">Active project commitments</p>
                  </div>
                </div>

                {/* Metric 3: Active Orders */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                      Active Projects
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-[#4a4bd7]/10 flex items-center justify-center text-[#4a4bd7]">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#4a4bd7] font-headline">
                      {activeOrders.length}
                    </span>
                    <p className="text-xs text-[#596064] mt-1">Ongoing client assignments</p>
                  </div>
                </div>

                {/* Metric 4: Published Gigs */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                      My Active Gigs
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#2c3437] font-headline">
                      {myGigs.length}
                    </span>
                    <p className="text-xs text-[#596064] mt-1">Live micro-skills on market</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Client Metric 1: Active Escrow Orders */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                      Active Orders
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-[#4a4bd7]/10 flex items-center justify-center text-[#4a4bd7]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#4a4bd7] font-headline">
                      {activeClientOrders.length}
                    </span>
                    <p className="text-xs text-[#596064] mt-1">Protected in Escrow</p>
                  </div>
                </div>

                {/* Client Metric 2: Committed Escrow Funds */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                      Escrow Committed
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-headline">
                      {formatPrice(totalCommittedInr)}
                    </span>
                    <p className="text-xs text-[#596064] mt-1">Locked until work approval</p>
                  </div>
                </div>

                {/* Client Metric 3: Completed Orders */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                      Completed Work
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#2c3437] font-headline">
                      {completedOrders.length}
                    </span>
                    <p className="text-xs text-[#596064] mt-1">Delivered milestones</p>
                  </div>
                </div>

                {/* Client Metric 4: Communication Hub */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                      Messages & Chat
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#4a4bd7] font-headline">
                      Live Inquiries
                    </span>
                    <p className="text-xs text-[#596064] mt-1">Direct freelancer chats</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main 2-Column Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Primary Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Section 1: Recent Orders & Project Deliverables */}
              <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-5">
                <div className="flex items-center justify-between border-b border-[#dce4e8] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#4a4bd7]/10 flex items-center justify-center text-[#4a4bd7]">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-base text-[#2c3437]">
                        Recent Project Activity
                      </h3>
                      <p className="text-xs text-[#596064]">
                        Latest milestones and active assignments
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/orders"
                    className="text-xs font-semibold text-[#4a4bd7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {isLoadingData ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="p-4 bg-[#f7f9fb] rounded-2xl border border-[#dce4e8] animate-pulse h-20"
                      />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3.5">
                    {orders.slice(0, 3).map(({ order, pricing }) => {
                      const isBuyer = user.id === order.clientId;
                      const thumbnail = order.gig?.images?.[0];
                      const statusConfig = getStatusConfig(order.status);

                      return (
                        <div
                          key={order.id}
                          className="p-4 sm:p-5 rounded-2xl border border-[#dce4e8] hover:border-[#4a4bd7]/40 bg-[#f7f9fb] hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            {thumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumbnail}
                                alt={order.gig?.title ?? 'Gig'}
                                className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#dce4e8] shrink-0 bg-white"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4a4bd7]/15 to-[#842cd3]/15 flex items-center justify-center text-[#4a4bd7] font-bold text-base shrink-0">
                                {order.gig?.title?.charAt(0) ?? 'P'}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${statusConfig.badge}`}
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

                              <h4 className="font-headline font-bold text-sm text-[#2c3437] mt-1 truncate">
                                {order.gig?.title}
                              </h4>

                              <div className="flex items-center gap-2.5 mt-1 text-xs text-[#596064]">
                                <span className="font-extrabold text-[#4a4bd7]">
                                  {formatPrice(pricing.total)}
                                </span>
                                <span>•</span>
                                <span>
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <Link
                              href={`/orders/${order.id}`}
                              className="px-3.5 py-2 rounded-xl bg-[#4a4bd7] text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Workspace</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center bg-[#f7f9fb] rounded-2xl border border-dashed border-[#dce4e8] p-6 space-y-2.5">
                    <Package className="w-10 h-10 text-[#acb3b7] mx-auto stroke-[1.5]" />
                    <h4 className="font-headline font-bold text-sm text-[#2c3437]">
                      No active orders found
                    </h4>
                    <p className="text-xs text-[#596064] max-w-xs mx-auto">
                      {activeView === 'freelancer'
                        ? 'When clients commission your services, they will appear here.'
                        : 'Explore marketplace gigs to hire talented freelancers across India.'}
                    </p>
                    <div className="pt-1">
                      {activeView === 'freelancer' ? (
                        <Link
                          href="/dashboard/create-gig"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4a4bd7] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Publish a Gig</span>
                        </Link>
                      ) : (
                        <Link
                          href="/find-work"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4a4bd7] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Find Services</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Section 2: Gigs Showcase (Role Dependent) */}
              {activeView === 'freelancer' ? (
                /* Freelancer: My Published Gigs */
                <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-5">
                  <div className="flex items-center justify-between border-b border-[#dce4e8] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-base text-[#2c3437]">
                          My Published Services
                        </h3>
                        <p className="text-xs text-[#596064]">
                          Micro-skill listings active on the marketplace
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/create-gig"
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#4a4bd7]/10 text-[#4a4bd7] hover:bg-[#4a4bd7]/20 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Gig</span>
                    </Link>
                  </div>

                  {isLoadingData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-28 bg-[#f7f9fb] rounded-2xl border border-[#dce4e8] animate-pulse"
                        />
                      ))}
                    </div>
                  ) : myGigs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myGigs.map((gig) => (
                        <div
                          key={gig.id}
                          className="p-4 rounded-2xl border border-[#dce4e8] bg-[#f7f9fb] hover:bg-white hover:border-[#4a4bd7]/40 transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-start gap-3">
                            {gig.images && gig.images.length > 0 ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={gig.images[0]}
                                alt={gig.title}
                                className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#dce4e8] shrink-0 bg-white"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4a4bd7]/15 to-[#842cd3]/15 flex items-center justify-center text-[#4a4bd7] font-bold shrink-0">
                                {gig.category.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active Listing
                              </span>
                              <h4 className="font-headline font-bold text-sm text-[#2c3437] mt-1 truncate">
                                {gig.title}
                              </h4>
                              <p className="text-xs text-[#596064] mt-0.5">
                                {gig.deliveryTime}d delivery · {gig.category}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#dce4e8]/60 text-xs">
                            <span className="font-extrabold text-[#4a4bd7] text-sm">
                              {formatPrice(gig.price)}
                            </span>
                            <Link
                              href={`/checkout/${gig.id}`}
                              className="text-[#596064] hover:text-[#4a4bd7] font-semibold flex items-center gap-1"
                            >
                              <span>View Listing</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-[#f7f9fb] rounded-2xl border border-dashed border-[#dce4e8] p-6 space-y-2">
                      <Briefcase className="w-8 h-8 text-[#acb3b7] mx-auto stroke-[1.5]" />
                      <p className="text-xs font-semibold text-[#2c3437]">
                        You haven&apos;t published any gigs yet.
                      </p>
                      <p className="text-[11px] text-[#596064]">
                        Create your first micro-skill offering to start earning in Escrow.
                      </p>
                      <div className="pt-2">
                        <Link
                          href="/dashboard/create-gig"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4a4bd7] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Publish Your First Gig</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </section>
              ) : (
                /* Client: Recommended Marketplace Services */
                <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-5">
                  <div className="flex items-center justify-between border-b border-[#dce4e8] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#4a4bd7]/10 flex items-center justify-center text-[#4a4bd7]">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-base text-[#2c3437]">
                          Featured Micro-Skills & Services
                        </h3>
                        <p className="text-xs text-[#596064]">
                          Top verified freelancers ready for commission
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/find-work"
                      className="text-xs font-semibold text-[#4a4bd7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore all</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {marketGigs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {marketGigs.slice(0, 4).map((gig) => (
                        <Link
                          key={gig.id}
                          href={`/checkout/${gig.id}`}
                          className="p-4 rounded-2xl border border-[#dce4e8] bg-[#f7f9fb] hover:bg-white hover:border-[#4a4bd7]/40 transition-all flex flex-col justify-between group space-y-3 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            {gig.images && gig.images.length > 0 ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={gig.images[0]}
                                alt={gig.title}
                                className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#dce4e8] shrink-0 bg-white"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4a4bd7]/15 to-[#842cd3]/15 flex items-center justify-center text-[#4a4bd7] font-bold shrink-0">
                                {gig.category.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-semibold text-[#596064] uppercase tracking-wider">
                                {gig.category}
                              </span>
                              <h4 className="font-headline font-bold text-sm text-[#2c3437] group-hover:text-[#4a4bd7] transition-colors truncate">
                                {gig.title}
                              </h4>
                              <p className="text-xs text-[#596064] mt-0.5 font-medium">
                                By {gig.freelancer.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#dce4e8]/60 text-xs">
                            <span className="font-extrabold text-[#4a4bd7] text-sm">
                              {formatPrice(gig.price)}
                            </span>
                            <span className="text-xs font-semibold text-[#596064] group-hover:text-[#4a4bd7] transition-colors flex items-center gap-1">
                              <span>Commission</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-[#f7f9fb] rounded-2xl border border-dashed border-[#dce4e8] p-6 space-y-2">
                      <Search className="w-8 h-8 text-[#acb3b7] mx-auto stroke-[1.5]" />
                      <p className="text-xs font-semibold text-[#2c3437]">
                        Browse through hundreds of micro-skills.
                      </p>
                      <Link
                        href="/find-work"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4a4bd7] text-white text-xs font-bold hover:opacity-90 transition-opacity mt-1"
                      >
                        Explore Marketplace
                      </Link>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Right Supporting Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Action Center */}
              <div className="bg-white rounded-3xl p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-4">
                <h4 className="font-headline font-bold text-sm text-[#2c3437]">
                  Quick Actions & Navigation
                </h4>

                <div className="space-y-2">
                  {activeView === 'freelancer' ? (
                    <>
                      <Link
                        href="/dashboard/create-gig"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-sm shadow-[#4a4bd7]/20 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Plus className="w-4 h-4" />
                          <span>Create New Gig</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f9fb] hover:bg-[#eaeff2] text-[#2c3437] font-semibold text-xs sm:text-sm border border-[#dce4e8] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-[#4a4bd7]" />
                          <span>Orders & Deliverables</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#596064]" />
                      </Link>

                      <Link
                        href="/messages"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f9fb] hover:bg-[#eaeff2] text-[#2c3437] font-semibold text-xs sm:text-sm border border-[#dce4e8] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <MessageSquare className="w-4 h-4 text-[#4a4bd7]" />
                          <span>Client Messages</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#596064]" />
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f9fb] hover:bg-[#eaeff2] text-[#2c3437] font-semibold text-xs sm:text-sm border border-[#dce4e8] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-[#4a4bd7]" />
                          <span>Edit Skills & Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#596064]" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/find-work"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-sm shadow-[#4a4bd7]/20 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Search className="w-4 h-4" />
                          <span>Find Freelancers</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f9fb] hover:bg-[#eaeff2] text-[#2c3437] font-semibold text-xs sm:text-sm border border-[#dce4e8] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-[#4a4bd7]" />
                          <span>My Active Purchases</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#596064]" />
                      </Link>

                      <Link
                        href="/messages"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f9fb] hover:bg-[#eaeff2] text-[#2c3437] font-semibold text-xs sm:text-sm border border-[#dce4e8] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <MessageSquare className="w-4 h-4 text-[#4a4bd7]" />
                          <span>Inquiries & Chats</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#596064]" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* KaamPay Escrow Security Guarantee */}
              <div className="bg-gradient-to-br from-[#4a4bd7]/5 via-white to-white rounded-3xl p-6 border border-[#4a4bd7]/20 shadow-[0_4px_24px_rgba(74,75,215,0.06)] space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#4a4bd7]/10 flex items-center justify-center text-[#4a4bd7]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-[#2c3437]">
                      KaamPay Escrow Safety
                    </h4>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                      Protected Guarantee
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#596064] leading-relaxed">
                  Every order on KaamPay is protected by smart escrow. Client funds remain securely
                  frozen until milestones are approved.
                </p>

                <div className="pt-2 border-t border-[#dce4e8] space-y-2 text-xs text-[#596064]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4a4bd7] shrink-0" />
                    <span>Instant milestone payouts upon approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4a4bd7] shrink-0" />
                    <span>24/7 dispute mediation support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4a4bd7] shrink-0" />
                    <span>Zero hidden fees or surprise charges</span>
                  </div>
                </div>
              </div>

              {/* Account Profile Snapshot */}
              <div className="bg-white rounded-3xl p-6 border border-[#dce4e8] shadow-[0_4px_24px_rgba(44,52,55,0.04)] space-y-4">
                <h4 className="font-headline font-bold text-sm text-[#2c3437]">Account Profile</h4>

                <div className="flex items-center gap-3 pb-3 border-b border-[#dce4e8]">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name ?? 'User'}
                      className="w-11 h-11 rounded-2xl object-cover ring-1 ring-[#dce4e8]"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4a4bd7] to-[#7073ff] text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {user.name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-sm text-[#2c3437] truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#596064] truncate">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-[#596064]">
                  <div className="flex justify-between">
                    <span>Account Role:</span>
                    <span className="font-bold text-[#2c3437] capitalize">{userRole.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span className="font-semibold text-[#2c3437]">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Active Member'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification:</span>
                    <span className="font-bold text-emerald-600">
                      {user.emailVerified ? 'Verified Account' : 'Standard Account'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
