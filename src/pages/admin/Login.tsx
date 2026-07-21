import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { ShieldAlert, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const { adminUser, login, error, clearError, loading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get the redirect path from state, default to admin dashboard
  const from = (location.state as any)?.from?.pathname || "/admin/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (adminUser) {
      navigate(from, { replace: true });
    }
  }, [adminUser, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    clearError();

    if (!email || !password) {
      setSubmitError("Please fill out all fields.");
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setSubmitError(err.message || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Brand Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#123C74]/2 opacity-40 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2FA8B8]/3 opacity-30 blur-3xl" />

      {/* Back to main site link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#123C74] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>BACK TO UNISTAR WEBSITE</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex flex-col items-center">
          {/* Logo Icon */}
          <div className="w-16 h-16 rounded-xl bg-[#123C74] shadow-lg flex items-center justify-center border border-[#2FA8B8]/20 mb-5">
            <span className="font-black text-2xl text-white tracking-widest pl-1">U</span>
          </div>

          <span className="text-[10px] font-extrabold text-[#2FA8B8] uppercase tracking-[0.2em] mb-1">
            Unistar Corporate Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#123C74] text-center tracking-tight uppercase">
            Admin Secure Access
          </h2>
          <p className="mt-2 text-sm text-gray-500 text-center max-w">
            Manage corporate catalogues, enquiries, and digital media assets.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 shadow-xl sm:rounded-xl border border-gray-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Display errors */}
            {(submitError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div className="text-xs font-medium leading-relaxed">
                  {submitError || error}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#123C74]/20 focus:border-[#123C74] transition-all"
                  placeholder="admin@unistar.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#123C74]/20 focus:border-[#123C74] transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold tracking-wide uppercase text-white bg-[#123C74] hover:bg-[#0f3261] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#123C74] transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "AUTHENTICATE PORTAL"
                )}
              </button>
            </div>
          </form>

          {/* Secure System Banner - Seed Notice */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="bg-blue-50/60 border border-blue-200/50 p-4 rounded-lg flex gap-3">
              <ShieldCheck className="text-[#2FA8B8] shrink-0 mt-0.5" size={18} />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-[#123C74] uppercase tracking-wider leading-none">
                  Admin System Initialization
                </span>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  To bootstrap Phase 1 of the Admin Portal, use these credentials. The system will auto-seed this active Super Admin profile in your database:
                </p>
                <div className="bg-white/80 border border-blue-100/60 rounded p-2 mt-1.5 font-mono text-[10px] text-[#123C74] flex flex-col gap-1">
                  <div><strong className="text-gray-500">Email:</strong> admin@unistar.com</div>
                  <div><strong className="text-gray-500">Password:</strong> AdminPassword123!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
