'use client';

import type { Gig } from '@/types/gig';
import { BookmarkBtn } from './BookmarkBtn';
import { timeAgo, formatPrice } from './utils';

export function GigCardSkeleton() {
  return (
    <div className="kp-card p-8 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-2 w-2/3">
          <div className="h-3 bg-[#dce4e8] rounded-full w-24" />
          <div className="h-6 bg-[#dce4e8] rounded-full w-full" />
          <div className="h-6 bg-[#dce4e8] rounded-full w-3/4" />
        </div>
        <div className="h-10 w-10 rounded-full bg-[#dce4e8]" />
      </div>
      <div className="flex gap-4 mb-5">
        <div className="h-4 bg-[#dce4e8] rounded-full w-20" />
        <div className="h-4 bg-[#dce4e8] rounded-full w-24" />
        <div className="h-4 bg-[#dce4e8] rounded-full w-20" />
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-[#dce4e8] rounded-full w-full" />
        <div className="h-4 bg-[#dce4e8] rounded-full w-5/6" />
      </div>
    </div>
  );
}

interface GigCardProps {
  gig: Gig;
  isSelected: boolean;
  isSaved: boolean;
  onClick: () => void;
  onToggleSave: (gig: Gig) => void;
}

export function GigCard({ gig, isSelected, isSaved, onClick, onToggleSave }: GigCardProps) {
  return (
    <div
      onClick={onClick}
      className={`kp-card transition-all duration-300 relative group cursor-pointer
        ${
          isSelected
            ? 'border-l-4 border-l-[#4a4bd7] bg-[#4a4bd7]/5 shadow-lg shadow-[#4a4bd7]/10'
            : 'hover:scale-[1.008] hover:shadow-xl'
        }`}
    >
      <div className="w-full text-left p-8 block" aria-label={`View details for ${gig.title}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <span className="text-xs text-[#596064]/70 uppercase tracking-widest font-semibold">
              {timeAgo(gig.createdAt)}
            </span>
            <h3
              className={`font-headline font-bold text-lg mt-1 transition-colors leading-snug
                ${isSelected ? 'text-[#4a4bd7]' : 'text-[#2c3437] group-hover:text-[#4a4bd7]'}`}
            >
              {gig.title}
            </h3>
            <p className="text-xs text-[#596064] mt-1 font-medium">{gig.freelancer.name}</p>
          </div>
          <div className="flex flex-col items-center gap-3 flex-shrink-0 z-10 relative">
            {gig.images.length > 0 ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-[#dce4e8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4a4bd7]/20 to-[#842cd3]/20 flex items-center justify-center">
                <span className="text-[#4a4bd7] font-bold text-lg">
                  {gig.category.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <BookmarkBtn gig={gig} saved={isSaved} onToggle={onToggleSave} variant="compact" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-[#2c3437] font-semibold text-sm">
            <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '18px' }}>
              payments
            </span>
            <span>{formatPrice(gig.price)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#596064] text-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              schedule
            </span>
            <span>{gig.deliveryTime}d delivery</span>
          </div>
          <span className="bg-[#f0dbff] text-[#7614c4] px-3 py-0.5 rounded-full text-xs font-semibold">
            {gig.category}
          </span>
        </div>

        <p className="text-[#596064]/90 text-sm leading-relaxed line-clamp-2">{gig.description}</p>
      </div>

      {isSelected && (
        <div className="absolute right-4 bottom-4 pointer-events-none">
          <span className="material-symbols-outlined text-[#4a4bd7]">chevron_right</span>
        </div>
      )}
    </div>
  );
}
