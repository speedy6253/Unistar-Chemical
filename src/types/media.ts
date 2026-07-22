export interface EventMedia {
  id?: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  sortOrder?: number;
}

export interface NewsLink {
  id?: string;
  source: string;
  logoUrl?: string;
  headline: string;
  date?: string;
  url: string;
}

export interface SocialLink {
  id?: string;
  platform: 'Twitter' | 'Facebook' | 'LinkedIn' | 'Instagram' | 'Government Posts' | string;
  url: string;
  title?: string;
  snippet?: string;
  date?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  sequenceNumber?: number;
  slug?: string;
  category?: string;
  type?: string;
  thumbnail?: string;
  image?: string;
  coverImage?: string;
  videoUrl?: string; // YouTube, Vimeo, or Self-hosted link
  articleUrl?: string; // Link to external news or details
  description: string;
  location?: string; // for events
  date?: string; // Event date
  publishedAt?: string; // "YYYY-MM-DD" or similar human readable date
  featured?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
  published?: boolean;
  createdAt?: any;
  updatedAt?: any;
  gallery?: string[];
  images?: string[];
  videos?: string[];
  media?: EventMedia[];
  newsLinks?: NewsLink[];
  socialLinks?: SocialLink[];
}

export interface CorporateResource {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
}

