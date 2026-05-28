'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Laptop, ArrowRight } from 'lucide-react';

export default function SignupRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null);

  const handleNext = () => {
    if (selectedRole) {
      router.push(`/register?role=${selectedRole}`);
    }
  };

  return (
    <div className="max-w-2xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 my-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Join as a client or freelancer
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Choose how you want to experience KaamPay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Client Card */}
        <button
          type="button"
          onClick={() => setSelectedRole('client')}
          className={`text-left flex flex-col justify-between p-6 rounded-2xl border-2 transition-all duration-300 relative group cursor-pointer h-full min-h-[180px] ${
            selectedRole === 'client'
              ? 'border-[#4a4bd7] bg-[#4a4bd7]/5 shadow-md shadow-[#4a4bd7]/5'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          {/* Top Row: Icon & Radio button */}
          <div className="flex justify-between items-start w-full">
            <div
              className={`p-3 rounded-xl border transition-all duration-300 ${
                selectedRole === 'client'
                  ? 'bg-[#4a4bd7] border-[#4a4bd7] text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:text-slate-700'
              }`}
            >
              <Briefcase className="w-6 h-6" />
            </div>
            
            <div className="relative flex items-center justify-center">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedRole === 'client'
                    ? 'border-[#4a4bd7] bg-[#4a4bd7]'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {selectedRole === 'client' && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>
            </div>
          </div>

          {/* Text Info */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4a4bd7] transition-colors">
              I’m a client, hiring for a project
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Post jobs, find premium talent, and manage payments securely.
            </p>
          </div>
        </button>

        {/* Freelancer Card */}
        <button
          type="button"
          onClick={() => setSelectedRole('freelancer')}
          className={`text-left flex flex-col justify-between p-6 rounded-2xl border-2 transition-all duration-300 relative group cursor-pointer h-full min-h-[180px] ${
            selectedRole === 'freelancer'
              ? 'border-[#4a4bd7] bg-[#4a4bd7]/5 shadow-md shadow-[#4a4bd7]/5'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          {/* Top Row: Icon & Radio button */}
          <div className="flex justify-between items-start w-full">
            <div
              className={`p-3 rounded-xl border transition-all duration-300 ${
                selectedRole === 'freelancer'
                  ? 'bg-[#4a4bd7] border-[#4a4bd7] text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:text-slate-700'
              }`}
            >
              <Laptop className="w-6 h-6" />
            </div>
            
            <div className="relative flex items-center justify-center">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedRole === 'freelancer'
                    ? 'border-[#4a4bd7] bg-[#4a4bd7]'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {selectedRole === 'freelancer' && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>
            </div>
          </div>

          {/* Text Info */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4a4bd7] transition-colors">
              I’m a freelancer, looking for work
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Apply to projects, track your career growth, and get paid securely.
            </p>
          </div>
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedRole}
          className={`w-full max-w-sm flex items-center justify-center gap-2 py-3.5 px-6 font-bold rounded-full transition-all duration-300 shadow-md ${
            selectedRole
              ? 'bg-[#4a4bd7] hover:bg-[#3b3bc2] text-white shadow-[#4a4bd7]/20 hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {selectedRole === 'client'
            ? 'Join as a Client'
            : selectedRole === 'freelancer'
            ? 'Join as a Freelancer'
            : 'Create Account'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-sm text-slate-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[#4a4bd7] font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
