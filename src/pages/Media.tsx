import { useState, useEffect, useMemo, useRef, TouchEvent } from "react";
import { 
  Play, 
  Download, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Calendar, 
  MapPin, 
  Maximize2, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Share2, 
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { mediaService } from "../services/mediaService";
import { MediaItem, CorporateResource } from "../types/media";
import CatalogueDownloadModal from "../components/CatalogueDownloadModal";
import { BUSINESS_INFO } from "../productsData";

// Corporate download resource definitions
const CORPORATE_RESOURCES: CorporateResource[] = [
  {
    id: "company-profile",
    title: "Company Profile 2026",
    description: "Detailed corporate summary, manufacturing values, network capabilities, and ISO compliance certificates.",
    fileSize: "4.2 MB",
    fileType: "PDF Document",
    downloadUrl: "/catalogues/Unistar_Chemicals_Product_Catalogue.pdf" // Using same valid PDF for demo/safe-handling
  },
  {
    id: "corporate-brochure",
    title: "Corporate Brochure",
    description: "Elegant bento-grid overview of Unistar chemical logistics, bulk delivery, and industrial supply lines.",
    fileSize: "2.8 MB",
    fileType: "PDF Document",
    downloadUrl: "/catalogues/Unistar_Chemicals_Product_Catalogue.pdf"
  },
  {
    id: "product-catalogue",
    title: "Product Catalogue (Complete)",
    description: "Full specifications sheets for all acids, alkalis, solvents, and water treatment compounds.",
    fileSize: "1.9 MB",
    fileType: "PDF Document",
    downloadUrl: "/catalogues/Unistar_Chemicals_Product_Catalogue.pdf"
  },
  {
    id: "logo-package",
    title: "Corporate Logo Package",
    description: "Unistar logo variations (PNG, SVG, EPS) with transparent and dark backgrounds.",
    fileSize: "5.5 MB",
    fileType: "ZIP Archive",
    downloadUrl: "/logo.svg"
  },
  {
    id: "brand-guidelines",
    title: "Brand Style Guidelines",
    description: "Color palette specifications, typography scales, spacing tokens, and corporate design standards.",
    fileSize: "1.5 MB",
    fileType: "PDF Document",
    downloadUrl: "/catalogues/Unistar_Chemicals_Product_Catalogue.pdf"
  }
];

export default function Media() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [gallerySubFilter, setGallerySubFilter] = useState<string>("All");
  
  // Modals & Interactivity
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [catalogueDownloadOpen, setCatalogueDownloadOpen] = useState(false);
  const [selectedDownloadResource, setSelectedDownloadResource] = useState<string>("");

  // Refs for scrolling and touch support
  const mediaContentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Set Page Meta & Fetch Items
  useEffect(() => {
    document.title = "Official Corporate Media Center | Unistar Chemicals";
    
    // Dynamic Firestore Load
    const loadMediaData = async () => {
      try {
        setLoading(true);
        const fetchedItems = await mediaService.getMediaItems();
        setMediaItems(fetchedItems);
      } catch (err) {
        console.error("Failed to fetch media data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMediaData();
  }, []);

  // Filter Categories
  const tabs = ["All", "Media Coverage", "Videos", "Gallery", "News & Articles"];

  // Gallery Subcategories (From Section 5 specifications)
  const gallerySubCategories = [
    "All",
    "Warehouse",
    "Products",
    "Packaging",
    "Dispatch",
    "Events",
    "Infrastructure",
    "Team"
  ];

  // Segmented arrays from data
  const featuredStory = useMemo(() => {
    return mediaItems.find((item) => item.featured) || mediaItems[0];
  }, [mediaItems]);

  const mediaCoverageItems = useMemo(() => {
    return mediaItems.filter((item) => item.category === "Media Coverage");
  }, [mediaItems]);

  const videoItems = useMemo(() => {
    return mediaItems.filter((item) => item.category === "Videos");
  }, [mediaItems]);

  const galleryItems = useMemo(() => {
    const rawGallery = mediaItems.filter((item) => item.category === "Gallery");
    if (gallerySubFilter === "All") return rawGallery;
    return rawGallery.filter((item) => {
      // Simple tag matches against title or description slug
      const slugLower = item.slug.toLowerCase();
      const titleLower = item.title.toLowerCase();
      const subLower = gallerySubFilter.toLowerCase();
      return slugLower.includes(subLower) || titleLower.includes(subLower);
    });
  }, [mediaItems, gallerySubFilter]);

  const newsItems = useMemo(() => {
    return mediaItems.filter((item) => item.category === "News & Articles" && !item.featured);
  }, [mediaItems]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNextLightbox();
      if (e.key === "ArrowLeft") handlePrevLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, galleryItems]);

  const handlePrevLightbox = () => {
    if (lightboxIndex === null || galleryItems.length === 0) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryItems.length - 1));
  };

  const handleNextLightbox = () => {
    if (lightboxIndex === null || galleryItems.length === 0) return;
    setLightboxIndex((prev) => (prev !== null && prev < galleryItems.length - 1 ? prev + 1 : 0));
  };

  // Touch Swipe for mobile Lightbox
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextLightbox();
      } else {
        handlePrevLightbox();
      }
      touchStartX.current = null;
    }
  };

  // Scroll to Content Section
  const handleScrollToContent = () => {
    mediaContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Trigger Resource Download Lead capture
  const triggerResourceDownload = (resourceTitle: string) => {
    setSelectedDownloadResource(resourceTitle);
    setCatalogueDownloadOpen(true);
  };

  // Stagger Animations Helper
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  return (
    <div className="font-sans bg-white text-gray-800 flex-grow">
      
      {/* SECTION 1: HERO */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#123C74] to-[#081E3B] text-white">
        {/* Soft Industrial Warehouse Background Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80')" }}
        />
        
        {/* Subtle Interactive Molecular Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
          <svg className="w-full h-full">
            <circle cx="10%" cy="20%" r="4" className="fill-blue-400/50 animate-pulse" />
            <circle cx="85%" cy="15%" r="6" className="fill-cyan-400/30 animate-ping" />
            <circle cx="30%" cy="80%" r="5" className="fill-[#2FA8B8]/50" />
            <circle cx="75%" cy="75%" r="3" className="fill-white/40 animate-pulse" />
            <line x1="10%" y1="20%" x2="30%" y2="80%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="85%" y1="15%" x2="75%" y2="75%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </svg>
        </div>

        {/* Hero Content - Deeply premium typography */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-extrabold text-[#2FA8B8] uppercase tracking-[0.3em] bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            Corporate Newsroom & Media
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white"
          >
            Media Center
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl leading-relaxed font-medium"
          >
            Explore our corporate journey through media coverage, product showcases, project highlights, videos, industry updates, and corporate events.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            onClick={handleScrollToContent}
            className="mt-4 px-8 py-4 bg-[#2FA8B8] hover:bg-[#258e9c] text-white rounded-[12px] font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg hover:-translate-y-[2px]"
          >
            Explore Media
          </motion.button>
        </div>
      </section>

      {/* SECTION 2: CATEGORY NAVIGATION (STICKY TABS) */}
      <div 
        ref={mediaContentRef}
        className="sticky top-[88px] z-30 bg-white border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="flex justify-start sm:justify-center items-center overflow-x-auto py-4 scrollbar-none gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setGallerySubFilter("All");
                  }}
                  className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shrink-0 relative ${
                    isActive 
                      ? "text-white bg-[#123C74] shadow-md" 
                      : "text-gray-500 hover:text-[#123C74] bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SKELETON LOADER */}
      {loading ? (
        <div className="max-w-7xl mx-auto py-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-[20px] p-5 flex flex-col gap-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-[12px]" />
              <div className="w-1/3 h-4 bg-gray-200 rounded" />
              <div className="w-3/4 h-6 bg-gray-200 rounded" />
              <div className="w-full h-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 flex flex-col gap-24">

          {/* SECTION 3: MEDIA COVERAGE */}
          {(activeTab === "All" || activeTab === "Media Coverage") && (
            <section className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 border-l-4 border-[#2FA8B8] pl-4">
                <span className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest">
                  Corporate Events & Press Release
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                  Media Coverage
                </h2>
              </div>

              {mediaCoverageItems.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-500">
                  No media coverage items published yet.
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {mediaCoverageItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      variants={itemVariants}
                      className="bg-white border border-gray-100 rounded-[20px] overflow-hidden group hover:shadow-[0_15px_30px_rgba(18,60,116,0.06)] transition-all duration-300 flex flex-col"
                    >
                      {/* Event Image */}
                      <div className="relative h-56 w-full overflow-hidden bg-gray-100 shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {item.location && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-800 flex items-center gap-1.5 shadow-sm">
                            <MapPin className="w-3.5 h-3.5 text-[#2FA8B8]" />
                            {item.location}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-grow flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#2FA8B8]" />
                          {item.publishedAt}
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-[#123C74] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer CTA */}
                      <div className="px-6 pb-6 pt-2 shrink-0">
                        <button
                          onClick={() => triggerResourceDownload("Corporate Events Package")}
                          className="w-full h-11 border border-gray-200 hover:border-[#123C74] hover:bg-gray-50 text-gray-700 hover:text-[#123C74] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-250 flex items-center justify-center gap-2"
                        >
                          <span>Request Press Release</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          )}

          {/* SECTION 4: VIDEO LIBRARY */}
          {(activeTab === "All" || activeTab === "Videos") && (
            <section className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 border-l-4 border-[#2FA8B8] pl-4">
                <span className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest">
                  Audio & Visual Showcase
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                  Video Library
                </h2>
              </div>

              {videoItems.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-500">
                  No video library items published yet.
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {videoItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      variants={itemVariants}
                      className="bg-white border border-gray-100 rounded-[24px] overflow-hidden group hover:shadow-[0_15px_30px_rgba(18,60,116,0.06)] transition-all duration-300 flex flex-col md:flex-row h-auto md:h-60"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative w-full md:w-1/2 h-48 md:h-full bg-gray-100 overflow-hidden shrink-0">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <button
                            onClick={() => setVideoModalUrl(item.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ")}
                            className="w-14 h-14 bg-white/90 hover:bg-white text-[#123C74] rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110"
                            aria-label="Play Video"
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:w-1/2 flex flex-col justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400">
                            <VideoIcon className="w-3.5 h-3.5 text-[#2FA8B8]" />
                            Duration: 3-5 Mins
                          </div>
                          <h3 className="font-extrabold text-gray-900 text-base group-hover:text-[#123C74] transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        <button
                          onClick={() => setVideoModalUrl(item.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ")}
                          className="inline-flex items-center gap-1.5 font-bold text-[11px] text-[#123C74] hover:text-[#2FA8B8] uppercase tracking-wider transition-colors self-start"
                        >
                          <span>Launch Video Player</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          )}

          {/* SECTION 5: PHOTO GALLERY (MASONRY & LIGHTBOX) */}
          {(activeTab === "All" || activeTab === "Gallery") && (
            <section className="flex flex-col gap-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-4 border-[#2FA8B8] pl-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest">
                    Infrastructure & Operations
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                    Photo Gallery
                  </h2>
                </div>
                
                {/* Secondary Sub-Category Filter */}
                <div className="flex flex-wrap gap-1.5 max-w-full">
                  {gallerySubCategories.map((subCat) => {
                    const isSubActive = gallerySubFilter === subCat;
                    return (
                      <button
                        key={subCat}
                        onClick={() => setGallerySubFilter(subCat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                          isSubActive 
                            ? "bg-[#2FA8B8] text-white" 
                            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        {subCat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {galleryItems.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-500">
                  No images found for subcategory: "{gallerySubFilter}"
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                  {galleryItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="break-inside-avoid bg-white border border-gray-100 rounded-[20px] overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 relative cursor-pointer"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <div className="relative overflow-hidden w-full h-auto bg-gray-50">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                          <div className="flex flex-col gap-1.5 text-white">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FA8B8] flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {item.location || "Unistar Plant"}
                            </span>
                            <h4 className="font-extrabold text-sm uppercase tracking-wide leading-snug">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* SECTION 6: NEWS & ARTICLES */}
          {(activeTab === "All" || activeTab === "News & Articles") && (
            <section className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 border-l-4 border-[#2FA8B8] pl-4">
                <span className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest">
                  Insights & Industry Updates
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                  News & Articles
                </h2>
              </div>

              {newsItems.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-500">
                  No articles published yet.
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {newsItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      variants={itemVariants}
                      className="bg-white border border-gray-100 rounded-[24px] overflow-hidden group hover:shadow-[0_15px_30px_rgba(18,60,116,0.06)] transition-all duration-300 flex flex-col"
                    >
                      {/* Image cover */}
                      <div className="relative h-64 w-full bg-gray-100 overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-4 left-4 bg-[#123C74] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg tracking-widest uppercase shadow-sm">
                          {item.publishedAt}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 flex-grow flex flex-col justify-between gap-6">
                        <div className="flex flex-col gap-3">
                          <h3 className="font-extrabold text-gray-900 text-xl leading-snug group-hover:text-[#123C74] transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        {item.articleUrl && (
                          <a 
                            href={item.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-bold text-xs text-[#123C74] hover:text-[#2FA8B8] uppercase tracking-wider transition-colors self-start"
                          >
                            <span>Read Full Article</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          )}

          {/* SECTION 7: FEATURED STORY */}
          {(activeTab === "All" || activeTab === "News & Articles") && featuredStory && (
            <section className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 border-l-4 border-[#2FA8B8] pl-4">
                <span className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest">
                  Highlighted Press Highlight
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                  Featured Story
                </h2>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gray-900 text-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-800 flex flex-col lg:flex-row min-h-[440px]"
              >
                {/* Hero full-width dynamic image */}
                <div className="w-full lg:w-1/2 h-80 lg:h-auto relative bg-gray-950 overflow-hidden">
                  <img 
                    src={featuredStory.image} 
                    alt={featuredStory.title}
                    className="w-full h-full object-cover opacity-80 scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-gray-900 via-transparent to-transparent z-10" />
                </div>

                {/* Info and content */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center gap-6 relative z-10">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="px-3.5 py-1.5 bg-[#2FA8B8] text-white font-extrabold rounded-lg tracking-widest uppercase">
                      Featured
                    </span>
                    <span className="text-gray-400 font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredStory.publishedAt}
                    </span>
                    {featuredStory.location && (
                      <span className="text-gray-400 font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {featuredStory.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-2xl sm:text-3xl leading-snug tracking-tight text-white uppercase">
                    {featuredStory.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {featuredStory.description}
                  </p>

                  {featuredStory.articleUrl && (
                    <a 
                      href={featuredStory.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md self-start"
                    >
                      <span>Read Story Details</span>
                      <ExternalLink className="w-4 h-4 text-gray-900" />
                    </a>
                  )}
                </div>
              </motion.div>
            </section>
          )}

          {/* SECTION 8: CORPORATE RESOURCES */}
          <section className="flex flex-col gap-10 border-t border-gray-100 pt-16">
            <div className="flex flex-col gap-2 border-l-4 border-[#2FA8B8] pl-4">
              <span className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest">
                Media Kit & Documentation
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                Corporate Resources
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CORPORATE_RESOURCES.map((res) => (
                <div 
                  key={res.id}
                  className="bg-gray-50 border border-gray-100 hover:border-[#123C74] rounded-[20px] p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-6 group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-white rounded-xl text-[#123C74] shadow-sm border border-gray-100 group-hover:bg-[#123C74] group-hover:text-white transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 bg-white px-2.5 py-1 rounded-md border border-gray-100">
                        {res.fileSize}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base leading-snug group-hover:text-[#123C74] transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <button 
                    onClick={() => triggerResourceDownload(res.title)}
                    className="h-11 w-full bg-white hover:bg-[#123C74] hover:text-white text-gray-700 border border-gray-200 hover:border-[#123C74] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-250 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {res.fileType.split(" ")[0]}</span>
                  </button>
                </div>
              ))}

              {/* MEDIA CONTACT PANEL */}
              <div className="bg-gradient-to-br from-[#123C74] to-[#0A264D] text-white rounded-[20px] p-6 flex flex-col justify-between gap-6 shadow-md border border-blue-900/40">
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-[#2FA8B8] w-fit border border-white/5">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg uppercase tracking-wide leading-none pt-2">
                    Media Desk Contact
                  </h3>
                  <p className="text-blue-100 text-xs leading-relaxed">
                    Have press inquiries, collaboration proposals, or require official branding assets not listed in the media kit? Reach our public relations team.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between border-b border-white/10 pb-2 text-gray-300">
                    <span>Email:</span>
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="text-white hover:text-[#2FA8B8] font-bold">
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2 text-gray-300">
                    <span>Call Desk:</span>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="text-white hover:text-[#2FA8B8] font-bold">
                      {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </div>

                <a 
                  href={`mailto:${BUSINESS_INFO.email}?subject=Media%20Desk%20Inquiry`}
                  className="h-11 w-full bg-white hover:bg-white/90 text-gray-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Email Relations Desk</span>
                </a>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* VIDEO LIGHTBOX / MODAL PLAYER */}
      <AnimatePresence>
        {videoModalUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoModalUrl(null)}
              className="fixed inset-0 bg-black/90 cursor-pointer"
            />

            {/* Embed Video Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/10"
            >
              <button
                onClick={() => setVideoModalUrl(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors border border-white/10"
                aria-label="Close Video Player"
              >
                <X className="w-5 h-5" />
              </button>

              <iframe
                src={videoModalUrl}
                title="Unistar Corporate Player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PHOTO GALLERY LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryItems[lightboxIndex] && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 select-none p-4">
            {/* Direct Background click to exit */}
            <div 
              className="fixed inset-0 cursor-pointer"
              onClick={() => setLightboxIndex(null)}
            />

            {/* Top Bar with Title and Close */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FA8B8]">
                  {galleryItems[lightboxIndex].location || "Corporate Operations"}
                </span>
                <h4 className="font-extrabold text-base sm:text-lg uppercase">
                  {galleryItems[lightboxIndex].title}
                </h4>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10 transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Image Stage (Supports Touch Swipe) */}
            <div 
              className="relative w-full max-w-5xl h-[65vh] flex items-center justify-center z-10"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {/* Prev Button */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-4 z-20 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 text-white rounded-full transition-all border border-white/10"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Image Frame */}
              <motion.img 
                key={galleryItems[lightboxIndex].id}
                src={galleryItems[lightboxIndex].image} 
                alt={galleryItems[lightboxIndex].title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                referrerPolicy="no-referrer"
              />

              {/* Next Button */}
              <button
                onClick={handleNextLightbox}
                className="absolute right-4 z-20 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 text-white rounded-full transition-all border border-white/10"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Footer Caption */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-center text-gray-400 text-xs sm:text-sm z-10 bg-gradient-to-t from-black/80 to-transparent">
              <p className="max-w-xl mx-auto leading-relaxed">
                {galleryItems[lightboxIndex].description}
              </p>
              <div className="mt-3 text-[#2FA8B8] font-bold text-[11px] uppercase tracking-widest">
                Image {lightboxIndex + 1} of {galleryItems.length} • Swipe or use Keyboard Left / Right
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* RE-USABLE CATALOGUE DOWNLOAD LEAD CAPTURE FORM */}
      <CatalogueDownloadModal 
        isOpen={catalogueDownloadOpen}
        onClose={() => setCatalogueDownloadOpen(false)}
      />

    </div>
  );
}
