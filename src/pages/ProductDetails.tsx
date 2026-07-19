import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Beaker, CheckCircle2, ShieldCheck, AlertCircle, 
  Send, HelpCircle, PackageOpen, Tag, Info
} from "lucide-react";
import { PRODUCTS, Product } from "../productsData";
import { getCategoryColor, getCategoryIcon } from "./Home";
import EnquiryModal from "../components/EnquiryModal";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState("");

  useEffect(() => {
    if (product) {
      setSelectedProductForEnquiry(product.name);
    }
  }, [product]);

  const handleEnquireClick = (pName: string) => {
    setSelectedProductForEnquiry(pName);
    setEnquiryModalOpen(true);
  };

  useEffect(() => {
    // Find product matching URL slug id
    const foundProduct = PRODUCTS.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setProduct(null);
    }
  }, [id]);

  // Handle product fallback
  if (!product) {
    return (
      <div className="font-sans py-20 px-4 text-center bg-gray-50 flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
        <h2 className="text-2xl font-extrabold text-gray-800">Product Formulation Not Found</h2>
        <p className="text-gray-500 max-w-md mt-2 text-sm leading-relaxed">
          The requested industrial chemical formulation could not be loaded. It may have been updated or relocated in our supplier index.
        </p>
        <Link
          to="/products"
          className="mt-6 px-6 py-3 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  // Related products logic (same category, excluding current product, maximum 3)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const themeColors = getCategoryColor(product.category);

  return (
    <div className="font-sans py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Back Link Button */}
        <div>
          <button
            onClick={() => {
              navigate("/products");
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-corporate-blue font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalogue
          </button>
        </div>

        {/* Main Product Sheet layout */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual chemistry cover and formula */}
          <div className="lg:col-span-5 bg-gray-950 relative overflow-hidden flex flex-col justify-between p-8 text-white min-h-[350px] lg:min-h-full">
            {/* Dark background image of refinery/lab */}
            <div className="absolute inset-0 opacity-15">
              <img
                src={
                  product.category === "Acids"
                    ? "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=600&auto=format&fit=crop"
                    : product.category === "Water Treatment Chemicals"
                    ? "https://images.unsplash.com/photo-1548826879-189db8744311?q=80&w=600&auto=format&fit=crop"
                    : product.category === "Solvents"
                    ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop"
                    : product.category === "Salts & Minerals"
                    ? "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=600&auto=format&fit=crop"
                    : "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop"
                }
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Visual gradient filter */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/20"></div>

            {/* Top row metadata */}
            <div className="relative z-10 flex justify-between items-center shrink-0">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded px-3 py-1.5 border border-white/20 text-xs font-bold uppercase tracking-wider">
                {getCategoryIcon(product.category)}
                <span>{product.category}</span>
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
                B2B Verified
              </span>
            </div>

            {/* Center: Massive typography displaying chemical formula */}
            <div className="relative z-10 my-auto text-center flex flex-col gap-2 py-12">
              <span className="text-gray-500 font-mono text-xs font-bold uppercase tracking-widest block">
                Chemical Formula Representation
              </span>
              <h2 className="text-5xl md:text-6xl font-extrabold font-mono tracking-wider text-blue-400 drop-shadow-sm">
                {product.formula}
              </h2>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Sourced Under ISO 9001 Guidelines
              </span>
            </div>

            {/* Bottom: Certification badges */}
            <div className="relative z-10 bg-white/5 border border-white/10 rounded p-4 flex items-center gap-3 shrink-0">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-relaxed text-gray-300">
                <strong className="text-white uppercase block">Quality Verified</strong>
                100% compliant with commercial specifications and batch reports.
              </div>
            </div>
          </div>

          {/* Right Column: Detailed parameters */}
          <div className="lg:col-span-7 p-6 md:p-8 flex flex-col gap-6">
            
            {/* Title & category */}
            <div className="border-b border-gray-100 pb-5">
              <span className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded border ${themeColors.border} ${themeColors.bg} ${themeColors.text} mb-3`}>
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-mono">
                <span>CAS ID / Formula: <strong>{product.formula}</strong></span>
                <span>•</span>
                <span>Supplier: Unistar Chemicals</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
                <Info className="w-4 h-4 text-corporate-blue" />
                Product Overview
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Grid for applications & benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Applications column */}
              <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded border border-gray-100">
                <h4 className="font-extrabold text-gray-900 text-xs tracking-wider uppercase border-b border-gray-200 pb-1.5">
                  Industrial Applications
                </h4>
                <ul className="flex flex-col gap-2">
                  {product.applications.map((app, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                      <span className="text-corporate-blue font-extrabold shrink-0 mt-0.5">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits column */}
              <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded border border-gray-100">
                <h4 className="font-extrabold text-gray-900 text-xs tracking-wider uppercase border-b border-gray-200 pb-1.5">
                  Key Specifications
                </h4>
                <ul className="flex flex-col gap-2">
                  {product.keyBenefits.map((ben, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Packaging information */}
            <div className="bg-card-blue/70 border border-blue-50 p-4 rounded-lg flex items-start gap-3">
              <PackageOpen className="w-5 h-5 text-corporate-blue shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-corporate-blue text-xs uppercase tracking-wider">
                  Available B2B Packaging Standards
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed mt-1">
                  {product.packaging}. We also cater to custom concentration, bulk dilution requirements, and dedicated logistical coordination for high-volume corporate contracts.
                </p>
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleEnquireClick(product.name)}
                className="px-8 py-3 bg-corporate-blue hover:bg-corporate-blue-hover text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-sm flex items-center gap-2"
                id="details-enquire-btn"
              >
                <Send className="w-4 h-4" />
                Request Quotation for {product.name}
              </button>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Contact Logistics Desk
              </Link>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="flex flex-col gap-6 pt-4">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="font-extrabold text-gray-900 text-lg">
                Related {product.category} Formulations
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Similar high-purity industrial compounds matching the same chemical properties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-lg border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold text-corporate-blue uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {rel.formula}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">
                        B2B Grade
                      </span>
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm md:text-base group-hover:text-corporate-blue transition-colors">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {rel.description}
                    </p>
                  </div>
                  <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex justify-between items-center">
                    <button
                      onClick={() => {
                        navigate(`/product/${rel.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="text-xs font-bold text-corporate-blue hover:underline"
                    >
                      View Formulation
                    </button>
                    <button
                      onClick={() => handleEnquireClick(rel.name)}
                      className="text-xs font-bold text-gray-600 hover:text-corporate-blue"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Enquiry Popup */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productName={selectedProductForEnquiry}
      />
    </div>
  );
}
