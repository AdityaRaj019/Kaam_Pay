/**
 * PresenceDot.tsx — Animated online/offline indicator
 *
 * Green pulsing dot = online
 * Gray dot = offline
 */

interface PresenceDotProps {
  isOnline: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function PresenceDot({ isOnline, size = 'sm', className = '' }: PresenceDotProps) {
  const sizeClass = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';

  return (
    <span
      role="status"
      aria-label={isOnline ? 'Online' : 'Offline'}
      className={`relative inline-flex ${sizeClass} ${className}`}
    >
      {/* Pulsing ring — only shown when online */}
      {isOnline && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
      )}
      {/* Solid dot */}
      <span
        className={`relative inline-flex rounded-full h-full w-full border-2 border-white
          ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`}
      />
    </span>
  );
}
