import { NavLink } from "react-router-dom";
import { Mail, Phone, MapPin, Shield, Award, FileText, Globe } from "lucide-react";
import { MouseEvent } from "react";
import { BUSINESS_INFO, CATEGORIES } from "../productsData";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 font-sans border-t-4 border-corporate-blue">
      {/* Upper footer trust banners */}
      <div className="border-b border-gray-800 bg-gray-950 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 bg-gray-900 text-corporate-blue rounded-full border border-gray-800">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ISO 9001:2015 Compliant</h4>
              <p className="text-xs text-gray-400">Ensuring premium high-purity chemicals only</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 bg-gray-900 text-corporate-blue rounded-full border border-gray-800">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pan India Distribution</h4>
              <p className="text-xs text-gray-400">Reliable logistics across major chemical hubs</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 bg-gray-900 text-corporate-blue rounded-full border border-gray-800">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Verified Specifications</h4>
              <p className="text-xs text-gray-400">COA, MSDS, and batch reports available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/BH2rsRW2/Unistar-logo.png"
              alt="Unistar Chemicals Logo"
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-extrabold text-xl tracking-wider text-white uppercase font-sans">
              Unistar Chemicals
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Trusted supplier and distributor of premium-grade industrial chemicals. Committed to quality, integrity, and dependable logistics across India.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="font-bold text-white text-sm tracking-widest uppercase mb-4 border-l-2 border-corporate-blue pl-2">
            Quick Navigation
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs font-medium">
            <li>
              <NavLink to="/" className="hover:text-white transition-colors">
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className="hover:text-white transition-colors">
                PRODUCTS CATALOGUE
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-white transition-colors">
                ABOUT UNISTAR
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-white transition-colors">
                CONTACT US
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Categories Column */}
        <div>
          <h3 className="font-bold text-white text-sm tracking-widest uppercase mb-4 border-l-2 border-corporate-blue pl-2">
            Chemical Categories
          </h3>
          <ul className="grid grid-cols-1 gap-2 text-xs text-gray-400 font-medium">
            {CATEGORIES.slice(1, 6).map((cat) => (
              <li key={cat}>
                <NavLink to="/products" className="hover:text-white transition-colors">
                  {cat}
                </NavLink>
              </li>
            ))}
            {CATEGORIES.slice(6, 9).map((cat) => (
              <li key={cat}>
                <NavLink to="/products" className="hover:text-white transition-colors">
                  {cat}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h3 className="font-bold text-white text-sm tracking-widest uppercase mb-4 border-l-2 border-corporate-blue pl-2">
            Registered Offices
          </h3>
          <ul className="flex flex-col gap-3 text-xs leading-relaxed text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-gray-300">Head Office:</strong> {BUSINESS_INFO.headOffice}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-gray-300">Corporate:</strong> {BUSINESS_INFO.corporateOffice}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-white">
                {BUSINESS_INFO.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white break-all">
                {BUSINESS_INFO.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom copyright bar */}
      <div className="bg-gray-950 py-6 px-4 border-t border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} {BUSINESS_INFO.companyName}. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <span>B2B Industrial Supplier</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> Kolkata, West Bengal, India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
