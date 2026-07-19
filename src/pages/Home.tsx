import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Beaker, ChevronRight, Sparkles, Droplets, Check,
  MessageSquare, AlertCircle, ShieldCheck
} from "lucide-react";
import { PRODUCTS, BUSINESS_INFO, Product } from "../productsData";
import EnquiryModal from "../components/EnquiryModal";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Industries from "../components/Industries";

// Helper to assign icons to categories for visual design
export function getCategoryIcon(category: string) {
  switch (category) {
    case "Acids":
      return <Beaker className="w-5 h-5 text-red-500" />;
    case "Alkalis":
      return <Droplets className="w-5 h-5 text-teal-500" />;
    case "Solvents":
      return <Beaker className="w-5 h-5 text-emerald-500" />;
    case "Water Treatment Chemicals":
      return <Droplets className="w-5 h-5 text-blue-500" />;
    case "Salts & Minerals":
      return <Sparkles className="w-5 h-5 text-amber-500" />;
    case "Food Grade Chemicals":
      return <Check className="w-5 h-5 text-green-600" />;
    case "Specialty Chemicals":
      return <Beaker className="w-5 h-5 text-purple-500" />;
    default:
      return <Beaker className="w-5 h-5 text-[#123C74]" />;
  }
}

// Helper to assign soft colors for category highlights
export function getCategoryColor(category: string) {
  switch (category) {
    case "Acids":
      return { border: "border-red-100", bg: "bg-red-50", text: "text-red-700", accent: "bg-red-500" };
    case "Alkalis":
      return { border: "border-teal-100", bg: "bg-teal-50", text: "text-teal-700", accent: "bg-teal-500" };
    case "Solvents":
      return { border: "border-emerald-100", bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-500" };
    case "Water Treatment Chemicals":
      return { border: "border-cyan-100", bg: "bg-cyan-50", text: "text-cyan-700", accent: "bg-cyan-500" };
    case "Salts & Minerals":
      return { border: "border-amber-100", bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-500" };
    case "Food Grade Chemicals":
      return { border: "border-green-100", bg: "bg-green-50", text: "text-green-700", accent: "bg-green-600" };
    case "Specialty Chemicals":
      return { border: "border-purple-100", bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-500" };
    default:
      return { border: "border-blue-100", bg: "bg-blue-50", text: "text-blue-700", accent: "bg-[#123C74]" };
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleEnquireClick = (pName: string) => {
    setSelectedProduct(pName);
    setEnquiryModalOpen(true);
  };

  const handleViewDetailsClick = (pId: string) => {
    navigate(`/product/${pId}`);
    window.scrollTo(0, 0);
  };

  // Initially display 12 products
  const visibleProducts = showAllProducts ? PRODUCTS : PRODUCTS.slice(0, 12);

  return (
    <div className="font-sans bg-white text-gray-800">
      
      {/* 1. Hero Section - Soft Light Chemistry Design Replicated from Reference */}
      <Hero onEnquireClick={handleEnquireClick} />

      {/* 2. Horizontal Trust Bar (Directly below Hero - Recreated Exactly From Reference) */}
      <TrustBar />

      {/* 3. Company Overview / About Unistar */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Subtle background SVG graphic */}
        <div className="absolute top-1/2 right-10 pointer-events-none opacity-[0.02] z-0">
          <svg width="240" height="240" viewBox="0 0 100 100" className="text-[#123C74]">
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="40" x2="50" y2="20" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="60" x2="50" y2="80" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="1" />
            <line x1="60" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="15" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="85" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="15" cy="50" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="85" cy="50" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest pl-3 border-l-4 border-[#2FA8B8] self-start">
              Company Overview
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              A Trusted Partner in B2B Chemical Distribution & Logistics
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Unistar Chemicals is an established industrial supplier, serving key sectors with high-purity mineral acids, alkalis, solvents, and water treatment chemistry. By enforcing rigorous quality checkpoints and organizing a reliable pan-India logistics network, we protect manufacturers against batch inconsistency and production down-time.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              With deep chemical sourcing expertise and standard operations, we ensure safety, regulatory compliance, and transparent B2B pricing. Our mission is to anchor your supply chain with the scientific standards and responsive logistics your enterprise expects from a primary partner.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#123C74] hover:text-[#1E5A93] font-extrabold text-xs tracking-wider uppercase group"
              >
                <span>Read Vision, Mission & Core Values</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Stat Badges Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-[#F7FBFD] p-6 rounded-xl border border-blue-50/50 hover:border-[#123C74]/20 hover:shadow-sm transition-all text-center">
              <span className="block text-4xl font-black text-[#123C74]">ISO</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mt-2 block">9001:2015 Sourced</span>
            </div>
            <div className="bg-[#F7FBFD] p-6 rounded-xl border border-blue-50/50 hover:border-[#123C74]/20 hover:shadow-sm transition-all text-center">
              <span className="block text-4xl font-black text-[#123C74]">Active</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mt-2 block">Pan-India Fleet</span>
            </div>
            <div className="bg-[#F7FBFD] p-6 rounded-xl border border-blue-50/50 hover:border-[#123C74]/20 hover:shadow-sm transition-all text-center">
              <span className="block text-4xl font-black text-[#123C74]">100%</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mt-2 block">Quality Inspected</span>
            </div>
            <div className="bg-[#F7FBFD] p-6 rounded-xl border border-blue-50/50 hover:border-[#123C74]/20 hover:shadow-sm transition-all text-center">
              <span className="block text-4xl font-black text-[#123C74]">26+</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mt-2 block">Primary Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industries Section - Recreated Exactly From Reference */}
      <Industries />

      {/* 5. OUR PRODUCT PORTFOLIO */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Subtle background molecular graphic */}
        <div className="absolute bottom-10 left-10 pointer-events-none opacity-[0.02] z-0">
          <svg width="200" height="200" viewBox="0 0 100 100" className="text-[#123C74]">
            <path d="M30,20 L50,40 L70,20" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M50,40 L50,70" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="30" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="70" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="70" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-black text-[#123C74] uppercase tracking-widest">
              Our Product Portfolio
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
              High-Purity Industrial Formulations
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Sourced from ISO-certified manufacturing partners. Fully tested, consistent quality, secure industrial packaging.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.map((prod) => {
              const theme = getCategoryColor(prod.category);
              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-[#123C74]/30 transition-all duration-300 overflow-hidden flex flex-col group h-full"
                >
                  {/* Card Image Banner */}
                  <div className="h-36 bg-gray-950 relative overflow-hidden flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 opacity-25 group-hover:scale-105 transition-all duration-500">
                      <img
                        src={
                          prod.category === "Acids"
                            ? "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=500&auto=format&fit=crop"
                            : prod.category === "Water Treatment Chemicals"
                            ? "https://images.unsplash.com/photo-1548826879-189db8744311?q=80&w=500&auto=format&fit=crop"
                            : prod.category === "Solvents"
                            ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=500&auto=format&fit=crop"
                            : prod.category === "Salts & Minerals"
                            ? "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500&auto=format&fit=crop"
                            : "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=500&auto=format&fit=crop"
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Dark gradient mask */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent"></div>

                    {/* Formula typography badge */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white font-mono font-bold text-xs px-2.5 py-1 rounded border border-white/20">
                      {prod.formula}
                    </div>

                    {/* Category Label */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-gray-900/90 text-white rounded px-2.5 py-1 border border-gray-800">
                      {getCategoryIcon(prod.category)}
                      <span className="text-[10px] uppercase tracking-wider font-extrabold">
                        {prod.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col gap-3.5 flex-grow">
                    <div>
                      <h3 className="font-black text-gray-900 text-base md:text-lg group-hover:text-[#123C74] transition-colors">
                        {prod.name}
                      </h3>
                      <span className="text-[10px] font-mono text-[#2FA7B8] font-bold">
                        Formula ID: {prod.formula}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 font-medium">
                      {prod.description}
                    </p>

                    {/* Applications Preview */}
                    <div className="flex flex-col gap-1.5 pt-1.5 border-t border-gray-100">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                        Primary Applications
                      </span>
                      <ul className="flex flex-wrap gap-1">
                        {prod.applications.slice(0, 2).map((app, index) => (
                          <li
                            key={index}
                            className="text-[10px] font-extrabold bg-[#F4FAFC] text-gray-700 px-2 py-0.5 rounded border border-gray-100"
                          >
                            {app}
                          </li>
                        ))}
                        {prod.applications.length > 2 && (
                          <li className="text-[10px] font-extrabold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                            +{prod.applications.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Packaging */}
                    <div className="bg-[#F7FBFD] border border-blue-50/50 p-2.5 rounded text-[11px] text-gray-700 flex items-start gap-1.5 mt-auto">
                      <AlertCircle className="w-3.5 h-3.5 text-[#123C74] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#123C74] uppercase text-[10px] tracking-wide block font-extrabold">Packaging</strong>
                        {prod.packaging}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-gray-50 border-t border-gray-100 px-5 py-3.5 grid grid-cols-2 gap-2.5 shrink-0">
                    <button
                      onClick={() => handleViewDetailsClick(prod.id)}
                      className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded font-extrabold text-xs uppercase tracking-wider text-center transition-all"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEnquireClick(prod.name)}
                      className="px-3 py-2 bg-[#123C74] hover:bg-[#1E5A93] text-white rounded font-extrabold text-xs uppercase tracking-wider text-center transition-all shadow-xs"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show All Products Button */}
          {!showAllProducts && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAllProducts(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#123C74] hover:bg-[#1E5A93] text-white rounded font-extrabold text-xs tracking-widest uppercase transition-all shadow-md"
                id="show-all-products-btn"
              >
                <span>Show All 26 Products</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Quality Assurance */}
      <section className="py-20 px-4 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            {/* Visual chemistry image */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1608155686393-8fdd966d784d?q=80&w=600&auto=format&fit=crop"
                alt="Unistar Chemical QC Quality Assurance Lab Equipment"
                className="w-full h-80 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative stamp overlay */}
            <div className="absolute -bottom-6 -right-6 bg-white border-2 border-[#123C74] p-4 rounded-xl shadow-lg flex items-center gap-2 max-w-[210px] z-10">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div className="text-xs leading-tight">
                <span className="font-black uppercase tracking-wider text-[#123C74] block">QC PASSED</span>
                <span className="text-gray-500 font-extrabold text-[9px]">BATCH VERIFIED SOURCING</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5 lg:pl-6 mt-6 lg:mt-0">
            <span className="text-xs font-black text-[#123C74] uppercase tracking-widest pl-2 border-l-4 border-[#2FA7B8]">
              Strict Quality Parameters
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
              Rigorous Quality Checks, Compliant Standards
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              At Unistar Chemicals, every product is sourced from trusted and established manufacturers and undergoes careful quality checks before dispatch. Materials are verified for consistency, purity, and compliance with recognized industry standards, ensuring that each consignment meets the specifications our customers expect.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              This disciplined approach to quality helps us build lasting trust, minimize batch variability, and deliver dependable performance across every order we supply. Detailed certificates of analysis (COA), safety data sheets (MSDS), and specifications sheets are available immediately upon customer request.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-gray-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Certificate of Analysis (COA) with each batch</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-gray-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Secure robust industrial packaging</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-gray-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>MSDS and hazard documentation available</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-gray-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Pan-India logistics tracking support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action - Premium Navy Graphic */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-[#123C74] to-[#0D2951] text-white text-center overflow-hidden">
        
        {/* Soft chemistry overlay in CTA */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0,0 L 100,100 M 100,0 L 0,100" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="25" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="80" cy="75" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
            Need Premium Industrial Chemicals?
          </h2>
          <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
            Get in touch with Unistar Chemicals procurement and logistics desk today. We supply high-purity chemical solutions designed to optimize your manufacturing processes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white hover:bg-gray-100 text-[#123C74] rounded-md font-extrabold text-xs tracking-widest uppercase transition-colors shadow-md"
            >
              Request a Quote Today
            </Link>
            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}
              className="px-8 py-3.5 bg-[#2FA7B8] hover:bg-[#208A9A] text-white rounded-md font-extrabold text-xs tracking-widest uppercase transition-colors"
            >
              Call: {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Global Enquiry Popup */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productName={selectedProduct}
      />
    </div>
  );
}
