"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  HeartHandshake,
  Gamepad2,
  User,
  Users,
  BarChart3,
  BookMarked,
  School,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { role } = useAuth();

  const getItemsForRole = () => {
    if (role === "teacher") {
      return [
        { name: "Басты", href: "/teacher/dashboard", icon: Home, color: "text-edu-sky-500" },
        { name: "Оқушылар", href: "/teacher/students", icon: Users, color: "text-amber-500" },
        { name: "Аналитика", href: "/teacher/analytics", icon: BarChart3, color: "text-emerald-500" },
        { name: "Контент", href: "/teacher/content", icon: BookMarked, color: "text-purple-500" },
      ];
    }
    if (role === "parent") {
      return [
        { name: "Басты", href: "/parent/dashboard", icon: Home, color: "text-purple-500" },
        { name: "Балам", href: "/parent/child", icon: User, color: "text-amber-500" },
        { name: "Отбасы", href: "/parent/family", icon: Users, color: "text-emerald-500", highlight: true },
      ];
    }
    if (role === "admin") {
      return [
        { name: "Басты", href: "/admin/dashboard", icon: Home, color: "text-edu-sky-500" },
        { name: "Қолданушы", href: "/admin/users", icon: Users, color: "text-amber-500" },
        { name: "Сыныптар", href: "/admin/classes", icon: School, color: "text-emerald-500" },
        { name: "Кітаптар", href: "/admin/content", icon: BookOpen, color: "text-purple-500" },
      ];
    }

    // Default / Student
    return [
      {
        name: "Басты",
        href: "/student/dashboard",
        icon: Home,
        color: "text-edu-sky-500",
      },
      {
        name: "Кітаптар",
        href: "/student/library",
        icon: BookOpen,
        color: "text-amber-500",
      },
      {
        name: "Жақсы іс",
        href: "/student/good-deeds",
        icon: HeartHandshake,
        color: "text-rose-500",
        highlight: true,
      },
      {
        name: "Ойындар",
        href: "/student/games",
        icon: Gamepad2,
        color: "text-purple-500",
      },
      {
        name: "Профиль",
        href: "/student/profile",
        icon: User,
        color: "text-emerald-500",
      },
    ];
  };

  const items = getItemsForRole();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-slate-100 px-3 py-2 shadow-2xl safe-bottom">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(item.href));

          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center -top-4 relative group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-rose-200 border-4 border-white transform transition-transform group-active:scale-95 animate-bounce">
                  <HeartHandshake className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-rose-600 mt-0.5">
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-1 px-3 rounded-2xl transition-all duration-150",
                isActive
                  ? "text-edu-sky-600 font-extrabold scale-105"
                  : "text-slate-400 hover:text-slate-700 font-bold"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive && item.color)} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
