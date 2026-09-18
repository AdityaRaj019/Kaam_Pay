/* eslint-disable @next/next/no-img-element */
'use client';

/**
 * ChatWindow.tsx — The full chat UI panel
 *
 * Displays:
 *  - Header: other user's avatar, name, online presence dot, status text
 *  - Message history scrollable area
 *  - Typing indicator (appears below messages)
 *  - File selection preview strip
 *  - Input: textarea + file picker button + send button
 *
 * Props:
 *  orderId        — the order this chat belongs to
 *  currentUserId  — logged-in user's ID (from auth context)
 *  otherUser      — { id, name, image } of the counterparty
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, X, AlertCircle, MessageSquare } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { PresenceDot } from './PresenceDot';
import { TypingIndicator } from './TypingIndicator';

interface OtherUser {
  id: string;
  name: string;
  image?: string | null;
}

interface ChatWindowProps {
  orderId: string;
  currentUserId: string;
  otherUser: OtherUser;
}

export function ChatWindow({ orderId, currentUserId, otherUser }: ChatWindowProps) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isLoading,
    error,
    isOtherOnline,
    otherIsTyping,
    sendTextMessage,
    sendFiles,
    emitTyping,
  } = useChat(orderId, currentUserId, otherUser.id);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherIsTyping]);

  // Auto-resize textarea as user types
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`; // max 128px
  }, [text]);

  // ── Handle send ──────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const hasText = text.trim().length > 0;
    const hasFiles = files.length > 0;
    if (!hasText && !hasFiles) return;

    setIsSending(true);
    setUploadError(null);

    try {
      if (hasFiles) {
        await sendFiles(files, text);
        setFiles([]);
      } else {
        sendTextMessage(text);
      }
      setText('');
    } catch {
      setUploadError('Failed to send. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [text, files, sendTextMessage, sendFiles]);

  // Enter key sends (Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // File selection handler — deduplicate and cap at 5
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => {
      const combined = [...prev, ...selected];
      return combined.slice(0, 5); // max 5 files
    });
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Avatar with presence dot */}
          <div className="relative shrink-0">
            {otherUser.image ? (
              <img
                src={otherUser.image}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#4a4bd7]/10 border border-[#4a4bd7]/20 flex items-center justify-center text-[#4a4bd7] font-bold text-sm">
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Presence dot — bottom-right of avatar */}
            <PresenceDot
              isOnline={isOtherOnline}
              size="sm"
              className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white"
            />
          </div>

          {/* Name + status */}
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight">{otherUser.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isOtherOnline ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active now
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  Offline &middot; notified via email
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-5 space-y-1 bg-slate-50/40">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-[#4a4bd7] rounded-full animate-spin" />
              Loading messages…
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex items-center gap-2 justify-center py-6 px-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium mx-auto max-w-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4a4bd7] mb-3 shadow-2xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-800 text-sm">No messages yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Send a greeting or share order details to start the conversation.
            </p>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
        ))}

        {/* Typing indicator */}
        {otherIsTyping && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── File Preview Strip ── */}
      {files.length > 0 && (
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50/90 flex flex-wrap items-center gap-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-1.5 bg-white border border-indigo-200/80 rounded-lg px-2.5 py-1.5 text-xs text-indigo-700 shadow-2xs"
            >
              <span className="max-w-[130px] truncate font-medium">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-indigo-400 hover:text-rose-500 transition-colors ml-0.5 p-0.5"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <p className="text-[11px] font-medium text-slate-400 ml-auto">{files.length}/5 files attached</p>
        </div>
      )}

      {/* ── Upload Error ── */}
      {uploadError && (
        <div className="px-5 py-2 bg-rose-50 border-t border-rose-200 flex items-center gap-2 text-rose-600 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {uploadError}
        </div>
      )}

      {/* ── Input Area ── */}
      <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white flex items-end gap-2 shrink-0">
        {/* File picker button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= 5}
          className="p-2.5 rounded-xl text-slate-400 hover:text-[#4a4bd7] hover:bg-indigo-50/70 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Attach files"
          title="Attach up to 5 files (images, videos, PDFs, CSVs)"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden="true"
        />

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            emitTyping(); // debounced — max once per 1.5s
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            files.length > 0
              ? 'Add a message (optional)…'
              : 'Type a message… (Enter to send, Shift+Enter for newline)'
          }
          rows={1}
          className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all max-h-32"
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || (!text.trim() && files.length === 0)}
          className="p-2.5 bg-[#4a4bd7] hover:bg-[#3b3cb8] text-white rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
          aria-label="Send message"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
