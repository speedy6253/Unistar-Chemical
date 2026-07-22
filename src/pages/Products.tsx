import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, AlertCircle, FileText, ChevronRight, Download, Loader2 } from "lucide-react";
import { CATEGORIES, Product, PRODUCTS } from "../productsData";
import { getCategoryColor, getCategoryIcon } from "../utils/categoryHelpers";
import { productService } from "../services/productService";
import EnquiryModal from "../components/EnquiryModal";
import CatalogueDownloadModal from "../components/CatalogueDownloadModal";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [catalogueModalOpen, setCatalogueModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    const fetchLiveProducts = async () => {
      const staticList = PRODUCTS.map(p => ({
        ...p,
        slug: p.id,
        isPublished: true,
        featured: false,
        images: p.image ? [p.image] : [],
        specifications: p.keyBenefits
      }));

      try {
        const liveList = await productService.getProducts(false); // Only published ones
        if (liveList && liveList.length > 0) {
          setProducts(liveList);
        } else {
          setProducts(staticList);
        }
      } catch (err) {
        console.error("Failed to load products from Firestore:", err);
        setProducts(staticList);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveProducts();
  }, []);

  const handleEnquireClick = (pName: string) => {
    setSelectedProduct(pName);
    setEnquiryModalOpen(true);
  };

  const handleViewDetailsClick = (pId: string) => {
    navigate(`/product/${pId}`);
    window.scrollTo(0, 0);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.applications.some((app) => app.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All Categories" || prod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="font-sans py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Title section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-extrabold text-corporate-blue uppercase tracking-widest pl-2 border-l-4 border-corporate-blue">
              Product Catalogue
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              B2B Industrial Solutions
            </h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 max-w-md">
            Browse our complete portfolio of 26 high-purity chemical formulations. Sourced from ISO-certified production units.
          </p>
        </div>

        {/* Filters and Search Bar section */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col gap-5">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, chemical formula (e.g. HCl, NaOH, KNO3) or industrial application..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-corporate-blue focus:bg-white focus:ring-1 focus:ring-corporate-blue rounded-md outline-none text-sm transition-all"
            />
          </div>

          {/* Categories Horizontal Pills Selector */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter By Chemical Category
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold tracking-wide rounded transition-all border ${
                    selectedCategory === cat
                      ? "bg-corporate-blue border-corporate-blue text-white shadow-xs"
                      : "bg-white text-gray-600 border-gray-200 hover:border-corporate-blue hover:text-corporate-blue"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalogue Download Call-to-Action Bar (Professional Secondary Action) */}
        <div className="bg-white px-5 py-4 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-corporate-blue rounded border border-blue-100 hidden sm:block">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Complete Product Portfolio</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Download our verified, comprehensive B2B product catalogue instantly.</p>
            </div>
          </div>
          <button
            onClick={() => setCatalogueModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-gray-50 text-corporate-blue border-2 border-corporate-blue/30 hover:border-corporate-blue rounded font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            id="products-page-catalogue-download-btn"
          >
            <Download className="w-4 h-4 text-corporate-blue" />
            <span>Download Complete Catalogue</span>
          </button>
        </div>

        {/* Results Info Bar */}
        <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span>Showing {filteredProducts.length} of {products.length} Products</span>
          {selectedCategory !== "All Categories" && (
            <button
              onClick={() => setSelectedCategory("All Categories")}
              className="text-corporate-blue hover:underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        {/* Product Catalogue Grid */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 py-24 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-corporate-blue animate-spin" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
              Loading Portfolio Registry...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-12 h-12 text-gray-300" />
            <div>
              <h3 className="font-bold text-gray-800 text-lg">No formulations found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md">
                We couldn't find any products matching "{searchTerm}". Try refining your search keywords or browsing all categories.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
              }}
              className="px-5 py-2.5 bg-corporate-blue text-white text-xs font-bold uppercase rounded transition-colors"
            >
              Reset Search Parameters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-lg border border-gray-200/80 shadow-xs hover:shadow-md hover:border-corporate-blue/35 transition-all overflow-hidden flex flex-col group h-full"
              >
                {/* Visual chemistry image header */}
                <div className="h-32 bg-gray-950 relative overflow-hidden flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
                    <img
                      src={
                        prod.image || (
                        prod.category === "Acids"
                          ? "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=500&auto=format&fit=crop"
                          : prod.category === "Water Treatment Chemicals"
                          ? "https://images.unsplash.com/photo-1548826879-189db8744311?q=80&w=500&auto=format&fit=crop"
                          : prod.category === "Solvents"
                          ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=500&auto=format&fit=crop"
                          : prod.category === "Salts & Minerals"
                          ? "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500&auto=format&fit=crop"
                          : "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=500&auto=format&fit=crop"
                        )
                      }
                      alt={prod.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>

                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white font-mono font-bold text-xs px-2.5 py-1 rounded border border-white/20">
                    {prod.formula}
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-gray-900/90 text-white rounded px-2.5 py-1 border border-gray-800">
                    {getCategoryIcon(prod.category)}
                    <span className="text-[10px] uppercase tracking-wider font-extrabold">
                      {prod.category}
                    </span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="p-5 flex flex-col gap-3.5 flex-grow">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base md:text-lg group-hover:text-corporate-blue transition-colors">
                      {prod.name}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400 font-medium">
                      Formula ID: {prod.formula}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Key Benefits
                    </span>
                    <ul className="flex flex-col gap-1 text-[11px] text-gray-700">
                      {prod.keyBenefits.slice(0, 2).map((ben, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-corporate-blue font-bold shrink-0">•</span>
                          <span className="line-clamp-1">{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Primary Applications */}
                  <div className="flex flex-col gap-1.5 pt-1.5">
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

                {/* Card Action Buttons */}
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
            ))}
          </div>
        )}
      </div>

      {/* Global Enquiry Popup */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productName={selectedProduct}
      />

      {/* Catalogue Download Lead Magnet Modal */}
      <CatalogueDownloadModal
        isOpen={catalogueModalOpen}
        onClose={() => setCatalogueModalOpen(false)}
      />
    </div>
  );
}
