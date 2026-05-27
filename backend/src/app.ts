import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './config/auth';
import routes from './modules';
import { errorHandler, AppError } from './error';

const app: Express = express();

// ─── Security headers ────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true, // Required for Better Auth cookies
  }),
);

// ─── Better Auth handler ─────────────────────────────────────
// Mounted BEFORE express.json() body parser because Better Auth
// handles its own request body parsing for auth endpoints.
app.all('/api/auth/*splat', (req: Request, res: Response, next: NextFunction) => {
  // Let custom auth endpoints (like /api/auth/me) bypass the Better Auth
  // handler and fall through to standard Express routing and body parsing.
  if (req.path.startsWith('/api/auth/me')) {
    return next();
  }
  const handler = toNodeHandler(auth) as unknown as (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  handler(req, res, next);
});

// ─── Body parsing ────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Debug logger ─────────────────────────────────────────────
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`📨 [${req.method}] ${req.path}`, JSON.stringify(req.body));
  next();
});

// ─── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, status: 'OK', ts: new Date().toISOString() });
});

// ─── API routes ───────────────────────────────────────────────
// Non-auth routes (gigs, orders, etc.) still use Express routers.
// The auth module in routes only exposes custom endpoints like /me.
app.use('/api', routes);

// ─── 404 catch-all (Express v5 requires named wildcard) ───────
app.all('/{*path}', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, 404));
});

// ─── Global error handler ─────────────────────────────────────
app.use(errorHandler);

export default app;
