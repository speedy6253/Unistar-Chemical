import { X, Send, CheckCircle, Smartphone } from "lucide-react";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BUSINESS_INFO } from "../productsData";
import { leadService } from "../services/leadService";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export default function EnquiryModal({ isOpen, onClose, productName }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    quantity: "",
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Split city and state
      const [cityPart, ...stateParts] = formData.city.split(",");
      const city = cityPart ? cityPart.trim() : "";
      const state = stateParts.length > 0 ? stateParts.join(",").trim() : "";

      // Save to Firestore
      await leadService.submitProductEnquiry({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        city,
        state,
        message: formData.message,
        productName,
        quantity: formData.quantity,
      });

      // Compile message exactly as requested in the reference document
      const messageText = `Hello Unistar Chemicals,

I would like to enquire about:

Product:
${productName}

Name:
${formData.name}

Company:
${formData.company}

Phone:
${formData.phone}

WhatsApp:
${formData.whatsapp}

Email:
${formData.email}

City:
${formData.city}

Quantity:
${formData.quantity}


Requirement:
${formData.message}

Please share quotation.`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappUrlNumber}?text=${encodedMessage}`;

      setSubmitted(true);
      
      // Auto redirect after a brief moment
      setTimeout(() => {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error("Firestore submission failed:", err);
      setError(err.message || "Something went wrong while submitting your enquiry. Please check your network and try again.");
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
            <h3 className="font-extrabold tracking-wide uppercase text-sm md:text-base">
              Submit Product Enquiry
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Direct B2B Quote Request via WhatsApp
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1.5 rounded transition-colors"
            aria-label="Close modal"
            id="close-enquiry-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
              <h4 className="text-lg font-bold text-gray-800">Redirecting to WhatsApp...</h4>
              <p className="text-xs text-gray-500 max-w-sm">
                We have generated your structured RFQ. Please press "Send" in WhatsApp to deliver it directly to Unistar Chemicals procurement team.
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
              
              {/* Product Pre-filled Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Enquiring About
                </label>
                <input
                  type="text"
                  disabled
                  value={productName}
                  className="w-full bg-card-blue border border-accent-blue/30 rounded px-3.5 py-2 text-corporate-blue font-bold text-sm"
                />
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-1.5 outline-none"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="E.g., ABC Textiles Ltd"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-1.5 outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="With country code (e.g. +91...)"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-1.5 outline-none"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Same as phone or different"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-1.5 outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="purchasing@company.com"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-1.5 outline-none"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Delivery City & State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="E.g., Chennai, TN"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-1.5 outline-none"
                  />
                </div>
              </div>

              {/* Quantity Required */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Quantity Required <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="E.g., 5 MT, 50 Carboys, 200 bags"
                  className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-1.5 outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Specific Requirements or Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="E.g., Need premium grade with COA included. Delivery timeline required."
                  className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3 py-1.5 outline-none resize-none"
                />
              </div>

              {/* Notice */}
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded border border-emerald-100 flex items-start gap-2 text-[11px]">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>WhatsApp RFQ System:</strong> Submitting will instantly compile your quotation request. Ensure you have WhatsApp active on this device.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded transition-colors text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-6 py-2 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  id="submit-enquiry-btn"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
