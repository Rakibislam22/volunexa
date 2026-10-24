"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import { EventItem } from "../../../types";
import { EventCard } from "../../../components/events/EventCard";
import { EventShareModal } from "../../../components/events/EventShareModal";
import { Heart, Compass, ArrowLeft, Loader2 } from "lucide-react";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [favorites, setFavorites] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShareEvent, setSelectedShareEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.getFavorites();
        if (res.success && res.favorites) {
          const eventsList = res.favorites
            .map((f: any) => f.event)
            .filter((e: any) => e !== null);
          setFavorites(eventsList);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Loading your bookmarked events...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50/50 dark:bg-[#070c10] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/volunteer/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00494B] dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-[#FF4B72] uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#FF4B72]" />
              <span>Bookmarked Opportunities</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Saved Events
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Events you are interested in attending or keeping an eye on
            </p>
          </div>

          <Link
            href="/events"
            className="px-4 py-2 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More</span>
          </Link>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-16 text-center text-slate-500 shadow-sm space-y-3">
            <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No saved favorites yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tap the heart icon on any event card to save it to your favorites list for quick access!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00494B] text-white text-xs font-bold shadow-md hover:bg-[#00383a]"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {favorites.map((event) => (
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
    </div>
  );
}
