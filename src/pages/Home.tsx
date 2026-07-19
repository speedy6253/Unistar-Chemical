import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Beaker, ShieldCheck, Truck, Users, Award, ChevronRight, 
  ArrowRight, Sparkles, AlertCircle, Droplets, Check, Factory
} from "lucide-react";
import { PRODUCTS, INDUSTRIES, BUSINESS_INFO, Product } from "../productsData";
import EnquiryModal from "../components/EnquiryModal";

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
      return <Beaker className="w-5 h-5 text-corporate-blue" />;
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
      return { border: "border-blue-100", bg: "bg-blue-50", text: "text-blue-700", accent: "bg-corporate-blue" };
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
    <div className="font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative bg-gray-950 text-white overflow-hidden py-20 md:py-32 border-b-4 border-corporate-blue">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1920&auto=format&fit=crop"
            alt="Chemical Industrial Processing Plant Banner"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-corporate-blue/30 border border-corporate-blue text-blue-200 text-xs font-bold uppercase tracking-widest rounded-full self-start">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pan India Supplier & Distributor
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-sans">
              Reliable Industrial <br />
              <span className="text-blue-400">Chemical Solutions</span>
            </h1>

            <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Unistar Chemicals is an established B2B chemical supplier in India. Sourcing high-purity mineral acids, alkalis, solvents, and water treatment solutions to empower major manufacturing sectors with premium-grade material and dependable supply chains.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to="/products"
                className="px-6 py-3 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2"
              >
                <span>View Products Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded font-bold text-sm tracking-wide transition-all shadow-sm"
              >
                Request a Quotation
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 text-sm flex flex-col gap-4">
              <h3 className="font-extrabold tracking-wider uppercase text-blue-300">Quick Factsheet</h3>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">ISO Certified</span>
                <span className="font-semibold text-emerald-400">Yes</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Total Products</span>
                <span className="font-semibold text-white">26 Formulations</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Logistics Coverage</span>
                <span className="font-semibold text-white">Pan-India Network</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-400">Core Focus</span>
                <span className="font-semibold text-white">B2B Manufacturing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Unistar chemicals */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="text-xs font-extrabold text-corporate-blue uppercase tracking-widest pl-2 border-l-4 border-corporate-blue">
              About Unistar Chemicals
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              A Trusted Partner in B2B Chemical Distribution
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Unistar Chemicals is a trusted supplier and distributor of industrial chemicals, serving diverse industries with a commitment to quality, reliability, and customer satisfaction. We specialize in sourcing and supplying premium-grade chemical products that meet stringent industry standards and support various manufacturing and industrial applications.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              With a strong distribution network and a customer-focused approach, we ensure timely delivery, consistent product quality, and dependable service. Our goal is to build long-term partnerships by providing cost-effective chemical solutions tailored to the evolving needs of businesses across India.
            </p>
            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-corporate-blue hover:text-corporate-blue-hover font-bold text-sm hover:underline"
              >
                <span>Read Vision, Mission & Core Values</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-card-blue p-6 rounded-lg border border-blue-50 text-center">
              <span className="block text-3xl font-extrabold text-corporate-blue">ISO</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1 block">9001:2015 Certification</span>
            </div>
            <div className="bg-card-blue p-6 rounded-lg border border-blue-50 text-center">
              <span className="block text-3xl font-extrabold text-corporate-blue">Pan India</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1 block">Distribution network</span>
            </div>
            <div className="bg-card-blue p-6 rounded-lg border border-blue-50 text-center">
              <span className="block text-3xl font-extrabold text-corporate-blue">100%</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1 block">Sourced Quality Check</span>
            </div>
            <div className="bg-card-blue p-6 rounded-lg border border-blue-50 text-center">
              <span className="block text-3xl font-extrabold text-corporate-blue">26+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1 block">Industrial Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-extrabold text-corporate-blue uppercase tracking-widest">
              Why Choose Unistar Chemicals
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Delivering Value without Compromising Quality
            </h2>
            <p className="text-sm text-gray-500">
              We combine premium-grade logistics with trusted sourcing to ensure your industrial processes run smoothly and uninterruptedly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* QA */}
            <div className="bg-white p-5 rounded-lg border border-gray-200/80 shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded bg-blue-50 text-corporate-blue flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Premium Quality</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                High-grade chemicals that consistently meet stringent industry and ISO specifications.
              </p>
            </div>

            {/* Reliable supply */}
            <div className="bg-white p-5 rounded-lg border border-gray-200/80 shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded bg-blue-50 text-corporate-blue flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Reliable Supply</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A robust logistics network across India ensuring steady, uninterrupted availability.
              </p>
            </div>

            {/* Competitive Pricing */}
            <div className="bg-white p-5 rounded-lg border border-gray-200/80 shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded bg-blue-50 text-corporate-blue flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Competitive Pricing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cost-effective procurement solutions that deliver strong value.
              </p>
            </div>

            {/* Customer Commitment */}
            <div className="bg-white p-5 rounded-lg border border-gray-200/80 shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded bg-blue-50 text-corporate-blue flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Customer Commitment</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Responsive support and tailored bulk solutions built around your exact parameters.
              </p>
            </div>

            {/* Pan India Distribution */}
            <div className="bg-white p-5 rounded-lg border border-gray-200/80 shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded bg-blue-50 text-corporate-blue flex items-center justify-center shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Pan India Network</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Dependable logistics partner getting raw materials to your facilities on schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industries We Serve */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-extrabold text-corporate-blue uppercase tracking-widest">
                Sectors Supported
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Industries We Serve
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 max-w-md">
              Our premium-grade chemical formulations support a broad spectrum of manufacturing, industrial, and processing industries across India.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INDUSTRIES.map((ind, index) => (
              <div
                key={ind}
                className="bg-card-blue/50 p-5 rounded-lg border border-blue-50/75 flex items-center gap-3.5 hover:bg-card-blue hover:border-accent-blue/20 hover:shadow-xs transition-all"
              >
                <div className="w-8 h-8 rounded bg-white text-corporate-blue flex items-center justify-center shadow-xs text-xs font-bold font-mono">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <span className="font-bold text-gray-800 text-xs md:text-sm tracking-wide">
                  {ind}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR PRODUCT PORTFOLIO */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-extrabold text-corporate-blue uppercase tracking-widest">
              Our Product Portfolio
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              High-Purity Industrial Formulations
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
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
                  className="bg-white rounded-lg border border-gray-200/80 shadow-xs hover:shadow-md hover:border-corporate-blue/30 transition-all overflow-hidden flex flex-col group h-full"
                >
                  {/* Card Image Banner */}
                  <div className="h-32 bg-gray-950 relative overflow-hidden flex items-center justify-center shrink-0">
                    {/* Visual chemistry layout representation inside card to make it extremely clean and premium */}
                    <div className="absolute inset-0 opacity-20 group-hover:scale-105 transition-all duration-500">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>

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
                      <h3 className="font-extrabold text-gray-900 text-base md:text-lg group-hover:text-corporate-blue transition-colors">
                        {prod.name}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-400 font-medium">
                        Formula ID: {prod.formula}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>

                    {/* Applications Preview */}
                    <div className="flex flex-col gap-1.5 pt-1.5 border-t border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Primary Applications
                      </span>
                      <ul className="flex flex-wrap gap-1">
                        {prod.applications.slice(0, 2).map((app, index) => (
                          <li
                            key={index}
                            className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200/50"
                          >
                            {app}
                          </li>
                        ))}
                        {prod.applications.length > 2 && (
                          <li className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                            +{prod.applications.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Packaging */}
                    <div className="bg-card-blue/60 border border-blue-50 p-2.5 rounded text-[11px] text-gray-700 flex items-start gap-1.5 mt-auto">
                      <AlertCircle className="w-3.5 h-3.5 text-corporate-blue shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-corporate-blue uppercase text-[10px] tracking-wide block">Packaging</strong>
                        {prod.packaging}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-gray-50 border-t border-gray-100 px-5 py-3.5 grid grid-cols-2 gap-2.5 shrink-0">
                    <button
                      onClick={() => handleViewDetailsClick(prod.id)}
                      className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded font-bold text-xs uppercase tracking-wider text-center transition-all"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEnquireClick(prod.name)}
                      className="px-3 py-2 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded font-bold text-xs uppercase tracking-wider text-center transition-all shadow-xs"
                    >
                      Enquire Now
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
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded font-bold text-sm tracking-wider uppercase transition-all shadow-md"
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
      <section className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            {/* Visual chemistry image */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1608155686393-8fdd966d784d?q=80&w=600&auto=format&fit=crop"
                alt="Unistar Chemical QC Quality Assurance Lab Equipment"
                className="w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative stamp overlay */}
            <div className="absolute -bottom-6 -right-6 bg-white border-2 border-corporate-blue p-4 rounded shadow-md flex items-center gap-2 max-w-[200px]">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div className="text-xs leading-tight">
                <span className="font-extrabold uppercase tracking-wider text-corporate-blue block">QC PASSED</span>
                <span className="text-gray-500 font-semibold text-[10px]">Batch verified sourcing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5 lg:pl-6 mt-6 lg:mt-0">
            <span className="text-xs font-extrabold text-corporate-blue uppercase tracking-widest pl-2 border-l-4 border-corporate-blue">
              Strict Quality Parameters
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Rigorous Quality Checks, Compliant Standards
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              At Unistar Chemicals, every product is sourced from trusted and established manufacturers and undergoes careful quality checks before dispatch. Materials are verified for consistency, purity, and compliance with recognized industry standards, ensuring that each consignment meets the specifications our customers expect.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This disciplined approach to quality helps us build lasting trust, minimize batch variability, and deliver dependable performance across every order we supply. Detailed certificates of analysis (COA), safety data sheets (MSDS), and specifications sheets are available immediately upon customer request.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Certificate of Analysis (COA) with each batch</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Secure robust industrial packaging</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>MSDS and hazard documentation available</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Pan-India logistics tracking support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action */}
      <section className="py-16 px-4 bg-corporate-blue text-white text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Need Premium Industrial Chemicals?
          </h2>
          <p className="text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Get in touch with Unistar Chemicals procurement and logistics desk today. We supply high-purity chemical solutions designed to optimize your manufacturing processes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white hover:bg-gray-100 text-corporate-blue rounded font-bold text-sm tracking-wider uppercase transition-colors shadow-md"
            >
              Request a Quote Today
            </Link>
            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}
              className="px-8 py-3.5 bg-blue-900 hover:bg-blue-950 text-white border border-blue-800 rounded font-bold text-sm tracking-wider uppercase transition-colors"
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
