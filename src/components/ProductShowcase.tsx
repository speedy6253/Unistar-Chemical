import { useState, useEffect } from "react";
import { Product } from "../productsData";
import { Image } from "lucide-react";

interface ProductShowcaseProps {
  product: Product;
}

export default function ProductShowcase({ product }: ProductShowcaseProps) {
  const kebabName = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Define paths to find the product image (by ID or kebab-case name)
  const customPath = product.image || "";
  const idPath = `/assets/products/${product.id}.png`;
  const namePath = `/assets/products/${kebabName}.png`;

  const [imgSrc, setImgSrc] = useState(customPath || idPath);
  const [loadStage, setLoadStage] = useState<"custom" | "id" | "name" | "failed">(
    customPath ? "custom" : "id"
  );

  // Reset the load state whenever the product changes
  useEffect(() => {
    setImgSrc(customPath || idPath);
    setLoadStage(customPath ? "custom" : "id");
  }, [product.id, customPath, idPath]);

  const handleImageError = () => {
    if (loadStage === "custom") {
      setImgSrc(idPath);
      setLoadStage("id");
    } else if (loadStage === "id") {
      setImgSrc(namePath);
      setLoadStage("name");
    } else {
      setImgSrc("");
      setLoadStage("failed");
    }
  };

  const isImageLoaded = loadStage !== "failed" && imgSrc !== "";

  return (
    <div 
      className="w-full relative rounded-[24px] overflow-hidden border border-gray-200/80 bg-slate-50 shadow-sm block"
      style={{ aspectRatio: "1942 / 809" }}
      id={`product-showcase-${product.id}`}
    >
      {/* 1. ACTUAL PRODUCT IMAGE
          Renders absolutely over the placeholder when loaded successfully.
          Uses 'object-cover' and stays contained to prevent any layout shift. */}
      {isImageLoaded && (
        <img
          src={imgSrc}
          alt={`${product.name} Showcase`}
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover block z-10 transition-opacity duration-300"
          referrerPolicy="no-referrer"
        />
      )}

      {/* 2. NEUTRAL MINIMALIST PLACEHOLDER
          Displays only a clean, flat corporate layout when no image has been uploaded.
          Zero graphics, zero glassmorphism, zero laboratory illustrations, and zero AI-generated artwork. */}
      <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-slate-50 text-slate-800 z-0 select-none">
        
        {/* Top bar: Category and general specification label */}
        <div className="flex justify-between items-center w-full">
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#123C74] bg-[#123C74]/5 px-3 py-1 rounded border border-[#123C74]/10">
            {product.category}
          </span>
          <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
            DISTRIBUTOR SPECIFICATION SHEET
          </span>
        </div>

        {/* Center content: Simple flat layout showcasing Name and Formula */}
        <div className="my-auto flex flex-col items-center text-center gap-2 sm:gap-4 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-1.5">
            <Image className="w-8 h-8 sm:w-12 sm:h-12 text-slate-300 stroke-[1.25] mb-1" />
            <span className="text-[9px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-400">
              INDUSTRIAL FORMULATION PREVIEW
            </span>
            <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {product.name}
            </h3>
          </div>
          
          <div className="bg-slate-100 border border-slate-200/80 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-xl flex items-center gap-2">
            <span className="text-slate-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider">Formula:</span>
            <span className="text-sm sm:text-xl font-bold font-mono text-[#123C74] tracking-wider">
              {product.formula}
            </span>
          </div>
        </div>

        {/* Bottom bar: Logistical notice and file replacement help text */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-t border-slate-200/60 pt-4 w-full">
          <span className="text-[10px] sm:text-xs text-slate-500 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            Verified batch specifications and MSDS available
          </span>
          
          <span className="text-slate-400 text-[9px] sm:text-[11px] font-mono">
            Placeholder Path: <span className="text-slate-600 font-semibold">/assets/products/{product.id}.png</span> (1942×809)
          </span>
        </div>

      </div>
    </div>
  );
}
