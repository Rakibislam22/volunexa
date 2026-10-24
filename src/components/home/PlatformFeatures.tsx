"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Sparkles,
  QrCode,
  ShieldCheck,
  BarChart3,
  Bell,
  Clock,
  ArrowRight,
  Layers,
  Zap,
} from "lucide-react";

export const PlatformFeatures: React.FC = () => {
  const features = [
    {
      title: "Real-time Live Seat Sync",
      desc: "Socket.io integration broadcasts seat updates the instant a volunteer registers or cancels, eliminating duplicate bookings and stale counts.",
      icon: Activity,
      tag: "WebSocket Powered",
      color: "teal",
    },
    {
      title: "Gemini AI Event Assistant",
      desc: "Event organizers can draft compelling descriptions, schedules, safety guidelines, and required skill sets in seconds using Google Gemini AI.",
      icon: Sparkles,
      tag: "AI Assisted",
      color: "rose",
    },
    {
      title: "Digital QR Code Check-in",
      desc: "Every registration generates a secure digital QR code pass that organizers can scan at the event gate for frictionless, verified check-in.",
      icon: QrCode,
      tag: "Contactless Pass",
      color: "amber",
    },
    {
      title: "Status Workflow & Attendance",
      desc: "Organizers transition participants through structured stages (Registered → Confirmed → Attended), keeping rosters organized and transparent.",
      icon: ShieldCheck,
      tag: "Roster Management",
      color: "emerald",
    },
    {
      title: "Visual Impact & Analytics",
      desc: "Interactive Recharts data visualizations highlight monthly participation, category distribution, and total community impact hours.",
      icon: BarChart3,
      tag: "Data Driven",
      color: "blue",
    },
    {
      title: "Instant In-App Toast Alerts",
      desc: "Live server push notifications alert organizers and volunteers immediately with audible pings and clickable event links upon changes.",
      icon: Bell,
      tag: "Live Alerts",
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "rose":
        return {
          iconBg: "bg-rose-50 dark:bg-rose-950/50 text-[#FF4B72] dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40",
          tag: "bg-rose-50 dark:bg-rose-950/50 text-[#FF4B72] dark:text-rose-300 border-rose-200 dark:border-rose-900/50",
        };
      case "amber":
        return {
          iconBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
          tag: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
        };
      case "emerald":
        return {
          iconBg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
          tag: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
        };
      case "blue":
        return {
          iconBg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40",
          tag: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-900/50",
        };
      case "purple":
        return {
          iconBg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/40",
          tag: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
        };
      case "teal":
      default:
        return {
          iconBg: "bg-teal-50 dark:bg-teal-950/50 text-[#00494B] dark:text-teal-300 border-teal-200/60 dark:border-teal-900/40",
          tag: "bg-teal-50 dark:bg-teal-950/50 text-[#00494B] dark:text-teal-300 border-teal-200 dark:border-teal-900/50",
        };
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-[#00191a] transition-colors relative overflow-hidden">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-500/5 dark:bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-xs font-bold text-[#00494B] dark:text-teal-300 uppercase tracking-wider mb-3 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Built for Modern Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Advanced Features That Set Volunexa Apart
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-teal-200/80 leading-relaxed">
            Everything organizers need to orchestrate unforgettable initiatives, and everything
            volunteers need to participate with absolute confidence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const style = getColorClasses(feat.color);

            return (
              <div
                key={idx}
                className="group p-8 rounded-3xl bg-slate-50/70 dark:bg-[#002225] border border-slate-200/90 dark:border-teal-900/60 hover:border-teal-500/50 dark:hover:border-teal-400/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${style.iconBg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${style.tag}`}
                    >
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-[#00494B] dark:group-hover:text-teal-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-teal-900/50 flex items-center gap-1.5 text-xs font-bold text-[#00494B] dark:text-teal-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore in platform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
