'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Banknote,
  Clock,
  Tag,
  FileText,
  CheckCircle2,
  ShoppingCart,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useSession } from '@/lib/auth/auth-client';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import type { GigDetail, Gig } from '@/types/gig';
import { BookmarkBtn } from './BookmarkBtn';
import { timeAgo, formatPrice } from './utils';

interface FullModalProps {
  gig: GigDetail;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (gig: Gig) => void;
}

export function FullModal({ gig, isSaved, onClose, onToggleSave }: FullModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isInitiating, setIsInitiating] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

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
        onClose();
        router.push(`/messages?orderId=${orderId}`);
      } else {
        onClose();
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

    onClose();
    router.push(`/checkout/${gig.id}`);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
    >
      <div className="bg-[#f7f9fb] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden relative border border-[#dce4e8]">
        {/* Close Button */}
        <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white transition-all shadow-sm border border-[#dce4e8] flex items-center justify-center text-[#596064] hover:text-[#2c3437] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-0">
          {/* Main Info */}
          <div className="flex-1 p-8 sm:p-10 space-y-8 bg-white">
            <div className="space-y-3 pr-14">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#596064] font-medium">
                  {timeAgo(gig.createdAt)}
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 font-bold py-0.5 px-3 rounded-full text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  Active
                </span>
              </div>
              <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#2c3437] leading-tight">
                {gig.title}
              </h1>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-[#dce4e8]">
              <div>
                <div className="flex items-center gap-2 text-[#4a4bd7] mb-1">
                  <Banknote className="w-5 h-5" />
                  <span className="font-bold text-xl">{formatPrice(gig.price)}</span>
                </div>
                <span className="text-xs text-[#596064]">Fixed Price</span>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#2c3437] mb-1">
                  <Clock className="w-5 h-5 text-[#4a4bd7]" />
                  <span className="font-bold text-xl">{gig.deliveryTime}d</span>
                </div>
                <span className="text-xs text-[#596064]">Delivery Time</span>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#2c3437] mb-1">
                  <Tag className="w-5 h-5 text-[#4a4bd7]" />
                  <span className="font-bold text-base truncate">{gig.category}</span>
                </div>
                <span className="text-xs text-[#596064]">Category</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-headline font-bold text-lg mb-3 flex items-center gap-2 text-[#2c3437]">
                <FileText className="w-5 h-5 text-[#4a4bd7]" />
                About this Gig
              </h2>
              <p className="text-[#596064] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {gig.description}
              </p>
            </div>

            {/* Images */}
            {gig.images && gig.images.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-[#dce4e8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gig.images[0]} alt={gig.title} className="w-full h-72 object-cover" />
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-[#f7f9fb] rounded-2xl p-6 border border-[#dce4e8] space-y-4">
              <h3 className="font-headline font-bold text-base text-[#2c3437]">About the Seller</h3>
              <div className="flex items-center gap-4">
                {gig.freelancer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gig.freelancer.image}
                    alt={gig.freelancer.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#4a4bd7]/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4a4bd7] to-[#842cd3] flex items-center justify-center text-white font-bold text-xl">
                    {gig.freelancer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-headline font-bold text-lg text-[#2c3437]">
                    {gig.freelancer.name}
                  </p>
                  {gig.freelancer.profile?.title && (
                    <p className="text-sm text-[#596064]">{gig.freelancer.profile.title}</p>
                  )}
                </div>
              </div>
              {gig.freelancer.profile?.bio && (
                <p className="text-sm text-[#596064] leading-relaxed">
                  {gig.freelancer.profile.bio}
                </p>
              )}
              {gig.freelancer.profile?.skills && gig.freelancer.profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {gig.freelancer.profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#4a4bd7]/10 text-[#4a4bd7] px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Column */}
          <div className="lg:w-80 bg-[#f7f9fb] p-6 sm:p-8 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-[#dce4e8]">
            <div className="bg-white rounded-2xl p-6 border border-[#dce4e8] space-y-4 shadow-sm">
              <div className="text-center">
                <p className="text-3xl font-headline font-extrabold text-[#2c3437]">
                  {formatPrice(gig.price)}
                </p>
                <p className="text-xs text-[#596064] mt-1">Fixed-Price Escrow Checkout</p>
              </div>
              <button
                type="button"
                onClick={handleOrderNow}
                disabled={isInitiating}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-[#4a4bd7]/25 disabled:opacity-50 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isInitiating ? 'Processing...' : 'Order Now'}</span>
              </button>
              <BookmarkBtn gig={gig} saved={isSaved} onToggle={onToggleSave} variant="full" />
              <button
                type="button"
                onClick={handleContactSeller}
                disabled={isInitiating}
                className="w-full py-3.5 px-6 rounded-2xl border border-[#4a4bd7]/30 text-[#4a4bd7] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#4a4bd7]/5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isInitiating ? 'Opening Chat...' : 'Contact Seller'}</span>
              </button>
              <div className="flex items-center justify-center gap-1.5 text-center text-xs text-[#596064] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#4a4bd7]" />
                <span>Protected by KaamPay Escrow</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#dce4e8] space-y-4 shadow-sm">
              <h4 className="font-headline font-semibold text-sm text-[#2c3437]">
                Package Includes
              </h4>
              <ul className="space-y-3">
                {[
                  `${gig.deliveryTime}-day guaranteed delivery`,
                  '1 revision included',
                  'Source files provided',
                  'KaamPay buyer protection',
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2 text-sm text-[#596064]">
                    <CheckCircle2 className="w-4 h-4 text-[#4a4bd7] flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
