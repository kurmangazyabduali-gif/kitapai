import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-sm font-bold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-13 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-800 transition-all placeholder:text-slate-400 focus:border-edu-sky-400 focus:bg-edu-sky-50/20 focus:outline-none focus:ring-4 focus:ring-edu-sky-100 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-11",
              error && "border-rose-400 focus:border-rose-500 focus:ring-rose-100",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-bold text-rose-500 pl-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
