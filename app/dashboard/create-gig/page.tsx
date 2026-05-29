'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/lib/auth/auth-client';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, UploadCloud, X, Loader2, Sparkles } from 'lucide-react';
import { AppNavbar } from '@/components/AppNavbar';
import { Footer } from '@/components/Footer';

// Define user types matching session user structure
interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  role?: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  image?: string | null;
}

export default function CreateGigPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [deliveryTime, setDeliveryTime] = useState<number | ''>('');
  const [images, setImages] = useState<string[]>([]); // base64 strings
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verification state: only logged-in freelancers can create gigs
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/login');
      } else {
        const role = (session.user as SessionUser).role;
        if (role !== 'FREELANCER') {
          toast.error('Only freelancers are allowed to create gigs.');
          router.push('/dashboard');
        } else {
          setIsVerifying(false);
        }
      }
    }
  }, [isPending, session, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };

  const processFiles = (files: FileList) => {
    const filesArray = Array.from(files);

    filesArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return;
      }

      // Max size: 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImages((prev) => [...prev, base64String]);
        setImagePreviews((prev) => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !price || !deliveryTime) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image showing proof or portfolio of your service.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/gigs/create', {
        title,
        description,
        category,
        price: Number(price),
        deliveryTime: Number(deliveryTime),
        images,
      });

      if (response.data?.success) {
        toast.success('Your Gig is live and active!');
        router.push('/profile');
      } else {
        toast.error(response.data?.message || 'Failed to create gig.');
      }
    } catch (err: unknown) {
      console.error(err);
      let msg = 'Something went wrong. Please check your inputs.';
      if (err && typeof err === 'object' && 'response' in err) {
        const errorWithResponse = err as { response?: { data?: { message?: string } } };
        msg = errorWithResponse.response?.data?.message || msg;
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4a4bd7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Verifying details...</p>
        </div>
      </div>
    );
  }

  // Safe mapping of session.user
  const appNavbarUser = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 font-inter flex flex-col justify-between">
      <div>
        <AppNavbar user={appNavbarUser} />

        <main className="max-w-4xl mx-auto px-6 py-10">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#4a4bd7] transition-colors font-bold text-xs uppercase tracking-wider mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative p-8 md:p-10">
            {/* Background design */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/30 via-transparent to-transparent pointer-events-none"></div>

            {/* Header */}
            <div className="border-b border-slate-100 pb-6 mb-8">
              <span className="text-xs bg-[#4a4bd7]/10 text-[#4a4bd7] border border-[#4a4bd7]/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Services Marketplace
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-3 flex items-center gap-2">
                Create a New Gig <Sparkles className="w-6 h-6 text-amber-500" />
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Outline your service, set a competitive price, and upload portfolio images. Gigs are
                instantly discoverable by clients.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Gig Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Gig Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. I will design a high-converting landing page in Figma"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800 font-semibold"
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  {'Be descriptive. Start with words like "I will..." (Min. 5 characters).'}
                </p>
              </div>

              {/* Category & Pricing & Delivery Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800 font-semibold"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Copywriting">Copywriting</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Starting Price (₹ INR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-450 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={100}
                      placeholder="e.g. 1500"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800 font-bold"
                    />
                  </div>
                </div>

                {/* Delivery Timeline */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Delivery Time (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 3"
                    value={deliveryTime}
                    onChange={(e) =>
                      setDeliveryTime(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Service Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Describe your gig in detail. What deliverables can clients expect? Why should they hire you?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all text-slate-800 leading-relaxed"
                />
                <div className="text-right text-[10px] text-slate-400 font-semibold">
                  {description.length} / 2000 characters
                </div>
              </div>

              {/* Image Upload Zone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Portfolio / Proof Images <span className="text-red-500">*</span>
                </label>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-200 hover:border-[#4a4bd7]/50 bg-slate-50 hover:bg-slate-50/50 rounded-2xl p-8 text-center transition-all cursor-pointer relative group flex flex-col items-center justify-center min-h-[160px]"
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-[#4a4bd7] transition-colors mb-3" />
                  <p className="text-sm font-bold text-slate-700">
                    Drag and drop your images here, or{' '}
                    <span className="text-[#4a4bd7]">browse files</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    Supports PNG, JPG, JPEG, WEBP (Max 5MB each)
                  </p>
                </div>

                {/* Image Previews Grid */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1.5 right-1.5 bg-slate-900/60 hover:bg-red-600 text-white rounded-full p-1 transition-colors backdrop-blur-sm cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <Link
                  href="/dashboard"
                  className="hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-full text-sm border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#4a4bd7] hover:bg-[#3b3bc2] text-white font-bold py-3 px-8 rounded-full text-sm shadow-lg shadow-[#4a4bd7]/25 flex items-center gap-2 transition-all hover:scale-102 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Gig & Uploading...</span>
                    </>
                  ) : (
                    <span>Publish Gig</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
