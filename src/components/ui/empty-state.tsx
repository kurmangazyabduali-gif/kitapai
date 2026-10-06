import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  emoji?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  actionVariant?: "sky" | "yellow" | "green" | "coral" | "purple";
  className?: string;
}

export function EmptyState({
  emoji = "🔍",
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionHref,
  actionVariant = "sky",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "p-8 sm:p-12 rounded-4xl bg-slate-50/80 border-2 border-dashed border-slate-200 text-center space-y-4 max-w-lg mx-auto my-6",
        className
      )}
    >
      <div className="w-16 h-16 rounded-3xl bg-white shadow-kid-sm border-2 border-slate-200 flex items-center justify-center mx-auto text-3xl animate-wiggle">
        {Icon ? <Icon className="w-8 h-8 text-slate-600" /> : emoji}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-black text-slate-800">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>

      {actionText && (
        <div className="pt-2">
          {actionHref ? (
            <a href={actionHref}>
              <Button variant={actionVariant} size="md" className="font-extrabold text-xs">
                {actionText}
              </Button>
            </a>
          ) : (
            <Button
              onClick={onAction}
              variant={actionVariant}
              size="md"
              className="font-extrabold text-xs"
            >
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
