"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, LogIn, ArrowLeft, Sparkles, User, Lock, Smile, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserRole } from "@/types/database.types";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoRole } = useAuth();

  const [role, setRole] = React.useState<UserRole>("student");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const success = await login(email, password, role);
      if (!success) {
        setErrorMsg("Кіру кезінде қате орын алды. Деректерді тексеріңіз.");
      }
    } catch (err) {
      setErrorMsg("Жүйелік қате орын алды.");
    } finally {
      setLoading(false);
    }
  };

  const roleConfigs = {
    student: {
      badgeTitle: "Балаларға арналған оңай кіру",
      mainTitle: "Қош келдің! 🦁",
      subTitle: "Кітап оқып, тиын жинап, жақсы іс жасауға дайынсың ба?",
      emoji: "🦁",
      buttonColor: "yellow" as const,
      placeholderLogin: "alihan2017 немесе alihan@kitaptan.kz",
    },
    teacher: {
      badgeTitle: "Ұстаздар мен тәрбиешілер",
      mainTitle: "Мұғалім кабинеті 👩‍🏫",
      subTitle: "Сынып оқушыларының оқырмандық және тәрбиелік белсенділігі",
      emoji: "👩‍🏫",
      buttonColor: "sky" as const,
      placeholderLogin: "ainur.teacher@kitaptan.kz",
    },
    parent: {
      badgeTitle: "Ата-аналар бұрышы",
      mainTitle: "Ата-ана кабинеті 👨‍👩‍👧",
      subTitle: "Балаңыздың жақсы істерін растаңыз және бірге қуаныңыз",
      emoji: "👨‍👩‍👧",
      buttonColor: "purple" as const,
      placeholderLogin: "bauyrzhan.parent@kitaptan.kz",
    },
    admin: {
      badgeTitle: "Платформа әкімшісі",
      mainTitle: "Әкімшілік басқару 🛡️",
      subTitle: "Мектептерді, сыныптарды және контентті басқару",
      emoji: "🛡️",
      buttonColor: "coral" as const,
      placeholderLogin: "admin@kitaptan.kz",
    },
  };

  const current = roleConfigs[role];

  return (
    <div className="min-h-screen bg-gradient-to-br from-edu-sky-50 via-amber-50/50 to-purple-50 flex flex-col justify-between p-4 sm:p-6">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Басты бетке оралу</span>
        </Link>

        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-edu-sky-600 stroke-[2.5]" />
          <span className="font-black text-slate-800 text-sm hidden sm:inline">
            Кітаптан – жақсы іске
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-6">
        <Card className="p-6 sm:p-8 border-4 border-edu-sky-100 shadow-2xl bg-white space-y-6">
          {/* Header with Child-friendly Mascot */}
          <div className="text-center space-y-2">
            <div className="text-6xl animate-bounce mb-2 inline-block">
              {current.emoji}
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-[11px] font-black text-slate-600 uppercase tracking-wider">
              {current.badgeTitle}
            </div>

            <h2 className="text-3xl font-black text-slate-900">
              {current.mainTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
              {current.subTitle}
            </p>
          </div>

          {/* 4-Role Switcher Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={cn(
                "py-2 rounded-xl text-[11px] font-black transition-all",
                role === "student"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              🎒 Оқушы
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={cn(
                "py-2 rounded-xl text-[11px] font-black transition-all",
                role === "teacher"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              👩‍🏫 Мұғалім
            </button>
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={cn(
                "py-2 rounded-xl text-[11px] font-black transition-all",
                role === "parent"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              👨‍👩‍👧 Ата-ана
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={cn(
                "py-2 rounded-xl text-[11px] font-black transition-all",
                role === "admin"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              🛡️ Әкімші
            </button>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={role === "student" ? "Логин немесе Email" : "Электронды пошта"}
              type="text"
              placeholder={current.placeholderLogin}
              icon={<User className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Құпиясөз"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs font-bold">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-md border-slate-300 text-edu-sky-600 focus:ring-0"
                  defaultChecked
                />
                <span>Мені есте сақта</span>
              </label>
              <Link href="/auth/forgot-password" className="text-edu-sky-600 hover:underline">
                Құпиясөзді ұмыттыңыз ба?
              </Link>
            </div>

            <Button
              type="submit"
              variant={current.buttonColor}
              size="lg"
              disabled={loading}
              className="w-full justify-center text-base font-extrabold shadow-md"
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? "Кіру орындалуда..." : "Платформаға кіру 🚀"}</span>
            </Button>
          </form>

          {/* 1-Click Quick Demo Login Shortcuts */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              1 басу арқылы тексеру (Demo):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => switchDemoRole("student")}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-black transition-all active:scale-95"
              >
                🦁 Оқушы (Алихан)
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole("teacher")}
                className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200 text-xs font-black transition-all active:scale-95"
              >
                👩‍🏫 Мұғалім (Айнұр)
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole("parent")}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 text-xs font-black transition-all active:scale-95"
              >
                👨‍👩‍👧 Ата-ана (Бауыржан)
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole("admin")}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-950 border border-slate-300 text-xs font-black transition-all active:scale-95"
              >
                🛡️ Әкімшілік
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center text-xs font-semibold text-slate-500 pt-1">
            Платформада әлі тіркелмедіңіз бе?{" "}
            <Link href="/auth/register" className="font-extrabold text-edu-sky-600 hover:underline">
              Тегін тіркелу 🎒
            </Link>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-400 font-medium">
        «Кітаптан – жақсы іске» © {new Date().getFullYear()}
      </div>
    </div>
  );
}
