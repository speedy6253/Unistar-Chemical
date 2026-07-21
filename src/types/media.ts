export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  thumbnail: string;
  image: string;
  videoUrl?: string; // YouTube, Vimeo, or Self-hosted link
  articleUrl?: string; // Link to external news or details
  description: string;
  location?: string; // for events
  publishedAt: string; // "YYYY-MM-DD" or similar human readable date
  featured: boolean;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: any;
  updatedAt?: any;
  images?: string[];
}

export interface CorporateResource {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
}
