'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface SplitScreenLayoutProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  children: React.ReactNode;
}

const STEP_INFOS = [
  {
    title: 'Community Rules',
    quote: 'Welcome to KaamPay. Let\'s set some ground rules for a safe community.',
    author: 'KaamPay Team',
  },
  {
    title: 'Your Experience',
    quote: 'Whether you\'re a newbie or a pro, we have gigs that match your level.',
    author: 'KaamPay Team',
  },
  {
    title: 'Platform Purpose',
    quote: 'Tell us your goals so we can tailor the platform to help you achieve them.',
    author: 'KaamPay Team',
  },
  {
    title: 'Professional Profile',
    quote: 'Your profile is your digital handshake. Let\'s make it stand out.',
    author: 'KaamPay Team',
  },
  {
    title: 'Superpowers & Skills',
    quote: 'Skills define your craft. Show clients what you do best.',
    author: 'KaamPay Team',
  },
  {
    title: 'Rates & Availability',
    quote: 'Value your expertise. Set a rate that reflects your true worth.',
    author: 'KaamPay Team',
  },
  {
    title: 'Review & Launch',
    quote: 'Almost there! Take a final look before launching your freelance career.',
    author: 'KaamPay Team',
  },
];

export default function SplitScreenLayout({
  currentStep,
  totalSteps,
  onBack,
  children,
}: SplitScreenLayoutProps) {
  const stepInfo = STEP_INFOS[currentStep - 1] || STEP_INFOS[0];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Left Panel: Clean corporate blue/navy visuals */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-blue-950 to-blue-900">
        {/* Background Decorative Soft Blue Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/10 blur-[100px] animate-pulse delay-75" />

        {/* Logo/Brand */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            KaamPay
          </span>
        </div>

        {/* Dynamic Content (Quotes & Steps) */}
        <div className="relative z-10 my-auto py-12 max-w-md">
          <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Step {currentStep} of {totalSteps}
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-6 leading-tight">
            {stepInfo.title}
          </h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <p className="text-lg italic text-slate-100 mb-4 leading-relaxed font-light">
                &quot;{stepInfo.quote}&quot;
              </p>
              <div className="text-sm font-semibold text-blue-300">
                — {stepInfo.author}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Progress Indicators */}
        <div className="relative z-10 flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isCompleted = i + 1 < currentStep;
            const isActive = i + 1 === currentStep;

            return (
              <div key={i} className="flex-1 flex flex-col gap-2">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-blue-400'
                      : isActive
                      ? 'bg-white w-full'
                      : 'bg-white/20'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium tracking-wide ${
                    isActive ? 'text-white' : 'text-blue-300/60'
                  }`}
                >
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Interactive Form */}
      <div className="w-full lg:w-7/12 flex flex-col min-h-screen bg-white p-6 sm:p-12 md:p-16 relative">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          {onBack && currentStep > 1 ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200 group bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
          ) : (
            <div className="w-20" /> /* empty placeholder */
          )}
          
          <div className="lg:hidden flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
