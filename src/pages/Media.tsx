import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Play, 
  Maximize2, 
  X, 
  Calendar, 
  MapPin, 
  Award, 
  Image as ImageIcon, 
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ShieldCheck,
  Video as VideoIcon,
  Layers,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { mediaData, EventSequence, MediaItem as SequenceMediaItem } from "../data/mediaData";

// Format YouTube Embed URL safely
function getYouTubeEmbedUrl(url: string, autoplay = false) {
  if (!url) return '';
  let embed = url;
  if (url.includes("watch?v=")) {
    embed = url.replace("watch?v=", "embed/");
  } else if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    embed = `https://www.youtube.com/embed/${id}`;
  } else if (!url.includes("embed/")) {
    embed = `https://www.youtube.com/embed/${url}`;
  }
  const cleanUrl = embed.split("?")[0];
  return `${cleanUrl}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
}

// Check if a media item is a YouTube video
function isYouTubeVideo(item: SequenceMediaItem): boolean {
  if (item.type === 'video') return true;
  if (!item.url) return false;
  return item.url.includes("youtube.com") || item.url.includes("youtu.be");
}

// Interactive 3D Glass Frame for the Slider
interface TiltGlassFrameProps {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function TiltGlassFrame({ children, className = "", onMouseEnter, onMouseLeave }: TiltGlassFrameProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) * 6;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
      className={`relative group/tilt ${className}`}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`,
          transition: rotateX === 0 && rotateY === 0 ? "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.08s ease-out",
        }}
        className="relative w-full rounded-2xl bg-[#0B182B]/90 border border-[#D4AF37]/30 group-hover/tilt:border-[#D4AF37] transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover/tilt:shadow-[0_25px_60px_rgba(212,175,55,0.3)] overflow-hidden backdrop-blur-xl p-3 sm:p-4"
      >
        {/* Specular Holographic Glass Reflection */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18) 0%, rgba(212,175,55,0.08) 40%, transparent 80%)`,
            opacity: glarePos.opacity,
          }}
        />

        {/* HUD Precision Corner Tech Markers */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/70 pointer-events-none z-30" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/70 pointer-events-none z-30" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/70 pointer-events-none z-30" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/70 pointer-events-none z-30" />

        {children}
      </div>
    </div>
  );
}

// PREMIUM MEDIA SLIDER COMPONENT (ONE SLIDER PER SEQUENCE)
interface SequenceMediaSliderProps {
  mediaItems: SequenceMediaItem[];
  eventTitle: string;
  onOpenLightbox: (url: string, title: string) => void;
}

function SequenceMediaSlider({ mediaItems, eventTitle, onOpenLightbox }: SequenceMediaSliderProps) {
  // Sort media ascending by order property
  const sortedMedia = useMemo(() => {
    return [...mediaItems].sort((a, b) => a.order - b.order);
  }, [mediaItems]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isPausedHover, setIsPausedHover] = useState(false);
  const [direction, setDirection] = useState<number>(1); // 1 = next, -1 = prev

  // Touch / Swipe handling
  const touchStartX = useRef<number | null>(null);

  const activeMedia = sortedMedia[currentIndex] || sortedMedia[0];

  // Reset video state when slide changes
  useEffect(() => {
    setIsPlayingVideo(false);
  }, [currentIndex]);

  // Autoplay timer
  useEffect(() => {
    if (sortedMedia.length <= 1 || isPlayingVideo || isPausedHover) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % sortedMedia.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sortedMedia.length, isPlayingVideo, isPausedHover]);

  const handleNext = () => {
    if (sortedMedia.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % sortedMedia.length);
  };

  const handlePrev = () => {
    if (sortedMedia.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + sortedMedia.length) % sortedMedia.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) handleNext();
    else if (diffX < -50) handlePrev();
    touchStartX.current = null;
  };

  if (!sortedMedia || sortedMedia.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center text-gray-500 text-xs">
        No Media Available
      </div>
    );
  }

  const isVideo = isYouTubeVideo(activeMedia);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* MAIN SLIDER STAGE WITH TILT GLASS FRAME */}
      <TiltGlassFrame 
        onMouseEnter={() => setIsPausedHover(true)}
        onMouseLeave={() => setIsPausedHover(false)}
        className="w-full"
      >
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full aspect-[4/3] sm:aspect-[16/11] min-h-[340px] sm:min-h-[420px] overflow-hidden rounded-xl bg-black/80 flex items-center justify-center"
        >
          {/* Slide Motion Transition */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -direction * 40, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full flex items-center justify-center p-2"
            >
              {isVideo ? (
                /* VIDEO SLIDE */
                isPlayingVideo ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeMedia.url, true)}
                    title={activeMedia.title || eventTitle}
                    className="w-full h-full border-0 rounded-lg shadow-2xl z-10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div 
                    onClick={() => setIsPlayingVideo(true)}
                    className="relative w-full h-full cursor-pointer overflow-hidden rounded-lg flex items-center justify-center group/vid"
                  >
                    <img 
                      src={activeMedia.thumbnail || activeMedia.url} 
                      alt={activeMedia.title || eventTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/vid:scale-105 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover/vid:bg-black/30 transition-all flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D4AF37] text-gray-950 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.9)] transition-transform group-hover/vid:scale-110">
                        <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-gray-950 ml-1" />
                      </div>
                      <span className="px-4 py-1.5 rounded-full bg-black/80 border border-[#D4AF37]/50 text-[#E5C158] font-bold text-xs uppercase tracking-widest backdrop-blur-md">
                        Play Video Briefing
                      </span>
                    </div>
                  </div>
                )
              ) : (
                /* UNCROPPED PORTRAIT / LANDSCAPE IMAGE SLIDE */
                <div 
                  onClick={() => onOpenLightbox(activeMedia.url, activeMedia.title || eventTitle)}
                  className="relative w-full h-full cursor-pointer flex items-center justify-center group/img overflow-hidden rounded-lg bg-black/40"
                >
                  <img 
                    src={activeMedia.url} 
                    alt={activeMedia.title || eventTitle}
                    className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover/img:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 pointer-events-none">
                    <span className="text-xs font-semibold text-gray-200 bg-black/75 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
                      <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Inspect High-Res
                    </span>
                    <div className="p-2.5 bg-[#D4AF37] text-gray-950 rounded-full shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* SLIDE COUNTER BADGE */}
          <div className="absolute top-4 left-4 z-30 px-3 py-1 rounded-full bg-black/75 border border-[#D4AF37]/40 text-[#E5C158] text-[11px] font-mono font-bold tracking-widest backdrop-blur-md shadow-md flex items-center gap-1.5 pointer-events-none">
            <span className="text-white">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{String(sortedMedia.length).padStart(2, '0')}</span>
          </div>

          {/* PREVIOUS / NEXT ARROWS (WHEN MORE THAN 1 MEDIA ITEM) */}
          {sortedMedia.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-gray-950 border border-[#D4AF37]/50 shadow-lg backdrop-blur-md transition-all duration-300 active:scale-95"
                title="Previous Media"
                aria-label="Previous Media"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-gray-950 border border-[#D4AF37]/50 shadow-lg backdrop-blur-md transition-all duration-300 active:scale-95"
                title="Next Media"
                aria-label="Next Media"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* MEDIA TITLE / CAPTION INSET AT BOTTOM */}
          {activeMedia.title && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-xl bg-black/80 border border-white/10 text-gray-200 text-xs text-center backdrop-blur-md max-w-[85%] truncate pointer-events-none">
              {activeMedia.title}
            </div>
          )}
        </div>
      </TiltGlassFrame>

      {/* THUMBNAIL NAVIGATION STRIP (ONLY IF MULTIPLE ITEMS) */}
      {sortedMedia.length > 1 && (
        <div className="w-full flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-[#D4AF37]/30 px-1">
          {sortedMedia.map((item, idx) => {
            const isActive = idx === currentIndex;
            const itemIsVideo = isYouTubeVideo(item);

            return (
              <button
                key={item.id || idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? "border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.8)] scale-105 opacity-100" 
                    : "border border-white/10 opacity-50 hover:opacity-100 hover:border-[#D4AF37]/50"
                }`}
                title={item.title || `Media #${idx + 1}`}
              >
                <img 
                  src={item.thumbnail || item.url} 
                  alt={item.title || `Thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {itemIsVideo && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                )}
                <div className="absolute top-0.5 left-0.5 px-1 rounded bg-black/80 text-[9px] font-mono text-gray-300">
                  {idx + 1}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// EVENT DESCRIPTION PANEL COMPONENT (DISPLAYED ONCE PER SEQUENCE)
interface EventDescriptionPanelProps {
  event: EventSequence;
  sequenceNumDisplay: string;
}

function EventDescriptionPanel({ event, sequenceNumDisplay }: EventDescriptionPanelProps) {
  return (
    <div className="w-full h-full bg-[#0B1A2E]/90 border border-[#D4AF37]/40 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group/desc">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Sequence Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#11233B] border border-[#D4AF37]/50 text-[#E5C158] text-xs font-bold uppercase tracking-[0.2em] shadow-md mb-4">
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>SEQUENCE #{sequenceNumDisplay}</span>
          <span className="text-gray-500">•</span>
          <span>{event.category || "Corporate Milestone"}</span>
        </div>

        {/* Event Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display leading-snug mb-4">
          {event.title}
        </h2>

        {/* Event Meta Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-300 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            {event.date}
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              {event.location}
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            {event.media.length} MEDIA ITEMS
          </div>
        </div>

        {/* Description Text */}
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal mb-6">
          {event.description}
        </p>
      </div>

      {/* Verification Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono mt-auto">
        <span className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          VERIFIED CORPORATE REPORT
        </span>
        <span>SEQ #{sequenceNumDisplay}</span>
      </div>
    </div>
  );
}

// SINGLE SEQUENCE COMPONENT (ONE EVENT = ONE SEQUENCE = ONE SLIDER + ONE DESCRIPTION)
interface EventSequenceStoryProps {
  key?: string | number;
  event: EventSequence;
  sequenceIndex: number;
  onOpenLightbox: (url: string, title: string) => void;
}

function EventSequenceStory({ event, sequenceIndex, onOpenLightbox }: EventSequenceStoryProps) {
  const sequenceNumDisplay = String(event.sequenceNumber || sequenceIndex + 1).padStart(2, '0');
  
  // Layout alternating:
  // Sequence 1 (index 0): Slider LEFT, Description RIGHT
  // Sequence 2 (index 1): Description LEFT, Slider RIGHT
  const isSliderLeft = sequenceIndex % 2 === 0;

  return (
    <section className="relative w-full my-12 sm:my-20 border-b border-[#D4AF37]/20 pb-16 sm:pb-24 last:border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* COLUMN 1 */}
          <div className={`w-full ${isSliderLeft ? "order-1" : "order-2 lg:order-1"}`}>
            {isSliderLeft ? (
              <SequenceMediaSlider 
                mediaItems={event.media} 
                eventTitle={event.title}
                onOpenLightbox={onOpenLightbox} 
              />
            ) : (
              <EventDescriptionPanel 
                event={event} 
                sequenceNumDisplay={sequenceNumDisplay} 
              />
            )}
          </div>

          {/* COLUMN 2 */}
          <div className={`w-full ${isSliderLeft ? "order-2" : "order-1 lg:order-2"}`}>
            {isSliderLeft ? (
              <EventDescriptionPanel 
                event={event} 
                sequenceNumDisplay={sequenceNumDisplay} 
              />
            ) : (
              <SequenceMediaSlider 
                mediaItems={event.media} 
                eventTitle={event.title}
                onOpenLightbox={onOpenLightbox} 
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

// MAIN MEDIA PAGE COMPONENT
export default function Media() {
  // Lightbox Modal for High-Res Portrait Inspection
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    title: "",
  });

  useEffect(() => {
    document.title = "Media Centre | Unistar Chemicals";
  }, []);

  // Sort sequences by sequenceNumber ascending directly from mediaData
  const sortedSequences = useMemo(() => {
    return [...mediaData].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }, []);

  const openLightbox = (url: string, title: string) => {
    setLightbox({ isOpen: true, url, title });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, url: "", title: "" });
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-sans bg-[#08101C] text-gray-100 min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-gray-950 overflow-x-hidden">

      {/* MINIMAL LUXURY CORPORATE HERO HEADER */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-b from-[#060D17] via-[#091526] to-[#08101C] border-b border-[#D4AF37]/20">
        {/* Holographic Background Grid & Tech Spotlights */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-4">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase font-display leading-none"
          >
            Media Centre
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg text-[#D4AF37] tracking-widest font-mono uppercase font-medium max-w-3xl"
          >
            Corporate Events • Awards • Government Meetings • Press Coverage
          </motion.p>
        </div>
      </section>

      {/* MAIN VERTICAL SEQUENCES LIST */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col">

        {sortedSequences.length === 0 ? (
          <div className="py-20 text-center bg-[#091526] border border-gray-800 rounded-2xl p-8 text-gray-400">
            No corporate sequences published at this moment.
          </div>
        ) : (
          sortedSequences.map((event, seqIdx) => (
            <EventSequenceStory 
              key={event.id || seqIdx} 
              event={event} 
              sequenceIndex={seqIdx}
              onOpenLightbox={openLightbox} 
            />
          ))
        )}

      </main>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 p-3.5 rounded-full bg-[#0B182B] hover:bg-[#D4AF37] text-white hover:text-gray-950 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 group/scroll"
        title="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 transition-transform group-hover/scroll:-translate-y-1" />
      </button>

      {/* LIGHTBOX MODAL FOR FULL RESOLUTION PORTRAIT INSPECTION */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
            <div className="fixed inset-0 cursor-pointer" onClick={closeLightbox} />

            <div className="relative z-10 max-w-5xl max-h-[90vh] flex flex-col items-center justify-center gap-4 p-2">
              <div className="w-full flex items-center justify-between text-white border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                  {lightbox.title}
                </span>
                <button
                  onClick={closeLightbox}
                  className="p-2 bg-white/10 hover:bg-[#D4AF37] text-white hover:text-gray-950 rounded-full transition-all border border-white/20"
                  aria-label="Close Inspection"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img 
                src={lightbox.url} 
                alt="High-Res Inspection"
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
