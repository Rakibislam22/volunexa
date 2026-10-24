"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EventItem, Registration } from "../../../types";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import {
  getSocket,
  joinEventRoom,
  leaveEventRoom,
} from "../../../services/socket";
import { EventShareModal } from "../../../components/events/EventShareModal";
import { EventQRModal } from "../../../components/events/EventQRModal";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Sparkles,
  Share2,
  Heart,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  QrCode,
  Tag,
  Edit,
  UserCheck,
} from "lucide-react";

function EventDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated, isOrganizer, isVolunteer } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Registration state
  const [isRegistered, setIsRegistered] = useState(false);
  const [myRegistration, setMyRegistration] = useState<Registration | null>(null);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch event details
  const fetchEventData = async () => {
    try {
      const res = await api.getEvent(id);
      if (res.success && res.event) {
        setEvent(res.event);
        if (res.event.requiredSkills && res.event.requiredSkills.length > 0) {
          setSelectedSkill(res.event.requiredSkills[0]);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  // Check volunteer registration status
  const checkVolunteerRegistration = async () => {
    if (isAuthenticated && isVolunteer) {
      try {
        const res = await api.checkRegistration(id);
        setIsRegistered(res.isRegistered);
        if (res.registration) {
          setMyRegistration(res.registration);
        }
      } catch (err) {
        console.error("Check registration error:", err);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventData();
      checkVolunteerRegistration();

      // Check favorite
      if (isAuthenticated) {
        api.checkFavorite(id).then((res) => setIsFavorited(res.isFavorited)).catch(() => {});
      }

      // Realtime Socket room subscription
      joinEventRoom(id);

      const socket = getSocket();
      const handleSlotUpdate = (data: {
        eventId: string;
        registeredCount: number;
        availableSlots: number;
      }) => {
        if (data.eventId === id) {
          setEvent((prev) =>
            prev
              ? {
                  ...prev,
                  registeredCount: data.registeredCount,
                  availableSlots: data.availableSlots,
                  isFull: data.availableSlots <= 0,
                }
              : null
          );
        }
      };

      const handleEventDetailsUpdate = (updatedEvent: EventItem) => {
        if (updatedEvent._id === id) {
          setEvent(updatedEvent);
        }
      };

      socket.on("slots:updated", handleSlotUpdate);
      socket.on("event:details:updated", handleEventDetailsUpdate);

      return () => {
        leaveEventRoom(id);
        socket.off("slots:updated", handleSlotUpdate);
        socket.off("event:details:updated", handleEventDetailsUpdate);
      };
    }
  }, [id, isAuthenticated, isVolunteer]);

  // Handle volunteer registration submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isVolunteer) {
      setRegMessage({
        type: "error",
        text: "Only volunteers can register for events. Organizers manage events.",
      });
      return;
    }

    if (!selectedSkill) {
      setRegMessage({
        type: "error",
        text: "Please select or specify a skill you will contribute.",
      });
      return;
    }

    setRegLoading(true);
    setRegMessage(null);

    try {
      const res = await api.registerForEvent({
        eventId: id,
        selectedSkill,
      });

      if (res.success) {
        setIsRegistered(true);
        setMyRegistration(res.registration);
        setRegMessage({
          type: "success",
          text: "Registration confirmed! You have successfully registered for this event.",
        });
      }
    } catch (err: any) {
      setRegMessage({
        type: "error",
        text: err.message || "Failed to register for the event.",
      });
    } finally {
      setRegLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Please log in to save events.");
      return;
    }
    try {
      const res = await api.toggleFavorite(id);
      setIsFavorited(res.isFavorited);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Loading event details...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Event Not Found
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          {error || "The event you are looking for does not exist or has been removed."}
        </p>
        <Link
          href="/events"
          className="px-5 py-2.5 rounded-xl bg-[#00494B] text-white text-xs font-bold"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const availableSlots =
    event.availableSlots !== undefined
      ? event.availableSlots
      : Math.max(0, event.maxCapacity - event.registeredCount);

  const isFull = availableSlots <= 0 || event.registeredCount >= event.maxCapacity;
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    if (event?.registrationDeadline) {
      setIsDeadlinePassed(new Date().getTime() > new Date(event.registrationDeadline).getTime());
    }
  }, [event?.registrationDeadline]);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedDeadline = new Date(event.registrationDeadline).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const isEventOwner =
    isOrganizer && user?._id && event.organizer && String(event.organizer._id) === String(user._id);

  return (
    <div className="min-h-screen py-10 bg-slate-50/50 dark:bg-[#070c10] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00494B] dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        {/* Hero Banner with Details */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md mb-8">
          <div
            className="h-64 sm:h-80 md:h-96 w-full bg-cover bg-center relative"
            style={{
              backgroundImage: event.image
                ? `url(${event.image})`
                : "url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Floating Top Controls */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
                {event.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 transition-colors"
                  title="Share event"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className="p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 transition-colors"
                  title="Favorite event"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited
                        ? "fill-[#FF4B72] text-[#FF4B72]"
                        : "text-white"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Banner Bottom Content */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold mb-2 text-teal-200">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {event.location}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Grid: Details + Registration Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Details & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                About This Event
              </h3>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                {event.description}
              </div>

              {/* Required Skills */}
              {event.requiredSkills && event.requiredSkills.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Desired Volunteer Skills & Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-xs font-bold text-[#00494B] dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Organizer Info & Controls */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00494B] text-white flex items-center justify-center font-black text-xl shadow-md">
                  {event.organizer?.name?.charAt(0).toUpperCase() || "O"}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Organized by
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {event.organizer?.name || "Community Partner"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {event.organizer?.email || "organizer@volunexa.com"}
                  </p>
                </div>
              </div>

              {isEventOwner && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/organizer/volunteers/${event._id}`}
                    className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#00494B] dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors flex items-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Manage Volunteers</span>
                  </Link>
                  <Link
                    href={`/organizer/events`}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Event</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Capacity & Volunteer Registration */}
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl sticky top-24">
              {/* Capacity Header */}
              <div className="pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Volunteer Slots
                  </span>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      isFull
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                        : availableSlots <= 3
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 animate-pulse"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    }`}
                  >
                    {isFull ? "Event Full" : `${availableSlots} Slots Available`}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden mt-3">
                  <div
                    className="bg-[#00494B] h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (event.registeredCount / event.maxCapacity) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>{event.registeredCount} Registered</span>
                  <span>{event.maxCapacity} Max Capacity</span>
                </div>
              </div>

              {/* Deadline alert */}
              <div className="py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-700 dark:text-slate-300">
                    Registration Deadline
                  </p>
                  <p
                    className={
                      isDeadlinePassed
                        ? "text-rose-500 font-bold"
                        : "text-slate-500"
                    }
                  >
                    {formattedDeadline}{" "}
                    {isDeadlinePassed ? "(Deadline Passed)" : ""}
                  </p>
                </div>
              </div>

              {/* Registration Form / Status */}
              <div className="pt-5">
                {isRegistered ? (
                  /* Already registered state */
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <div>
                      <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                        You&apos;re Registered!
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                        Status:{" "}
                        <strong className="capitalize">
                          {myRegistration?.status || "registered"}
                        </strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setQrModalOpen(true)}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>View Check-in QR Pass</span>
                    </button>

                    <Link
                      href="/volunteer/my-events"
                      className="inline-block text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline pt-1"
                    >
                      Manage in My Events
                    </Link>
                  </div>
                ) : isFull ? (
                  /* Event Full state */
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center space-y-2">
                    <AlertCircle className="w-7 h-7 text-rose-500 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Capacity Reached
                    </h4>
                    <p className="text-xs text-slate-500">
                      All volunteer slots have been filled for this event. Please check
                      back later in case of cancellations.
                    </p>
                  </div>
                ) : isDeadlinePassed ? (
                  /* Deadline passed state */
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center space-y-2">
                    <Clock className="w-7 h-7 text-amber-500 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Registration Closed
                    </h4>
                    <p className="text-xs text-slate-500">
                      The registration deadline for this event has passed.
                    </p>
                  </div>
                ) : isOrganizer ? (
                  /* Organizers cannot register as volunteers (Requirement in Project_Descriptions) */
                  <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 text-center text-xs text-[#00494B] dark:text-teal-300 font-medium">
                    You are logged in as an <strong>Organizer</strong>. Organizers
                    manage events and rosters rather than registering as volunteers.
                  </div>
                ) : (
                  /* Volunteer Registration Form */
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Choose Your Skill / Role
                      </label>
                      {event.requiredSkills && event.requiredSkills.length > 0 ? (
                        <select
                          value={selectedSkill}
                          onChange={(e) => setSelectedSkill(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                        >
                          {event.requiredSkills.map((skill, idx) => (
                            <option key={idx} value={skill}>
                              {skill}
                            </option>
                          ))}
                          <option value="General Volunteer Support">
                            General Volunteer Support
                          </option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          required
                          value={selectedSkill}
                          onChange={(e) => setSelectedSkill(e.target.value)}
                          placeholder="e.g. Logistics, First Aid, Organization"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                        />
                      )}
                    </div>

                    {regMessage && (
                      <div
                        className={`p-3 rounded-xl text-xs font-semibold ${
                          regMessage.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {regMessage.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white font-black text-sm shadow-lg shadow-[#00494B]/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {regLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-teal-300" />
                          <span>Confirm Volunteer Registration</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventShareModal
        event={event}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {myRegistration && (
        <EventQRModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          eventTitle={event.title}
          volunteerName={user?.name || "Volunteer"}
          registrationId={myRegistration._id}
          status={myRegistration.status}
        />
      )}
    </div>
  );
}

export default function EventDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
          <p className="text-sm font-semibold text-slate-500">
            Loading event...
          </p>
        </div>
      }
    >
      <EventDetailsContent />
    </React.Suspense>
  );
}
