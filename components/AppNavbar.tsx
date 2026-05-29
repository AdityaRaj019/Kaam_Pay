'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, ChevronDown, LogOut, LayoutDashboard, ExternalLink } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface AppNavbarProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  } | null;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ user }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isFindWorkOpen, setIsFindWorkOpen] = useState(false);
  const [isDeliverOpen, setIsDeliverOpen] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const findWorkRef = useRef<HTMLDivElement>(null);
  const deliverRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setIsAvatarOpen(false);
      }
      if (findWorkRef.current && !findWorkRef.current.contains(e.target as Node)) {
        setIsFindWorkOpen(false);
      }
      if (deliverRef.current && !deliverRef.current.contains(e.target as Node)) {
        setIsDeliverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSignOut = async () => {
    try {
      await api.post('/auth/sign-out');
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* KaamPay Logo */}
        <Link href="/" className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <span className="text-xl font-black text-[#4a4bd7] tracking-tight">
            Kaam<span className="text-green-600">Pay</span>
          </span>
        </Link>
        {/* Left Side: Navigation Links AFTER the logo */}
        <div className="flex items-center space-x-6">
          {/* Find Work Dropdown */}
          <div className="relative" ref={findWorkRef}>
            <button
              onClick={() => setIsFindWorkOpen(!isFindWorkOpen)}
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#4a4bd7] transition-colors font-bold text-sm"
            >
              <span>Find Work</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isFindWorkOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {isFindWorkOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 text-xs text-slate-400 italic text-center"
                >
                  No options available
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Deliver Dropdown */}
          <div className="relative" ref={deliverRef}>
            <button
              onClick={() => setIsDeliverOpen(!isDeliverOpen)}
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#4a4bd7] transition-colors font-bold text-sm"
            >
              <span>Deliver</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isDeliverOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {isDeliverOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 text-xs text-slate-400 italic text-center"
                >
                  No options available
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages Link */}
          <Link
            href="/messages"
            className="flex items-center gap-1.5 text-slate-700 hover:text-[#4a4bd7] transition-colors font-bold text-sm"
          >
            <span>Messages</span>
          </Link>
        </div>

        {/* Right Side: Search, Notification, Avatar */}
        <div className="flex items-center space-x-5">
          {/* Search Bar */}
          <div className="relative hidden md:block w-64">
            <input
              type="text"
              placeholder="Search for projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Notification Button */}
          <button className="relative w-9 h-9 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#4a4bd7] rounded-full border border-white"></span>
          </button>

          {/* User Avatar with Dropdown */}
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setIsAvatarOpen(!isAvatarOpen)}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
            >
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 bg-[#4a4bd7] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </button>

            <AnimatePresence>
              {isAvatarOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-50"
                >
                  {/* User Profile Summary */}
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-slate-400 text-xs truncate mt-0.5">{user?.email || ''}</p>
                  </div>

                  {/* Dropdown Items */}
                  <button
                    onClick={() => {
                      setIsAvatarOpen(false);
                      router.push('/dashboard');
                    }}
                    className="w-full flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 transition-colors px-3 py-2.5 rounded-xl font-bold text-xs text-left cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAvatarOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 hover:bg-red-50 hover:text-red-655 text-slate-700 transition-colors px-3 py-2.5 rounded-xl font-bold text-xs text-left border-t border-slate-100 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-500" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};
