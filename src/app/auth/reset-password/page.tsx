"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

function ResetPasswordContent() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Құпиясөздер бір-біріне сәйкес келмейді!");
      return;
    }
    if (password.length < 6) {
      setError("Құпиясөз ұзындығы кемінде 6 таңбадан тұруы тиіс.");
      return;
    }

    setLoading(true);
    await resetPassword(password);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-edu-sky-50 via-amber-50/50 to-purple-50 flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Кіру бетіне оралу</span>
        </Link>

        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-edu-sky-600 stroke-[2.5]" />
          <span className="font-black text-slate-800 text-sm hidden sm:inline">
            Кітаптан – жақсы іске
          </span>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto my-8">
        <Card className="p-6 sm:p-8 border-3 border-slate-200 shadow-2xl bg-white space-y-6">
          <div className="text-center space-y-2">
            <div className="text-5xl mb-2">🔒✨</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Жаңа құпиясөз орнату
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Өзіңізге ыңғайлы жаңа сенімді құпиясөз енгізіңіз.
            </p>
          </div>

          {success ? (
            <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-black text-emerald-950">
                Құпиясөз сәтті жаңартылды! 🎉
              </h4>
              <p className="text-xs text-emerald-800 font-medium">
                Кіру парақшасына бағытталудасыз...
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <Input
                label="Жаңа құпиясөз"
                type="password"
                placeholder="Ең кемі 6 таңба"
                icon={<Lock className="w-5 h-5" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Жаңа құпиясөзді қайталаңыз"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="yellow"
                size="lg"
                disabled={loading}
                className="w-full justify-center text-base"
              >
                {loading ? "Сақталуда..." : "Құпиясөзді жаңарту 🔒"}
              </Button>
            </form>
          )}

          <div className="text-center text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
            Кіруге оралу:{" "}
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

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Жүктелуде...</div>}>
      <ResetPasswordContent />
    </React.Suspense>
  );
}
