import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { getNotifications, markAllRead, markOneRead } from './notification.controller';

const router = Router();

/** GET /api/notifications — list notifications (newest first) */
router.get('/', requireAuth, getNotifications);

/** POST /api/notifications/read — mark all as read */
router.post('/read', requireAuth, markAllRead);

/** PATCH /api/notifications/:id/read — mark individual notification as read */
router.patch('/:id/read', requireAuth, markOneRead);

export default router;
