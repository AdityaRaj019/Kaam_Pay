import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { getNotifications, markAllRead } from './notification.controller';

const router = Router();

/** GET /api/notifications — list notifications (newest first) */
router.get('/', requireAuth, getNotifications);

/** POST /api/notifications/read — mark all as read */
router.post('/read', requireAuth, markAllRead);

export default router;
