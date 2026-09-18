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
import { Send, Paperclip, X, AlertCircle } from 'lucide-react';
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
    <div className="flex flex-col h-full min-h-0 bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gray-900/80 backdrop-blur-sm shrink-0">
        {/* Avatar with presence dot */}
        <div className="relative shrink-0">
          {otherUser.image ? (
            <img
              src={otherUser.image}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-sm">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Presence dot — bottom-right of avatar */}
          <PresenceDot
            isOnline={isOtherOnline}
            size="sm"
            className="absolute -bottom-0.5 -right-0.5"
          />
        </div>

        {/* Name + status */}
        <div>
          <p className="font-semibold text-gray-100 text-sm">{otherUser.name}</p>
          <p
            className={`text-xs mt-0.5 font-medium ${isOtherOnline ? 'text-emerald-400' : 'text-gray-500'}`}
          >
            {isOtherOnline ? '● Online' : '○ Offline — message will notify them'}
          </p>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-700">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-4 h-4 border-2 border-gray-600 border-t-indigo-500 rounded-full animate-spin" />
              Loading messages…
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex items-center gap-2 justify-center py-8 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600 text-sm gap-2">
            <span className="text-3xl">💬</span>
            <p>No messages yet. Say hello!</p>
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
        <div className="px-5 py-2 border-t border-white/10 flex flex-wrap gap-2 bg-gray-900/50">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-1.5 bg-indigo-900/40 border border-indigo-500/30 rounded-lg px-2.5 py-1.5 text-xs text-indigo-300"
            >
              <span className="max-w-[120px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-indigo-400 hover:text-red-400 transition-colors ml-0.5"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-500 self-center">{files.length}/5 files</p>
        </div>
      )}

      {/* ── Upload Error ── */}
      {uploadError && (
        <div className="px-5 py-1.5 bg-red-900/30 border-t border-red-500/20 flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {uploadError}
        </div>
      )}

      {/* ── Input Area ── */}
      <div className="px-4 py-3 border-t border-white/10 bg-gray-900/80 backdrop-blur-sm flex items-end gap-2">
        {/* File picker button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= 5}
          className="p-2.5 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
          className="flex-1 resize-none bg-gray-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all max-h-32 scrollbar-thin scrollbar-thumb-gray-700"
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || (!text.trim() && files.length === 0)}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
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
