import Link from 'next/link';
import { Briefcase, UserPlus } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Welcome to <span className="text-blue-900">KaamPay</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            To give you the best experience, please tell us how you&apos;ll be using the platform.
          </p>
        </div>

        {/* Options Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch mb-12">
          {/* Client Option */}
          <Link href="/register?role=client" className="flex-1 group">
            <div className="h-full bg-white border-2 border-transparent hover:border-blue-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer">
              <div className="w-20 h-20 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">I&apos;m a Client</h2>
              <p className="text-slate-600">
                I want to hire top talent and manage my projects securely.
              </p>
            </div>
          </Link>

          {/* Freelancer Option */}
          <Link href="/register?role=freelancer" className="flex-1 group">
            <div className="h-full bg-white border-2 border-transparent hover:border-blue-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer">
              <div className="w-20 h-20 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserPlus size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">I&apos;m a Freelancer</h2>
              <p className="text-slate-600">
                I want to find great gigs, work with clients, and get paid securely.
              </p>
            </div>
          </Link>
        </div>

        {/* Footer Section */}
        <div className="text-center">
          <p className="text-slate-600 text-lg">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-blue-900 font-semibold hover:underline hover:text-blue-800 transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
