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

// Automatically reset scroll position on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
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
          
          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans relative overflow-x-hidden">
        {/* Reset window viewport scrolling */}
        <ScrollToTop />

        {/* Floating micro-particle molecular overlay */}
        <ChemicalTransition />

        {/* Corporate Topbar + Main Navbar */}
        <Header />

        {/* Content routing stage with animated page transitions */}
        <main className="flex-grow flex flex-col relative z-10">
          <AnimatedRoutes />
        </main>

        {/* B2B Footer */}
        <Footer />

        {/* Floating Quick Action triggers (WhatsApp & Call) */}
        <FloatingButtons />
      </div>
    </Router>
  );
}

