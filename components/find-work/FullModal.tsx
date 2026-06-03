'use client';

import { useEffect, useRef } from 'react';
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
  const backdropRef = useRef<HTMLDivElement>(null);

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
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-12 pb-12 px-4 overflow-y-auto"
    >
      <div className="bg-[#f7f9fb] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#eaeff2] hover:bg-[#dce4e8] transition-colors text-[#596064]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              close
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-0">
          <div className="flex-1 p-10 space-y-8">
            <div className="space-y-3 pr-20">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#596064]/70 font-medium">
                  {timeAgo(gig.createdAt)}
                </span>
                <span className="flex items-center gap-1.5 bg-[#4a4bd7]/10 text-[#4a4bd7] font-bold py-1 px-3 rounded-full text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4a4bd7] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4a4bd7]" />
                  </span>
                  Active
                </span>
              </div>
              <h1 className="font-headline font-extrabold text-3xl text-[#2c3437] leading-tight">
                {gig.title}
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-6 py-6 border-y border-[#dce4e8]/60">
              <div>
                <div className="flex items-center gap-2 text-[#4a4bd7] mb-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    payments
                  </span>
                  <span className="font-bold text-xl">{formatPrice(gig.price)}</span>
                </div>
                <span className="text-xs text-[#596064]">Fixed Price</span>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#2c3437] mb-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    schedule
                  </span>
                  <span className="font-bold text-xl">{gig.deliveryTime}d</span>
                </div>
                <span className="text-xs text-[#596064]">Delivery Time</span>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#2c3437] mb-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    category
                  </span>
                  <span className="font-bold text-base">{gig.category}</span>
                </div>
                <span className="text-xs text-[#596064]">Category</span>
              </div>
            </div>

            <div>
              <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#4a4bd7]"
                  style={{ fontSize: '22px' }}
                >
                  description
                </span>
                About this Gig
              </h2>
              <p className="text-[#596064] leading-relaxed whitespace-pre-wrap">
                {gig.description}
              </p>
            </div>

            {gig.images.length > 0 && (
              <div className="rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gig.images[0]} alt={gig.title} className="w-full h-64 object-cover" />
              </div>
            )}

            <div className="bg-[#f0f4f7] rounded-2xl p-6 space-y-4">
              <h3 className="font-headline font-bold text-[#2c3437]">About the Seller</h3>
              <div className="flex items-center gap-4">
                {gig.freelancer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gig.freelancer.image}
                    alt={gig.freelancer.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#4a4bd7]/30"
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
                <div className="flex flex-wrap gap-2">
                  {gig.freelancer.profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#f0dbff] text-[#7614c4] px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-80 bg-[#eaeff2]/60 p-8 flex flex-col gap-5 border-l border-[#dce4e8]/60">
            <div className="kp-card p-6 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-headline font-extrabold text-[#2c3437]">
                  {formatPrice(gig.price)}
                </p>
                <p className="text-xs text-[#596064] mt-1">Fixed-Price Delivery</p>
              </div>
              <button className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-sm hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#4a4bd7]/25">
                Order Now
              </button>
              <BookmarkBtn gig={gig} saved={isSaved} onToggle={onToggleSave} variant="full" />
              <button className="w-full py-3.5 px-6 rounded-full border border-[#4a4bd7]/30 text-[#4a4bd7] font-semibold text-sm hover:bg-[#4a4bd7]/5 transition-all">
                Contact Seller
              </button>
              <p className="text-center text-xs text-[#596064]">
                🔒 Secure payment through KaamPay Escrow
              </p>
            </div>

            <div className="kp-card p-6 space-y-4">
              <h4 className="font-headline font-semibold text-sm text-[#2c3437]">
                Package Includes
              </h4>
              <ul className="space-y-3">
                {[
                  { icon: 'check_circle', text: `${gig.deliveryTime}-day delivery` },
                  { icon: 'check_circle', text: '1 revision included' },
                  { icon: 'check_circle', text: 'Source files provided' },
                  { icon: 'check_circle', text: 'KaamPay buyer protection' },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-sm text-[#596064]">
                    <span
                      className="material-symbols-outlined text-[#4a4bd7]"
                      style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
                    >
                      {icon}
                    </span>
                    {text}
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
