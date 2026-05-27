'use client';

import React, { useState } from 'react';
import { ArrowRight, Target, DollarSign, Award, Clock, Briefcase, CheckCircle } from 'lucide-react';

interface Step3Props {
  selectedPurpose: string;
  onNext: (data: { purpose: 'money' | 'experience' | 'full_time' | 'side_business' }) => void;
}

const PURPOSE_OPTIONS = [
  {
    id: 'money',
    icon: DollarSign,
    label: 'Money',
    description: 'To make primary or secondary income.',
  },
  {
    id: 'experience',
    icon: Award,
    label: 'Experience',
    description: 'To build my portfolio and gain exposure.',
  },
  {
    id: 'full_time',
    icon: Clock,
    label: 'Full time',
    description: 'To work full-time as an independent freelancer.',
  },
  {
    id: 'side_business',
    icon: Briefcase,
    label: 'Side business',
    description: 'To run a side gig alongside my job or studies.',
  },
] as const;

export default function Step3_Purpose({ selectedPurpose, onNext }: Step3Props) {
  const [selected, setSelected] = useState<typeof PURPOSE_OPTIONS[number]['id'] | null>(
    PURPOSE_OPTIONS.find((opt) => opt.id === selectedPurpose)?.id || null,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    onNext({ purpose: selected });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">What is your purpose?</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Select why you are planning to use the KaamPay platform.
        </p>
      </div>

      {/* Options Stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PURPOSE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;

          return (
            <button
              type="button"
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 group relative flex flex-col justify-between h-40 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div
                  className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {isSelected && (
                  <div className="text-blue-600">
                    <CheckCircle className="w-5 h-5 fill-blue-50" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900">{opt.label}</h3>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={!selected}
        className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 text-white font-medium rounded-xl shadow-lg transition-all duration-200 ${
          selected
            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 cursor-pointer'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
