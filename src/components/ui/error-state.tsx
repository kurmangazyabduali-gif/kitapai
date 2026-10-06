import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Қате орын алды",
  message = "Ақпаратты жүктеу кезінде күтпеген қателік болды. Қайта көріңіз.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "p-8 rounded-4xl bg-rose-50 border-2 border-rose-200 text-center space-y-4 max-w-md mx-auto my-6 shadow-sm",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-black text-rose-950">{title}</h3>
        <p className="text-xs text-rose-800 font-medium leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            onClick={onRetry}
            variant="coral"
            size="sm"
            className="font-black text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Қайта жүктеу
          </Button>
        </div>
      )}
    </div>
  );
}
