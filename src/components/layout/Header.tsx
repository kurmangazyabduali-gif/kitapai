"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, Flame, Sparkles, Menu, X, User, LogIn, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const pathname = usePathname();
  const { user, role, getRoleDashboardUrl } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const currentUser = user || MOCK_STUDENT;
  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/parent") ||
    pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/auth");
  const dashboardHref = role ? getRoleDashboardUrl(role) : "/student/dashboard";

  const navLinks = [
    { name: "Басты бет", href: "/" },
    { name: "5-қадам формуласы", href: "/#formula" },
    { name: "Кітаптар", href: "/#books" },
    { name: "Жақсы істер тақтасы", href: "/#deeds" },
    { name: "Отбасы & Мектеп", href: "/#family" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-edu-sky-500 to-edu-sky-400 p-2.5 flex items-center justify-center text-white shadow-kid-sky group-hover:scale-105 transition-transform">
            <BookOpen className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">
                Кітаптан <span className="text-edu-sky-600">–</span>
              </span>
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-edu-coral-500 to-amber-500 bg-clip-text text-transparent">
                жақсы іске
              </span>
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 -mt-0.5">
              Балалар EdTech Платформасы
            </p>
          </div>
        </Link>

        {/* Desktop Navigation (Landing Page) */}
        {!isDashboard && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-150",
                  pathname === link.href
                    ? "bg-white text-edu-sky-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Quick Stats Pill (Logged in / Dashboard / Demo state) */}
          <div className="hidden sm:flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-3.5 py-1.5 rounded-full shadow-inner">
            <div className="flex items-center gap-1 text-xs font-black text-amber-900" title="Алтын тиындар">
              <span>🪙</span>
              <span>{currentUser.coins ?? MOCK_STUDENT.coins}</span>
            </div>
            <div className="w-px h-3.5 bg-amber-200" />
            <div className="flex items-center gap-1 text-xs font-black text-amber-900" title="Жұлдыздар">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{currentUser.stars ?? MOCK_STUDENT.stars}</span>
            </div>
            <div className="w-px h-3.5 bg-amber-200" />
            <div className="flex items-center gap-1 text-xs font-black text-rose-600" title="Оқу сериясы">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{currentUser.streak_days ?? MOCK_STUDENT.streak_days} күн</span>
            </div>
          </div>

          {/* User Profile or Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={dashboardHref}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-50 hover:bg-edu-sky-50 border border-slate-200/80 hover:border-edu-sky-300 transition-all shadow-sm group"
                title="Жеке кабинетке өту"
              >
                <Avatar
                  emoji={currentUser.avatar_emoji || "🦁"}
                  name={currentUser.full_name || "Пайдаланушы"}
                  size="sm"
                  borderVariant="gold"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-800 leading-tight truncate max-w-[120px] group-hover:text-edu-sky-700">
                    {currentUser.full_name}
                  </p>
                  <span className="text-[10px] font-bold text-edu-sky-700 bg-edu-sky-100/90 px-1.5 py-0.2 rounded-full">
                    {currentUser.grade_level ? `${currentUser.grade_level}-сынып` : currentUser.role}
                  </span>
                </div>
              </Link>

              <Link href={dashboardHref} className="hidden sm:inline-block">
                <Button variant="sky" size="sm" className="font-extrabold shadow-sm">
                  <span>Кабинетке өту 🚀</span>
                </Button>
              </Link>

              <Link href="/auth/login" title="Басқа аккаунтпен кіру">
                <Button variant="ghost" size="sm" className="hidden lg:inline-flex text-xs text-slate-500 font-bold hover:text-slate-900">
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  <span>Кіру</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="font-bold">
                  <LogIn className="w-4 h-4" />
                  <span>Кіру</span>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="yellow" size="sm" className="font-extrabold shadow-sm">
                  <span>Тіркелу 🎒</span>
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-2xl text-slate-600 hover:bg-slate-100"
            aria-label="Мәзір"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-slate-100 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {!isDashboard && (
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-edu-sky-50 hover:text-edu-sky-700 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="sky" className="w-full justify-center font-black">
                    <span>Жеке кабинетке өту ({currentUser.full_name}) 🚀</span>
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center text-xs font-bold">
                      Басқа аккаунт
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="yellow" className="w-full justify-center text-xs font-bold">
                      Жаңа тіркелу
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center text-xs font-bold">
                    Кіру
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="yellow" className="w-full justify-center text-xs font-bold">
                    Тіркелу
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
