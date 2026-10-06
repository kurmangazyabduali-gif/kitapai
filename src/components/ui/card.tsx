import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sky" | "yellow" | "green" | "purple" | "rose" | "cream";
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", interactive = false, ...props }, ref) => {
    const variantStyles = {
      default: "bg-white border-2 border-slate-100 shadow-kid-md",
      sky: "bg-edu-sky-50/70 border-2 border-edu-sky-200 shadow-kid-md hover:border-edu-sky-300",
      yellow: "bg-edu-yellow-50/70 border-2 border-edu-yellow-200 shadow-kid-md hover:border-edu-yellow-300",
      green: "bg-edu-green-50/70 border-2 border-edu-green-200 shadow-kid-md hover:border-edu-green-300",
      purple: "bg-edu-purple-50/70 border-2 border-edu-purple-200 shadow-kid-md hover:border-edu-purple-300",
      rose: "bg-edu-coral-50/70 border-2 border-edu-coral-200 shadow-kid-md hover:border-edu-coral-300",
      cream: "bg-edu-cream border-2 border-amber-100/80 shadow-kid-md",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl p-6 transition-all duration-200 relative overflow-hidden",
          variantStyles[variant],
          interactive && "hover:-translate-y-1 hover:shadow-kid-lg cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-extrabold text-xl sm:text-2xl text-slate-800 tracking-tight leading-snug", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 font-medium leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
