/**
 * chat.controller.ts — REST endpoints for chat
 *
 * GET  /api/chat/order/:orderId  — load message history (on chat window open)
 * POST /api/chat/upload          — upload files to Cloudinary, return metadata
 *
 * File upload flow:
 *   1. Frontend selects files → sends multipart/form-data POST to /upload
 *   2. Controller uploads each file to Cloudinary in parallel
 *   3. Returns array of { url, publicId, fileType, fileName, fileSize }
 *   4. Frontend emits 'send_message' via Socket.io with the returned metadata
 *   5. No file data travels through Socket.io — only the Cloudinary URLs
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../../error';
import { uploadToCloudinary } from '../../common/middlewares/upload.middleware';
import prisma from '../../config/prisma';

// ── GET /api/chat/order/:orderId ──────────────────────────────────────────────

export async function getChatHistory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orderId = String(req.params.orderId);
    const userId = String(req.user!.id);

    // Step 1: Verify user is a party in this order
    const orderAccess = await prisma.order.findUnique({
      where: { id: orderId },
      select: { clientId: true, freelancerId: true },
    });

    if (!orderAccess) {
      return next(new AppError('Order not found', 404, ErrorCode.NOT_FOUND));
    }

    if (orderAccess.clientId !== userId && orderAccess.freelancerId !== userId) {
      return next(new AppError('Access denied to this chat', 403, ErrorCode.FORBIDDEN));
    }

    // Step 2: Fetch the chat room with messages using raw query result
    // (Prisma v7 with driver-adapter can have include type inference quirks)
    const chatRoomRaw = await prisma.chatRoom.findUnique({
      where: { orderId },
    });

    if (!chatRoomRaw) {
      return next(new AppError('Chat room not found for this order', 404, ErrorCode.NOT_FOUND));
    }

    // Fetch messages separately with full include to avoid type inference issues
    const messages = await prisma.message.findMany({
      where: { chatRoomId: chatRoomRaw.id },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        attachments: true,
      },
    });

    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}



// ── POST /api/chat/upload ─────────────────────────────────────────────────────

export async function uploadChatFiles(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return next(new AppError('No files provided', 400, ErrorCode.VALIDATION_ERROR));
    }

    // Upload all files to Cloudinary concurrently (parallel — faster than sequential)
    const uploadResults = await Promise.all(files.map((file) => uploadToCloudinary(file)));

    res.json({ success: true, data: uploadResults });
  } catch (err) {
    next(err);
  }
}
