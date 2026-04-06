"use client";

import React from "react";

const testimonials = [
  {
    name: "Marcus Chen",
    role: "CEO, Aurora Studio",
    quote: "The precision of talent discovery on FreelanceCanvas is unmatched. We found our lead designer in under 24 hours.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Full-stack Developer",
    quote: "As a freelancer, the growth tracking and streak features keep me motivated. It's more than a platform; it's a career tool.",
    rating: 5,
  },
  {
    name: "David Miller",
    role: "Creative Director, Nexus",
    quote: "The UI is incredibly intuitive. It feels like a high-end gallery rather than a cluttered job board.",
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="relative z-10 py-24 px-6 bg-[#F7F9FB] text-[#2c3437]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-[#2c3437]">
            Trusted by Industry Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div 
              key={t.name} 
              className="p-12 bg-white rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col justify-between shadow-sm border border-black/5"
            >
              <div className="space-y-8">
                <p className="text-lg font-medium leading-relaxed text-[#2c3437]/80 italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>
              
              <div className="flex items-center space-x-4 pt-10">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-display font-bold text-base leading-none">{t.name}</h4>
                  <p className="text-[#2c3437]/40 text-sm mt-1">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
