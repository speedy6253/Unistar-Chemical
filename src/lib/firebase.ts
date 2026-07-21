import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder-auth-domain",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "placeholder-project-id",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder-storage-bucket",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder-sender-id",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "placeholder-app-id",
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
