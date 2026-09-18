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
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <img
            src={url}
            alt={fileName}
            loading="lazy"
            className="rounded-xl object-cover max-h-64 w-full cursor-pointer hover:opacity-95 transition-opacity"
            onClick={handleDownload}
            title="Click to download image"
          />

          {/* Hover download overlay */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            title="Download image"
            aria-label={`Download ${fileName}`}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Dedicated download action bar below image */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-colors text-left"
        >
          <span className="truncate max-w-[170px] font-medium">{fileName}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0 ml-2">
            {displaySize}
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
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
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
          <video
            controls
            preload="metadata"
            className="rounded-xl w-full max-h-64 object-contain"
          >
            <source src={url} />
            Your browser does not support video playback.
          </video>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-colors"
        >
          <span className="truncate max-w-[170px]">{fileName}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0 ml-2">
            {displaySize}
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-indigo-400" />
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
    pdf: 'text-red-400',
    csv: 'text-emerald-400',
    video: 'text-purple-400',
    other: 'text-indigo-400',
  };

  const iconColor = colorMap[fileType] ?? 'text-indigo-400';

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className="group w-full max-w-xs text-left flex items-center gap-3 p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-xl border border-white/10 transition-colors shadow-sm cursor-pointer disabled:opacity-75"
      aria-label={`Download ${fileName}`}
    >
      <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
        <IconComponent className={`w-6 h-6 ${iconColor}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-100 truncate group-hover:text-white transition-colors">
          {fileName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {isDownloading ? 'Downloading file…' : `${displaySize} · Click to download`}
        </p>
      </div>

      <div className="p-2 text-gray-400 group-hover:text-indigo-400 shrink-0 transition-colors">
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
        ) : (
          <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        )}
      </div>
    </button>
  );
}
