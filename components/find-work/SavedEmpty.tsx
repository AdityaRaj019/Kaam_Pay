'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';

export function SavedEmpty() {
  return (
    <div className="kp-card p-16 text-center">
      <Bookmark className="w-12 h-12 text-[#acb3b7] mb-4 mx-auto stroke-[1.5]" />
      <h3 className="font-headline font-bold text-lg text-[#2c3437] mb-2">No saved gigs yet</h3>
      <p className="text-[#596064] text-sm max-w-xs mx-auto">
        Click the{' '}
        <span className="inline-flex items-center gap-1 font-semibold text-[#4a4bd7]">
          <Bookmark className="w-3.5 h-3.5 fill-[#4a4bd7] text-[#4a4bd7]" />
          Save
        </span>{' '}
        icon on any gig to collect it here.
      </p>
    </div>
  );
}
