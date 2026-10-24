"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  MessageCircleQuestion,
  Sparkles,
  ArrowRight,
  Mail,
} from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Volunexa and who can participate?",
      a: "Volunexa is a real-time community event and volunteer management platform that connects passionate individuals with meaningful civic initiatives, cleanups, blood drives, and skill-sharing workshops. Anyone can join as a community volunteer or register as an event organizer.",
    },
    {
      q: "How does the Contactless Digital QR Pass work?",
      a: "When you register for any event, a unique cryptographic QR code pass is automatically created in your dashboard. At the event entrance, the organizer scans your digital pass to instantly verify attendance and record your community impact hours without manual paperwork.",
    },
    {
      q: "How does the Real-time Live Seat Sync benefit volunteers?",
      a: "Volunexa uses real-time WebSockets (Socket.io) to synchronize event seat counts instantaneously across all users. You always see actual live availability, preventing frustrating double-bookings. If someone cancels, their seat immediately reappears for others to claim.",
    },
    {
      q: "How does Google Gemini AI help event organizers?",
      a: "Organizers can generate comprehensive, polished event outlines in seconds. By entering a simple title and category, Gemini AI drafts an engaging description, an itemized schedule, safety guidelines, and recommended volunteer skills that can be customized with one click.",
    },
    {
      q: "What happens when an event reaches maximum capacity?",
      a: "Once all available volunteer seats are claimed, the system automatically locks registrations and updates the event card with a 'Full Capacity' badge. Organizers can also manually close or reopen registrations as needed.",
    },
    {
      q: "Is Volunexa free to use?",
      a: "Yes! Volunexa is completely free for volunteers looking to give back to society, as well as community organizers driving non-profit and civic causes.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-50/70 dark:bg-[#001c1e] border-y border-slate-200/80 dark:border-teal-900/40 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-xs font-bold text-[#00494B] dark:text-teal-300 uppercase tracking-wider mb-3 shadow-xs">
            <MessageCircleQuestion className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-teal-200/80 leading-relaxed">
            Everything you need to know about navigating registrations, organizing events, and
            tracking community impact on Volunexa.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? "bg-white dark:bg-[#002528] border-teal-500/40 dark:border-teal-500/40 shadow-md"
                    : "bg-white/80 dark:bg-[#002224]/80 border-slate-200/80 dark:border-teal-900/50 hover:border-slate-300 dark:hover:border-teal-800/60 shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full py-4.5 px-6 sm:px-7 flex items-center justify-between gap-4 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 bg-[#00494B] text-white"
                        : "bg-slate-100 dark:bg-[#002f32] text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-teal-900/40">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 p-6 rounded-3xl bg-white dark:bg-[#002528] border border-slate-200/80 dark:border-teal-900/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#00494B] dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800/60">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Have more questions or need custom assistance?
              </h4>
              <p className="text-xs text-slate-500 dark:text-teal-300/70 mt-0.5">
                Our community coordinators are always ready to help you get started.
              </p>
            </div>
          </div>
          <Link
            href="/events"
            className="px-5 py-2.5 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-bold shadow-md shadow-[#00494B]/20 transition-all hover:scale-105 shrink-0 whitespace-nowrap"
          >
            Explore Events &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
