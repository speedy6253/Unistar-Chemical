import { X, Send, Download, CheckCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BUSINESS_INFO, PRODUCTS } from "../productsData";
import { leadService } from "../services/leadService";

interface CatalogueDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogueDownloadModal({ isOpen, onClose }: CatalogueDownloadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setIsSaving(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerPdfDownload = () => {
    // Direct download of the uploaded official corporate product catalogue
    const link = document.createElement("a");
    link.href = "/catalogues/Unistar_Chemicals_Product_Catalogue.pdf";
    link.download = "Unistar_Chemicals_Product_Catalogue.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Split city and state
      const [cityPart, ...stateParts] = formData.city.split(",");
      const city = cityPart ? cityPart.trim() : "";
      const state = stateParts.length > 0 ? stateParts.join(",").trim() : "";

      // Save to Firestore first
      await leadService.submitCatalogueDownload({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        city,
        state,
        message: formData.message || "Requesting catalogue and wholesale quotations.",
        downloadedCatalogue: "Unistar_Chemicals_Product_Catalogue.pdf",
      });

      // Compile message exactly as requested
      const messageText = `Hello Unistar Chemicals,

I would like to download your complete product catalogue.

My Details:

Name:
${formData.name}

Company:
${formData.company}

Mobile:
${formData.phone}

WhatsApp:
${formData.whatsapp}

Email:
${formData.email}

City:
${formData.city || "Not Provided"}

Requirement / Message:
${formData.message || "Requesting catalogue and wholesale quotations."}

Please share your quotation and product details.`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappUrlNumber}?text=${encodedMessage}`;

      setSubmitted(true);

      // 1. Open WhatsApp with pre-filled message (Desktop or Mobile redirect)
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      // 2. Trigger the PDF download simultaneously
      triggerPdfDownload();

      // Reset form & close modal after a brief duration
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          company: "",
          phone: "",
          whatsapp: "",
          email: "",
          city: "",
          message: ""
        });
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Firestore catalogue download submission failed:", err);
      setError(err.message || "Failed to initiate download process. Please check your network and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-corporate-blue text-white px-5 py-4 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-extrabold tracking-wide uppercase text-sm md:text-base flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-300" />
              <span>Download Product Catalogue</span>
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Secure your complete B2B industrial guide instantly
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1.5 rounded transition-colors"
            aria-label="Close modal"
            id="close-download-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
              <h4 className="text-lg font-bold text-gray-800">Processing Your Request...</h4>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                We have generated your B2B lead sheet. Direct WhatsApp contact has been initiated and your PDF catalogue is downloading simultaneously.
              </p>
              <div className="w-8 h-8 border-4 border-corporate-blue border-t-transparent rounded-full animate-spin mt-4"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              {error && (
                <div className="bg-red-50 text-red-800 p-3 rounded border border-red-100 text-xs font-medium">
                  {error}
                </div>
              )}
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-xs text-corporate-blue leading-relaxed">
                <strong>Lead Magnet:</strong> Sourcing industrial compounds requires verified procurement details. Please fill out the brief form below to download our catalog and establish direct sourcing support.
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g., Rajesh Sharma"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-2 outline-none text-xs transition-all"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="E.g., Sharma Textiles Ltd"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-2 outline-none text-xs transition-all"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="E.g., +91 98300 12345"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-2 outline-none text-xs transition-all"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="For instant quotes"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-2 outline-none text-xs transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E.g., purchase@company.com"
                  className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-2 outline-none text-xs transition-all"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="E.g., Kolkata, West Bengal"
                  className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-2 outline-none text-xs transition-all"
                />
              </div>

              {/* Requirement / Message */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Requirement / Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Optional: Enter chemical grades or concentration levels required"
                  className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-2 outline-none text-xs resize-none transition-all"
                />
              </div>

              {/* Security Sourcing disclaimer */}
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-2.5 rounded text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Authorized B2B Channel:</strong> Your communication with Unistar Chemicals is protected. Direct PDF download will trigger immediately upon form submit.
                </span>
              </div>

              {/* Submit and Download button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                id="submit-download-catalogue-btn"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving & Downloading...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit & Download Catalogue</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
