// This file MUST be the first thing tsx executes.
// Using require() (not import) so dotenv runs synchronously
// before any other module is evaluated.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { config } = require('dotenv') as typeof import('dotenv');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { resolve } = require('path') as typeof import('path');

const envPath = resolve(__dirname, '../../.env');
const result = config({ path: envPath });

if (result.error) {
  console.warn(`⚠️  Could not load .env from ${envPath}:`, result.error.message);
} else {
  console.log(`📄 Loaded env from: ${envPath} (${Object.keys(result.parsed ?? {}).length} vars)`);
}

// Now that env is loaded, import the rest of the app
import('./app').then(async ({ default: app }) => {
  const PORT = Number(process.env.PORT ?? 5000);

  const bootstrap = async () => {
    try {
      // ── 1. Wrap Express in a raw HTTP server ──────────────────────────────
      // Socket.io needs access to the raw http.Server, not the Express app.
      const http = await import('http');
      const httpServer = http.createServer(app);

      // ── 2. Connect Kafka producer ─────────────────────────────────────────
      const { kafkaProducer } = await import('./config/kafka');
      await kafkaProducer.connect();
      console.log('[Kafka Producer] Connected ✅');

      // ── 3. Initialize Socket.io (with Redis adapter) ──────────────────────
      const { initSocketServer } = await import('./socket/chat.socket');
      const io = await initSocketServer(httpServer);
      console.log('[Socket.io] Server initialized ✅');

      // ── 4. Start Kafka consumer (pass io so it can broadcast) ─────────────
      const { startChatConsumer } = await import('./services/chat.consumer');
      await startChatConsumer(io);
      console.log('[Kafka Consumer] Started ✅');

      // ── 5. Start listening ────────────────────────────────────────────────
      httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
      });

      // ── Graceful shutdown ─────────────────────────────────────────────────
      const shutdown = async (signal: string) => {
        console.log(`\n🔴 ${signal} received — shutting down gracefully`);

        // Stop accepting new connections
        httpServer.close(() => console.log('✅ HTTP server closed'));

        // Disconnect Kafka
        await kafkaProducer.disconnect().catch(console.error);
        const { kafkaConsumer } = await import('./config/kafka');
        await kafkaConsumer.disconnect().catch(console.error);
        console.log('✅ Kafka disconnected');

        // Disconnect Redis
        const { pubClient, subClient } = await import('./config/redis');
        await pubClient.quit().catch(console.error);
        await subClient.quit().catch(console.error);
        console.log('✅ Redis disconnected');

        process.exit(0);
      };

      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };

  bootstrap();
});

