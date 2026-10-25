import React from 'react';
import type { OrderItem, OrderPricing } from '@/types/order';
import { formatPrice } from '@/components/find-work/utils';

interface OrderDetailsSummaryProps {
  order: OrderItem;
  pricing: OrderPricing;
}

export const OrderDetailsSummary: React.FC<OrderDetailsSummaryProps> = ({ order, pricing }) => {
  const thumbnail = order.gig?.images?.[0];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#dce4e8]/80 shadow-[0_15px_35px_-15px_rgba(44,52,55,0.06)] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#dce4e8]/60">
        <h3 className="font-headline font-bold text-base sm:text-lg text-[#2c3437]">
          Order Information
        </h3>
        <span className="font-mono text-xs text-[#596064]">ID: {order.id.slice(0, 10)}...</span>
      </div>

      <div className="flex items-start gap-4">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={order.gig?.title ?? 'Gig Thumbnail'}
            className="w-16 h-16 rounded-2xl object-cover ring-1 ring-black/5 shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4a4bd7] to-[#842cd3] flex items-center justify-center text-white font-bold text-xl shrink-0">
            {order.gig?.title?.charAt(0) ?? 'O'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="font-headline font-bold text-[#2c3437] text-sm sm:text-base leading-snug line-clamp-2">
            {order.gig?.title}
          </h4>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#596064]">
            <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '16px' }}>
              category
            </span>
            <span>{order.gig?.category}</span>
            <span>•</span>
            <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '16px' }}>
              schedule
            </span>
            <span>{order.gig?.deliveryTime} Days Delivery</span>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown Snapshot */}
      <div className="pt-4 border-t border-[#dce4e8]/60 space-y-2.5 text-xs text-[#596064]">
        <div className="flex justify-between">
          <span>Booked Quantity:</span>
          <span className="font-semibold text-[#2c3437]">{order.quantity} milestone(s)</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold text-[#2c3437]">{formatPrice(pricing.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Platform Service Fee ({pricing.platformFeePercent}%):</span>
          <span className="font-semibold text-[#2c3437]">{formatPrice(pricing.platformFee)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-[#dce4e8] text-sm font-bold text-[#2c3437]">
          <span>Total Locked Price:</span>
          <span className="text-base text-[#4a4bd7]">{formatPrice(pricing.total)}</span>
        </div>
      </div>

      {/* Escrow Details */}
      {order.payment && (
        <div className="p-4 bg-[#f0f4f7] rounded-2xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#2c3437]">Escrow Status:</span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                order.payment.escrowStatus === 'RELEASED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.payment.escrowStatus === 'REFUNDED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-indigo-100 text-[#4a4bd7]'
              }`}
            >
              {order.payment.escrowStatus}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#596064]">
            <span>Payment Ref:</span>
            <span className="font-mono text-[10px] truncate max-w-[180px]">
              {order.payment.razorpayOrderId}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
