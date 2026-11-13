'use client';

import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import type { Gig } from '@/types/gig';
import { BookmarkBtn } from './BookmarkBtn';
import { timeAgo, formatPrice } from './utils';

export function GigCardSkeleton() {
  return (
    <div className="kp-card p-6 sm:p-7 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-3 bg-[#dce4e8] rounded-full w-20" />
        <div className="h-8 w-8 rounded-full bg-[#dce4e8]" />
      </div>
      <div className="flex gap-4 mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-[#dce4e8] rounded-full w-3/4" />
          <div className="h-3 bg-[#dce4e8] rounded-full w-1/3" />
        </div>
        <div className="h-14 w-14 rounded-2xl bg-[#dce4e8] flex-shrink-0" />
      </div>
      <div className="flex gap-3 mb-3">
        <div className="h-4 bg-[#dce4e8] rounded-full w-16" />
        <div className="h-4 bg-[#dce4e8] rounded-full w-20" />
        <div className="h-4 bg-[#dce4e8] rounded-full w-16" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-[#dce4e8] rounded-full w-full" />
        <div className="h-3 bg-[#dce4e8] rounded-full w-4/5" />
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
      className={`kp-card transition-all duration-300 relative group cursor-pointer p-6 sm:p-7
        ${
          isSelected
            ? 'border-l-4 border-l-[#4a4bd7] bg-[#4a4bd7]/[0.03] shadow-lg shadow-[#4a4bd7]/10 ring-1 ring-[#4a4bd7]/30'
            : 'hover:scale-[1.006] hover:shadow-xl hover:border-[#4a4bd7]/30'
        }`}
    >
      <div className="w-full text-left" aria-label={`View details for ${gig.title}`}>
        {/* Top bar: Time Ago + Bookmark */}
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-semibold text-[#596064] tracking-wide">
            {timeAgo(gig.createdAt)}
          </span>
          <BookmarkBtn gig={gig} saved={isSaved} onToggle={onToggleSave} variant="compact" />
        </div>

        {/* Middle: Title, Freelancer & Thumbnail */}
        <div className="flex items-start justify-between gap-4 mb-3.5">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-headline font-bold text-base sm:text-lg transition-colors leading-snug truncate-2
                ${isSelected ? 'text-[#4a4bd7]' : 'text-[#2c3437] group-hover:text-[#4a4bd7]'}`}
            >
              {gig.title}
            </h3>
            <p className="text-xs text-[#596064] mt-1 font-medium">{gig.freelancer.name}</p>
          </div>

          {gig.images && gig.images.length > 0 ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-[#dce4e8] flex-shrink-0 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4a4bd7]/15 to-[#842cd3]/15 flex items-center justify-center flex-shrink-0">
              <span className="text-[#4a4bd7] font-bold text-lg">
                {gig.category.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Metadata row: Price, Delivery Time, Category Badge */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
          <span className="font-extrabold text-base text-[#4a4bd7]">
            {formatPrice(gig.price)}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-[#596064]">
            <Clock className="w-3.5 h-3.5 text-[#596064]" />
            <span>{gig.deliveryTime}d delivery</span>
          </span>

          <span className="bg-[#4a4bd7]/10 text-[#4a4bd7] px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {gig.category}
          </span>
        </div>

        {/* Description preview */}
        <p className="text-xs sm:text-sm text-[#596064]/90 line-clamp-2 leading-relaxed">
          {gig.description}
        </p>
      </div>

      {/* Selected Indicator Arrow */}
      {isSelected && (
        <div className="absolute right-4 bottom-4 pointer-events-none">
          <ChevronRight className="w-4 h-4 text-[#4a4bd7]" />
        </div>
      )}
    </div>
  );
}
