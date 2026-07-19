import { 
  Building2, Eye, Award, ShieldCheck, HeartHandshake, MapPin, 
  Mail, Phone, Clock, Calendar, CheckSquare, Compass
} from "lucide-react";
import { BUSINESS_INFO } from "../productsData";

export default function About() {
  return (
    <div className="font-sans bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-extrabold text-corporate-blue uppercase tracking-widest pl-2 border-l-4 border-corporate-blue">
              About Unistar Chemicals
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Company Overview & Values
            </h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 max-w-md">
            Pioneering excellence in industrial chemical distribution, supporting India's manufacturing sectors since {BUSINESS_INFO.establishedYear}.
          </p>
        </div>

        {/* 1. Company Overview Grid */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 md:p-10 flex flex-col gap-5 justify-center">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              A Trusted Partner in B2B Chemical Sourcing
            </h2>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Unistar Chemicals is a trusted supplier and distributor of industrial chemicals, serving diverse industries with a commitment to quality, reliability, and customer satisfaction. We specialize in sourcing and supplying premium-grade chemical products that meet industry standards and support various manufacturing and industrial applications.
            </p>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              With a strong distribution network and a customer-focused approach, we ensure timely delivery, consistent product quality, and dependable service. Our goal is to build long-term partnerships by providing cost-effective chemical solutions tailored to the evolving needs of businesses across India.
            </p>
          </div>
          <div className="lg:col-span-5 bg-corporate-blue text-white p-6 md:p-10 flex flex-col justify-between min-h-[250px]">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
                Corporate Core Focus
              </span>
              <p className="text-sm md:text-base leading-relaxed text-blue-50 font-medium italic">
                "Combining premium chemical distribution channels with absolute transparency, quality compliance, and timely dispatch to keep India's factories running efficiently."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-white/10 mt-6 text-xs text-blue-200">
              <Calendar className="w-5 h-5 shrink-0" />
              <span>Incorporated: Year {BUSINESS_INFO.establishedYear} • Kolkata registered</span>
            </div>
          </div>
        </div>

        {/* 2. Vision, Mission & Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Vision card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-50 text-corporate-blue rounded-full flex items-center justify-center shrink-0 border border-blue-100">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base uppercase tracking-wider">Vision Statement</h3>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                To become one of India's most trusted industrial chemical suppliers through quality products, ethical business practices, and long-term customer relationships.
              </p>
            </div>
          </div>

          {/* Mission card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-50 text-corporate-blue rounded-full flex items-center justify-center shrink-0 border border-blue-100">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base uppercase tracking-wider">Mission Statement</h3>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                To deliver premium industrial chemicals with reliable sourcing, competitive pricing, timely logistics, and dedicated, personalized customer support.
              </p>
            </div>
          </div>

          {/* Core Values card */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs flex flex-col gap-4 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-blue-50 text-corporate-blue rounded-full flex items-center justify-center shrink-0 border border-blue-100">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base uppercase tracking-wider">Core Values</h3>
              <ul className="grid grid-cols-2 gap-2 mt-3 text-xs font-bold text-gray-700">
                <li className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded border border-gray-100">
                  <span className="text-corporate-blue text-xs font-mono">01.</span> Quality
                </li>
                <li className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded border border-gray-100">
                  <span className="text-corporate-blue text-xs font-mono">02.</span> Integrity
                </li>
                <li className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded border border-gray-100">
                  <span className="text-corporate-blue text-xs font-mono">03.</span> Reliability
                </li>
                <li className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded border border-gray-100">
                  <span className="text-corporate-blue text-xs font-mono">04.</span> Commitment
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Facility Image Galleries: Warehouses, Storage & Office */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-xl font-extrabold text-gray-900">
              Infrastructure & Facility Galleries
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Secure, durable industrial warehousing facilities designed for safe hazardous and chemical handling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Warehouse */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs flex flex-col">
              <div className="h-48 overflow-hidden bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=500&auto=format&fit=crop"
                  alt="Industrial Chemical Warehouse Shelving Storage"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Industrial Warehouse</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Bulk dispatch yard configured with temperature guidelines for storing volatile and chemical materials safely.
                </p>
              </div>
            </div>

            {/* Storage */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs flex flex-col">
              <div className="h-48 overflow-hidden bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=500&auto=format&fit=crop"
                  alt="Safe Chemical Drums Storage Packing"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Storage & Packaging Yard</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Durable drums, barrels, cans and jumbo bulk bags packaged using strict hazard safety parameters before shipping.
                </p>
              </div>
            </div>

            {/* Office */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs flex flex-col">
              <div className="h-48 overflow-hidden bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=500&auto=format&fit=crop"
                  alt="Corporate procurement office desk Kolkata"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Corporate Offices</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Headquartered in Sector V, Kolkata. Backed by dedicated support executives handling customer quotation requests.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Google Map representation & Business Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map display */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-gray-200 shadow-xs p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-5 h-5 text-corporate-blue" />
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base">Office Map Location Mockup</h3>
                <p className="text-[10px] text-gray-400">Sector V, Salt Lake, Kolkata, West Bengal</p>
              </div>
            </div>
            {/* Highly customized visual map mockup with leaflet/osm iframe or beautiful schematic overlay */}
            <div className="relative bg-blue-50 border border-blue-100 rounded-md h-72 overflow-hidden flex items-center justify-center">
              {/* Clean Map visual using standard maps embedding or highly styled CSS map representing our location */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0539121669466!2d88.4283896!3d22.5724264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275af00000001%3A0xb3ca6ef16e5cd6e9!2sSector%20V%2C%20Salt%20Lake%20City%2C%20Kolkata%2C%20West%20Bengal%20700091!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Kolkata Office Location"
              ></iframe>
            </div>
          </div>

          {/* Business Information Card */}
          <div className="lg:col-span-5 bg-white rounded-lg border border-gray-200 shadow-xs p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              <h3 className="font-bold text-gray-900 text-sm md:text-base border-b border-gray-100 pb-2.5 uppercase tracking-wide">
                Corporate Contact Sheet
              </h3>
              
              <ul className="flex flex-col gap-4 text-xs">
                <li className="flex items-start gap-2.5">
                  <Building2 className="w-5 h-5 text-corporate-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 uppercase text-[10px] tracking-wider block">Company Name</strong>
                    <span className="text-gray-600 font-medium">{BUSINESS_INFO.companyName} Private Limited</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-corporate-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 uppercase text-[10px] tracking-wider block">Head Office</strong>
                    <span className="text-gray-600">{BUSINESS_INFO.headOffice}</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-corporate-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 uppercase text-[10px] tracking-wider block">Corporate Office</strong>
                    <span className="text-gray-600">{BUSINESS_INFO.corporateOffice}</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <Mail className="w-5 h-5 text-corporate-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 uppercase text-[10px] tracking-wider block">Procurement Desk</strong>
                    <span className="text-gray-600 font-medium">{BUSINESS_INFO.email}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded border border-emerald-100 flex items-start gap-2 text-xs mt-6">
              <Clock className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Working Hours:</strong> {BUSINESS_INFO.workingHours}. Reach us on phone or email for quick support turnaround.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
