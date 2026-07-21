import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash, 
  Edit, 
  Copy, 
  Eye, 
  Check, 
  X, 
  Package, 
  CheckSquare, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Lock, 
  ArrowUpDown, 
  Database, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Star
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { Product } from "../../types/product";
import { CATEGORIES } from "../../productsData";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Published, Draft
  const [featuredFilter, setFeaturedFilter] = useState("All"); // All, Featured, Non-Featured
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc, name-desc, newest, oldest
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected items for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState("");

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(true); // Get all including unpublished
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getCategories(true); // include disabled in admin
      if (cats.length > 0) {
        setDynamicCategories(cats.map(c => c.name));
      } else {
        setDynamicCategories(CATEGORIES.filter(c => c !== "All Categories"));
      }
    } catch (err) {
      console.error("Failed to fetch dynamic categories for filter:", err);
      setDynamicCategories(CATEGORIES.filter(c => c !== "All Categories"));
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Seeding trigger for cold databases
  const handleSeedProducts = async () => {
    if (window.confirm("This will seed the Firestore database with the high-purity preloaded products. Proceed?")) {
      setSeedingLoading(true);
      try {
        await productService.seedProducts();
        alert("Products database successfully seeded!");
        await loadProducts();
      } catch (err) {
        console.error("Seeding failed:", err);
        alert("Failed to seed database. Check browser console logs.");
      } finally {
        setSeedingLoading(false);
      }
    }
  };

  // Inline Toggles
  const handleTogglePublish = async (product: Product) => {
    try {
      const nextState = !product.isPublished;
      await productService.saveProduct({ id: product.id, isPublished: nextState });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isPublished: nextState } : p));
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const nextState = !product.featured;
      await productService.saveProduct({ id: product.id, featured: nextState });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, featured: nextState } : p));
    } catch (err) {
      console.error("Failed to toggle featured status:", err);
    }
  };

  // Single Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await productService.deleteProduct(deleteId);
      setProducts(prev => prev.filter(p => p.id !== deleteId));
      setSelectedIds(prev => prev.filter(id => id !== deleteId));
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setDeleteId(null);
    }
  };

  // Duplicate Product Action
  const handleDuplicateProduct = async (product: Product) => {
    const newSlug = `${product.slug}-copy-${Math.random().toString(36).substring(2, 6)}`;
    const duplicateData: Partial<Product> & { id: string } = {
      ...product,
      id: newSlug,
      slug: newSlug,
      name: `${product.name} (Copy)`,
      featured: false,
      isPublished: false,
    };
    delete (duplicateData as any).createdAt;
    delete (duplicateData as any).updatedAt;

    try {
      setLoading(true);
      await productService.saveProduct(duplicateData);
      await loadProducts();
      alert(`Successfully duplicated as copy: ${duplicateData.name}`);
    } catch (err) {
      console.error("Failed to duplicate product:", err);
      alert("Failed to duplicate product.");
    } finally {
      setLoading(false);
    }
  };

  // Selection state helpers
  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = (currentFilteredItems: Product[]) => {
    const filteredIds = currentFilteredItems.map(p => p.id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...filteredIds])]);
    }
  };

  // Bulk Operations
  const handleBulkPublish = async (isPublished: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await productService.bulkPublish(selectedIds, isPublished);
      setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, isPublished } : p));
      setSelectedIds([]);
      alert(`Bulk ${isPublished ? "published" : "unpublished"} successfully!`);
    } catch (err) {
      console.error("Bulk publish operation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkFeatured = async (featured: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await productService.bulkFeatured(selectedIds, featured);
      setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, featured } : p));
      setSelectedIds([]);
      alert(`Bulk featured status updated successfully!`);
    } catch (err) {
      console.error("Bulk featured operation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you absolutely sure you want to delete ${selectedIds.length} products from the database? This action is irreversible.`)) {
      try {
        setLoading(true);
        await productService.bulkDelete(selectedIds);
        setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
        alert("Bulk deletion completed successfully!");
      } catch (err) {
        console.error("Bulk delete operation failed:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkCategoryUpdate = async () => {
    if (selectedIds.length === 0 || !bulkCategory) return;
    try {
      setLoading(true);
      await productService.bulkUpdateCategory(selectedIds, bulkCategory);
      setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, category: bulkCategory } : p));
      setSelectedIds([]);
      setBulkCategory("");
      setBulkActionOpen(false);
      alert("Bulk category updated successfully!");
    } catch (err) {
      console.error("Bulk category update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered and Sorted list computation
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.formula.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== "All") {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Status filter
    if (statusFilter === "Published") {
      result = result.filter(p => p.isPublished);
    } else if (statusFilter === "Draft") {
      result = result.filter(p => !p.isPublished);
    }

    // Featured filter
    if (featuredFilter === "Featured") {
      result = result.filter(p => p.featured);
    } else if (featuredFilter === "Non-Featured") {
      result = result.filter(p => !p.featured);
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "newest") {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      } else if (sortBy === "oldest") {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateA - dateB;
      }
      return 0;
    });

    return result;
  }, [products, searchQuery, categoryFilter, statusFilter, featuredFilter, sortBy]);

  // Pagination bounds
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProducts, currentPage]);

  // Automatically adjust current page if total pages shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const categoriesList = useMemo(() => {
    return dynamicCategories.length > 0 ? dynamicCategories : CATEGORIES.filter(c => c !== "All Categories");
  }, [dynamicCategories]);

  return (
    <AdminLayout title="Product Inventory CMS">
      <div className="space-y-6">
        
        {/* Top bar Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-gray-100 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#2FA8B8]/10 text-[#123C74]">
              <Package size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-wider block">
                B2B INVENTORY CONTROL
              </span>
              <h2 className="text-md font-bold text-[#123C74] uppercase tracking-tight">
                Product Database Records
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {products.length === 0 && !loading && (
              <button
                onClick={handleSeedProducts}
                disabled={seedingLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                <Database size={14} className={seedingLoading ? "animate-spin" : ""} />
                <span>Seed Database</span>
              </button>
            )}

            <button
              onClick={() => loadProducts()}
              className="inline-flex items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-100 transition-colors"
              title="Refresh records"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>

            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#123C74] hover:bg-[#2FA8B8] text-white text-xs font-extrabold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus size={14} />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-50 text-[#123C74]">
            <Filter size={15} />
            <span className="text-xs font-extrabold uppercase tracking-wider">Search & Dynamic Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search name, formula, slug..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="flex flex-col">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg bg-white outline-none"
              >
                <option value="All">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Published Status Select */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg bg-white outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published Online</option>
                <option value="Draft">Draft (Offline)</option>
              </select>
            </div>

            {/* Featured Select */}
            <div>
              <select
                value={featuredFilter}
                onChange={(e) => { setFeaturedFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg bg-white outline-none"
              >
                <option value="All">Featured (All)</option>
                <option value="Featured">Featured Only</option>
                <option value="Non-Featured">Non-Featured Only</option>
              </select>
            </div>

            {/* Sorting Select */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg bg-white outline-none"
              >
                <option value="name-asc">Alphabetical (A - Z)</option>
                <option value="name-desc">Alphabetical (Z - A)</option>
                <option value="newest">Created Date (Newest)</option>
                <option value="oldest">Created Date (Oldest)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Bulk Operations Sticky Drawer */}
        {selectedIds.length > 0 && (
          <div className="bg-[#123C74] text-white p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg animate-slide-in relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-3 relative z-10">
              <CheckSquare size={18} className="text-[#2FA8B8]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {selectedIds.length} Products Selected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 relative z-10">
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-extrabold uppercase rounded border border-emerald-500/20 transition-all"
              >
                Publish All
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-[10px] font-extrabold uppercase rounded border border-gray-500/20 transition-all"
              >
                Unpublish All
              </button>
              <button
                onClick={() => handleBulkFeatured(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-[10px] font-extrabold uppercase rounded border border-amber-500/20 flex items-center gap-1 transition-all"
              >
                <Star size={10} fill="currentColor" /> Feature All
              </button>
              <button
                onClick={() => handleBulkFeatured(false)}
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-[10px] font-extrabold uppercase rounded border border-gray-500/20 transition-all"
              >
                Unfeature All
              </button>
              
              <div className="relative inline-block">
                <button
                  onClick={() => setBulkActionOpen(!bulkActionOpen)}
                  className="px-3 py-1.5 bg-[#2FA8B8] hover:bg-[#218d9b] text-[10px] font-extrabold uppercase rounded border border-white/10 flex items-center gap-1.5 transition-all"
                >
                  <span>Set Category</span>
                  <ArrowUpDown size={10} />
                </button>
                {bulkActionOpen && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-100 rounded-md shadow-xl p-2 z-50 text-gray-800 w-48 font-semibold">
                    <span className="text-[9px] font-extrabold text-gray-400 block p-1 uppercase tracking-wider">Choose Category</span>
                    {categoriesList.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setBulkCategory(cat); }}
                        className={`w-full text-left px-2 py-1 text-xs hover:bg-gray-50 rounded block font-medium truncate ${bulkCategory === cat ? 'text-[#2FA8B8] font-bold bg-[#2FA8B8]/5' : ''}`}
                      >
                        {cat}
                      </button>
                    ))}
                    {bulkCategory && (
                      <button
                        onClick={handleBulkCategoryUpdate}
                        className="w-full text-center mt-2 bg-[#123C74] text-white py-1 rounded text-[10px] font-bold uppercase hover:bg-[#2FA8B8] transition-colors"
                      >
                        Apply Update
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-[10px] font-extrabold uppercase rounded border border-red-500/20 flex items-center gap-1 transition-all"
              >
                <Trash size={10} /> Delete Selected
              </button>
              
              <div className="h-4 w-[1px] bg-white/20 mx-1" />
              
              <button
                onClick={() => setSelectedIds([])}
                className="p-1 text-white/60 hover:text-white"
                title="Clear selection"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Database Products List */}
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-xs">
          
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-t-[#2FA8B8] border-r-[#123C74] border-b-[#123C74] border-l-[#123C74]/10 rounded-full animate-spin" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Reading database...</span>
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="py-20 px-8 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center border border-dashed border-gray-200">
                <FolderOpen size={28} />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">No Products Found</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  No chemical records matched your search filters. Try clearing inputs or seed the database using the button above.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="py-4 px-5 w-12 text-center">
                      <button 
                        onClick={() => handleSelectAllToggle(paginatedProducts)}
                        className="text-gray-400 hover:text-[#123C74] focus:outline-none inline-flex items-center"
                      >
                        {paginatedProducts.every(p => selectedIds.includes(p.id)) ? (
                          <CheckSquare size={16} className="text-[#2FA8B8]" />
                        ) : paginatedProducts.some(p => selectedIds.includes(p.id)) ? (
                          <div className="w-4 h-4 bg-[#2FA8B8]/10 border border-[#2FA8B8] rounded flex items-center justify-center text-[#2FA8B8]">
                            <div className="w-2 h-0.5 bg-[#2FA8B8]" />
                          </div>
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th className="py-4 px-4 w-16">Preview</th>
                    <th className="py-4 px-4">Chemical Product</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Formula & Specs</th>
                    <th className="py-4 px-4 text-center">Featured</th>
                    <th className="py-4 px-4 text-center">Online Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {paginatedProducts.map((p) => {
                    const isSelected = selectedIds.includes(p.id);
                    return (
                      <tr 
                        key={p.id}
                        className={`hover:bg-gray-50/50 transition-colors ${isSelected ? 'bg-blue-50/10' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => handleSelectToggle(p.id)}
                            className="text-gray-400 hover:text-[#123C74] focus:outline-none"
                          >
                            {isSelected ? (
                              <CheckSquare size={16} className="text-[#2FA8B8]" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </td>

                        {/* Thumbnail */}
                        <td className="py-4 px-4">
                          <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                            {p.image ? (
                              <img 
                                src={p.image} 
                                alt={p.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Package size={18} className="text-gray-300" />
                            )}
                          </div>
                        </td>

                        {/* Product Info */}
                        <td className="py-4 px-4 max-w-[250px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-gray-900 text-[13px] hover:text-[#2FA8B8] transition-colors leading-tight">
                              <Link to={`/admin/products/preview/${p.id}`}>{p.name}</Link>
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono tracking-wide">
                              slug: {p.slug}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 font-semibold text-[10px] rounded uppercase tracking-wider">
                            {p.category}
                          </span>
                        </td>

                        {/* Chemical Specifications */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold font-mono text-gray-700 text-[11px]">
                              {p.formula || "N/A"}
                            </span>
                            {p.casNumber && (
                              <span className="text-[10px] text-gray-400 font-medium">
                                CAS: {p.casNumber}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`p-1.5 rounded-full transition-colors ${
                              p.featured 
                                ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' 
                                : 'bg-gray-50 text-gray-300 hover:text-gray-400 hover:bg-gray-100'
                            }`}
                            title={p.featured ? "Unmark Featured" : "Mark Featured"}
                          >
                            <Star size={14} fill={p.featured ? "currentColor" : "none"} />
                          </button>
                        </td>

                        {/* Online Status Toggle */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleTogglePublish(p)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider leading-none border transition-colors ${
                              p.isPublished
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                                : "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                            }`}
                          >
                            {p.isPublished ? (
                              <>
                                <Globe size={11} />
                                <span>Published</span>
                              </>
                            ) : (
                              <>
                                <Lock size={11} />
                                <span>Draft</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/admin/products/preview/${p.id}`}
                              className="p-1.5 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-[#123C74] rounded transition-colors"
                              title="Live Preview Specs"
                            >
                              <Eye size={14} />
                            </Link>
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-1.5 bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 rounded transition-colors"
                              title="Duplicate Product"
                            >
                              <Copy size={14} />
                            </button>
                            <Link
                              to={`/admin/products/edit/${p.id}`}
                              className="p-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 rounded transition-colors"
                              title="Edit Specifications"
                            >
                              <Edit size={14} />
                            </Link>
                            <button
                              onClick={() => setDeleteId(p.id)}
                              className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded transition-colors"
                              title="Delete Record"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {processedProducts.length > 0 && !loading && (
            <div className="bg-gray-50 px-5 py-4 flex items-center justify-between border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                Showing <strong className="text-gray-800">{Math.min(processedProducts.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(processedProducts.length, currentPage * itemsPerPage)}</strong> of <strong className="text-gray-800">{processedProducts.length}</strong> chemical records
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 bg-white border border-gray-100 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-7 h-7 text-xs font-bold rounded flex items-center justify-center border transition-all ${
                      currentPage === idx + 1
                        ? "bg-[#123C74] border-[#123C74] text-white"
                        : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 bg-white border border-gray-100 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#123C74]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 max-w-sm w-full space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-tight">Delete Chemical Record?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Are you sure you want to delete this product? This will permanently remove its chemical formula, details, and attachments from Firestore.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded border border-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
