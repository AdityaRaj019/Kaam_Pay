/**
 * AttachmentPreview.tsx — Renders a single file attachment based on its type:
 *
 *  image  → shown inline (img tag), click to download
 *  video  → HTML5 <video> player with controls, + download link
 *  pdf    → download card with PDF icon
 *  csv    → download card with spreadsheet icon
 *  other  → generic download card
 */

import { Download, FileText, Film, Table2, File } from 'lucide-react';
import type { Attachment } from '@/hooks/useChat';

interface AttachmentPreviewProps {
  attachment: Attachment;
}

export function AttachmentPreview({ attachment }: AttachmentPreviewProps) {
  const { url, fileType, fileName, fileSize } = attachment;
  const fileSizeKB = (fileSize / 1024).toFixed(1);
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(1);
  const displaySize = fileSize > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

  // ── Image: show inline, full download on click ──────────────────────────
  if (fileType === 'image') {
    return (
      <div className="max-w-xs">
        <a href={url} download={fileName} target="_blank" rel="noreferrer">
          <img
            src={url}
            alt={fileName}
            loading="lazy"
            className="rounded-xl object-cover max-h-64 w-full cursor-pointer hover:opacity-90 transition-opacity border border-white/10"
          />
        </a>
        <a
          href={url}
          download={fileName}
          target="_blank"
          rel="noreferrer"
          className="mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <Download className="w-3 h-3" />
          {fileName} · {displaySize}
        </a>
      </div>
    );
  }

  // ── Video: native player + download ─────────────────────────────────────
  if (fileType === 'video') {
    return (
      <div className="max-w-xs">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          controls
          preload="metadata"
          className="rounded-xl w-full border border-white/10"
        >
          <source src={url} />
          Your browser does not support the video tag.
        </video>
        <a
          href={url}
          download={fileName}
          target="_blank"
          rel="noreferrer"
          className="mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <Download className="w-3 h-3" />
          Download video · {displaySize}
        </a>
      </div>
    );
  }

  // ── PDF / CSV / Other: styled download card ──────────────────────────────
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
    other: 'text-gray-400',
  };

  const iconColor = colorMap[fileType] ?? 'text-gray-400';

  return (
    <a
      href={url}
      download={fileName}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 p-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-xl border border-white/10 max-w-xs transition-colors"
      aria-label={`Download ${fileName}`}
    >
      <IconComponent className={`w-8 h-8 shrink-0 ${iconColor}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-100 truncate">{fileName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{displaySize} · Click to download</p>
      </div>
      <Download className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 shrink-0 transition-colors" />
    </a>
  );
}
