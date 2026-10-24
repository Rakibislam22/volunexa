"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import { AIAssistantModal } from "../../../components/ai/AIAssistantModal";
import {
  Calendar,
  Sparkles,
  MapPin,
  Users,
  Clock,
  Tag,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const { isOrganizer, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("community");
  const [maxCapacity, setMaxCapacity] = useState(25);
  const [requiredSkills, setRequiredSkills] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [image, setImage] = useState("");

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isOrganizer) {
      router.push("/login");
    }
  }, [authLoading, isOrganizer, router]);

  const handleApplyAI = (data: {
    description: string;
    requiredSkills: string[];
    category?: string;
  }) => {
    setDescription(data.description);
    if (data.requiredSkills && data.requiredSkills.length > 0) {
      setRequiredSkills(data.requiredSkills.join(", "));
    }
    if (data.category) {
      setCategory(data.category);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !date || !location || !registrationDeadline) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    if (new Date(registrationDeadline) > new Date(date)) {
      setError("Registration deadline cannot be after the event date.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const skillsArray = requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        title,
        description,
        date: new Date(date).toISOString(),
        location,
        category,
        maxCapacity: Number(maxCapacity),
        requiredSkills: skillsArray,
        registrationDeadline: new Date(registrationDeadline).toISOString(),
        status,
        image: image.trim() || undefined,
      };

      const res = await api.createEvent(payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/events/${res.event._id}`);
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/50 dark:bg-[#070c10] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/organizer/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00494B] dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizer Dashboard</span>
        </Link>

        {/* Page Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Create Community Event
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Define volunteer requirements, limits, and deadlines
              </p>
            </div>

            {/* Smart Element: AI Assistant Button */}
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00494B] to-teal-600 hover:from-[#00383a] hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-teal-900/20 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-200 animate-pulse" />
              <span>Use AI Event Assistant</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Event created successfully! Redirecting to preview...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Community Lake & Park Restoration"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Event Description *
                </label>
                <button
                  type="button"
                  onClick={() => setAiModalOpen(true)}
                  className="text-[11px] font-bold text-[#00494B] dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Auto-generate with AI
                </button>
              </div>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the mission, schedule, objectives, and what volunteers should expect..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00494B]"
              />
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Event Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                />
              </div>

              {/* Registration Deadline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Registration Deadline *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                />
              </div>
            </div>

            {/* Location & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Location / Venue *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dhanmondi Lake Park, Dhaka"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                >
                  <option value="environment">Environment & Conservation</option>
                  <option value="education">Education & Youth</option>
                  <option value="health">Health & Medical Camps</option>
                  <option value="community">Community Welfare</option>
                  <option value="technology">Technology & Digital</option>
                  <option value="sports">Sports & Wellness</option>
                  <option value="arts">Arts & Culture</option>
                  <option value="charity">Charity & Disaster Relief</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Capacity & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Maximum Volunteer Capacity *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                >
                  <option value="published">Published (Accepting volunteers)</option>
                  <option value="draft">Draft (Private, not visible to public)</option>
                </select>
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Required Skills / Roles (comma separated)
              </label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="e.g. First Aid, Event Logistics, Physical Fitness, Teamwork"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
              />
            </div>

            {/* Image URL (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Event Banner Image URL (Optional)
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <Link
                href="/organizer/dashboard"
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-black shadow-lg shadow-[#00494B]/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Event</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApply={handleApplyAI}
      />
    </div>
  );
}
