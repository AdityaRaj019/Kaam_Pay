import React from 'react';
import type { OrderItem } from '@/types/order';

interface OrderTimelineProps {
  status: OrderItem['status'];
}

const STEPS: { key: OrderItem['status']; label: string; icon: string }[] = [
  { key: 'PAID', label: 'Paid in Escrow', icon: 'account_balance_wallet' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: 'engineering' },
  { key: 'SUBMITTED', label: 'Delivered', icon: 'task' },
  { key: 'COMPLETED', label: 'Completed', icon: 'verified' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const getStepIndex = (st: OrderItem['status']) => {
    switch (st) {
      case 'PENDING':
      case 'PAYMENT_PENDING':
        return -1;
      case 'PAID':
        return 0;
      case 'IN_PROGRESS':
        return 1;
      case 'SUBMITTED':
      case 'REVISION':
        return 2;
      case 'COMPLETED':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);
  const isCancelled = status === 'CANCELLED';
  const isDisputed = status === 'DISPUTED';
  const isRevision = status === 'REVISION';

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#dce4e8]/80 shadow-[0_15px_35px_-15px_rgba(44,52,55,0.06)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-headline font-bold text-[#2c3437]">
            Order Lifecycle
          </h2>
          <p className="text-xs text-[#596064]">Live Escrow & Milestone Tracking</p>
        </div>

        {isCancelled ? (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">cancel</span>
            Order Cancelled
          </span>
        ) : isDisputed ? (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Disputed
          </span>
        ) : isRevision ? (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Revision Requested
          </span>
        ) : (
          <span className="px-3 py-1 bg-[#4a4bd7]/10 text-[#4a4bd7] text-xs font-bold rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Escrow Protected
          </span>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="relative flex items-center justify-between">
        {/* Background connector line */}
        <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-[#eaeff2] z-0" />
        {/* Active connector line */}
        <div
          className="absolute left-6 top-5 -translate-y-1/2 h-1 bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] transition-all duration-700 z-0"
          style={{
            width: `${Math.max(0, Math.min(100, (currentIndex / (STEPS.length - 1)) * 100))}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const isDone = currentIndex > idx || status === 'COMPLETED';
          const isCurrent = currentIndex === idx && status !== 'COMPLETED';

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? 'bg-[#4a4bd7] text-white shadow-md shadow-[#4a4bd7]/25'
                    : isCurrent
                      ? 'bg-gradient-to-tr from-[#4a4bd7] to-[#7073ff] text-white ring-4 ring-[#4a4bd7]/20 scale-110 shadow-lg'
                      : 'bg-white border-2 border-[#dce4e8] text-[#596064]'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {isDone ? 'check' : step.icon}
                </span>
              </div>
              <span
                className={`text-xs mt-2 font-medium text-center ${
                  isCurrent
                    ? 'font-bold text-[#4a4bd7]'
                    : isDone
                      ? 'text-[#2c3437]'
                      : 'text-[#596064]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
