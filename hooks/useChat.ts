'use client';

/**
 * useChat.ts — The core hook that powers the chat window.
 *
 * Manages:
 *  - Loading message history from REST API (on mount)
 *  - Listening for new real-time messages via Socket.io
 *  - Online/offline presence for the other party
 *  - Typing indicator (debounced — server gets at most 1 event per second)
 *  - Sending text messages and file attachment messages
 */

import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios';
import { getSocket, connectSocket } from '@/lib/socket';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Attachment {
  url: string;
  publicId: string;
  fileType: 'image' | 'video' | 'pdf' | 'csv' | 'other';
  fileName: string;
  fileSize: number;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  text: string | null;
  attachments: Attachment[];
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useChat(orderId: string, currentUserId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Load history on mount ────────────────────────────────────────────────
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/chat/order/${orderId}`, {
          withCredentials: true,
        });
        setMessages(data.data as ChatMessage[]);
      } catch {
        setError('Failed to load message history');
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [orderId]);

  // ── Socket events ────────────────────────────────────────────────────────
  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    // Join the order's chat room on the server
    socket.emit('join_room', { orderId });

    // A new message arrived from Kafka → broadcast by server
    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        // Prevent duplicate messages (in case of reconnect)
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    // The other user came online
    const onUserOnline = ({ userId }: { userId: string }) => {
      if (userId !== currentUserId) setIsOtherOnline(true);
    };

    // The other user opened the chat window
    const onUserJoinedChat = ({ userId }: { userId: string }) => {
      if (userId !== currentUserId) setIsOtherOnline(true);
    };

    // The other user went offline
    const onUserOffline = ({ userId }: { userId: string }) => {
      if (userId !== currentUserId) setIsOtherOnline(false);
    };

    // Typing indicator from the other user
    const onUserTyping = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      if (userId !== currentUserId) setOtherIsTyping(isTyping);
    };

    socket.on('receive_message', onMessage);
    socket.on('user_online', onUserOnline);
    socket.on('user_joined_chat', onUserJoinedChat);
    socket.on('user_offline', onUserOffline);
    socket.on('user_typing', onUserTyping);

    return () => {
      socket.off('receive_message', onMessage);
      socket.off('user_online', onUserOnline);
      socket.off('user_joined_chat', onUserJoinedChat);
      socket.off('user_offline', onUserOffline);
      socket.off('user_typing', onUserTyping);
    };
  }, [orderId, currentUserId]);

  // ── Typing emitter (debounced) ───────────────────────────────────────────
  // Fires "stop typing" 1.5 seconds after the user stops typing
  // This prevents flooding the server with typing events
  const emitStopTyping = useDebouncedCallback(() => {
    getSocket().emit('typing', { orderId, isTyping: false });
  }, 1500);

  const emitTyping = useCallback(() => {
    getSocket().emit('typing', { orderId, isTyping: true });
    emitStopTyping();
  }, [orderId, emitStopTyping]);

  // ── Send text message ────────────────────────────────────────────────────
  const sendTextMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      getSocket().emit('send_message', { orderId, text: trimmed });
    },
    [orderId],
  );

  // ── Send files (+ optional text) ─────────────────────────────────────────
  const sendFiles = useCallback(
    async (files: File[], text?: string): Promise<void> => {
      // Step 1: Upload files to Cloudinary via our REST endpoint
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));

      const { data } = await axios.post('/api/chat/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Step 2: Send the Cloudinary URLs through Socket.io
      // (No raw file data goes through Socket.io — just the URLs)
      getSocket().emit('send_message', {
        orderId,
        text: text?.trim() || undefined,
        attachments: data.data as Attachment[],
      });
    },
    [orderId],
  );

  return {
    messages,
    isLoading,
    error,
    isOtherOnline,
    otherIsTyping,
    sendTextMessage,
    sendFiles,
    emitTyping,
  };
}
