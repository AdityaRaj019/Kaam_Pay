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

if (!process.env.REDIS_URL) throw new Error('Missing env: REDIS_URL');

function createRedisClient(name: string): Redis {
  const client = new Redis(process.env.REDIS_URL as string, {
    // Automatically reconnect up to 10 times with exponential backoff
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: false,
  });

  client.on('connect', () => console.log(`[Redis:${name}] Connected ✅`));
  client.on('error', (err: Error) => console.error(`[Redis:${name}] Error:`, err.message));
  client.on('reconnecting', () => console.log(`[Redis:${name}] Reconnecting…`));

  return client;
}

/** Publisher client — used by Socket.io to broadcast events */
export const pubClient = createRedisClient('pub');

/** Subscriber client — used by Socket.io to receive events from other instances */
export const subClient = pubClient.duplicate();
