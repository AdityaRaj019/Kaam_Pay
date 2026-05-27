'use client';

import React from 'react';
import { Check, Sparkles, User as UserIcon } from 'lucide-react';

interface Step4Props {
  data: {
    title: string;
    bio: string;
    skills: string[];
    hourlyRate: number;
  };
  userName: string;
  userImage: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function Step4_Review({
  data,
  userName,
  userImage,
  isSubmitting,
  onSubmit,
}: Step4Props) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review & Launch</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Here is how your profile will look to potential clients.
        </p>
      </div>

      {/* Premium Profile Card */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-300" />

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex gap-4 items-center">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userImage}
                alt={userName}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                <UserIcon className="w-8 h-8" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{userName}</h2>
              <p className="text-blue-600 text-sm font-semibold mt-1">{data.title}</p>
            </div>
          </div>

          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-4 py-2 rounded-xl text-lg font-bold">
            ${data.hourlyRate.toFixed(2)}/hr
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Biography
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {data.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={onSubmit}
        className={`w-full flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 transition-all duration-200 ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating Profile...
          </span>
        ) : (
          <>
            Complete & Submit
            <Check className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
