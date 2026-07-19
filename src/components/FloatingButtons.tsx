import { MessageCircle, PhoneCall } from "lucide-react";
import { BUSINESS_INFO } from "../productsData";

export default function FloatingButtons() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappUrlNumber}?text=${encodeURIComponent(
    "Hello Unistar Chemicals, I visited your website and would like to enquire about your industrial chemical solutions."
  )}`;

  const callUrl = `tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center border border-[#1ebd52] group"
        title="Chat on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-6.5 h-6.5 animate-[pulse_2s_infinite]" fill="currentColor" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out text-sm font-bold tracking-wide whitespace-nowrap hidden sm:inline-block">
          Chat With Us
        </span>
      </a>

      {/* Sticky Call Button (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-corporate-blue text-white shadow-lg border-t border-blue-900 grid grid-cols-1">
        <a
          href={callUrl}
          className="flex items-center justify-center gap-2 py-3.5 font-bold text-sm tracking-widest uppercase hover:bg-corporate-blue-hover transition-colors"
          id="sticky-mobile-call-btn"
        >
          <PhoneCall className="w-4 h-4 animate-[bounce_1.5s_infinite]" />
          <span>Call procurement desk</span>
        </a>
      </div>
    </>
  );
}
