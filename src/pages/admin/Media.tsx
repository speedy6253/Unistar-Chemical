import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  writeBatch,
  serverTimestamp
} from "firebase/firestore";
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
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
  Upload, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileText, 
  CheckSquare, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Lock, 
  MapPin, 
  Calendar, 
  ArrowUpDown, 
  Database, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { db, storage } from "../../lib/firebase";
import { MediaItem } from "../../types/media";
import { PRELOADED_MEDIA_ITEMS } from "../../services/mediaService";

// Supported Categories per task specifications
const SUPPORTED_CATEGORIES = [
  "Warehouse",
  "Products",
  "Packaging",
  "Dispatch",
  "Events",
  "Infrastructure",
  "Team",
  "Customer Visit",
  "Trade Exhibition",
  "Corporate",
  "News",
  "Other"
];

// Supported Media Types per task specifications
const SUPPORTED_TYPES = [
  "Single Image",
  "Gallery",
  "Video",
  "Article"
];

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function AdminMedia() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Published, Draft
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, title-asc, sort-order
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected items for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Active Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewingItem, setPreviewingItem] = useState<MediaItem | null>(null);

  // Bulk action states
  const [isBulkCategoryOpen, setIsBulkCategoryOpen] = useState(false);
  const [bulkNewCategory, setBulkNewCategory] = useState("Warehouse");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Warehouse");
  const [formType, setFormType] = useState("Single Image");
  const [formLocation, setFormLocation] = useState("");
  const [formPublishedDate, setFormPublishedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublish, setFormPublish] = useState(true);
  const [formSortOrder, setFormSortOrder] = useState(0);

  // Video URL & Article specific fields
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formArticleUrl, setFormArticleUrl] = useState("");

  // Upload fields
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; path: string; isThumbnail?: boolean }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Load items from Firestore
  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items: MediaItem[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title || "",
          slug: data.slug || "",
          category: data.category || "Warehouse",
          type: data.type || "Single Image",
          thumbnail: data.thumbnail || "",
          image: data.image || "",
          videoUrl: data.videoUrl || "",
          articleUrl: data.articleUrl || "",
          images: data.images || [],
          description: data.description || "",
          location: data.location || "",
          publishedAt: data.publishedAt || "",
          featured: !!data.featured,
          isPublished: !!data.isPublished,
          sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      setMediaItems(items);
    } catch (err) {
      console.error("Failed to load media items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Sync slug generation with title
  useEffect(() => {
    if (!editingItem) {
      const slug = formTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormSlug(slug);
    }
  }, [formTitle, editingItem]);

  // Seeding functionality for testing
  const handleSeedDemoData = async () => {
    if (window.confirm("Would you like to seed default Unistar media data to Firestore for testing and live viewing?")) {
      try {
        setSeedingLoading(true);
        const batch = writeBatch(db);
        
        // Map PRELOADED_MEDIA_ITEMS into Firestore structures
        PRELOADED_MEDIA_ITEMS.forEach((item) => {
          // Map categories to new supported ones elegantly
          let cat = "Other";
          if (item.category === "Gallery") {
            cat = "Warehouse";
          } else if (item.category === "News & Articles") {
            cat = "News";
          } else if (item.category === "Media Coverage") {
            cat = "Corporate";
          } else if (item.category === "Videos") {
            cat = "Other";
          }

          // Map types to new supported ones
          let type = "Single Image";
          if (item.type === "gallery") type = "Gallery";
          if (item.type === "video") type = "Video";
          if (item.type === "article") type = "Article";

          const docRef = doc(collection(db, "media"));
          batch.set(docRef, {
            title: item.title,
            slug: item.slug,
            description: item.description,
            category: cat,
            type: type,
            thumbnail: item.thumbnail,
            image: item.image,
            videoUrl: item.videoUrl || "",
            articleUrl: item.articleUrl || "",
            images: item.image ? [item.image] : [],
            location: item.location || "",
            publishedAt: item.publishedAt,
            featured: item.featured,
            isPublished: item.isPublished,
            sortOrder: item.sortOrder,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        });

        await batch.commit();
        alert("Demo media successfully seeded!");
        fetchMediaItems();
      } catch (err) {
        console.error("Failed to seed data:", err);
        alert("Seeding failed: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setSeedingLoading(false);
      }
    }
  };

  // Drag and Drop & Image Compression/WebP Generation
  const compressAndConvertToWebP = (file: File, maxW = 1200, maxH = 1200, quality = 0.8): Promise<Blob> => {
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

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError("");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = Math.random().toString(36).substring(2, 9);
      
      try {
        setUploadProgress(prev => ({ ...prev, [tempId]: 5 }));
        
        // 1. Client-Side compression and Conversion to WebP
        const compressedBlob = await compressAndConvertToWebP(file);
        setUploadProgress(prev => ({ ...prev, [tempId]: 30 }));

        // 2. Upload to Firebase Storage under media/{category}/
        const filePath = `media/${formCategory}/${formSlug || "media"}_${Date.now()}_${tempId}.webp`;
        const storageRef = ref(storage, filePath);
        
        const uploadTask = uploadBytesResumable(storageRef, compressedBlob);
        
        uploadTask.on("state_changed", 
          (snapshot) => {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 60) + 30;
            setUploadProgress(prev => ({ ...prev, [tempId]: pct }));
          }, 
          (err) => {
            console.error("Storage upload error:", err);
            setUploadError("Firebase Storage error: " + err.message);
            setIsUploading(false);
          }, 
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadedImages(prev => [
              ...prev, 
              { url: downloadUrl, path: filePath, isThumbnail: prev.length === 0 }
            ]);
            setUploadProgress(prev => {
              const updated = { ...prev };
              delete updated[tempId];
              return updated;
            });
          }
        );
      } catch (err: any) {
        console.error("Compression error:", err);
        setUploadError("Image conversion error: " + err.message);
      }
    }
    
    setIsUploading(false);
  };

  const removeUploadedImage = async (index: number) => {
    const imgToRemove = uploadedImages[index];
    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, imgToRemove.path);
      await deleteObject(storageRef);
      
      // Update state
      const updated = uploadedImages.filter((_, i) => i !== index);
      // Make sure there is still one designated thumbnail if any remain
      if (updated.length > 0 && !updated.some(img => img.isThumbnail)) {
        updated[0].isThumbnail = true;
      }
      setUploadedImages(updated);
    } catch (err) {
      console.error("Failed to delete storage file:", err);
      // Fallback: update state even if cloud deletion fails
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Video helpers
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?\??v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVimeoId = (url: string) => {
    const match = url.match(/(vimeo\.com\/|video\/)(\d+)/);
    return match ? match[2] : null;
  };

  const generateVideoThumbnail = (url: string) => {
    const ytId = getYoutubeId(url);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    const vmId = getVimeoId(url);
    if (vmId) {
      // Vimeo default placeholder fallback
      return "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=600&q=80";
    }
    return "";
  };

  // Reset fields
  const resetForm = () => {
    setFormTitle("");
    setFormSlug("");
    setFormDescription("");
    setFormCategory("Warehouse");
    setFormType("Single Image");
    setFormLocation("");
    setFormPublishedDate(new Date().toISOString().split("T")[0]);
    setFormFeatured(false);
    setFormPublish(true);
    setFormSortOrder(0);
    setFormVideoUrl("");
    setFormArticleUrl("");
    setUploadedImages([]);
    setUploadProgress({});
    setUploadError("");
    setEditingItem(null);
  };

  // Edit action
  const handleEditClick = (item: MediaItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormSlug(item.slug);
    setFormDescription(item.description);
    setFormCategory(item.category);
    setFormType(item.type);
    setFormLocation(item.location || "");
    setFormPublishedDate(item.publishedAt);
    setFormFeatured(item.featured);
    setFormPublish(item.isPublished);
    setFormSortOrder(item.sortOrder);
    setFormVideoUrl(item.videoUrl || "");
    setFormArticleUrl(item.articleUrl || "");
    
    // Map existing image paths if saved, or use placeholders
    if (item.images && item.images.length > 0) {
      setUploadedImages(item.images.map((url, idx) => ({
        url,
        path: `media/${item.category}/${item.slug}_${idx}.webp`, // best guess path for existing items
        isThumbnail: url === item.thumbnail
      })));
    } else if (item.image) {
      setUploadedImages([{
        url: item.image,
        path: `media/${item.category}/${item.slug}.webp`,
        isThumbnail: true
      }]);
    } else {
      setUploadedImages([]);
    }
    
    setIsFormModalOpen(true);
  };

  // Duplicate action
  const handleDuplicateClick = async (item: MediaItem) => {
    try {
      setLoading(true);
      const duplicatedData = {
        title: `${item.title} (Copy)`,
        slug: `${item.slug}-copy`,
        description: item.description,
        category: item.category,
        type: item.type,
        thumbnail: item.thumbnail,
        image: item.image,
        videoUrl: item.videoUrl || "",
        articleUrl: item.articleUrl || "",
        images: item.images || [],
        location: item.location || "",
        publishedAt: item.publishedAt,
        featured: false, // Default to not featured
        isPublished: false, // Default to Draft
        sortOrder: item.sortOrder + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, "media"), duplicatedData);
      fetchMediaItems();
    } catch (err) {
      console.error("Failed to duplicate:", err);
      alert("Duplication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Submit form (Save / Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    try {
      setLoading(true);

      // Determine cover and background images
      let coverImg = "";
      let thumbImg = "";
      const imagesArray = uploadedImages.map(img => img.url);

      if (formType === "Video") {
        coverImg = generateVideoThumbnail(formVideoUrl) || "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80";
        thumbImg = coverImg;
      } else if (uploadedImages.length > 0) {
        const thumbObj = uploadedImages.find(img => img.isThumbnail) || uploadedImages[0];
        thumbImg = thumbObj.url;
        coverImg = uploadedImages[0].url;
      } else {
        // Default placeholders
        coverImg = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80";
        thumbImg = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80";
      }

      const docData = {
        title: formTitle.trim(),
        slug: formSlug.trim() || generateSlug(formTitle),
        description: formDescription.trim(),
        category: formCategory,
        type: formType,
        thumbnail: thumbImg,
        image: coverImg,
        images: imagesArray,
        videoUrl: formType === "Video" ? formVideoUrl.trim() : "",
        articleUrl: formType === "Article" ? formArticleUrl.trim() : "",
        location: formLocation.trim(),
        publishedAt: formPublishedDate,
        featured: formFeatured,
        isPublished: formPublish,
        sortOrder: Number(formSortOrder),
        updatedAt: new Date().toISOString()
      };

      if (editingItem) {
        // Update
        const docRef = doc(db, "media", editingItem.id);
        await updateDoc(docRef, docData);
      } else {
        // Create
        const newData = {
          ...docData,
          createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, "media"), newData);
      }

      setIsFormModalOpen(false);
      resetForm();
      fetchMediaItems();
    } catch (err) {
      console.error("Failed to save media item:", err);
      alert("Error saving item: " + (err instanceof Error ? err.message : "unknown"));
    } finally {
      setLoading(false);
    }
  };

  // Delete action confirm
  const handleDeleteClick = (item: MediaItem) => {
    setDeletingItem(item);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setLoading(true);
      
      // 1. Delete associated Storage files if possible
      if (deletingItem.images && deletingItem.images.length > 0) {
        for (const imgUrl of deletingItem.images) {
          // Attempt to extract path and delete
          try {
            if (imgUrl.includes("firebasestorage.googleapis.com")) {
              const decodedUrl = decodeURIComponent(imgUrl);
              const pathPart = decodedUrl.split("/o/")[1].split("?")[0];
              const storageRef = ref(storage, pathPart);
              await deleteObject(storageRef);
            }
          } catch (storageErr) {
            console.warn("Storage deletion error (gracefully continuing):", storageErr);
          }
        }
      }

      // 2. Remove document from Firestore
      await deleteDoc(doc(db, "media", deletingItem.id));
      
      setIsDeleteConfirmOpen(false);
      setDeletingItem(null);
      setSelectedIds(prev => prev.filter(id => id !== deletingItem.id));
      fetchMediaItems();
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Deletion failed.");
    } finally {
      setLoading(false);
    }
  };

  // Row selection helpers
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAllRows = (filteredItems: MediaItem[]) => {
    const filteredIds = filteredItems.map(item => item.id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Bulk Actions
  const handleBulkPublish = async (publish: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      const batch = writeBatch(db);
      selectedIds.forEach((id) => {
        const docRef = doc(db, "media", id);
        batch.update(docRef, { isPublished: publish, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
      setSelectedIds([]);
      fetchMediaItems();
    } catch (err) {
      console.error("Bulk publish error:", err);
      alert("Bulk operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you absolutely sure you want to delete ${selectedIds.length} selected media items? This will remove all database items and associated files permanently.`)) {
      try {
        setLoading(true);
        const batch = writeBatch(db);
        
        // Find corresponding items to clean up storage
        const itemsToDelete = mediaItems.filter(item => selectedIds.includes(item.id));
        for (const item of itemsToDelete) {
          // Attempt Storage deletion
          if (item.images) {
            for (const imgUrl of item.images) {
              try {
                if (imgUrl.includes("firebasestorage.googleapis.com")) {
                  const decodedUrl = decodeURIComponent(imgUrl);
                  const pathPart = decodedUrl.split("/o/")[1].split("?")[0];
                  const storageRef = ref(storage, pathPart);
                  await deleteObject(storageRef);
                }
              } catch (se) {
                console.warn("Storage item cleanup warning:", se);
              }
            }
          }
          batch.delete(doc(db, "media", item.id));
        }

        await batch.commit();
        setSelectedIds([]);
        fetchMediaItems();
      } catch (err) {
        console.error("Bulk deletion failed:", err);
        alert("Bulk delete failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkCategoryChange = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      const batch = writeBatch(db);
      selectedIds.forEach((id) => {
        const docRef = doc(db, "media", id);
        batch.update(docRef, { category: bulkNewCategory, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
      setIsBulkCategoryOpen(false);
      setSelectedIds([]);
      fetchMediaItems();
    } catch (err) {
      console.error("Bulk category change failed:", err);
      alert("Bulk category change failed.");
    } finally {
      setLoading(false);
    }
  };

  // Searching, sorting, and filtering logic
  const processedMediaItems = useMemo(() => {
    let result = [...mediaItems];

    // Search filter
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          (item.location && item.location.toLowerCase().includes(queryLower))
      );
    }

    // Category filter
    if (categoryFilter !== "All") {
      result = result.filter(item => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "All") {
      const isPub = statusFilter === "Published";
      result = result.filter(item => item.isPublished === isPub);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return b.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 1;
      }
      if (sortBy === "oldest") {
        return a.createdAt ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : -1;
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "sort-order") {
        return a.sortOrder - b.sortOrder;
      }
      return 0;
    });

    return result;
  }, [mediaItems, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Paginated elements
  const totalPages = Math.max(1, Math.ceil(processedMediaItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedMediaItems.slice(startIndex, startIndex + itemsPerPage);
  }, [processedMediaItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, sortBy]);

  return (
    <AdminLayout title="Media Library CMS">
      <div className="space-y-8">
        
        {/* Top Toolbar */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-[#123C74] uppercase tracking-tight flex items-center gap-2">
              <FolderOpen size={20} className="text-[#2FA8B8]" />
              Media Library & Assets
            </h2>
            <p className="text-xs text-gray-400">
              Manage corporate photographs, events, logistics galleries, and published articles.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeedDemoData}
              disabled={seedingLoading}
              className="px-4 h-11 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/50 text-indigo-700 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
            >
              <RefreshCw size={14} className={seedingLoading ? "animate-spin" : ""} />
              <span>{seedingLoading ? "Seeding..." : "Seed Demo Media"}</span>
            </button>

            <button
              onClick={() => { resetForm(); setIsFormModalOpen(true); }}
              className="px-5 h-11 bg-[#2FA8B8] hover:bg-[#258e9c] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add New Media</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Filters, and Sorters */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Box */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search by title, location or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-gray-50/50 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-medium placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#2FA8B8]">
                <Filter size={15} />
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-gray-50/50 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-bold text-gray-700 transition-colors appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {SUPPORTED_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Globe size={15} />
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-gray-50/50 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-bold text-gray-700 transition-colors appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published Only</option>
                <option value="Draft">Drafts Only</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <ArrowUpDown size={15} />
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-gray-50/50 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-bold text-gray-700 transition-colors appearance-none cursor-pointer"
              >
                <option value="newest">Newest Added</option>
                <option value="oldest">Oldest Added</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="sort-order">Sort Order Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-[#123C74] text-white rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2FA8B8] text-white flex items-center justify-center text-xs font-black">
                {selectedIds.length}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                items selected for bulk operations
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-bold uppercase transition-all"
              >
                Publish Selected
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-xs font-bold uppercase transition-all"
              >
                Unpublish Selected
              </button>
              
              <div className="relative inline-block">
                <button
                  onClick={() => setIsBulkCategoryOpen(!isBulkCategoryOpen)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold uppercase transition-all"
                >
                  Change Category
                </button>
                
                {isBulkCategoryOpen && (
                  <div className="absolute right-0 bottom-12 z-50 bg-white border border-gray-100 rounded-lg shadow-xl p-3 w-48 text-gray-800 flex flex-col gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#123C74]">
                      Select Category
                    </span>
                    <select
                      value={bulkNewCategory}
                      onChange={(e) => setBulkNewCategory(e.target.value)}
                      className="h-8 border border-gray-100 rounded text-xs px-2"
                    >
                      {SUPPORTED_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleBulkCategoryChange}
                      className="h-8 bg-[#2FA8B8] hover:bg-[#258e9c] text-white font-bold text-xs rounded transition-all uppercase"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-xs font-bold uppercase transition-all flex items-center gap-1"
              >
                <Trash size={13} />
                <span>Delete Selected</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="p-2 hover:bg-white/10 rounded text-gray-300 hover:text-white"
                title="Cancel Selection"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Media Table Container */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs">
          {loading && mediaItems.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-[#2FA8B8] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-[#123C74] uppercase tracking-widest animate-pulse">
                Querying database repository...
              </span>
            </div>
          ) : processedMediaItems.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
              <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                <Database size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-800 uppercase text-sm">No Assets Matches Found</h4>
                <p className="text-xs text-gray-400 max-w-sm">
                  We couldn't find any database entries matching your filters. Try clearing your search query or seeding demo items.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-4 pl-6 w-12 text-center">
                      <button
                        onClick={() => handleSelectAllRows(paginatedItems)}
                        className="text-gray-400 hover:text-[#123C74]"
                      >
                        {paginatedItems.every(item => selectedIds.includes(item.id)) ? (
                          <CheckSquare size={16} className="text-[#2FA8B8]" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th className="py-4 pl-4 w-20">Thumbnail</th>
                    <th className="py-4 px-4 min-w-[180px]">Title</th>
                    <th className="py-4 px-4 w-32">Category</th>
                    <th className="py-4 px-4 w-28">Type</th>
                    <th className="py-4 px-4 w-24 text-center">Featured</th>
                    <th className="py-4 px-4 w-24 text-center">Published</th>
                    <th className="py-4 px-4 w-32">Published Date</th>
                    <th className="py-4 pr-6 w-44 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                  {paginatedItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-gray-50/50 transition-colors ${
                          isSelected ? "bg-[#2FA8B8]/5" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 pl-6 text-center">
                          <button
                            onClick={() => handleSelectRow(item.id)}
                            className="text-gray-400 hover:text-[#123C74]"
                          >
                            {isSelected ? (
                              <CheckSquare size={16} className="text-[#2FA8B8]" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </td>

                        {/* Thumbnail */}
                        <td className="py-4 pl-4">
                          <div className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 shrink-0 relative">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt="Thumb"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ImageIcon size={16} />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title & Slug */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1 max-w-[280px]">
                            <span className="font-bold text-gray-800 line-clamp-1 leading-tight">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 leading-none truncate">
                              /{item.slug}
                            </span>
                            {item.location && (
                              <span className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5 font-bold">
                                <MapPin size={10} className="text-[#2FA8B8]" />
                                {item.location}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] rounded uppercase tracking-wider">
                            {item.category}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-gray-600 text-[10px] uppercase">
                            {item.type === "Video" ? (
                              <VideoIcon size={12} className="text-red-500" />
                            ) : item.type === "Article" ? (
                              <FileText size={12} className="text-indigo-500" />
                            ) : (
                              <ImageIcon size={12} className="text-[#2FA8B8]" />
                            )}
                            <span>{item.type}</span>
                          </div>
                        </td>

                        {/* Featured */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full ${
                            item.featured 
                              ? "bg-amber-50 text-amber-700 border border-amber-200/50" 
                              : "bg-gray-50 text-gray-400 border border-gray-100"
                          }`}>
                            {item.featured ? "Yes" : "No"}
                          </span>
                        </td>

                        {/* Published Status */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full ${
                            item.isPublished 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {item.isPublished ? "Live" : "Draft"}
                          </span>
                        </td>

                        {/* Published Date */}
                        <td className="py-4 px-4 text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-[#2FA8B8]" />
                            <span>{item.publishedAt}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Preview */}
                            <button
                              onClick={() => { setPreviewingItem(item); setIsPreviewModalOpen(true); }}
                              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-[#123C74] rounded-lg text-gray-600 hover:text-[#123C74] transition-colors"
                              title="Preview Content"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-[#2FA8B8] rounded-lg text-gray-600 hover:text-[#2FA8B8] transition-colors"
                              title="Edit Item"
                            >
                              <Edit size={14} />
                            </button>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicateClick(item)}
                              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-indigo-500 rounded-lg text-gray-600 hover:text-indigo-500 transition-colors"
                              title="Duplicate Item"
                            >
                              <Copy size={14} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-2 bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-500 rounded-lg text-gray-600 hover:text-red-500 transition-colors"
                              title="Delete Item"
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

          {/* Pagination Controls */}
          {processedMediaItems.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between font-sans text-xs">
              <span className="text-gray-400 font-medium">
                Showing <span className="font-bold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-700">{Math.min(currentPage * itemsPerPage, processedMediaItems.length)}</span> of <span className="font-bold text-gray-700">{processedMediaItems.length}</span> assets
              </span>

              <div className="inline-flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-100 text-gray-500 hover:text-[#123C74] hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pg = idx + 1;
                  const isCurrent = pg === currentPage;
                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`h-9 w-9 rounded-lg border font-bold transition-all text-xs ${
                        isCurrent 
                          ? "bg-[#123C74] border-[#123C74] text-white shadow-sm" 
                          : "border-gray-100 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-100 text-gray-500 hover:text-[#123C74] hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ADD / EDIT DEDICATED DIALOG MODAL                        */}
        {/* ======================================================== */}
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-[#123C74]/50 backdrop-blur-xs cursor-pointer" onClick={() => setIsFormModalOpen(false)} />
            
            {/* Modal Body */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto relative z-10 animate-scaleUp">
              {/* Header */}
              <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-blue-50 text-[#123C74] rounded-lg">
                    <Plus size={18} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-widest leading-none mb-0.5">
                      {editingItem ? "Update Asset" : "New Media Entry"}
                    </span>
                    <h3 className="font-extrabold text-sm uppercase text-gray-800">
                      {editingItem ? "Edit Media Details" : "Add New Media item"}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column Fields */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                        Asset Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kolkata Distillation Bay Operational"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full h-11 px-4 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-semibold text-gray-800 transition-colors"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider flex justify-between">
                        <span>Slug (Autogenerated)</span>
                        <span className="text-[9px] font-bold text-[#2FA8B8] lowercase">/media/slug-url</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="auto-generated-slug-path"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-mono text-gray-500 transition-colors"
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                        Category Classification *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full h-11 px-4 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                      >
                        {SUPPORTED_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Media Type Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                        Media Type *
                      </label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full h-11 px-4 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                      >
                        {SUPPORTED_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                        Geographical Location (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kolkata Plant B, India"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className="w-full h-11 px-4 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-semibold text-gray-800 transition-colors"
                      />
                    </div>

                    {/* Published Date */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                        Published Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formPublishedDate}
                        onChange={(e) => setFormPublishedDate(e.target.value)}
                        className="w-full h-11 px-4 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Right Column Fields */}
                  <div className="space-y-4">
                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                        Asset Summary / Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write a professional corporate summary detailing this operational scene, event, or press release..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full p-4 border border-gray-100 focus:border-[#2FA8B8] rounded-lg text-xs font-medium text-gray-800 transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {/* Dynamic Inputs Based on Media Type selection */}
                    {formType === "Video" ? (
                      <div className="space-y-1.5 bg-red-50/40 p-4 border border-red-100 rounded-xl space-y-3.5">
                        <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-widest block">
                          Video Streaming Link
                        </span>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-gray-500 uppercase">
                            YouTube or Vimeo URL *
                          </label>
                          <input
                            type="url"
                            required
                            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            value={formVideoUrl}
                            onChange={(e) => setFormVideoUrl(e.target.value)}
                            className="w-full h-10 px-3 border border-gray-100 focus:border-red-500 rounded-lg text-xs font-medium text-gray-800 transition-colors"
                          />
                        </div>

                        {formVideoUrl && (getYoutubeId(formVideoUrl) || getVimeoId(formVideoUrl)) && (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-gray-200">
                            <img
                              src={generateVideoThumbnail(formVideoUrl)}
                              alt="Generated Video Preview"
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="p-3 bg-white text-red-500 rounded-full shadow-lg">
                                <VideoIcon size={20} className="fill-current" />
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : formType === "Article" ? (
                      <div className="space-y-1.5 bg-indigo-50/40 p-4 border border-indigo-100 rounded-xl space-y-3.5">
                        <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest block">
                          Article External Details
                        </span>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-gray-500 uppercase">
                            External Publication URL (Optional)
                          </label>
                          <input
                            type="url"
                            placeholder="e.g. https://www.chemisttoday.com/industry-news"
                            value={formArticleUrl}
                            onChange={(e) => setFormArticleUrl(e.target.value)}
                            className="w-full h-10 px-3 border border-gray-100 focus:border-indigo-500 rounded-lg text-xs font-medium text-gray-800 transition-colors"
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* Drag and Drop Upload Area (for Single Image and Gallery) */}
                    {formType !== "Video" && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider flex justify-between">
                          <span>Media Images Upload *</span>
                          <span className="text-[9px] font-bold text-[#2FA8B8] lowercase">
                            {formType === "Gallery" ? "supports multiple images" : "recommended 1 single image"}
                          </span>
                        </label>
                        
                        {/* Drag Area */}
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleFileUpload(e.dataTransfer.files);
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-200 hover:border-[#2FA8B8] bg-gray-50/40 hover:bg-[#2FA8B8]/5 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e.target.files)}
                            multiple={formType === "Gallery"}
                            accept="image/*"
                            className="hidden"
                          />
                          <Upload size={24} className="text-gray-400 group-hover:text-[#2FA8B8] transition-colors" />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-700 block">
                              Drag & Drop files here, or <span className="text-[#2FA8B8] hover:underline">browse files</span>
                            </span>
                            <span className="text-[10px] text-gray-400 block leading-none">
                              Automatically compresses & converts to highly optimized WebP format.
                            </span>
                          </div>
                        </div>

                        {uploadError && (
                          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 leading-none">
                            <AlertCircle size={14} />
                            <span>{uploadError}</span>
                          </div>
                        )}

                        {/* Active Progress indicators */}
                        {Object.keys(uploadProgress).map((key) => (
                          <div key={key} className="space-y-1 font-sans">
                            <div className="flex justify-between text-[9px] font-extrabold text-[#123C74] uppercase">
                              <span>Compressing & Uploading...</span>
                              <span>{uploadProgress[key]}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#2FA8B8] h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress[key]}%` }} />
                            </div>
                          </div>
                        ))}

                        {/* Image Previews list */}
                        {uploadedImages.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                              Uploaded Assets ({uploadedImages.length})
                            </span>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {uploadedImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-square border border-gray-100 rounded-lg overflow-hidden group">
                                  <img
                                    src={img.url}
                                    alt={`Preview ${idx}`}
                                    className="w-full h-full object-cover"
                                  />
                                  
                                  {/* Thumbnail Toggle badge */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUploadedImages(prev => prev.map((im, i) => ({
                                        ...im,
                                        isThumbnail: i === idx
                                      })));
                                    }}
                                    className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase leading-none border shadow-sm ${
                                      img.isThumbnail 
                                        ? "bg-amber-400 border-amber-500 text-white" 
                                        : "bg-white/90 backdrop-blur-md border-gray-200 text-gray-600 hover:bg-white"
                                    }`}
                                  >
                                    Cover
                                  </button>

                                  {/* Delete btn */}
                                  <button
                                    type="button"
                                    onClick={() => removeUploadedImage(idx)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-md hover:scale-105 transition-all"
                                    title="Delete Image"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Controls: Featured, Publish, SortOrder */}
                    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Featured Highlight</span>
                          <span className="text-[10px] text-gray-400">Highlight this item on the public Media showcase story block.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormFeatured(!formFeatured)}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                            formFeatured ? "bg-[#2FA8B8]" : "bg-gray-200"
                          }`}
                        >
                          <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all duration-300 ${
                            formFeatured ? "left-6.5" : "left-0.5"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100/60 pt-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Publish Instantly</span>
                          <span className="text-[10px] text-gray-400">Make this media entry visible on the official public website.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormPublish(!formPublish)}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                            formPublish ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        >
                          <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all duration-300 ${
                            formPublish ? "left-6.5" : "left-0.5"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100/60 pt-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Display Sort Order Priority</span>
                          <span className="text-[10px] text-gray-400">Numeric ordering index (e.g. 0 first, then 1, 2, 3...)</span>
                        </div>
                        <input
                          type="number"
                          required
                          value={formSortOrder}
                          onChange={(e) => setFormSortOrder(Number(e.target.value))}
                          className="w-20 h-9 border border-gray-200 text-center rounded-lg text-xs font-bold text-gray-800 focus:border-[#2FA8B8]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-6 border-t border-gray-50 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-5 h-11 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 h-11 bg-[#123C74] hover:bg-[#0f3261] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md disabled:opacity-50"
                  >
                    {editingItem ? "Update Asset" : "Save Asset"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DELETE CONFIRMATION LOCK MODAL                           */}
        {/* ======================================================== */}
        {isDeleteConfirmOpen && deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-[#123C74]/50 backdrop-blur-xs cursor-pointer" onClick={() => setIsDeleteConfirmOpen(false)} />

            {/* Modal Body */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-2xl p-6 w-full max-w-md text-center space-y-4 relative z-10 animate-scaleUp">
              <div className="mx-auto w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                <AlertCircle size={24} />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-sm uppercase text-gray-800">Confirm Asset Removal</h3>
                <p className="text-xs text-gray-400">
                  Are you sure you want to remove the media asset <span className="font-bold text-gray-700">"{deletingItem.title}"</span>? This will permanently delete the document from Firestore and remove any associated images from Storage.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase rounded-lg transition-colors"
                >
                  No, Keep
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded-lg transition-colors"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PREVIEW CONTENT OVERLAY MODAL                            */}
        {/* ======================================================== */}
        {isPreviewModalOpen && previewingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer" onClick={() => setIsPreviewModalOpen(false)} />

            {/* Modal Body */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 animate-scaleUp">
              {/* Media stage (Image or Video) */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors border border-white/10"
                >
                  <X size={16} />
                </button>

                {previewingItem.type === "Video" ? (
                  previewingItem.videoUrl ? (
                    <iframe
                      src={previewingItem.videoUrl}
                      title="Video Preview"
                      className="w-full h-full border-0"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-white text-xs font-bold uppercase">No valid stream URL</div>
                  )
                ) : previewingItem.image ? (
                  <img
                    src={previewingItem.image}
                    alt={previewingItem.title}
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-white text-xs font-bold uppercase">No Preview available</div>
                )}
              </div>

              {/* Details */}
              <div className="p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold">
                  <span className="px-2.5 py-1 bg-[#123C74] text-white rounded uppercase tracking-wider">
                    {previewingItem.category}
                  </span>
                  <span className="px-2.5 py-1 bg-[#2FA8B8] text-white rounded uppercase tracking-wider flex items-center gap-1">
                    {previewingItem.type === "Video" ? <VideoIcon size={11} /> : <ImageIcon size={11} />}
                    <span>{previewingItem.type}</span>
                  </span>
                  {previewingItem.location && (
                    <span className="text-gray-400 flex items-center gap-1">
                      <MapPin size={12} className="text-[#2FA8B8]" />
                      <span>{previewingItem.location}</span>
                    </span>
                  )}
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar size={12} className="text-[#2FA8B8]" />
                    <span>Published: {previewingItem.publishedAt}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight leading-tight">
                    {previewingItem.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-h-24 overflow-y-auto">
                    {previewingItem.description}
                  </p>
                </div>

                {previewingItem.articleUrl && (
                  <div className="pt-2">
                    <a
                      href={previewingItem.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 border border-gray-100 hover:border-[#123C74] rounded-lg text-xs font-bold text-gray-700 hover:text-[#123C74] uppercase tracking-wide transition-colors"
                    >
                      <span>Read Full Article details</span>
                      <Globe size={13} className="text-[#2FA8B8]" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
