"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, HeartHandshake, Gamepad2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    {
      name: "Басты",
      href: "/dashboard",
      icon: Home,
      color: "text-edu-sky-500",
    },
    {
      name: "Кітаптар",
      href: "/dashboard#books",
      icon: BookOpen,
      color: "text-amber-500",
    },
    {
      name: "Жақсы іс",
      href: "/dashboard#deeds",
      icon: HeartHandshake,
      color: "text-rose-500",
      highlight: true,
    },
    {
      name: "Ойындар",
      href: "/dashboard#games",
      icon: Gamepad2,
      color: "text-purple-500",
    },
    {
      name: "Профиль",
      href: "/dashboard#profile",
      icon: User,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-slate-100 px-3 py-2 shadow-2xl safe-bottom">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center -top-4 relative group"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-rose-200 border-4 border-white transform transition-transform group-active:scale-95 animate-bounce">
                  <HeartHandshake className="w-6 h-6 stroke-[2.5]" />
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
