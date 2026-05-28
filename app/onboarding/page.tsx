'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/lib/auth/auth-client';
import api from '@/lib/axios';
import SplitScreenLayout from '@/components/onboarding/SplitScreenLayout';
import Step1_Rules from '@/components/onboarding/Step1_Rules';
import Step2_Experience from '@/components/onboarding/Step2_Experience';
import Step3_Purpose from '@/components/onboarding/Step3_Purpose';
import Step4_TitleBio from '@/components/onboarding/Step1_TitleBio';
import Step5_Skills from '@/components/onboarding/Step2_Skills';
import Step6_Pricing from '@/components/onboarding/Step3_Pricing';
import Step7_Review from '@/components/onboarding/Step4_Review';
import toast from 'react-hot-toast';

interface OnboardingData {
  experience: 'newbie' | 'worked_earlier' | 'working' | '';
  purpose: 'money' | 'experience' | 'full_time' | 'side_business' | '';
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    experience: '',
    purpose: '',
    title: '',
    bio: '',
    skills: [],
    hourlyRate: 25,
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [isPending, session, router]);

  // 2. Fetch full profile to verify onboarding status
  useEffect(() => {
    async function checkProfile() {
      if (!session) return;
      try {
        const response = await api.get('/auth/me');
        const user = response.data?.data?.user;

        // If user is a client, they don't need profile onboarding
        if (user && user.role === 'CLIENT') {
          router.push('/dashboard');
          return;
        }

        // If user already has profile details filled, they are onboarded
        if (user && user.profile && user.profile.title) {
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Error checking profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    if (session) {
      checkProfile();
    }
  }, [session, router]);

  if (isPending || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm">Preparing your session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleNext = (stepData?: Partial<OnboardingData>) => {
    if (stepData) {
      setFormData((prev) => ({ ...prev, ...stepData }));
    }
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/users/onboarding', formData);
      if (response.data?.success) {
        toast.success('Your profile is live!');
        router.push('/profile');
      } else {
        toast.error(response.data?.message || 'Failed to submit onboarding');
      }
    } catch (err: unknown) {
      let msg = 'Something went wrong. Please try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const errorWithResponse = err as { response?: { data?: { message?: string } } };
        msg = errorWithResponse.response?.data?.message || msg;
      }
      toast.error(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SplitScreenLayout currentStep={currentStep} totalSteps={7} onBack={handleBack}>
      <div className="relative w-full overflow-hidden py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="w-full relative"
          >
            {currentStep === 1 && <Step1_Rules onNext={handleNext} />}

            {currentStep === 2 && (
              <Step2_Experience selectedExperience={formData.experience} onNext={handleNext} />
            )}

            {currentStep === 3 && (
              <Step3_Purpose selectedPurpose={formData.purpose} onNext={handleNext} />
            )}

            {currentStep === 4 && (
              <Step4_TitleBio
                data={{ title: formData.title, bio: formData.bio }}
                onNext={handleNext}
              />
            )}

            {currentStep === 5 && (
              <Step5_Skills data={{ skills: formData.skills }} onNext={handleNext} />
            )}

            {currentStep === 6 && (
              <Step6_Pricing data={{ hourlyRate: formData.hourlyRate }} onNext={handleNext} />
            )}

            {currentStep === 7 && (
              <Step7_Review
                data={formData}
                userName={session.user.name}
                userImage={session.user.image ?? null}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </SplitScreenLayout>
  );
}
