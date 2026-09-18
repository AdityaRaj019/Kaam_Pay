/**
 * test/test-chat-notification-service.ts
 *
 * Isolated sandbox verification script for the refactored Chat and Notification services.
 */

import prisma from '../backend/src/config/prisma';
import { NotificationService } from '../backend/src/modules/notifications/notification.service';
import {
  getNotificationsQuerySchema,
  markOneReadParamsSchema,
} from '../backend/src/modules/notifications/notification.validation';
import { NOTIFICATION_TYPES } from '../backend/src/modules/notifications/notification.types';
import { ChatService } from '../backend/src/modules/chat/chat.service';
import {
  orderIdParamSchema,
  initChatSchema,
  downloadAttachmentQuerySchema,
} from '../backend/src/modules/chat/chat.validation';
import { AppError } from '../backend/src/error/AppError';

async function runIsolationTests() {
  console.log('=== STARTING CHAT & NOTIFICATION SERVICE ISOLATION TESTS ===\n');

  let passedTests = 0;

  // ── TEST 1: Notification Validation Schemas ───────────────────────────────
  console.log('[Test 1] Validating Notification Zod Schemas...');
  const queryResult = getNotificationsQuerySchema.parse({ limit: '25', unreadOnly: 'true' });
  if (queryResult.limit !== 25 || queryResult.unreadOnly !== true) {
    throw new Error('Query schema parsing mismatch');
  }

  const idParamResult = markOneReadParamsSchema.safeParse({ id: 'valid-id-123' });
  if (!idParamResult.success) throw new Error('ID param parsing failed');

  const emptyIdResult = markOneReadParamsSchema.safeParse({ id: '' });
  if (emptyIdResult.success) throw new Error('Empty ID should have failed validation');

  console.log('  ✅ Notification validation schemas passed');
  passedTests++;

  // ── TEST 2: Chat Validation Schemas ───────────────────────────────────────
  console.log('[Test 2] Validating Chat Zod Schemas...');
  const orderParam = orderIdParamSchema.safeParse({ orderId: 'ord-999' });
  if (!orderParam.success) throw new Error('orderIdParamSchema failed valid input');

  const initValid1 = initChatSchema.safeParse({ orderId: 'ord-123' });
  const initValid2 = initChatSchema.safeParse({ freelancerId: 'freelancer-1', gigId: 'gig-1' });
  const initInvalid = initChatSchema.safeParse({});
  if (!initValid1.success || !initValid2.success || initInvalid.success) {
    throw new Error('initChatSchema validation logic mismatch');
  }

  const dlValid = downloadAttachmentQuerySchema.safeParse({
    url: 'https://res.cloudinary.com/demo/raw/upload/v1234/sample.pdf',
    fileName: 'sample.pdf',
  });
  const dlInvalid = downloadAttachmentQuerySchema.safeParse({});
  if (!dlValid.success || dlInvalid.success) {
    throw new Error('downloadAttachmentQuerySchema validation logic mismatch');
  }

  console.log('  ✅ Chat validation schemas passed');
  passedTests++;

  // ── TEST 3: ChatService Attachment SSRF & Private URL Security ────────────
  console.log('[Test 3] Testing ChatService Attachment Security & SSRF Protection...');
  try {
    ChatService.prepareAttachmentDownload({
      url: 'https://evil-hacker-site.com/malicious.exe',
      fileName: 'exploit.exe',
    });
    throw new Error('Should have thrown AppError for untrusted host');
  } catch (err) {
    if (err instanceof AppError && err.statusCode === 403) {
      console.log('  ✅ Malicious non-Cloudinary URL successfully blocked with 403 Forbidden');
    } else {
      throw err;
    }
  }

  const safeDownload = ChatService.prepareAttachmentDownload({
    url: 'https://res.cloudinary.com/test-cloud/raw/upload/v12345/deliverable.pdf',
    fileName: 'Project Deliverable.pdf',
  });
  if (!safeDownload.downloadSourceUrl || !safeDownload.encodedFileName) {
    throw new Error('Failed to prepare valid Cloudinary download');
  }
  console.log('  ✅ Valid Cloudinary download URL successfully prepared & sanitized');
  passedTests++;

  // ── TEST 4: NotificationService DB Lifecycle ──────────────────────────────
  console.log('[Test 4] Testing NotificationService Database Operations...');
  // Find or use any user in DB to test lifecycle
  const testUser = await prisma.user.findFirst();
  if (testUser) {
    // 1. Create notification
    const testNotif = await NotificationService.persistAndDispatch({
      userId: testUser.id,
      type: NOTIFICATION_TYPES.ORDER_COMPLETED,
      message: 'Isolation test notification message',
    });
    console.log(`  ✅ Created test notification id=${testNotif.id}`);

    // 2. Fetch notifications
    const { notifications, unreadCount } = await NotificationService.getUserNotifications(
      testUser.id,
      { limit: 10, unreadOnly: true },
    );
    if (!notifications.some((n) => n.id === testNotif.id)) {
      throw new Error('Newly created notification was not found in getUserNotifications');
    }
    console.log(`  ✅ Verified notification in getUserNotifications (unreadCount=${unreadCount})`);

    // 3. Mark as read
    const updated = await NotificationService.markOneAsRead(testNotif.id, testUser.id);
    if (!updated.isRead) {
      throw new Error('Notification should have been marked as read');
    }
    console.log('  ✅ markOneAsRead successfully updated isRead to true');

    // 4. Cleanup
    await prisma.notification.delete({ where: { id: testNotif.id } });
    console.log('  ✅ Cleaned up test notification from database');
    passedTests++;
  } else {
    console.log('  ⚠️ No users found in database, skipping DB lifecycle test');
  }

  // ── TEST 5: ChatService Access Control Boundary ───────────────────────────
  console.log('[Test 5] Testing ChatService Access Control Boundary...');
  try {
    await ChatService.verifyOrderParty('non-existent-order-id', 'non-existent-user-id');
    throw new Error('Should have thrown AppError for non-existent order');
  } catch (err) {
    if (err instanceof AppError && err.statusCode === 404) {
      console.log('  ✅ ChatService.verifyOrderParty safely rejected invalid order with 404');
    } else {
      throw err;
    }
  }
  passedTests++;

  console.log(`\n🎉 ALL ${passedTests} ISOLATION TESTS PASSED SUCCESSFULLY!`);
}

runIsolationTests()
  .catch((err) => {
    console.error('❌ Isolation test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
