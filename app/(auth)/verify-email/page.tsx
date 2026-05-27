'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * Email Verification Page
 *
 * Shown after registration when email verification is enabled.
 * Users are prompted to check their email and click the verification link.
 */
export default function VerifyEmailPage() {
  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
      {/* Icon */}
      <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Mail className="w-8 h-8 text-blue-900" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
        Check your email
      </h1>

      <p className="text-slate-600 mb-8 leading-relaxed">
        We&apos;ve sent a verification link to your email address. Please click the link to verify
        your account and get started.
      </p>

      {/* Status indicator */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-800 font-medium">
          📧 Verification email sent — check your inbox and spam folder
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white font-bold py-3 rounded-full hover:bg-blue-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Resend verification email
        </button>

        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-700 font-bold py-2.5 rounded-full hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>

      <p className="mt-8 text-xs text-slate-400">
        Didn&apos;t receive the email? Check your spam folder or try a different email address.
      </p>
    </div>
  );
}
