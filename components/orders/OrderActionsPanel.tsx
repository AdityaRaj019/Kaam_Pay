import React, { useState } from 'react';
import type { OrderItem } from '@/types/order';

interface OrderActionsPanelProps {
  order: OrderItem;
  isClient: boolean;
  isFreelancer: boolean;
  isActionLoading: boolean;
  onStartProgress: () => void;
  onApproveOrder: () => void;
  onRequestRevision: (reason: string) => void;
  onCancelOrder: (reason?: string) => void;
  onDisputeOrder?: (reason: string) => void;
}

export const OrderActionsPanel: React.FC<OrderActionsPanelProps> = ({
  order,
  isClient,
  isFreelancer,
  isActionLoading,
  onStartProgress,
  onApproveOrder,
  onRequestRevision,
  onCancelOrder,
  onDisputeOrder,
}) => {
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const status = order.status;

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionReason.trim()) return;
    onRequestRevision(revisionReason.trim());
    setShowRevisionModal(false);
    setRevisionReason('');
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCancelOrder(cancelReason.trim() || undefined);
    setShowCancelModal(false);
    setCancelReason('');
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim() || !onDisputeOrder) return;
    onDisputeOrder(disputeReason.trim());
    setShowDisputeModal(false);
    setDisputeReason('');
  };


  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dce4e8] shadow-[0_25px_50px_-15px_rgba(44,52,55,0.08)] space-y-5">
      <h3 className="font-headline font-bold text-base text-[#2c3437] flex items-center gap-2">
        <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '20px' }}>
          bolt
        </span>
        Workflow Actions
      </h3>

      {/* Freelancer: Start Work Button */}
      {isFreelancer && status === 'PAID' && (
        <div className="space-y-2">
          <p className="text-xs text-[#596064]">
            Payment is safely held in Escrow. You can now begin work on this assignment.
          </p>
          <button
            type="button"
            onClick={onStartProgress}
            disabled={isActionLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#4a4bd7]/20 disabled:opacity-40"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              play_arrow
            </span>
            {isActionLoading ? 'Starting...' : 'Start Working (Move to In Progress)'}
          </button>
        </div>
      )}

      {/* Client: Review Deliverables Actions */}
      {isClient && (status === 'SUBMITTED' || status === 'IN_PROGRESS') && (
        <div className="space-y-3">
          <p className="text-xs text-[#596064]">
            {status === 'SUBMITTED'
              ? 'Freelancer has submitted deliverables. Inspect the outcomes and approve completion or request changes.'
              : 'Review progress or approve completion when ready.'}
          </p>

          <button
            type="button"
            onClick={onApproveOrder}
            disabled={isActionLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-40"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              verified
            </span>
            {isActionLoading ? 'Releasing Escrow...' : 'Approve & Release Payment'}
          </button>

          {status === 'SUBMITTED' && (
            <button
              type="button"
              onClick={() => setShowRevisionModal(true)}
              disabled={isActionLoading}
              className="w-full py-3 px-6 rounded-2xl bg-[#eaeff2] hover:bg-[#dce4e8] text-[#2c3437] font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                sync
              </span>
              Request Revision
            </button>
          )}
        </div>
      )}

      {/* Client: Cancellation for PENDING / PAYMENT_PENDING */}
      {isClient && (status === 'PENDING' || status === 'PAYMENT_PENDING') && (
        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          disabled={isActionLoading}
          className="w-full py-3 px-6 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            close
          </span>
          Cancel Order
        </button>
      )}

      {/* Dispute Order Button for active in-progress assignments */}
      {['IN_PROGRESS', 'SUBMITTED', 'REVISION'].includes(status) && onDisputeOrder && (
        <button
          type="button"
          onClick={() => setShowDisputeModal(true)}
          disabled={isActionLoading}
          className="w-full py-2.5 px-4 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
            report_problem
          </span>
          Raise Dispute / Need Mediation
        </button>
      )}

      {/* Disputed State Badge */}
      {status === 'DISPUTED' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
          <span className="material-symbols-outlined text-amber-600" style={{ fontSize: '28px' }}>
            balance
          </span>
          <p className="text-sm font-bold text-amber-800">Order Under Dispute Review</p>
          <p className="text-xs text-amber-700">
            Escrow funds remain securely frozen while platform support reviews order deliverables.
          </p>
        </div>
      )}

      {/* Completed State Badge */}
      {status === 'COMPLETED' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
          <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: '28px' }}>
            task_alt
          </span>
          <p className="text-sm font-bold text-emerald-800">Order Completed Successfully</p>
          <p className="text-xs text-emerald-600">
            Escrow payment has been officially released to the freelancer.
          </p>
        </div>
      )}

      {/* Cancelled State Badge */}
      {status === 'CANCELLED' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-1">
          <span className="material-symbols-outlined text-red-600" style={{ fontSize: '28px' }}>
            cancel
          </span>
          <p className="text-sm font-bold text-red-800">Order Cancelled</p>
          <p className="text-xs text-red-600">Any escrow balances have been processed for refund.</p>
        </div>
      )}


      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-headline font-bold text-base text-[#2c3437]">
              Request Order Revision
            </h4>
            <p className="text-xs text-[#596064]">
              Detail the exact changes, corrections, or missing requirements for the freelancer.
            </p>
            <form onSubmit={handleRevisionSubmit} className="space-y-4">
              <textarea
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                rows={4}
                required
                placeholder="Specify what needs adjustments..."
                className="w-full p-3 text-xs rounded-xl border border-[#dce4e8] focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/30"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#eaeff2] text-[#2c3437]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!revisionReason.trim()}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#4a4bd7] text-white hover:opacity-90 disabled:opacity-40"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-headline font-bold text-base text-[#2c3437]">Cancel This Order</h4>
            <p className="text-xs text-[#596064]">
              Are you sure you want to cancel this order?
            </p>
            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="Optional reason for cancellation..."
                className="w-full p-3 text-xs rounded-xl border border-[#dce4e8] focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#eaeff2] text-[#2c3437]"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:opacity-90"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                report_problem
              </span>
              <h4 className="font-headline font-bold text-base text-[#2c3437]">
                Escalate Order Dispute
              </h4>
            </div>
            <p className="text-xs text-[#596064]">
              Describe the problem or disagreement clearly. Escrow funds will remain safely held while platform support investigates.
            </p>
            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
                required
                minLength={10}
                placeholder="Explain why you are requesting dispute mediation (min 10 characters)..."
                className="w-full p-3 text-xs rounded-xl border border-[#dce4e8] focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#eaeff2] text-[#2c3437]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={disputeReason.trim().length < 10}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-40"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

