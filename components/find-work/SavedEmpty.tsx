'use client';

export function SavedEmpty() {
  return (
    <div className="kp-card p-16 text-center">
      <span
        className="material-symbols-outlined text-[#acb3b7] mb-4 block"
        style={{ fontSize: '52px' }}
      >
        bookmark
      </span>
      <h3 className="font-headline font-bold text-lg text-[#2c3437] mb-2">No saved gigs yet</h3>
      <p className="text-[#596064] text-sm max-w-xs mx-auto">
        Click the{' '}
        <span className="inline-flex items-center gap-0.5 font-semibold text-[#4a4bd7]">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            bookmark
          </span>{' '}
          Save
        </span>{' '}
        icon on any gig to collect it here.
      </p>
    </div>
  );
}
