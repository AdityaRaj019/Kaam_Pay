import React from 'react';

interface PaymentActionCardProps {
  totalFormatted: string;
  isProcessing: boolean;
  onInitiateOrder: () => void;
  idempotencyKey?: string;
}

export const PaymentActionCard: React.FC<PaymentActionCardProps> = ({
  totalFormatted,
  isProcessing,
  onInitiateOrder,
  idempotencyKey,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dce4e8] shadow-[0_30px_60px_-15px_rgba(74,75,215,0.12)] space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
          Payment Method
        </span>
        <div className="flex items-center justify-between p-3.5 bg-[#f7f9fb] rounded-2xl border border-[#dce4e8]/80 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#dce4e8] flex items-center justify-center text-[#4a4bd7]">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                credit_card
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#2c3437]">UPI / Cards / NetBanking</p>
              <p className="text-[10px] text-[#596064]">Protected Escrow Checkout</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '20px' }}>
            check_circle
          </span>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onInitiateOrder}
          disabled={isProcessing}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-[#4a4bd7]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Securing Order & Price...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                lock
              </span>
              <span>Confirm & Pay {totalFormatted}</span>
            </>
          )}
        </button>
      </div>

      {idempotencyKey && (
        <div className="text-[10px] text-[#596064]/70 text-center font-mono truncate px-2">
          Idempotency ref: {idempotencyKey}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-[#596064]">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '14px' }}>
            verified_user
          </span>
          256-bit SSL
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '14px' }}>
            safety_check
          </span>
          Idempotent Safety
        </span>
        <span>•</span>
        <span>Zero Hidden Fees</span>
      </div>
    </div>
  );
};
