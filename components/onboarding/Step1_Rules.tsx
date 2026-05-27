'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface Step1Props {
  onNext: () => void;
}

const RULES = [
  {
    icon: CheckCircle2,
    title: 'Maintain high professionalism',
    description: 'Provide high-quality work, submit deliverables on time, and communicate respectfully with clients.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payments with Escrow',
    description: 'Ensure safety by keeping all work payments and transaction agreements strictly within KaamPay.',
  },
  {
    icon: MessageSquare,
    title: 'Keep communications on KaamPay',
    description: 'Use our messaging tools for discussing projects to stay protected under our Terms of Service.',
  },
  {
    icon: AlertCircle,
    title: 'Be honest and authentic',
    description: 'Do not misrepresent your experience, identity, or skills on your profile.',
  },
];

export default function Step1_Rules({ onNext }: Step1Props) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Community Rules</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Please review and accept our community guidelines to start freelancing.
        </p>
      </div>

      {/* Rules Stack */}
      <div className="space-y-4">
        {RULES.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div
              key={idx}
              className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm"
            >
              <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{rule.title}</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agreement Checkbox */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group p-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-xs text-slate-600 leading-normal select-none group-hover:text-slate-950 transition-colors duration-150">
            I have read the rules and I agree to verify my credentials honestly and abide by the community guidelines.
          </span>
        </label>

        <button
          type="submit"
          disabled={!agreed}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-medium rounded-xl shadow-lg transition-all duration-200 ${
            agreed
              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          I Accept the Rules
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
