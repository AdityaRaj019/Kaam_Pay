import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { uploadMiddleware } from '../../common/middlewares/upload.middleware';
import {
  getChatHistory,
  uploadChatFiles,
  getConversations,
  initChat,
  downloadChatAttachment,
} from './chat.controller';

const router = Router();

/**
 * GET /api/chat/conversations
 * List all active conversation threads for the current user.
 */
router.get('/conversations', requireAuth, getConversations);

/**
 * POST /api/chat/init
 * Ensure or initialize a chat room for an order or gig inquiry.
 */
router.post('/init', requireAuth, initChat);

/**
 * GET /api/chat/order/:orderId
 * Load all messages for an order's chat room.
 * Auth required — user must be the client or freelancer of the order.
 */
router.get('/order/:orderId', requireAuth, getChatHistory);

/**
 * POST /api/chat/upload
 * Upload up to 5 files to Cloudinary. Returns metadata array.
 * Frontend uses this URL array to send via Socket.io.
 */
router.post('/upload', requireAuth, uploadMiddleware.array('files', 5), uploadChatFiles);

/**
 * GET /api/chat/download
 * Secure attachment download proxy.
 */
router.get('/download', requireAuth, downloadChatAttachment);

export default router;
