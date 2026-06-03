import type { Gig } from '@/types/gig';

const LS_KEY = 'kp_saved_gigs';

export function loadSavedMap(): Record<string, Gig> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') as Record<string, Gig>;
  } catch {
    return {};
  }
}

export function persistSavedMap(map: Record<string, Gig>) {
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

export function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}
