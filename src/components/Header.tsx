import { NavLink, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BUSINESS_INFO } from "../productsData";
import EnquiryModal from "./EnquiryModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="w-full bg-white shadow-[0_2px_15px_rgba(18,60,116,0.03)] sticky top-0 z-40 h-[88px] flex items-center">
      {/* Main Navbar - Perfect spacing matching reference */}
      <div className="w-full px-4 lg:px-8 bg-white h-full flex items-center">
        <div className="max-w-[1320px] w-full mx-auto flex justify-between items-center h-full">
          
          {/* Left Side: Brand Logo ONLY. No text logo as instructed. */}
          <NavLink to="/" className="flex items-center select-none shrink-0" aria-label="Unistar Chemicals Home">
            <img
              src="https://i.ibb.co/BH2rsRW2/Unistar-logo.png"
              alt="Unistar Chemicals"
              className="h-[50px] w-auto object-contain transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </NavLink>

          {/* Center Navigation - Clean placement with 40px gap, Inter font, 16px size, 500 weight, normal tracking */}
          <nav className="hidden min-[992px]:flex items-center gap-[40px] h-full font-sans">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-2 text-[16px] font-medium tracking-normal transition-colors duration-250 group ${
                  isActive ? "text-[#123C74]" : "text-gray-500 hover:text-[#123C74]"
                }`
              }
              end
            >
              {({ isActive }) => (
                <>
                  Home
                  <span
                    className={`absolute bottom-0 left-0 h-[3px] bg-[#123C74] transition-all duration-250 rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative py-2 text-[16px] font-medium tracking-normal transition-colors duration-250 group ${
                  isActive ? "text-[#123C74]" : "text-gray-500 hover:text-[#123C74]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  About
                  <span
                    className={`absolute bottom-0 left-0 h-[3px] bg-[#123C74] transition-all duration-250 rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `relative py-2 text-[16px] font-medium tracking-normal transition-colors duration-250 group ${
                  isActive ? "text-[#123C74]" : "text-gray-500 hover:text-[#123C74]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Products
                  <span
                    className={`absolute bottom-0 left-0 h-[3px] bg-[#123C74] transition-all duration-250 rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>

            <NavLink
              to="/media"
              className={({ isActive }) =>
                `relative py-2 text-[16px] font-medium tracking-normal transition-colors duration-250 group ${
                  isActive ? "text-[#123C74]" : "text-gray-500 hover:text-[#123C74]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Media Center
                  <span
                    className={`absolute bottom-0 left-0 h-[3px] bg-[#123C74] transition-all duration-250 rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative py-2 text-[16px] font-medium tracking-normal transition-colors duration-250 group ${
                  isActive ? "text-[#123C74]" : "text-gray-500 hover:text-[#123C74]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Contact
                  <span
                    className={`absolute bottom-0 left-0 h-[3px] bg-[#123C74] transition-all duration-250 rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          </nav>

          {/* Right Side - Phone Number & Primary CTA Button - Matching reference precisely */}
          <div className="hidden min-[992px]:flex items-center gap-8 h-full">
            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity duration-200"
            >
              <Phone className="w-5 h-5 text-[#123C74]" />
              <span className="font-bold text-[15px] text-[#123C74] font-sans tracking-wide">
                {BUSINESS_INFO.phone}
              </span>
            </a>
            
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="h-12 px-8 bg-[#123C74] hover:bg-[#1D5A92] text-white rounded-[12px] font-bold text-xs tracking-wider transition-all duration-250 shadow-sm hover:-translate-y-[2px] flex items-center justify-center gap-2 uppercase"
              id="header-enquire-btn"
            >
              <span>Request a Quote</span>
            </button>
          </div>

          {/* Mobile Menu Trigger & Responsive CTA Button */}
          <div className="flex min-[992px]:hidden items-center gap-4">
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="h-10 px-5 bg-[#123C74] hover:bg-[#1D5A92] text-white rounded-[10px] font-bold text-[11px] tracking-wider transition-all duration-250 shadow-sm hover:-translate-y-[2px] flex items-center justify-center uppercase max-[440px]:hidden"
            >
              Enquire
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#123C74] hover:bg-gray-50 rounded-xl transition-colors"
              aria-label="Toggle Menu"
              id="mobile-menu-toggle"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Premium Slide Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Soft Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 min-[992px]:hidden"
            />

            {/* Slide Panel from Right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col p-6 min-[992px]:hidden"
            >
              {/* Header with Logo and Close Icon */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <img
                  src="https://i.ibb.co/BH2rsRW2/Unistar-logo.png"
                  alt="Unistar Chemicals"
                  className="h-[44px] w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-[#123C74] rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items - Large Spacing & Typography consistent with desktop */}
              <nav className="flex flex-col gap-6 py-10 flex-grow font-sans">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium tracking-normal py-2 border-b border-gray-50 transition-colors ${
                      isActive ? "text-[#123C74] font-bold" : "text-gray-600 hover:text-[#123C74]"
                    }`
                  }
                  end
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium tracking-normal py-2 border-b border-gray-50 transition-colors ${
                      isActive ? "text-[#123C74] font-bold" : "text-gray-600 hover:text-[#123C74]"
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium tracking-normal py-2 border-b border-gray-50 transition-colors ${
                      isActive ? "text-[#123C74] font-bold" : "text-gray-600 hover:text-[#123C74]"
                    }`
                  }
                >
                  Products
                </NavLink>

                <NavLink
                  to="/media"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium tracking-normal py-2 border-b border-gray-50 transition-colors ${
                      isActive ? "text-[#123C74] font-bold" : "text-gray-600 hover:text-[#123C74]"
                    }`
                  }
                >
                  Media Center
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium tracking-normal py-2 border-b border-gray-50 transition-colors ${
                      isActive ? "text-[#123C74] font-bold" : "text-gray-600 hover:text-[#123C74]"
                    }`
                  }
                >
                  Contact
                </NavLink>
              </nav>

              {/* Footer Information in Drawer */}
              <div className="pt-6 border-t border-gray-100 flex flex-col gap-6">
                <a
                  href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 justify-center py-2 text-[#123C74] hover:opacity-85 transition-opacity"
                >
                  <Phone className="w-5 h-5 text-[#123C74]" />
                  <span className="font-bold text-base font-sans">
                    {BUSINESS_INFO.phone}
                  </span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setEnquiryModalOpen(true);
                  }}
                  className="w-full h-12 bg-[#123C74] hover:bg-[#1D5A92] text-white rounded-[12px] font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 uppercase"
                >
                  Request a Quote
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Embedded Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productName="General Industrial Chemical Bulk Supply"
      />
    </header>
  );
}
