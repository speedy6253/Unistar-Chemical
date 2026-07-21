import React, { useState, useEffect } from "react";
import { 
  FolderOpen, Plus, Edit, Trash, Eye, EyeOff, Save, 
  AlertCircle, Check, Loader2, ArrowUpDown, ArrowUp, ArrowDown, X, Info
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { categoryService } from "../../services/categoryService";
import { Category } from "../../types/category";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    id: "",
    name: "",
    description: "",
    sortOrder: 10,
    visibility: true,
    status: "active"
  });

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await categoryService.getCategories(true); // include hidden/inactive
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError("Failed to retrieve categories from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Start Editing
  const handleEditClick = (cat: Category) => {
    setIsEditing(true);
    setFormData({
      id: cat.id,
      name: cat.name,
      description: cat.description || "",
      sortOrder: cat.sortOrder,
      visibility: cat.visibility,
      status: cat.status
    });
    setError("");
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      name: "",
      description: "",
      sortOrder: (categories.length + 1) * 10,
      visibility: true,
      status: "active"
    });
    setError("");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name?.trim()) {
      setError("Category Name is required.");
      return;
    }

    setSaveLoading(true);

    try {
      const slugId = formData.id || formData.name.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const finalCategory: Category = {
        id: slugId,
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        sortOrder: Number(formData.sortOrder) || 10,
        visibility: formData.visibility !== false,
        status: formData.status || "active"
      };

      await categoryService.saveCategory(finalCategory);
      setSuccess(`Category successfully ${isEditing ? "updated" : "created"}!`);
      
      // Reset form
      handleCancelEdit();
      
      // Reload list
      await loadCategories();

      // Clear success after 3s
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Save category failed:", err);
      setError("Failed to save category. " + (err.message || ""));
    } finally {
      setSaveLoading(false);
    }
  };

  // Quick visibility toggle
  const handleToggleVisibility = async (cat: Category) => {
    try {
      const nextVal = !cat.visibility;
      await categoryService.saveCategory({ id: cat.id, visibility: nextVal });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, visibility: nextVal } : c));
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  };

  // Quick status toggle
  const handleToggleStatus = async (cat: Category) => {
    try {
      const nextStatus = cat.status === "active" ? "inactive" : "active";
      await categoryService.saveCategory({ id: cat.id, status: nextStatus });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, status: nextStatus } : c));
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Delete Handler
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setError("");
    try {
      await categoryService.deleteCategory(deleteId);
      setSuccess("Category deleted successfully.");
      setCategories(prev => prev.filter(c => c.id !== deleteId));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Delete failed:", err);
      setError("Failed to delete category: " + (err.message || ""));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Product Category CMS">
      <div className="space-y-6">
        
        {/* Banner Top Bar */}
        <div className="flex items-center justify-between bg-white p-5 rounded-lg border border-gray-100 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#2FA8B8]/10 text-[#123C74]">
              <FolderOpen size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-wider block">
                HIERARCHY MANAGEMENT
              </span>
              <h2 className="text-md font-bold text-[#123C74] uppercase tracking-tight">
                Product Categories Portfolio
              </h2>
            </div>
          </div>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3 text-emerald-700 text-xs font-semibold animate-pulse">
            <Check size={16} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Two-Column Responsive Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left list: 8 Columns */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="bg-white border border-gray-100 rounded-lg shadow-xs overflow-hidden">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#123C74]">
                  Registered Categories ({categories.length})
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Sourced dynamically from Firestore
                </span>
              </div>

              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-10 h-10 text-corporate-blue animate-spin" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Loading categories...
                  </span>
                </div>
              ) : categories.length === 0 ? (
                <div className="py-16 px-4 text-center">
                  <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-sm font-extrabold text-gray-700 uppercase">No categories found</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                    Create your first industrial grade chemical category using the panel on the right.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/20 text-gray-500 font-bold uppercase tracking-wider">
                        <th className="p-4 text-center w-12">Order</th>
                        <th className="p-4">Category Name</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-center w-20">Visible</th>
                        <th className="p-4 text-center w-24">Status</th>
                        <th className="p-4 text-right pr-6 w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-700 font-bold rounded text-[11px]">
                              {cat.sortOrder}
                            </span>
                          </td>
                          <td className="p-4 font-extrabold text-gray-900 uppercase tracking-tight">
                            {cat.name}
                            <span className="block text-[10px] font-mono text-gray-400 font-normal lowercase tracking-normal">
                              ID: {cat.id}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500 max-w-xs truncate" title={cat.description}>
                            {cat.description || <span className="italic text-gray-300 text-[11px]">No description.</span>}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleVisibility(cat)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                cat.visibility 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                                  : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                              }`}
                              title={cat.visibility ? "Hide from website" : "Make visible on website"}
                            >
                              {cat.visibility ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleStatus(cat)}
                              className={`px-2 py-1 rounded text-[9px] font-extrabold uppercase border transition-all ${
                                cat.status === "active"
                                  ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                                  : "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"
                              }`}
                            >
                              {cat.status}
                            </button>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditClick(cat)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-100 transition-all"
                                title="Edit properties"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(cat.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all"
                                title="Delete category"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-blue-50/80 border border-blue-100 text-corporate-blue p-4 rounded-lg flex items-start gap-2.5 text-xs">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold block uppercase tracking-wider mb-1">Corporate Hierarchy Note</strong>
                <span className="text-gray-600">
                  Modifying category ordering and statuses here directly updates the filter widgets on the main Portfolio page, and re-orders listing grids immediately. Existing products will remain categorized but hidden if their category is deactivated.
                </span>
              </div>
            </div>
          </div>

          {/* Right form: 4 Columns */}
          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-50 text-[#123C74]">
              {isEditing ? <Edit size={15} className="text-[#2FA8B8]" /> : <Plus size={15} />}
              <span className="text-xs font-extrabold uppercase tracking-wider">
                {isEditing ? "Modify Specifications" : "Register New Category"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Category Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Fine Catalysts, Alkalis"
                  className="w-full px-3 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="B2B description or chemical grading information..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none resize-none"
                />
              </div>

              {/* Sort Order & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Sort Order *</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="1"
                    className="w-full px-3 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg bg-white outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Visibility checkbox */}
              <label className="flex items-center gap-2 px-3 py-2.5 border border-gray-100 rounded-lg hover:bg-gray-50/50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="visibility"
                  checked={formData.visibility}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#2FA8B8] focus:ring-[#2FA8B8]"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-700">Display Category</span>
                  <span className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Show this category on public menus</span>
                </div>
              </label>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase rounded-lg transition-colors border border-gray-200"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="flex-1 py-2 bg-[#123C74] hover:bg-[#2FA8B8] text-white text-xs font-extrabold uppercase rounded-lg shadow transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {saveLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>{isEditing ? "Save Changes" : "Create Record"}</span>
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>

      {/* Modern Minimalist Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-gray-100 w-full max-w-sm rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">
                Confirm Deletion
              </h3>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              Are you sure you want to delete category <strong>"{deleteId}"</strong>? This will remove the category listing immediately. Products associated with this category will not be deleted, but may need to be re-categorized.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-xs font-bold uppercase rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg shadow-md transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
