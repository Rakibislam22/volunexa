"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import { Registration, EventItem } from "../../../types";
import { EventQRModal } from "../../../components/events/EventQRModal";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Heart,
  QrCode,
  ArrowRight,
  Loader2,
  Users,
  Compass,
  MapPin,
} from "lucide-react";

export default function VolunteerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isVolunteer } = useAuth();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQRReg, setSelectedQRReg] = useState<Registration | null>(null);

  useEffect(() => {
    if (!authLoading && !isVolunteer) {
      router.push("/login");
    }
  }, [authLoading, isVolunteer, router]);

  const fetchData = async () => {
    try {
      const [regRes, statsRes] = await Promise.all([
        api.getMyRegistrations(),
        api.getVolunteerDashboardStats(),
      ]);

      if (regRes.success) setRegistrations(regRes.registrations || []);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVolunteer) {
      fetchData();
    }
  }, [isVolunteer]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Loading your volunteer hub...
        </p>
      </div>
    );
  }

  const [nowTime, setNowTime] = useState<number>(0);

  useEffect(() => {
    setNowTime(Date.now());
  }, []);

  const upcomingRegistrations = registrations.filter((r) => {
    const evt = r.event as EventItem;
    return evt && new Date(evt.date).getTime() >= nowTime && r.status !== "cancelled";
  });

  return (
    <div className="min-h-screen py-10 bg-[#f8fafc] dark:bg-[#00191a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs font-bold text-[#00494B] dark:text-teal-400 uppercase tracking-wider mb-2">
              Volunteer Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Hello, {user?.name} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ready to make a difference? Here is your upcoming community participation.
            </p>
          </div>

          <Link
            href="/events"
            className="px-5 py-2.5 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-bold shadow-md shadow-[#00494B]/20 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-[1.02]"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Events</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#00494B] dark:text-teal-400 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats?.totalRegistrations || 0}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1">
              Total Registrations
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats?.upcomingRegistrations || 0}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1">
              Upcoming Events
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats?.completedRegistrations || 0}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1">
              Attended Events
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Active
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1">
              Volunteer Status
            </div>
          </div>
        </div>

        {/* Upcoming Registered Events */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Your Upcoming Events
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Events you are registered to participate in
              </p>
            </div>
            <Link
              href="/volunteer/my-events"
              className="text-xs font-bold text-[#00494B] dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View All My Registrations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingRegistrations.length === 0 ? (
            <div className="p-10 text-center text-slate-500 space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                You have no upcoming event registrations
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Discover volunteer opportunities in your city and register to help!
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00494B] text-white text-xs font-bold"
              >
                Explore Events Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingRegistrations.map((reg) => {
                const evt = reg.event as EventItem;
                if (!evt) return null;

                const formattedDate = new Date(evt.date).toLocaleDateString(
                  "en-US",
                  { weekday: "short", month: "short", day: "numeric" }
                );

                return (
                  <div
                    key={reg._id}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                          {evt.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            reg.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>

                      <Link href={`/events/${evt._id}`}>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white hover:text-[#00494B] dark:hover:text-teal-400 line-clamp-1">
                          {evt.title}
                        </h4>
                      </Link>

                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <MapPin className="w-3.5 h-3.5" />
                          {evt.location}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                        Role: <strong className="text-[#00494B] dark:text-teal-300">{reg.selectedSkill}</strong>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedQRReg(reg)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Check-in QR</span>
                      </button>

                      <Link
                        href={`/events/${evt._id}`}
                        className="text-xs font-bold text-[#00494B] dark:text-teal-400 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedQRReg && (
        <EventQRModal
          isOpen={!!selectedQRReg}
          onClose={() => setSelectedQRReg(null)}
          eventTitle={(selectedQRReg.event as EventItem)?.title || "Event"}
          volunteerName={user?.name || "Volunteer"}
          registrationId={selectedQRReg._id}
          status={selectedQRReg.status}
        />
      )}
    </div>
  );
}
