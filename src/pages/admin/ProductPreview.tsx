import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Beaker, CheckCircle2, ShieldCheck, AlertCircle, 
  Send, PackageOpen, Info, FileText, ShieldAlert, Sparkles, 
  ChevronRight, Edit, Eye, Globe, Lock
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { productService } from "../../services/productService";
import { Product } from "../../types/product";
import { getCategoryColor, getCategoryIcon } from "../../utils/categoryHelpers";
import ProductShowcase from "../../components/ProductShowcase";

export default function AdminProductPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        setLoading(true);
        try {
          const data = await productService.getProduct(id);
          setProduct(data);
        } catch (err) {
          console.error("Failed to load preview product:", err);
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Product Spec Preview">
        <div className="py-24 flex flex-col items-center justify-center gap-3 bg-white border border-gray-100 rounded-lg shadow-xs">
          <div className="w-10 h-10 border-4 border-t-[#2FA8B8] border-r-[#123C74] border-b-[#123C74] border-l-[#123C74]/10 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Generating spec preview...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Product Spec Preview">
        <div className="py-20 px-4 text-center bg-white border border-gray-100 rounded-lg shadow-xs flex flex-col items-center justify-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
          <h2 className="text-md font-extrabold text-gray-800 uppercase tracking-tight">Chemical Record Not Found</h2>
          <p className="text-gray-400 max-w-sm mt-2 text-xs leading-relaxed">
            The requested industrial formulation could not be resolved in the Firestore registry.
          </p>
          <Link
            to="/admin/products"
            className="mt-6 px-4 py-2 bg-[#123C74] hover:bg-[#2FA8B8] text-white rounded text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Return to Inventory
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const themeColors = getCategoryColor(product.category);

  // Custom safety advice matching details logic
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
    <AdminLayout title={`Preview: ${product.name}`}>
      <div className="space-y-6">
        
        {/* Admin Shortcut Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#123C74] text-white p-4 lg:px-5 rounded-lg border border-white/5 shadow-md">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              title="Return to inventory"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-widest leading-none">
                  HIGH-FIDELITY PREVIEW
                </span>
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase leading-none border ${product.isPublished ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                  {product.isPublished ? <Globe size={8} /> : <Lock size={8} />}
                  {product.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <h3 className="text-xs font-bold text-gray-200 mt-1 uppercase">
                Customer View Replica
              </h3>
            </div>
          </div>

          <Link
            to={`/admin/products/edit/${product.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA8B8] hover:bg-[#1a8594] text-white text-xs font-extrabold uppercase rounded shadow transition-colors"
          >
            <Edit size={14} />
            <span>Edit Specifications</span>
          </Link>
        </div>

        {/* Replica Workspace Frame mimicking public layout */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 lg:p-8 shadow-xs space-y-10">
          
          {/* Header section (Replica of public product name/formula) */}
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-none uppercase">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-1">
              <div className="inline-flex items-center gap-2 bg-blue-50/80 text-corporate-blue border border-blue-100 rounded-lg px-3 py-1 text-sm font-bold font-mono">
                <span className="text-blue-400 text-xs uppercase tracking-wider font-sans font-semibold">Formula:</span>
                <span>{product.formula}</span>
              </div>
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">•</span>
              <span className="text-xs text-gray-500 font-mono">Supplier: Unistar Chemicals</span>
            </div>
          </div>

          {/* Large showcase banner */}
          <ProductShowcase product={product} />

          {/* Specs grids */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 cols */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Product Overview */}
              <section className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4">
                <h3 className="font-bold text-gray-900 text-xs tracking-widest uppercase flex items-center gap-2 border-b border-gray-50 pb-3">
                  <Info className="w-4 h-4 text-corporate-blue" />
                  Product Overview & Chemistry
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                {product.longDescription && (
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pt-2 border-t border-gray-50 mt-1 whitespace-pre-wrap">
                    {product.longDescription}
                  </p>
                )}
              </section>

              {/* Applications & Specs lists */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Applications */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4">
                  <h4 className="font-bold text-gray-900 text-xs tracking-widest uppercase flex items-center gap-2 border-b border-gray-50 pb-3">
                    <Sparkles className="w-4 h-4 text-corporate-blue" />
                    Industrial Applications
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {product.applications && product.applications.length > 0 ? (
                      product.applications.map((app, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                          <span className="text-corporate-blue font-black shrink-0">•</span>
                          <span>{app}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-gray-400 italic">No applications specified.</li>
                    )}
                  </ul>
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4">
                  <h4 className="font-bold text-gray-900 text-xs tracking-widest uppercase flex items-center gap-2 border-b border-gray-50 pb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Key Specifications
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {product.keyBenefits && product.keyBenefits.length > 0 ? (
                      product.keyBenefits.map((ben, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{ben}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-gray-400 italic">No specifications listed.</li>
                    )}
                  </ul>
                </div>

              </section>

              {/* Packaging Standards */}
              <section className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4">
                <h3 className="font-bold text-gray-900 text-xs tracking-widest uppercase flex items-center gap-2 border-b border-gray-50 pb-3">
                  <PackageOpen className="w-4 h-4 text-corporate-blue" />
                  B2B Packaging Standards
                </h3>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="bg-blue-50 text-corporate-blue rounded-lg p-2 shrink-0">
                    <PackageOpen className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-gray-900 text-xs">Commercial Sizing</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {product.packaging || "Bulk standard containers."}. We accommodate custom packing configurations, bulk tanker delivery, dilution services, and containerized transport under tight logistical control.
                    </p>
                  </div>
                </div>
              </section>

              {/* Regulatory Handling Advice */}
              <section className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4">
                <h3 className="font-bold text-gray-900 text-xs tracking-widest uppercase flex items-center gap-2 border-b border-gray-50 pb-3">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Safety & Regulatory Compliance
                </h3>
                
                <div className={`border rounded-xl p-4 flex items-start gap-3 text-xs font-semibold ${safetyInfo.color}`}>
                  <ShieldAlert className={`w-5 h-5 shrink-0 ${safetyInfo.iconColor}`} />
                  <div>
                    <strong className="block uppercase tracking-wider">{safetyInfo.level}</strong>
                    <span className="font-normal text-gray-600 mt-1 block">
                      Proper industrial handling protocols must be observed in accordance with the product safety dataset.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  <h4 className="font-bold text-xs text-gray-800">Critical Guidelines & Handling Precautions:</h4>
                  <ul className="flex flex-col gap-2.5">
                    {safetyInfo.guidelines.map((guide, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{guide}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {product.storageInstructions && (
                  <div className="space-y-1 mt-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Storage Directives</span>
                    <p className="text-xs text-gray-600 leading-relaxed">{product.storageInstructions}</p>
                  </div>
                )}

                {product.safetyInformation && (
                  <div className="space-y-1 p-3 bg-gray-50 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">PPE & Safety Warnings</span>
                    <p className="text-xs text-gray-600 leading-relaxed">{product.safetyInformation}</p>
                  </div>
                )}
              </section>

            </div>

            {/* Sidebar Columns (Right 4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Sourcing card mock */}
              <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono font-extrabold text-[#2FA8B8] uppercase tracking-widest">
                    DIRECT B2B PROCUREMENT
                  </span>
                  <h3 className="text-md font-bold tracking-tight uppercase">
                    Commercial Sourcing Enquiry
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Request custom quotations, bulk volumes, container schedules, or technical certificate files directly from our corporate sales desk.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col gap-3">
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-[#2FA8B8]/30 border border-[#2FA8B8]/20 text-white/50 text-xs font-bold uppercase rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquiry Trigger Simulated</span>
                  </button>
                  
                  {product.pdfUrl && (
                    <a
                      href={product.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/10 text-center text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors block"
                    >
                      Inspect Datasheet (PDF)
                    </a>
                  )}
                </div>

                <div className="relative z-10 border-t border-white/10 pt-4 flex items-center gap-3">
                  <div className="bg-emerald-500/15 text-emerald-400 p-2 rounded-lg border border-emerald-500/20 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] text-slate-300 leading-normal">
                    <span className="font-bold text-white block uppercase text-[9px] tracking-wider">Verified Batch Reports</span>
                    All products include full COA, packing list, and weight certificates.
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
