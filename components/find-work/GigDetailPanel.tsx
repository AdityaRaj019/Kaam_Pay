'use client';

import type { Gig, GigDetail } from '@/types/gig';
import { BookmarkBtn } from './BookmarkBtn';
import { timeAgo, formatPrice } from './utils';

function DetailPanelSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="kp-card p-8 space-y-4">
        <div className="h-4 bg-[#dce4e8] rounded-full w-24" />
        <div className="h-8 bg-[#dce4e8] rounded-full w-3/4" />
        <div className="h-8 bg-[#dce4e8] rounded-full w-1/2" />
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#dce4e8]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-[#dce4e8] rounded-full w-20" />
              <div className="h-3 bg-[#dce4e8] rounded-full w-16" />
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
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#dce4e8] flex-shrink-0">
        <span className="text-sm font-semibold text-[#596064]">Gig Details</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onExpand}
            title="Open full view"
            className="p-2 rounded-full hover:bg-[#4a4bd7]/10 text-[#596064] hover:text-[#4a4bd7] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              open_in_full
            </span>
          </button>
          <button
            onClick={onClose}
            title="Close panel"
            className="p-2 rounded-full hover:bg-[#dce4e8] text-[#596064] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 kp-scrollbar">
        {loading ? (
          <DetailPanelSkeleton />
        ) : gig ? (
          <>
            <section className="kp-card p-8 shadow-[0_40px_60px_-20px_rgba(44,52,55,0.06)]">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#596064]/70 font-medium">
                      {timeAgo(gig.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 bg-[#4a4bd7]/10 text-[#4a4bd7] font-bold py-0.5 px-3 rounded-full text-xs">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4a4bd7] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4a4bd7]" />
                      </span>
                      Active
                    </span>
                  </div>
                  <h2 className="font-headline font-extrabold text-xl text-[#2c3437] leading-tight">
                    {gig.title}
                  </h2>
                </div>
              </div>

              <p className="text-[#596064] leading-relaxed text-sm mb-8">{gig.description}</p>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#dce4e8]/60">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#4a4bd7]">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      payments
                    </span>
                    <span className="font-bold text-base">{formatPrice(gig.price)}</span>
                  </div>
                  <span className="text-xs text-[#596064]">Fixed Price</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#2c3437]">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      schedule
                    </span>
                    <span className="font-bold text-base">{gig.deliveryTime} Days</span>
                  </div>
                  <span className="text-xs text-[#596064]">Delivery Time</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#2c3437]">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      category
                    </span>
                    <span className="font-bold text-sm leading-tight">{gig.category}</span>
                  </div>
                  <span className="text-xs text-[#596064]">Category</span>
                </div>
              </div>
            </section>

            {gig.images.length > 0 && (
              <section className="kp-card overflow-hidden p-1 relative group shadow-[0_40px_60px_-20px_rgba(44,52,55,0.06)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gig.images[0]}
                  alt={gig.title}
                  className="w-full h-48 object-cover rounded-[14px] transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-1 bg-[#4a4bd7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[14px]" />
              </section>
            )}

            <section className="bg-[#f0f4f7] rounded-2xl p-7 space-y-4">
              <h3 className="font-headline font-bold text-sm text-[#2c3437]">About the Seller</h3>
              <div className="flex items-center gap-4">
                {gig.freelancer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gig.freelancer.image}
                    alt={gig.freelancer.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#4a4bd7]/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4a4bd7] to-[#842cd3] flex items-center justify-center text-white font-bold text-lg">
                    {gig.freelancer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-headline font-bold text-[#2c3437]">{gig.freelancer.name}</p>
                  {gig.freelancer.profile?.title && (
                    <p className="text-sm text-[#596064]">{gig.freelancer.profile.title}</p>
                  )}
                  {gig.freelancer.profile?.hourlyRate && (
                    <p className="text-xs text-[#4a4bd7] font-semibold mt-0.5">
                      {formatPrice(gig.freelancer.profile.hourlyRate)}/hr
                    </p>
                  )}
                </div>
              </div>
              {gig.freelancer.profile?.bio && (
                <p className="text-sm text-[#596064] leading-relaxed">
                  {gig.freelancer.profile.bio}
                </p>
              )}
              {gig.freelancer.profile?.skills && gig.freelancer.profile.skills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
                    Skills
                  </p>
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
                </div>
              )}
            </section>

            <section className="kp-card p-7 space-y-3 shadow-[0_40px_60px_-20px_rgba(44,52,55,0.06)]">
              <button className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#4a4bd7]/25">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  shopping_cart
                </span>
                Order Now · {formatPrice(gig.price)}
              </button>
              <BookmarkBtn gig={gig} saved={isSaved} onToggle={onToggleSave} variant="full" />
              <button className="w-full py-3 px-6 rounded-full bg-[#eaeff2] text-[#2c3437] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#dce4e8] transition-all group">
                <span
                  className="material-symbols-outlined text-[#4a4bd7] group-hover:scale-110 transition-transform"
                  style={{ fontSize: '20px' }}
                >
                  chat_bubble
                </span>
                Contact Seller
              </button>
              <div className="text-center">
                <a className="text-xs text-[#596064] underline underline-offset-4 hover:text-[#a8364b] transition-colors cursor-pointer">
                  Report this gig
                </a>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
