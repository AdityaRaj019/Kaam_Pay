'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithSocial, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Log in to KaamPay
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* OAuth buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          type="button"
          onClick={() => loginWithSocial('apple')}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors font-semibold text-slate-700 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.31-.85 3.73-.8 1.44.05 2.53.51 3.22 1.3-3.13 1.83-2.61 6.07.5 7.35-.74 1.84-1.63 3.52-2.53 4.32zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
            />
          </svg>
          Apple
        </button>
        <button
          type="button"
          onClick={() => loginWithSocial('google')}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-semibold disabled:opacity-50"
        >
          <svg className="w-5 h-5 bg-white p-0.5 rounded-full" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute border-t border-slate-200 w-full"></div>
        <span className="bg-white px-4 text-sm text-slate-500 relative">or</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email address</label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all outline-none"
            placeholder="Enter your password"
          />
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-900 text-white font-bold py-3 rounded-full hover:bg-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="mt-8 relative flex items-center justify-center">
        <div className="absolute border-t border-slate-200 w-full"></div>
        <span className="bg-white px-4 text-sm text-slate-500 relative">New to KaamPay?</span>
      </div>

      <div className="mt-6">
        <Link
          href="/register"
          className="w-full block text-center border-2 border-blue-900 text-blue-900 font-bold py-2.5 rounded-full hover:bg-blue-50 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
