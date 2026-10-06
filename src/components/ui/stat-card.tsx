import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon | React.ReactNode;
  variant?: "yellow" | "sky" | "green" | "purple" | "rose";
  trend?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "yellow",
  trend,
  className,
  ...props
}: StatCardProps) {
  const styles = {
    yellow: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200",
      iconBg: "bg-amber-400 text-amber-950 shadow-md shadow-amber-200",
      valueColor: "text-amber-900",
      badge: "bg-amber-100 text-amber-800",
    },
    sky: {
      bg: "bg-gradient-to-br from-sky-50 to-sky-100/60 border-sky-200",
      iconBg: "bg-edu-sky-500 text-white shadow-md shadow-sky-200",
      valueColor: "text-sky-950",
      badge: "bg-sky-100 text-sky-800",
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200",
      iconBg: "bg-emerald-500 text-white shadow-md shadow-emerald-200",
      valueColor: "text-emerald-950",
      badge: "bg-emerald-100 text-emerald-800",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100/60 border-purple-200",
      iconBg: "bg-purple-500 text-white shadow-md shadow-purple-200",
      valueColor: "text-purple-950",
      badge: "bg-purple-100 text-purple-800",
    },
    rose: {
      bg: "bg-gradient-to-br from-rose-50 to-rose-100/60 border-rose-200",
      iconBg: "bg-rose-500 text-white shadow-md shadow-rose-200",
      valueColor: "text-rose-950",
      badge: "bg-rose-100 text-rose-800",
    },
  };

  const current = styles[variant];

  return (
    <div
      className={cn(
        "rounded-3xl p-5 border-2 shadow-kid-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-kid-md flex items-center gap-4",
        current.bg,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "w-13 h-13 rounded-2xl flex items-center justify-center p-3 font-extrabold flex-shrink-0",
          current.iconBg
        )}
      >
        {typeof Icon === "function" ? (
          <Icon className="w-6 h-6 stroke-[2.5]" />
        ) : (
          Icon
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-500 tracking-wide uppercase truncate">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-2xl sm:text-3xl font-black", current.valueColor)}>
            {value}
          </span>
          {trend && (
            <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", current.badge)}>
              {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
