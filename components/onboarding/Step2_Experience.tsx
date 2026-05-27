'use client';

import React, { useState } from 'react';
import { ArrowRight, Star, Briefcase, GraduationCap, CheckCircle } from 'lucide-react';

interface Step2Props {
  selectedExperience: string;
  onNext: (data: { experience: 'newbie' | 'worked_earlier' | 'working' }) => void;
}

const EXPERIENCE_OPTIONS = [
  {
    id: 'newbie',
    icon: GraduationCap,
    label: 'Newbie',
    description: 'I\'m just starting out and ready to build my portfolio from scratch.',
  },
  {
    id: 'worked_earlier',
    icon: Briefcase,
    label: 'Worked earlier',
    description: 'I have some previous corporate or freelance experience on other platforms.',
  },
  {
    id: 'working',
    icon: Star,
    label: 'Working',
    description: 'I\'m currently an active professional with regular ongoing freelance clients.',
  },
] as const;

export default function Step2_Experience({ selectedExperience, onNext }: Step2Props) {
  const [selected, setSelected] = useState<typeof EXPERIENCE_OPTIONS[number]['id'] | null>(
    EXPERIENCE_OPTIONS.find((opt) => opt.id === selectedExperience)?.id || null,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    onNext({ experience: selected });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">State your experience</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Select the option that best describes your current freelancing level.
        </p>
      </div>

      {/* Selectable Options Stack */}
      <div className="space-y-4">
        {EXPERIENCE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;

          return (
            <button
              type="button"
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 group relative ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
              }`}
            >
              <div
                className={`p-3 rounded-xl border flex-shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-500 group-hover:text-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="pr-8">
                <h3 className="text-base font-semibold text-slate-900">{opt.label}</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {opt.description}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-5 right-5 text-blue-600">
                  <CheckCircle className="w-5 h-5 fill-blue-50" />
                </div>
              )}
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
