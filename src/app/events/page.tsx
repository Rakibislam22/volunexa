"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EventItem, EventCategory } from "../../types";
import { api } from "../../services/api";
import { EventCard } from "../../components/events/EventCard";
import { EventShareModal } from "../../components/events/EventShareModal";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Tag,
  Loader2,
  X,
  SlidersHorizontal,
} from "lucide-react";

function EventsContent() {
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShareEvent, setSelectedShareEvent] = useState<EventItem | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [dateFilter, setDateFilter] = useState(searchParams.get("dateFilter") || "upcoming");

  const categories: { label: string; value: string }[] = [
    { label: "All Categories", value: "" },
    { label: "Environment", value: "environment" },
    { label: "Education", value: "education" },
    { label: "Health", value: "health" },
    { label: "Community", value: "community" },
    { label: "Technology", value: "technology" },
    { label: "Sports", value: "sports" },
    { label: "Arts", value: "arts" },
    { label: "Charity", value: "charity" },
  ];

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { status: "published" };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (category) params.category = category;
      if (location.trim()) params.location = location.trim();
      if (dateFilter) params.dateFilter = dateFilter;

      const res = await api.getEvents(params);
      if (res.success && res.events) {
        setEvents(res.events);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategory("");
    setLocation("");
    setDateFilter("upcoming");
    setTimeout(fetchEvents, 50);
  };

  const hasActiveFilters = !!searchTerm || !!category || !!location || dateFilter !== "upcoming";

  return (
    <div className="min-h-screen py-10 bg-slate-50/50 dark:bg-[#070c10] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Discover Community Events
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse upcoming opportunities, check live volunteer capacity, and participate!
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200/90 dark:border-slate-800 mb-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Keyword */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by event title, location, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Filter by city/location"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
              />
            </div>

            {/* Submit & Filter Actions */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="Reset filters"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Quick Category Chips & Date Filter */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Category horizontal pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    category === cat.value
                      ? "bg-[#00494B] text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Date filter dropdown */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
                <option value="">All Dates</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {events.length} {events.length === 1 ? "Event" : "Events"} Found
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#00494B] dark:text-teal-400" />
            <p className="text-sm font-medium">Fetching events...</p>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No events matched your search criteria
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5 max-w-sm mx-auto">
              Try adjusting your search terms, removing category filters, or selecting &quot;All Dates&quot;.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#00494B] text-white text-xs font-bold hover:bg-[#00383a]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Event Grid */
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
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00494B]" /></div>}>
      <EventsContent />
    </Suspense>
  );
}

