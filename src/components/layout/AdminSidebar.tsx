"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Басқару тақтасы",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      color: "text-edu-sky-500",
      activeBg: "bg-edu-sky-500 text-white shadow-kid-sky",
      bgHover: "hover:bg-edu-sky-50 hover:text-edu-sky-700",
    },
    {
      name: "Пайдаланушылар",
      href: "/admin/users",
      icon: Users,
      color: "text-amber-500",
      activeBg: "bg-amber-400 text-slate-900 shadow-kid-yellow",
      bgHover: "hover:bg-amber-50 hover:text-amber-700",
      badge: "1 245",
    },
    {
      name: "Мектептер & Сыныптар",
      href: "/admin/classes",
      icon: School,
      color: "text-emerald-500",
      activeBg: "bg-emerald-500 text-white shadow-kid-green",
      bgHover: "hover:bg-emerald-50 hover:text-emerald-700",
    },
    {
      name: "Контент (Кітаптар)",
      href: "/admin/content",
      icon: BookOpen,
      color: "text-purple-500",
      activeBg: "bg-purple-600 text-white shadow-kid-purple",
      bgHover: "hover:bg-purple-50 hover:text-purple-700",
      badge: "120",
    },
    {
      name: "Жалпы Аналитика",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "text-indigo-500",
      activeBg: "bg-indigo-600 text-white shadow-md",
      bgHover: "hover:bg-indigo-50 hover:text-indigo-700",
    },
    {
      name: "Жүйе баптаулары",
      href: "/admin/settings",
      icon: Settings,
      color: "text-slate-500",
      activeBg: "bg-slate-800 text-white shadow-md",
      bgHover: "hover:bg-slate-100 hover:text-slate-900",
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
        <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col items-center text-center">
          <Avatar
            emoji="🛡️"
            name="Әкімші"
            size="lg"
            borderVariant="gold"
            className="mb-2"
          />
          <h3 className="font-black text-sm text-white leading-snug">
            {user?.full_name || "Ерлан Құрманғалиұлы"}
          </h3>
          <p className="text-[11px] font-bold text-amber-400 mt-0.5">
            Платформа Әкімшісі
          </p>
        </div>

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
