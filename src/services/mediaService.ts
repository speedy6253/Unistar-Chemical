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

// Hardened premium corporate default dataset conforming to full Media Centre requirements
export const PRELOADED_MEDIA_ITEMS: MediaItem[] = [
  // 1. Featured Event
  {
    id: "featured-event-1",
    title: "Unistar Receives National Chemical Safety & Industrial Excellence Award 2026",
    slug: "unistar-receives-national-chemical-safety-excellence-award-2026",
    category: "Award",
    type: "event",
    thumbnail: "https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&w=1600&q=80",
    date: "June 28, 2026",
    publishedAt: "2026-06-28",
    location: "Biswa Bangla Convention Centre, Kolkata",
    featured: true,
    isPublished: true,
    published: true,
    sortOrder: 1,
    description: "Unistar Chemicals was honored with the prestigious National Chemical Safety & Industrial Excellence Award by the Bengal Chamber of Commerce & Industry in technical partnership with the Ministry of Chemicals. Recognized for maintaining 100% zero-incident compliance across our specialty distillation units, bulk solvent handling, and green water treatment salt production facilities.",
    gallery: [
      "https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    newsLinks: [
      {
        id: "nl-1",
        source: "The Economic Times - Chemical Bureau",
        headline: "Unistar Chemicals Awarded National Safety & Industrial Excellence Trophy",
        date: "June 29, 2026",
        url: "https://economictimes.indiatimes.com",
        logoUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "nl-2",
        source: "Chemical Weekly India",
        headline: "Bengal Conclave Spotlights Unistar's High-Purity Solvent Processing Innovations",
        date: "July 01, 2026",
        url: "https://www.chemicalweekly.com",
        logoUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=300&q=80"
      }
    ],
    socialLinks: [
      {
        id: "sl-1",
        platform: "LinkedIn",
        title: "Official Unistar Chemicals LinkedIn Press Release",
        snippet: "Proud moment as our Managing Director accepts the National Chemical Safety & Excellence Award 2026. Heartfelt gratitude to our 250+ plant operations team!",
        date: "June 28, 2026",
        url: "https://www.linkedin.com"
      },
      {
        id: "sl-2",
        platform: "Twitter",
        title: "Official Tweet @UnistarChem",
        snippet: "Delighted to be recognized for sustainable chemical processing and zero-harm workplace standards at #BengalIndustrialConclave2026.",
        date: "June 28, 2026",
        url: "https://twitter.com"
      },
      {
        id: "sl-3",
        platform: "Government Posts",
        title: "Ministry of Chemicals Official Portal Mention",
        snippet: "Acknowledging West Bengal's leading industrial chemical manufacturers adhering to green manufacturing protocols and ISO 9001:2015 safety standards.",
        date: "June 29, 2026",
        url: "https://www.india.gov.in"
      }
    ]
  },
  // 2. High Level Government Meeting
  {
    id: "event-2",
    title: "Bilateral Delegation Meeting with State Industrial & Chemical Commissioners",
    slug: "delegation-meeting-state-industrial-chemical-commissioners",
    category: "Government Meeting",
    type: "event",
    thumbnail: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80",
    date: "May 14, 2026",
    publishedAt: "2026-05-14",
    location: "Nabanna State Secretariat, Kolkata",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 2,
    description: "Unistar leadership met with senior officials from the Department of Industry, Commerce & Enterprises to review expansion plans for our specialized chemical storage park and eco-friendly effluent processing plant. The government commended Unistar's proactive safety protocols and investment in domestic chemical infrastructure.",
    gallery: [
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    newsLinks: [
      {
        id: "nl-3",
        source: "Business Standard Industrial Desk",
        headline: "Unistar Outlines ₹120 Crore Infrastructure Push for Green Chemical Processing",
        date: "May 15, 2026",
        url: "https://www.business-standard.com"
      }
    ],
    socialLinks: [
      {
        id: "sl-4",
        platform: "Government Posts",
        title: "WBIDC Official Social Broadcast",
        snippet: "Constructive dialogue with Unistar Chemicals on expanding sustainable chemical manufacturing corridors in Haldia and Kolkata hubs.",
        date: "May 14, 2026",
        url: "https://wbidc.org"
      }
    ]
  },
  // 3. Industry Event
  {
    id: "event-3",
    title: "Unistar Keynote Address & Product Pavilion at ChemExpo India 2026",
    slug: "unistar-keynote-address-chemexpo-india-2026",
    category: "Industry Event",
    type: "event",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    date: "April 22, 2026",
    publishedAt: "2026-04-22",
    location: "Nesco Exhibition Center, Mumbai",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 3,
    description: "Our technical team hosted over 350 international and domestic industrial delegates at ChemExpo India 2026. The pavilion showcased our ultra-pure pharmaceutical-grade solvents, paper pulp bleaching agents, and custom water clarification compounds.",
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    newsLinks: [
      {
        id: "nl-4",
        source: "The Telegraph Industrial Voice",
        headline: "Unistar Chemicals Showcases High-Volume Distillation Solutions at ChemExpo",
        date: "April 23, 2026",
        url: "https://www.telegraphindia.com"
      }
    ],
    socialLinks: [
      {
        id: "sl-5",
        platform: "LinkedIn",
        title: "Unistar ChemExpo Highlights Video & Post",
        snippet: "Huge thank you to all our B2B partners, clients, and technical auditors who visited our ChemExpo booth in Mumbai!",
        date: "April 24, 2026",
        url: "https://www.linkedin.com"
      },
      {
        id: "sl-6",
        platform: "Instagram",
        title: "Unistar B2B Expo Photo Gallery",
        snippet: "Behind the scenes with our technical sales engineers at India's premier B2B chemical exhibition.",
        date: "April 22, 2026",
        url: "https://www.instagram.com"
      }
    ]
  },
  // 4. Corporate Recognition & Partner Summit
  {
    id: "event-4",
    title: "Annual Unistar Partner Summit & Logistics Safety Workshop 2026",
    slug: "annual-partner-summit-logistics-safety-workshop-2026",
    category: "Corporate Recognition",
    type: "event",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    date: "March 18, 2026",
    publishedAt: "2026-03-18",
    location: "Aerocity Grand Convention Hall, New Delhi",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 4,
    description: "Bringing together 140+ authorized distributors, bulk tanker transport operators, and safety auditors across India. The summit focused on automated hazmat tracking, real-time GPS delivery monitoring, and MSDS protocol adherence.",
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
    ],
    videos: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    newsLinks: [
      {
        id: "nl-5",
        source: "Logistics & Supply Chain Digest",
        headline: "Unistar Chemicals Pioneers Automated Tanker Hazmat Safety Protocols",
        date: "March 20, 2026",
        url: "https://www.logisticsdigest.in"
      }
    ],
    socialLinks: [
      {
        id: "sl-7",
        platform: "Facebook",
        title: "Unistar Official Facebook Event Album",
        snippet: "Celebrating top-performing distributor partners and safety champions at our Delhi summit.",
        date: "March 19, 2026",
        url: "https://www.facebook.com"
      }
    ]
  },
  // 5. Videos
  {
    id: "video-1",
    title: "Unistar Chemicals B2B Corporate Overview & Manufacturing Facility Tour",
    slug: "unistar-chemicals-b2b-corporate-overview",
    category: "Videos",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "A comprehensive walk-through of our state-of-the-art chemical storage warehouses, dynamic fleet logistics division, and high-volume specialty distillation units.",
    date: "February 10, 2026",
    publishedAt: "2026-02-10",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 5
  },
  {
    id: "video-2",
    title: "Precision Quality Control & Advanced Laboratory Testing Protocols",
    slug: "precision-quality-control-advanced-lab-testing",
    category: "Videos",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "An inside look at our advanced QC division conducting molecular assays, purity titrations, and Certificate of Analysis (COA) verification prior to batch dispatch.",
    date: "January 15, 2026",
    publishedAt: "2026-01-15",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 6
  },
  // 6. Gallery Items
  {
    id: "gallery-1",
    title: "High-Volume Specialty Distillation Columns",
    slug: "high-volume-specialty-distillation-columns",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80",
    description: "Continuous operation stainless steel distillation towers operating under controlled pressure and temperature.",
    location: "Kolkata Plant - Bay A",
    date: "2026-01-20",
    publishedAt: "2026-01-20",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 7
  },
  {
    id: "gallery-2",
    title: "Analytical Testing & Spectrometry Laboratory",
    slug: "analytical-testing-spectrometry-laboratory",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&w=1200&q=80",
    description: "Certified chemical engineers validating raw material assays and finished product purity indices.",
    location: "Central QC Wing",
    date: "2026-01-25",
    publishedAt: "2026-01-25",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 8
  },
  {
    id: "gallery-3",
    title: "Sealed Hazmat Chemical Storage Warehouse",
    slug: "sealed-hazmat-chemical-storage-warehouse",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    description: "Climate-controlled palletized storage featuring explosion-proof lighting and automatic deluge fire suppression.",
    location: "Warehouse Complex 2",
    date: "2026-02-01",
    publishedAt: "2026-02-01",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 9
  },
  {
    id: "gallery-4",
    title: "Fumigated Pallet Packaging & Dispatch Line",
    slug: "fumigated-pallet-packaging-dispatch-line",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    description: "Heavy-duty HDPE drum stretch-wrapping and tamper-evident sealing prior to long-haul transport dispatch.",
    location: "Packaging Bay 3",
    date: "2026-02-15",
    publishedAt: "2026-02-15",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 10
  },
  {
    id: "gallery-5",
    title: "Nationwide Chemical Logistics & Fleet Terminal",
    slug: "nationwide-chemical-logistics-fleet-terminal",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    description: "GPS-enabled stainless steel tanker fleet lining up for inter-state bulk solvent and acid delivery.",
    location: "Transport Hub A",
    date: "2026-03-01",
    publishedAt: "2026-03-01",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 11
  },
  {
    id: "gallery-6",
    title: "Senior Engineering & Technical Operations Team",
    slug: "senior-engineering-technical-operations-team",
    category: "Gallery",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    description: "On-site chemical process engineers conducting safety audits and preventive maintenance checks.",
    location: "Main Plant Floor",
    date: "2026-03-10",
    publishedAt: "2026-03-10",
    featured: false,
    isPublished: true,
    published: true,
    sortOrder: 12
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
        const coverImg = data.coverImage || data.image || data.thumbnail || "";
        const mainImg = data.image || data.coverImage || data.thumbnail || "";
        const thumb = data.thumbnail || data.image || data.coverImage || "";
        const itemDate = data.date || data.publishedAt || "";

        const galleryArr = Array.isArray(data.gallery) && data.gallery.length > 0 
          ? data.gallery 
          : (Array.isArray(data.images) && data.images.length > 0 ? data.images : [mainImg || coverImg || thumb]);

        const videosArr = Array.isArray(data.videos) && data.videos.length > 0 
          ? data.videos 
          : (data.videoUrl ? [data.videoUrl] : []);

        const newsArr = Array.isArray(data.newsLinks) && data.newsLinks.length > 0 
          ? data.newsLinks 
          : (data.articleUrl ? [{ source: "Press Coverage", headline: data.title, url: data.articleUrl, date: itemDate }] : []);

        const socialArr = Array.isArray(data.socialLinks) ? data.socialLinks : [];

        // Parse or normalize unified media[] array
        let mediaArr = Array.isArray(data.media) && data.media.length > 0 ? data.media : [];

        const seqNum = typeof data.sequenceNumber === "number" ? data.sequenceNumber : (typeof data.sortOrder === "number" ? data.sortOrder : 99);

        items.push({
          id: doc.id,
          title: data.title || "",
          sequenceNumber: seqNum,
          slug: data.slug || "",
          category: data.category || "Gallery",
          type: data.type || "gallery",
          thumbnail: thumb,
          image: mainImg,
          coverImage: coverImg,
          videoUrl: data.videoUrl,
          articleUrl: data.articleUrl,
          description: data.description || "",
          location: data.location || "",
          date: itemDate,
          publishedAt: itemDate,
          featured: !!data.featured,
          sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : seqNum,
          isPublished: data.isPublished !== undefined ? !!data.isPublished : (data.published !== undefined ? !!data.published : true),
          published: data.published !== undefined ? !!data.published : (data.isPublished !== undefined ? !!data.isPublished : true),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          gallery: galleryArr,
          videos: videosArr,
          media: mediaArr,
          newsLinks: newsArr,
          socialLinks: socialArr,
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

