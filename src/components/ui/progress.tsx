import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  variant?: "sky" | "yellow" | "green" | "purple" | "coral";
  showLabel?: boolean;
  striped?: boolean;
  height?: "sm" | "md" | "lg";
}

export function Progress({
  value = 0,
  max = 100,
  variant = "yellow",
  showLabel = false,
  striped = true,
  height = "md",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heightStyles = {
    sm: "h-2.5",
    md: "h-4",
    lg: "h-6",
  };

  const barColors = {
    sky: "bg-gradient-to-r from-edu-sky-400 to-edu-sky-500",
    yellow: "bg-gradient-to-r from-edu-yellow-400 to-amber-500",
    green: "bg-gradient-to-r from-edu-green-400 to-edu-green-500",
    purple: "bg-gradient-to-r from-edu-purple-400 to-edu-purple-600",
    coral: "bg-gradient-to-r from-edu-coral-400 to-edu-coral-500",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/80 shadow-inner",
          heightStyles[height]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out shadow-sm relative overflow-hidden",
            barColors[variant],
            striped && "candy-stripes"
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Light gleam effect */}
          <div className="absolute inset-0 bg-white/20" />
        </div>
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
          <span>{Math.round(percentage)}% аяқталды</span>
          <span>{value} / {max}</span>
        </div>
      )}
    </div>
  );
}
