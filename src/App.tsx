/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import ChemicalTransition from "./components/ChemicalTransition";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Media from "./pages/Media";

// Admin Imports
import { AdminAuthProvider, useAdminAuth } from "./hooks/useAdminAuth";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminMedia from "./pages/admin/Media";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";
import AdminProductPreview from "./pages/admin/ProductPreview";
import AdminCategories from "./pages/admin/Categories";

// Automates direct route redirection for /admin based on real-time auth status
function AdminShortcutRedirect() {
  const { adminUser, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center relative z-50">
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-t-[#2FA8B8] border-r-[#123C74] border-b-[#123C74] border-l-[#123C74]/20 rounded-full animate-spin" />
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold text-[#123C74] uppercase tracking-widest pl-3 border-l-4 border-[#2FA8B8]">
              Unistar Corporate Portal
            </span>
            <span className="text-sm font-medium text-gray-500 mt-2">
              Loading security portal...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (adminUser) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/admin/login" replace />;
  }
}

// Automatically reset scroll position or scroll to anchor on route changes
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname, hash]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  // Premium scientific page transition variants
  // Mimics visual elements dissolving into molecular micro-particles on exit,
  // and synthesizing/re-assembling smoothly on entry.
  const transitionVariants = {
    initial: {
      opacity: 0,
      scale: 1.015,
      filter: "blur(8px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // easeOutQuart
        delay: 0.25, // Delay slightly to allow exit dissolve & initial canvas ripple to start
      },
    },
    exit: {
      opacity: 0,
      scale: 0.985,
      filter: "blur(8px)",
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-grow flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/media" element={<Media />} />
          
          {/* Admin secure portals */}
          <Route path="/admin" element={<AdminShortcutRedirect />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
          <Route path="/admin/products/preview/:id" element={<AdminProductPreview />} />
          
          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans relative overflow-x-hidden">
      {/* Reset window viewport scrolling */}
      <ScrollToTop />

      {/* Floating micro-particle molecular overlay */}
      <ChemicalTransition />

      {/* Corporate Topbar + Main Navbar (Omit for admin dashboard) */}
      {!isAdminRoute && <Header />}

      {/* Content routing stage with animated page transitions */}
      <main className="flex-grow flex flex-col relative z-10">
        <AnimatedRoutes />
      </main>

      {/* B2B Footer (Omit for admin dashboard) */}
      {!isAdminRoute && <Footer />}

      {/* Floating Quick Action triggers (WhatsApp & Call) (Omit for admin dashboard) */}
      {!isAdminRoute && <FloatingButtons />}
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AdminAuthProvider>
  );
}


