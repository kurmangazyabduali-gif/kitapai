import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors select-none tracking-wide",
  {
    variants: {
      variant: {
        sky: "bg-edu-sky-100 text-edu-sky-700 border border-edu-sky-300",
        yellow: "bg-edu-yellow-100 text-amber-900 border border-edu-yellow-300",
        green: "bg-edu-green-100 text-edu-green-800 border border-edu-green-300",
        purple: "bg-edu-purple-100 text-edu-purple-700 border border-edu-purple-300",
        coral: "bg-edu-coral-100 text-edu-coral-700 border border-edu-coral-300",
        neutral: "bg-slate-100 text-slate-700 border border-slate-200",
        solidSky: "bg-edu-sky-500 text-white shadow-sm",
        solidYellow: "bg-edu-yellow-400 text-slate-900 shadow-sm",
        solidGreen: "bg-edu-green-500 text-white shadow-sm",
        solidPurple: "bg-edu-purple-600 text-white shadow-sm",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[11px]",
        md: "px-3.5 py-1 text-xs font-extrabold",
        lg: "px-4 py-1.5 text-sm font-extrabold",
      },
    },
    defaultVariants: {
      variant: "sky",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
