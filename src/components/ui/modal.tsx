"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  emoji?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  emoji,
  maxWidth = "md",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          "relative w-full bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border-4 border-edu-sky-100 z-10 scale-100 transition-all transform",
          maxWidthStyles[maxWidth]
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Жабу"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with Emoji */}
        {(title || emoji) && (
          <div className="text-center mb-5">
            {emoji && (
              <div className="text-5xl mb-2 animate-bounce inline-block">
                {emoji}
              </div>
            )}
            {title && (
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-slate-500 font-medium text-sm mt-1">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body Content */}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
