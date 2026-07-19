import { NavLink } from "react-router-dom";
import { Phone, Mail, Clock, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import { BUSINESS_INFO } from "../productsData";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-xs sticky top-0 z-40 border-b border-gray-100">
      {/* Sleek B2B Top-Bar */}
      <div className="w-full bg-corporate-blue text-white py-2 px-4 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 hover:text-accent-blue transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {BUSINESS_INFO.phone}</span>
            </a>
            <a
              href={`mailto:${BUSINESS_INFO.email}`}
              className="flex items-center gap-1.5 hover:text-accent-blue transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email: {BUSINESS_INFO.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-gray-200">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hours:</span> {BUSINESS_INFO.workingHours}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>ISO Certified Supplier</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full px-4 py-3 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Brand Representation - matching PDF exactly */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 text-corporate-blue">
              {/* Outer circle with rotating chemistry vibe */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full absolute animate-[spin_40s_linear_infinite]"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              {/* Atom/Molecule icon in center */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 relative z-10"
              >
                <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" />
                <path d="M4.5 16.5C5.8 15.2 8.2 14.5 12 14.5s6.2.7 7.5 2" />
                <path d="M19.5 7.5C18.2 8.8 15.8 9.5 12 9.5s-6.2-.7-7.5-2" />
                <path d="M12 2v3" />
                <path d="M12 19v3" />
                <path d="M3 12h3" />
                <path d="M18 12h3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg md:text-xl tracking-wider text-corporate-blue uppercase leading-tight font-sans">
                Unistar Chemicals
              </span>
              <span className="text-[9px] md:text-[10px] tracking-widest text-gray-500 uppercase font-semibold leading-none">
                Create Chemistry
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 font-sans">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-card-blue text-corporate-blue border-b-2 border-corporate-blue"
                    : "text-gray-600 hover:text-corporate-blue hover:bg-gray-50"
                }`
              }
            >
              HOME
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-card-blue text-corporate-blue border-b-2 border-corporate-blue"
                    : "text-gray-600 hover:text-corporate-blue hover:bg-gray-50"
                }`
              }
            >
              PRODUCTS
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-card-blue text-corporate-blue border-b-2 border-corporate-blue"
                    : "text-gray-600 hover:text-corporate-blue hover:bg-gray-50"
                }`
              }
            >
              ABOUT
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-card-blue text-corporate-blue border-b-2 border-corporate-blue"
                    : "text-gray-600 hover:text-corporate-blue hover:bg-gray-50"
                }`
              }
            >
              CONTACT
            </NavLink>

            <NavLink
              to="/products"
              className="ml-4 px-5 py-2.5 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded font-bold text-xs tracking-wider transition-colors shadow-sm"
            >
              VIEW PORTFOLIO
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-corporate-blue hover:bg-gray-50 rounded"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 flex flex-col gap-2 shadow-inner">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded font-bold text-sm tracking-wide ${
                isActive ? "bg-card-blue text-corporate-blue" : "text-gray-600 hover:bg-gray-50"
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
                isActive ? "bg-card-blue text-corporate-blue" : "text-gray-600 hover:bg-gray-50"
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
                isActive ? "bg-card-blue text-corporate-blue" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded font-bold text-sm tracking-wide ${
                isActive ? "bg-card-blue text-corporate-blue" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            CONTACT
          </NavLink>

          <NavLink
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 w-full text-center px-4 py-3 bg-corporate-blue hover:bg-corporate-blue-hover text-white rounded font-bold text-sm tracking-wide transition-colors"
          >
            Request Quotation
          </NavLink>
        </div>
      )}
    </header>
  );
}
