import prisma from '../../config/prisma';
import { OrderService } from './order.service';

/**
 * Days of inactivity on a submitted deliverable before system auto-completes order.
 */
export const AUTO_COMPLETE_INACTIVITY_DAYS = 3;

/**
 * Auto-approves orders that have been in SUBMITTED status for >= 3 days without client response.
 * Safely transitions order to COMPLETED, releasing escrow to the freelancer.
 */
export async function autoCompleteSubmittedOrders(): Promise<{
  processedCount: number;
  completedOrderIds: string[];
}> {
  const cutoffDate = new Date(Date.now() - AUTO_COMPLETE_INACTIVITY_DAYS * 24 * 60 * 60 * 1000);

  const pendingOrders = await prisma.order.findMany({
    where: {
      status: 'SUBMITTED',
      updatedAt: {
        lte: cutoffDate,
      },
    },
    select: {
      id: true,
      clientId: true,
      updatedAt: true,
    },
  });

  const completedOrderIds: string[] = [];

  for (const order of pendingOrders) {
    try {
      await OrderService.completeOrder(order.id, order.clientId);
      completedOrderIds.push(order.id);
      console.log(
        `[Auto-Complete Cron] Order ${order.id} automatically completed after ${AUTO_COMPLETE_INACTIVITY_DAYS} days of client inactivity.`,
      );
    } catch (err) {
      console.error(`[Auto-Complete Cron] Failed to auto-complete order ${order.id}:`, err);
    }
  }

  return {
    processedCount: completedOrderIds.length,
    completedOrderIds,
  };
}

/**
 * Initializes recurring background job for order auto-completion.
 * Runs on server boot and repeats periodically.
 */
export function startOrderCronJobs(): NodeJS.Timeout {
  const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000; // Every 6 hours

  // Run initial scan 30 seconds after server starts
  setTimeout(() => {
    autoCompleteSubmittedOrders().catch((err) =>
      console.error('[Auto-Complete Cron] Error in initial run:', err),
    );
  }, 30000);

  // Set recurring interval
  return setInterval(() => {
    autoCompleteSubmittedOrders().catch((err) =>
      console.error('[Auto-Complete Cron] Error in periodic sweep:', err),
    );
  }, CHECK_INTERVAL_MS);
}
