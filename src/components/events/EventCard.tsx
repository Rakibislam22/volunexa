"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventItem } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { api } from "../../services/api";
import { getSocket } from "../../services/socket";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";

interface EventCardProps {
  event: EventItem;
  onShare?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event: initialEvent, onShare }) => {
  const { isAuthenticated, isVolunteer } = useAuth();
  const { showAlert, showAuthRequired } = useModal();
  const [event, setEvent] = useState<EventItem>(initialEvent);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [favLoading, setFavLoading] = useState<boolean>(false);

  // Sync state if initialEvent changes
  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  // Real-time socket listener for slot updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleSlotUpdate = (data: {
      eventId: string;
      registeredCount: number;
      availableSlots: number;
    }) => {
      if (data.eventId === event._id) {
        setEvent((prev) => ({
          ...prev,
          registeredCount: data.registeredCount,
          availableSlots: data.availableSlots,
          isFull: data.availableSlots <= 0,
        }));
      }
    };

    socket.on("slots:updated", handleSlotUpdate);

    return () => {
      socket.off("slots:updated", handleSlotUpdate);
    };
  }, [event._id]);

  // Check if favorited
  useEffect(() => {
    if (isAuthenticated) {
      api
        .checkFavorite(event._id)
        .then((res) => setIsFavorited(res.isFavorited))
        .catch(() => {});
    }
  }, [event._id, isAuthenticated]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthRequired("Please sign in or create an account to save events to your favorites!");
      return;
    }
    setFavLoading(true);
    try {
      const res = await api.toggleFavorite(event._id);
      setIsFavorited(res.isFavorited);
    } catch (err) {
      console.error("Favorite toggle error:", err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(event);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/events/${event._id}`
      );
      showAlert({
        title: "Link Copied! 🔗",
        message: `The link for "${event.title}" has been copied to your clipboard.`,
        type: "success",
        confirmText: "Great",
      });
    }
  };

  // Calculations
  const availableSlots =
    event.availableSlots !== undefined
      ? event.availableSlots
      : Math.max(0, event.maxCapacity - event.registeredCount);

  const isFull = availableSlots <= 0 || event.registeredCount >= event.maxCapacity;

  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    setIsDeadlinePassed(new Date().getTime() > new Date(event.registrationDeadline).getTime());
  }, [event.registrationDeadline]);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedDeadline = new Date(event.registrationDeadline).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );

  const categoryColor: Record<string, string> = {
    environment: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    education: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    health: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    community: "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    technology: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    sports: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    arts: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/60 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800",
    charity: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  const badgeClass =
    categoryColor[event.category] ||
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";

  return (
    <div className="group relative bg-white dark:bg-[#002528] rounded-2xl border border-slate-200/90 dark:border-teal-900/60 hover:border-teal-500/50 dark:hover:border-teal-400/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Banner & Quick Badges */}
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {/* Event background cover */}
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{
            backgroundImage: event.image
              ? `url(${event.image})`
              : "url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm ${badgeClass}`}
          >
            {event.category}
          </span>
        </div>

        {/* Floating Actions (Favorite & Share) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleShareClick}
            title="Share event link"
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            title={isFavorited ? "Remove from favorites" : "Save to favorites"}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorited ? "fill-[#FF4B72] text-[#FF4B72]" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Real-time Available Slots Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-teal-300" />
            <span className="font-semibold">
              {event.registeredCount}/{event.maxCapacity} registered
            </span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-lg font-bold text-xs backdrop-blur-md ${
              isFull
                ? "bg-rose-600/90 text-white"
                : availableSlots <= 3
                ? "bg-amber-600/90 text-white animate-pulse"
                : "bg-emerald-600/90 text-white"
            }`}
          >
            {isFull ? "Event Full" : `${availableSlots} slots left`}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Location Metas */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-teal-200/70 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#00494B] dark:text-teal-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1 truncate max-w-[150px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-teal-400" />
              {event.location}
            </span>
          </div>

          {/* Event Title */}
          <Link href={`/events/${event._id}`}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#00494B] dark:group-hover:text-teal-300 transition-colors">
              {event.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Required Skills Chips */}
          {event.requiredSkills && event.requiredSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {event.requiredSkills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-teal-950/60 text-[11px] font-medium text-slate-600 dark:text-teal-300 border border-slate-200 dark:border-teal-800/60"
                >
                  {skill}
                </span>
              ))}
              {event.requiredSkills.length > 3 && (
                <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                  +{event.requiredSkills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Deadline & Action */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-teal-900/60 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-teal-200/70">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>
              Deadline:{" "}
              <strong className={isDeadlinePassed ? "text-rose-500" : ""}>
                {formattedDeadline}
              </strong>
            </span>
          </div>

          <Link
            href={`/events/${event._id}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isFull || isDeadlinePassed
                ? "bg-slate-100 dark:bg-teal-950/80 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-teal-900/80"
                : "bg-[#00494B] hover:bg-[#00383a] text-white hover:scale-105 border border-teal-500/30"
            }`}
          >
            {isFull ? "Details" : isDeadlinePassed ? "Expired" : "Join Event"}
          </Link>
        </div>
      </div>
    </div>
  );
};
