"use client";

import React from "react";
import { Video, Type, Utensils, Palette, Code, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Video Editing", icon: Video, color: "bg-purple-100 text-purple-600" },
  { name: "Copywriting", icon: Type, color: "bg-blue-100 text-blue-600" },
  { name: "Cooking", icon: Utensils, color: "bg-orange-100 text-orange-600" },
  { name: "Design", icon: Palette, color: "bg-purple-100 text-purple-600" },
  { name: "Development", icon: Code, color: "bg-blue-100 text-blue-600" },
];

export const Categories: React.FC = () => {
  return (
    <section className="relative z-10 py-24 px-6 bg-[#F7F9FB]">


      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-end justify-between border-b border-surface-low pb-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-black tracking-tight text-[#2c3437]">Explore Categories</h2>
            <p className="text-[#2c3437]/40 font-medium">Find the perfect match for your next project.</p>

          </div>
          <Link href="#" className="flex items-center space-x-2 text-primary font-bold text-sm group">
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href="#" 
              className="group p-8 rounded-3xl bg-surface-low hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 text-center space-y-6"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 ${cat.color}`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#2c3437] group-hover:text-primary transition-colors">
                {cat.name}
              </h3>

            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
