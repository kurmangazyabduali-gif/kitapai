"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  HeartHandshake,
  Gamepad2,
  Users,
  User,
  LogOut,
  Flame,
  Award,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function StudentSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Басты бет",
      href: "/student/dashboard",
      icon: Home,
      color: "text-edu-sky-500",
      activeBg: "bg-edu-sky-500 text-white shadow-kid-sky",
      bgHover: "hover:bg-edu-sky-50 hover:text-edu-sky-700",
    },
    {
      name: "Кітап сөресі",
      href: "/student/library",
      icon: BookOpen,
      color: "text-amber-500",
      activeBg: "bg-amber-400 text-slate-900 shadow-kid-yellow",
      bgHover: "hover:bg-amber-50 hover:text-amber-700",
      badge: "120+ кітап",
    },
    {
      name: "Ойындар & Викториналар",
      href: "/student/games",
      icon: Gamepad2,
      color: "text-purple-500",
      activeBg: "bg-purple-600 text-white shadow-kid-purple",
      bgHover: "hover:bg-purple-50 hover:text-purple-700",
    },
    {
      name: "Жақсы істерім",
      href: "/student/good-deeds",
      icon: HeartHandshake,
      color: "text-rose-500",
      activeBg: "bg-rose-500 text-white shadow-kid-coral",
      bgHover: "hover:bg-rose-50 hover:text-rose-700",
      badge: "9 іс",
    },
    {
      name: "Отбасы бұрышы",
      href: "/student/family",
      icon: Users,
      color: "text-emerald-500",
      activeBg: "bg-emerald-500 text-white shadow-kid-green",
      bgHover: "hover:bg-emerald-50 hover:text-emerald-700",
    },
    {
      name: "Менің профилім",
      href: "/student/profile",
      icon: User,
      color: "text-sky-600",
      activeBg: "bg-edu-sky-600 text-white shadow-kid-sky",
      bgHover: "hover:bg-sky-50 hover:text-sky-700",
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
        <div className="p-4 rounded-3xl bg-gradient-to-br from-edu-sky-50 to-edu-yellow-50/60 border-2 border-edu-sky-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <Avatar
            emoji={user?.avatar_emoji || "🦁"}
            name={user?.full_name || "Оқушы"}
            size="xl"
            borderVariant="gold"
            showLevelBadge
            level={user?.grade_level || 3}
            className="mb-2"
          />
          <h3 className="font-black text-slate-800 text-base leading-snug truncate w-full">
            {user?.full_name || "Алихан Сұлтан"}
          </h3>
          <p className="text-xs font-bold text-slate-500">
            {user?.grade_level || 3}-сынып • Озат оқырман 🦁
          </p>

          <div className="w-full mt-3 pt-2 border-t border-slate-200/60">
            <div className="flex justify-between text-[11px] font-black text-slate-500 mb-1">
              <span>Деңгей {user?.grade_level || 3}</span>
              <span className="text-edu-sky-600">{user?.stars || 1250} XP</span>
            </div>
            <Progress value={85} variant="sky" height="sm" />
          </div>
        </div>

        {/* Navigation Menu */}
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

      {/* Bottom mission and Logout */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-[11px] font-black text-amber-900 uppercase">
              Күндік тапсырма
            </span>
          </div>
          <p className="text-xs font-bold text-slate-700 leading-snug">
            Бүгін 15 бет оқып, құстарға жем сал!
          </p>
        </div>

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
