"use client";

import React from "react";
import { Trophy, Star } from "lucide-react";



export const Features: React.FC = () => {
  return (
    <section className="relative z-10 py-32 px-6 bg-[#F7F9FB] text-[#2c3437]">

      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight text-[#2c3437]">
            Engineered for <span className="text-primary italic">Growth</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hyperlocal Discovery - Large Card */}
          <div className="md:col-span-2 bg-white rounded-3xl p-12 relative overflow-hidden group border border-black/5 shadow-sm transition-all hover:shadow-2xl hover:shadow-primary/5">
            <div className="relative z-10 max-w-sm space-y-6 text-[#2c3437]">
              <span className="inline-block px-4 py-1.5 bg-[#4a4bd7]/10 text-[#4a4bd7] text-[10px] font-black uppercase tracking-widest rounded-full">
                New Feature
              </span>
              <h3 className="text-4xl font-display font-black tracking-tight text-[#2c3437]">Hyperlocal Discovery</h3>
              <p className="text-lg text-[#2c3437]/60 font-medium leading-relaxed">
                Find experts in your neighborhood or halfway across the globe with our precision geolocation engine.
              </p>
            </div>
            
            {/* Abstract Map Visual (CSS based) */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#4a4bd7]/5 to-transparent flex items-center justify-center">
              <div className="relative w-64 h-64 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-[#4a4bd7]/30 rounded-full animate-ping" />
                <div className="absolute top-10 left-20 w-4 h-4 bg-[#4a4bd7] rounded-full" />
                <div className="absolute bottom-20 right-10 w-3 h-3 bg-[#4a4bd7] rounded-full opacity-50" />
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#4a4bd7] rounded-full opacity-30" />
              </div>
            </div>
          </div>

          {/* Hybrid Model - Small Blue Card */}
          <div className="bg-[#4a4bd7] rounded-3xl p-12 flex flex-col justify-between text-white group hover:scale-[1.02] transition-transform shadow-xl shadow-[#4a4bd7]/30">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-12 transform group-hover:rotate-6 transition-transform">
               <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
               </svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-black tracking-tight">Hybrid Model</h3>
              <p className="text-white/80 font-bold leading-relaxed italic">
                Seamlessly transition between online tasks and in-person collaborations.
              </p>
            </div>
          </div>

          {/* Work Streaks - Small Orange Card */}
          <div className="bg-[#ff9500] rounded-3xl p-12 flex flex-col justify-between text-white group hover:scale-[1.02] transition-transform shadow-xl shadow-[#ff9500]/30">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-12 transform group-hover:rotate-6 transition-transform">
               <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                 <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
               </svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-black tracking-tight">Work Streaks</h3>
              <p className="text-white/80 font-bold leading-relaxed italic">
                Gamified consistency that boosts your profile visibility to top-tier clients.
              </p>
            </div>
          </div>

          {/* Tiered Badge System - Medium Card */}
          <div className="md:col-span-2 bg-white rounded-3xl p-12 flex items-center space-x-12 group border border-black/5 shadow-sm transition-all hover:shadow-2xl hover:shadow-primary/5">
             <div className="flex -space-x-6 shrink-0 relative">
                <div className="w-24 h-24 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-xl shadow-orange-500/5 transform group-hover:-translate-x-2 transition-transform">
                  <Trophy className="w-10 h-10" />
                </div>
                <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-xl shadow-purple-500/5 transform rotate-6 group-hover:rotate-12 transition-transform">
                  <Star className="w-10 h-10" />
                </div>
             </div>
             <div className="space-y-4 text-[#2c3437]">
                <h3 className="text-4xl font-display font-black tracking-tight text-[#2c3437]">Tiered Badge System</h3>
                <p className="text-xl text-[#2c3437]/60 font-medium leading-relaxed">
                  Earn status through performance. From &apos;Emerging&apos; to &apos;Master&apos;, your craft is recognized with verified credentials.
                </p>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

