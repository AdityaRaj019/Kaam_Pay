'use client';

/**
 * NotificationBell.tsx — The bell icon in the navbar with:
 *  - Red badge showing unread count
 *  - Dropdown panel listing recent notifications
 *  - "Mark all read" button
 *  - Click-outside to close
 */

import { useRef, useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllRead } = useNotifications();

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-4 h-4" />
        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#4a4bd7] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => { void markAllRead(); }}
                className="text-xs font-semibold text-[#4a4bd7] hover:text-[#3b3cb8] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 20).map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 transition-colors hover:bg-slate-50 ${
                    notif.isRead ? 'opacity-70 bg-white' : 'bg-indigo-50/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg leading-none mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 leading-snug">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatRelativeTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#4a4bd7] shrink-0 mt-1.5" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    NEW_MESSAGE: '💬',
    ORDER_PLACED: '🛍️',
    ORDER_ACCEPTED: '✅',
    ORDER_SUBMITTED: '📦',
    ORDER_COMPLETED: '🎉',
    ORDER_REVISION: '🔄',
    ORDER_CANCELLED: '❌',
    NEW_REVIEW: '⭐',
  };
  return icons[type] ?? '🔔';
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) return 'just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
}
