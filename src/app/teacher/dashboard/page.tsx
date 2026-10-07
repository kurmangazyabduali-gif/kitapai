"use client";

import * as React from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Users,
  BookOpen,
  Heart,
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Plus,
  HelpCircle,
  Sparkles,
  Gamepad2,
  TrendingUp,
  FileText,
  Send,
  Eye,
  Check,
  X,
  MessageCircle,
  BrainCircuit,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  MOCK_TEACHER_CLASS_STUDENTS,
  TeacherStudentItem,
  getStoredTeacherTasks,
  saveTeacherTask,
  TeacherTaskItem,
} from "@/lib/teacher-data";
import {
  getStoredSubmissions,
  approveGoodDeedSubmission,
} from "@/lib/good-deeds-data";
import {
  getStoredFamilySubmissions,
  approveFamilySubmission,
} from "@/lib/family-data";

export default function TeacherDashboardPage() {
  const { user } = useAuth();

  // State
  const [students, setStudents] = React.useState<TeacherStudentItem[]>(MOCK_TEACHER_CLASS_STUDENTS);
  const [tasks, setTasks] = React.useState<TeacherTaskItem[]>([]);
  const [goodDeeds, setGoodDeeds] = React.useState(getStoredSubmissions());
  const [familySubmissions, setFamilySubmissions] = React.useState(getStoredFamilySubmissions());
  
  // Search, filter, sorting
  const [searchQuery, setSearchQuery] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"points" | "books" | "deeds" | "name">("points");

  // Modals for Teacher Tools
  const [activeToolModal, setActiveToolModal] = React.useState<
    "reading_task" | "quiz_task" | "deed_task" | "family_task" | "content_task" | null
  >(null);

  // Form State
  const [toolTitle, setToolTitle] = React.useState("");
  const [toolDesc, setToolDesc] = React.useState("");
  const [toolDeadline, setToolDeadline] = React.useState("2026-10-12");
  const [toolPoints, setToolPoints] = React.useState(20);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const reloadData = React.useCallback(() => {
    setTasks(getStoredTeacherTasks());
    setGoodDeeds(getStoredSubmissions());
    setFamilySubmissions(getStoredFamilySubmissions());
  }, []);

  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Filter and sort students (Strictly only 2 «А» class!)
  const filteredStudents = React.useMemo(() => {
    return students
      .filter((s) => s.class_name === "2 «А»") // strict class isolation
      .filter((s) => {
        const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel =
          levelFilter === "all" ? true : s.reading_level === levelFilter;
        return matchesSearch && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === "points") return b.points - a.points;
        if (sortBy === "books") return b.books_read - a.books_read;
        if (sortBy === "deeds") return b.good_deeds_count - a.good_deeds_count;
        if (sortBy === "name") return a.full_name.localeCompare(b.full_name);
        return 0;
      });
  }, [students, searchQuery, levelFilter, sortBy]);

  // Summary Metrics
  const totalStudents = students.length;
  const activeToday = students.filter((s) => s.last_active_date === "2026-10-06").length;
  const totalBooks = students.reduce((acc, s) => acc + s.books_read, 0);
  const totalGames = students.reduce((acc, s) => acc + s.games_completed, 0);
  const totalDeeds = students.reduce((acc, s) => acc + s.good_deeds_count, 0);
  const totalFamily = students.reduce((acc, s) => acc + s.family_tasks_count, 0);
  const avgPoints = Math.round(students.reduce((acc, s) => acc + s.points, 0) / totalStudents);

  // Handle Teacher Tool Submission
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeToolModal || !toolTitle.trim()) return;

    saveTeacherTask({
      type:
        activeToolModal === "reading_task"
          ? "reading"
          : activeToolModal === "quiz_task"
          ? "quiz"
          : activeToolModal === "deed_task"
          ? "deed"
          : activeToolModal === "family_task"
          ? "family"
          : "content",
      title: toolTitle.trim(),
      target_class: "2 «А»",
      description: toolDesc.trim() || "Сынып оқушыларына арналған тапсырма",
      deadline: toolDeadline,
      points_reward: toolPoints,
      assigned_by: user?.full_name || "Айнұр Серікқызы",
    });

    reloadData();
    setActiveToolModal(null);
    setToolTitle("");
    setToolDesc("");

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#38BDF8", "#FACC15", "#4ADE80", "#C084FC"],
    });

    setToastMessage("Жаңа тапсырма 2 «А» сынып оқушыларына сәтті жіберілді! 📢");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Teacher Approval of Good Deeds
  const handleTeacherApproveDeed = (deedId: string) => {
    const res = approveGoodDeedSubmission(
      deedId,
      "teacher",
      user?.full_name || "Айнұр Серікқызы (Мұғалім)",
      "Жарайсың! Сынып жетекшісі ретінде игі ісіңді растаймын және мақтанамын!"
    );
    if (res.success) {
      reloadData();
      confetti({ particleCount: 70, spread: 60 });
      setToastMessage("Оқушының жақсы ісі сәтті расталды! (+20 XP берілді) ✓");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const pendingDeeds = goodDeeds.filter((d) => d.status === "pending");

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TEACHER HERO BANNER */}
      <div className="relative overflow-hidden p-6 sm:p-9 rounded-4xl bg-gradient-to-r from-edu-sky-600 via-indigo-600 to-purple-600 text-white shadow-kid-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
            <span>🏫 №271 мектеп-лицейі</span>
            <span>•</span>
            <span>2 «А» сыныбының жетекшісі</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Қош келдіңіз, {user?.full_name || "Айнұр Серікқызы"}! 👩‍🏫
          </h1>

          <p className="text-sky-100 font-semibold text-xs sm:text-sm leading-relaxed">
            Сіздің 2 «А» сыныбыңызда <strong>{totalStudents} оқушы</strong> белсенді оқу саяхатында.
            Бүгін <strong>{activeToday} оқушы</strong> жүйеге кіріп, тапсырмалар орындады.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 z-10 w-full sm:w-auto">
          <Link href="/teacher/analytics">
            <Button variant="yellow" size="lg" className="w-full justify-center font-black text-xs shadow-lg">
              <BrainCircuit className="w-4 h-4 mr-1.5" />
              <span>AI Диагностика & Аналитика 📊</span>
            </Button>
          </Link>
          <Link href="/teacher/students">
            <Button
              variant="ghost"
              size="md"
              className="w-full justify-center bg-white/15 hover:bg-white/25 text-white font-black text-xs border border-white/20 backdrop-blur-md"
            >
              <Users className="w-4 h-4 mr-1.5" />
              <span>Сынып тізімі ({totalStudents}) 👥</span>
            </Button>
          </Link>
        </div>

        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-3xl bg-emerald-500 text-white shadow-kid-md flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3 font-black text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setToastMessage(null)}
            className="text-white hover:bg-white/20"
          >
            ✕
          </Button>
        </div>
      )}

      {/* 2. 6 SUMMARY CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-edu-sky-600" />
            <span>2 «А» сыныбының жиынтық көрсеткіштері</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Тек сіздің сыныбыңыз
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Оқушылар */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-sky-50 to-sky-100/60 border-2 border-sky-200 shadow-kid-sm">
            <div className="w-10 h-10 rounded-2xl bg-edu-sky-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-sm">
              👨‍🎓
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Оқушылар</p>
            <p className="text-xl font-black text-sky-950">
              {totalStudents} <span className="text-xs font-bold text-slate-500">бала</span>
            </p>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
              {activeToday} бүгін белсенді
            </span>
          </div>

          {/* 2. Оқылған кітаптар */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100/60 border-2 border-amber-200 shadow-kid-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black mb-2 shadow-sm">
              📚
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Оқылған кітап</p>
            <p className="text-xl font-black text-amber-950">
              {totalBooks} <span className="text-xs font-bold text-slate-500">кітап</span>
            </p>
            <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">
              +12 осы аптада
            </span>
          </div>

          {/* 3. Ойындар */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100/60 border-2 border-purple-200 shadow-kid-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-sm">
              🎮
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ойындар</p>
            <p className="text-xl font-black text-purple-950">
              {totalGames} <span className="text-xs font-bold text-slate-500">ойын</span>
            </p>
            <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full inline-block mt-1">
              82% дәлдік
            </span>
          </div>

          {/* 4. Жақсы істер */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 border-2 border-rose-200 shadow-kid-sm">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-sm">
              ❤️
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Жақсы істер</p>
            <p className="text-xl font-black text-rose-950">
              {totalDeeds} <span className="text-xs font-bold text-slate-500">іс</span>
            </p>
            <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full inline-block mt-1">
              {pendingDeeds.length} күтілуде
            </span>
          </div>

          {/* 5. Отбасы белсенділігі */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-2 border-emerald-200 shadow-kid-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-sm">
              👨‍👩‍👧
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Отбасы белсенділігі</p>
            <p className="text-xl font-black text-emerald-950">
              {totalFamily} <span className="text-xs font-bold text-slate-500">челендж</span>
            </p>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
              70% қатысу
            </span>
          </div>

          {/* 6. Орташа ұпай */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-amber-300 shadow-kid-md">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-black mb-2 shadow-sm">
              ⭐
            </div>
            <p className="text-[11px] font-black text-amber-900 uppercase tracking-wider">Орташа ұпай</p>
            <p className="text-xl font-black text-amber-950">
              {avgPoints} <span className="text-xs font-extrabold">XP</span>
            </p>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full inline-block mt-1">
              Үздік сынып 🏆
            </span>
          </div>
        </div>
      </div>

      {/* 3. TEACHER TOOLS (5 АРНАЙЫ ҚҰРАЛ) */}
      <Card className="p-6 sm:p-7 bg-white border-2 border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Мұғалімнің жұмыс құралдары (Teacher Tools)</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              2 «А» сыныбына арнап тапсырмалар беріңіз, викторина құрастырыңыз және контент қосыңыз
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Button
            onClick={() => setActiveToolModal("reading_task")}
            variant="sky"
            size="md"
            className="h-auto py-3.5 flex-col items-center justify-center gap-1.5 text-center"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-black">«Тапсырма беру» 📖</span>
          </Button>

          <Button
            onClick={() => setActiveToolModal("quiz_task")}
            variant="purple"
            size="md"
            className="h-auto py-3.5 flex-col items-center justify-center gap-1.5 text-center"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs font-black">«Quiz жасау» 📝</span>
          </Button>

          <Button
            onClick={() => setActiveToolModal("deed_task")}
            variant="coral"
            size="md"
            className="h-auto py-3.5 flex-col items-center justify-center gap-1.5 text-center"
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs font-black">«Жақсы іс тапсырмасы» ❤️</span>
          </Button>

          <Button
            onClick={() => setActiveToolModal("family_task")}
            variant="green"
            size="md"
            className="h-auto py-3.5 flex-col items-center justify-center gap-1.5 text-center"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-black">«Отбасы тапсырмасы» 👨‍👩‍👧</span>
          </Button>

          <Button
            onClick={() => setActiveToolModal("content_task")}
            variant="yellow"
            size="md"
            className="h-auto py-3.5 flex-col items-center justify-center gap-1.5 text-center"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-black">«Контент қосу» 📚</span>
          </Button>
        </div>
      </Card>

      {/* 4. ANALYTICAL BLOCK & AI SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Charts & Progress Bars */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 bg-white border-2 border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Сынып белсенділігі мен көрсеткіштері</span>
              </h3>
              <Badge variant="sky" size="sm">
                2 «А» мониторингі
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-black mb-1.5">
                  <span className="text-slate-700">📚 Оқу белсенділігі (Reading Activity)</span>
                  <span className="text-sky-700">88% (Жоғары)</span>
                </div>
                <Progress value={88} variant="sky" height="sm" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-black mb-1.5">
                  <span className="text-slate-700">🎯 Викторина мен тест дәлдігі (Quiz Accuracy)</span>
                  <span className="text-emerald-700">82% (Жақсы)</span>
                </div>
                <Progress value={82} variant="green" height="sm" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-black mb-1.5">
                  <span className="text-slate-700">❤️ Жақсы іс жасау белсенділігі (Good Deeds)</span>
                  <span className="text-rose-700">75% (Озат)</span>
                </div>
                <Progress value={75} variant="coral" height="sm" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-black mb-1.5">
                  <span className="text-slate-700">👨‍👩‍👧 Отбасылық қатысу (Family Participation)</span>
                  <span className="text-purple-700">70% (Тұрақты)</span>
                </div>
                <Progress value={70} variant="purple" height="sm" />
              </div>
            </div>
          </Card>
        </div>

        {/* AI Diagnostics & Pedagogical Summary */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-white border-2 border-purple-200 space-y-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-black text-purple-950">
                AI ПЕДАГОГИКАЛЫҚ ДИАГНОСТ 🤖
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-2 text-xs">
              <p className="font-black text-purple-900">
                «Сыныптың оқу белсенділігі жоғары деңгейде (88%). Оқушылардың 82%-ы мәтіндік тестілерді сәтті тапсырды.»
              </p>
              <p className="text-slate-600 font-medium">
                «Кей оқушыларға (Санжар Б., Мәдина Б.) мәтіннің негізгі ойын анықтау бойынша қосымша жеңілдетілген тапсырма ұсынылады.»
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <span className="font-black text-amber-900 block">💡 Ұстазға ұсыныс:</span>
              <p className="text-slate-700 font-medium">
                Алдағы сабақта ертегінің негізгі идеясын рөлдік ойын арқылы талдау ұсынылады.
              </p>
            </div>

            <Link href="/teacher/analytics" className="block">
              <Button variant="purple" size="sm" className="w-full justify-center text-xs font-black">
                <span>Толық аналитикалық есепті көру →</span>
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* 5. STUDENTS LIST TABLE (2 «А» сыныбы) */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-edu-sky-600" />
              <span>2 «А» сыныбының оқушылары</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Барлығы: {filteredStudents.length} оқушы (Тек 2 «А» сыныбы көрсетіледі)
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Оқушы атын іздеу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-edu-sky-400 outline-none"
              />
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none cursor-pointer"
              >
                <option value="all">Барлық дәреже</option>
                <option value="озат">Озат оқырмандар</option>
                <option value="орта">Орташа қарқын</option>
                <option value="бастаушы">Қолдау қажет</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none cursor-pointer"
              >
                <option value="points">Ұпай бойынша (↓)</option>
                <option value="books">Оқылған кітап бойынша</option>
                <option value="deeds">Жақсы істер бойынша</option>
                <option value="name">Аты-жөні (А-Я)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
              <tr>
                <th className="p-3.5">Оқушының аты-жөні</th>
                <th className="p-3.5">Сынып</th>
                <th className="p-3.5">Оқырман деңгейі</th>
                <th className="p-3.5">Ұпай (XP)</th>
                <th className="p-3.5">📚 Кітап</th>
                <th className="p-3.5">🎮 Ойын</th>
                <th className="p-3.5">❤️ Жақсы іс</th>
                <th className="p-3.5">👨‍👩‍👧 Отбасы</th>
                <th className="p-3.5">Соңғы кіруі</th>
                <th className="p-3.5 text-right">Күнделік</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="p-3.5">
                    <Link
                      href={`/teacher/students/${st.id}`}
                      className="flex items-center gap-2.5 group cursor-pointer"
                    >
                      <Avatar emoji={st.avatar_emoji} name={st.full_name} size="sm" />
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm group-hover:text-edu-sky-600 transition-colors">
                          {st.full_name}
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {st.parent_name}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="p-3.5 font-bold text-slate-600">{st.class_name}</td>
                  <td className="p-3.5">
                    <Badge
                      variant={
                        st.reading_level === "озат"
                          ? "green"
                          : st.reading_level === "орта"
                          ? "sky"
                          : "yellow"
                      }
                      size="sm"
                    >
                      {st.level_badge} {st.level_name}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-black text-amber-900">
                    ⭐ {st.points} XP
                  </td>
                  <td className="p-3.5 font-bold text-sky-800">
                    {st.books_read}
                  </td>
                  <td className="p-3.5 font-bold text-purple-800">
                    {st.games_completed}
                  </td>
                  <td className="p-3.5 font-bold text-rose-600">
                    {st.good_deeds_count}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-700">
                    {st.family_tasks_count}
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-500 font-bold">
                    {st.last_activity}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link href={`/teacher/students/${st.id}`}>
                      <Button variant="outline" size="sm" className="text-xs font-bold">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Көру</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6. PENDING GOOD DEEDS APPROVAL STREAM */}
      <Card className="p-6 bg-white border-2 border-rose-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-black text-slate-800">
              2 «А» оқушыларының жақсы істері (Мұғалімнің растауы)
            </h3>
          </div>
          <Badge variant={pendingDeeds.length > 0 ? "coral" : "green"} size="sm">
            {pendingDeeds.length} күтілуде
          </Badge>
        </div>

        {pendingDeeds.length === 0 ? (
          <p className="text-xs text-slate-500 font-semibold py-2">
            Қазіргі уақытта растауды күтіп тұрған жақсы істер жоқ.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDeeds.map((deed) => (
              <div
                key={deed.id}
                className="p-4 rounded-3xl bg-rose-50/40 border border-rose-200 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                      {deed.value_emoji} {deed.value_name_kk}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {deed.student_name} ({deed.student_class || "2 «А»"})
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">{deed.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{deed.description}</p>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Button
                    variant="green"
                    size="sm"
                    onClick={() => handleTeacherApproveDeed(deed.id)}
                    className="text-xs font-black"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span>Растау (+20 XP)</span>
                  </Button>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {new Date(deed.created_at).toLocaleDateString("kk-KZ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* TEACHER TOOLS MODAL */}
      {activeToolModal && (
        <Modal
          isOpen={!!activeToolModal}
          onClose={() => setActiveToolModal(null)}
          title={
            activeToolModal === "reading_task"
              ? "Оқу тапсырмасын беру 📖"
              : activeToolModal === "quiz_task"
              ? "Quiz & Тест тапсырмасын жасау 📝"
              : activeToolModal === "deed_task"
              ? "Жақсы іс жасау тапсырмасы ❤️"
              : activeToolModal === "family_task"
              ? "Отбасылық тапсырма беру 👨‍👩‍👧"
              : "Жаңа контент қосу 📚"
          }
          description="2 «А» сыныбының барлық оқушысына бір мезгілде жіберіледі."
          emoji="👩‍🏫"
          maxWidth="md"
        >
          <form onSubmit={handleCreateTask} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-black text-slate-800">Тапсырма атауы:</label>
              <Input
                required
                placeholder="Мысалы: «Бала Абай» әңгімесін оқып, сұрақтарға жауап беру"
                value={toolTitle}
                onChange={(e) => setToolTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-800">Нұсқаулық пен сипаттамасы:</label>
              <textarea
                required
                rows={3}
                placeholder="Оқушыларға арналған кеңес, орындау тәртібі..."
                value={toolDesc}
                onChange={(e) => setToolDesc(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-medium focus:border-edu-sky-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-800">Мерзімі (Deadline):</label>
                <Input
                  type="date"
                  value={toolDeadline}
                  onChange={(e) => setToolDeadline(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-800">Марапат ұпайы (XP):</label>
                <Input
                  type="number"
                  value={toolPoints}
                  onChange={(e) => setToolPoints(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setActiveToolModal(null)}
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
                <Send className="w-4 h-4 mr-1.5" />
                <span>Сыныпқа жіберу 📢</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
