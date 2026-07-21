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
import { db } from "../lib/firebase";
import { Category } from "../types/category";
import { CATEGORIES } from "../productsData";

export const categoryService = {
  /**
   * Fetch all categories from Firestore.
   * If Firestore is empty, returns categories seeded from static CATEGORIES list.
   */
  async getCategories(includeHidden = false): Promise<Category[]> {
    try {
      const colRef = collection(db, "categories");
      let q;
      if (includeHidden) {
        q = query(colRef, orderBy("sortOrder", "asc"));
      } else {
        q = query(colRef, where("visibility", "==", true), where("status", "==", "active"), orderBy("sortOrder", "asc"));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Automatically seed categories in Firestore on first load if we are in admin mode or if empty
        const seeded = await this.seedCategories();
        if (includeHidden) {
          return seeded;
        } else {
          return seeded.filter(c => c.visibility && c.status === "active");
        }
      }

      const categories: Category[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as any;
        categories.push({
          id: doc.id,
          name: data.name || "",
          description: data.description || "",
          sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
          visibility: typeof data.visibility === "boolean" ? data.visibility : true,
          status: data.status || "active",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });

      return categories;
    } catch (err) {
      console.error("Failed to load categories:", err);
      // Fallback to static Categories if Firestore fails or during initial load issues
      return CATEGORIES.filter(c => c !== "All Categories").map((c, idx) => ({
        id: c.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: c,
        sortOrder: idx * 10,
        visibility: true,
        status: "active"
      }));
    }
  },

  /**
   * Fetch a single category by ID.
   */
  async getCategory(id: string): Promise<Category | null> {
    try {
      const docRef = doc(db, "categories", id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as any;
        return {
          id: snapshot.id,
          name: data.name || "",
          description: data.description || "",
          sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
          visibility: typeof data.visibility === "boolean" ? data.visibility : true,
          status: data.status || "active",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      }
      return null;
    } catch (err) {
      console.error(`Failed to load category ${id}:`, err);
      return null;
    }
  },

  /**
   * Save (create or update) a category in Firestore.
   */
  async saveCategory(category: Partial<Category> & { id: string }): Promise<void> {
    try {
      const docRef = doc(db, "categories", category.id);
      const snapshot = await getDoc(docRef);

      const payload = {
        ...category,
        updatedAt: serverTimestamp()
      };

      if (!snapshot.exists()) {
        (payload as any).createdAt = serverTimestamp();
        await setDoc(docRef, payload);
      } else {
        await updateDoc(docRef, payload);
      }
    } catch (err) {
      console.error(`Failed to save category ${category.id}:`, err);
      throw err;
    }
  },

  /**
   * Delete a category from Firestore.
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(db, "categories", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(`Failed to delete category ${id}:`, err);
      throw err;
    }
  },

  /**
   * Seed categories from static CATEGORIES list in productsData.ts.
   */
  async seedCategories(): Promise<Category[]> {
    try {
      const listToSeed = CATEGORIES.filter(c => c !== "All Categories");
      const seededList: Category[] = [];
      const batch = writeBatch(db);

      listToSeed.forEach((catName, index) => {
        const catId = catName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        const docRef = doc(db, "categories", catId);
        
        const categoryData: any = {
          name: catName,
          description: `Industrial formulation grade chemical category for ${catName.toLowerCase()}.`,
          sortOrder: (index + 1) * 10,
          visibility: true,
          status: "active",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        batch.set(docRef, categoryData);
        seededList.push({
          id: catId,
          name: catName,
          description: categoryData.description,
          sortOrder: categoryData.sortOrder,
          visibility: true,
          status: "active"
        });
      });

      await batch.commit();
      return seededList;
    } catch (err) {
      console.error("Failed to seed categories:", err);
      return [];
    }
  }
};
