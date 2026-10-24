"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  Calendar,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoRoleLoading, setDemoRoleLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Redirect authenticated users away from the login page
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "organizer") {
        router.replace("/organizer/dashboard");
      } else {
        router.replace("/volunteer/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError("");

    try {
      await login({ email: loginEmail, password: loginPass });
      const stored = localStorage.getItem("volunexa_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === "organizer") {
          router.replace("/organizer/dashboard");
        } else {
          router.replace("/volunteer/dashboard");
        }
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
      setDemoRoleLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    await performLogin(email, password);
  };

  // Immediate 1-click Demo Login (logs in directly without manual submit)
  const handleDemoLogin = async (role: "organizer" | "volunteer") => {
    const demoEmail =
      role === "organizer" ? "organizer@volunexa.com" : "volunteer@volunexa.com";
    const demoPass = "password123";

    setEmail(demoEmail);
    setPassword(demoPass);
    setDemoRoleLoading(role);
    await performLogin(demoEmail, demoPass);
  };

  // Prevent flicker if user is already authenticated
  if (authLoading || (isAuthenticated && user)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070d12]">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800">
        {/* Brand & Heading */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#00494B] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#00494B]/30">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in to manage events or track your volunteer participation
          </p>
        </div>

        {/* Demo Credentials 1-Click Login Bar */}
        <div className="mb-6 p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00494B] dark:text-teal-400 mb-2.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Instant Demo 1-Click Sign In:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin("organizer")}
              className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#00494B] hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {demoRoleLoading === "organizer" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00494B]" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Demo Organizer</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoLogin("volunteer")}
              className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#00494B] hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {demoRoleLoading === "volunteer" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00494B]" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Demo Volunteer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white font-bold text-sm shadow-md shadow-[#00494B]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-bold text-[#00494B] dark:text-teal-400 hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
