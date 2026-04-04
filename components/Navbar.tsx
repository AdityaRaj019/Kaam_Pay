"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, CreditCard, Users, Briefcase } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Find Work", href: "/find-work", icon: Briefcase },
    { name: "Hire Talent", href: "/hire-talent", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Payments", href: "/payments", icon: CreditCard },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
        scrolled 
          ? "bg-white/70 backdrop-blur-xl shadow-sm border-b border-outline-variant text-[#2c3437]" 
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-[#4a4bd7] rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-[#4a4bd7]/20">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className={`font-display font-black text-xl tracking-tight transition-colors ${
            scrolled ? "text-[#2c3437]" : "text-white"
          }`}>
            FreelanceCanvas
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center space-x-2 transition-all font-bold text-sm ${
                scrolled ? "text-[#2c3437] hover:text-[#4a4bd7]" : "text-white hover:text-white/70"
              }`}
            >
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-8">
          <button className={`font-bold text-sm transition-colors ${
            scrolled ? "text-[#2c3437] hover:text-[#4a4bd7]" : "text-white hover:text-white/70"
          }`}>
            Sign In
          </button>
          <button className="bg-[#4a4bd7] text-white px-8 py-2.5 rounded-full text-sm font-black hover:bg-[#3b3bc2] transition-all hover:scale-105 shadow-lg shadow-[#4a4bd7]/20">
            Get Started
          </button>
        </div>
      </div>
    </nav>


  );
};
