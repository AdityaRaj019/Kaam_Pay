'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import toast from 'react-hot-toast';

interface RoleGuardProps {
  allowedRoles: ('CLIENT' | 'FREELANCER' | 'ADMIN')[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        toast.error('Please sign in to access this page.');
        router.push('/login');
      } else {
        const userRole =
          (session.user as { role?: 'CLIENT' | 'FREELANCER' | 'ADMIN' }).role ?? 'CLIENT';
        if (!allowedRoles.includes(userRole)) {
          toast.error('Invalid Authorization: You do not have permission to view this page.');
          router.push('/dashboard');
        }
      }
    }
  }, [session, isPending, allowedRoles, router]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4a4bd7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Authorizing session...</p>
        </div>
      </div>
    );
  }

  const userRole = (session.user as { role?: 'CLIENT' | 'FREELANCER' | 'ADMIN' }).role ?? 'CLIENT';
  if (!allowedRoles.includes(userRole)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
