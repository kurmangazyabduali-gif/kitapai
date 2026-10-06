"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { BookOpen, UserPlus, ArrowLeft, Sparkles, User, Lock, School, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserRole, GradeLevel } from "@/types/database.types";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const AVATAR_OPTIONS = [
  { emoji: "🦁", name: "Арыстан (Батыл)" },
  { emoji: "🦊", name: "Түлкі (Тапқыр)" },
  { emoji: "🦅", name: "Бүркіт (Қыран)" },
  { emoji: "🐻", name: "Қонжық (Мейірімді)" },
  { emoji: "🦄", name: "Тұлпар (Жүйрік)" },
  { emoji: "🦉", name: "Үкі (Ақылды)" },
];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const initialRole = (searchParams.get("role") as UserRole) || "student";

  const [role, setRole] = React.useState<UserRole>(initialRole);
  const [grade, setGrade] = React.useState<GradeLevel>(2);
  const [selectedAvatar, setSelectedAvatar] = React.useState("🦁");
  const [fullName, setFullName] = React.useState("");
  const [school, setSchool] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    try {
      await register({
        fullName: fullName.trim() || (role === "student" ? "Алихан Сұлтан" : "Пайдаланушы"),
        email: email.trim() || `user-${Date.now()}@kitaptan.kz`,
        password,
        role,
        gradeLevel: role === "student" ? grade : undefined,
        school: school.trim() || "№84 мектеп-лицейі",
        avatarEmoji: selectedAvatar,
      });
    } catch (err) {
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-edu-sky-50 via-yellow-50/40 to-purple-50 flex flex-col justify-between p-4 sm:p-6">
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

      {/* Main Register Card */}
      <div className="max-w-xl w-full mx-auto my-6">
        <Card className="p-6 sm:p-8 border-3 border-slate-200 shadow-2xl bg-white space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-5xl animate-bounce mb-1 inline-block">
              {selectedAvatar}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Платформаға тіркелу 🎒
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Өз рөліңді таңдап, оқырмандық саяхатты бірге баста!
            </p>

            {/* Welcome bonus pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black shadow-sm">
              <span>🎉 Тіркелгенің үшін:</span>
              <span className="text-amber-700">+100 Алтын тиын сыйлыққа!</span>
            </div>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={cn(
                "py-2 rounded-xl text-xs font-black transition-all",
                role === "student"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              🎒 Оқушы
            </button>
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={cn(
                "py-2 rounded-xl text-xs font-black transition-all",
                role === "parent"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              👨‍👩‍👧 Ата-ана
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={cn(
                "py-2 rounded-xl text-xs font-black transition-all",
                role === "teacher"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              👩‍🏫 Мұғалім
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Student Avatar Chooser */}
            {role === "student" && (
              <div className="space-y-2 text-left">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Өз кейіпкеріңді (маскот) таңда:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((item) => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(item.emoji)}
                      className={cn(
                        "aspect-square rounded-2xl border-2 flex items-center justify-center text-2xl transition-all",
                        selectedAvatar === item.emoji
                          ? "border-amber-400 bg-amber-100 ring-2 ring-amber-300 scale-110 shadow-sm"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      )}
                      title={item.name}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grade Level Chooser */}
            {role === "student" && (
              <div className="space-y-2 text-left">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Қай сыныпта оқисың?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([1, 2, 3, 4] as GradeLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setGrade(lvl)}
                      className={cn(
                        "py-2.5 rounded-2xl border-2 text-xs font-black transition-all",
                        grade === lvl
                          ? "bg-edu-sky-500 text-white border-edu-sky-600 shadow-kid-sky"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {lvl}-сынып
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inputs */}
            <Input
              label="Аты-жөніңіз"
              type="text"
              placeholder="Мысалы: Алихан Сұлтан"
              icon={<User className="w-5 h-5" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Мектеп немесе қала"
              type="text"
              placeholder="Мысалы: №84 мектеп-лицей, Астана"
              icon={<School className="w-5 h-5" />}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />

            <Input
              label="Электронды пошта немесе логин"
              type="text"
              placeholder="alihan@example.kz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Құпиясөз ойлап табыңыз"
              type="password"
              placeholder="Ең кемі 6 таңба"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="yellow"
              size="lg"
              disabled={loading}
              className="w-full justify-center text-base"
            >
              {loading ? "Тіркелуде..." : "Тіркелу және +100 тиын алу 🎁"}
            </Button>
          </form>

          {/* Login link */}
          <div className="text-center text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
            Аккаунтыңыз бар ма?{" "}
            <Link href="/auth/login" className="font-extrabold text-edu-sky-600 hover:underline">
              Кіру
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

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Жүктелуде...</div>}>
      <RegisterContent />
    </React.Suspense>
  );
}

