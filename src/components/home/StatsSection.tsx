import React from "react";
import { Users, Calendar, Award, Sparkles } from "lucide-react";

export const StatsSection: React.FC = () => {
  const stats = [
    {
      label: "Passionate Volunteers",
      value: "2,500+",
      icon: Users,
      desc: "Ready to take action in local communities",
    },
    {
      label: "Community Events",
      value: "180+",
      icon: Calendar,
      desc: "Organized across multiple cities",
    },
    {
      label: "Impact Hours",
      value: "12,400+",
      icon: Award,
      desc: "Dedicated to social good and conservation",
    },
    {
      label: "Available Opportunities",
      value: "100%",
      icon: Sparkles,
      desc: "Real-time live registration slots",
    },
  ];

  return (
    <section className="py-12 bg-slate-50 dark:bg-[#002224] border-y border-slate-200/80 dark:border-teal-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center sm:items-start text-center sm:text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-center text-[#00494B] dark:text-teal-300 mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-teal-200 mt-1">
                  {stat.label}
                </div>
                <p className="text-xs text-slate-500 dark:text-teal-300/70 mt-1">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

