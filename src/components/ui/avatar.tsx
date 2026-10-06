import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  level?: number;
  emoji?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  borderVariant?: "sky" | "yellow" | "green" | "purple" | "coral" | "gold";
  showLevelBadge?: boolean;
}

export function Avatar({
  src,
  name = "Оқушы",
  level = 1,
  emoji = "🦊",
  size = "md",
  borderVariant = "yellow",
  showLevelBadge = false,
  className,
  ...props
}: AvatarProps) {
  const sizeStyles = {
    sm: "w-9 h-9 text-base",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-3xl",
    xl: "w-20 h-20 text-4xl",
    "2xl": "w-24 h-24 text-5xl",
  };

  const borderStyles = {
    sky: "ring-4 ring-edu-sky-300 bg-edu-sky-100",
    yellow: "ring-4 ring-edu-yellow-300 bg-edu-yellow-100",
    green: "ring-4 ring-edu-green-300 bg-edu-green-100",
    purple: "ring-4 ring-edu-purple-300 bg-edu-purple-100",
    coral: "ring-4 ring-edu-coral-300 bg-edu-coral-100",
    gold: "ring-4 ring-amber-400 bg-gradient-to-tr from-amber-100 to-yellow-200 shadow-md",
  };

  return (
    <div className="relative inline-block select-none" {...props}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center overflow-hidden font-bold transition-transform hover:scale-105 shadow-sm",
          sizeStyles[size],
          borderStyles[borderVariant],
          className
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="leading-none">{emoji}</span>
        )}
      </div>

      {showLevelBadge && (
        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
          {level} lvl
        </span>
      )}
    </div>
  );
}
