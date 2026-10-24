"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { api } from "../../../services/api";
import { EventItem } from "../../../types";
import {
  Calendar,
  PlusCircle,
  Users,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Eye,
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function ManageEventsPage() {
  const router = useRouter();
  const { isOrganizer, loading: authLoading } = useAuth();
  const { showConfirm } = useModal();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isOrganizer) {
      router.push("/login");
    }
  }, [authLoading, isOrganizer, router]);

  const fetchEvents = async () => {
    try {
      const res = await api.getOrganizerEvents();
      if (res.success && res.events) {
        setEvents(res.events);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load events." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOrganizer) {
      fetchEvents();
    }
  }, [isOrganizer]);

  const handleToggleStatus = async (eventId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "published" ? "closed" : "published";
    setActionLoading(eventId);
    try {
      const res = await api.updateEvent(eventId, { status: nextStatus });
      if (res.success) {
        setEvents((prev) =>
          prev.map((e) => (e._id === eventId ? { ...e, status: nextStatus as any } : e))
        );
        setMessage({
          type: "success",
          text: `Event status updated to ${nextStatus}.`,
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update status." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    showConfirm({
      title: "Delete Event?",
      message: `Are you sure you want to delete "${eventTitle}"? This will permanently remove the event and all volunteer registrations.`,
      type: "danger",
      confirmText: "Delete Event",
      cancelText: "Keep Event",
      onConfirm: async () => {
        setActionLoading(eventId);
        try {
          const res = await api.deleteEvent(eventId);
          if (res.success) {
            setEvents((prev) => prev.filter((e) => e._id !== eventId));
            setMessage({ type: "success", text: "Event successfully deleted." });
          }
        } catch (err: any) {
          setMessage({ type: "error", text: err.message || "Failed to delete event." });
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Loading your events...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-[#f8fafc] dark:bg-[#00191a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/organizer/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00494B] dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizer Dashboard</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Manage Events
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Edit, close registrations, or review volunteer rosters
            </p>
          </div>

          <Link
            href="/organizer/create-event"
            className="px-5 py-2.5 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-bold shadow-md shadow-[#00494B]/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* Notification Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Events Table / Card List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          {events.length === 0 ? (
            <div className="p-16 text-center text-slate-500 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                You haven&apos;t created any events yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Get started by creating your first community volunteering opportunity!
              </p>
              <Link
                href="/organizer/create-event"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00494B] text-white text-xs font-bold shadow-md hover:bg-[#00383a]"
              >
                + Create Event Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="py-4 px-6">Event</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Volunteers Registered</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {events.map((evt) => {
                    const formattedDate = new Date(evt.date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    );
                    const isBusy = actionLoading === evt._id;

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
                        <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {evt.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                            <Users className="w-3.5 h-3.5 text-[#00494B] dark:text-teal-400" />
                            <span>
                              {evt.registeredCount} / {evt.maxCapacity}
                            </span>
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
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Manage Volunteers */}
                            <Link
                              href={`/organizer/volunteers/${evt._id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#00494B] dark:text-teal-300 font-bold hover:bg-teal-100 transition-colors"
                              title="Manage Registered Volunteers"
                            >
                              Roster
                            </Link>

                            {/* View / Preview */}
                            <Link
                              href={`/events/${evt._id}`}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Preview Public Page"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Toggle Close / Open Registration */}
                            <button
                              onClick={() => handleToggleStatus(evt._id, evt.status)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title={
                                evt.status === "published"
                                  ? "Close Registrations"
                                  : "Re-open / Publish Registrations"
                              }
                            >
                              {evt.status === "published" ? (
                                <Lock className="w-4 h-4 text-amber-600" />
                              ) : (
                                <Unlock className="w-4 h-4 text-emerald-600" />
                              )}
                            </button>

                            {/* Delete Event */}
                            <button
                              onClick={() => handleDeleteEvent(evt._id, evt.title)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

