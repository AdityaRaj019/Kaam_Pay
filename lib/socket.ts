/**
 * socket.ts — Socket.io client singleton
 *
 * Why singleton? We want ONE socket connection shared across all pages.
 * If we created a new socket per component, we'd connect/disconnect constantly.
 *
 * Usage:
 *   import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';
 */

import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Returns the existing socket instance, or creates a new one.
 * Does NOT connect automatically (we connect explicitly after auth).
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:5000', {
      withCredentials: true, // sends session cookies so the server can identify the user
      autoConnect: false,    // we call connect() manually after the user is authenticated
      // Allow WebSocket (fast) with HTTP polling as fallback (more compatible)
      transports: ['websocket', 'polling'],
      // Reconnect automatically if the connection drops
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Log connection events in development
    if (process.env.NODE_ENV !== 'production') {
      socket.on('connect', () => console.log('[Socket] Connected:', socket?.id));
      socket.on('disconnect', (reason) => console.log('[Socket] Disconnected:', reason));
      socket.on('connect_error', (err) => console.error('[Socket] Connection error:', err.message));
    }
  }
  return socket;
}

/**
 * Connect to the server. Call this once after the user is authenticated.
 * Safe to call multiple times — does nothing if already connected.
 */
export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

/**
 * Disconnect and destroy the socket. Call this on logout.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
