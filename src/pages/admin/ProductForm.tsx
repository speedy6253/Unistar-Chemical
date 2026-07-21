import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  AlertCircle, 
  Check, 
  Loader2,
  Sparkles,
  Star,
  Globe,
  Lock,
  FileDown,
  X,
  RefreshCw,
  GripVertical
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { Product } from "../../types/product";
import { CATEGORIES } from "../../productsData";
import { storage } from "../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Tab layout state
  const [activeTab, setActiveTab] = useState("basic"); // basic, chemical, packaging, media, seo

  // Product Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    id: "",
    name: "",
    slug: "",
    category: "",
    formula: "",
    description: "",
    longDescription: "",
    casNumber: "",
    hsnCode: "",
    applications: [],
    keyBenefits: [], // maps to Specifications
    packaging: "",
    storageInstructions: "",
    safetyInformation: "",
    technicalNotes: "",
    image: "",
    images: [],
    pdfUrl: "",
    featured: false,
    isPublished: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoCanonicalUrl: "",
    seoOgImage: ""
  });

  // Dynamic lists helper states
  const [newApplication, setNewApplication] = useState("");
  const [newKeyBenefit, setNewKeyBenefit] = useState("");

  // Media upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadError, setUploadError] = useState("");

  // PDF upload state
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  // Dynamic Categories list
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadFormCategoriesAndProduct = async () => {
      setLoading(true);
      setError("");
      let cats: string[] = [];
      try {
        const dynamicCats = await categoryService.getCategories(true); // include hidden/inactive in form
        if (dynamicCats.length > 0) {
          cats = dynamicCats.map(c => c.name);
        } else {
          cats = CATEGORIES.filter(c => c !== "All Categories");
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        cats = CATEGORIES.filter(c => c !== "All Categories");
      }
      setDynamicCategories(cats);

      if (isEditMode && id) {
        try {
          const product = await productService.getProduct(id);
          if (product) {
            setFormData(product);
          } else {
            setError("The requested product does not exist.");
          }
        } catch (err) {
          console.error("Failed to load product:", err);
          setError("Failed to load product data from database.");
        }
      } else {
        // Default category setting
        const defaultCategory = cats[0] || "";
        setFormData(prev => ({ ...prev, category: defaultCategory }));
      }
      setLoading(false);
    };

    loadFormCategoriesAndProduct();
  }, [isEditMode, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug from name in CREATE mode
      if (name === "name" && !isEditMode) {
        updated.slug = generateSlug(value);
        updated.id = updated.slug;
      }
      
      return updated;
    });
  };

  const handleSlugBlur = () => {
    if (formData.slug) {
      const clean = generateSlug(formData.slug);
      setFormData(prev => ({ 
        ...prev, 
        slug: clean,
        id: isEditMode ? prev.id : clean 
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Applications list managers
  const addApplication = () => {
    if (newApplication.trim() && formData.applications) {
      if (!formData.applications.includes(newApplication.trim())) {
        setFormData(prev => ({
          ...prev,
          applications: [...(prev.applications || []), newApplication.trim()]
        }));
      }
      setNewApplication("");
    }
  };

  const removeApplication = (index: number) => {
    if (formData.applications) {
      setFormData(prev => ({
        ...prev,
        applications: (prev.applications || []).filter((_, i) => i !== index)
      }));
    }
  };

  // Key Benefits list managers
  const addKeyBenefit = () => {
    if (newKeyBenefit.trim() && formData.keyBenefits) {
      if (!formData.keyBenefits.includes(newKeyBenefit.trim())) {
        setFormData(prev => ({
          ...prev,
          keyBenefits: [...(prev.keyBenefits || []), newKeyBenefit.trim()]
        }));
      }
      setNewKeyBenefit("");
    }
  };

  const removeKeyBenefit = (index: number) => {
    if (formData.keyBenefits) {
      setFormData(prev => ({
        ...prev,
        keyBenefits: (prev.keyBenefits || []).filter((_, i) => i !== index)
      }));
    }
  };

  // Image Compress & Convert to WebP (runs client-side)
  const compressAndConvertToWebP = (file: File, maxW = 1000, maxH = 1000, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          if (width > maxW || height > maxH) {
            if (width > height) {
              height = Math.round((height * maxW) / width);
              width = maxW;
            } else {
              width = Math.round((width * maxH) / height);
              height = maxH;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("WebP conversion failed."));
            },
            "image/webp",
            quality
          );
        };
        img.onerror = () => reject(new Error("Image failed to load."));
      };
      reader.onerror = () => reject(new Error("File reading failed."));
    });
  };

  // Drag & drop state for images
  const [dragActive, setDragActive] = useState(false);
  // Drag & drop state for PDF
  const [dragActivePdf, setDragActivePdf] = useState(false);

  // Helper to delete an object from storage if it is a firebase URL
  const deleteStorageFile = async (url: string) => {
    try {
      if (url.includes("firebasestorage.googleapis.com")) {
        const decodedUrl = decodeURIComponent(url);
        const parts = decodedUrl.split("/o/")[1]?.split("?")[0];
        if (parts) {
          const storageRef = ref(storage, parts);
          await deleteObject(storageRef);
        }
      }
    } catch (err) {
      console.warn("Storage cleanup warning:", err);
    }
  };

  // Multiple Image Upload Helper
  const uploadFileList = async (files: FileList) => {
    setIsUploading(true);
    setUploadError("");

    const productSlug = formData.slug || "products";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = Math.random().toString(36).substring(2, 8);

      // Validation 1: File format check
      if (!file.type.startsWith("image/")) {
        setUploadError(`Skipped non-image file: ${file.name}`);
        continue;
      }

      // Validation 2: File size check (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`Skipped file: ${file.name} (exceeds 10MB limit)`);
        continue;
      }

      // Execution with automatic retry (up to 2 attempts)
      let attempt = 0;
      const maxAttempts = 2;
      let success = false;

      while (attempt < maxAttempts && !success) {
        attempt++;
        try {
          setUploadProgress(prev => ({ ...prev, [tempId]: 10 }));
          const compressedBlob = await compressAndConvertToWebP(file);
          setUploadProgress(prev => ({ ...prev, [tempId]: 40 }));

          const filePath = `products/${productSlug}/${productSlug}_image_${Date.now()}_${tempId}.webp`;
          const storageRef = ref(storage, filePath);
          const uploadTask = uploadBytesResumable(storageRef, compressedBlob);

          await new Promise<void>((resolve, reject) => {
            uploadTask.on("state_changed",
              (snapshot) => {
                const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 50) + 40;
                setUploadProgress(prev => ({ ...prev, [tempId]: pct }));
              },
              (err) => {
                reject(err);
              },
              async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                
                setFormData(prev => {
                  const currentImages = prev.images || [];
                  const updatedImages = [...currentImages, downloadUrl];
                  return {
                    ...prev,
                    images: updatedImages,
                    image: prev.image ? prev.image : downloadUrl
                  };
                });

                success = true;
                resolve();
              }
            );
          });
          
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated[tempId];
            return updated;
          });

        } catch (err: any) {
          console.error(`Upload attempt ${attempt} failed for ${file.name}:`, err);
          if (attempt >= maxAttempts) {
            setUploadError(`Failed to upload ${file.name} after multiple attempts.`);
          }
        }
      }
    }
    setIsUploading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFileList(e.target.files);
    }
  };

  // Drag & drop handlers for images
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFileList(e.dataTransfer.files);
    }
  };

  // HTML5 Drag & Drop Thumbnail Reordering
  const handleThumbnailDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleThumbnailDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData("text/plain");
    if (!sourceIndexStr) return;
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    setFormData(prev => {
      const list = [...(prev.images || [])];
      const [removed] = list.splice(sourceIndex, 1);
      list.splice(targetIndex, 0, removed);
      return { ...prev, images: list };
    });
  };

  // Replace Image At Index
  const handleReplaceImage = async (urlToReplace: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Unsupported file format. Please upload images only.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    const productSlug = formData.slug || "products";
    const tempId = Math.random().toString(36).substring(2, 8);

    try {
      // First delete old image from storage to prevent orphan files
      await deleteStorageFile(urlToReplace);

      const compressedBlob = await compressAndConvertToWebP(file);
      const filePath = `products/${productSlug}/${productSlug}_image_replaced_${Date.now()}_${tempId}.webp`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, compressedBlob);

      uploadTask.on("state_changed", null, 
        (err) => {
          console.error("Replacement failed:", err);
          alert("Failed to upload replacement image: " + err.message);
          setIsUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData(prev => {
            const list = [...(prev.images || [])];
            const idx = list.indexOf(urlToReplace);
            if (idx !== -1) {
              list[idx] = downloadUrl;
            } else {
              list.push(downloadUrl);
            }
            const isMain = prev.image === urlToReplace;
            return {
              ...prev,
              images: list,
              image: isMain ? downloadUrl : (prev.image || downloadUrl)
            };
          });
          setIsUploading(false);
        }
      );
    } catch (err: any) {
      console.error("Image replacement compression failed:", err);
      alert("Conversion failed: " + err.message);
      setIsUploading(false);
    }
  };

  const removeUploadedImage = async (url: string) => {
    await deleteStorageFile(url);

    setFormData(prev => {
      const updatedImages = (prev.images || []).filter(img => img !== url);
      let newMainImage = prev.image;
      
      // If we deleted the main image, point to the next available, or empty
      if (prev.image === url) {
        newMainImage = updatedImages.length > 0 ? updatedImages[0] : "";
      }
      
      return {
        ...prev,
        images: updatedImages,
        image: newMainImage
      };
    });
  };

  const setPrimaryImage = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  // PDF Document Drag & Drop handlers
  const handleDragPdf = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActivePdf(true);
    } else if (e.type === "dragleave") {
      setDragActivePdf(false);
    }
  };

  const handleDropPdf = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivePdf(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadPdfFile(e.dataTransfer.files[0]);
    }
  };

  const uploadPdfFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF documents are supported for technical attachment uploads.");
      return;
    }
    // Validation 3: File size check (max 15MB for PDF)
    if (file.size > 15 * 1024 * 1024) {
      alert("PDF exceeds 15MB size limit.");
      return;
    }

    setIsPdfUploading(true);
    setPdfProgress(10);

    const productSlug = formData.slug || "products";
    const filePath = `products/${productSlug}/docs/${productSlug}_sds_tds_${Date.now()}.pdf`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 90) + 10;
        setPdfProgress(pct);
      },
      (err) => {
        console.error("PDF upload error:", err);
        alert("PDF document upload failed: " + err.message);
        setIsPdfUploading(false);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Clean up old PDF if replacing
        if (formData.pdfUrl) {
          await deleteStorageFile(formData.pdfUrl);
        }

        setFormData(prev => ({ ...prev, pdfUrl: downloadUrl }));
        setIsPdfUploading(false);
        setPdfProgress(0);
      }
    );
  };

  // PDF Document Upload Handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadPdfFile(file);
    }
  };

  const removePdfUrl = async () => {
    if (!formData.pdfUrl) return;
    await deleteStorageFile(formData.pdfUrl);
    setFormData(prev => ({ ...prev, pdfUrl: "" }));
  };

  // Save/Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate requirements
    if (!formData.name?.trim()) {
      setError("Product Name is required.");
      setActiveTab("basic");
      return;
    }
    if (!formData.slug?.trim()) {
      setError("Product Slug/ID is required.");
      setActiveTab("basic");
      return;
    }
    if (!formData.category) {
      setError("Please select a Product Category.");
      setActiveTab("basic");
      return;
    }
    if (!formData.formula?.trim()) {
      setError("Chemical Formula is required (e.g. H2SO4 or 'Composite Blend').");
      setActiveTab("chemical");
      return;
    }
    if (!formData.description?.trim()) {
      setError("Short Description is required for public previews.");
      setActiveTab("basic");
      return;
    }
    if (!formData.packaging?.trim()) {
      setError("Packaging details are required (e.g. '50kg HDPE Carboys').");
      setActiveTab("packaging");
      return;
    }

    setSaveLoading(true);

    try {
      const finalSlug = generateSlug(formData.slug);

      // Validation 4: Duplicate Slug Check (only in create mode)
      if (!isEditMode) {
        const existing = await productService.getProduct(finalSlug);
        if (existing) {
          setError(`A product with slug/ID "${finalSlug}" already exists in the database. Please specify a unique name or slug.`);
          setSaveLoading(false);
          setActiveTab("basic");
          return;
        }
      }

      const finalProduct: Product = {
        id: isEditMode ? (formData.id || finalSlug) : finalSlug,
        slug: finalSlug,
        name: formData.name.trim(),
        category: formData.category,
        formula: formData.formula.trim(),
        description: formData.description.trim(),
        longDescription: formData.longDescription?.trim() || "",
        casNumber: formData.casNumber?.trim() || "",
        hsnCode: formData.hsnCode?.trim() || "",
        applications: formData.applications || [],
        keyBenefits: formData.keyBenefits || [],
        specifications: formData.keyBenefits || [],
        packaging: formData.packaging.trim(),
        storageInstructions: formData.storageInstructions?.trim() || "",
        safetyInformation: formData.safetyInformation?.trim() || "",
        technicalNotes: formData.technicalNotes?.trim() || "",
        image: formData.image || "",
        images: formData.images || [],
        pdfUrl: formData.pdfUrl || "",
        featured: !!formData.featured,
        isPublished: typeof formData.isPublished === "boolean" ? formData.isPublished : true,
        seoTitle: formData.seoTitle?.trim() || "",
        seoDescription: formData.seoDescription?.trim() || "",
        seoKeywords: formData.seoKeywords?.trim() || "",
        seoCanonicalUrl: formData.seoCanonicalUrl?.trim() || "",
        seoOgImage: formData.seoOgImage?.trim() || ""
      };

      await productService.saveProduct(finalProduct);
      setSuccess("Product specifications saved successfully!");
      
      // Delay navigation slightly to let state update
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);

    } catch (err: any) {
      console.error("Save product error:", err);
      setError("Database save error: " + (err.message || String(err)));
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <AdminLayout title={isEditMode ? `Edit Product: ${formData.name || "Loading..."}` : "Add New Chemical Product"}>
      <div className="space-y-6">
        
        {/* Navigation Breadcrumb Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#123C74] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Inventory</span>
          </Link>

          <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-widest pl-2.5 border-l-2 border-[#2FA8B8]">
            {isEditMode ? "EDIT MODE ACTIVE" : "CREATING NEW RECORD"}
          </span>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="font-semibold">{error}</div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3 text-emerald-700 text-xs animate-pulse">
            <Check size={16} className="shrink-0 mt-0.5" />
            <div className="font-extrabold">{success}</div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-100 p-24 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#123C74]" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Querying product document...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left sidebar: Section Tabs */}
            <div className="space-y-2">
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-xs space-y-1">
                {[
                  { id: "basic", label: "Basic Specifications" },
                  { id: "chemical", label: "Chemical Properties" },
                  { id: "packaging", label: "Handling & Safety" },
                  { id: "media", label: "Attachments & Media" },
                  { id: "seo", label: "Publishing & SEO" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-[#123C74] text-white shadow-md shadow-[#123C74]/5"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Publish Quick Info */}
              <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-xs space-y-4">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block border-b border-gray-50 pb-2">Status overview</span>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Published:</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${formData.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {formData.isPublished ? <Globe size={10} /> : <Lock size={10} />}
                      {formData.isPublished ? "Online" : "Draft"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Featured:</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${formData.featured ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-gray-50 text-gray-500'}`}>
                      <Star size={10} fill={formData.featured ? "currentColor" : "none"} />
                      {formData.featured ? "Featured" : "Regular"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#2FA8B8] hover:bg-[#123C74] text-white text-xs font-extrabold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {saveLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Specifications</span>
                </button>
              </div>
            </div>

            {/* Right container: Workspace */}
            <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl p-6 lg:p-8 shadow-xs min-h-[500px] flex flex-col justify-between">
              
              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-50 pb-3">
                    <h3 className="text-sm font-extrabold text-[#123C74] uppercase tracking-tight">Basic Specifications</h3>
                    <p className="text-[11px] text-gray-400">Establish the essential cataloguing references for the product listing.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. Ultra-Pure Nitric Acid 68%"
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Product Slug/ID *</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug || ""}
                        onChange={handleInputChange}
                        onBlur={handleSlugBlur}
                        placeholder="e.g. nitric-acid-68"
                        disabled={isEditMode}
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-mono disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        required
                      />
                      {!isEditMode && <span className="text-[10px] text-gray-400 block">Auto-generated from name. Cannot change once saved.</span>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Product Category *</label>
                      <select
                        name="category"
                        value={formData.category || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg bg-white outline-none font-medium"
                        required
                      >
                        {dynamicCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Short Description (Summary) *</label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      placeholder="Enter a compelling 1-2 sentence summary to display on lists and overview cards."
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium resize-y"
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Long Description (Comprehensive Web Spec)</label>
                    <textarea
                      name="longDescription"
                      value={formData.longDescription || ""}
                      onChange={handleInputChange}
                      placeholder="Provide full description details, synthetic origin, chemical reactions, or physical profiles."
                      rows={6}
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium resize-y"
                      maxLength={5000}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CHEMICAL PROPERTIES */}
              {activeTab === "chemical" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-50 pb-3">
                    <h3 className="text-sm font-extrabold text-[#123C74] uppercase tracking-tight">Chemical Properties</h3>
                    <p className="text-[11px] text-gray-400">Specify the precise chemical markers, molecular identity, and application arrays.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Chemical Formula *</label>
                      <input
                        type="text"
                        name="formula"
                        value={formData.formula || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. HNO3 or Composite Blend"
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">CAS Number (Registry)</label>
                      <input
                        type="text"
                        name="casNumber"
                        value={formData.casNumber || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. 7697-37-2"
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">HSN Code (B2B Trade)</label>
                      <input
                        type="text"
                        name="hsnCode"
                        value={formData.hsnCode || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. 2808 00 10"
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Applications Multi-Item Manager */}
                  <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Industrial Applications Array</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newApplication}
                        onChange={(e) => setNewApplication(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addApplication(); } }}
                        placeholder="e.g. Metal etching in micro-electronics"
                        className="flex-grow px-3.5 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={addApplication}
                        className="px-3 bg-[#123C74] hover:bg-[#2FA8B8] text-white rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.applications && formData.applications.length > 0 ? (
                        formData.applications.map((app, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-[#123C74]/5 border border-[#123C74]/10 rounded-full text-xs font-semibold text-gray-700 leading-none"
                          >
                            <span>{app}</span>
                            <button
                              type="button"
                              onClick={() => removeApplication(index)}
                              className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No applications registered. Please specify at least one.</span>
                      )}
                    </div>
                  </div>

                  {/* Key Benefits (Specifications) Multi-Item Manager */}
                  <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Technical Specifications / Key Benefits</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKeyBenefit}
                        onChange={(e) => setNewKeyBenefit(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addKeyBenefit(); } }}
                        placeholder="e.g. Iron trace limit ≤ 0.5 ppm"
                        className="flex-grow px-3.5 py-2 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={addKeyBenefit}
                        className="px-3 bg-[#123C74] hover:bg-[#2FA8B8] text-white rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.keyBenefits && formData.keyBenefits.length > 0 ? (
                        formData.keyBenefits.map((benefit, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-800 leading-none"
                          >
                            <span>{benefit}</span>
                            <button
                              type="button"
                              onClick={() => removeKeyBenefit(index)}
                              className="p-0.5 rounded-full hover:bg-emerald-100 text-emerald-400 hover:text-red-500 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No specifications registered. Point to quality benchmarks.</span>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: HANDLING & SAFETY */}
              {activeTab === "packaging" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-50 pb-3">
                    <h3 className="text-sm font-extrabold text-[#123C74] uppercase tracking-tight">Handling & Logistics</h3>
                    <p className="text-[11px] text-gray-400">Record storage safety constants, packing styles, and MSDS/hazmat directives.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Packaging Configurations *</label>
                    <input
                      type="text"
                      name="packaging"
                      value={formData.packaging || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. 50kg Carboys, 250kg HM-HDPE Drums, or Bulk ISO Tankers"
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Storage Directives (Hazard Control)</label>
                      <textarea
                        name="storageInstructions"
                        value={formData.storageInstructions || ""}
                        onChange={handleInputChange}
                        placeholder="Specify moisture parameters, fire controls, temperature targets, or material incompatibilities."
                        rows={4}
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium resize-y"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Safety & Protective Gear Info</label>
                      <textarea
                        name="safetyInformation"
                        value={formData.safetyInformation || ""}
                        onChange={handleInputChange}
                        placeholder="List hazard warning classifications, emergency showers, PPE specs, ventilation systems."
                        rows={4}
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium resize-y"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Logistics & Technical Notes (Special Operations)</label>
                    <textarea
                      name="technicalNotes"
                      value={formData.technicalNotes || ""}
                      onChange={handleInputChange}
                      placeholder="Add standard inspection logs, certificate of analysis (COA) compliance, or freight classifications."
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium resize-y"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ATTACHMENTS & MEDIA */}
              {activeTab === "media" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-50 pb-3">
                    <h3 className="text-sm font-extrabold text-[#123C74] uppercase tracking-tight">Product Assets & File Attachments</h3>
                    <p className="text-[11px] text-gray-400">Upload multiple product photos and link technical datasheets (PDF).</p>
                  </div>

                  {/* Multiple Image Gallery */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Product Image Gallery (Supports multiple uploads)</label>
                      {formData.images && formData.images.length > 0 && (
                        <span className="text-[10px] text-gray-400 font-bold">{formData.images.length} Image(s) listed</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {formData.images && formData.images.map((imgUrl, index) => {
                        const isMain = formData.image === imgUrl;
                        return (
                          <div 
                            key={index} 
                            draggable
                            onDragStart={(e) => handleThumbnailDragStart(e, index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleThumbnailDrop(e, index)}
                            className={`group relative rounded-xl aspect-square border overflow-hidden bg-gray-50/50 flex flex-col justify-between p-2.5 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                              isMain ? 'border-[#2FA8B8] shadow-sm' : 'border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <img 
                              src={imgUrl} 
                              alt="Uploaded visual" 
                              className="absolute inset-0 w-full h-full object-cover z-0"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Backdrop gradient on hover */}
                            <div className="absolute inset-0 bg-[#123C74]/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                            {/* Drag Handle Icon on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              <div className="bg-white/80 p-1.5 rounded-full shadow-xs">
                                <GripVertical size={16} className="text-[#123C74]" />
                              </div>
                            </div>

                            {/* Badge & Set Primary */}
                            <div className="relative z-20 self-start">
                              {isMain ? (
                                <span className="inline-flex items-center px-2 py-0.5 bg-[#2FA8B8] text-white text-[9px] font-extrabold uppercase rounded shadow-xs">
                                  Primary Image
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setPrimaryImage(imgUrl)}
                                  className="inline-flex items-center px-2 py-0.5 bg-white hover:bg-[#123C74] text-gray-700 hover:text-white text-[9px] font-extrabold uppercase rounded shadow-xs transition-colors cursor-pointer"
                                >
                                  Set Primary
                                </button>
                              )}
                            </div>

                            {/* Action Row: Replace & Delete */}
                            <div className="relative z-20 flex justify-between w-full">
                              <label 
                                className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer" 
                                title="Replace Image with New File"
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleReplaceImage(imgUrl, e)}
                                  className="hidden"
                                />
                                <RefreshCw size={11} />
                              </label>

                              <button
                                type="button"
                                onClick={() => removeUploadedImage(imgUrl)}
                                className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer"
                                title="Delete from Storage"
                              >
                                <Trash size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Image Upload card with Drag & Drop */}
                      <label 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`cursor-pointer border-2 border-dashed aspect-square rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-center transition-all group ${
                          dragActive 
                            ? "border-[#2FA8B8] bg-[#2FA8B8]/10 text-[#2FA8B8]" 
                            : "border-gray-200 hover:border-[#2FA8B8] hover:bg-gray-50/50"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="p-2.5 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#2FA8B8]/10 group-hover:text-[#2FA8B8] transition-colors">
                          <Upload size={18} />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-gray-700 block">
                            {dragActive ? "Drop Images Here" : "Upload Images"}
                          </span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">Drag-drop or browse. Compresses to WebP</span>
                        </div>
                      </label>
                    </div>

                    {/* Progress feedback */}
                    {Object.keys(uploadProgress).length > 0 && (
                      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg space-y-2 text-xs">
                        <span className="font-bold text-[#123C74] uppercase block tracking-wider text-[10px]">Processing optimization stream...</span>
                        {Object.entries(uploadProgress).map(([id, pct]) => (
                          <div key={id} className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-gray-500 shrink-0">Asset {id}:</span>
                            <div className="flex-grow bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#2FA8B8] h-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-bold text-gray-700 w-8 text-right shrink-0">{pct}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PDF Document Attachment */}
                  <div className="space-y-3 p-5 bg-gray-50/50 border border-gray-100 rounded-xl">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Technical Specification Leaflet (PDF Document)</label>
                    <p className="text-[10px] text-gray-400">Attach a safe product TDS/MSDS sheet. This PDF link will activate the "Download Catalogue / Specs" trigger on the public details card.</p>
                    
                    {formData.pdfUrl ? (
                      <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded bg-red-50 text-red-600 shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-gray-800 block truncate">Technical specifications file attached</span>
                            <a 
                              href={formData.pdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[10px] text-[#2FA8B8] font-semibold hover:underline inline-flex items-center gap-0.5 mt-0.5"
                            >
                              <span>Inspect PDF file</span>
                              <FileDown size={11} />
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded transition-colors cursor-pointer" title="Replace PDF file">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={handlePdfUpload}
                              className="hidden"
                            />
                            <RefreshCw size={15} />
                          </label>

                          <button
                            type="button"
                            onClick={removePdfUrl}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-colors"
                            title="Remove PDF reference"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label 
                          onDragEnter={handleDragPdf}
                          onDragOver={handleDragPdf}
                          onDragLeave={handleDragPdf}
                          onDrop={handleDropPdf}
                          className={`cursor-pointer border-2 border-dashed rounded-lg p-5 flex items-center justify-center gap-3 text-center transition-colors group ${
                            dragActivePdf 
                              ? "border-red-500 bg-red-50/50" 
                              : "border-gray-200 hover:border-red-400 hover:bg-white"
                          }`}
                        >
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfUpload}
                            className="hidden"
                          />
                          <FileText size={22} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                          <div className="text-left">
                            <span className="text-xs font-bold text-gray-700 block">
                              {dragActivePdf ? "Drop PDF file here" : "Select Product PDF Booklet"}
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">Drag-drop or browse. Required format: PDF document (.pdf)</span>
                          </div>
                        </label>

                        {isPdfUploading && (
                          <div className="flex items-center gap-3 text-xs bg-red-50/50 p-2.5 rounded border border-red-100">
                            <Loader2 size={14} className="animate-spin text-red-600 shrink-0" />
                            <span className="font-semibold text-gray-600">Uploading leaflet...</span>
                            <div className="flex-grow bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-red-500 h-full" style={{ width: `${pdfProgress}%` }} />
                            </div>
                            <span className="font-bold text-gray-700">{pdfProgress}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 5: PUBLISHING & SEO */}
              {activeTab === "seo" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-50 pb-3">
                    <h3 className="text-sm font-extrabold text-[#123C74] uppercase tracking-tight">Publishing & SEO Configuration</h3>
                    <p className="text-[11px] text-gray-400">Configure indexing metadata, meta tags, and web visibility states.</p>
                  </div>

                  {/* Publishing settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="isPublished"
                        name="isPublished"
                        checked={!!formData.isPublished}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-[#2FA8B8] focus:ring-[#2FA8B8] border-gray-200 rounded mt-1 cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <label htmlFor="isPublished" className="text-xs font-extrabold text-gray-800 uppercase tracking-wider block cursor-pointer">Publish specifications online</label>
                        <span className="text-[11px] text-gray-400 leading-relaxed block">When active, this chemical product will show in public queries on the corporate products grid instantly.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={!!formData.featured}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-400 border-gray-200 rounded mt-1 cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <label htmlFor="featured" className="text-xs font-extrabold text-gray-800 uppercase tracking-wider block cursor-pointer">Featured chemical flagship</label>
                        <span className="text-[11px] text-gray-400 leading-relaxed block">Highlights this formulation across specialized landing columns or featured catalogs on the Home page.</span>
                      </div>
                    </div>
                  </div>

                  {/* SEO fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block border-b border-gray-50 pb-1.5">Meta Search Engine Parameters</span>
                      
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">SEO Meta Title Override</label>
                        <input
                          type="text"
                          name="seoTitle"
                          value={formData.seoTitle || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. High Purity Nitric Acid Manufacturer | Unistar Chemicals"
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">SEO Meta Description</label>
                        <textarea
                          name="seoDescription"
                          value={formData.seoDescription || ""}
                          onChange={handleInputChange}
                          placeholder="Provide a concise summary tailored for search results listings (150-160 characters recommended)."
                          rows={3}
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium resize-y"
                          maxLength={3000}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Search Keywords (Comma Separated)</label>
                        <input
                          type="text"
                          name="seoKeywords"
                          value={formData.seoKeywords || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. nitric acid, high purity solvents, West Bengal chemicals, industrial acids"
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Canonical URL Override</label>
                        <input
                          type="url"
                          name="seoCanonicalUrl"
                          value={formData.seoCanonicalUrl || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. https://unistarchemicals.com/products/nitric-acid-68"
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium font-mono text-[11px]"
                        />
                        <span className="text-[9px] text-gray-400 block">Default: https://unistarchemicals.com/products/{formData.slug || "product-slug"}</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Social Share OG Image Link</label>
                        <input
                          type="url"
                          name="seoOgImage"
                          value={formData.seoOgImage || ""}
                          onChange={handleInputChange}
                          placeholder="Link to dedicated social meta image (or defaults to first gallery photo)"
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 focus:border-[#2FA8B8] focus:ring-1 focus:ring-[#2FA8B8] rounded-lg outline-none font-medium font-mono text-[11px]"
                        />
                        <span className="text-[9px] text-gray-400 block">Defaults to the main product image if empty.</span>
                      </div>
                    </div>

                    {/* Live SEO Preview Pane */}
                    <div className="space-y-6 lg:border-l lg:border-gray-100 lg:pl-8">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block border-b border-gray-50 pb-1.5">Live Interactive SERP & Meta Previews</span>

                      {/* Google Search Listing Preview */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Google Search Result Preview</span>
                        <div className="bg-white border border-gray-200/60 rounded-xl p-5 shadow-xs max-w-xl text-left space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 truncate">
                            <span className="font-semibold text-gray-700">Unistar Chemicals</span>
                            <span>›</span>
                            <span>products</span>
                            <span>›</span>
                            <span className="text-gray-400 font-mono">{formData.slug || "product-slug"}</span>
                          </div>
                          <h4 className="text-[17px] text-blue-800 hover:underline font-semibold leading-snug truncate">
                            {formData.seoTitle?.trim() || `${formData.name || "Product Formulation Specifications"} | Unistar Chemicals`}
                          </h4>
                          <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2">
                            {formData.seoDescription?.trim() || formData.description?.trim() || "Unistar Chemicals specifications sheet. Inspect hazard ratings, formulation grades, packaging structures, chemical formula and technical safety parameters."}
                          </p>
                        </div>
                      </div>

                      {/* Social Media Link Card Preview */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Social Share Preview (OpenGraph / LinkedIn / Facebook)</span>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden max-w-sm text-left shadow-xs">
                          <div className="aspect-[1.91/1] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                            {formData.seoOgImage || formData.image ? (
                              <img 
                                src={formData.seoOgImage || formData.image} 
                                alt="OG preview" 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                <span className="text-[10px] text-gray-400 font-bold">No asset selected</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4 bg-white border-t border-gray-100 space-y-1">
                            <span className="text-[9px] text-[#2FA8B8] uppercase font-bold tracking-wider">unistarchemicals.com</span>
                            <h5 className="text-xs font-extrabold text-gray-800 truncate">
                              {formData.seoTitle || formData.name || "Formulation details"}
                            </h5>
                            <p className="text-[11px] text-gray-400 line-clamp-1 leading-normal">
                              {formData.seoDescription || formData.description || "Corporate specifications booklet."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom bar of workspace */}
              <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold">
                  {activeTab === "basic" && "Next: Chemical Properties (Step 1/5)"}
                  {activeTab === "chemical" && "Next: Handling & Safety (Step 2/5)"}
                  {activeTab === "packaging" && "Next: Attachments & Media (Step 3/5)"}
                  {activeTab === "media" && "Next: Publishing & SEO (Step 4/5)"}
                  {activeTab === "seo" && "Ready to save (Step 5/5)"}
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "seo") setActiveTab("media");
                      else if (activeTab === "media") setActiveTab("packaging");
                      else if (activeTab === "packaging") setActiveTab("chemical");
                      else if (activeTab === "chemical") setActiveTab("basic");
                    }}
                    disabled={activeTab === "basic"}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 text-gray-600 font-bold uppercase rounded-lg border border-gray-100 transition-colors cursor-pointer"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "basic") setActiveTab("chemical");
                      else if (activeTab === "chemical") setActiveTab("packaging");
                      else if (activeTab === "packaging") setActiveTab("media");
                      else if (activeTab === "media") setActiveTab("seo");
                    }}
                    disabled={activeTab === "seo"}
                    className="px-4 py-2 bg-[#123C74] hover:bg-[#2FA8B8] disabled:opacity-40 text-white font-bold uppercase rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          </form>
        )}

      </div>
    </AdminLayout>
  );
}
