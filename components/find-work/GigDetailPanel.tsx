'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Maximize2,
  X,
  Banknote,
  Clock,
  Tag,
  ShoppingCart,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useSession } from '@/lib/auth/auth-client';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import type { Gig, GigDetail } from '@/types/gig';
import { BookmarkBtn } from './BookmarkBtn';
import { timeAgo, formatPrice } from './utils';

function DetailPanelSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-3xl p-6 border border-[#dce4e8] space-y-4">
        <div className="h-4 bg-[#dce4e8] rounded-full w-24" />
        <div className="h-7 bg-[#dce4e8] rounded-full w-3/4" />
        <div className="h-4 bg-[#dce4e8] rounded-full w-full" />
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#dce4e8]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-[#dce4e8] rounded-full w-16" />
              <div className="h-3 bg-[#dce4e8] rounded-full w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface GigDetailPanelProps {
  gig: GigDetail | null;
  loading: boolean;
  isSaved: boolean;
  onClose: () => void;
  onExpand: () => void;
  onToggleSave: (gig: Gig) => void;
}

export function GigDetailPanel({
  gig,
  loading,
  isSaved,
  onClose,
  onExpand,
  onToggleSave,
}: GigDetailPanelProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isInitiating, setIsInitiating] = useState(false);

  const handleContactSeller = async () => {
    if (!gig) return;

    if (!session?.user) {
      toast.error('Please sign in to contact the freelancer');
      router.push('/login');
      return;
    }

    if (session.user.id === gig.freelancer.id) {
      toast.error('You cannot message yourself on your own gig.');
      return;
    }

    try {
      setIsInitiating(true);
      const res = await api.post('/chat/init', {
        freelancerId: gig.freelancer.id,
        gigId: gig.id,
      });

      const orderId = res.data?.data?.orderId;
      if (orderId) {
        toast.success(`Connecting with ${gig.freelancer.name}`);
        router.push(`/messages?orderId=${orderId}`);
      } else {
        router.push('/messages');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Failed to contact seller';
      toast.error(errorMsg);
    } finally {
      setIsInitiating(false);
    }
  };

  const handleOrderNow = () => {
    if (!gig) return;

    if (!session?.user) {
      toast.error('Please sign in to order this gig');
      router.push(`/login?redirect=/checkout/${gig.id}`);
      return;
    }

    if (session.user.id === gig.freelancer.id) {
      toast.error('You cannot order your own gig.');
      return;
    }

    router.push(`/checkout/${gig.id}`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#dce4e8] bg-white sticky top-0 z-10">
        <span className="text-sm font-bold text-[#2c3437]">Gig Details</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onExpand}
            title="Open full view"
            aria-label="Open full view"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#4a4bd7]/10 text-[#596064] hover:text-[#4a4bd7] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close panel"
            aria-label="Close panel"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#eaeff2] text-[#596064] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 kp-scrollbar">
        {loading ? (
          <DetailPanelSkeleton />
        ) : gig ? (
          <>
            {/* Main Overview */}
            <section className="bg-[#f7f9fb] rounded-2xl p-6 border border-[#dce4e8]/80 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#596064] font-medium">{timeAgo(gig.createdAt)}</span>
                <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 font-bold py-0.5 px-2.5 rounded-full text-xs">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
                  </span>
                  Active
                </span>
              </div>

              <h2 className="font-headline font-extrabold text-xl text-[#2c3437] leading-tight">
                {gig.title}
              </h2>

              <p className="text-[#596064] leading-relaxed text-sm">{gig.description}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#dce4e8]">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[#4a4bd7]">
                    <Banknote className="w-4 h-4" />
                    <span className="font-bold text-base">{formatPrice(gig.price)}</span>
                  </div>
                  <span className="text-[11px] text-[#596064]">Fixed Price</span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[#2c3437]">
                    <Clock className="w-4 h-4 text-[#4a4bd7]" />
                    <span className="font-bold text-base">{gig.deliveryTime} Days</span>
                  </div>
                  <span className="text-[11px] text-[#596064]">Delivery Time</span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[#2c3437]">
                    <Tag className="w-4 h-4 text-[#4a4bd7]" />
                    <span className="font-bold text-sm leading-tight truncate">{gig.category}</span>
                  </div>
                  <span className="text-[11px] text-[#596064]">Category</span>
                </div>
              </div>
            </section>

            {/* Gig Image */}
            {gig.images && gig.images.length > 0 && (
              <section className="rounded-2xl overflow-hidden border border-[#dce4e8] relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gig.images[0]}
                  alt={gig.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </section>
            )}

            {/* About the Seller */}
            <section className="bg-[#f7f9fb] rounded-2xl p-6 border border-[#dce4e8]/80 space-y-4">
              <h3 className="font-headline font-bold text-sm text-[#2c3437]">About the Seller</h3>
              <div className="flex items-center gap-3.5">
                {gig.freelancer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gig.freelancer.image}
                    alt={gig.freelancer.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#4a4bd7]/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4a4bd7] to-[#842cd3] flex items-center justify-center text-white font-bold text-lg">
                    {gig.freelancer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-headline font-bold text-[#2c3437]">{gig.freelancer.name}</p>
                  {gig.freelancer.profile?.title && (
                    <p className="text-xs text-[#596064]">{gig.freelancer.profile.title}</p>
                  )}
                  {gig.freelancer.profile?.hourlyRate && (
                    <p className="text-xs text-[#4a4bd7] font-semibold mt-0.5">
                      {formatPrice(gig.freelancer.profile.hourlyRate)}/hr
                    </p>
                  )}
                </div>
              </div>

              {gig.freelancer.profile?.bio && (
                <p className="text-xs text-[#596064] leading-relaxed">
                  {gig.freelancer.profile.bio}
                </p>
              )}

              {gig.freelancer.profile?.skills && gig.freelancer.profile.skills.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-semibold text-[#596064] uppercase tracking-wider">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {gig.freelancer.profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-[#4a4bd7]/10 text-[#4a4bd7] px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Actions Box */}
            <section className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleOrderNow}
                disabled={isInitiating}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-[#4a4bd7]/20 disabled:opacity-50 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {isInitiating ? 'Processing...' : `Order Now · ${formatPrice(gig.price)}`}
                </span>
              </button>

              <BookmarkBtn gig={gig} saved={isSaved} onToggle={onToggleSave} variant="full" />

              <button
                type="button"
                onClick={handleContactSeller}
                disabled={isInitiating}
                className="w-full py-3 px-6 rounded-2xl bg-[#eaeff2] text-[#2c3437] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#dce4e8] transition-all disabled:opacity-50 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#4a4bd7]" />
                <span>{isInitiating ? 'Opening Chat...' : 'Contact Seller'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#596064] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4a4bd7]" />
                <span>Protected with KaamPay Escrow guarantee</span>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
