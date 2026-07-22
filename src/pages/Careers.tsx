import React from "react";
import CareersComponent from "../components/Careers";
import { Users, Building2, Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-b from-slate-900 via-[#123C74] to-[#0D2951] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-bold uppercase tracking-widest w-fit">
              <Users className="w-3.5 h-3.5 text-[#2FA8B8]" />
              <span>CAREERS AT UNISTAR</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              Careers
            </h1>

            <p className="text-xl font-bold text-blue-200 tracking-wide mt-1">
              Join Our Team
            </p>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl mt-2 font-medium">
              At Unistar Chemicals, we're always looking for passionate and talented professionals to grow with us. Explore our current openings and submit your application below.
            </p>
          </div>

        </div>
      </div>

      {/* Main Careers Content: Openings & Application Form */}
      <main className="py-12">
        <CareersComponent />
      </main>
    </div>
  );
}
