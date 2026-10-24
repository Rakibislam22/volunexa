"use client";

import React from "react";
import { X, QrCode, Download, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface EventQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  volunteerName: string;
  registrationId: string;
  status: string;
}

export const EventQRModal: React.FC<EventQRModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  volunteerName,
  registrationId,
  status,
}) => {
  if (!isOpen) return null;

  const qrData = JSON.stringify({
    platform: "Volunexa",
    regId: registrationId,
    volunteer: volunteerName,
    event: eventTitle,
    status: status,
    verifiedAt: "Volunexa-Verified",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[#00494B] dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Event Check-in Pass
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Show this QR code to the event organizers for smooth check-in.
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-teal-500/40 inline-block shadow-inner mx-auto mb-4">
          <QRCodeSVG
            value={qrData}
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 text-left space-y-1 mb-5 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Volunteer:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {volunteerName}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Event:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
              {eventTitle}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <span className="font-bold capitalize text-emerald-600 dark:text-emerald-400">
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Volunexa Volunteer Pass</span>
        </div>
      </div>
    </div>
  );
};
