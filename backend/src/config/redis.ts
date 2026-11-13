/**
 * redis.ts — Redis client configuration for Socket.io adapter
 *
 * We need TWO separate Redis connections:
 *  - pubClient: publishes Socket.io events
 *  - subClient: subscribes to Socket.io events
 *
 * This is a requirement of the @socket.io/redis-adapter.
 * Both clients connect to the Docker redis-stack running on localhost:6379.
 */

import { Redis } from 'ioredis';

export const isRedisConfigured = Boolean(process.env.REDIS_URL);

let pubInstance: Redis | null = null;
let subInstance: Redis | null = null;

if (isRedisConfigured) {
  try {
    pubInstance = new Redis(process.env.REDIS_URL as string, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: false,
    });
    pubInstance.on('connect', () => console.log('[Redis:pub] Connected ✅'));
    pubInstance.on('error', (err: Error) => console.error('[Redis:pub] Error:', err.message));
    pubInstance.on('reconnecting', () => console.log('[Redis:pub] Reconnecting…'));

    subInstance = pubInstance.duplicate();
    subInstance.on('connect', () => console.log('[Redis:sub] Connected ✅'));
    subInstance.on('error', (err: Error) => console.error('[Redis:sub] Error:', err.message));
    subInstance.on('reconnecting', () => console.log('[Redis:sub] Reconnecting…'));
  } catch (err) {
    console.warn('[Redis] Failed to initialize client, fallback to in-memory:', err);
    pubInstance = null;
    subInstance = null;
  }
} else {
  console.log('[Redis] REDIS_URL not configured. Running in-memory for Socket.io ⚠️');
}

/** Publisher client — used by Socket.io to broadcast events (null if unconfigured) */
export const pubClient = pubInstance;

/** Subscriber client — used by Socket.io to receive events from other instances (null if unconfigured) */
export const subClient = subInstance;
