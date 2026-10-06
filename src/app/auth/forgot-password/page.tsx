"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await forgotPassword(email);
    setLoading(false);
    setSent(true);
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
            <div className="text-5xl mb-2">🔑</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Құпиясөзді қалпына келтіру
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Тіркелген электронды поштаңызды енгізіңіз, сілтеме жібереміз.
            </p>
          </div>

          {sent ? (
            <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-black text-emerald-950">
                Хат сәтті жіберілді! ✉️
              </h4>
              <p className="text-xs text-emerald-800 font-medium">
                <strong>{email}</strong> поштаңызды тексеріп, хаттағы сілтеме арқылы жаңа құпиясөз орнатыңыз.
              </p>
              <Link href={`/auth/reset-password?email=${encodeURIComponent(email)}`}>
                <Button variant="green" size="sm" className="w-full mt-2 justify-center">
                  Жаңа құпиясөз орнату парақшасына өту →
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Электронды пошта"
                type="email"
                placeholder="example@kitaptan.kz"
                icon={<Mail className="w-5 h-5" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="sky"
                size="lg"
                disabled={loading}
                className="w-full justify-center text-base"
              >
                {loading ? "Жіберілуде..." : "Сілтемені жіберу ✉️"}
              </Button>
            </form>
          )}

          <div className="text-center text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
            Құпиясөз есіңізде ме?{" "}
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
