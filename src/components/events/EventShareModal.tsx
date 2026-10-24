"use client";

import React, { useState } from "react";
import { X, Copy, Check, Share2 } from "lucide-react";
import { EventItem } from "../../types";

interface EventShareModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventShareModal: React.FC<EventShareModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/events/${event._id}`
      : `http://localhost:3000/events/${event._id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Check out this volunteer opportunity: "${event.title}" on Volunexa!`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join me in volunteering for "${event.title}": ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#00494B] dark:text-teal-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Share Event
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Event
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
              {event.title}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Shareable Link
            </p>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Or Share Via
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleShareTwitter}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                Twitter / X
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                WhatsApp
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="py-2.5 px-3 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

