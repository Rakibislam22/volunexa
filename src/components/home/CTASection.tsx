import React from "react";
import Link from "next/link";
import { Users, CalendarPlus, Sparkles, ArrowRight } from "lucide-react";

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#00383a] via-[#00494B] to-[#002829] text-white relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Volunteer Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between h-full shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-5">
                <Users className="w-6 h-6 text-teal-300" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
                For Community Volunteers
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 mb-3">
                Discover Opportunities That Match Your Skills
              </h3>
              <p className="text-sm text-teal-100/80 leading-relaxed mb-6">
                Find local initiatives in environmental conservation, education,
                health camps, and tech. Register in one click with live seat tracking
                and get an official digital check-in QR pass.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#00494B] hover:bg-teal-50 font-bold text-sm shadow-lg transition-transform hover:scale-[1.02]"
            >
              <span>Join as Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Organizer Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-black/30 backdrop-blur-md border border-white/15 flex flex-col justify-between h-full shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF4B72]/20 border border-[#FF4B72]/40 flex items-center justify-center text-[#FF4B72] mb-5">
                <CalendarPlus className="w-6 h-6 text-[#FF4B72]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-300">
                For Event Organizers
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 mb-3">
                Manage Events & Volunteers Seamlessly
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Create events with capacity limits, automated deadline controls,
                volunteer status workflow (Registered → Confirmed → Attended),
                real-time roster updates, and Gemini AI description generation.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF4B72] hover:bg-[#e0385e] text-white font-bold text-sm shadow-lg shadow-[#FF4B72]/30 transition-transform hover:scale-[1.02]"
            >
              <span>Host an Event as Organizer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
