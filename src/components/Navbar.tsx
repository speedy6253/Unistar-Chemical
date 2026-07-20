import { NavLink } from "react-router-dom";
import { Phone, Menu, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { BUSINESS_INFO } from "../productsData";
import EnquiryModal from "./EnquiryModal";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-xs sticky top-0 z-40 border-b border-gray-100/80 h-[90px] flex items-center">
      {/* Main Navbar - Perfect spacing matching reference */}
      <div className="w-full px-4 lg:px-8 bg-white h-full flex items-center">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center h-full">
          
          {/* Logo Brand Representation - matching public/logo.svg and reference */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11">
              <img
                src="https://i.ibb.co/BH2rsRW2/Unistar-logo.png"
                alt="Unistar Chemicals Logo"
                className="w-10 h-10 relative z-10 transition-transform duration-500 group-hover:rotate-12"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] tracking-wider text-[#123C74] uppercase leading-none font-sans">
                UNISTAR CHEMICALS
              </span>
              <span className="text-[9px] tracking-[0.18em] text-[#2FA8B8] uppercase font-bold mt-1.5 leading-none">
                CREATE CHEMISTRY
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation - Clean center placement */}
          <nav className="hidden md:flex items-center gap-1 h-full font-sans">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 h-full flex items-center text-xs font-semibold tracking-widest transition-all relative ${
                  isActive
                    ? "text-[#123C74]"
                    : "text-gray-500 hover:text-[#123C74]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  HOME
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#123C74] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-4 h-full flex items-center text-xs font-semibold tracking-widest transition-all relative ${
                  isActive
                    ? "text-[#123C74]"
                    : "text-gray-500 hover:text-[#123C74]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  PRODUCTS
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#123C74] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-4 h-full flex items-center text-xs font-semibold tracking-widest transition-all relative ${
                  isActive
                    ? "text-[#123C74]"
                    : "text-gray-500 hover:text-[#123C74]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  ABOUT US
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#123C74] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 h-full flex items-center text-xs font-semibold tracking-widest transition-all relative ${
                  isActive
                    ? "text-[#123C74]"
                    : "text-gray-500 hover:text-[#123C74]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  CONTACT US
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#123C74] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Phone Number & Enquire CTA Button - Matching reference precisely */}
          <div className="hidden lg:flex items-center gap-6 h-full">
            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 hover:opacity-85 transition-opacity"
            >
              <Phone className="w-5 h-5 text-[#123C74]" />
              <span className="font-extrabold text-sm text-[#123C74] font-sans tracking-wider">
                {BUSINESS_INFO.phone}
              </span>
            </a>
            
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="h-14 px-6 bg-[#123C74] hover:bg-[#1D5A92] text-white rounded-[14px] font-semibold text-xs tracking-widest transition-all duration-250 shadow-xs hover:-translate-y-0.5 flex items-center justify-center gap-2 uppercase"
              id="navbar-enquire-btn"
            >
              <MessageSquare className="w-4 h-4" />
              <span>ENQUIRE NOW</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#123C74] hover:bg-gray-50 rounded"
            aria-label="Toggle Menu"
            id="mobile-navbar-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 flex flex-col gap-2 shadow-inner absolute top-[90px] left-0 w-full z-50">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded font-bold text-sm tracking-wide ${
                isActive ? "bg-blue-50 text-[#123C74]" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            HOME
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded font-bold text-sm tracking-wide ${
                isActive ? "bg-blue-50 text-[#123C74]" : "text-gray-500 hover:bg-gray-50"
              }`
            }
          >
            PRODUCTS
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded font-bold text-sm tracking-wide ${
                isActive ? "bg-blue-50 text-[#123C74]" : "text-gray-500 hover:bg-gray-50"
              }`
            }
          >
            ABOUT US
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded font-bold text-sm tracking-wide ${
                isActive ? "bg-blue-50 text-[#123C74]" : "text-gray-500 hover:bg-gray-50"
              }`
            }
          >
            CONTACT US
          </NavLink>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setEnquiryModalOpen(true);
            }}
            className="mt-2 w-full text-center px-4 py-3 bg-[#123C74] hover:bg-[#1E5A93] text-white rounded font-bold text-sm tracking-wide transition-colors"
          >
            ENQUIRE NOW
          </button>
        </div>
      )}

      {/* Embedded Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productName="General Industrial Chemical Bulk Supply"
      />
    </header>
  );
}
