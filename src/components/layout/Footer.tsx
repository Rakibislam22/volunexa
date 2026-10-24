import React from "react";
import Link from "next/link";
import { Calendar, Heart, Shield, Users, Sparkles, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002829] text-slate-300 pt-16 pb-10 border-t border-teal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-teal-900/60">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Calendar className="w-5 h-5 text-teal-300" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                VOLUNEXA
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering communities through impactful events and volunteer
              connections. Designed for passionate organizers and dedicated volunteers
              with real-time updates and AI assistance.
            </p>
            <div className="flex items-center gap-4 text-xs text-teal-300/80 pt-2">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-400" /> Role Protected
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" /> AI Powered
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-400" /> Real-time Live
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-teal-300 transition-colors"
                >
                  All Community Events
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=environment"
                  className="hover:text-teal-300 transition-colors"
                >
                  Environment & Nature
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=education"
                  className="hover:text-teal-300 transition-colors"
                >
                  Education & Mentoring
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=health"
                  className="hover:text-teal-300 transition-colors"
                >
                  Health & Medical Camps
                </Link>
              </li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Get Involved
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/register"
                  className="hover:text-teal-300 transition-colors"
                >
                  Volunteer Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-teal-300 transition-colors"
                >
                  Host as Organizer
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-teal-300 transition-colors"
                >
                  Sign In to Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-teal-300 transition-colors"
                >
                  Check Available Slots
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Info */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Dhaka & Chittagong, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>contact@volunexa.org</span>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-950/80 border border-teal-800 text-xs text-teal-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Platform v1.0
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2025-2026 Volunexa Platform. Built with Next.js, TypeScript & Express.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-[#FF4B72] fill-[#FF4B72]" /> for community change
          </p>
        </div>
      </div>
    </footer>
  );
};
