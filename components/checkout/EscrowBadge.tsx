import React from 'react';

export const EscrowBadge: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#f0f4f7] to-[#e6ecf1] rounded-3xl p-6 border border-[#dce4e8]/80 shadow-[0_15px_30px_-15px_rgba(44,52,55,0.05)] space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#4a4bd7]/10 flex items-center justify-center text-[#4a4bd7]">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            shield
          </span>
        </div>
        <div>
          <h4 className="font-headline font-bold text-sm text-[#2c3437]">KaamPay Escrow Protection</h4>
          <span className="text-xs text-[#596064]">Funds stay protected until you approve</span>
        </div>
      </div>

      <div className="space-y-2 text-xs text-[#596064]">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-[#4a4bd7] mt-0.5" style={{ fontSize: '16px' }}>
            lock
          </span>
          <span>Payment is held in a protected escrow account after order initiation.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-[#4a4bd7] mt-0.5" style={{ fontSize: '16px' }}>
            task_alt
          </span>
          <span>Funds are only released to the seller after you review and approve work.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-[#4a4bd7] mt-0.5" style={{ fontSize: '16px' }}>
            support_agent
          </span>
          <span>Full refund guarantee if work is not delivered as specified.</span>
        </div>
      </div>
    </div>
  );
};
