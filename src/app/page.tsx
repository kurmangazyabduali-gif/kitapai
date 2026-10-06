"use client";

import * as React from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Heart,
  Sparkles,
  Flame,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Gamepad2,
  School,
  Smile,
  ChevronDown,
  Play,
  Star,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { FormulaSteps } from "@/components/ui/formula-steps";
import { Modal } from "@/components/ui/modal";
import { MOCK_BOOKS, MOCK_GOOD_DEEDS, MOCK_ACHIEVEMENTS } from "@/lib/mock-data";
import { Book } from "@/types/database.types";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user, role, getRoleDashboardUrl } = useAuth();
  const dashboardHref = role ? getRoleDashboardUrl(role) : "/student/dashboard";
  const [selectedGrade, setSelectedGrade] = React.useState<number | "all">("all");
  const [activeBookModal, setActiveBookModal] = React.useState<Book | null>(null);
  const [faqOpen, setFaqOpen] = React.useState<number | null>(null);
  const [likes, setLikes] = React.useState<Record<string, number>>({
    "deed-1": 24,
    "deed-2": 19,
    "deed-3": 31,
  });

  const handleConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#38BDF8", "#FACC15", "#4ADE80", "#C084FC", "#FB7185"],
    });
  };

  const handleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    handleConfetti();
  };

  const filteredBooks =
    selectedGrade === "all"
      ? MOCK_BOOKS
      : MOCK_BOOKS.filter((b) => b.grade_level === selectedGrade);

  const faqs = [
    {
      q: "«Кітаптан – жақсы іске» жобасының негізгі мақсаты қандай?",
      a: "Бастауыш сынып (1–4 сынып) оқушыларының кітап оқуға деген қызығушылығын арттырып қана қоймай, оқыған шығармадан алған тәрбиелік өнегені шынайы өмірде жақсы іске айналдыруға үйрету.",
    },
    {
      q: "Платформа 5 қадамдық жүйемен қалай жұмыс істейді?",
      a: "1) ОҚЫ: бала кітапты оқиды; 2) ТҮСІН: тәрбиелік мәнін ұғынады; 3) ОЙНА: викториналар арқылы білімін бекітеді; 4) ЖАҚСЫ ІС ЖАСА: нақты тапсырманы орындайды; 5) ОТБАСЫҢМЕН БӨЛІС: ата-анасына көрсетіп, күнделікке салады.",
    },
    {
      q: "Ата-аналар баласының жақсы ісін қалай растайды?",
      a: "Бала жақсы іс жасағанда (мысалы, гүл суғарғанда немесе құстарға жемсалғыш жасағанда) суретін жүктейді. Ата-ана өз кабинетінен оны көріп, «Расталды» батырмасын басып, жылы лебіз қалдырады.",
    },
    {
      q: "Мұғалімдер үшін қандай мүмкіндіктер бар?",
      a: "Мұғалімдер өз сыныбының оқырмандық белсенділігін, оқылған кітаптар санын және балалардың жасаған қайырымды істерін ортақ сынып рейтингісінен қадағалай алады.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF7]">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b-2 border-slate-100">
        {/* Background decorative playful circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-sky-100/60 via-amber-100/40 to-purple-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute -top-10 right-10 text-6xl opacity-30 select-none animate-float">
          ✨
        </div>
        <div className="absolute bottom-20 left-8 text-5xl opacity-30 select-none animate-wiggle">
          🌟
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-edu-sky-100/90 text-edu-sky-800 border-2 border-edu-sky-200/80 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
                <Sparkles className="w-4 h-4 text-edu-sky-600 animate-spin" />
                <span>Бастауыш сыныптарға арналған EdTech платформа</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
                «Әр оқылған кітап — <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-edu-sky-500 via-edu-purple-500 to-edu-coral-500 bg-clip-text text-transparent">
                  бір жақсы әрекетке
                </span>{" "}
                бастайды!»
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-semibold leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Кітап оқып қана қоймай, одан өнеге ал! Интерактивті ойындар ойна, нақты жақсы істер жаса және отбасыңмен бірге қуан!
              </p>

              {/* 5-Step Mini Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                <span className="bg-white border-2 border-sky-200 text-sky-700 px-3 py-1 rounded-2xl text-xs font-black shadow-sm">
                  📚 ОҚЫ
                </span>
                <span className="text-slate-300 font-black">→</span>
                <span className="bg-white border-2 border-amber-200 text-amber-700 px-3 py-1 rounded-2xl text-xs font-black shadow-sm">
                  💡 ТҮСІН
                </span>
                <span className="text-slate-300 font-black">→</span>
                <span className="bg-white border-2 border-purple-200 text-purple-700 px-3 py-1 rounded-2xl text-xs font-black shadow-sm">
                  🎮 ОЙНА
                </span>
                <span className="text-slate-300 font-black">→</span>
                <span className="bg-white border-2 border-rose-200 text-rose-700 px-3 py-1 rounded-2xl text-xs font-black shadow-sm">
                  ❤️ ЖАҚСЫ ІС
                </span>
                <span className="text-slate-300 font-black">→</span>
                <span className="bg-white border-2 border-emerald-200 text-emerald-700 px-3 py-1 rounded-2xl text-xs font-black shadow-sm">
                  👨‍👩‍👧 ОТБАСЫ
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button variant="yellow" size="xl" className="w-full justify-center text-base sm:text-lg">
                    <span>Саяхатты бастау 🎒</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </Button>
                </Link>

                <Link href={dashboardHref} className="w-full sm:w-auto">
                  <Button variant="sky" size="xl" className="w-full justify-center text-base sm:text-lg">
                    <span>{user ? "Жеке кабинетке өту 🚀" : "Оқушы кабинеті 🚀"}</span>
                  </Button>
                </Link>

                <button
                  onClick={handleConfetti}
                  className="p-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 font-bold text-sm shadow-sm transition-all active:scale-95"
                  title="Мерекелік шашу!"
                >
                  🎉 Шашу шаш
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-slate-500 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-edu-green-500" />
                  <span>100% Тегін және қауіпсіз</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-edu-green-500" />
                  <span>1–4 сыныпқа арналған</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-edu-green-500" />
                  <span>Қазақ тілінде</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mascot & Hero Showcase Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Main Hero Card */}
                <div className="rounded-5xl bg-white p-6 sm:p-8 border-4 border-edu-sky-200 shadow-2xl relative z-10 space-y-6">
                  {/* Top Live Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-edu-green-500 animate-ping" />
                      <span className="text-xs font-extrabold text-slate-700">
                        Бүгінгі оқушы миссиясы
                      </span>
                    </div>
                    <Badge variant="yellow" size="sm">
                      +100 Ұпай 🪙
                    </Badge>
                  </div>

                  {/* Character & Book preview */}
                  <div className="rounded-3xl bg-gradient-to-br from-edu-sky-100 via-amber-50 to-purple-100 p-6 border-2 border-edu-sky-200 text-center relative overflow-hidden group">
                    <div className="text-7xl mb-3 animate-bounce">
                      🦁
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      «Мақта қыз бен мысық»
                    </h3>
                    <p className="text-xs font-bold text-slate-600 mt-1">
                      Қазақ халық ертегісі
                    </p>

                    {/* Deed prompt inside hero card */}
                    <div className="mt-4 p-3 rounded-2xl bg-white/90 border border-rose-200 text-left flex items-start gap-2.5 shadow-sm">
                      <span className="text-2xl">❤️</span>
                      <div>
                        <p className="text-[11px] font-black uppercase text-rose-600">
                          Жақсы іс тапсырмасы:
                        </p>
                        <p className="text-xs font-bold text-slate-800">
                          «Үй жануарына немесе құстарға жем беріп, қамқор бол!»
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Live Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-extrabold text-slate-600">
                      <span>Оқылған кітаптар</span>
                      <span className="text-edu-sky-600 font-black">12 / 15 кітап</span>
                    </div>
                    <div className="w-full h-4 rounded-full bg-slate-100 p-0.5 border border-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-edu-sky-400 to-edu-green-400 candy-stripes transition-all duration-500 w-[80%]" />
                    </div>
                  </div>

                  {/* Quick interactive deed button */}
                  <button
                    onClick={handleConfetti}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-edu-coral-500 to-amber-500 hover:from-edu-coral-400 hover:to-amber-400 text-white font-extrabold text-sm border-b-4 border-rose-700 shadow-md active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Жақсы істі орындадым! 💖</span>
                  </button>
                </div>

                {/* Floating decorative metric badge 1 */}
                <div className="absolute -top-6 -left-6 bg-white p-3.5 rounded-3xl border-2 border-amber-300 shadow-kid-md flex items-center gap-2 z-20 animate-float hidden sm:flex">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Оқу сериясы</p>
                    <p className="text-xs font-black text-amber-900">7 күн қатарынан!</p>
                  </div>
                </div>

                {/* Floating decorative metric badge 2 */}
                <div className="absolute -bottom-6 -right-6 bg-white p-3.5 rounded-3xl border-2 border-edu-green-300 shadow-kid-md flex items-center gap-2 z-20 animate-float-slow hidden sm:flex">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Жақсы істер</p>
                    <p className="text-xs font-black text-edu-green-800">3500+ іс жасалды</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Platform Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <StatCard
              title="Белсенді оқушылар"
              value="1 200+"
              subtitle="1-4 сынып оқушылары"
              icon="🎒"
              variant="sky"
            />
            <StatCard
              title="Таңдаулы кітаптар"
              value="120+"
              subtitle="Ертегілер мен әңгімелер"
              icon="📚"
              variant="yellow"
            />
            <StatCard
              title="Жасалған жақсы істер"
              value="3 850+"
              subtitle="Шынайы өмірдегі ізгілік"
              icon="❤️"
              variant="rose"
            />
            <StatCard
              title="Қатысушы мектептер"
              value="45+"
              subtitle="Еліміздің түкпір-түкпірінен"
              icon="🏫"
              variant="green"
            />
          </div>
        </div>
      </section>

      {/* 2. THE 5-STAGE FORMULA SECTION */}
      <section id="formula" className="py-16 sm:py-24 bg-white border-b-2 border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="purple" size="lg">
              Тұжырымдама мен Әдістеме 🎯
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              «Кітаптан – жақсы іске» <br />
              <span className="text-edu-purple-600">5 кезеңді бірегей формуласы</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              Оқушы тек кітап оқып қана қоймайды. Ол мазмұнын терең түсінеді, ойын арқылы білімін бекітеді, содан соң шынайы өмірде жақсы іс жасап, отбасымен бөліседі.
            </p>
          </div>

          {/* Interactive 5 Steps Component */}
          <FormulaSteps />
        </div>
      </section>

      {/* 3. INTERACTIVE BOOK SHELF SHOWCASE */}
      <section id="books" className="py-16 sm:py-24 bg-edu-sky-50/50 border-b-2 border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <Badge variant="sky" size="lg">
                Кітап сөресі 📚
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                Әр кітап — бір жақсы іске шақырады
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl">
                Қазақ балалар әдебиетінің ең қызықты туындылары. Кітапты таңдап, оның қандай жақсы іс ұсынатынын көр!
              </p>
            </div>

            {/* Grade Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedGrade("all")}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                  selectedGrade === "all"
                    ? "bg-edu-sky-500 text-white shadow-kid-sky"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                Барлығы
              </button>
              {[1, 2, 3, 4].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade as number)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                    selectedGrade === grade
                      ? "bg-edu-sky-500 text-white shadow-kid-sky"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {grade}-сынып
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                interactive
                onClick={() => setActiveBookModal(book)}
                className="bg-white border-2 border-slate-200 flex flex-col justify-between group hover:border-edu-sky-300"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="sky" size="sm">
                      {book.grade_level}-сынып
                    </Badge>
                    <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      +{book.points_reward} тиын 🪙
                    </span>
                  </div>

                  {/* Title & Author */}
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-edu-sky-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {book.author}
                  </p>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Moral & Deed Callout */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-edu-yellow-50/80 border border-edu-yellow-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                      <span>❤️</span>
                      <span>Жақсы іс бағыты:</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {book.good_deed_prompt}
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-xs font-bold text-slate-400">
                    ⏱️ ~{book.reading_time_minutes} минут оқу
                  </span>
                  <Link href={`/student/library/${book.id}/read`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="sky" size="sm" className="text-xs">
                      Оқу & Тапсырма 📖
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE GOOD DEEDS SHOWCASE (Жақсы істер тақтасы) */}
      <section id="deeds" className="py-16 sm:py-24 bg-white border-b-2 border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="coral" size="lg">
              Жақсы істер тақтасы ❤️
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
              Балалардың жасаған ізгі істері
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Оқушылар кітаптан шабыт алып, күн сайын ата-анасына көмектеседі, табиғатты қорғайды және достарына қол ұшын созады.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_GOOD_DEEDS.map((deed) => (
              <Card
                key={deed.id}
                className="bg-white border-2 border-slate-200 flex flex-col justify-between"
              >
                <div>
                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar emoji={deed.student_avatar} name={deed.student_name} size="sm" />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {deed.student_name}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-400">
                          «{deed.book_title}» бойынша
                        </p>
                      </div>
                    </div>

                    {deed.family_confirmed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Ата-анасы растаған
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-base text-slate-800 leading-snug">
                    {deed.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {deed.description}
                  </p>
                </div>

                {/* Footer action with heart like */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    #{deed.category}
                  </span>

                  <button
                    onClick={() => handleLike(deed.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-extrabold text-xs transition-colors active:scale-90"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{likes[deed.id] || deed.likes_count}</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="/auth/register">
              <Button variant="coral" size="lg">
                <span>Сен де өз жақсы ісіңмен бөліс! 📸</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FAMILY & TEACHER CONNECTION SECTION */}
      <section id="family" className="py-16 sm:py-24 bg-gradient-to-b from-[#FEFCE8]/60 to-[#F0FDF4]/60 border-b-2 border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="green" size="lg">
              Үштік одақ: Бала • Ата-ана • Мектеп 🤝
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
              Отбасылық құндылық және Мектеп тәрбиесі
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Платформа отбасы мен мектеп арасындағы байланысты цифрлық жаңа деңгейге көтереді.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Parents Card */}
            <div className="p-8 rounded-4xl bg-white border-3 border-amber-200 shadow-kid-md space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
                👨‍👩‍👧
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Ата-аналарға арналған мүмкіндіктер
              </h3>
              <ul className="space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Балаңыздың күнделікті оқу уақыты мен оқыған кітаптарын көру</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Оқушы орындаған жақсы істерді растап, жылы лебіз бен мақтау жазу</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Отбасылық күнделік пен фотоальбомды бірге толтыру</span>
                </li>
              </ul>
              <Link href="/auth/register?role=parent" className="inline-block">
                <Button variant="yellow" size="md">
                  Ата-ана болып қосылу 👨‍👩‍👧
                </Button>
              </Link>
            </div>

            {/* Teachers Card */}
            <div className="p-8 rounded-4xl bg-white border-3 border-edu-sky-200 shadow-kid-md space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-edu-sky-500 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                👩‍🏫
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Бастауыш сынып мұғалімдеріне
              </h3>
              <ul className="space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-edu-sky-600 flex-shrink-0 mt-0.5" />
                  <span>Сыныптың жалпы оқырмандық статистикасы мен рейтингісі</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-edu-sky-600 flex-shrink-0 mt-0.5" />
                  <span>Тәрбие сағаттарына арналған дайын интерактивті ертегілер мен сұрақтар</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-edu-sky-600 flex-shrink-0 mt-0.5" />
                  <span>Оқушылардың ізгілік белсенділігін марапаттау құралдары</span>
                </li>
              </ul>
              <Link href="/auth/register?role=teacher" className="inline-block">
                <Button variant="sky" size="md">
                  Мұғалім ретінде тіркелу 👩‍🏫
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-white border-b-2 border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <Badge variant="neutral" size="lg">
              Сұрақ-жауап ❓
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Жиі қойылатын сұрақтар
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  className="rounded-3xl border-2 border-slate-200 bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-slate-800 text-base sm:text-lg"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-edu-sky-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 font-medium leading-relaxed animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BIG MOTIVATIONAL CTA BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-edu-sky-500 via-edu-purple-600 to-edu-coral-500 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="text-6xl animate-bounce">🎒✨</div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Кітаппен достасып, <br />
            жақсы іс жасауға дайынсың ба?
          </h2>
          <p className="text-base sm:text-xl text-sky-100 font-semibold max-w-2xl mx-auto">
            Қазір тегін тіркеліп, өз кейіпкеріңді таңда және алғашқы алтын тиындарыңды ұтып ал!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="yellow" size="xl" className="font-black text-lg">
                Қазір тегін тіркелу 🚀
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="white" size="xl" className="font-black text-lg">
                Демо-кабинетті көру 👀
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Book Detail Modal */}
      {activeBookModal && (
        <Modal
          isOpen={!!activeBookModal}
          onClose={() => setActiveBookModal(null)}
          title={activeBookModal.title}
          description={`${activeBookModal.author} • ${activeBookModal.grade_level}-сынып`}
          emoji="📖"
          maxWidth="lg"
        >
          <div className="space-y-4 text-left">
            <p className="text-sm text-slate-700 leading-relaxed">
              {activeBookModal.description}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-1">
              <p className="text-xs font-black uppercase text-amber-900">
                💡 Шығармадан түйетін басты өнеге:
              </p>
              <p className="text-xs font-bold text-slate-800">
                {activeBookModal.moral_lesson}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 space-y-1">
              <p className="text-xs font-black uppercase text-rose-800">
                ❤️ Ұсынылатын жақсы іс тапсырмасы:
              </p>
              <p className="text-xs font-bold text-slate-800">
                {activeBookModal.good_deed_prompt}
              </p>
            </div>

            <div className="pt-4 flex gap-3">
              <Link href={`/student/library/${activeBookModal.id}/read`} className="w-full">
                <Button variant="sky" className="w-full justify-center">
                  Оқуды бастау (+{activeBookModal.points_reward} балл) 🚀
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}
