import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import {
  ShieldAlert,
  Server,
  Database,
  Calendar,
  Layers,
  Package,
  Image as ImageIcon,
  Newspaper,
  Mail,
  Download,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const { adminUser } = useAdminAuth();

  const systemMetrics = [
    {
      name: "Products Catalogued",
      value: "18",
      subtitle: "High-purity acids & solvents",
      icon: Package,
      color: "border-l-[#123C74] text-[#123C74]",
      badge: "In Transition",
    },
    {
      name: "Media Documents",
      value: "24",
      subtitle: "Corporate publications",
      icon: ImageIcon,
      color: "border-l-[#2FA8B8] text-[#2FA8B8]",
      badge: "Read Only",
    },
    {
      name: "News Articles",
      value: "12",
      subtitle: "Industry announcements",
      icon: Newspaper,
      color: "border-l-indigo-600 text-indigo-600",
      badge: "Draft Mode",
    },
    {
      name: "Total Lead Enquiries",
      value: "142",
      subtitle: "B2B sourcing queries",
      icon: Mail,
      color: "border-l-emerald-600 text-emerald-600",
      badge: "Capturing",
    },
    {
      name: "Catalogue Downloads",
      value: "389",
      subtitle: "Product specifications shared",
      icon: Download,
      color: "border-l-amber-600 text-amber-600",
      badge: "Static",
    },
  ];

  // Helper to format ISO timestamp cleanly
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-8">
        
        {/* 1. Welcome Card & Current Admin Status */}
        <div className="bg-[#123C74] text-white rounded-xl shadow-xl overflow-hidden relative">
          {/* Subtle decoration background grids */}
          <div className="absolute top-[-30%] right-[-10%] w-96 h-96 rounded-full bg-[#2FA8B8]/10 blur-3xl" />
          <div className="absolute bottom-0 left-[20%] w-60 h-2 bg-gradient-to-r from-transparent via-[#2FA8B8]/50 to-transparent" />
          
          <div className="p-8 lg:p-10 relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2FA8B8]/20 border border-[#2FA8B8]/40 rounded-full text-[#2FA8B8] text-[11px] font-extrabold uppercase tracking-widest leading-none">
                <Sparkles size={12} />
                <span>Phase 1 CMS Foundation Active</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight uppercase leading-none">
                Welcome Back, {adminUser?.name || "Administrator"}!
              </h2>
              <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
                The enterprise CMS framework has initialized successfully. You are currently authenticated via secure Firestore token verification. Your role provides access to the upcoming system modules.
              </p>
            </div>

            {/* Profile specifications card */}
            <div className="bg-[#0f3261] border border-white/10 rounded-lg p-5 lg:w-[400px] shrink-0 space-y-3.5">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-wider">
                  ADMIN SPECIFICATIONS
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full uppercase tracking-wider leading-none">
                  Active User
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-xs">
                <div>
                  <span className="text-gray-400 font-medium block">Name</span>
                  <span className="font-bold text-white text-sm">{adminUser?.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Admin Role</span>
                  <span className="font-bold text-[#2FA8B8] text-sm uppercase">
                    {adminUser?.role?.replace("_", " ") || "Super Admin"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 font-medium block">Secured Email</span>
                  <span className="font-bold text-white font-mono break-all">{adminUser?.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 font-medium block">Last Login Timestamp</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-gray-300">
                    <Calendar size={13} className="text-[#2FA8B8]" />
                    <span className="font-semibold">{formatDateTime(adminUser?.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Headline with Section Accent */}
        <div className="flex flex-col gap-1">
          <div className="text-xs font-extrabold text-[#123C74] uppercase tracking-widest pl-3 border-l-4 border-[#2FA8B8]">
            Corporate KPIs
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight uppercase">
            Static System Metrics
          </h3>
        </div>

        {/* 3. Metrics/KPI Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {systemMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.name}
                className="bg-white border-t border-r border-b border-l-4 border-gray-100 rounded-lg p-5 shadow-xs flex flex-col justify-between h-40 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                      {metric.name}
                    </span>
                    <span className="text-3xl font-extrabold text-gray-900 leading-none">
                      {metric.value}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-lg bg-gray-50 ${metric.color}`}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-4">
                  <span className="text-[10px] text-gray-500 font-medium truncate max-w-[110px]">
                    {metric.subtitle}
                  </span>
                  <span className="text-[9px] font-extrabold tracking-wider bg-gray-50 text-[#123C74] border border-gray-100 px-2 py-0.5 rounded uppercase">
                    {metric.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Phase 1 Roadmap & Secure System Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CMS Roadmap Block */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col justify-between lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#123C74] flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-wider">
                    Roadmap Planning
                  </span>
                  <h4 className="text-sm font-bold text-[#123C74] uppercase">
                    Upcoming CMS Modules
                  </h4>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                The current CMS architecture is designed for role-based extensibility. In the next development phases, these modules will transition from placeholder status to active, live-synced panels.
              </p>

              <div className="space-y-2.5">
                {[
                  { name: "Product Inventory CMS", desc: "Allows full CRUD management of technical specifications, safety data sheets (SDS), and pack size listings." },
                  { name: "Media Center Assets & File Uploads", desc: "Integrates cloud bucket storage to handle corporate brochures, video assets, and publication links." },
                  { name: "Enquiry Pipeline (CRM)", desc: "Synchronizes live lead captures with search, filter, export, and WhatsApp quick-response tools." },
                ].map((mod) => (
                  <div key={mod.name} className="p-3 bg-gray-50/50 hover:bg-gray-50 rounded-lg border border-gray-100/60 flex items-start gap-3 transition-colors">
                    <ChevronRight size={14} className="text-[#2FA8B8] mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-800 block">{mod.name}</span>
                      <span className="text-[11px] text-gray-500 leading-relaxed block">{mod.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Security Audit Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Server size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-wider">
                    Security Audit
                  </span>
                  <h4 className="text-sm font-bold text-[#123C74] uppercase">
                    Authentication Status
                  </h4>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-lg flex items-start gap-3">
                  <Database size={16} className="text-emerald-600 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-emerald-800 block">Database Connected</span>
                    <span className="text-[10px] text-emerald-600 leading-relaxed block">
                      Firestore `/admins` collection verified.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-lg flex items-start gap-3">
                  <Server size={16} className="text-indigo-600 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-indigo-800 block">Environment Mode</span>
                    <span className="text-[10px] text-indigo-600 leading-relaxed block">
                      Secure client token handshakes active.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-lg flex items-start gap-3">
                  <ShieldAlert size={16} className="text-blue-600 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-blue-800 block">Role-Based Gateways</span>
                    <span className="text-[10px] text-blue-600 leading-relaxed block">
                      Configured for {adminUser?.role === "super_admin" ? "full root permissions" : "restricted editor views"}.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 mt-6 flex justify-between items-center text-[11px] font-bold">
              <span className="text-gray-400 uppercase tracking-wider">FIREBASE SECURE</span>
              <div className="flex items-center gap-1 text-[#2FA8B8]">
                <span>RULES LOGS</span>
                <ExternalLink size={12} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
