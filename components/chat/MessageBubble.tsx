/**
 * MessageBubble.tsx — A single chat message with optional file attachments
 *
 * Own messages (sent by current user) → right-aligned, indigo bubble
 * Other party's messages → left-aligned, dark gray bubble
 */

import { AttachmentPreview } from './AttachmentPreview';
import type { ChatMessage } from '@/hooks/useChat';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}>
      <div className={`flex flex-col gap-1.5 max-w-[78%] ${isOwn ? 'items-end' : 'items-start'}`}>

        {/* File attachments (shown above text) */}
        {message.attachments.map((att) => (
          <AttachmentPreview key={att.publicId} attachment={att} />
        ))}

        {/* Text bubble */}
        {message.text && (
          <div
            className={`
              px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words
              ${isOwn
                ? 'bg-[#4a4bd7] text-white rounded-br-xs shadow-sm font-normal'
                : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs font-normal'
              }
            `}
          >
            {message.text}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 px-1 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
          {time}
        </span>
      </div>
    </div>
  );
}
