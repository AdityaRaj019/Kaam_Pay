/**
 * chat.controller.ts — HTTP Controller for Chat module
 *
 * GET  /api/chat/order/:orderId  — load message history
 * GET  /api/chat/conversations   — list all conversation threads
 * POST /api/chat/init            — initialize conversation thread
 * POST /api/chat/upload          — upload files to Cloudinary, return metadata
 * GET  /api/chat/download        — secure attachment download proxy
 */

import { Request, Response } from 'express';
import axios from 'axios';
import { catchAsync } from '../../common/utils/catchAsync';
import { sendSuccess } from '../../common/utils/apiResponse';
import { AppError, ErrorCode } from '../../error/AppError';
import { uploadToCloudinary } from '../../common/middlewares/upload.middleware';
import { ChatService } from './chat.service';
import {
  orderIdParamSchema,
  initChatSchema,
  downloadAttachmentQuerySchema,
} from './chat.validation';

/**
 * GET /api/chat/order/:orderId
 */
export const getChatHistory = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const paramsValidation = orderIdParamSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    throw new AppError('Invalid order ID', 400, ErrorCode.VALIDATION_ERROR);
  }

  const { messages } = await ChatService.getChatHistory(
    paramsValidation.data.orderId,
    req.user.id,
  );

  sendSuccess(res, 200, 'Chat history loaded successfully', messages);
});

/**
 * GET /api/chat/conversations
 */
export const getConversations = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const conversations = await ChatService.getConversations(req.user.id);

  sendSuccess(res, 200, 'Conversations loaded successfully', conversations);
});

/**
 * POST /api/chat/init
 */
export const initChat = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const validation = initChatSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = validation.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join(', ');
    throw new AppError(`Validation failed: ${errorDetails}`, 400, ErrorCode.VALIDATION_ERROR);
  }

  const result = await ChatService.initChat(req.user.id, validation.data);

  sendSuccess(res, 200, 'Chat initialized successfully', result);
});

/**
 * POST /api/chat/upload
 */
export const uploadChatFiles = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    throw new AppError('No files provided', 400, ErrorCode.VALIDATION_ERROR);
  }

  const uploadResults = await Promise.all(files.map((file) => uploadToCloudinary(file)));

  sendSuccess(res, 200, 'Files uploaded successfully', uploadResults);
});

/**
 * GET /api/chat/download
 */
export const downloadChatAttachment = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const queryValidation = downloadAttachmentQuerySchema.safeParse(req.query);
  if (!queryValidation.success) {
    throw new AppError(
      'Attachment URL or publicId is required',
      400,
      ErrorCode.VALIDATION_ERROR,
    );
  }

  const { downloadSourceUrl, encodedFileName } = ChatService.prepareAttachmentDownload(
    queryValidation.data,
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
  );

  const streamResponse = await axios({
    method: 'GET',
    url: downloadSourceUrl,
    responseType: 'stream',
    timeout: 30000,
  });

  const contentType = streamResponse.headers['content-type'];
  if (typeof contentType === 'string' || Array.isArray(contentType)) {
    res.setHeader('Content-Type', contentType);
  }

  const contentLength = streamResponse.headers['content-length'];
  if (typeof contentLength === 'string' || typeof contentLength === 'number') {
    res.setHeader('Content-Length', contentLength);
  }

  streamResponse.data.pipe(res);
});
