import { FieldValue } from "firebase/firestore";

export interface CommonLead {
  leadId: string;
  name: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  message: string;
  source: string; // "Website"
  status: string; // "New"
  createdAt: FieldValue;
  updatedAt: FieldValue;
  deviceType: string;
  browser: string;
  operatingSystem: string;
  landingPage: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

export interface ProductEnquiry extends CommonLead {
  productName: string;
  quantity: string;
}

export interface CatalogueDownload extends CommonLead {
  downloadedCatalogue: string;
}

export interface ContactEnquiry extends CommonLead {
  subject: string;
}
