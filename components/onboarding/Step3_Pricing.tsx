'use client';

import React, { useState } from 'react';
import { ArrowRight, DollarSign, Percent, ShieldCheck } from 'lucide-react';

interface Step3Props {
  data: {
    hourlyRate: number;
  };
  onNext: (updatedData: { hourlyRate: number }) => void;
}

export default function Step3_Pricing({ data, onNext }: Step3Props) {
  const [hourlyRate, setHourlyRate] = useState<string>(
    data.hourlyRate > 0 ? String(data.hourlyRate) : '25',
  );
  const [error, setError] = useState<string | null>(null);

  const parsedRate = parseFloat(hourlyRate) || 0;
  const platformFee = parsedRate * 0.1; // 10% fee
  const takeHomePay = parsedRate - platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(hourlyRate);

    if (isNaN(rate) || rate < 5) {
      setError('Hourly rate must be at least $5');
      return;
    }

    if (rate > 1000) {
      setError('Hourly rate cannot exceed $1,000');
      return;
    }

    onNext({ hourlyRate: rate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Set your hourly rate</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Clients will see this rate on your profile. You can change it at any time.
        </p>
      </div>

      <div className="space-y-6">
        {/* Rate Input */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 block">
            Hourly Rate
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="number"
              min="5"
              max="1000"
              value={hourlyRate}
              onChange={(e) => {
                setHourlyRate(e.target.value);
                if (error) setError(null);
              }}
              placeholder="0.00"
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl pl-12 pr-16 py-4 text-xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              / hr
            </span>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        {/* Fees Breakdowns */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 flex items-center gap-1.5">
              Hourly Rate
            </span>
            <span className="font-semibold text-slate-950">${parsedRate.toFixed(2)}/hr</span>
          </div>

          <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-3">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              KaamPay Service Fee (10%)
            </span>
            <span className="font-semibold text-red-600">-${platformFee.toFixed(2)}/hr</span>
          </div>

          <div className="flex justify-between items-center text-base border-t border-slate-200 pt-3">
            <span className="text-slate-700 font-medium">You will earn</span>
            <span className="font-bold text-emerald-600 text-lg">
              ${takeHomePay.toFixed(2)}/hr
            </span>
          </div>
        </div>

        {/* Value Proposition Tip */}
        <div className="flex gap-3 bg-blue-50 border border-blue-200/60 p-4 rounded-xl text-xs text-blue-800 leading-relaxed">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-blue-600" />
          <p>
            With our Escrow protection, clients fund the milestone before you start
            working. You are guaranteed payout once the client approves the deliverables.
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 transition-all duration-200"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
