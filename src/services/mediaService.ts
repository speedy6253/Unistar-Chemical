import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { MediaItem } from "../types/media";

// Standard Firestore Operation Types
enum OperationType {
  LIST = 'list',
  GET = 'get',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
  };
}

// Custom error handler conforming to firebase-integration guidelines
function logFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null, // Public read-only page, no active user auth required
    },
    operationType,
    path,
  };
  console.warn("Firestore Media Service Warning (Graceful Fallback Engaged): ", JSON.stringify(errInfo));
}

// Hardened premium corporate default dataset
export const PRELOADED_MEDIA_ITEMS: MediaItem[] = [
  // 1. Featured Story
  {
    id: "featured-story-1",
    title: "Unistar Chemicals Inaugurates Advanced Specialty Distillation Facility",
    slug: "unistar-inaugurates-specialty-distillation-facility",
    category: "News & Articles",
    type: "article",
    thumbnail: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://www.chemisttoday.com/unistar-expansion-2026",
    description: "In our pursuit of manufacturing excellence, Unistar Chemicals is proud to announce the formal commissioning of our new, high-tech chemical distillation unit. This facility doubles our supply capacity for high-purity solvents, specialty acids, and critical water treatment salts, catering directly to the rapidly growing pharmaceutical and paper processing sectors.",
    location: "Kolkata, West Bengal",
    publishedAt: "2026-06-15",
    featured: true,
    sortOrder: 1,
    isPublished: true,
  },
  // 2. Media Coverage
  {
    id: "media-coverage-1",
    title: "Unistar Stall Attracts Industry Leaders at ChemExpo India 2026",
    slug: "unistar-chemexpo-india-2026",
    category: "Media Coverage",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    description: "Our delegation successfully participated in the premier national industrial chemical exhibition in Mumbai. Over three days, we showcased our latest high-purity chemical range and engaged with over 250 prospective B2B clients, reinforcing Unistar’s position as a reliable, pan-India distribution partner.",
    location: "Nesco Center, Mumbai",
    publishedAt: "2026-03-10",
    featured: false,
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "media-coverage-2",
    title: "Annual Unistar Partner Summit & Distributor Meet 2026",
    slug: "annual-partner-summit-2026",
    category: "Media Coverage",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    description: "Unistar Chemicals brought together over 120 logistics, warehousing, and authorized distribution partners for a collaborative summit. The theme centered on 'Synergy & Supply Chain Resilience' to streamline chemical dispatch networks and maintain safe handling protocols across India.",
    location: "Aerocity, New Delhi",
    publishedAt: "2026-02-18",
    featured: false,
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "media-coverage-3",
    title: "International Industrial Inspection & Quality Audit",
    slug: "international-industrial-inspection-audit",
    category: "Media Coverage",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    description: "Unistar's main testing laboratory passed the rigorous ISO 9001:2015 surveillance audit with flying colors. The international inspection team praised our advanced trace analysis systems and our strict compliance with MSDS and COA standards.",
    location: "Kolkata Lab Facility",
    publishedAt: "2026-01-24",
    featured: false,
    sortOrder: 4,
    isPublished: true,
  },
  // 3. Videos
  {
    id: "video-1",
    title: "Unistar Chemicals B2B Corporate Overview",
    slug: "unistar-chemicals-corporate-overview",
    category: "Videos",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Premium embed player fallback
    description: "A professional walk-through of our state-of-the-art warehouses, dynamic logistics division, and our high-volume chemical packaging line. Learn how we maintain purity from source to destination.",
    publishedAt: "2026-04-05",
    featured: false,
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "video-2",
    title: "Precision Quality Assurance & Laboratory Protocols",
    slug: "precision-qa-lab-protocols",
    category: "Videos",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "An inside look at our advanced QC division in action. This video shows our step-by-step testing for pH levels, molecular assays, and batch consistency to ensure impeccable high-purity chemicals.",
    publishedAt: "2026-05-12",
    featured: false,
    sortOrder: 6,
    isPublished: true,
  },
  // 4. News & Articles
  {
    id: "news-article-1",
    title: "Decarbonizing Chemical Logistics: Unistar's Commitment to Green Supply Chains",
    slug: "decarbonizing-chemical-logistics-green-supply-chains",
    category: "News & Articles",
    type: "article",
    thumbnail: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://www.industrialpost.com/green-logistics-unistar",
    description: "As green regulations tighten across the chemical sector, Unistar is taking high-impact action. By integrating low-emission transport fleets and optimized distribution software, we are drastically shrinking our transportation carbon footprint while improving national delivery times.",
    publishedAt: "2026-05-20",
    featured: false,
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "news-article-2",
    title: "Addressing High-Purity Water Treatment Demands in Modern Paper Mills",
    slug: "high-purity-water-treatment-paper-mills",
    category: "News & Articles",
    type: "article",
    thumbnail: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    articleUrl: "https://www.paperandpulpindia.com/unistar-water-treatment-salt",
    description: "Modern high-volume paper manufacturing requires massive volumes of treated water. This article explores how Unistar’s specialty water treatment salts and flocculating agents help mills recycle up to 85% of process water while keeping machinery completely safe from mineral scaling.",
    publishedAt: "2026-04-29",
    featured: false,
    sortOrder: 8,
    isPublished: true,
  },
  // 5. Gallery Items (Used for Photos Section)
  {
    id: "gallery-1",
    title: "Primary Bulk Chemical Storage Area",
    slug: "bulk-storage-warehouse",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    description: "A look inside our primary warehouse. Clean rows of drums and safe, high-capacity racking structures.",
    location: "Kolkata Warehouse Unit A",
    publishedAt: "2026-01-10",
    featured: false,
    sortOrder: 9,
    isPublished: true,
  },
  {
    id: "gallery-2",
    title: "High Precision Lab Testing Setup",
    slug: "lab-testing-setup",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=1200&q=80",
    description: "State-of-the-art laboratory testing apparatus, checking pH, assay values, and compound purity.",
    location: "Unistar Analytical Lab",
    publishedAt: "2026-01-15",
    featured: false,
    sortOrder: 10,
    isPublished: true,
  },
  {
    id: "gallery-3",
    title: "Sealed Industrial Chemical Packaging",
    slug: "sealed-packaging-pallet",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    description: "Fumigated pallets of sealed high-quality bag packing, stacked securely and ready for national dispatch.",
    location: "Dispatch Area Wing 3",
    publishedAt: "2026-01-20",
    featured: false,
    sortOrder: 11,
    isPublished: true,
  },
  {
    id: "gallery-4",
    title: "Chemical Processing and Distillation Columns",
    slug: "distillation-columns-infrastructure",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80",
    description: "Stainless steel distillation setups handling continuous operations under optimal thermal conditions.",
    location: "Infrastructure Plant B",
    publishedAt: "2026-02-05",
    featured: false,
    sortOrder: 12,
    isPublished: true,
  },
  {
    id: "gallery-5",
    title: "Nationwide Chemical Logistics Fleet",
    slug: "logistics-fleet-dispatch",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    description: "Reliable logistics trucks lined up for daily dispatch, supplying major industrial clusters in West Bengal and beyond.",
    location: "Corporate Dispatch Terminal",
    publishedAt: "2026-02-12",
    featured: false,
    sortOrder: 13,
    isPublished: true,
  },
  {
    id: "gallery-6",
    title: "Senior Engineering and QA Teams",
    slug: "senior-engineering-qa-teams",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    description: "Our dedicated engineers conducting on-site chemical specifications reviews and routine machinery maintenance checks.",
    location: "Plant Distillation Bay 1",
    publishedAt: "2026-02-28",
    featured: false,
    sortOrder: 14,
    isPublished: true,
  }
];

export const mediaService = {
  /**
   * Fetch all published media items ordered by sortOrder
   */
  async getMediaItems(): Promise<MediaItem[]> {
    const path = "media";
    try {
      const q = query(
        collection(db, path),
        where("isPublished", "==", true),
        orderBy("sortOrder", "asc")
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Log info warning and return rich static fallbacks
        console.info("Firestore 'media' collection is empty. Utilizing preloaded corporate media items.");
        return PRELOADED_MEDIA_ITEMS;
      }

      const items: MediaItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title || "",
          slug: data.slug || "",
          category: data.category || "Gallery",
          type: data.type || "gallery",
          thumbnail: data.thumbnail || "",
          image: data.image || "",
          videoUrl: data.videoUrl,
          articleUrl: data.articleUrl,
          description: data.description || "",
          location: data.location,
          publishedAt: data.publishedAt || "",
          featured: !!data.featured,
          sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 99,
          isPublished: !!data.isPublished,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      return items;
    } catch (error) {
      logFirestoreError(error, OperationType.LIST, path);
      // Fail-safe graceful execution: fallback to high-quality data
      return PRELOADED_MEDIA_ITEMS;
    }
  }
};
