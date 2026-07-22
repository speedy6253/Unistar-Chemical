import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Beaker, CheckCircle2, ShieldCheck, AlertCircle, 
  Send, PackageOpen, Info, FileText, ShieldAlert, Sparkles, ChevronRight, Loader2
} from "lucide-react";
import { Product, PRODUCTS } from "../productsData";
import { getCategoryColor, getCategoryIcon } from "../utils/categoryHelpers";
import { productService } from "../services/productService";
import EnquiryModal from "../components/EnquiryModal";
import ProductShowcase from "../components/ProductShowcase";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (id) {
      const loadProductAndRelated = async () => {
        setLoading(true);
        try {
          let mainProduct = await productService.getProduct(id);
          if (!mainProduct) {
            const preloaded = PRODUCTS.find(p => p.id === id);
            if (preloaded) {
              mainProduct = {
                ...preloaded,
                slug: preloaded.id,
                isPublished: true,
                featured: false,
                images: preloaded.image ? [preloaded.image] : [],
                specifications: preloaded.keyBenefits
              };
            }
          }
          setProduct(mainProduct);

          if (mainProduct) {
            const allProducts = await productService.getProducts(false); // Only published
            const related = allProducts
              .filter((p) => p.category === mainProduct.category && p.id !== mainProduct.id)
              .slice(0, 3);
            setRelatedProducts(related);
          }
        } catch (err) {
          console.error("Failed to fetch product details:", err);
          const preloaded = PRODUCTS.find(p => p.id === id);
          if (preloaded) {
            setProduct({
              ...preloaded,
              slug: preloaded.id,
              isPublished: true,
              featured: false,
              images: preloaded.image ? [preloaded.image] : [],
              specifications: preloaded.keyBenefits
            });
          }
        } finally {
          setLoading(false);
        }
      };
      loadProductAndRelated();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="font-sans py-20 px-4 text-center bg-gray-50 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-corporate-blue mb-4 animate-spin" />
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">Resolving Chemical Record</h2>
        <p className="text-gray-400 max-w-sm mt-2 text-xs leading-relaxed">
          Retrieving technical specifications from our Firestore chemical registry...
        </p>
      </div>
    );
  }

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

  const themeColors = getCategoryColor(product.category);

  // Custom safety advice tailored by product category to look exceptionally professional
  const getSafetyAdvice = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("acid") || cat.includes("alkali")) {
      return {
        level: "High Risk - Corrosive Material",
        color: "text-red-700 bg-red-50 border-red-100",
        iconColor: "text-red-600",
        guidelines: [
          "Always wear chemical-resistant gloves (neoprene/nitrile), safety goggles, and full protective overalls.",
          "Use under local exhaust ventilation. Avoid breathing vapors, mist, or airborne dust.",
          "Keep away from incompatible materials (metals, water, or strong bases/acids as applicable).",
          "Store in original hermetically sealed containers in a cool, dry, and secure chemical store."
        ]
      };
    } else if (cat.includes("solvent")) {
      return {
        level: "Moderate Risk - Flammable & Volatile",
        color: "text-amber-700 bg-amber-50 border-amber-100",
        iconColor: "text-amber-600",
        guidelines: [
          "Keep away from open heat sources, sparks, open flames, and hot surfaces. No smoking.",
          "Ground/bond container and receiving equipment during transfers to prevent static discharge.",
          "Wear protective safety eyewear and organic vapor respirators in confined spaces.",
          "Store in a dedicated flameproof cabinet compliant with safety regulations."
        ]
      };
    } else {
      return {
        level: "Standard Industrial Chemical Handling",
        color: "text-blue-700 bg-blue-50 border-blue-100",
        iconColor: "text-blue-600",
        guidelines: [
          "Handle in accordance with good industrial hygiene and safety practices.",
          "Wear protective safety glasses, dust mask, and light industrial work gloves.",
          "Maintain proper workplace ventilation to control airborne concentrations.",
          "Keep containers tightly closed when not in use. Store in a cool, dry warehouse."
        ]
      };
    }
  };

  const safetyInfo = getSafetyAdvice(product.category);

  return (
    <div className="font-sans py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* 1. BREADCRUMB */}
        <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-corporate-blue transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Link to="/products" className="hover:text-corporate-blue transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Link 
            to={`/products?category=${encodeURIComponent(product.category)}`} 
            className="hover:text-corporate-blue transition-colors text-corporate-blue"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:block" />
          <span className="text-gray-400 hidden sm:block truncate max-w-[200px]" aria-current="page">
            {product.name}
          </span>
        </nav>

        {/* HEADER SECTION (Product Name & Formula) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded border ${themeColors.border} ${themeColors.bg} ${themeColors.text}`}>
              {getCategoryIcon(product.category)}
              <span>{product.category}</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              Sourced Under ISO 9001
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-none">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-1">
            <div className="inline-flex items-center gap-2 bg-blue-50/80 text-corporate-blue border border-blue-100 rounded-lg px-3 py-1.5 text-sm sm:text-base font-bold font-mono">
              <span className="text-blue-400 text-xs uppercase tracking-wider font-sans font-semibold">Formula:</span>
              <span>{product.formula}</span>
            </div>
            <span className="text-xs text-gray-400 font-mono hidden sm:inline">•</span>
            <span className="text-xs text-gray-500 font-mono">Supplier: Unistar Chemicals</span>
          </div>
        </div>

        {/* 2. LARGE PRODUCT BANNER (1942×809 Ratio) */}
        <ProductShowcase product={product} />

        {/* PRODUCT DETAILS STACK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main content column (Left 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* 3. DESCRIPTION */}
            <section className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4">
              <h3 className="font-bold text-gray-900 text-sm tracking-widest uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                <Info className="w-4.5 h-4.5 text-corporate-blue" />
                Product Overview & Chemistry
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </section>

            {/* 4. APPLICATIONS & SPECIFICATIONS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Applications Card */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                <h4 className="font-bold text-gray-900 text-sm tracking-widest uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Sparkles className="w-4.5 h-4.5 text-corporate-blue" />
                  Industrial Applications
                </h4>
                <ul className="flex flex-col gap-3">
                  {product.applications.map((app, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      <span className="text-corporate-blue font-black shrink-0 mt-0.5">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications Card */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                <h4 className="font-bold text-gray-900 text-sm tracking-widest uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                  Key Specifications
                </h4>
                <ul className="flex flex-col gap-3">
                  {product.keyBenefits.map((ben, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </section>

            {/* 5. PACKAGING */}
            <section className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4">
              <h3 className="font-bold text-gray-900 text-sm tracking-widest uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                <PackageOpen className="w-4.5 h-4.5 text-corporate-blue" />
                B2B Packaging Standards
              </h3>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="bg-blue-50 text-corporate-blue rounded-xl p-3 shrink-0">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-extrabold text-gray-900 text-sm">Commercial Sizing</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {product.packaging}. We accommodate custom packing configurations, bulk tanker delivery, dilution services, and containerized transport under tight logistical control.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. SAFETY */}
            <section className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4">
              <h3 className="font-bold text-gray-900 text-sm tracking-widest uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                Safety & Regulatory Compliance
              </h3>
              
              {/* Category-based risk alert */}
              <div className={`border rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm font-semibold ${safetyInfo.color}`}>
                <ShieldAlert className={`w-5 h-5 shrink-0 ${safetyInfo.iconColor}`} />
                <div>
                  <strong className="block uppercase tracking-wider">{safetyInfo.level}</strong>
                  <span className="font-normal text-gray-600 mt-1 block">
                    Proper industrial handling protocols must be observed in accordance with the product safety dataset.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <h4 className="font-bold text-xs sm:text-sm text-gray-800">Critical Guidelines & Handling Precautions:</h4>
                <ul className="flex flex-col gap-2.5">
                  {safetyInfo.guidelines.map((guide, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{guide}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Technical Data Sheets (TDS) and Material Safety Data Sheets (MSDS) are available for download on request.</span>
                </div>
                <button 
                  onClick={() => handleEnquireClick(`SDS / MSDS Request: ${product.name}`)}
                  className="text-xs font-bold text-corporate-blue hover:underline whitespace-nowrap"
                >
                  Request SDS Sheet
                </button>
              </div>
            </section>

          </div>

          {/* Sidebar Inquiry Column (Right 4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 flex flex-col gap-6">
            
            {/* 7. ENQUIRY CARD */}
            <div className="bg-slate-900 text-white rounded-2xl border border-slate-850 p-6 md:p-8 shadow-md flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col gap-2">
                <span className="text-[10px] font-mono font-extrabold text-blue-400 uppercase tracking-widest">
                  Direct B2B Procurement
                </span>
                <h3 className="text-xl font-extrabold tracking-tight">
                  Commercial Sourcing Enquiry
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Request custom quotations, bulk volumes, container schedules, or technical certificate files directly from our corporate sales desk.
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-4">
                <button
                  onClick={() => handleEnquireClick(product.name)}
                  className="w-full py-3.5 px-4 bg-corporate-blue hover:bg-corporate-blue-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  id="details-enquire-btn"
                >
                  <Send className="w-4 h-4" />
                  Request Quotation for {product.name}
                </button>

                <Link
                  to="/contact"
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/10 text-center text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors block"
                >
                  Contact Logistics Desk
                </Link>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-4 flex items-center gap-3">
                <div className="bg-emerald-500/15 text-emerald-400 p-2 rounded-lg border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-[11px] text-slate-300 leading-normal">
                  <span className="font-bold text-white block">Verified Batch Reports</span>
                  All products include full COA, packing list, and weight certificates.
                </div>
              </div>
            </div>

            {/* Back Button Link */}
            <button
              onClick={() => {
                navigate("/products");
                window.scrollTo(0, 0);
              }}
              className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Catalogue
            </button>

          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="flex flex-col gap-6 pt-6 border-t border-gray-200">
            <div>
              <h3 className="font-extrabold text-gray-900 text-xl tracking-tight">
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
                  className="bg-white rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
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
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {rel.description}
                    </p>
                  </div>
                  <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex justify-between items-center">
                    <button
                      onClick={() => {
                        navigate(`/product/${rel.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="text-xs font-bold text-corporate-blue hover:underline cursor-pointer"
                    >
                      View Formulation
                    </button>
                    <button
                      onClick={() => handleEnquireClick(rel.name)}
                      className="text-xs font-bold text-gray-600 hover:text-corporate-blue cursor-pointer"
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
