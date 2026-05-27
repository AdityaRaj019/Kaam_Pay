'use client';

import React, { useState } from 'react';
import { ArrowRight, Plus, X, Award } from 'lucide-react';

interface Step2Props {
  data: {
    skills: string[];
  };
  onNext: (updatedData: { skills: string[] }) => void;
}

const POPULAR_SUGGESTIONS = [
  'React',
  'Node.js',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Figma',
  'UI/UX Design',
  'Python',
  'PostgreSQL',
  'Docker',
  'AWS',
  'GraphQL',
];

export default function Step2_Skills({ data, onNext }: Step2Props) {
  const [skills, setSkills] = useState<string[]>(data.skills);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setError('Skill already added');
      return;
    }

    if (skills.length >= 30) {
      setError('Maximum of 30 skills allowed');
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setInputValue('');
    setError(null);
  };

  const removeSkill = (indexToRemove: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== indexToRemove));
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      setError('Please add at least one skill to continue');
      return;
    }
    onNext({ skills });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your skills</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Select or add the skills that best describe your expertise.
        </p>
      </div>

      <div className="space-y-6">
        {/* Interactive Tag Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">
            Add skills
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill (e.g. React) and press Enter"
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => addSkill(inputValue)}
              className="px-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Selected Tags list */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Selected Skills ({skills.length})
          </label>
          {skills.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-sm bg-slate-50/50">
              No skills added yet. Use the input above or suggestions below.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 border border-slate-200/60 rounded-xl min-h-[50px]">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/60 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-blue-500 hover:text-blue-800 transition-colors duration-150 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Suggestions list */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Popular Suggestions
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUGGESTIONS.map((suggestion) => {
              const isSelected = skills.some(
                (s) => s.toLowerCase() === suggestion.toLowerCase(),
              );
              return (
                <button
                  type="button"
                  key={suggestion}
                  disabled={isSelected}
                  onClick={() => addSkill(suggestion)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {suggestion}
                </button>
              );
            })}
          </div>
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
