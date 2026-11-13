import React from 'react';
import { CreditCard, CheckCircle2, CheckCircle, Lock, ShieldCheck } from 'lucide-react';

interface PaymentActionCardProps {
  totalFormatted: string;
  isProcessing: boolean;
  onInitiateOrder: () => void;
}

export const PaymentActionCard: React.FC<PaymentActionCardProps> = ({
  totalFormatted,
  isProcessing,
  onInitiateOrder,
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
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2c3437]">UPI / Cards / NetBanking</p>
              <p className="text-[10px] text-[#596064]">Protected Escrow Checkout</p>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-[#4a4bd7]" />
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
              <Lock className="w-4 h-4" />
              <span>Confirm & Pay {totalFormatted}</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-[#596064]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4a4bd7]" />
          256-bit SSL
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-[#4a4bd7]" />
          Idempotent Safety
        </span>
        <span>•</span>
        <span>Zero Hidden Fees</span>
      </div>
    </div>
  );
};
