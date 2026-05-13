import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
    credentials: true,
  }),
);

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
app.use('/api', routes);

// ─── 404 catch-all (Express v5 requires named wildcard) ───────
app.all('/{*path}', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, 404));
});

// ─── Global error handler ─────────────────────────────────────
app.use(errorHandler);

export default app;
