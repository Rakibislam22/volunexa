"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import { getSocket } from "../../../services/socket";
import { EventItem, DashboardStats } from "../../../types";
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  Radio,
} from "lucide-react";

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isOrganizer } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveAlert, setLiveAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isOrganizer) {
      router.push("/login");
    }
  }, [authLoading, isOrganizer, router]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        setUpcomingEvents(res.upcomingEventsList || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOrganizer) {
      fetchDashboardData();

      const socket = getSocket();
      if (!socket) return;

      // Listen for registration updates to refresh stats
      const handleNewReg = (reg: any) => {
        setLiveAlert(`New registration: ${reg.volunteer?.name} for "${reg.event?.title}"`);
        fetchDashboardData();
        setTimeout(() => setLiveAlert(null), 6000);
      };

      socket.on("registration:new", handleNewReg);

      return () => {
        socket.off("registration:new", handleNewReg);
      };
    }
  }, [isOrganizer]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Loading Organizer Dashboard...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      icon: Calendar,
      color: "bg-teal-50 text-[#00494B] dark:bg-teal-950/40 dark:text-teal-300",
    },
    {
      title: "Upcoming Events",
      value: stats?.upcomingEvents || 0,
      icon: Clock,
      color: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    },
    {
      title: "Total Volunteers",
      value: stats?.totalVolunteers || 0,
      icon: Users,
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    {
      title: "Available Slots",
      value: stats?.availableSlots || 0,
      icon: Sparkles,
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    },
    {
      title: "Completed Events",
      value: stats?.completedEvents || 0,
      icon: CheckCircle2,
      color: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    },
  ];

  return (
    <div className="min-h-screen py-10 bg-slate-50/50 dark:bg-[#070c10] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Banner Notification */}
        {liveAlert && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500 text-white shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Radio className="w-5 h-5 animate-pulse" />
              <span>{liveAlert}</span>
            </div>
            <button
              onClick={() => setLiveAlert(null)}
              className="text-xs uppercase tracking-wider font-bold opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs font-bold text-[#00494B] dark:text-teal-400 uppercase tracking-wider mb-2">
              Organizer Control Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome, {user?.name || "Organizer"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Overview of your community events, volunteer registrations, and capacity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/organizer/analytics"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/organizer/create-event"
              className="px-5 py-2.5 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-bold shadow-md shadow-[#00494B]/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* 5 Stats Cards (Project Requirement) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {card.value}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                    {card.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Events Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Upcoming Events & Volunteer Capacity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live monitoring of registered volunteers and remaining capacity
              </p>
            </div>
            <Link
              href="/organizer/events"
              className="text-xs font-bold text-[#00494B] dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-medium">No upcoming events found</p>
              <Link
                href="/organizer/create-event"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00494B] text-white text-xs font-bold"
              >
                + Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-6">Event Title</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Capacity Utilization</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {upcomingEvents.map((evt) => {
                    const available = Math.max(0, evt.maxCapacity - evt.registeredCount);
                    const percent = Math.min(
                      100,
                      Math.round((evt.registeredCount / evt.maxCapacity) * 100)
                    );
                    const formattedDate = new Date(evt.date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    );

                    return (
                      <tr
                        key={evt._id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                          <Link
                            href={`/events/${evt._id}`}
                            className="hover:text-[#00494B] dark:hover:text-teal-400"
                          >
                            {evt.title}
                          </Link>
                          <div className="text-[11px] font-normal text-slate-400 truncate max-w-xs">
                            {evt.location}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {evt.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="w-36">
                            <div className="flex justify-between text-[11px] font-semibold mb-1">
                              <span>
                                {evt.registeredCount}/{evt.maxCapacity}
                              </span>
                              <span className={available <= 3 ? "text-amber-500 font-bold" : "text-slate-500"}>
                                {available} left
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#00494B] h-full rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              evt.status === "published"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : evt.status === "closed"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {evt.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/organizer/volunteers/${evt._id}`}
                              className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#00494B] dark:text-teal-300 font-bold hover:bg-teal-100 transition-colors"
                            >
                              Volunteers
                            </Link>
                            <Link
                              href={`/events/${evt._id}`}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

