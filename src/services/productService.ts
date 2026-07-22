import { 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where, 
  writeBatch, 
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Product } from "../types/product";
import { PRODUCTS } from "../productsData";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const productService = {
  /**
   * Fetch all products from Firestore.
   * If Firestore is empty, returns the preloaded PRODUCTS list.
   * If includeUnpublished is false (default for public), only returns published products.
   */
  async getProducts(includeUnpublished = false): Promise<Product[]> {
    const path = "products";
    const staticList = PRODUCTS.map(p => ({
      ...p,
      slug: p.id,
      isPublished: true,
      featured: false,
      images: p.image ? [p.image] : [],
      specifications: p.keyBenefits
    }));

    try {
      let snapshot;
      if (includeUnpublished) {
        const q = query(collection(db, path), orderBy("name", "asc"));
        snapshot = await getDocs(q);
      } else {
        try {
          const q = query(collection(db, path), where("isPublished", "==", true));
          snapshot = await getDocs(q);
        } catch (queryErr) {
          console.warn("Query with isPublished filter failed, falling back to all docs query:", queryErr);
          const q = collection(db, path);
          snapshot = await getDocs(q);
        }
      }

      if (snapshot.empty) {
        return staticList;
      }

      const products: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as any;
        const isPub = typeof data.isPublished === "boolean" ? data.isPublished : true;
        if (includeUnpublished || isPub) {
          products.push({
            id: doc.id,
            name: data.name || "",
            slug: data.slug || doc.id,
            category: data.category || "",
            formula: data.formula || "",
            description: data.description || "",
            longDescription: data.longDescription || "",
            casNumber: data.casNumber || "",
            hsnCode: data.hsnCode || "",
            applications: Array.isArray(data.applications) ? data.applications : [],
            keyBenefits: Array.isArray(data.keyBenefits) ? data.keyBenefits : [],
            specifications: Array.isArray(data.specifications) ? data.specifications : [],
            packaging: data.packaging || "",
            storageInstructions: data.storageInstructions || "",
            safetyInformation: data.safetyInformation || "",
            technicalNotes: data.technicalNotes || "",
            image: data.image || "",
            images: Array.isArray(data.images) ? data.images : [],
            pdfUrl: data.pdfUrl || "",
            featured: !!data.featured,
            isPublished: isPub,
            seoTitle: data.seoTitle || "",
            seoDescription: data.seoDescription || "",
            seoKeywords: data.seoKeywords || "",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        }
      });

      return products.length > 0 ? products : staticList;
    } catch (error) {
      console.warn("Firestore getProducts encountered error, returning static fallback:", error);
      return staticList;
    }
  },

  /**
   * Fetch a single product from Firestore by ID (slug).
   * If not found, falls back to preloaded PRODUCTS.
   */
  async getProduct(id: string): Promise<Product | null> {
    const path = `products/${id}`;
    const preloaded = PRODUCTS.find(p => p.id === id);
    const staticFallback = preloaded ? {
      ...preloaded,
      slug: preloaded.id,
      isPublished: true,
      featured: false,
      images: preloaded.image ? [preloaded.image] : [],
      specifications: preloaded.keyBenefits
    } : null;

    try {
      const docRef = doc(db, "products", id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as any;
        return {
          id: snapshot.id,
          name: data.name || "",
          slug: data.slug || snapshot.id,
          category: data.category || "",
          formula: data.formula || "",
          description: data.description || "",
          longDescription: data.longDescription || "",
          casNumber: data.casNumber || "",
          hsnCode: data.hsnCode || "",
          applications: Array.isArray(data.applications) ? data.applications : [],
          keyBenefits: Array.isArray(data.keyBenefits) ? data.keyBenefits : [],
          specifications: Array.isArray(data.specifications) ? data.specifications : [],
          packaging: data.packaging || "",
          storageInstructions: data.storageInstructions || "",
          safetyInformation: data.safetyInformation || "",
          technicalNotes: data.technicalNotes || "",
          image: data.image || "",
          images: Array.isArray(data.images) ? data.images : [],
          pdfUrl: data.pdfUrl || "",
          featured: !!data.featured,
          isPublished: typeof data.isPublished === "boolean" ? data.isPublished : true,
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          seoKeywords: data.seoKeywords || "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      }

      return staticFallback;
    } catch (error) {
      console.warn("Firestore getProduct error, returning static fallback:", error);
      return staticFallback;
    }
  },

  /**
   * Save (create or update) a product in Firestore.
   */
  async saveProduct(product: Partial<Product> & { id: string }): Promise<void> {
    const path = `products/${product.id}`;
    try {
      const docRef = doc(db, "products", product.id);
      const snapshot = await getDoc(docRef);

      const payload = {
        ...product,
        updatedAt: serverTimestamp()
      };

      if (!snapshot.exists()) {
        (payload as any).createdAt = serverTimestamp();
        await setDoc(docRef, payload);
      } else {
        await updateDoc(docRef, payload);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Delete a product from Firestore.
   */
  async deleteProduct(id: string): Promise<void> {
    const path = `products/${id}`;
    try {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  /**
   * Seeding helper to load standard PRODUCTS into Firestore if desired.
   */
  async seedProducts(): Promise<void> {
    const path = "products";
    try {
      const batch = writeBatch(db);
      for (const p of PRODUCTS) {
        const docRef = doc(db, "products", p.id);
        const payload = {
          name: p.name,
          slug: p.id,
          category: p.category,
          formula: p.formula,
          description: p.description,
          longDescription: p.description,
          applications: p.applications,
          keyBenefits: p.keyBenefits,
          specifications: p.keyBenefits,
          packaging: p.packaging,
          image: p.image || "",
          images: p.image ? [p.image] : [],
          featured: false,
          isPublished: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        batch.set(docRef, payload);
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Bulk Toggle Publish status
   */
  async bulkPublish(ids: string[], isPublished: boolean): Promise<void> {
    const path = "products/bulk_publish";
    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        const docRef = doc(db, "products", id);
        batch.update(docRef, { isPublished, updatedAt: serverTimestamp() });
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Bulk Toggle Featured status
   */
  async bulkFeatured(ids: string[], featured: boolean): Promise<void> {
    const path = "products/bulk_featured";
    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        const docRef = doc(db, "products", id);
        batch.update(docRef, { featured, updatedAt: serverTimestamp() });
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Bulk Update Category
   */
  async bulkUpdateCategory(ids: string[], category: string): Promise<void> {
    const path = "products/bulk_category";
    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        const docRef = doc(db, "products", id);
        batch.update(docRef, { category, updatedAt: serverTimestamp() });
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Bulk Delete products
   */
  async bulkDelete(ids: string[]): Promise<void> {
    const path = "products/bulk_delete";
    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        const docRef = doc(db, "products", id);
        batch.delete(docRef);
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
