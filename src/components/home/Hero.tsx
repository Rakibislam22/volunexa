"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Tag,
  ArrowRight,
  Clock,
  Sparkles,
  Calendar,
} from "lucide-react";

export const Hero: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (location) params.set("location", location);
    if (category) params.set("category", category);

    router.push(`/events?${params.toString()}`);
  };

  const handleFeatureClick = (feature: string) => {
    if (feature === "upcoming") {
      router.push("/events?dateFilter=upcoming");
    } else if (feature === "featured") {
      router.push("/events?category=community");
    } else {
      router.push("/events");
    }
  };

  return (
    <section className="relative min-h-[520px] md:min-h-[620px] flex items-center justify-center overflow-hidden bg-[#001f20]">
      {/* Background Image with Dark Vignette & Ambient Teal/Violet Glow */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform transition-transform duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=2000&q=80')",
        }}
      />

      {/* Atmospheric Gradients matching Theme_Image.png */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00191a]/90 via-[#002a2c]/85 to-[#00191a]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00494B]/40 via-purple-900/20 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-200 mb-6 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>Real-time Community Volunteering & Events</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
          Find Nearby Community Events
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-teal-100/90 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Explore top-rated volunteer opportunities, activities, and make a lasting difference!
        </p>

        {/* Unified Pill Search Bar (Matching Theme_Image.png) */}
        <form
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto bg-white rounded-2xl md:rounded-full p-2 sm:p-2.5 shadow-2xl border border-white/30 flex flex-col md:flex-row items-center gap-2"
        >
          {/* Keyword Input */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Location Dropdown */}
          <div className="w-full md:w-48 flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-white text-slate-800">All Locations</option>
              <option value="Dhaka" className="bg-white text-slate-800">Dhaka</option>
              <option value="Chittagong" className="bg-white text-slate-800">Chittagong</option>
              <option value="Sylhet" className="bg-white text-slate-800">Sylhet</option>
              <option value="Cox's Bazar" className="bg-white text-slate-800">Cox&apos;s Bazar</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-48 flex items-center gap-2 px-4 py-2">
            <Tag className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-white text-slate-800">All Categories</option>
              <option value="environment" className="bg-white text-slate-800">Environment</option>
              <option value="education" className="bg-white text-slate-800">Education</option>
              <option value="health" className="bg-white text-slate-800">Health</option>
              <option value="community" className="bg-white text-slate-800">Community</option>
              <option value="technology" className="bg-white text-slate-800">Technology</option>
              <option value="sports" className="bg-white text-slate-800">Sports</option>
              <option value="arts" className="bg-white text-slate-800">Arts</option>
              <option value="charity" className="bg-white text-slate-800">Charity</option>
            </select>
          </div>

          {/* Search Button (Vibrant Pill Action Button) */}
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3.5 bg-[#FF4B72] hover:bg-[#e2375e] text-white font-bold text-sm rounded-xl md:rounded-full shadow-lg shadow-[#FF4B72]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Feature Quick Chips (Matching Theme_Image.png) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-teal-100/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-300/80">
            Or browse event by feature:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => handleFeatureClick("upcoming")}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium text-white transition-all hover:scale-105 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-teal-300" />
              <span>Upcoming Events</span>
            </button>
            <button
              onClick={() => handleFeatureClick("featured")}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium text-white transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Featured Events</span>
            </button>
            <button
              onClick={() => handleFeatureClick("all")}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium text-white transition-all hover:scale-105 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-300" />
              <span>All Events</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

