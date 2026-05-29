"use client";

import React from "react";
import Link from "next/link";
import { Share2, Globe, Users, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  const sections = [
    {
      title: "Platform",
      links: ["About Us", "Careers", "Privacy Policy"],
    },
    {
      title: "Resources",
      links: ["Terms of Service", "Help Center", "Contact"],
    },
  ];

  return (
    <footer className="relative z-10 py-12 px-6 bg-[#F7F9FB] border-t border-outline-variant text-[#2c3437]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4 col-span-1">
          <h3 className="text-[#737B8C] font-display font-black text-lg tracking-tight">
            KaamPay
          </h3>
          <p className="max-w-xs text-[#737B8C]/40 text-xs font-medium leading-relaxed">
            The Curated Canvas for Modern Professionals. Revolutionizing the way the world works.
          </p>
          <div className="flex items-center space-x-5 text-[#737B8C]/40">
             <Share2 className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
             <Globe className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
             <Users className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h4 className="font-display font-bold text-sm text-[#2c3437]/80">{section.title}</h4>
            <ul className="space-y-2.5 font-medium text-[#2c3437]/40 text-xs">
              {section.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-primary transition-colors flex items-center group">
                    <span>{link}</span>
                    <ArrowUpRight className="w-3 h-3 ml-1.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="space-y-4">
          <h4 className="font-display font-bold text-sm text-[#2c3437]/80">Newsletter</h4>
          <div className="space-y-2.5">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full px-4 py-2.5 bg-white border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
            <button className="w-full bg-[#4a4bd7] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#3b3bc2] transition-all shadow-md shadow-[#4a4bd7]/20 active:scale-95">
              Subscribe Now
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center text-[9px] font-bold tracking-widest uppercase text-[#2c3437]/20 space-y-3 md:space-y-0">
        <p>© 2024 FreelanceCanvas. The Curated Canvas for Modern Professionals.</p>
        <div className="flex items-center space-x-6">
          <Link href="#">English (US)</Link>
          <Link href="#">USD</Link>
        </div>
      </div>
    </footer>
  );
};
