import React from 'react';
import type { GigDetail } from '@/types/gig';
import { formatPrice } from '@/components/find-work/utils';

interface OrderSummaryCardProps {
  gig: GigDetail;
  quantity: number;
  onQuantityChange: (q: number) => void;
  disabled?: boolean;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  gig,
  quantity,
  onQuantityChange,
  disabled = false,
}) => {
  const thumbnail = gig.images?.[0];
  const unitPrice = gig.price;
  const subtotal = unitPrice * quantity;
  const platformFee = Math.round(subtotal * 0.1);
  const total = subtotal + platformFee;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#dce4e8]/80 shadow-[0_20px_45px_-15px_rgba(44,52,55,0.08)] flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#dce4e8]/60">
        <h2 className="text-lg font-headline font-bold text-[#2c3437] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '22px' }}>
            receipt_long
          </span>
          Order Summary
        </h2>
        <span className="px-3 py-1 bg-[#4a4bd7]/10 text-[#4a4bd7] rounded-full text-xs font-semibold">
          {gig.category}
        </span>
      </div>

      <div className="flex items-start gap-4">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={gig.title}
            className="w-20 h-20 rounded-2xl object-cover ring-1 ring-black/5 flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4a4bd7] to-[#842cd3] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {gig.title.charAt(0)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-headline font-bold text-[#2c3437] text-base leading-snug line-clamp-2">
            {gig.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#596064]">
            <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '16px' }}>
              schedule
            </span>
            <span>{gig.deliveryTime} Days Delivery</span>
            <span className="text-gray-300">•</span>
            <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '16px' }}>
              sync
            </span>
            <span>1 Revision</span>
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between py-3 px-4 bg-[#f7f9fb] rounded-2xl border border-[#dce4e8]/60">
        <div>
          <span className="text-sm font-semibold text-[#2c3437] block">Booking Quantity</span>
          <span className="text-xs text-[#596064]">Number of milestones or revisions</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={quantity <= 1 || disabled}
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full bg-white border border-[#dce4e8] text-[#2c3437] hover:bg-[#eaeff2] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors shadow-sm"
          >
            -
          </button>
          <span className="w-6 text-center font-bold text-sm text-[#2c3437]">{quantity}</span>
          <button
            type="button"
            disabled={quantity >= 10 || disabled}
            onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
            className="w-8 h-8 rounded-full bg-white border border-[#dce4e8] text-[#2c3437] hover:bg-[#eaeff2] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Price Calculations */}
      <div className="space-y-3 pt-2 text-sm">
        <div className="flex justify-between text-[#596064]">
          <span>Service Price ({quantity}x)</span>
          <span className="font-medium text-[#2c3437]">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-[#596064]">
          <span className="flex items-center gap-1.5">
            Platform Service Fee (10%)
            <span
              className="material-symbols-outlined text-gray-400 cursor-help"
              title="Covers 24/7 dispute mediation, client protection & escrow handling"
              style={{ fontSize: '16px' }}
            >
              info
            </span>
          </span>
          <span className="font-medium text-[#2c3437]">{formatPrice(platformFee)}</span>
        </div>

        <div className="pt-4 border-t border-[#dce4e8] flex justify-between items-baseline">
          <div>
            <span className="text-base font-headline font-bold text-[#2c3437] block">
              Total Payable
            </span>
            <span className="text-xs text-[#596064]">Includes all taxes and escrow handling</span>
          </div>
          <span className="text-2xl font-headline font-extrabold text-[#4a4bd7]">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
};
