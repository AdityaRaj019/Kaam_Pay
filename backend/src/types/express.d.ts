import { AuthenticatedUser } from '../modules/auth/auth.types';

// Augment the global Express namespace so req.user is typed everywhere.
// This must live in a .d.ts file — ESLint's no-namespace rule allows
// namespace declarations here but not inside .ts source files.
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
