"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventItem } from "../../types";
import { api } from "../../services/api";
import { getSocket } from "../../services/socket";
import { EventCard } from "../events/EventCard";
import { EventShareModal } from "../events/EventShareModal";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";

export const FeaturedEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShareEvent, setSelectedShareEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getEvents({ limit: "6", status: "published" });
        if (res.success && res.events) {
          setEvents(res.events);
        }
      } catch (err) {
        console.error("Failed to load featured events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();

    // Listen for new events in realtime
    const socket = getSocket();
    if (!socket) return;

    socket.on("event:created", (newEvent: EventItem) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
    });

    return () => {
      socket.off("event:created");
    };
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs font-bold text-[#00494B] dark:text-teal-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time Live Opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Community Events
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live capacity indicators update automatically when volunteers register.
            </p>
          </div>
          <Link
            href="/events"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#00494B] dark:text-teal-400 hover:underline"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#00494B] dark:text-teal-400" />
            <p className="text-sm font-medium">Loading live events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No events found at the moment
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Be the first community organizer to publish an event!
            </p>
            <Link
              href="/organizer/create-event"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00494B] text-white text-xs font-bold shadow-md hover:bg-[#00383a]"
            >
              + Create an Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onShare={(e) => setSelectedShareEvent(e)}
              />
            ))}
          </div>
        )}
      </div>

      <EventShareModal
        event={selectedShareEvent}
        isOpen={!!selectedShareEvent}
        onClose={() => setSelectedShareEvent(null)}
      />
    </section>
  );
};

