"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/database.types";
import { cn } from "@/lib/utils";

export function RoleSwitcherBar() {
  const { user, role, switchDemoRole } = useAuth();

  const roles: { role: UserRole; label: string; emoji: string }[] = [
    { role: "student", label: "Оқушы", emoji: "🎒" },
    { role: "teacher", label: "Мұғалім", emoji: "👩‍🏫" },
    { role: "parent", label: "Ата-ана", emoji: "👨‍👩‍👧" },
    { role: "admin", label: "Әкімшілік", emoji: "🛡️" },
  ];

  return (
    <div className="bg-slate-900 text-white text-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 z-50">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-slate-300">
          Ағымдағы рөл: <strong className="text-amber-300">{user?.full_name || "Қонақ"}</strong> ({role})
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 text-[11px] hidden sm:inline">Рөлді ауыстыру (Demo):</span>
        {roles.map((r) => (
          <button
            key={r.role}
            onClick={() => switchDemoRole(r.role)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-black transition-all",
              role === r.role
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
