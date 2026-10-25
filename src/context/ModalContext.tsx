"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lock,
  X,
  Trash2,
  Heart,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export type ModalType = "info" | "success" | "warning" | "danger" | "auth";

export interface ModalOptions {
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface ModalContextType {
  showAlert: (options: {
    title: string;
    message: string;
    type?: ModalType;
    confirmText?: string;
  }) => void;
  showConfirm: (options: {
    title: string;
    message: string;
    type?: "warning" | "danger" | "info";
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
  }) => void;
  showAuthRequired: (message?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalState, setModalState] = useState<ModalOptions | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const closeModal = useCallback(() => {
    if (loading) return;
    if (modalState?.onCancel) {
      modalState.onCancel();
    }
    setModalState(null);
  }, [modalState, loading]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalState) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalState, closeModal]);

  const showAlert = useCallback(
    ({
      title,
      message,
      type = "info",
      confirmText = "OK",
    }: {
      title: string;
      message: string;
      type?: ModalType;
      confirmText?: string;
    }) => {
      setModalState({
        title,
        message,
        type,
        confirmText,
        showCancel: false,
      });
    },
    []
  );

  const showConfirm = useCallback(
    ({
      title,
      message,
      type = "warning",
      confirmText = "Confirm",
      cancelText = "Cancel",
      onConfirm,
      onCancel,
    }: {
      title: string;
      message: string;
      type?: "warning" | "danger" | "info";
      confirmText?: string;
      cancelText?: string;
      onConfirm: () => void | Promise<void>;
      onCancel?: () => void;
    }) => {
      setModalState({
        title,
        message,
        type,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        showCancel: true,
      });
    },
    []
  );

  const showAuthRequired = useCallback(
    (message = "Please sign in or create an account to access this feature.") => {
      setModalState({
        title: "Account Required",
        message,
        type: "auth",
        showCancel: true,
        cancelText: "Close",
      });
    },
    []
  );

  const handleConfirmAction = async () => {
    if (!modalState?.onConfirm) {
      closeModal();
      return;
    }

    try {
      setLoading(true);
      await modalState.onConfirm();
      setModalState(null);
    } catch (err) {
      console.error("Modal confirmation action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        showAlert,
        showConfirm,
        showAuthRequired,
        closeModal,
      }}
    >
      {children}

      {/* Render Dialog Modal */}
      {modalState && (
        <div
          role="dialog"
          aria-modal="true"
          data-lenis-prevent
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            data-lenis-prevent
            className="relative w-full max-w-md bg-white dark:bg-[#002528] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 dark:border-teal-900/60 transition-all transform animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              disabled={loading}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Icon & Header */}
            <div className="flex items-start gap-3.5 mb-4">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  modalState.type === "success"
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                    : modalState.type === "danger"
                    ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                    : modalState.type === "warning"
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                    : modalState.type === "auth"
                    ? "bg-teal-100 dark:bg-teal-950/60 text-[#00494B] dark:text-teal-400"
                    : "bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400"
                }`}
              >
                {modalState.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                {modalState.type === "danger" && <Trash2 className="w-5 h-5" />}
                {modalState.type === "warning" && <AlertTriangle className="w-5 h-5" />}
                {modalState.type === "auth" && <Lock className="w-5 h-5" />}
                {modalState.type === "info" && <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1 pr-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {modalState.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {modalState.message}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            {modalState.type === "auth" ? (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-teal-900/40 flex flex-col sm:flex-row items-center gap-2.5">
                <Link
                  href="/login"
                  onClick={closeModal}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-teal-900/60 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={closeModal}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#00494B] hover:bg-[#00383a] text-white text-xs font-bold shadow-md shadow-[#00494B]/20 text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Join Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-teal-900/40 flex items-center justify-end gap-2.5">
                {modalState.showCancel && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={closeModal}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {modalState.cancelText || "Cancel"}
                  </button>
                )}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirmAction}
                  className={`py-2.5 px-5 rounded-xl text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 ${
                    modalState.type === "danger"
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                      : modalState.type === "warning"
                      ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                      : "bg-[#00494B] hover:bg-[#00383a] shadow-[#00494B]/20"
                  }`}
                >
                  {loading ? "Processing..." : modalState.confirmText || "OK"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

