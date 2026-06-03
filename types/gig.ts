// ─── Gig & Freelancer Types for Client Discovery ─────────────────────────────

export interface FreelancerProfile {
  title: string | null;
  bio: string | null;
  skills: string[];
  hourlyRate: number | null;
}

export interface GigFreelancer {
  id: string;
  name: string;
  image: string | null;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  images: string[];
  createdAt: string;
  updatedAt: string;
  freelancer: GigFreelancer;
}

export interface GigDetail extends Gig {
  freelancer: GigFreelancer & {
    createdAt: string;
    profile: FreelancerProfile | null;
  };
}

export interface GigSearchResponse {
  success: boolean;
  data: {
    gigs: Gig[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface GigDetailResponse {
  success: boolean;
  data: GigDetail;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'delivery_time';
