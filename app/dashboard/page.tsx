'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/lib/auth/auth-client';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';

interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string | null;
  role?: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  createdAt?: string | Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { setUser } = useAuthStore();
  const { logout } = useAuth();

  // Populate Zustand store when session is loaded
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified ?? false,
        image: session.user.image ?? null,
        role: (session.user as SessionUser).role ?? 'CLIENT',
        createdAt: session.user.createdAt
          ? new Date(session.user.createdAt).toISOString()
          : new Date().toISOString(),
      });
    }
  }, [session, setUser]);

  // Redirect to login if session check is complete and not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [isPending, session, router]);

  // Redirect freelancer to onboarding if they haven't completed it
  useEffect(() => {
    async function checkOnboarding() {
      if (!session?.user) return;
      const role = (session.user as SessionUser).role ?? 'CLIENT';
      if (role !== 'FREELANCER') return;

      try {
        const response = await api.get('/auth/me');
        const user = response.data?.data?.user;
        if (user && (!user.profile || !user.profile.title)) {
          router.push('/onboarding');
        }
      } catch (err) {
        console.error('Error checking profile onboarding:', err);
      }
    }

    if (session) {
      checkOnboarding();
    }
  }, [session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  const user = session.user;
  const userRole = (user as SessionUser).role ?? 'CLIENT';

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-900 tracking-tight">
              Kaam<span className="text-green-600">Pay</span>
            </span>
            <span className="text-xs bg-blue-50 text-blue-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-9 h-9 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
                  {userRole}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors px-4 py-2 rounded-full font-bold text-sm border border-red-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 rounded-3xl p-8 md:p-10 text-white shadow-lg mb-10 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent pointer-events-none"></div>
          <span className="text-xs bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Active Session
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 tracking-tight leading-tight">
            Welcome back, {user.name}!
          </h2>
          <p className="text-blue-200 mt-2 max-w-xl text-sm md:text-base">
            Monetize your micro-skills or hire local talent. Everything you need is managed
            securely.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Role Type
            </span>
            <p className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
              {userRole === 'CLIENT'
                ? 'Client'
                : userRole === 'FREELANCER'
                  ? 'Freelancer'
                  : 'Admin'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Configure options in your profile setup</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Security State
            </span>
            <p className="text-2xl font-black text-green-600 mt-2 tracking-tight flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-green-600 rounded-full inline-block animate-pulse"></span>
              Secured
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Authenticated via Better Auth session cookie
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Account Email
            </span>
            <p className="text-lg font-bold text-slate-800 mt-2 truncate">{user.email}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {user.emailVerified ? (
                <span className="text-green-600 font-semibold">✓ Verified Account</span>
              ) : (
                <span className="text-amber-600 font-semibold">⚠ Email Unverified</span>
              )}
            </p>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-4">
                Account Profile Information
              </h3>
              <div className="divide-y divide-slate-100">
                <div className="py-3 flex justify-between">
                  <span className="text-sm text-slate-500 font-semibold">User ID</span>
                  <span className="text-sm font-mono text-slate-800">{user.id}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-sm text-slate-500 font-semibold">Joined At</span>
                  <span className="text-sm text-slate-800 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-sm text-slate-500 font-semibold">
                    Authentication Method
                  </span>
                  <span className="text-sm text-blue-900 font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded text-xs">
                    Better Auth Session
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-4">
                Platform Activities
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Explore gigs, hire freelancers, or update your profile services.
              </p>
              <div className="flex flex-wrap gap-4">
                {userRole === 'FREELANCER' && (
                  <>
                    <Link
                      href="/profile"
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm"
                    >
                      View & Edit Profile
                    </Link>
                    <Link
                      href="/dashboard/create-gig"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm shadow-md shadow-green-600/20"
                    >
                      Create Gig
                    </Link>
                  </>
                )}
                {userRole === 'CLIENT' && (
                  <Link
                    href="/gigs"
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm"
                  >
                    Browse Gigs
                  </Link>
                )}
                <Link
                  href="/onboarding"
                  className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
                >
                  Onboarding Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Side Widgets */}
          <div className="space-y-6">
            {/* 2FA Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-extrabold text-slate-900 tracking-tight mb-2">
                Two-Factor Authentication
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Add an extra layer of security to your account by enabling TOTP 2FA.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between mb-4">
                <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                  Status
                </span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Disabled
                </span>
              </div>
              <button
                disabled
                className="w-full bg-slate-100 text-slate-400 font-bold py-2.5 rounded-xl cursor-not-allowed text-sm border border-slate-200"
              >
                Configure 2FA (Disabled in Dev)
              </button>
            </div>

            {/* Session Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-extrabold text-slate-900 tracking-tight mb-2">Session Info</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Your credentials are secure. Session cookies are HTTP-only and expire automatically.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Domain</span>
                  <span className="text-slate-800 font-semibold">localhost</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">HttpOnly Cookie</span>
                  <span className="text-green-600 font-bold">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
