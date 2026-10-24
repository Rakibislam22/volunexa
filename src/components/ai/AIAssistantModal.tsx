"use client";

import React, { useState } from "react";
import { Sparkles, X, Check, Loader2, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: {
    description: string;
    requiredSkills: string[];
    category?: string;
  }) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [eventIdea, setEventIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<{
    description: string;
    volunteerRoles: string[];
    requiredSkills: string[];
    promotionalMessage: string;
    suggestedCategory: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventIdea.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await api.generateAIDescription(eventIdea.trim());
      if (res.success && res.generated) {
        setGenerated(res.generated);
      } else {
        setError("Failed to generate content. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to contact AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToForm = () => {
    if (!generated) return;
    onApply({
      description: generated.description,
      requiredSkills: generated.requiredSkills,
      category: generated.suggestedCategory,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00494B] to-teal-400 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                AI Event Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn a short idea into an engaging event description & skills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Enter your event idea or theme
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventIdea}
                onChange={(e) => setEventIdea(e.target.value)}
                placeholder="e.g. Community beach cleanup & recycling workshop in Cox's Bazar"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00494B]"
              />
              <button
                type="submit"
                disabled={loading || !eventIdea.trim()}
                className="px-5 py-3 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-300" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-xs font-medium">
            {error}
          </div>
        )}

        {/* AI Output Preview */}
        {generated && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4" /> AI Generated Result
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold">
                Suggested Category: {generated.suggestedCategory}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Event Description
              </label>
              <textarea
                value={generated.description}
                onChange={(e) =>
                  setGenerated({ ...generated, description: e.target.value })
                }
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed focus:outline-none"
              />
            </div>

            {/* Suggested Roles & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Suggested Volunteer Roles
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {generated.volunteerRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Required Skills
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {generated.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[11px] font-medium text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo message */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Suggested Social Promo
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                {generated.promotionalMessage}
              </p>
            </div>

            {/* Apply Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyToForm}
                className="px-5 py-2.5 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-bold shadow-md flex items-center gap-2"
              >
                <span>Apply to Event Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
