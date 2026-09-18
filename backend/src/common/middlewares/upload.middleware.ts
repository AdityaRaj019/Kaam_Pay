/**
 * upload.middleware.ts — Multer in-memory file upload handler
 *
 * Strategy: multer stores the file in RAM (Buffer), then we pipe it to
 * Cloudinary's upload_stream — no disk writes, no multer-storage-cloudinary peer-dep.
 *
 * Allowed: images, videos, PDFs, CSVs (up to 25 MB each, max 5 files per request)
 */

import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import cloudinary from '../../config/cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

// ── Constants ─────────────────────────────────────────────────────────────────

const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  'application/pdf',
  'text/csv', 'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_FILES = 5;

// ── Multer instance (stores in RAM) ───────────────────────────────────────────

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type "${file.mimetype}" is not allowed`));
  }
};

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(), // keep file in RAM as Buffer
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter,
});

// ── Cloudinary upload helper ──────────────────────────────────────────────────

export interface CloudinaryResult {
  url: string;
  publicId: string;
  fileType: string;
  fileName: string;
  fileSize: number;
}

/**
 * Determine Cloudinary resource type from MIME type.
 * Cloudinary requires 'image', 'video', or 'raw' (everything else).
 */
function getResourceType(mimetype: string): 'image' | 'video' | 'raw' {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'raw'; // PDF, CSV, Excel → uploaded as "raw" (downloadable link)
}

/**
 * Determine our internal fileType label for the frontend to decide how to render.
 */
function getFileType(mimetype: string, originalname: string): string {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf') return 'pdf';
  const ext = originalname.split('.').pop()?.toLowerCase() ?? '';
  if (['csv', 'xls', 'xlsx'].includes(ext)) return 'csv';
  return 'other';
}

/**
 * Uploads a single multer file Buffer to Cloudinary using upload_stream.
 * Returns a typed result with the Cloudinary URL and metadata.
 */
export function uploadToCloudinary(file: Express.Multer.File): Promise<CloudinaryResult> {
  return new Promise((resolve, reject) => {
    const resourceType = getResourceType(file.mimetype);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'kaampay/chat-attachments',
        resource_type: resourceType,
        // Safe public_id: timestamp + sanitized filename
        public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
        // For raw files, use_filename=true preserves original name in URL
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Cloudinary upload returned no result'));
        }
        resolve({
          url: result.secure_url,
          publicId: (result as UploadApiResponse).public_id,
          fileType: getFileType(file.mimetype, file.originalname),
          fileName: file.originalname,
          fileSize: file.size,
        });
      },
    );

    // Pipe the Buffer into Cloudinary's upload stream
    const readable = Readable.from(file.buffer);
    readable.pipe(stream);
  });
}
