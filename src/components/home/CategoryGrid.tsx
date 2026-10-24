import React from "react";
import Link from "next/link";
import {
  Trees,
  GraduationCap,
  HeartPulse,
  Users2,
  Cpu,
  Trophy,
  Palette,
  HandHeart,
  ArrowRight,
} from "lucide-react";

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      name: "Environment",
      key: "environment",
      icon: Trees,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description: "Cleanups, plantation, and wildlife conservation",
    },
    {
      name: "Education",
      key: "education",
      icon: GraduationCap,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      description: "Tutoring, mentorship, and youth workshops",
    },
    {
      name: "Health",
      key: "health",
      icon: HeartPulse,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      description: "Blood camps, medical checkups, and awareness",
    },
    {
      name: "Community",
      key: "community",
      icon: Users2,
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      description: "Local neighborhood support and social drives",
    },
    {
      name: "Technology",
      key: "technology",
      icon: Cpu,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      description: "Coding bootcamps, digital literacy, and IT aid",
    },
    {
      name: "Sports",
      key: "sports",
      icon: Trophy,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      description: "Marathons, tournaments, and fitness camps",
    },
    {
      name: "Arts & Culture",
      key: "arts",
      icon: Palette,
      color: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
      description: "Exhibitions, stage performances, and creative arts",
    },
    {
      name: "Charity & Relief",
      key: "charity",
      icon: HandHeart,
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      description: "Food distribution, disaster relief, and donations",
    },
  ];

  return (
    <section className="py-20 bg-slate-50/50 dark:bg-[#070c10] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs font-bold text-[#00494B] dark:text-teal-400 uppercase tracking-wider mb-2">
              Popular Focus Areas
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/events"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#00494B] dark:text-teal-400 hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.key}
                href={`/events?category=${cat.key}`}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform ${cat.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#00494B] dark:group-hover:text-teal-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-[#00494B] dark:group-hover:text-teal-400">
                  <span>Browse events</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

