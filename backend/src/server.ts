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
import('./app').then(({ default: app }) => {
  const PORT = Number(process.env.PORT ?? 5000);

  const bootstrap = async () => {
    try {
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
      });

      const shutdown = (signal: string) => {
        console.log(`\n🔴 ${signal} received — shutting down gracefully`);
        server.close(() => {
          console.log('✅ Server closed');
          process.exit(0);
        });
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
