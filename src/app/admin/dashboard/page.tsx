"use client";

import * as React from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Shield,
  Users,
  School,
  BookOpen,
  Heart,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  Gamepad2,
  HelpCircle,
  Award,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  Search,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  MOCK_CLASS_COMPARISON,
  MOCK_WEEKLY_ACTIVITY,
  getAdminBooks,
  saveAdminBook,
  deleteAdminBook,
  ClassComparisonItem,
} from "@/lib/admin-data";
import { Book, MoralValueKey, ReaderSkillCategory } from "@/types/database.types";

export default function AdminDashboardPage() {
  const [classes] = React.useState<ClassComparisonItem[]>(MOCK_CLASS_COMPARISON);
  const [books, setBooks] = React.useState<Book[]>([]);
  const [activeAnalyticsTab, setActiveAnalyticsTab] = React.useState<
    "weekly" | "monthly" | "reading" | "quiz" | "deeds" | "family"
  >("weekly");

  // Admin CRUD Modals
  const [activeCrudModal, setActiveCrudModal] = React.useState<
    "add_book" | "add_quiz" | "add_game" | "add_deed" | "add_family" | null
  >(null);

  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<{
    type: string;
    id: string;
    title: string;
  } | null>(null);

  // Book Form State
  const [bookTitle, setBookTitle] = React.useState("");
  const [bookAuthor, setBookAuthor] = React.useState("");
  const [bookCategory, setBookCategory] = React.useState<any>("kazakh_tales");
  const [bookDesc, setBookDesc] = React.useState("");
  const [bookContent, setBookContent] = React.useState("");
  const [bookDifficulty, setBookDifficulty] = React.useState<any>("жеңіл");
  const [bookAgeGroup, setBookAgeGroup] = React.useState("7-10 жас");
  const [bookGradeLevel, setBookGradeLevel] = React.useState(2);
  const [bookAudioUrl, setBookAudioUrl] = React.useState("");
  const [bookCoverUrl, setBookCoverUrl] = React.useState("");
  const [bookMoralLesson, setBookMoralLesson] = React.useState("");
  const [bookGoodDeedPrompt, setBookGoodDeedPrompt] = React.useState("");

  // Quiz Form State
  const [quizQuestion, setQuizQuestion] = React.useState("");
  const [quizOptions, setQuizOptions] = React.useState(["", "", ""]);
  const [quizCorrectIndex, setQuizCorrectIndex] = React.useState(0);
  const [quizSkill, setQuizSkill] = React.useState<ReaderSkillCategory>("text_comprehension");

  // Good Deed Form State
  const [deedValue, setDeedValue] = React.useState<MoralValueKey>("kindness");
  const [deedTitle, setDeedTitle] = React.useState("");
  const [deedDesc, setDeedDesc] = React.useState("");
  const [deedPoints, setDeedPoints] = React.useState(20);
  const [deedDeadline, setDeedDeadline] = React.useState("2026-10-15");

  // Family Challenge Form State
  const [famTitle, setFamTitle] = React.useState("");
  const [famDesc, setFamDesc] = React.useState("");
  const [famWeek, setFamWeek] = React.useState(1);
  const [famPoints, setFamPoints] = React.useState(20);

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const reloadBooks = React.useCallback(() => {
    setBooks(getAdminBooks());
  }, []);

  React.useEffect(() => {
    reloadBooks();
  }, [reloadBooks]);

  // Handle Create Book
  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    saveAdminBook({
      title: bookTitle.trim(),
      author: bookAuthor.trim() || "Қазақ халық ертегісі",
      category: bookCategory,
      category_name_kk:
        bookCategory === "kazakh_tales"
          ? "Қазақ ертегілері"
          : bookCategory === "children_literature"
          ? "Балалар әдебиеті"
          : bookCategory === "children_magazines"
          ? "Балалар журналдары"
          : "Қысқа әңгімелер",
      description: bookDesc.trim() || "Тәрбиелік мәні зор шығарма",
      content: bookContent.split("\n\n").filter(Boolean),
      difficulty: bookDifficulty,
      age_group: bookAgeGroup,
      grade_level: bookGradeLevel as any,
      reading_time_minutes: 8,
      estimated_minutes: 8,
      total_pages: Math.max(1, bookContent.split("\n\n").length),
      cover_url:
        bookCoverUrl ||
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
      audio_url: bookAudioUrl || undefined,
      moral_lesson: bookMoralLesson || "Жақсылық жасау және білім алу",
      good_deed_prompt: bookGoodDeedPrompt || "Бір адамға қол ұшын соз",
      points_reward: 10,
      coins_reward: 20,
    });

    reloadBooks();
    setActiveCrudModal(null);
    confetti({ particleCount: 70, spread: 60 });
    setToastMessage(`Жаңа кітап қорына сәтті қосылды: «${bookTitle}» 📚`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deleteConfirmation) return;

    if (deleteConfirmation.type === "book") {
      deleteAdminBook(deleteConfirmation.id);
      reloadBooks();
      setToastMessage(`Кітап базадан өшірілді: «${deleteConfirmation.title}»`);
    }
    setDeleteConfirmation(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. ADMIN TOP HERO BANNER */}
      <div className="p-6 sm:p-9 rounded-4xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b-4 border-amber-400">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Басқару жүйесі (Superadmin) • Мектептік деңгей</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            «Кітаптан – жақсы іске» Басқару тақтасы
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            №271 мектеп-лицейі бойынша <strong>16 сынып</strong>, <strong>486 оқушы</strong> және <strong>24 мұғалімнің</strong> біртұтас мониторингі мен контентті басқару жүйесі.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <Button
            onClick={() => setActiveCrudModal("add_book")}
            variant="yellow"
            size="md"
            className="font-black text-xs shadow-lg"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Кітап қосу 📖</span>
          </Button>

          <Link href="/admin/users">
            <Button
              variant="ghost"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/20"
            >
              <Users className="w-4 h-4 mr-1" />
              <span>Пайдаланушылар 👥</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-3xl bg-emerald-600 text-white shadow-kid-md flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2 font-black text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs text-white/80">
            ✕
          </button>
        </div>
      )}

      {/* 2. 7 CORE SCHOOL-WIDE METRICS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-edu-sky-600" />
            <span>Мектеп бойынша басты көрсеткіштер</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Нақты уақыттағы аналитика
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Оқушылар */}
          <div className="p-3.5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-1">
            <span className="text-xl block">👨‍🎓</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Оқушылар</p>
            <p className="text-lg font-black text-slate-900">486</p>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full block">
              +18 осы айда
            </span>
          </div>

          {/* 2. Мұғалімдер */}
          <div className="p-3.5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-1">
            <span className="text-xl block">👩‍🏫</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Мұғалімдер</p>
            <p className="text-lg font-black text-slate-900">24</p>
            <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-full block">
              100% белсенді
            </span>
          </div>

          {/* 3. Сыныптар */}
          <div className="p-3.5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-1">
            <span className="text-xl block">🏫</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Сыныптар</p>
            <p className="text-lg font-black text-slate-900">16</p>
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full block">
              1-4 сыныптар
            </span>
          </div>

          {/* 4. Оқылған кітаптар */}
          <div className="p-3.5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-1">
            <span className="text-xl block">📚</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Оқылған кітап</p>
            <p className="text-lg font-black text-sky-950">3 420</p>
            <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-full block">
              +280 апталық
            </span>
          </div>

          {/* 5. Ойындар */}
          <div className="p-3.5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-1">
            <span className="text-xl block">🎮</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ойындар</p>
            <p className="text-lg font-black text-purple-950">2 890</p>
            <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full block">
              84% дәлдік
            </span>
          </div>

          {/* 6. Жақсы істер */}
          <div className="p-3.5 rounded-3xl bg-white border-2 border-rose-200 shadow-sm space-y-1">
            <span className="text-xl block">❤️</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Жақсы істер</p>
            <p className="text-lg font-black text-rose-700">1 450</p>
            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full block">
              98% расталған
            </span>
          </div>

          {/* 7. Отбасылық белсенділік */}
          <div className="p-3.5 rounded-3xl bg-white border-2 border-emerald-200 shadow-sm space-y-1">
            <span className="text-xl block">👨‍👩‍👧</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Отбасылық</p>
            <p className="text-lg font-black text-emerald-800">980</p>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full block">
              78% қатысу
            </span>
          </div>
        </div>
      </div>

      {/* 3. ADMIN CRUD MANAGEMENT TOOLBAR */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-edu-sky-600" />
              <span>Admin Content & System Management (CRUD)</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Платформа контентін, викториналарды, ойындар мен құндылықтарды басқару
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Button
            onClick={() => setActiveCrudModal("add_book")}
            variant="sky"
            size="md"
            className="flex-col h-auto py-3 text-center justify-center gap-1 font-black text-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>+ Жаңа кітап қосу</span>
          </Button>

          <Button
            onClick={() => setActiveCrudModal("add_quiz")}
            variant="purple"
            size="md"
            className="flex-col h-auto py-3 text-center justify-center gap-1 font-black text-xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span>+ Quiz сұрағын қосу</span>
          </Button>

          <Button
            onClick={() => setActiveCrudModal("add_game")}
            variant="yellow"
            size="md"
            className="flex-col h-auto py-3 text-center justify-center gap-1 font-black text-xs"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>+ Жаңа ойын құрастыру</span>
          </Button>

          <Button
            onClick={() => setActiveCrudModal("add_deed")}
            variant="coral"
            size="md"
            className="flex-col h-auto py-3 text-center justify-center gap-1 font-black text-xs"
          >
            <Heart className="w-4 h-4" />
            <span>+ Жақсы іс миссиясы</span>
          </Button>

          <Button
            onClick={() => setActiveCrudModal("add_family")}
            variant="green"
            size="md"
            className="flex-col h-auto py-3 text-center justify-center gap-1 font-black text-xs"
          >
            <Users className="w-4 h-4" />
            <span>+ Отбасылық челендж</span>
          </Button>
        </div>
      </Card>

      {/* 4. CLASS COMPARISON MATRIX (2А, 2Ә, 2Б, 2В, 3А...) */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-indigo-600" />
              <span>Сыныптар арасындағы рейтинг пен салыстыру (Class Comparison)</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              2-ші және 3-ші сыныптардың оқу белсенділігі мен нәтижелері
            </p>
          </div>

          <Badge variant="sky" size="sm">
            16 сынып бақылауда
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
              <tr>
                <th className="p-3.5">Сынып</th>
                <th className="p-3.5">Сынып жетекшісі</th>
                <th className="p-3.5">Оқушылар</th>
                <th className="p-3.5">Белсенділік</th>
                <th className="p-3.5">Орташа ұпай</th>
                <th className="p-3.5">📚 Кітап</th>
                <th className="p-3.5">❤️ Жақсы іс</th>
                <th className="p-3.5">👨‍👩‍👧 Отбасылық қатысу</th>
                <th className="p-3.5 text-right">Дәреже</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {classes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="p-3.5 font-black text-slate-900 text-sm">{c.class_name}</td>
                  <td className="p-3.5 text-slate-600 font-bold">{c.teacher_name}</td>
                  <td className="p-3.5">{c.total_students} оқушы</td>
                  <td className="p-3.5 text-emerald-700 font-black">
                    {c.active_students} / {c.total_students} ({Math.round((c.active_students / c.total_students) * 100)}%)
                  </td>
                  <td className="p-3.5 font-black text-amber-900">⭐ {c.average_points} XP</td>
                  <td className="p-3.5 font-bold text-sky-800">{c.books_read}</td>
                  <td className="p-3.5 font-bold text-rose-600">{c.good_deeds_count}</td>
                  <td className="p-3.5 font-bold text-purple-700">{c.family_participation_rate}%</td>
                  <td className="p-3.5 text-right">
                    <Badge
                      variant={
                        c.status_badge === "top"
                          ? "yellow"
                          : c.status_badge === "active"
                          ? "green"
                          : "sky"
                      }
                      size="sm"
                    >
                      {c.status_badge === "top" ? "🏆 Көшбасшы" : c.status_badge === "active" ? "🌟 Белсенді" : "📈 Жақсы"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. 6 ANALYTICS DIMENSIONS TABS & CHARTS */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-edu-sky-600" />
            <span>Жүйелік аналитика (6 Dimensions)</span>
          </h3>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveAnalyticsTab("weekly")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeAnalyticsTab === "weekly" ? "bg-edu-sky-500 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              1. Weekly
            </button>
            <button
              onClick={() => setActiveAnalyticsTab("reading")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeAnalyticsTab === "reading" ? "bg-edu-sky-500 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              2. Reading
            </button>
            <button
              onClick={() => setActiveAnalyticsTab("quiz")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeAnalyticsTab === "quiz" ? "bg-edu-sky-500 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              3. Quiz
            </button>
            <button
              onClick={() => setActiveAnalyticsTab("deeds")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeAnalyticsTab === "deeds" ? "bg-edu-sky-500 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              4. Deeds
            </button>
            <button
              onClick={() => setActiveAnalyticsTab("family")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeAnalyticsTab === "family" ? "bg-edu-sky-500 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              5. Family
            </button>
          </div>
        </div>

        {/* Weekly Chart */}
        {activeAnalyticsTab === "weekly" && (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {MOCK_WEEKLY_ACTIVITY.map((d, i) => (
                <div key={i} className="text-center space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 block">{d.day_short}</span>
                  <div className="h-28 flex items-end justify-center gap-1">
                    <div
                      style={{ height: `${(d.books_read / 150) * 100}%` }}
                      className="w-3 bg-sky-500 rounded-t-lg"
                      title={`Кітап: ${d.books_read}`}
                    />
                    <div
                      style={{ height: `${(d.good_deeds / 150) * 100}%` }}
                      className="w-3 bg-rose-500 rounded-t-lg"
                      title={`Жақсы іс: ${d.good_deeds}`}
                    />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 block">{d.books_read + d.good_deeds}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sky-500" /> Оқылған кітаптар</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500" /> Жасалған жақсы істер</span>
            </div>
          </div>
        )}

        {/* Reading Dimension */}
        {activeAnalyticsTab === "reading" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
              <span className="font-black text-sky-900 block">Қазақ ертегілері: 42%</span>
              <Progress value={42} variant="sky" height="sm" />
              <p className="text-slate-600">1 436 рет оқылды</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="font-black text-amber-900 block">Балалар әдебиеті: 28%</span>
              <Progress value={28} variant="yellow" height="sm" />
              <p className="text-slate-600">958 рет оқылды</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="font-black text-emerald-900 block">Балалар журналдары: 18%</span>
              <Progress value={18} variant="green" height="sm" />
              <p className="text-slate-600">615 рет оқылды</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <span className="font-black text-purple-900 block">Қысқа әңгімелер: 12%</span>
              <Progress value={12} variant="purple" height="sm" />
              <p className="text-slate-600">411 рет оқылды</p>
            </div>
          </div>
        )}

        {/* Quiz Dimension */}
        {activeAnalyticsTab === "quiz" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-black text-slate-800 block">Мәтінді түсіну дәлдігі</span>
              <Progress value={84} variant="green" height="sm" />
              <span className="text-emerald-700 font-black">84% сәттілік</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-black text-slate-800 block">Негізгі ойды анықтау</span>
              <Progress value={68} variant="yellow" height="sm" />
              <span className="text-amber-700 font-black">68% (Қосымша назар қажет)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-black text-slate-800 block">Кейіпкер әрекетін бағалау</span>
              <Progress value={88} variant="green" height="sm" />
              <span className="text-emerald-700 font-black">88% жоғары</span>
            </div>
          </div>
        )}

        {/* Deeds Dimension */}
        {activeAnalyticsTab === "deeds" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="font-black text-rose-900 block">❤️ Мейірімділік</span>
              <span className="text-lg font-black text-rose-700">420 іс</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="font-black text-amber-900 block">💪 Еңбекқорлық</span>
              <span className="text-lg font-black text-amber-700">385 іс</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="font-black text-emerald-900 block">🌱 Қамқорлық</span>
              <span className="text-lg font-black text-emerald-700">350 іс</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
              <span className="font-black text-sky-900 block">🤝 Достық</span>
              <span className="text-lg font-black text-sky-700">295 іс</span>
            </div>
          </div>
        )}

        {/* Family Dimension */}
        {activeAnalyticsTab === "family" && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <h4 className="font-black text-emerald-950 text-sm">«Кітап оқитын отбасы» қатысу белсенділігі: 78%</h4>
              <p className="text-slate-600 font-medium">980 отбасы апталық челендждерге тұрақты қатысуда.</p>
            </div>
            <Link href="/admin/classes">
              <Button variant="green" size="sm" className="font-black text-xs">
                Сыныптарды толық көру →
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* 6. BOOKS MANAGEMENT TABLE WITH DELETE CONFIRMATION */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-edu-sky-600" />
              <span>Кітапхана қоры (Books Catalog: {books.length})</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Платформадағы барлық ертегілер, әңгімелер мен балалар журналдары
            </p>
          </div>

          <Button
            onClick={() => setActiveCrudModal("add_book")}
            variant="yellow"
            size="sm"
            className="font-black text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Жаңа кітап</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
              <tr>
                <th className="p-3.5">Кітап атауы</th>
                <th className="p-3.5">Авторы</th>
                <th className="p-3.5">Санаты</th>
                <th className="p-3.5">Сынып</th>
                <th className="p-3.5">Күрделілігі</th>
                <th className="p-3.5">Оқылу саны</th>
                <th className="p-3.5">Қосылған күні</th>
                <th className="p-3.5 text-right">Әрекеттер</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {books.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="p-3.5 font-black text-slate-900 text-sm flex items-center gap-2">
                    <span className="text-base">📖</span>
                    <span>{b.title}</span>
                  </td>
                  <td className="p-3.5 text-slate-500">{b.author}</td>
                  <td className="p-3.5">
                    <Badge variant="sky" size="sm">{b.category_name_kk}</Badge>
                  </td>
                  <td className="p-3.5 font-bold text-slate-700">{b.grade_level}-сынып</td>
                  <td className="p-3.5 capitalize">{b.difficulty}</td>
                  <td className="p-3.5 font-black text-emerald-800">{b.reads_count} рет</td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {new Date(b.created_at).toLocaleDateString("kk-KZ")}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() =>
                        setDeleteConfirmation({
                          type: "book",
                          id: b.id,
                          title: b.title,
                        })
                      }
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Өшіру"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL 1: ADD BOOK */}
      {activeCrudModal === "add_book" && (
        <Modal
          isOpen={activeCrudModal === "add_book"}
          onClose={() => setActiveCrudModal(null)}
          title="Жаңа кітап / журнал қосу 📖"
          description="Платформа кітапханасына балаларға арналған жаңа шығарма енгізіңіз."
          emoji="📚"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveBook} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-800">Кітап атауы:</label>
                <Input
                  required
                  placeholder="Мысалы: Батыр Баян"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-800">Авторы:</label>
                <Input
                  placeholder="Мысалы: Мағжан Жұмабаев"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-black text-slate-800">Санаты:</label>
                <select
                  value={bookCategory}
                  onChange={(e) => setBookCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                >
                  <option value="kazakh_tales">Қазақ ертегілері</option>
                  <option value="children_literature">Балалар әдебиеті</option>
                  <option value="short_stories">Қысқа әңгімелер</option>
                  <option value="children_magazines">Балалар журналдары</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-800">Сынып дәрежесі:</label>
                <select
                  value={bookGradeLevel}
                  onChange={(e) => setBookGradeLevel(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                >
                  <option value={1}>1-сынып</option>
                  <option value={2}>2-сынып</option>
                  <option value={3}>3-сынып</option>
                  <option value={4}>4-сынып</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-800">Күрделілігі:</label>
                <select
                  value={bookDifficulty}
                  onChange={(e) => setBookDifficulty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                >
                  <option value="жеңіл">Жеңіл</option>
                  <option value="орташа">Орташа</option>
                  <option value="күрделі">Күрделі</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-800">Қысқаша сипаттамасы:</label>
              <textarea
                rows={2}
                placeholder="Кітап не туралы? Балаға қандай қызықты мәлімет береді?.."
                value={bookDesc}
                onChange={(e) => setBookDesc(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs outline-none focus:border-edu-sky-400"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-800">Мәтіні (Беттерді 2 рет Enter арқылы бөл):</label>
              <textarea
                required
                rows={4}
                placeholder="1-бет мәтіні...&#10;&#10;2-бет мәтіні...&#10;&#10;3-бет мәтіні..."
                value={bookContent}
                onChange={(e) => setBookContent(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs outline-none focus:border-edu-sky-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-800">Өнегелік тағылымы (Moral lesson):</label>
                <Input
                  placeholder="Мысалы: Достық пен адалдықты қадірлеу"
                  value={bookMoralLesson}
                  onChange={(e) => setBookMoralLesson(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-800">Жақсы іс ұсынысы:</label>
                <Input
                  placeholder="Мысалы: Досыңа жылы сөз айт"
                  value={bookGoodDeedPrompt}
                  onChange={(e) => setBookGoodDeedPrompt(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setActiveCrudModal(null)}
                className="w-1/3 justify-center text-xs"
              >
                Болдырмау
              </Button>
              <Button
                type="submit"
                variant="yellow"
                size="md"
                className="w-2/3 justify-center font-black text-xs shadow-md py-3.5"
              >
                Кітапты сақтау 💾
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: DELETE CONFIRMATION */}
      {deleteConfirmation && (
        <Modal
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          title="Өшіруді растау ⚠️"
          description="Бұл әрекетті қайтару мүмкін емес."
          emoji="🗑️"
          maxWidth="sm"
        >
          <div className="space-y-4 text-center py-2">
            <p className="text-xs font-bold text-slate-700">
              Сіз шынымен «<strong>{deleteConfirmation.title}</strong>» жазбасын базадан біржола өшіргіңіз келе ме?
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirmation(null)}
                className="w-1/2 justify-center text-xs"
              >
                Болдырмау
              </Button>
              <Button
                variant="coral"
                size="sm"
                onClick={handleConfirmDelete}
                className="w-1/2 justify-center text-xs font-black"
              >
                Өшіру ✓
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
