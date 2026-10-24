"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../context/AuthContext";
import { api } from "../../../../services/api";
import { Registration, EventItem } from "../../../../types";
import {
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Loader2,
  Mail,
  Award,
  Filter,
} from "lucide-react";

function EventVolunteersContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isOrganizer, loading: authLoading } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isOrganizer) {
      router.push("/login");
    }
  }, [authLoading, isOrganizer, router]);

  const fetchData = async () => {
    try {
      const [eventRes, regRes] = await Promise.all([
        api.getEvent(id),
        api.getEventRegistrations(id),
      ]);

      if (eventRes.success && eventRes.event) {
        setEvent(eventRes.event);
      }
      if (regRes.success && regRes.registrations) {
        setRegistrations(regRes.registrations);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load volunteer roster." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOrganizer && id) {
      fetchData();
    }
  }, [isOrganizer, id]);

  const handleStatusChange = async (regId: string, newStatus: string) => {
    setUpdatingId(regId);
    try {
      const res = await api.updateRegistrationStatus(regId, newStatus);
      if (res.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r._id === regId ? { ...r, status: newStatus as any } : r))
        );
        setMessage({
          type: "success",
          text: `Volunteer status updated to ${newStatus}. Notification dispatched in real-time.`,
        });
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update status." });
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Loading volunteer roster...
        </p>
      </div>
    );
  }

  const filteredRegistrations = registrations.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  const statusColors: Record<string, string> = {
    registered: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
    confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
    attended: "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
    cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
  };

  return (
    <div className="min-h-screen py-10 bg-[#f8fafc] dark:bg-[#00191a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/organizer/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00494B] dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Events</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs font-bold text-[#00494B] dark:text-teal-400 uppercase tracking-wider mb-2">
              Volunteer Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {event?.title || "Event Volunteers"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {registrations.length} Total Registered Volunteers | Max Capacity: {event?.maxCapacity}
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses ({registrations.length})</option>
              <option value="registered">Registered</option>
              <option value="confirmed">Confirmed</option>
              <option value="attended">Attended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-bold ${
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Volunteers Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          {filteredRegistrations.length === 0 ? (
            <div className="p-16 text-center text-slate-500 space-y-3">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No volunteers found in this status
              </h3>
              <p className="text-xs text-slate-500">
                When volunteers sign up for this event, they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="py-4 px-6">Volunteer Name</th>
                    <th className="py-4 px-4">Email</th>
                    <th className="py-4 px-4">Registration Date</th>
                    <th className="py-4 px-4">Selected Skill</th>
                    <th className="py-4 px-4">Participation Status</th>
                    <th className="py-4 px-6 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRegistrations.map((reg) => {
                    const formattedDate = new Date(reg.registeredAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );
                    const isUpdating = updatingId === reg._id;

                    return (
                      <tr
                        key={reg._id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#00494B] dark:text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-200 dark:border-teal-800">
                              {reg.volunteer?.name?.charAt(0).toUpperCase() || "V"}
                            </div>
                            <span>{reg.volunteer?.name || "Unknown Volunteer"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {reg.volunteer?.email}
                        </td>
                        <td className="py-4 px-4 text-slate-500">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#00494B] dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                            {reg.selectedSkill}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              statusColors[reg.status] || "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            {isUpdating ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#00494B]" />
                            ) : (
                              <select
                                value={reg.status}
                                onChange={(e) =>
                                  handleStatusChange(reg._id, e.target.value)
                                }
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                              >
                                <option value="registered">Registered</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="attended">Attended</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            )}
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

export default function EventVolunteersPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
          <p className="text-sm font-semibold text-slate-500">
            Loading roster...
          </p>
        </div>
      }
    >
      <EventVolunteersContent />
    </React.Suspense>
  );
}
