"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  BookMarked,
  LogOut,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function TeacherSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Басты шолу",
      href: "/teacher/dashboard",
      icon: LayoutDashboard,
      color: "text-edu-sky-500",
      activeBg: "bg-edu-sky-500 text-white shadow-kid-sky",
      bgHover: "hover:bg-edu-sky-50 hover:text-edu-sky-700",
    },
    {
      name: "Сынып оқушылары",
      href: "/teacher/students",
      icon: Users,
      color: "text-amber-500",
      activeBg: "bg-amber-400 text-slate-900 shadow-kid-yellow",
      bgHover: "hover:bg-amber-50 hover:text-amber-700",
      badge: "26 оқушы",
    },
    {
      name: "Оқу аналитикасы",
      href: "/teacher/analytics",
      icon: BarChart3,
      color: "text-emerald-500",
      activeBg: "bg-emerald-500 text-white shadow-kid-green",
      bgHover: "hover:bg-emerald-50 hover:text-emerald-700",
    },
    {
      name: "Әдістемелік контент",
      href: "/teacher/content",
      icon: BookMarked,
      color: "text-purple-500",
      activeBg: "bg-purple-600 text-white shadow-kid-purple",
      bgHover: "hover:bg-purple-50 hover:text-purple-700",
    },
  ];

  return (
    <aside
      className={cn(
        "w-72 bg-white border-r-2 border-slate-100 flex flex-col justify-between p-5 select-none h-full min-h-screen",
        className
      )}
    >
      <div className="space-y-6">
        {/* Top Profile Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-edu-sky-50 to-indigo-50 border-2 border-edu-sky-100 shadow-sm flex flex-col items-center text-center">
          <Avatar
            emoji="👩‍🏫"
            name={user?.full_name || "Мұғалім"}
            size="lg"
            borderVariant="sky"
            className="mb-2"
          />
          <h3 className="font-black text-slate-800 text-base leading-snug">
            {user?.full_name || "Айнұр Серікқызы"}
          </h3>
          <p className="text-xs font-bold text-edu-sky-700 mt-0.5">
            Бастауыш сынып мұғалімі
          </p>
          <span className="text-[11px] font-extrabold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 mt-2">
            2 «А» сынып жетекшісі
          </span>
        </div>

        {/* Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-150 group",
                  isActive ? item.activeBg : cn("text-slate-600", item.bgHover)
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform group-hover:scale-110",
                      isActive ? "text-inherit" : item.color
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Шығу</span>
        </button>
      </div>
    </aside>
  );
}
