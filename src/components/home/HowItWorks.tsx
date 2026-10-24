"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  QrCode,
  Award,
  Sparkles,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"volunteer" | "organizer">("volunteer");

  const volunteerSteps = [
    {
      step: "01",
      title: "Discover Nearby Events",
      desc: "Explore verified community drives, cleanups, blood donation camps, and educational workshops tailored to your city and passions.",
      icon: Compass,
      badge: "Real-time Discovery",
      highlight: "Filter by location, category, or real-time available seats.",
    },
    {
      step: "02",
      title: "1-Click Registration & Instant QR Pass",
      desc: "Sign up instantly with your volunteer profile, select your skills, and receive an official digital QR check-in pass directly on your device.",
      icon: QrCode,
      badge: "Contactless Pass",
      highlight: "No paperwork. Instant live seat reservation with zero latency.",
    },
    {
      step: "03",
      title: "Participate & Verify Impact",
      desc: "Show your QR pass at the event gate for check-in. Track your confirmed attendance, impact hours, and build a verified volunteer record.",
      icon: Award,
      badge: "Verified Attendance",
      highlight: "Earn recognized community service hours and leadership badges.",
    },
  ];

  const organizerSteps = [
    {
      step: "01",
      title: "Create Events with Gemini AI",
      desc: "Describe your initiative in a few words and let Google Gemini AI draft compelling descriptions, schedules, and recommended volunteer skills.",
      icon: Sparkles,
      badge: "AI-Powered",
      highlight: "Generate rich agendas and role requirements in seconds.",
    },
    {
      step: "02",
      title: "Live Capacity & Seat Guards",
      desc: "Set volunteer seat limits and registration deadlines. Volunexa automatically locks slots when full and updates rosters in real-time via WebSockets.",
      icon: Users,
      badge: "Socket.io Sync",
      highlight: "Zero double-booking with instant seat availability counts.",
    },
    {
      step: "03",
      title: "Scan QR & Review Analytics",
      desc: "Verify attendees with the digital QR code scanner, update attendance statuses (Registered → Confirmed → Attended), and inspect visual impact charts.",
      icon: BarChart3,
      badge: "Attendance Workflow",
      highlight: "Complete volunteer roster export and engagement metrics.",
    },
  ];

  const currentSteps = activeTab === "volunteer" ? volunteerSteps : organizerSteps;

  return (
    <section className="py-20 bg-slate-50/70 dark:bg-[#001c1e] border-y border-slate-200/80 dark:border-teal-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-xs font-bold text-[#00494B] dark:text-teal-300 uppercase tracking-wider mb-3 shadow-xs">
            <CalendarCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Seamless Platform Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            How Volunexa Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-teal-200/80 leading-relaxed">
            Whether you want to serve local communities or coordinate high-impact initiatives,
            Volunexa makes every step effortless with real-time tools.
          </p>

          {/* Role Toggle Selector */}
          <div className="inline-flex p-1.5 mt-8 rounded-2xl bg-slate-200/70 dark:bg-[#00292c] border border-slate-300/80 dark:border-teal-800/60">
            <button
              onClick={() => setActiveTab("volunteer")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "volunteer"
                  ? "bg-[#00494B] text-white shadow-md shadow-[#00494B]/25"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>For Volunteers</span>
            </button>
            <button
              onClick={() => setActiveTab("organizer")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "organizer"
                  ? "bg-[#00494B] text-white shadow-md shadow-[#00494B]/25"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>For Event Organizers</span>
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {currentSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative group p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#002528] border border-slate-200/90 dark:border-teal-900/60 shadow-sm hover:shadow-xl hover:border-teal-500/50 dark:hover:border-teal-400/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Step Top */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 dark:text-teal-900/60 group-hover:text-[#00494B]/40 dark:group-hover:text-teal-400/40 transition-colors">
                      {step.step}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-[#00494B] dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-[#003135] text-[#00494B] dark:text-teal-300 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-[#00494B] dark:group-hover:text-teal-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                {/* Step Highlight Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-teal-900/50 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-500 dark:text-teal-300/80 font-medium leading-snug">
                    {step.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Banner */}
        <div className="mt-12 text-center">
          <Link
            href={activeTab === "volunteer" ? "/events" : "/register"}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00494B] hover:bg-[#003739] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#00494B]/20 transition-all hover:scale-[1.02]"
          >
            <span>
              {activeTab === "volunteer" ? "Explore Available Events Now" : "Register as an Organizer"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
