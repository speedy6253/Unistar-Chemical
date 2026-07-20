import React from "react";
import { Beaker, Droplets, Sparkles, Check } from "lucide-react";

// Helper to assign icons to categories for visual design
export function getCategoryIcon(category: string) {
  switch (category) {
    case "Acids":
      return <Beaker className="w-5 h-5 text-red-500" />;
    case "Alkalis":
      return <Droplets className="w-5 h-5 text-teal-500" />;
    case "Solvents":
      return <Beaker className="w-5 h-5 text-emerald-500" />;
    case "Water Treatment Chemicals":
      return <Droplets className="w-5 h-5 text-blue-500" />;
    case "Salts & Minerals":
      return <Sparkles className="w-5 h-5 text-amber-500" />;
    case "Food Grade Chemicals":
      return <Check className="w-5 h-5 text-green-600" />;
    case "Specialty Chemicals":
      return <Beaker className="w-5 h-5 text-purple-500" />;
    default:
      return <Beaker className="w-5 h-5 text-[#123C74]" />;
  }
}

// Helper to assign soft colors for category highlights
export function getCategoryColor(category: string) {
  switch (category) {
    case "Acids":
      return { border: "border-red-100", bg: "bg-red-50", text: "text-red-700", accent: "bg-red-500" };
    case "Alkalis":
      return { border: "border-teal-100", bg: "bg-teal-50", text: "text-teal-700", accent: "bg-teal-500" };
    case "Solvents":
      return { border: "border-emerald-100", bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-500" };
    case "Water Treatment Chemicals":
      return { border: "border-cyan-100", bg: "bg-cyan-50", text: "text-cyan-700", accent: "bg-cyan-500" };
    case "Salts & Minerals":
      return { border: "border-amber-100", bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-500" };
    case "Food Grade Chemicals":
      return { border: "border-green-100", bg: "bg-green-50", text: "text-green-700", accent: "bg-green-600" };
    case "Specialty Chemicals":
      return { border: "border-purple-100", bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-500" };
    default:
      return { border: "border-blue-100", bg: "bg-blue-50", text: "text-blue-700", accent: "bg-[#123C74]" };
  }
}
