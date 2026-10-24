"use client";

import React, { useState, useEffect } from "react";
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
  Trash2,
  CheckCheck,
  ExternalLink,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isOrganizer, isVolunteer } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    notifications,
    unreadCount,
    activeToast,
    dismissToast,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    pushPermission,
    requestPushPermission,
    isConnected,
  } = useSocket();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "Recent";
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "backdrop-blur-md bg-white/95 dark:bg-[#00191a]/95 border-b border-slate-200/80 dark:border-teal-900/40 shadow-sm"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#00494B] flex items-center justify-center text-white shadow-md shadow-[#00494B]/20 group-hover:scale-105 transition-transform shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#00494B] dark:text-white leading-tight">
                VOLUNEXA
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-slate-500 dark:text-teal-300 -mt-0.5 sm:-mt-1">
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
                  ? "text-[#00494B] dark:text-teal-300 bg-teal-50 dark:bg-white/10"
                  : "text-slate-600 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/events")
                  ? "text-[#00494B] dark:text-teal-300 bg-teal-50 dark:bg-white/10"
                  : "text-slate-600 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white"
              }`}
            >
              Explore Events
            </Link>

            {mounted && isOrganizer && (
              <>
                <Link
                  href="/organizer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/organizer/dashboard")
                      ? "text-[#00494B] dark:text-teal-300 bg-teal-50 dark:bg-white/10"
                      : "text-slate-600 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/organizer/events"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/organizer/events")
                      ? "text-[#00494B] dark:text-teal-300 bg-teal-50 dark:bg-white/10"
                      : "text-slate-600 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white"
                  }`}
                >
                  Manage Events
                </Link>
                <Link
                  href="/organizer/analytics"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/organizer/analytics")
                      ? "text-[#00494B] dark:text-teal-300 bg-teal-50 dark:bg-white/10"
                      : "text-slate-600 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white"
                  }`}
                >
                  Analytics
                </Link>
              </>
            )}

            {mounted && isVolunteer && (
              <>
                <Link
                  href="/volunteer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/volunteer/dashboard")
                      ? "text-[#00494B] dark:text-teal-300 bg-teal-50 dark:bg-white/10"
                      : "text-slate-600 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white"
                  }`}
                >
                  My Hub
                </Link>
                <Link
                  href="/volunteer/my-events"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/volunteer/my-events")
                      ? "text-[#00494B] dark:text-teal-300 bg-teal-50 dark:bg-white/10"
                      : "text-slate-600 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white"
                  }`}
                >
                  Registered Events
                </Link>
                <Link
                  href="/volunteer/favorites"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pathname.startsWith("/volunteer/favorites")
                      ? "text-[#00494B] dark:text-teal-300 bg-teal-50 dark:bg-white/10"
                      : "text-slate-600 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white"
                  }`}
                >
                  Favorites
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Realtime Live Pulse Badge */}
            <div
              title={mounted && isConnected ? "Realtime connected" : "Connecting realtime..."}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            >
              <span className={`w-2 h-2 rounded-full ${mounted && isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              <span>Live</span>
            </div>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              )}
            </button>

            {/* Realtime Notifications Dropdown */}
            {mounted && isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    if (!notifDropdownOpen && unreadCount > 0) {
                      markAllAsRead();
                    }
                  }}
                  className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4B72] text-[10px] font-bold text-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Menu */}
                {notifDropdownOpen && (
                  <div className="fixed sm:absolute top-16 sm:top-auto sm:right-0 inset-x-3 sm:inset-auto sm:mt-2 sm:w-96 rounded-2xl bg-white dark:bg-[#002528] shadow-2xl border border-slate-200 dark:border-teal-900/40 overflow-hidden z-50">
                    <div className="p-3.5 bg-slate-50 dark:bg-[#001f21] border-b border-slate-200 dark:border-teal-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#00494B] dark:text-teal-400" />
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          Notifications
                        </h4>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#FF4B72] text-white">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead()}
                            title="Mark all as read"
                            className="p-1 text-xs text-teal-600 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-200 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Mark read</span>
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={() => clearNotifications()}
                            title="Clear all notifications"
                            className="p-1 text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Desktop Push Banner */}
                    {pushPermission === "default" && (
                      <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/30 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🔔</span>
                          <div className="text-[11px] text-teal-900 dark:text-teal-200 leading-tight">
                            <span className="font-semibold block">Enable Desktop Push</span>
                            Get alerts even when browser is in background
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            await requestPushPermission();
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#00494B] hover:bg-[#003739] rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                        >
                          Enable
                        </button>
                      </div>
                    )}

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-teal-900/20">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                          <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-teal-900/50 mb-2" />
                          No notifications yet.
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Real-time server events will appear here!
                          </p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`p-3.5 transition-colors group relative ${
                              n.isRead
                                ? "bg-white dark:bg-[#002528] opacity-75"
                                : "bg-teal-50/40 dark:bg-teal-950/20 font-medium"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    n.type === "success"
                                      ? "bg-emerald-500"
                                      : n.type === "warning"
                                      ? "bg-amber-500"
                                      : n.type === "alert"
                                      ? "bg-rose-500"
                                      : "bg-teal-500"
                                  }`}
                                />
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                  {n.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] text-slate-400 dark:text-teal-300/60">
                                  {formatTimeAgo(n.createdAt)}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(n._id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 pr-4">
                              {n.message}
                            </p>
                            {n.relatedEvent?._id && (
                              <Link
                                href={`/events/${n.relatedEvent._id}`}
                                onClick={() => setNotifDropdownOpen(false)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00494B] dark:text-teal-300 hover:underline mt-1.5"
                              >
                                View Event <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login/Register */}
            {mounted && isAuthenticated ? (
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
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/login"
                  className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00494B] dark:hover:text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#00494B] hover:bg-[#003739] border border-teal-500/30 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md shadow-[#00494B]/20 transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-0.5 sm:ml-1 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 border-b border-slate-200 dark:border-teal-900/50 bg-white dark:bg-[#00191a] space-y-1">
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

          {mounted && isOrganizer && (
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

          {mounted && isVolunteer && (
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

          {/* Mobile Drawer Auth Buttons for Guests */}
          {mounted && !isAuthenticated && (
            <div className="pt-3 mt-3 border-t border-slate-200/80 dark:border-teal-900/40 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 dark:border-teal-900/60 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-[#00494B] text-white text-xs font-bold shadow-md hover:bg-[#003739] text-center transition-colors"
              >
                Join Us
              </Link>
            </div>
          )}

          {/* Mobile Drawer Profile & Logout for Authenticated */}
          {mounted && isAuthenticated && (
            <div className="pt-3 mt-3 border-t border-slate-200/80 dark:border-teal-900/40">
              <div className="px-3 py-2 flex items-center gap-2.5 mb-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#00494B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">
                    {user?.name}
                  </span>
                  <span className="text-[10px] font-semibold text-[#00494B] dark:text-teal-400 uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Real-time Server Push In-App Toast Alert */}
      {activeToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-[9999] max-w-sm w-full bg-white dark:bg-[#002528] rounded-2xl shadow-2xl border border-teal-500/40 p-4 transition-all duration-300">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                activeToast.type === "success"
                  ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400"
                  : activeToast.type === "warning"
                  ? "bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400"
                  : activeToast.type === "alert"
                  ? "bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400"
                  : "bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400"
              }`}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {activeToast.title}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                {activeToast.message}
              </p>
              {activeToast.relatedEvent?._id && (
                <Link
                  href={`/events/${activeToast.relatedEvent._id}`}
                  onClick={dismissToast}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00494B] dark:text-teal-300 hover:underline mt-1.5"
                >
                  View Details &rarr;
                </Link>
              )}
            </div>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

