import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "sky" | "yellow" | "green" | "coral" | "purple" | "white";
  label?: string;
}

export function Spinner({
  size = "md",
  variant = "sky",
  label,
  className,
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
    xl: "w-14 h-14 border-4",
  };

  const colorClasses = {
    sky: "text-edu-sky-600",
    yellow: "text-amber-500",
    green: "text-emerald-600",
    coral: "text-rose-500",
    purple: "text-purple-600",
    white: "text-white",
  };

  return (
    <div
      className={cn("inline-flex flex-col items-center justify-center gap-2", className)}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          colorClasses[variant]
        )}
      />
      {label && (
        <span className="text-xs font-bold text-slate-500 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
