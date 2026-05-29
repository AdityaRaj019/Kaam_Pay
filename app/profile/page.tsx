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
  LayoutDashboard,
} from 'lucide-react';
import api from '@/lib/axios';
import RoleGuard from '@/components/RoleGuard';
import toast from 'react-hot-toast';
import { AppNavbar } from '@/components/AppNavbar';
import { Footer } from '@/components/Footer';

interface UserProfile {
  title: string | null;
  bio: string | null;
  skills: string[];
  hourlyRate: number | null;
  experience: string | null;
  purpose: string | null;
  resumeUrl: string | null;
  portfolioLinks?: string[];
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
        setSubmitError(
          axiosError.response?.data?.message || 'Something went wrong. Please check your inputs.',
        );
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
      image:
        'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.9,
      reviewsCount: 18,
    },
    {
      id: 'g2',
      title: 'Premium Tailwind CSS & UI Design Implementation',
      category: 'Frontend UI/UX',
      price: 800,
      image:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 5.0,
      reviewsCount: 12,
    },
    {
      id: 'g3',
      title: 'REST API & PostgreSQL Database Integration',
      category: 'Backend APIs',
      price: 1200,
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
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
      comment:
        'Absolutely exceptional work! The Next.js dashboard they developed is extremely fast, responsive, and beautifully styled. Code quality is clean and well-documented. Will definitely hire again.',
      initials: 'RM',
      bg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'r2',
      author: 'Priya Sharma',
      company: 'Creative Studio In',
      rating: 5,
      date: 'April 28, 2026',
      comment:
        'Very professional freelancer. Understood our React styling issues instantly and converted the designs to interactive Tailwind components flawlessly. Communication was top-tier!',
      initials: 'PS',
      bg: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'r3',
      author: 'Amit Patel',
      company: 'EcoKart Solutions',
      rating: 4,
      date: 'March 15, 2026',
      comment:
        'Super fast delivery and great problem solving skills. Helped setup our Prisma backend migrations and optimized query load speeds. Strong engineering chops.',
      initials: 'AP',
      bg: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-inter flex flex-col justify-between">
      <div>
        <AppNavbar user={user} />
        <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Top Compartment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Div (col-span-2): User profile, bio, tech stack, reviews under avatar, edit button */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent pointer-events-none"></div>

            {/* Left side column: Avatar + Ratings + Edit Button */}
            <div className="flex flex-col items-center shrink-0 w-full md:w-40 text-center border-b md:border-b-0 md:border-r border-slate-100 pb-5 md:pb-0 pr-0 md:pr-6">
              <div className="relative">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-[#4a4bd7] to-indigo-500 text-white rounded-full flex items-center justify-center font-black text-3xl shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
              </div>

              {/* Reviews & Ratings below profile image */}
              <div className="mt-3 flex flex-col items-center gap-1 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-150 w-full">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-extrabold text-[11px] text-slate-800">4.9</span>
                  <span className="text-[9px] text-slate-450">(37 reviews)</span>
                </div>
                <span className="text-[8px] font-bold text-[#4a4bd7] bg-[#4a4bd7]/10 px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                  Top Rated
                </span>
              </div>

              {/* Edit Profile Button below reviews */}
              <button
                onClick={handleOpenEdit}
                className="w-full mt-4 flex items-center justify-center gap-1 bg-[#4a4bd7] hover:bg-[#3b3bc2] text-white font-bold py-2 px-3 rounded-full transition-all hover:scale-[1.03] shadow-md shadow-[#4a4bd7]/15 text-[11px] cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Right side column: Profile Details + Bio + Tech Stack */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                  <div className="flex items-center gap-1 bg-[#4a4bd7]/10 text-[#4a4bd7] px-2.5 py-0.5 rounded-full text-[9px] font-bold">
                    <Award className="w-2.5 h-2.5" />
                    <span>Level 2 Seller</span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-green-200">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>Super Responsive</span>
                  </div>
                </div>

                <p className="text-sm font-extrabold text-[#4a4bd7]">
                  {user.profile?.title || 'Professional Freelancer'}
                </p>
                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Bengaluru, India</span>
                </div>
              </div>

              {/* Bio summary */}
              <div className="space-y-1">
                <h3 className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">
                  About Me
                </h3>
                <p className="text-slate-655 text-xs md:text-sm leading-relaxed">
                  {user.profile?.bio ||
                    'No bio description provided yet. Click Edit Profile to add details about your expertise.'}
                </p>
              </div>

              {/* Tech Stack below the bio */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <h3 className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">
                  Technology Stack
                </h3>
                {user.profile?.skills && user.profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {user.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#4a4bd7] border border-slate-200 hover:border-[#4a4bd7]/30 transition-colors px-2.5 py-1 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic">No skills listed yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Div (col-span-1): Social Links and Stats */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col space-y-5">
            {/* Social & Professional Links */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">
                Social & Professional Links
              </span>
              <div className="space-y-2">
                <a
                  href={user.profile?.portfolioLinks?.[1] || 'https://github.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#4a4bd7]/20 transition-all p-3 rounded-xl text-xs font-bold text-slate-700 hover:text-[#4a4bd7] group"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-[#4a4bd7] fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-[#4a4bd7] truncate max-w-[120px]">
                    {user.profile?.portfolioLinks?.[1] ? user.profile.portfolioLinks[1].replace(/^https?:\/\/(www\.)?github\.com\//, '') : 'github.com/profile'}
                  </span>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#4a4bd7]/20 transition-all p-3 rounded-xl text-xs font-bold text-slate-700 hover:text-[#4a4bd7] group"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-[#4a4bd7] fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-[#4a4bd7]">linkedin.com/in/profile</span>
                </a>

                <a
                  href={user.profile?.portfolioLinks?.[0] || 'https://example.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#4a4bd7]/20 transition-all p-3 rounded-xl text-xs font-bold text-slate-700 hover:text-[#4a4bd7] group"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#4a4bd7] shrink-0" />
                    <span>Personal Portfolio</span>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-[#4a4bd7] truncate max-w-[120px]">
                    {user.profile?.portfolioLinks?.[0] ? user.profile.portfolioLinks[0].replace(/^https?:\/\/(www\.)?/, '') : 'portfolio.dev'}
                  </span>
                </a>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs mt-auto">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Member since</span>
                <span className="font-bold text-slate-700 text-xs mt-0.5 block">2026</span>
              </div>
              <div>
                <span className="text-slate-450 font-bold block uppercase text-[9px] tracking-wider">Response Time</span>
                <span className="font-bold text-slate-700 text-xs mt-0.5 block">1 hour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Compartment: Portfolio & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio & Active Gigs (col-span-2) */}
          <div className="lg:col-span-2 space-y-6">
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
                      <h3 className="font-bold text-slate-855 text-xs line-clamp-2 leading-tight group-hover:text-[#4a4bd7] transition-colors">
                        {gig.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Star className="w-3.5 h-3.5 text-amber-550 fill-amber-500" />
                        <span className="font-bold text-slate-700">{gig.rating.toFixed(1)}</span>
                        <span>({gig.reviewsCount})</span>
                      </div>
                      <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between mt-2">
                        <span className="text-[10px] text-slate-400 font-medium">Starting at</span>
                        <span className="text-xs font-black text-slate-800">₹{gig.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Client Reviews (col-span-1) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#4a4bd7]" />
                <span>Client Reviews ({mockReviews.length})</span>
              </h2>

              <div className="space-y-6">
                {mockReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${rev.bg}`}
                        >
                          {rev.initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-850">{rev.author}</h4>
                          <p className="text-xs text-slate-400 font-semibold">{rev.company}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-0.5 justify-end">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium">{rev.date}</p>
                      </div>
                    </div>
                    <p className="text-slate-655 text-xs leading-relaxed pl-13">
                      {`"${rev.comment}"`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
      <Footer />

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
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Edit Your Profile
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Keep your details up to date for potential client views.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-450 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleSaveProfile}
                className="flex-1 overflow-y-auto py-6 space-y-6 pr-2"
              >
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
