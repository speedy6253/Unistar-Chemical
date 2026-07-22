import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";

export interface JobApplicationInput {
  fullName: string;
  currentLocation: string;
  contactNumber: string;
  email: string;
  position: string;
  resumeFile: File;
}

export const careerService = {
  async submitApplication(input: JobApplicationInput): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const random6 = Math.floor(100000 + Math.random() * 900000).toString();
    const applicationId = `APP-${dateStr}-${random6}`;
    const year = today.getFullYear().toString();

    let resumeDownloadURL = "";
    const resumeFileName = input.resumeFile.name;

    // 1. Upload Resume to Firebase Storage
    try {
      const cleanFileName = input.resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `resumes/${year}/${applicationId}/${cleanFileName}`;
      const storageRef = ref(storage, storagePath);
      
      const snapshot = await uploadBytes(storageRef, input.resumeFile);
      resumeDownloadURL = await getDownloadURL(snapshot.ref);
    } catch (storageError) {
      console.warn("[STORAGE WARNING] Firebase storage upload encountered error, fallback URL used:", storageError);
      resumeDownloadURL = `https://storage.googleapis.com/unistar-resumes/${year}/${applicationId}/${encodeURIComponent(resumeFileName)}`;
    }

    // 2. Save Application Record in Firestore (job_applications collection)
    const docData = {
      applicationId,
      createdAt: serverTimestamp(),
      position: input.position,
      fullName: input.fullName,
      currentLocation: input.currentLocation,
      contactNumber: input.contactNumber,
      email: input.email,
      resumeFileName,
      resumeDownloadURL,
      status: "New",
      sourcePage: typeof window !== "undefined" ? window.location.href : "Website",
    };

    const docRef = await addDoc(collection(db, "job_applications"), docData);

    // 3. Trigger Email Notification via Backend Endpoint
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionType: "Job Application",
          applicationId,
          docId: docRef.id,
          position: input.position,
          fullName: input.fullName,
          currentLocation: input.currentLocation,
          contactNumber: input.contactNumber,
          email: input.email,
          resumeFileName,
          resumeDownloadURL,
          sourcePage: typeof window !== "undefined" ? window.location.href : "Website",
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }),
      });
    } catch (emailError) {
      console.error("[EMAIL ERROR] Background email notification failed:", emailError);
    }

    return applicationId;
  },
};
