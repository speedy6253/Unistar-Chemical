export interface Product {
  id: string; // matches document ID, e.g., slug
  name: string;
  slug?: string;
  category: string;
  formula: string;
  description: string; // Maps to Short Description to maintain compatibility
  longDescription?: string;
  casNumber?: string;
  hsnCode?: string;
  applications: string[];
  keyBenefits: string[]; // Maps to Specifications to maintain compatibility with public details
  specifications?: string[]; // Optional additional specs list
  packaging: string;
  storageInstructions?: string;
  safetyInformation?: string;
  technicalNotes?: string;
  image?: string; // Main image (first of multiple images)
  images?: string[]; // Multiple images list
  pdfUrl?: string; // Product PDF Attachment
  featured?: boolean; // Featured product toggle
  isPublished?: boolean; // Publish toggle
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonicalUrl?: string;
  seoOgImage?: string;
  createdAt?: any;
  updatedAt?: any;
}
