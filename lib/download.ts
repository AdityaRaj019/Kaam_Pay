/**
 * download.ts — Resilient universal file downloader for chat attachments
 *
 * Supports images, PDFs, CSVs, videos, and arbitrary documents.
 * 1. Fetches directly via blob (instant, stays on page, preserves file name).
 * 2. Authenticated backend proxy streaming via axios for restricted media (e.g. Cloudinary raw PDFs).
 * 3. Fallback direct download trigger.
 */

import api from '@/lib/axios';

export async function downloadFile(url: string, fileName: string, publicId?: string): Promise<void> {
  const safeName = fileName.trim() || 'download';

  // Strategy 1: Direct blob fetch (works instantly for images and public media)
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1500);
      return;
    }
  } catch {
    // If direct fetch is blocked by CORS or Cloudinary 401 on raw files, fall through to Strategy 2
  }

  // Strategy 2: Authenticated backend proxy streaming via axios (bypasses Cloudinary restricted media 401)
  try {
    const response = await api.get('/chat/download', {
      params: { url, fileName: safeName, publicId },
      responseType: 'blob',
    });

    const contentType = typeof response.headers['content-type'] === 'string'
      ? response.headers['content-type']
      : 'application/octet-stream';
    const blob = new Blob([response.data], { type: contentType });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1500);
    return;
  } catch (err) {
    console.error('[Download] Backend proxy blob fetch error:', err);
  }

  // Strategy 3: Fallback direct anchor trigger
  const backendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const proxyUrl = `${backendBase}/chat/download?url=${encodeURIComponent(url)}&fileName=${encodeURIComponent(safeName)}${publicId ? `&publicId=${encodeURIComponent(publicId)}` : ''}`;
  const fallbackLink = document.createElement('a');
  fallbackLink.href = proxyUrl;
  fallbackLink.setAttribute('download', safeName);
  fallbackLink.target = '_blank';
  fallbackLink.rel = 'noopener noreferrer';
  document.body.appendChild(fallbackLink);
  fallbackLink.click();
  document.body.removeChild(fallbackLink);
}
