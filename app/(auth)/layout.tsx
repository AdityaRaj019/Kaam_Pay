import React from 'react';
import Link from 'next/link';

/**
 * Auth Layout — shared wrapper for all auth pages.
 * Provides consistent branding and centered layout.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar with logo */}
      <header className="w-full px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2 group w-fit">
            <div className="w-10 h-10 bg-[#4a4bd7] rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-[#4a4bd7]/20">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="font-display font-black text-xl tracking-tight text-slate-900">
              KaamPay
            </span>
          </Link>
        </div>
      </header>

      {/* Auth content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-10">
        {children}
      </main>
    </div>
  );
}
