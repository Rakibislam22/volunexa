"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSocket } from "../../context/SocketContext";
import {
  Calendar,
  Compass,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Heart,
  PlusCircle,
  Radio,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isOrganizer, isVolunteer } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead, isConnected } = useSocket();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-[#0a1118]/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#00494B] flex items-center justify-center text-white shadow-md shadow-[#00494B]/20 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#00494B] dark:text-teal-400">
                VOLUNEXA
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 -mt-1">
                Community Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/")
                  ? "text-[#00494B] dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                  : "text-slate-600 dark:text-slate-300 hover:text-[#00494B] dark:hover:text-teal-400"
              }`}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/events")
                  ? "text-[#00494B] dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                  : "text-slate-600 dark:text-slate-300 hover:text-[#00494B] dark:hover:text-teal-400"
              }`}
            >
              Explore Events
            </Link>

            {isOrganizer && (
              <>
                <Link
                  href="/organizer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/organizer/dashboard")
                      ? "text-[#00494B] dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#00494B] dark:hover:text-teal-400"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/organizer/events"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/organizer/events")
                      ? "text-[#00494B] dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#00494B] dark:hover:text-teal-400"
                  }`}
                >
                  Manage Events
                </Link>
                <Link
                  href="/organizer/analytics"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/organizer/analytics")
                      ? "text-[#00494B] dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#00494B] dark:hover:text-teal-400"
                  }`}
                >
                  Analytics
                </Link>
              </>
            )}

            {isVolunteer && (
              <>
                <Link
                  href="/volunteer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/volunteer/dashboard")
                      ? "text-[#00494B] dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#00494B] dark:hover:text-teal-400"
                  }`}
                >
                  My Hub
                </Link>
                <Link
                  href="/volunteer/my-events"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/volunteer/my-events")
                      ? "text-[#00494B] dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#00494B] dark:hover:text-teal-400"
                  }`}
                >
                  Registered Events
                </Link>
                <Link
                  href="/volunteer/favorites"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/volunteer/favorites")
                      ? "text-[#00494B] dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#00494B] dark:hover:text-teal-400"
                  }`}
                >
                  Favorites
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Realtime Live Pulse Badge */}
            <div
              title={isConnected ? "Realtime connected" : "Connecting realtime..."}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              <span>Live</span>
            </div>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Realtime Notifications Dropdown */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    if (!notifDropdownOpen && unreadCount > 0) {
                      markAllAsRead();
                    }
                  }}
                  className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4B72] text-[10px] font-bold text-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Menu */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#00494B] dark:text-teal-400" />
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Live Notifications
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {notifications.length} updates
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-500">
                          No notifications yet. Real-time updates will appear here!
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3.5 transition-colors ${
                              n.read
                                ? "bg-white dark:bg-slate-900"
                                : "bg-teal-50/50 dark:bg-teal-950/20"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {n.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login/Register */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00494B] text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#00494B] dark:text-teal-400 uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-xs font-semibold text-slate-500">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">
                        {user?.email}
                      </p>
                    </div>

                    {isOrganizer ? (
                      <>
                        <Link
                          href="/organizer/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#00494B] dark:text-teal-400" />
                          Organizer Dashboard
                        </Link>
                        <Link
                          href="/organizer/create-event"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-600" />
                          Create New Event
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/volunteer/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#00494B] dark:text-teal-400" />
                          Volunteer Hub
                        </Link>
                        <Link
                          href="/volunteer/my-events"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Calendar className="w-4 h-4 text-teal-600" />
                          My Registrations
                        </Link>
                        <Link
                          href="/volunteer/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <UserIcon className="w-4 h-4 text-blue-600" />
                          Volunteer Profile
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-teal-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-[#00494B] hover:bg-[#003739] rounded-xl shadow-md shadow-[#00494B]/20 transition-all hover:scale-[1.02]"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore Events
          </Link>

          {isOrganizer && (
            <>
              <Link
                href="/organizer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Organizer Dashboard
              </Link>
              <Link
                href="/organizer/create-event"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                + Create Event
              </Link>
              <Link
                href="/organizer/events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Manage Events
              </Link>
              <Link
                href="/organizer/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Analytics
              </Link>
            </>
          )}

          {isVolunteer && (
            <>
              <Link
                href="/volunteer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Volunteer Hub
              </Link>
              <Link
                href="/volunteer/my-events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Registered Events
              </Link>
              <Link
                href="/volunteer/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Saved Favorites
              </Link>
              <Link
                href="/volunteer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                My Profile
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
