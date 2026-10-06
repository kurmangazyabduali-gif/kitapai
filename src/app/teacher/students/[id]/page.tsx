"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpen,
  Award,
  Heart,
  Users,
  Flame,
  Star,
  CheckCircle2,
  Clock,
  MessageCircle,
  BrainCircuit,
  Calendar,
  Sparkles,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import {
  MOCK_TEACHER_CLASS_STUDENTS,
  TeacherStudentItem,
} from "@/lib/teacher-data";
import {
  getStoredSubmissions,
  approveGoodDeedSubmission,
} from "@/lib/good-deeds-data";
import {
  getStoredFamilySubmissions,
  approveFamilySubmission,
} from "@/lib/family-data";
import { GAMIFICATION_BADGES } from "@/lib/gamification";

export default function TeacherStudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = (params?.id as string) || "std-1";

  const student: TeacherStudentItem =
    MOCK_TEACHER_CLASS_STUDENTS.find((s) => s.id === studentId) ||
    MOCK_TEACHER_CLASS_STUDENTS[0];

  const [activeTab, setActiveTab] = React.useState<
    "overview" | "reading" | "quizzes" | "deeds" | "family" | "badges"
  >("overview");

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleApproveDeed = (deedId: string) => {
    approveGoodDeedSubmission(
      deedId,
      "teacher",
      "Айнұр Серікқызы (Мұғалім)",
      "Жарайсың! Өте үлгілі жақсы іс!"
    );
    confetti({ particleCount: 70, spread: 60 });
    setToastMessage("Жақсы іс мұғалім тарапынан расталды! (+20 XP) ✓");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/teacher/students">
          <Button variant="ghost" size="sm" className="font-bold text-xs gap-1.5 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
            <span>← Сынып тізіміне қайту</span>
          </Button>
        </Link>
        <Badge variant="sky" size="md">
          {student.class_name} сыныбы
        </Badge>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-4 rounded-3xl bg-emerald-500 text-white shadow-kid-md flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2 font-black text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs text-white/80">
            ✕
          </button>
        </div>
      )}

      {/* Student Profile Card */}
      <div className="p-6 sm:p-8 rounded-4xl bg-gradient-to-r from-edu-sky-500 via-indigo-600 to-purple-600 text-white shadow-kid-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <Avatar emoji={student.avatar_emoji} name={student.full_name} size="lg" borderVariant="gold" />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              <span>{student.level_badge} {student.level_name}</span>
              <span>•</span>
              <span className="capitalize">{student.reading_level} оқырман</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">{student.full_name}</h1>

            <div className="flex items-center gap-3 text-xs text-sky-100 font-semibold flex-wrap">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                Ата-анасы: {student.parent_name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {student.parent_phone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/20 w-full md:w-auto justify-around">
          <div className="text-center">
            <span className="text-xs text-sky-200 font-bold block">Жалпы ұпай</span>
            <span className="text-xl font-black text-amber-300">⭐ {student.points} XP</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="text-xs text-sky-200 font-bold block">Оқу сериясы</span>
            <span className="text-xl font-black text-rose-300">🔥 {student.streak_days} күн</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="text-xs text-sky-200 font-bold block">Дәлдік</span>
            <span className="text-xl font-black text-emerald-300">{student.comprehension_score}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-edu-sky-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          📊 Жалпы шолу & AI Диагноз
        </button>
        <button
          onClick={() => setActiveTab("reading")}
          className={`px-4 py-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${
            activeTab === "reading"
              ? "bg-edu-sky-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          📚 Оқылған кітаптар ({student.recent_books.length})
        </button>
        <button
          onClick={() => setActiveTab("deeds")}
          className={`px-4 py-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${
            activeTab === "deeds"
              ? "bg-edu-sky-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          ❤️ Жақсы істер ({student.recent_deeds.length})
        </button>
        <button
          onClick={() => setActiveTab("family")}
          className={`px-4 py-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${
            activeTab === "family"
              ? "bg-edu-sky-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          👨‍👩‍👧 Отбасылық әрекеттер ({student.recent_family.length})
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${
            activeTab === "badges"
              ? "bg-edu-sky-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🏅 Медальдар мен жетістіктер
        </button>
      </div>

      {/* TAB 1: OVERVIEW & AI DIAGNOSIS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Pedagogical Note */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 space-y-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-purple-950">
                  AI Педагогикалық Диагнозы & Сипаттамасы
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-purple-100 space-y-2 text-xs">
                <p className="font-extrabold text-slate-800 leading-relaxed">
                  «{student.ai_summary_note}»
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold text-slate-500">
                  <span>Оқу сапасы индексі: <strong className="text-purple-700">{student.comprehension_score}%</strong></span>
                  <span>Серия: <strong className="text-rose-600">{student.streak_days} күн</strong></span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                💡 <strong>Ұстазға ұсыныс:</strong> Баланың қамқорлық және мейірімділік қасиеттерін мадақтап, сыныптастарына үлгі ету ұсынылады.
              </div>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-xl block mb-1">📚</span>
                <span className="text-base font-black text-slate-800">{student.books_read}</span>
                <span className="text-[10px] text-slate-400 block font-bold">Оқылған кітап</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-xl block mb-1">🎮</span>
                <span className="text-base font-black text-slate-800">{student.games_completed}</span>
                <span className="text-[10px] text-slate-400 block font-bold">Ойын орындалды</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-xl block mb-1">❤️</span>
                <span className="text-base font-black text-slate-800">{student.good_deeds_count}</span>
                <span className="text-[10px] text-slate-400 block font-bold">Жақсы істер</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-xl block mb-1">👨‍👩‍👧</span>
                <span className="text-base font-black text-slate-800">{student.family_tasks_count}</span>
                <span className="text-[10px] text-slate-400 block font-bold">Отбасылық әрекет</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-edu-sky-600" />
                <span>Оқушының соңғы әрекеттері</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-black text-slate-800">
                    <span>📖 «Мақта қыз бен мысық»</span>
                    <span className="text-[10px] text-slate-400">Бүгін</span>
                  </div>
                  <p className="text-slate-500 font-medium">Ертегіні 100% оқып, түсін тестін тапсырды (+20 XP)</p>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-black text-rose-900">
                    <span>❤️ Құстарға жем беру</span>
                    <span className="text-[10px] text-slate-400">Кеше</span>
                  </div>
                  <p className="text-slate-600 font-medium">Жақсы іс жасап, фотосын жүктеді (+20 XP)</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-black text-emerald-900">
                    <span>👨‍👩‍👧 20 минут кешкі оқу</span>
                    <span className="text-[10px] text-slate-400">3 күн бұрын</span>
                  </div>
                  <p className="text-slate-600 font-medium">Отбасымен оқу челенджі орындалды (+20 XP)</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: READING PROGRESS */}
      {activeTab === "reading" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {student.recent_books.map((b) => (
            <Card key={b.id} className="p-5 bg-white border-2 border-slate-200 space-y-3">
              <Badge variant="sky" size="sm">
                {b.category}
              </Badge>
              <h4 className="font-black text-slate-900 text-sm">{b.title}</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Оқылуы:</span>
                  <span className="text-emerald-700">{b.progress}%</span>
                </div>
                <Progress value={b.progress} variant="green" height="sm" />
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold">
                <span className="text-slate-400">{b.completed_at}</span>
                <span className="text-amber-800 font-black">Тест: {b.score}%</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: GOOD DEEDS */}
      {activeTab === "deeds" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.recent_deeds.map((d) => (
            <Card key={d.id} className="p-5 bg-white border-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                  {d.value_emoji} {d.value_name}
                </span>
                <span className="text-xs font-bold text-slate-400">{d.date}</span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">{d.title}</h4>
              <p className="text-xs text-slate-600">{d.description}</p>
              {d.image_url && (
                <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {d.status === "approved" ? (
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Расталған ✓
                  </span>
                ) : (
                  <Button
                    variant="green"
                    size="sm"
                    onClick={() => handleApproveDeed(d.id)}
                    className="text-xs font-black"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Мұғалім ретінде растау</span>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: FAMILY ACTIVITIES */}
      {activeTab === "family" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.recent_family.map((f) => (
            <Card key={f.id} className="p-5 bg-white border-2 border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="green" size="sm">
                  {f.week_number}-апта челенджі
                </Badge>
                <span className="text-xs font-bold text-slate-400">{f.date}</span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">{f.title}</h4>
              <p className="text-xs text-slate-600 italic">«{f.text}»</p>
              <div className="pt-2 border-t border-emerald-100">
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ата-ана растаған ❤️
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 5: BADGES */}
      {activeTab === "badges" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {GAMIFICATION_BADGES.map((b) => (
            <Card key={b.id} className="p-4 bg-white border-2 border-amber-200 text-center space-y-2">
              <span className="text-4xl block animate-wiggle">{b.emoji}</span>
              <h4 className="font-black text-xs text-slate-900">{b.title}</h4>
              <p className="text-[10px] text-slate-500">{b.description}</p>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                ✓ Ашылған
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
