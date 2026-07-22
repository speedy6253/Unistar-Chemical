import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, ArrowRight, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "../assets/logo.png";
import { BUSINESS_INFO } from "../productsData";
import EnquiryModal from "./EnquiryModal";

interface NavItem {
  name: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Careers", path: "/careers" },
  { name: "Quality", path: "/quality" },
  { name: "Media", path: "/media" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // Monitor scroll position to toggle compact sticky header & subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for Escape key to dismiss mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu drawer is expanded
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Determine active route or hash section
  const isPathActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" && !location.hash;
    }
    if (path.includes("#")) {
      const [basePath, hash] = path.split("#");
      const currentBase = basePath === "" ? "/" : basePath;
      return location.pathname === currentBase && location.hash === `#${hash}`;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        role="banner"
        className={`sticky top-0 z-50 bg-white border-b border-slate-200/80 transition-all duration-300 ease-in-out ${
          scrolled
            ? "py-2.5 shadow-md shadow-slate-900/5"
            : "py-4 shadow-sm shadow-slate-900/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* LEFT SIDE: Official Corporate Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/"
                aria-label="Unistar Chemicals - Return to Homepage"
                className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e7490] focus-visible:ring-offset-2 rounded-lg transition-transform"
              >
                {/* Logo Image - Pristine transparent background */}
                <img
                  src={logoImg}
                  alt="Unistar Chemicals Official Logo"
                  className={`object-contain transition-all duration-300 ease-in-out ${
                    scrolled ? "h-9 lg:h-10" : "h-10 lg:h-12"
                  } w-auto`}
                />

                {/* Company Name - Visible ONLY on Mobile & Tablet (< lg), Strictly HIDDEN on Desktop (lg+) */}
                <div className="flex flex-col lg:hidden">
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wider uppercase font-sans leading-none">
                    UNISTAR CHEMICALS
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest text-[#0e7490] uppercase mt-0.5">
                    Industrial B2B Solutions
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Desktop Navigation Menu */}
            <nav
              role="navigation"
              aria-label="Main Navigation"
              className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5"
            >
              {NAV_ITEMS.map((item) => {
                const active = isPathActive(item.path);
                const isHovered = hoveredPath === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onMouseEnter={() => setHoveredPath(item.path)}
                    onMouseLeave={() => setHoveredPath(null)}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e7490] ${
                      active
                        ? "text-[#0e7490] font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {/* Hover Glow Effect - Soft brand color ambient glow */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          layoutId="hoverGlow"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute inset-0 bg-[#0e7490]/10 rounded-lg shadow-[0_0_15px_rgba(14,116,144,0.18)] -z-10 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    {/* Menu Link Text */}
                    <span className="relative z-10">{item.name}</span>

                    {/* Active Route Premium Underline Indicator */}
                    {active && (
                      <motion.span
                        layoutId="activeUnderline"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#0e7490] rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE: Direct Phone & Request a Quote CTA */}
            <div className="hidden lg:flex items-center gap-5 shrink-0">
              {/* Phone Link */}
              <a
                href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 text-slate-700 hover:text-[#0e7490] text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e7490] rounded-md px-2 py-1 group"
                title="Call Unistar Chemicals Desk"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0e7490] group-hover:bg-[#0e7490] group-hover:text-white transition-colors duration-200">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{BUSINESS_INFO.phone}</span>
              </a>

              {/* Request a Quote Button */}
              <button
                onClick={() => setIsEnquiryOpen(true)}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-[#0e7490] hover:bg-[#0891b2] active:bg-[#155e75] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md hover:shadow-[#0e7490]/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e7490] focus-visible:ring-offset-2 cursor-pointer group"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* MOBILE CONTROLS */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEnquiryOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0e7490] text-white rounded-md shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Quote</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e7490]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE DRAWER SLIDE-OVER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Translucent Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Mobile Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Drawer"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={logoImg} alt="Unistar Chemicals" className="h-8 w-auto object-contain" />
                  <div className="flex flex-col">
                    <span className="font-extrabold text-slate-900 text-sm tracking-wider uppercase">
                      UNISTAR CHEMICALS
                    </span>
                    <span className="text-[9px] font-semibold tracking-widest text-[#0e7490] uppercase">
                      Corporate Navigation
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile navigation menu"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = isPathActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-colors min-h-[44px] ${
                        active
                          ? "bg-[#0e7490]/10 text-[#0e7490] font-bold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-4 h-4 ${active ? "text-[#0e7490]" : "text-slate-400"}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
                <a
                  href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-white border border-slate-200 text-slate-800 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-100 transition-colors min-h-[44px]"
                >
                  <Phone className="w-4 h-4 text-[#0e7490]" />
                  <span>Call {BUSINESS_INFO.phone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsEnquiryOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0e7490] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#0891b2] transition-colors min-h-[44px]"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Quote Request Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        productName="General Industrial Chemical Quote Request"
      />
    </>
  );
}
