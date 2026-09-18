/* eslint-disable @next/next/no-img-element */
'use client';

/**
 * AttachmentPreview.tsx — Renders a single file attachment with robust download capabilities
 *
 * Handles:
 *  - image: inline preview + prominent download button for receiver/sender
 *  - video: native player + download button
 *  - pdf / csv / docs: dedicated styled card with download trigger and loading state
 */

import { useState } from 'react';
import { Download, FileText, Film, Table2, File, Loader2 } from 'lucide-react';
import type { Attachment } from '@/hooks/useChat';
import { downloadFile } from '@/lib/download';

interface AttachmentPreviewProps {
  attachment: Attachment;
}

export function AttachmentPreview({ attachment }: AttachmentPreviewProps) {
  const { url, fileType, fileName, fileSize, publicId } = attachment;
  const [isDownloading, setIsDownloading] = useState(false);

  const fileSizeKB = (fileSize / 1024).toFixed(1);
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(1);
  const displaySize = fileSize > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      await downloadFile(url, fileName, publicId);
    } catch (err) {
      console.error('[AttachmentPreview] Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Image: show inline preview + prominent download options ────────────────
  if (fileType === 'image') {
    return (
      <div className="max-w-xs group flex flex-col gap-1.5">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
          <img
            src={url}
            alt={fileName}
            loading="lazy"
            className="rounded-2xl object-cover max-h-64 w-full cursor-pointer hover:opacity-95 transition-opacity"
            onClick={handleDownload}
            title="Click to download image"
          />

          {/* Hover download overlay */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="absolute top-2 right-2 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-md border border-slate-200/80 cursor-pointer"
            title="Download image"
            aria-label={`Download ${fileName}`}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#4a4bd7]" />
            ) : (
              <Download className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>

        {/* Dedicated download action bar below image */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-colors text-left shadow-xs cursor-pointer"
        >
          <span className="truncate max-w-[170px] font-medium">{fileName}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0 ml-2">
            {displaySize}
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4a4bd7]" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[#4a4bd7] group-hover:translate-y-0.5 transition-transform" />
            )}
          </span>
        </button>
      </div>
    );
  }

  // ── Video: native player + download ───────────────────────────────────────
  if (fileType === 'video') {
    return (
      <div className="max-w-xs flex flex-col gap-1.5">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
          <video controls preload="metadata" className="rounded-2xl w-full max-h-64 object-contain">
            <source src={url} />
            Your browser does not support video playback.
          </video>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
        >
          <span className="truncate max-w-[170px] font-medium">{fileName}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0 ml-2">
            {displaySize}
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4a4bd7]" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[#4a4bd7]" />
            )}
          </span>
        </button>
      </div>
    );
  }

  // ── PDF / CSV / Documents: interactive download card ─────────────────────
  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    pdf: FileText,
    csv: Table2,
    video: Film,
    other: File,
  };

  const IconComponent = iconMap[fileType] ?? File;

  const colorMap: Record<string, string> = {
    pdf: 'text-red-600 bg-red-50 border-red-100',
    csv: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    video: 'text-purple-600 bg-purple-50 border-purple-100',
    other: 'text-[#4a4bd7] bg-indigo-50 border-indigo-100',
  };

  const iconStyle = colorMap[fileType] ?? 'text-[#4a4bd7] bg-indigo-50 border-indigo-100';

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className="group w-full max-w-xs text-left flex items-center gap-3 p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200 transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-75"
      aria-label={`Download ${fileName}`}
    >
      <div className={`p-2.5 rounded-xl border shrink-0 ${iconStyle}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-[#4a4bd7] transition-colors">
          {fileName}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          {isDownloading ? 'Downloading file…' : `${displaySize} · Click to download`}
        </p>
      </div>

      <div className="p-2 text-slate-400 group-hover:text-[#4a4bd7] shrink-0 transition-colors">
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#4a4bd7]" />
        ) : (
          <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        )}
      </div>
    </button>
  );
}
