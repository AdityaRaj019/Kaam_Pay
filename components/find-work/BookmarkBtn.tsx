'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import type { Gig } from '@/types/gig';

interface BookmarkBtnProps {
  gig: Gig;
  saved: boolean;
  onToggle: (gig: Gig) => void;
  variant?: 'compact' | 'full';
}

export function BookmarkBtn({ gig, saved, onToggle, variant = 'compact' }: BookmarkBtnProps) {
  const [burst, setBurst] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!saved) setBurst(true);
    onToggle(gig);
  };

  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setBurst(false), 600);
    return () => clearTimeout(t);
  }, [burst]);

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={saved ? 'Remove from saved' : 'Save gig'}
        className={`flex items-center justify-center w-full gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer
          ${
            saved
              ? 'bg-[#4a4bd7]/10 text-[#4a4bd7] hover:bg-[#4a4bd7]/20'
              : 'bg-[#eaeff2] text-[#596064] hover:bg-[#dce4e8]'
          }`}
      >
        <Bookmark
          className={`w-4 h-4 transition-all duration-300 ${
            saved ? 'fill-[#4a4bd7] text-[#4a4bd7]' : 'text-[#596064]'
          }`}
        />
        <span>{saved ? 'Saved' : 'Save Gig'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={saved ? 'Remove from saved' : 'Save gig'}
      aria-label={saved ? 'Remove from saved' : 'Save gig'}
      className={`relative w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer
        ${saved ? 'bg-[#4a4bd7]/10 text-[#4a4bd7] hover:bg-[#4a4bd7]/20' : 'bg-[#eaeff2] text-[#596064] hover:bg-[#dce4e8]'}
        ${burst ? 'scale-110' : 'scale-100'}
      `}
    >
      <Bookmark
        className={`w-4 h-4 transition-all duration-300 ${
          saved ? 'fill-[#4a4bd7] text-[#4a4bd7]' : 'text-[#596064]'
        }`}
      />
      {burst && <span className="absolute inset-0 rounded-full bg-[#4a4bd7]/20 animate-ping" />}
    </button>
  );
}
