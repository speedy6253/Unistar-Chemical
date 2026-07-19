import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, MessageSquare, Truck } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onEnquireClick: (productName: string) => void;
}

export default function Hero({ onEnquireClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden w-full lg:h-[720px] flex items-center bg-white border-b border-gray-100/50">
      
      {/* 1. Background Gradient - Soft white-to-light-blue gradient with minimal corporate feeling */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7FBFD] via-[#DFF7FA]/20 to-white z-0 pointer-events-none" />
      
      {/* 2. Molecular network background - Subtle, opacity below 8% (6%), no distracting animations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg" className="text-[#2FA8B8]">
          <line x1="120" y1="150" x2="220" y2="200" stroke="currentColor" strokeWidth="1.5" />
          <line x1="220" y1="200" x2="220" y2="320" stroke="currentColor" strokeWidth="1.5" />
          <line x1="220" y1="320" x2="120" y2="370" stroke="currentColor" strokeWidth="1.5" />
          <line x1="120" y1="370" x2="50" y2="300" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="300" x2="120" y2="150" stroke="currentColor" strokeWidth="1.5" />
          
          <circle cx="120" cy="150" r="6" fill="currentColor" />
          <circle cx="220" cy="200" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="220" cy="320" r="6" fill="currentColor" />
          <circle cx="120" cy="370" r="5" fill="currentColor" />
          <circle cx="50" cy="300" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          
          <line x1="220" y1="200" x2="340" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3" />
          <circle cx="340" cy="150" r="5" fill="currentColor" opacity="0.7" />
          
          <g transform="translate(850, 80)">
            <line x1="0" y1="100" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" />
            <line x1="100" y1="50" x2="200" y2="100" stroke="currentColor" strokeWidth="1.5" />
            <line x1="200" y1="100" x2="200" y2="220" stroke="currentColor" strokeWidth="1.5" />
            <line x1="200" y1="220" x2="100" y2="270" stroke="currentColor" strokeWidth="1.5" />
            <line x1="100" y1="270" x2="0" y2="220" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="220" x2="0" y2="100" stroke="currentColor" strokeWidth="1.5" />
            
            <circle cx="0" cy="100" r="5" fill="currentColor" />
            <circle cx="100" cy="50" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="200" cy="100" r="5" fill="currentColor" />
            <circle cx="200" cy="220" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="270" r="5" fill="currentColor" />
            <circle cx="0" cy="220" r="6" fill="currentColor" />
          </g>

          <circle cx="400" cy="450" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="450" cy="420" r="2" fill="currentColor" opacity="0.4" />
          <line x1="400" y1="450" x2="450" y2="420" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          
          <circle cx="1300" cy="500" r="4" fill="currentColor" opacity="0.5" />
          <circle cx="1350" cy="550" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="1300" y1="500" x2="1350" y2="550" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>

      {/* 3. Main Content Container - 1320px max width, centered */}
      <div className="relative z-10 max-w-[1320px] mx-auto w-full px-4 lg:px-8 py-12 lg:py-0">
        
        {/* Fade-in Animation container (Duration: 600ms, pure opacity fade-in) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center"
        >
          {/* Left Side: 45% width, Massive Corporate Typography, Paragraph, and CTAs */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6 lg:pr-4 shrink-0">
            
            {/* Premium tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#2FA8B8]/20 text-[#123C74] text-xs font-bold uppercase tracking-widest rounded-full self-start shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#2FA8B8]" />
              ISO 9001:2015 Certified Supplier
            </div>
            
            {/* Headline - Bold, massive, uppercase, 3-line layout matching blueprint */}
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.1] text-[#123C74] uppercase font-sans flex flex-col">
              <span className="block">RELIABLE</span>
              <span className="block">INDUSTRIAL CHEMICAL</span>
              <span className="block">SOLUTIONS</span>
            </h1>

            {/* Supporting paragraph - max-width around 520px, soft gray text */}
            <p className="text-sm md:text-base text-gray-500 max-w-[520px] leading-relaxed font-medium">
              Your trusted partner in high-quality industrial chemicals for diverse industries with uncompromised quality, reliable supply, and competitive pricing.
            </p>

            {/* CTA Buttons - Premium corporate styling: Height 56px, Radius 14px, Gap 20px, Hover translateY(-2px) */}
            <div className="flex flex-col sm:flex-row gap-[20px] mt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto h-[56px] px-8 bg-[#123C74] hover:bg-[#1D5A92] text-white rounded-[14px] font-bold text-xs tracking-widest transition-all duration-250 shadow-xs hover:-translate-y-[2px] flex items-center justify-center gap-2 uppercase group"
              >
                <span>VIEW PRODUCTS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => onEnquireClick("General Industrial Chemical Bulk Supply")}
                className="w-full sm:w-auto h-[56px] px-8 bg-white hover:bg-gray-50 text-[#123C74] border-2 border-[#123C74] rounded-[14px] font-bold text-xs tracking-widest transition-all duration-250 shadow-xs hover:-translate-y-[2px] flex items-center justify-center gap-2 uppercase"
              >
                <span>REQUEST QUOTE</span>
                <MessageSquare className="w-4 h-4 text-[#123C74]" />
              </button>
            </div>

            {/* Subtle metrics section underneath */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 mt-4 max-w-md">
              <div>
                <span className="block text-2xl font-black text-[#123C74]">26+</span>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mt-1">Formulations</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-[#2FA8B8]">10+</span>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mt-1">Sectors served</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-[#123C74]">100%</span>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mt-1">Batch Verified</span>
              </div>
            </div>
          </div>

          {/* Right Side: 55% width, High-Quality Industrial Warehouse Scene */}
          <div className="w-full lg:w-[55%] relative">
            <div className="relative rounded-[20px] overflow-hidden shadow-2xl border border-gray-100 group bg-white">
              
              {/* Premium industrial dispatch image representing modern warehouse logistics with white tanker truck */}
              <img
                src="/assets/images/hero-warehouse.png"
                alt="Modern chemical logistics facility with heavy transport bulk tanker truck representing Unistar Chemicals supply chain"
                className="w-full h-[480px] object-cover filter brightness-[0.98] contrast-[1.02]"
                referrerPolicy="no-referrer"
              />

              {/* Premium Warehouse Wall Facade Signage */}
              <div className="absolute top-[12%] right-[10%] hidden md:flex items-center gap-3 bg-[#123C74]/5 backdrop-blur-[2px] border border-white/10 px-5 py-3 rounded-xl select-none pointer-events-none opacity-90 shadow-xs">
                <img src="/assets/logo/unistar-logo.jpeg" className="w-11 h-11 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" alt="Logo" />
                <div className="flex flex-col text-left">
                  <span className="font-sans font-black text-[17px] text-[#123C74] tracking-wide leading-none uppercase">UNISTAR CHEMICALS</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-4 h-[1.5px] bg-[#2FA8B8]" />
                    <span className="text-[7.5px] text-[#1E5A93] uppercase font-extrabold tracking-[0.18em] leading-none">TRUSTED CHEMISTRY. SUSTAINABLE FUTURE.</span>
                  </div>
                </div>
              </div>

              {/* Realistic Vehicle Decal on the Tanker Body */}
              <div className="absolute top-[52%] left-[10%] hidden md:flex items-center gap-3 py-2 px-4 select-none pointer-events-none opacity-[0.85] rotate-[-1.5deg] mix-blend-multiply">
                <img src="/assets/logo/unistar-logo.jpeg" className="w-9 h-9 object-contain filter saturate-120" alt="Logo" />
                <div className="flex flex-col text-left">
                  <span className="font-sans font-black text-[15px] text-[#123C74] tracking-wide leading-none uppercase">UNISTAR CHEMICALS</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-4 h-[1px] bg-[#2FA8B8]" />
                    <span className="text-[7px] text-[#1E5A93] uppercase font-extrabold tracking-[0.18em] leading-none">TRUSTED CHEMISTRY. SUSTAINABLE FUTURE.</span>
                  </div>
                </div>
              </div>

              {/* Clean Corporate Decal on Truck Cabin Door */}
              <div className="absolute bottom-[36%] right-[44%] hidden md:flex items-center gap-2 bg-white/30 backdrop-blur-[0.5px] border border-[#123C74]/10 px-2 py-1.5 rounded select-none pointer-events-none opacity-[0.88] scale-80 rotate-[-0.5deg]">
                <img src="/assets/logo/unistar-logo.jpeg" className="w-5 h-5 object-contain" alt="Logo" />
                <div className="flex flex-col text-left">
                  <span className="text-[7.5px] text-[#123C74] font-black tracking-wide leading-none uppercase">UNISTAR CHEMICALS</span>
                  <span className="text-[5px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 leading-none">ISO 9001:2015 CERTIFIED</span>
                </div>
              </div>

              {/* Dynamic Overlay Card representing active dispatch operations */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md border border-gray-100 p-4 rounded-xl flex items-center gap-4 shadow-lg">
                <div className="p-3 bg-[#DFF7FA] text-[#123C74] rounded-lg shrink-0">
                  <Truck className="w-6 h-6 animate-pulse text-[#123C74]" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#2FA8B8] tracking-widest block">Dispatch In Progress</span>
                  <p className="text-xs text-gray-700 font-bold mt-0.5 leading-normal">
                    White bulk chemical tankers departing loading bays daily for real-time dispatch across India.
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle background decorative card behind the image */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#123C74] to-[#2FA8B8] rounded-[20px] blur-lg opacity-25 -z-10 group-hover:opacity-35 transition-opacity" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
