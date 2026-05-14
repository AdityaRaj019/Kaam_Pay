import React, { Suspense } from 'react';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      {/* Main Form */}
      <Suspense fallback={<div className="mt-20">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
