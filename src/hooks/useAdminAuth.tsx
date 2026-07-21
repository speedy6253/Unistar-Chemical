import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { AdminUser } from "../types/admin";
import { getAdminProfile, createAdminProfile, updateAdminLastLogin } from "../services/adminService";

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  firebaseUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isSigningIn = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If we are actively in the login flow, skip profile resolution and let login() handle it
      if (isSigningIn.current) {
        if (user) {
          setFirebaseUser(user);
        }
        return;
      }

      setLoading(true);
      setError(null);
      if (user) {
        setFirebaseUser(user);
        try {
          let profile = await getAdminProfile(user.uid);
          
          // Auto-seed default Super Admin if logging in with the default email
          // and no Firestore profile exists yet
          if (!profile && user.email === "admin@unistar.com") {
            profile = await createAdminProfile(user.uid, {
              uid: user.uid,
              name: "Super Admin",
              email: "admin@unistar.com",
              role: "super_admin",
              status: "active",
            });
          }

          if (profile) {
            if (profile.status === "active") {
              setAdminUser(profile);
              // Async update last login time in background
              updateAdminLastLogin(user.uid);
            } else {
              setError("This administrator account has been deactivated.");
              await signOut(auth);
              setAdminUser(null);
              setFirebaseUser(null);
            }
          } else {
            setError("Unauthorized account. No matching admin profile found.");
            await signOut(auth);
            setAdminUser(null);
            setFirebaseUser(null);
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
          setError("Failed to verify administrator profile.");
          setAdminUser(null);
          setFirebaseUser(null);
        }
      } else {
        setAdminUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AdminUser> => {
    isSigningIn.current = true;
    setLoading(true);
    setError(null);
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInErr: any) {
        // Special bootstrapping logic: If default Super Admin credentials are used but account does not exist in Auth, auto-create it
        if (
          email === "admin@unistar.com" &&
          password === "AdminPassword123!" &&
          (signInErr.code === "auth/user-not-found" || signInErr.code === "auth/invalid-credential" || signInErr.code === "auth/invalid-email")
        ) {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw signInErr;
        }
      }

      const uid = userCredential.user.uid;
      let profile = await getAdminProfile(uid);

      if (!profile) {
        // Create Firestore profile
        profile = await createAdminProfile(uid, {
          uid,
          name: email === "admin@unistar.com" ? "Super Admin" : email.split("@")[0],
          email,
          role: email === "admin@unistar.com" ? "super_admin" : "editor",
          status: "active",
        });
      }

      if (profile.status !== "active") {
        await signOut(auth);
        throw new Error("This administrator account has been deactivated.");
      }

      setAdminUser(profile);
      setFirebaseUser(userCredential.user);
      await updateAdminLastLogin(uid);
      setLoading(false);
      return profile;
    } catch (err: any) {
      console.error("Login failure:", err);
      let errMsg = "Invalid email or password.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errMsg = "Invalid administrator credentials.";
      } else if (err.code === "auth/too-many-requests") {
        errMsg = "Too many failed attempts. This account has been temporarily locked.";
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    } finally {
      isSigningIn.current = false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setAdminUser(null);
      setFirebaseUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      setError("An error occurred during logout.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        firebaseUser,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
