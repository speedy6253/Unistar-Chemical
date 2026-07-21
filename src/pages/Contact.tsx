import { useState, ChangeEvent, FormEvent } from "react";
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Clock, ShieldCheck, AlertCircle, CheckCircle2 
} from "lucide-react";
import { BUSINESS_INFO, FAQS } from "../productsData";
import { leadService } from "../services/leadService";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Save to Firestore first
      await leadService.submitContactEnquiry({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        city: "Not Provided",
        state: "Not Provided",
        message: formData.message,
        subject: "General B2B Enquiry"
      });

      // Compile general B2B enquiry message
      const messageText = `Hello Unistar Chemicals,

I visited your website and would like to contact you regarding a B2B query:

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

Requirement:
${formData.message}

Please get in touch with me with details.`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappUrlNumber}?text=${encodedMessage}`;

      setSubmitted(true);

      setTimeout(() => {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        setSubmitted(false);
        // Reset form
        setFormData({
          name: "",
          company: "",
          phone: "",
          whatsapp: "",
          email: "",
          message: ""
        });
      }, 1200);
    } catch (err: any) {
      console.error("Firestore contact submission failed:", err);
      setError(err.message || "Failed to submit request. Please check your network and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="font-sans bg-gray-50 py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-extrabold text-corporate-blue uppercase tracking-widest pl-2 border-l-4 border-corporate-blue">
              Contact Procurement Desk
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Get In Touch With Us
            </h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 max-w-md">
            Reach out to our Kolkata corporate offices or submit a general procurement query instantly via WhatsApp.
          </p>
        </div>

        {/* Form and Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official details & Map */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Business Contact Sheet */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs flex flex-col gap-5">
              <h3 className="font-extrabold text-gray-900 text-sm tracking-wide uppercase border-b border-gray-100 pb-3">
                Corporate Address & Helpdesk
              </h3>

              <ul className="flex flex-col gap-4 text-xs">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-corporate-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 uppercase text-[10px] tracking-wider block mb-0.5">Head Office</strong>
                    <span className="text-gray-600 leading-relaxed">{BUSINESS_INFO.headOffice}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-corporate-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 uppercase text-[10px] tracking-wider block mb-0.5">Corporate Office</strong>
                    <span className="text-gray-600 leading-relaxed">{BUSINESS_INFO.corporateOffice}</span>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-corporate-blue shrink-0" />
                  <div>
                    <strong className="text-gray-800 uppercase text-[10px] tracking-wider block mb-0.5">Direct Hotline</strong>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="text-gray-600 font-bold hover:text-corporate-blue transition-colors">
                      {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-corporate-blue shrink-0" />
                  <div>
                    <strong className="text-gray-800 uppercase text-[10px] tracking-wider block mb-0.5">Email Support</strong>
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="text-gray-600 font-bold hover:text-corporate-blue transition-colors">
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded border border-emerald-100 flex items-start gap-2 text-xs mt-2">
                <Clock className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Office Working Hours:</strong> {BUSINESS_INFO.workingHours}. General helpdesk is closed on national holidays.
                </span>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs flex flex-col gap-3">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block border-b border-gray-100 pb-2">
                Salt Lake Sector V Location
              </span>
              <div className="h-56 bg-gray-100 rounded overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0539121669466!2d88.4283896!3d22.5724264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275af00000001%3A0xb3ca6ef16e5cd6e9!2sSector%20V%2C%20Salt%20Lake%20City%2C%20Kolkata%2C%20West%20Bengal%20700091!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map Salt Lake Location"
                ></iframe>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic WhatsApp RFQ general Form */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-xs">
            <h3 className="font-extrabold text-gray-900 text-lg border-b border-gray-100 pb-4 mb-5 uppercase tracking-wide">
              Submit B2B Procurement Request
            </h3>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
                <h4 className="text-lg font-bold text-gray-800 font-sans">Compiling B2B Message...</h4>
                <p className="text-xs text-gray-500 max-w-md">
                  We are formatting your contact requirement and redirecting you to WhatsApp Web/App for direct communication. Please click "Send" when the app opens.
                </p>
                <div className="w-10 h-10 border-4 border-corporate-blue border-t-transparent rounded-full animate-spin mt-4"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs md:text-sm">
                {error && (
                  <div className="bg-red-50 text-red-800 p-3 rounded border border-red-100 text-xs font-medium">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3.5 py-2.5 outline-none text-sm transition-all"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="E.g., Unistar Textiles Ltd"
                      className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3.5 py-2.5 outline-none text-sm transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="E.g., +91..."
                      className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3.5 py-2.5 outline-none text-sm transition-all"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="Enter active WhatsApp"
                      className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3.5 py-2.5 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Corporate Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E.g., procurement@yourcompany.com"
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3.5 py-2.5 outline-none text-sm transition-all"
                  />
                </div>

                {/* Requirement Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Describe Your Detailed Requirement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="State products required, desired quantities, delivery timeline, certificate parameters, etc."
                    className="w-full border border-gray-200 focus:border-corporate-blue focus:ring-1 focus:ring-corporate-blue rounded px-3.5 py-2.5 outline-none text-sm resize-none transition-all"
                  />
                </div>

                {/* Security and notification note */}
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded border border-emerald-100 flex items-start gap-2.5 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Corporate Verified Supplier:</strong> Your submitted procurement request is compiled automatically. No data is stored; we immediately establish contact via secure WhatsApp chat.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  id="submit-contact-form-btn"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry Via WhatsApp</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* EXTRA FEATURE: FAQ section */}
        <section className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 md:p-8">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Quick answers regarding Unistar Chemical sourcing standards, logistics coverage, and payment terms.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-100 rounded-md overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50 text-left hover:bg-blue-50/50 transition-colors"
                >
                  <span className="font-bold text-gray-800 text-xs md:text-sm">
                    {faq.question}
                  </span>
                  <span className="text-corporate-blue font-bold text-base select-none pl-2">
                    {activeFaq === index ? "−" : "+"}
                  </span>
                </button>
                {activeFaq === index && (
                  <div className="px-4 py-3 bg-white text-xs md:text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
