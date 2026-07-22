import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp, runTransaction, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Helper to check for duplicate submissions in the last 60 seconds
export function isDuplicateSubmission(email: string, phone: string): boolean {
  try {
    const key = `lead_submit_${email.trim().toLowerCase()}_${phone.trim()}`;
    const lastSubmitTime = localStorage.getItem(key);
    if (lastSubmitTime) {
      const timePassed = Date.now() - parseInt(lastSubmitTime, 10);
      const limitMs = 60 * 1000; // 60 seconds interval limit
      if (timePassed < limitMs) {
        return true;
      }
    }
  } catch (e) {
    // Fallback if localStorage is disabled/inaccessible
  }
  return false;
}

// Helper to record a successful submission timestamp
export function recordSubmission(email: string, phone: string): void {
  try {
    const key = `lead_submit_${email.trim().toLowerCase()}_${phone.trim()}`;
    localStorage.setItem(key, String(Date.now()));
  } catch (e) {
    // Fallback
  }
}

// Metadata extraction helpers
function getDeviceType(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

function getBrowser(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Browser";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Trident")) return "Internet Explorer";
  if (ua.includes("Edge") || ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Unknown";
}

function getOperatingSystem(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Unknown";
}

function getUTMParam(param: string): string {
  if (typeof window === "undefined") return "";
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || "";
}

// Generate sequential human-readable Lead ID (e.g. UC-20260721-000001)
// We use a transactional atomic counter on /counters/{collectionName}_{dateStr}
// This provides a secure, collision-free transaction without requiring public read permissions on lead data.
// If the counter read/write fails, we fall back to a precise seconds-since-midnight sequential ID.
async function generateLeadId(collectionName: string): Promise<string> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}${mm}${dd}`;
  const prefix = `UC-${dateStr}-`;

  try {
    const counterDocRef = doc(db, "counters", `${collectionName}_${dateStr}`);
    let nextNum = 1;

    await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);
      if (counterDoc.exists()) {
        const currentCount = counterDoc.data().count || 0;
        nextNum = currentCount + 1;
        transaction.update(counterDocRef, { count: nextNum });
      } else {
        transaction.set(counterDocRef, { count: 1 });
      }
    });

    const nextNumStr = String(nextNum).padStart(6, "0");
    return `${prefix}${nextNumStr}`;
  } catch (error) {
    console.warn(`Firestore transaction counter unavailable for ${collectionName}:`, error);
    
    // Non-random, strictly sequential human-readable fallback (seconds since midnight)
    // At 2:30:15 PM, this generates UC-YYYYMMDD-052215 (completely compliant and sequential)
    const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const secondsSinceMidnight = Math.floor((today.getTime() - midnight.getTime()) / 1000);
    const nextNumStr = String(secondsSinceMidnight).padStart(6, "0");
    return `${prefix}${nextNumStr}`;
  }
}

// Build standard metadata object for any submission
function buildLeadMetadata() {
  return {
    source: "Website",
    status: "New",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deviceType: getDeviceType(),
    browser: getBrowser(),
    operatingSystem: getOperatingSystem(),
    landingPage: typeof window !== "undefined" ? window.location.href : "Unknown",
    referrer: typeof document !== "undefined" ? document.referrer || "Direct" : "Direct",
    utm_source: getUTMParam("utm_source"),
    utm_medium: getUTMParam("utm_medium"),
    utm_campaign: getUTMParam("utm_campaign"),
  };
}

// Helper to send server-side email notification silently in the background
async function sendServerEmailNotification(payload: {
  submissionType: "Product Enquiry" | "Catalogue Download" | "General Enquiry";
  leadId: string;
  docId?: string;
  name: string;
  company: string;
  designation?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  city?: string;
  state?: string;
  country?: string;
  productCategory?: string;
  selectedProduct?: string;
  downloadedCatalogue?: string;
  requiredQuantity?: string;
  message?: string;
  sourcePage?: string;
}) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      }),
    });

    if (!response.ok) {
      console.warn(`[EMAIL WARNING] Background server email endpoint returned HTTP ${response.status}`);
    } else {
      const data = await response.json();
      console.log("[EMAIL SUCCESS] Background email notification logged/sent:", data);
    }
  } catch (error) {
    // Non-blocking: background email failure must NOT interrupt visitor or throw exception
    console.error("[EMAIL ERROR] Background server email notification failed silently:", error);
  }
}

// Service interfaces for inputs
export interface ProductEnquiryInput {
  name: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  message: string;
  productName: string;
  quantity: string;
}

export interface CatalogueDownloadInput {
  name: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  message?: string;
  downloadedCatalogue: string;
}

export interface ContactEnquiryInput {
  name: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  message: string;
  subject: string;
}

// Exported Service Class/Functions
export const leadService = {
  /**
   * Submit a Product Enquiry to Firestore
   */
  async submitProductEnquiry(input: ProductEnquiryInput): Promise<string> {
    const collectionName = "product_enquiries";
    
    // Check duplicates
    if (isDuplicateSubmission(input.email, input.phone)) {
      throw new Error("Duplicate submission detected. You have already submitted an enquiry recently. Please wait a minute before trying again.");
    }

    const leadId = await generateLeadId(collectionName);
    const metadata = buildLeadMetadata();

    const docData = {
      leadId,
      ...input,
      ...metadata,
    };

    const docRef = await addDoc(collection(db, collectionName), docData);
    recordSubmission(input.email, input.phone);

    // Trigger server-side background email notification silently
    sendServerEmailNotification({
      submissionType: "Product Enquiry",
      leadId,
      docId: docRef.id,
      name: input.name,
      company: input.company,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      city: input.city,
      state: input.state,
      country: "India",
      selectedProduct: input.productName,
      requiredQuantity: input.quantity,
      message: input.message,
      sourcePage: typeof window !== "undefined" ? window.location.href : "Website",
    });

    return leadId;
  },

  /**
   * Submit a Catalogue Download lead to Firestore
   */
  async submitCatalogueDownload(input: CatalogueDownloadInput): Promise<string> {
    const collectionName = "catalogue_downloads";

    // Check duplicates
    if (isDuplicateSubmission(input.email, input.phone)) {
      throw new Error("Duplicate submission detected. You have already submitted an enquiry recently. Please wait a minute before trying again.");
    }

    const leadId = await generateLeadId(collectionName);
    const metadata = buildLeadMetadata();

    const docData = {
      leadId,
      message: input.message || "",
      ...input,
      ...metadata,
    };

    const docRef = await addDoc(collection(db, collectionName), docData);
    recordSubmission(input.email, input.phone);

    // Trigger server-side background email notification silently
    sendServerEmailNotification({
      submissionType: "Catalogue Download",
      leadId,
      docId: docRef.id,
      name: input.name,
      company: input.company,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      city: input.city,
      state: input.state,
      country: "India",
      downloadedCatalogue: input.downloadedCatalogue,
      message: input.message || "Requesting catalogue and wholesale quotations.",
      sourcePage: typeof window !== "undefined" ? window.location.href : "Website",
    });

    return leadId;
  },

  /**
   * Submit a Contact Form lead to Firestore
   */
  async submitContactEnquiry(input: ContactEnquiryInput): Promise<string> {
    const collectionName = "contact_enquiries";

    // Check duplicates
    if (isDuplicateSubmission(input.email, input.phone)) {
      throw new Error("Duplicate submission detected. You have already submitted an enquiry recently. Please wait a minute before trying again.");
    }

    const leadId = await generateLeadId(collectionName);
    const metadata = buildLeadMetadata();

    const docData = {
      leadId,
      ...input,
      ...metadata,
    };

    const docRef = await addDoc(collection(db, collectionName), docData);
    recordSubmission(input.email, input.phone);

    // Trigger server-side background email notification silently
    sendServerEmailNotification({
      submissionType: "General Enquiry",
      leadId,
      docId: docRef.id,
      name: input.name,
      company: input.company,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      city: input.city,
      state: input.state,
      country: "India",
      message: input.message,
      sourcePage: typeof window !== "undefined" ? window.location.href : "Website",
    });

    return leadId;
  }
};
