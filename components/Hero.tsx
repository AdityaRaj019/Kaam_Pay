"use client";

import React from "react";
import { Search } from "./Search";


export const Hero: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-[#050505]">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1a1a2e_0%,#050505_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center space-y-16">
        <div className="space-y-8 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-display font-black tracking-tight text-white leading-[0.95]">
            Your Career, Curated on a <br />
            <span className="text-primary">Global Canvas.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto font-medium leading-relaxed">
            The premium marketplace for modern professionals. Discover <br className="hidden md:block" /> 
            hyperlocal opportunities and global projects with precision and soul.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-12">
          <div className="flex items-center space-x-4">
            <button className="bg-primary text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-primary-container transition-all hover:scale-105 shadow-xl shadow-primary/20">
              Find Work
            </button>
            <button className="bg-[#1a1a1a] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#252525] transition-all hover:scale-105 border border-white/5">
              Hire Talent
            </button>
          </div>

          <Search onSearch={handleSearch} className="mt-8 scale-110 md:scale-125" />
        </div>
      </div>
    </section>
  );
};

