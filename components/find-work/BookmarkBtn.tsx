'use client';

import { useState, useEffect } from 'react';
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
        onClick={handleClick}
        title={saved ? 'Remove from saved' : 'Save gig'}
        className={`flex items-center justify-center w-full gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200
          ${
            saved
              ? 'bg-[#4a4bd7]/10 text-[#4a4bd7] hover:bg-[#4a4bd7]/20'
              : 'bg-[#eaeff2] text-[#596064] hover:bg-[#dce4e8]'
          }`}
      >
        <span
          className="material-symbols-outlined transition-all duration-300"
          style={{
            fontSize: '20px',
            fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0",
            color: saved ? '#4a4bd7' : undefined,
          }}
        >
          bookmark
        </span>
        {saved ? 'Saved' : 'Save Gig'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      title={saved ? 'Remove from saved' : 'Save gig'}
      className={`relative p-2 rounded-full transition-all duration-200 flex-shrink-0
        ${saved ? 'bg-[#4a4bd7]/10 hover:bg-[#4a4bd7]/20' : 'bg-[#eaeff2] hover:bg-[#dce4e8]'}
        ${burst ? 'scale-125' : 'scale-100'}
      `}
    >
      <span
        className="material-symbols-outlined transition-all duration-300"
        style={{
          fontSize: '20px',
          fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0",
          color: saved ? '#4a4bd7' : '#596064',
          display: 'block',
        }}
      >
        bookmark
      </span>
      {burst && <span className="absolute inset-0 rounded-full bg-[#4a4bd7]/20 animate-ping" />}
    </button>
  );
}
