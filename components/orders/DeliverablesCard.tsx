import React, { useState } from 'react';
import type { DeliverableItem } from '@/types/order';

interface DeliverablesCardProps {
  deliverables?: DeliverableItem[];
  isFreelancer: boolean;
  orderStatus: string;
  isSubmitting: boolean;
  onSubmit: (data: { fileUrls: string[]; textProof?: string }) => void;
}

export const DeliverablesCard: React.FC<DeliverablesCardProps> = ({
  deliverables = [],
  isFreelancer,
  orderStatus,
  isSubmitting,
  onSubmit,
}) => {
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [textProof, setTextProof] = useState('');

  const canDeliver =
    isFreelancer && (orderStatus === 'IN_PROGRESS' || orderStatus === 'REVISION');

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrlInput.trim()) return;
    try {
      new URL(fileUrlInput.trim());
      setFileUrls((prev) => [...prev, fileUrlInput.trim()]);
      setFileUrlInput('');
    } catch {
      alert('Please enter a valid URL (e.g., https://drive.google.com/...)');
    }
  };

  const handleRemoveUrl = (index: number) => {
    setFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileUrls.length === 0) {
      alert('Please attach at least one deliverable link or file URL.');
      return;
    }
    onSubmit({ fileUrls, textProof });
    setFileUrls([]);
    setTextProof('');
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#dce4e8]/80 shadow-[0_15px_35px_-15px_rgba(44,52,55,0.06)] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#dce4e8]/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '24px' }}>
            folder_zip
          </span>
          <h3 className="font-headline font-bold text-base sm:text-lg text-[#2c3437]">
            Project Deliverables
          </h3>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-[#f0f4f7] rounded-full text-[#596064]">
          {deliverables.length} {deliverables.length === 1 ? 'Submission' : 'Submissions'}
        </span>
      </div>

      {/* Existing Deliverables History */}
      {deliverables.length > 0 ? (
        <div className="space-y-4">
          {deliverables.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#dce4e8]/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4a4bd7] uppercase tracking-wider">
                  Submission #{idx + 1}
                  {item.revisionCount > 0 && ` (Revision ${item.revisionCount})`}
                </span>
                <span className="text-xs text-[#596064]">
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {item.textProof && (
                <p className="text-sm text-[#2c3437] leading-relaxed bg-white p-3 rounded-xl border border-[#dce4e8]/60">
                  {item.textProof}
                </p>
              )}

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#596064]">Attached Files / Links:</span>
                <div className="flex flex-wrap gap-2">
                  {item.fileUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#4a4bd7]/30 text-[#4a4bd7] rounded-xl text-xs font-semibold hover:bg-[#4a4bd7]/5 transition-colors"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        attachment
                      </span>
                      <span className="max-w-[200px] truncate">{url}</span>
                      <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '14px' }}>
                        open_in_new
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center bg-[#f7f9fb] rounded-2xl border border-dashed border-[#dce4e8]">
          <span className="material-symbols-outlined text-[#596064]/50" style={{ fontSize: '40px' }}>
            cloud_off
          </span>
          <p className="text-sm font-semibold text-[#2c3437] mt-2">No deliverables submitted yet</p>
          <p className="text-xs text-[#596064] mt-0.5">
            {isFreelancer
              ? 'When your work is ready, attach file URLs and submit for review below.'
              : 'The freelancer will upload project outcomes here once ready.'}
          </p>
        </div>
      )}

      {/* Freelancer Deliverable Submission Widget */}
      {canDeliver && (
        <form onSubmit={handleSubmit} className="pt-4 border-t border-[#dce4e8]/60 space-y-4">
          <h4 className="text-sm font-headline font-bold text-[#2c3437] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4a4bd7]" style={{ fontSize: '18px' }}>
              upload_file
            </span>
            Submit Deliverables & Final Work
          </h4>

          {/* URL Input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={fileUrlInput}
              onChange={(e) => setFileUrlInput(e.target.value)}
              placeholder="Paste deliverable URL (Figma, GitHub, Drive, Cloudinary...)"
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#dce4e8] focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/30 bg-white"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2.5 bg-[#eaeff2] hover:bg-[#dce4e8] text-[#2c3437] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                add
              </span>
              Add Link
            </button>
          </div>

          {/* Staged URLs List */}
          {fileUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-[#f0f4f7] rounded-xl">
              {fileUrls.map((url, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-[#dce4e8] text-xs text-[#2c3437]"
                >
                  <span className="max-w-[180px] truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(idx)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Text Proof / Note */}
          <textarea
            value={textProof}
            onChange={(e) => setTextProof(e.target.value)}
            rows={3}
            placeholder="Add completion notes or summary of delivered milestones for the client..."
            className="w-full px-4 py-3 text-xs rounded-xl border border-[#dce4e8] focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/30 bg-white"
          />

          <button
            type="submit"
            disabled={isSubmitting || fileUrls.length === 0}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#4a4bd7]/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting Deliverables...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  send
                </span>
                Send Deliverable for Client Approval
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
