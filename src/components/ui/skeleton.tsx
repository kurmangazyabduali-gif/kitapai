import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-700/50",
        className
      )}
      {...props}
    />
  );
}

export function BookCardSkeleton() {
  return (
    <div className="p-5 rounded-4xl bg-white border-2 border-slate-100 shadow-sm space-y-4">
      <Skeleton className="w-full h-44 rounded-3xl" />
      <div className="space-y-2">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-24 h-9 rounded-2xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-16 h-4" />
      <Skeleton className="w-24 h-8 rounded-xl" />
    </div>
  );
}
