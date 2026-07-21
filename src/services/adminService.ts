import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { AdminUser } from "../types/admin";

export async function getAdminProfile(uid: string): Promise<AdminUser | null> {
  try {
    const docRef = doc(db, "admins", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AdminUser;
    }
    return null;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
}

export async function createAdminProfile(uid: string, profile: Omit<AdminUser, "createdAt" | "lastLogin">): Promise<AdminUser> {
  try {
    const now = new Date().toISOString();
    const fullProfile: AdminUser = {
      ...profile,
      createdAt: now,
      lastLogin: now,
    };
    await setDoc(doc(db, "admins", uid), fullProfile);
    return fullProfile;
  } catch (error) {
    console.error("Error creating admin profile:", error);
    throw error;
  }
}

export async function updateAdminLastLogin(uid: string): Promise<void> {
  try {
    const now = new Date().toISOString();
    const docRef = doc(db, "admins", uid);
    await updateDoc(docRef, {
      lastLogin: now,
    });
  } catch (error) {
    console.error("Error updating admin last login:", error);
    // Ignore error if it's just due to permissions or missing fields during cold start
  }
}
