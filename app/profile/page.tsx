'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MapPin,
  Award,
  Briefcase,
  FileText,
  Edit3,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import api from '@/lib/axios';
import RoleGuard from '@/components/RoleGuard';
import toast from 'react-hot-toast';

interface UserProfile {
  title: string | null;
  bio: string | null;
  skills: string[];
  hourlyRate: number | null;
  experience: string | null;
  purpose: string | null;
  resumeUrl: string | null;
}

interface FullUser {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  image: string | null;
  profile: UserProfile | null;
}

export default function ProfilePage() {
  return (
    <RoleGuard allowedRoles={['FREELANCER']}>
      <FreelancerProfileContent />
    </RoleGuard>
  );
}

function FreelancerProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editHourlyRate, setEditHourlyRate] = useState<number>(0);
  const [editBio, setEditBio] = useState('');
  const [editResumeUrl, setEditResumeUrl] = useState('');
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch full user profile
  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.data?.user) {
        const userData = response.data.data.user;
        setUser(userData);
        // Initialize form state
        setEditTitle(userData.profile?.title || '');
        setEditHourlyRate(userData.profile?.hourlyRate || 0);
        setEditBio(userData.profile?.bio || '');
        setEditResumeUrl(userData.profile?.resumeUrl || '');
        setEditSkills(userData.profile?.skills || []);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenEdit = () => {
    if (user) {
      setEditTitle(user.profile?.title || '');
      setEditHourlyRate(user.profile?.hourlyRate || 0);
      setEditBio(user.profile?.bio || '');
      setEditResumeUrl(user.profile?.resumeUrl || '');
      setEditSkills(user.profile?.skills || []);
      setSubmitError(null);
      setIsEditOpen(true);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !editSkills.includes(trimmed)) {
      setEditSkills([...editSkills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEditSkills(editSkills.filter((s) => s !== skill));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.post('/freelancer/update', {
        title: editTitle,
        hourlyRate: Number(editHourlyRate),
        bio: editBio,
        resumeUrl: editResumeUrl || null,
        skills: editSkills,
      });

      if (response.data?.success) {
        toast.success('Profile updated successfully!');
        setIsEditOpen(false);
        fetchProfile(); // reload data
      } else {
        setSubmitError(response.data?.message || 'Failed to update profile.');
      }
    } catch (err: unknown) {
      console.error(err);
      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosError.response?.status === 429) {
        setSubmitError('Too many profile update attempts. Please try again after 1 minute.');
      } else {
        setSubmitError(axiosError.response?.data?.message || 'Something went wrong. Please check your inputs.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4a4bd7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Failed to load user</h2>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-6 py-2 bg-[#4a4bd7] text-white rounded-full font-bold text-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Realistic mock data for Gigs & Reviews as profile displays
  const mockGigs = [
    {
      id: 'g1',
      title: 'Modern Full-Stack Next.js Web App Development',
      category: 'Web Development',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.9,
      reviewsCount: 18,
    },
    {
      id: 'g2',
      title: 'Premium Tailwind CSS & UI Design Implementation',
      category: 'Frontend UI/UX',
      price: 800,
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 5.0,
      reviewsCount: 12,
    },
    {
      id: 'g3',
      title: 'REST API & PostgreSQL Database Integration',
      category: 'Backend APIs',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.8,
      reviewsCount: 7,
    },
  ];

  const mockReviews = [
    {
      id: 'r1',
      author: 'Rohan Mehta',
      company: 'BuildFast Technologies',
      rating: 5,
      date: 'May 12, 2026',
      comment: 'Absolutely exceptional work! The Next.js dashboard they developed is extremely fast, responsive, and beautifully styled. Code quality is clean and well-documented. Will definitely hire again.',
      initials: 'RM',
      bg: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'r2',
      author: 'Priya Sharma',
      company: 'Creative Studio In',
      rating: 5,
      date: 'April 28, 2026',
      comment: 'Very professional freelancer. Understood our React styling issues instantly and converted the designs to interactive Tailwind components flawlessly. Communication was top-tier!',
      initials: 'PS',
      bg: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'r3',
      author: 'Amit Patel',
      company: 'EcoKart Solutions',
      rating: 4,
      date: 'March 15, 2026',
      comment: 'Super fast delivery and great problem solving skills. Helped setup our Prisma backend migrations and optimized query load speeds. Strong engineering chops.',
      initials: 'AP',
      bg: 'bg-amber-100 text-amber-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-inter pb-16">
      {/* Header / Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#4a4bd7] tracking-tight">
              Kaam<span className="text-green-600">Pay</span>
            </span>
            <span className="text-xs bg-blue-50 text-[#4a4bd7] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Freelancer Profile
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 hover:bg-slate-50 text-slate-700 transition-colors px-4 py-2 rounded-full font-bold text-sm border border-slate-200"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={async () => {
                await api.post('/auth/sign-out');
                toast.success('Logged out successfully');
                router.push('/login');
              }}
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-all px-4 py-2 rounded-full font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Profile Intro Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden mb-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-tr from-[#4a4bd7] to-indigo-500 text-white rounded-full flex items-center justify-center font-black text-4xl shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
            </div>

            {/* User Bio Details */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
                  <div className="flex items-center gap-1 bg-[#4a4bd7]/10 text-[#4a4bd7] px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>Level 2 Seller</span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-green-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Super Responsive</span>
                  </div>
                </div>

                <p className="text-lg font-bold text-[#4a4bd7] mt-1">{user.profile?.title || 'Professional Freelancer'}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-slate-500 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Bengaluru, India</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-800">4.9</span>
                    <span>(37 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
                {user.profile?.bio || 'No bio description provided yet. Click Edit Profile to add details about your expertise.'}
              </p>
            </div>

            {/* Sidebar Rate & Action */}
            <div className="w-full md:w-auto flex flex-col items-center md:items-end justify-between bg-slate-50 p-6 rounded-2xl border border-slate-200 md:min-w-[240px]">
              <div className="text-center md:text-right">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Starting rate</span>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  ₹{(user.profile?.hourlyRate || 0).toLocaleString('en-IN')}<span className="text-sm font-semibold text-slate-500">/hr</span>
                </p>
              </div>
              <button
                onClick={handleOpenEdit}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#4a4bd7] hover:bg-[#3b3bc2] text-white font-bold py-2.5 px-6 rounded-full transition-all hover:scale-105 shadow-md shadow-[#4a4bd7]/20 text-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Skills & Resume */}
          <div className="lg:col-span-1 space-y-8">
            {/* Skills Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-5 h-5 text-[#4a4bd7]" />
                <span>My Core Skills</span>
              </h2>
              {user.profile?.skills && user.profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#4a4bd7] border border-slate-200 hover:border-[#4a4bd7]/30 transition-colors px-3 py-1.5 rounded-full text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">No skills listed yet.</p>
              )}
            </div>

            {/* Resume / CV Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-5 h-5 text-[#4a4bd7]" />
                <span>Resume / CV</span>
              </h2>
              {user.profile?.resumeUrl ? (
                <div className="space-y-4">
                  <p className="text-slate-600 text-sm">
                    Your professional resume is linked and visible on the platform.
                  </p>
                  <a
                    href={user.profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#4a4bd7]/20 transition-all p-3 rounded-xl text-xs font-bold text-[#4a4bd7] group"
                  >
                    <span className="truncate max-w-[200px]">{user.profile.resumeUrl}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#4a4bd7] shrink-0" />
                  </a>
                </div>
              ) : (
                <div className="space-y-3 text-center py-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#4a4bd7]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-slate-500 text-sm">No Resume/CV linked yet.</p>
                  <button
                    onClick={handleOpenEdit}
                    className="text-xs text-[#4a4bd7] hover:text-[#3b3bc2] font-extrabold hover:underline"
                  >
                    Add Resume Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Portfolio & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#4a4bd7]" />
                  <span>Portfolio & Active Gigs</span>
                </h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Portfolio Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockGigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="group border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white"
                  >
                    {/* Gig Image */}
                    <div className="h-32 w-full overflow-hidden bg-slate-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={gig.image}
                        alt={gig.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-black text-slate-800 uppercase tracking-wider shadow-sm">
                        {gig.category}
                      </div>
                    </div>

                    {/* Gig Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-slate-850 text-xs line-clamp-2 leading-tight group-hover:text-[#4a4bd7] transition-colors">
                        {gig.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-700">{gig.rating.toFixed(1)}</span>
                        <span>({gig.reviewsCount})</span>
                      </div>
                      <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between mt-2">
                        <span className="text-[10px] text-slate-400 font-medium">Starting at</span>
                        <span className="text-xs font-black text-slate-800">
                          ₹{gig.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#4a4bd7]" />
                <span>Client Reviews ({mockReviews.length})</span>
              </h2>

              <div className="space-y-6">
                {mockReviews.map((rev) => (
                  <div key={rev.id} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${rev.bg}`}>
                          {rev.initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-850">{rev.author}</h4>
                          <p className="text-xs text-slate-400 font-semibold">{rev.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 justify-end">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{rev.date}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed pl-13">
                      {`"${rev.comment}"`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl p-8 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Edit Your Profile</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Keep your details up to date for potential client views.</p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-450 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
                {submitError && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 border border-red-150">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Professional Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Lead Next.js Developer & UI Specialist"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800"
                  />
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Hourly Starting Rate (₹ INR)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-450 font-bold">
                      ₹
                    </div>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editHourlyRate}
                      onChange={(e) => setEditHourlyRate(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                {/* Bio Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Bio / Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell clients about your expertise, experience, and the problems you solve..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800 leading-relaxed"
                  />
                  <div className="text-right text-[10px] text-slate-400 font-semibold">
                    {editBio.length} / 2000 characters
                  </div>
                </div>

                {/* Resume URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Resume / CV Link (Google Drive, Dropbox, etc.)
                  </label>
                  <input
                    type="url"
                    value={editResumeUrl}
                    onChange={(e) => setEditResumeUrl(e.target.value)}
                    placeholder="e.g. https://drive.google.com/file/d/your-resume-id/view"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800"
                  />
                </div>

                {/* Skills tags selection */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    My Skills
                  </label>
                  <div className="flex flex-wrap gap-2 border border-slate-200 bg-slate-50 rounded-2xl p-4 min-h-[60px]">
                    {editSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-red-500 font-bold hover:scale-110 transition-transform"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {editSkills.length === 0 && (
                      <p className="text-slate-400 text-xs italic">No skills added yet.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g. React, Docker, Copywriting)"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 rounded-xl text-xs transition-colors flex items-center gap-1 border border-slate-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Footer Buttons inside Modal */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-6 rounded-full text-sm border border-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#4a4bd7] hover:bg-[#3b3bc2] text-white font-bold py-2.5 px-6 rounded-full text-sm shadow-md shadow-[#4a4bd7]/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
