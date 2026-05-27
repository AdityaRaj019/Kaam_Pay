'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Step1Props {
  data: {
    title: string;
    bio: string;
  };
  onNext: (updatedData: { title: string; bio: string }) => void;
}

export default function Step1_TitleBio({ data, onNext }: Step1Props) {
  const [title, setTitle] = useState(data.title);
  const [bio, setBio] = useState(data.bio);
  const [errors, setErrors] = useState<{ title?: string; bio?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; bio?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Professional title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({ title, bio });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create your profile</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Tell clients about your expertise and what you do.
        </p>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">
            Professional Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="e.g. Senior Full Stack Developer, Brand Designer"
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Bio Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700">
              Professional Biography
            </label>
            <span className="text-xs text-slate-400">{bio.length} / 2000</span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              if (errors.bio) setErrors((prev) => ({ ...prev, bio: undefined }));
            }}
            rows={5}
            maxLength={2000}
            placeholder="Tell us about your background, experience, and the problems you solve for clients. Keep it professional and concise."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 resize-none leading-relaxed"
          />
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
          )}
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
