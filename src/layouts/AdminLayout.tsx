import React, { useState } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Image,
  Newspaper,
  BookOpen,
  Mail,
  Download,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { adminUser, loading, logout } = useAdminAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If loading, show a premium corporate chemical spinner
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
              Verifying system privileges...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      disabled: false,
    },
    {
      name: "Products",
      icon: Package,
      path: "/admin/products",
      disabled: false,
    },
    {
      name: "Categories",
      icon: FolderOpen,
      path: "/admin/categories",
      disabled: false,
    },
    {
      name: "Media",
      icon: Image,
      path: "/admin/media",
      disabled: false,
    },
    {
      name: "News",
      icon: Newspaper,
      path: "/admin/news",
      disabled: true,
    },
    {
      name: "Catalogue Requests",
      icon: BookOpen,
      path: "/admin/catalogues",
      disabled: true,
    },
    {
      name: "Enquiries",
      icon: Mail,
      path: "/admin/enquiries",
      disabled: true,
    },
    {
      name: "Downloads",
      icon: Download,
      path: "/admin/downloads",
      disabled: true,
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
      disabled: true,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#123C74] text-white">
      {/* Brand Header */}
      <div className="h-[90px] px-8 flex items-center border-b border-white/10">
        <Link to="/" className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-white">UNISTAR</span>
            <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 bg-[#2FA8B8] text-white rounded">
              ADMIN
            </span>
          </div>
          <span className="text-[9px] font-semibold text-gray-300 tracking-widest uppercase">
            CMS Foundation v1.0
          </span>
        </Link>
      </div>

      {/* Admin Quick Profile */}
      <div className="px-8 py-6 border-b border-white/5 bg-[#0f3261]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2FA8B8]/20 border border-[#2FA8B8]/40 flex items-center justify-center text-[#2FA8B8]">
            <UserCheck size={20} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">{adminUser.name}</span>
            <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-wider truncate">
              {adminUser.role.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="group flex items-center justify-between px-4 py-3 rounded-lg text-white/40 cursor-not-allowed select-none transition-colors hover:bg-white/2"
                title={`${item.name} - Coming Soon`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-white/30" />
                  <span className="text-[14px] font-medium tracking-normal">{item.name}</span>
                </div>
                <span className="text-[9px] font-extrabold tracking-widest text-[#2FA8B8]/60 uppercase bg-[#2FA8B8]/5 px-2 py-0.5 rounded border border-[#2FA8B8]/10">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#2FA8B8] text-white font-semibold shadow-md shadow-[#2FA8B8]/10"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                size={18}
                className={`transition-colors duration-200 ${
                  isActive ? "text-white" : "text-[#2FA8B8] group-hover:text-white"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer LogOut */}
      <div className="p-4 border-t border-white/10 bg-[#0f3261]/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-400 border border-red-600/20 rounded-lg text-[14px] font-bold tracking-wide transition-all duration-200"
        >
          <LogOut size={16} />
          <span>LOGOUT PORTAL</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/60 flex relative">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] h-screen fixed top-0 left-0 border-r border-gray-100 shadow-xl z-30">
        <SidebarContent />
      </aside>

      {/* 2. Responsive Mobile Sidebar / Drawer (AnimatePresence) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#123C74]/40 backdrop-blur-xs z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 bottom-0 left-0 w-[280px] bg-[#123C74] z-50 lg:hidden shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-6 right-6 z-50">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Outer Shell */}
      <div className="flex-grow flex flex-col lg:pl-[280px] min-h-screen">
        {/* Top Header */}
        <header className="h-[90px] bg-white border-b border-gray-100 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Left: Mobile Toggle & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-[#123C74] hover:bg-gray-100 transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col">
              <div className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-widest pl-2 border-l-2 border-[#2FA8B8] leading-none mb-1">
                Unistar Portal
              </div>
              <h1 className="text-lg lg:text-xl font-extrabold text-[#123C74] tracking-tight uppercase leading-tight">
                {title}
              </h1>
            </div>
          </div>

          {/* Right: Quick info & Logout */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* System Status badge (Desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Active</span>
            </div>

            <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />

            {/* Profile badge */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden md:flex">
                <span className="text-xs font-bold text-gray-800 leading-none mb-0.5">
                  {adminUser.name}
                </span>
                <span className="text-[10px] text-gray-500 font-medium truncate max-w-[150px]">
                  {adminUser.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-100 transition-colors"
                title="Sign out of Admin Portal"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-grow p-6 lg:p-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
