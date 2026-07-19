import { Droplets, Pill, Coffee, Grid, PaintRoller, Flame, Leaf, Building } from "lucide-react";

export default function Industries() {
  return (
    <section className="py-24 bg-gray-50/60 border-t border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header with Star and Lines */}
        <div className="flex flex-col items-center justify-center text-center gap-3 mb-14">
          <h2 className="text-xs font-black text-[#123C74] tracking-widest uppercase">
            INDUSTRIES WE SERVE
          </h2>
          <div className="flex items-center gap-3 w-full max-w-[240px]">
            <div className="h-[1px] bg-[#123C74]/20 flex-grow" />
            <span className="text-[#2FA8B8] text-[11px] font-black">★</span>
            <div className="h-[1px] bg-[#123C74]/20 flex-grow" />
          </div>
        </div>

        {/* Unified elegant grid container with thin borders and dividers exactly matching screenshot */}
        <div className="bg-white border border-[#123C74]/15 rounded-[24px] shadow-[0_10px_35px_rgba(18,60,116,0.03)] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-gray-100 overflow-hidden">
          {/* Item 1: Water Treatment */}
          <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#F7FBFD] transition-colors duration-300 group cursor-pointer">
            <div className="w-12 h-12 text-[#1D5A92] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Droplets className="w-8 h-8 text-[#1D5A92]" />
            </div>
            <span className="font-extrabold text-[11px] text-[#123C74] tracking-wider uppercase leading-tight">
              Water Treatment
            </span>
          </div>

          {/* Item 2: Pharmaceuticals */}
          <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#F7FBFD] transition-colors duration-300 group cursor-pointer">
            <div className="w-12 h-12 text-[#1D5A92] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Pill className="w-8 h-8 text-[#1D5A92]" />
            </div>
            <span className="font-extrabold text-[11px] text-[#123C74] tracking-wider uppercase leading-tight">
              Pharmaceuticals
            </span>
          </div>

          {/* Item 3: Food & Beverages */}
          <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#F7FBFD] transition-colors duration-300 group cursor-pointer">
            <div className="w-12 h-12 text-[#1D5A92] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Coffee className="w-8 h-8 text-[#1D5A92]" />
            </div>
            <span className="font-extrabold text-[11px] text-[#123C74] tracking-wider uppercase leading-tight">
              Food & Beverages
            </span>
          </div>

          {/* Item 4: Textile */}
          <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#F7FBFD] transition-colors duration-300 group cursor-pointer">
            <div className="w-12 h-12 text-[#1D5A92] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Grid className="w-8 h-8 text-[#1D5A92]" />
            </div>
            <span className="font-extrabold text-[11px] text-[#123C74] tracking-wider uppercase leading-tight">
              Textile
            </span>
          </div>

          {/* Item 5: Paints & Coatings */}
          <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#F7FBFD] transition-colors duration-300 group cursor-pointer">
            <div className="w-12 h-12 text-[#1D5A92] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <PaintRoller className="w-8 h-8 text-[#1D5A92]" />
            </div>
            <span className="font-extrabold text-[11px] text-[#123C74] tracking-wider uppercase leading-tight">
              Paints & Coatings
            </span>
          </div>

          {/* Item 6: Oil & Gas */}
          <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#F7FBFD] transition-colors duration-300 group cursor-pointer">
            <div className="w-12 h-12 text-[#1D5A92] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Flame className="w-8 h-8 text-[#1D5A92]" />
            </div>
            <span className="font-extrabold text-[11px] text-[#123C74] tracking-wider uppercase leading-tight">
              Oil & Gas
            </span>
          </div>

          {/* Item 7: Agriculture */}
          <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#F7FBFD] transition-colors duration-300 group cursor-pointer">
            <div className="w-12 h-12 text-[#1D5A92] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-8 h-8 text-[#1D5A92]" />
            </div>
            <span className="font-extrabold text-[11px] text-[#123C74] tracking-wider uppercase leading-tight">
              Agriculture
            </span>
          </div>

          {/* Item 8: Construction */}
          <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#F7FBFD] transition-colors duration-300 group cursor-pointer">
            <div className="w-12 h-12 text-[#1D5A92] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Building className="w-8 h-8 text-[#1D5A92]" />
            </div>
            <span className="font-extrabold text-[11px] text-[#123C74] tracking-wider uppercase leading-tight">
              Construction
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
