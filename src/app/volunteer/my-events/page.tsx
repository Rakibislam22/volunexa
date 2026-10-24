"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { api } from "../../../services/api";
import { Registration, EventItem } from "../../../types";
import { EventQRModal } from "../../../components/events/EventQRModal";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  QrCode,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Compass,
} from "lucide-react";

export default function MyEventsPage() {
  const router = useRouter();
  const { user, isVolunteer, loading: authLoading } = useAuth();
  const { showConfirm } = useModal();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedQRReg, setSelectedQRReg] = useState<Registration | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [nowTime, setNowTime] = useState<number>(0);

  useEffect(() => {
    setNowTime(Date.now());
  }, []);

  useEffect(() => {
    if (!authLoading && !isVolunteer) {
      router.push("/login");
    }
  }, [authLoading, isVolunteer, router]);

  const fetchRegistrations = async () => {
    try {
      const res = await api.getMyRegistrations();
      if (res.success && res.registrations) {
        setRegistrations(res.registrations);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load registrations." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVolunteer) {
      fetchRegistrations();
    }
  }, [isVolunteer]);

  const handleCancelRegistration = (regId: string, eventTitle: string) => {
    showConfirm({
      title: "Cancel Registration?",
      message: `Are you sure you want to cancel your registration for "${eventTitle}"? This will free up your volunteer slot for others.`,
      type: "warning",
      confirmText: "Yes, Cancel Registration",
      cancelText: "Keep My Spot",
      onConfirm: async () => {
        setCancellingId(regId);
        try {
          const res = await api.cancelRegistration(regId);
          if (res.success) {
            setRegistrations((prev) =>
              prev.map((r) => (r._id === regId ? { ...r, status: "cancelled" } : r))
            );
            setMessage({
              type: "success",
              text: "Registration cancelled. The available slot was returned in real-time.",
            });
          }
        } catch (err: any) {
          setMessage({
            type: "error",
            text: err.message || "Failed to cancel registration.",
          });
        } finally {
          setCancellingId(null);
        }
      },
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Loading your registered events...
        </p>
      </div>
    );
  }

  const upcomingList = registrations.filter((r) => {
    const evt = r.event as EventItem;
    if (!evt || !evt.date) return false;
    return new Date(evt.date).getTime() >= (nowTime || 0);
  });

  const pastList = registrations.filter((r) => {
    const evt = r.event as EventItem;
    if (!evt || !evt.date) return false;
    return new Date(evt.date).getTime() < (nowTime || 0);
  });

  const displayedList = tab === "upcoming" ? upcomingList : pastList;

  const statusBadge: Record<string, string> = {
    registered: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
    confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    attended: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
    cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
  };

  return (
    <div className="min-h-screen py-10 bg-[#f8fafc] dark:bg-[#00191a] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/volunteer/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00494B] dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Volunteer Hub</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Registered Events
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track your volunteer participation, status, check-in QR passes, and cancellation
            </p>
          </div>

          <Link
            href="/events"
            className="px-4 py-2 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Compass className="w-4 h-4" />
            <span>Browse More Events</span>
          </Link>
        </div>

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

        {/* Tabs: Upcoming vs Past */}
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 w-fit shadow-sm">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "upcoming"
                ? "bg-[#00494B] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Upcoming Events ({upcomingList.length})
          </button>
          <button
            onClick={() => setTab("past")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "past"
                ? "bg-[#00494B] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Past Events ({pastList.length})
          </button>
        </div>

        {/* Events List */}
        {displayedList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-16 text-center text-slate-500 shadow-sm space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No {tab} registrations found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {tab === "upcoming"
                ? "You haven't registered for any upcoming events yet. Discover opportunities now!"
                : "No past events recorded in your participation history."}
            </p>
            {tab === "upcoming" && (
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00494B] text-white text-xs font-bold shadow-md hover:bg-[#00383a]"
              >
                Browse Community Events
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedList.map((reg) => {
              const evt = reg.event as EventItem;
              if (!evt) return null;

              const eventDate = evt.date ? new Date(evt.date) : new Date(0);
              const formattedDate = evt.date
                ? eventDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "TBD";
              const isPast = eventDate.getTime() < nowTime;
              const isCancelled = reg.status === "cancelled";
              const isBusy = cancellingId === reg._id;

              return (
                <div
                  key={reg._id}
                  className={`p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm transition-all ${
                    isCancelled
                      ? "opacity-60 border-slate-200 dark:border-slate-800"
                      : "border-slate-200/90 dark:border-slate-800 hover:border-teal-500/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {evt.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            statusBadge[reg.status] || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>

                      <Link href={`/events/${evt._id}`}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-[#00494B] dark:hover:text-teal-400 transition-colors">
                          {evt.title}
                        </h3>
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-[#00494B] dark:text-teal-400" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1.5 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {evt.location}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span>Assigned Skill / Role:</span>
                        <span className="font-bold text-[#00494B] dark:text-teal-300 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                          {reg.selectedSkill}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap sm:flex-col items-end gap-2 pt-2 sm:pt-0">
                      {!isCancelled && (
                        <button
                          onClick={() => setSelectedQRReg(reg)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Check-in QR Pass</span>
                        </button>
                      )}

                      <Link
                        href={`/events/${evt._id}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        View Details
                      </Link>

                      {!isPast && !isCancelled && (
                        <button
                          onClick={() => handleCancelRegistration(reg._id, evt.title)}
                          disabled={isBusy}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                        >
                          {isBusy ? "Cancelling..." : "Cancel Registration"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
