import React from 'react';
import type { GigDetail } from '@/types/gig';
import { formatPrice } from '@/components/find-work/utils';

interface FreelancerCardProps {
  freelancer: GigDetail['freelancer'];
}

export const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#dce4e8]/80 shadow-[0_20px_45px_-15px_rgba(44,52,55,0.06)] flex flex-col gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#596064]">
        Service Provider
      </h3>

      <div className="flex items-center gap-4">
        {freelancer.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={freelancer.image}
            alt={freelancer.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#4a4bd7]/20"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4a4bd7] to-[#842cd3] flex items-center justify-center text-white font-bold text-xl">
            {freelancer.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-headline font-bold text-[#2c3437] text-base truncate">
              {freelancer.name}
            </h4>
            <span
              className="material-symbols-outlined text-[#4a4bd7]"
              style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
              title="Verified Freelancer"
            >
              verified
            </span>
          </div>
          {freelancer.profile?.title && (
            <p className="text-xs text-[#596064] truncate">{freelancer.profile.title}</p>
          )}
          {freelancer.profile?.hourlyRate && (
            <p className="text-xs text-[#4a4bd7] font-semibold mt-0.5">
              Standard Rate: {formatPrice(freelancer.profile.hourlyRate)}/hr
            </p>
          )}
        </div>
      </div>

      {freelancer.profile?.skills && freelancer.profile.skills.length > 0 && (
        <div className="pt-3 border-t border-[#dce4e8]/60 flex flex-wrap gap-1.5">
          {freelancer.profile.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 bg-[#f0dbff] text-[#7614c4] text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
          {freelancer.profile.skills.length > 4 && (
            <span className="text-xs text-[#596064] self-center">
              +{freelancer.profile.skills.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};
