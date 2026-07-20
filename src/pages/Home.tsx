import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import EnquiryModal from "../components/EnquiryModal";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Industries from "../components/Industries";

export default function Home() {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleEnquireClick = (pName: string) => {
    setSelectedProduct(pName);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="font-sans bg-white text-gray-800">
      
      {/* 1. Hero Section - Soft Light Chemistry Design with high-quality warehouse imagery */}
      <Hero onEnquireClick={handleEnquireClick} />

      {/* 2. Horizontal Trust Bar (Directly below Hero - Recreated Exactly From Reference) */}
      <TrustBar />

      {/* 3. About Unistar Chemicals (Short Introduction) */}
      <section className="py-24 px-4 bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-6">
          <div className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest self-center pl-3 border-l-4 border-[#2FA8B8]">
            About Unistar Chemicals
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight uppercase">
            A Leading B2B Industrial Chemical Distributor
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
            Unistar Chemicals is an established leader in industrial chemical distribution, serving key sectors across the nation with high-purity mineral acids, alkalis, solvents, and water treatment chemistries. By sourcing exclusively from trusted ISO-certified manufacturers, we ensure uncompromised consistency, purity, and compliance in every batch.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
            Our state-of-the-art warehousing infrastructure and robust logistics network are built to prevent supply chain disruptions, safeguarding our manufacturing clients from costly downtime.
          </p>
          <div className="pt-4 self-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#123C74] hover:bg-[#1E5A93] text-white rounded font-extrabold text-xs tracking-widest uppercase transition-all shadow-md group"
            >
              <span>Read Full Profile</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Unistar (Short Corporate Highlights) */}
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

        <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-black text-[#123C74] uppercase tracking-widest">
              Why Choose Unistar
            </span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
              Strengthening Your Industrial Supply Chain
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              We go beyond standard logistics to act as a foundational anchor for your chemical requirements.
            </p>
          </div>

          {/* Stat Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F7FBFD] p-8 rounded-xl border border-blue-50/50 hover:border-[#123C74]/20 hover:shadow-md transition-all flex flex-col gap-3">
              <span className="text-3xl font-black text-[#123C74]">ISO</span>
              <h3 className="font-extrabold text-gray-900 uppercase text-sm">9001:2015 Standards</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Sourced exclusively from verified manufacturing partners with rigorous quality protocols.
              </p>
            </div>
            <div className="bg-[#F7FBFD] p-8 rounded-xl border border-blue-50/50 hover:border-[#123C74]/20 hover:shadow-md transition-all flex flex-col gap-3">
              <span className="text-3xl font-black text-[#123C74]">100%</span>
              <h3 className="font-extrabold text-gray-900 uppercase text-sm">Batch Checked</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Every consignment undergoes careful quality verification prior to shipping and dispatch.
              </p>
            </div>
            <div className="bg-[#F7FBFD] p-8 rounded-xl border border-blue-50/50 hover:border-[#123C74]/20 hover:shadow-md transition-all flex flex-col gap-3">
              <span className="text-3xl font-black text-[#123C74]">Pan-India</span>
              <h3 className="font-extrabold text-gray-900 uppercase text-sm">Active Fleet</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Strategic transport assets ensure safe handling and on-time industrial deliveries nationwide.
              </p>
            </div>
            <div className="bg-[#F7FBFD] p-8 rounded-xl border border-blue-50/50 hover:border-[#123C74]/20 hover:shadow-md transition-all flex flex-col gap-3">
              <span className="text-3xl font-black text-[#123C74]">26+</span>
              <h3 className="font-extrabold text-gray-900 uppercase text-sm">Primary Products</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Complete, highly pure mineral acids, alkalis, solvents and water treatment catalogue.
              </p>
            </div>
          </div>
          
          <div className="text-center pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-[#123C74] border-2 border-[#123C74] rounded font-extrabold text-xs tracking-widest uppercase transition-all shadow-sm"
            >
              <span>Explore Our Infrastructure</span>
              <ChevronRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Industries Section - Recreated Exactly From Reference */}
      <Industries />

      {/* Industries CTA Link */}
      <div className="bg-gray-50/60 pb-20 border-b border-gray-100 text-center -mt-16 relative z-10">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#123C74] hover:bg-[#1E5A93] text-white rounded font-extrabold text-xs tracking-widest uppercase transition-all shadow-md group"
        >
          <span>Explore Company Operations</span>
          <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 6. Corporate Call-To-Action */}
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
            Looking for a reliable industrial chemical supplier?
          </h2>
          <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
            Get in touch with Unistar Chemicals procurement and logistics desk today. We supply high-purity chemical solutions designed to optimize your manufacturing processes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/products"
              className="px-8 py-3.5 bg-white hover:bg-gray-100 text-[#123C74] rounded-md font-extrabold text-xs tracking-widest uppercase transition-colors shadow-md"
            >
              Explore Products
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-[#2FA7B8] hover:bg-[#208A9A] text-white rounded-md font-extrabold text-xs tracking-widest uppercase transition-colors shadow-md"
            >
              Contact Us
            </Link>
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
