import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-edu-sky-300 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        sky: "bg-edu-sky-500 text-white border-b-4 border-edu-sky-700 hover:bg-edu-sky-400 hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-2 shadow-lg shadow-edu-sky-200",
        yellow: "bg-edu-yellow-400 text-slate-900 border-b-4 border-edu-yellow-600 hover:bg-edu-yellow-300 hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-2 shadow-lg shadow-edu-yellow-200",
        green: "bg-edu-green-500 text-white border-b-4 border-edu-green-700 hover:bg-edu-green-400 hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-2 shadow-lg shadow-edu-green-200",
        purple: "bg-edu-purple-600 text-white border-b-4 border-edu-purple-800 hover:bg-edu-purple-500 hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-2 shadow-lg shadow-edu-purple-200",
        coral: "bg-edu-coral-500 text-white border-b-4 border-edu-coral-700 hover:bg-edu-coral-400 hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-2 shadow-lg shadow-edu-coral-200",
        outline: "bg-white text-slate-700 border-2 border-slate-200 border-b-4 border-b-slate-300 hover:bg-slate-50 hover:border-slate-300 active:translate-y-[2px] active:border-b-2",
        ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95",
        white: "bg-white text-edu-sky-600 border-b-4 border-slate-200 hover:bg-slate-50 active:translate-y-[2px] shadow-md",
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-xl",
        md: "h-11 px-5 text-sm rounded-2xl",
        lg: "h-14 px-8 text-base rounded-2.5xl tracking-wide",
        xl: "h-16 px-10 text-lg rounded-3xl tracking-wide font-extrabold",
        icon: "h-11 w-11 p-0 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "sky",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
