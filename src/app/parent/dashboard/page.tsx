"use client";

import * as React from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Heart,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Flame,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Award,
  Gamepad2,
  Users,
  Star,
  Trophy,
  Smile,
  Check,
  Calendar,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  getStoredSubmissions,
  approveGoodDeedSubmission,
} from "@/lib/good-deeds-data";
import {
  getStoredFamilySubmissions,
  approveFamilySubmission,
  getFamilyProgressStats,
  FAMILY_CHALLENGES,
} from "@/lib/family-data";
import {
  calculateStudentLevel,
  GAMIFICATION_BADGES,
  getUnlockedBadges,
} from "@/lib/gamification";
import { GoodDeedSubmission, FamilySubmission } from "@/types/database.types";

const POSITIVE_REACTION_PRESETS = [
  { text: "Жарайсың! 👏", emoji: "👏" },
  { text: "Мен сені мақтан тұтамын! 💖", emoji: "💖" },
  { text: "Тағы бір жақсы іс жаса! 🌱", emoji: "🌱" },
  { text: "Керемет нәтиже! 🌟", emoji: "🌟" },
];

export default function ParentDashboardPage() {
  const { user } = useAuth();

  // Submissions state
  const [submissions, setSubmissions] = React.useState<GoodDeedSubmission[]>([]);
  const [familySubmissions, setFamilySubmissions] = React.useState<FamilySubmission[]>([]);
  const [activeApprovalTab, setActiveApprovalTab] = React.useState<"deeds" | "family">("deeds");

  // Approval & Comment Modal
  const [commentModal, setCommentModal] = React.useState<{ type: "deed" | "family"; id: string } | null>(null);
  const [parentComment, setParentComment] = React.useState("Жарайсың, қызым! Өте үлкен жақсылық жасадың!");

  // Send Direct Message to Child Modal
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = React.useState(false);
  const [motivationMessage, setMotivationMessage] = React.useState("Мен сені мақтан тұтамын, қызым! Бүгін тағы бір қызықты ертегі оқып көрші! ❤️");

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const reloadData = React.useCallback(() => {
    setSubmissions(getStoredSubmissions());
    setFamilySubmissions(getStoredFamilySubmissions());
  }, []);

  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Child Data (Strictly isolated to the parent's child: Аяла Ерболқызы)
  const child = {
    full_name: "Аяла Ерболқызы",
    avatar_emoji: "🌸",
    class_name: "2 «А»",
    school_name: "№271 мектеп-лицейі, Астана",
    points: 280,
    coins: 340,
    books_read: 12,
    games_completed: 6,
    good_deeds_count: 3,
    family_tasks_count: 2,
    streak_days: 7,
    comprehension_accuracy: 94,
    today_reading_minutes: 25,
    today_current_book: "«Мақта қыз бен мысық»",
    today_book_progress: 100,
  };

  const levelInfo = calculateStudentLevel(child.points);
  const familyStats = getFamilyProgressStats();
  const unlockedBadgesList = getUnlockedBadges();

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const approvedSubmissions = submissions.filter((s) => s.status === "approved");
  const pendingFamily = familySubmissions.filter((f) => f.status === "pending");
  const approvedFamily = familySubmissions.filter((f) => f.status === "approved");
  const totalPending = pendingSubmissions.length + pendingFamily.length;

  const handleConfirm = () => {
    if (!commentModal) return;

    if (commentModal.type === "deed") {
      const res = approveGoodDeedSubmission(
        commentModal.id,
        "parent",
        user?.full_name || "Бауыржан Сұлтанұлы (Әкесі)",
        parentComment || "Жарайсың! Өте жақсы орындалған игі іс!"
      );

      if (res.success) {
        reloadData();
        confetti({ particleCount: 90, spread: 70, colors: ["#10B981", "#F59E0B", "#38BDF8"] });
        setToastMessage("Жақсы іс сәтті расталды! Балаңызға +20 XP берілді! ✓");
        setTimeout(() => setToastMessage(null), 3500);
      }
    } else {
      const res = approveFamilySubmission(
        commentModal.id,
        user?.full_name || "Бауыржан Сұлтанұлы (Әкесі)",
        parentComment || "Жарайсың! Отбасымызбен жасаған өте үлгілі жақсы іс болды!"
      );

      if (res.success) {
        reloadData();
        confetti({ particleCount: 90, spread: 70, colors: ["#10B981", "#F59E0B", "#EC4899"] });
        setToastMessage("Отбасылық челендж сәтті расталды! (+20 XP & ❤️) ✓");
        setTimeout(() => setToastMessage(null), 3500);
      }
    }
    setCommentModal(null);
  };

  const handleSendMotivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivationMessage.trim()) return;

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setToastMessage(`Аялаға жылы лебізіңіз жіберілді: «${motivationMessage}» 💌`);
    setIsSendMessageModalOpen(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. PARENT HERO BANNER */}
      <div className="p-6 sm:p-9 rounded-4xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ата-ананың жеке кабинеті • Тек өз балаңыздың нәтижелері</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Балаңыздың жетістіктері 👨‍👩‍👧
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Қош келдіңіз, <strong>{user?.full_name || "Бауыржан Сұлтанұлы"}</strong>! Балаңыз{" "}
            <strong className="text-amber-300">{child.full_name}</strong> бүгін кітап оқып, жақсылық жасады.
            {totalPending > 0
              ? ` Сіздің растауыңызды күтіп тұрған ${totalPending} жаңа нәтиже бар!`
              : " Барлық тапсырмалар расталған."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-3 p-3.5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
            <Avatar emoji={child.avatar_emoji} name={child.full_name} size="sm" borderVariant="gold" />
            <div>
              <p className="text-xs font-black">{child.full_name}</p>
              <p className="text-[11px] text-slate-300 font-medium">{child.class_name} • {child.school_name}</p>
            </div>
          </div>

          <Button
            onClick={() => setIsSendMessageModalOpen(true)}
            variant="yellow"
            size="md"
            className="w-full justify-center font-black text-xs shadow-lg"
          >
            <Send className="w-4 h-4 mr-1.5" />
            <span>Балаға мадақтау хатын жіберу 💌</span>
          </Button>
        </div>
      </div>

      {/* Toast */}
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

      {/* 2. 6 CORE SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Оқыған кітаптары */}
        <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg font-black mb-1">
            📚
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Оқыған кітап</p>
          <p className="text-xl font-black text-slate-900">{child.books_read} <span className="text-xs font-bold text-slate-500">кітап</span></p>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full inline-block">
            2 «А»-да озат
          </span>
        </div>

        {/* 2. Ойнаған ойындары */}
        <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-black mb-1">
            🎮
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ойындар</p>
          <p className="text-xl font-black text-slate-900">{child.games_completed} <span className="text-xs font-bold text-slate-500">ойын</span></p>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
            {child.comprehension_accuracy}% дәлдік
          </span>
        </div>

        {/* 3. Жақсы істері */}
        <div className="p-4 rounded-3xl bg-white border-2 border-rose-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg font-black mb-1">
            ❤️
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Жақсы істері</p>
          <p className="text-xl font-black text-rose-700">{approvedSubmissions.length} <span className="text-xs font-bold text-slate-500">іс</span></p>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
            Расталған ізгілік
          </span>
        </div>

        {/* 4. Отбасылық тапсырмалар */}
        <div className="p-4 rounded-3xl bg-white border-2 border-emerald-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-black mb-1">
            👨‍👩‍👧
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Отбасылық</p>
          <p className="text-xl font-black text-emerald-800">{familyStats.completedCount} / 6 <span className="text-xs font-bold text-slate-500">апта</span></p>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            {familyStats.totalHearts} ❤️ жиналды
          </span>
        </div>

        {/* 5. Ұпайы */}
        <div className="p-4 rounded-3xl bg-white border-2 border-amber-200 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-black mb-1">
            ⭐
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ұпайы</p>
          <p className="text-xl font-black text-amber-950">{child.points} <span className="text-xs font-extrabold">XP</span></p>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
            🪙 {child.coins} тиын
          </span>
        </div>

        {/* 6. Деңгейі */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-100/60 border-2 border-amber-300 shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-lg font-black mb-1">
            {levelInfo.currentLevel.badgeEmoji}
          </div>
          <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Деңгейі</p>
          <p className="text-sm font-black text-slate-900 truncate">{levelInfo.currentLevel.name}</p>
          <span className="text-[10px] font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full inline-block">
            {levelInfo.currentLevel.levelNumber}-деңгей
          </span>
        </div>
      </div>

      {/* 3. TWO COLUMNS: БҮГІНГІ БЕЛСЕНДІЛІК & ОСЫ АПТАДАҒЫ НӘТИЖЕ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Бүгінгі белсенділік */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-edu-sky-600" />
                <span>Бүгінгі белсенділік (Today's Reading)</span>
              </h3>
              <Badge variant="green" size="sm">
                Бүгін белсенді ✓
              </Badge>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">Оқып жатқан кітабы:</span>
                  <h4 className="font-black text-slate-900 text-sm">
                    {child.today_current_book}
                  </h4>
                </div>
                <span className="text-2xl">🐱</span>
              </div>
              <Progress value={child.today_book_progress} variant="green" height="sm" />
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Оқу уақыты: <strong>{child.today_reading_minutes} минут</strong></span>
                <span className="text-emerald-700 font-black">100% аяқталды ✓</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block font-bold">Оқу сериясы:</span>
                <strong className="text-rose-600 font-black text-sm flex items-center gap-1 mt-0.5">
                  <Flame className="w-4 h-4 fill-rose-500" /> {child.streak_days} күн қатарынан
                </strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block font-bold">Түсіну сапасы:</span>
                <strong className="text-emerald-700 font-black text-sm block mt-0.5">
                  {child.comprehension_accuracy}% жоғары дәлдік
                </strong>
              </div>
            </div>
          </Card>
        </div>

        {/* Осы аптадағы нәтиже */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Осы аптадағы нәтиже (Weekly Summary)</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                4-апта сабақтары
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-slate-500 block">Жиналғаны</span>
                <span className="text-lg font-black text-emerald-800">+60 XP</span>
              </div>
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
                <span className="text-xs font-bold text-slate-500 block">Кітап</span>
                <span className="text-lg font-black text-sky-800">2 оқылды</span>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold text-slate-500 block">Жақсы іс</span>
                <span className="text-lg font-black text-rose-800">1 орындалды</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-xs font-bold text-slate-500 block">Челендж</span>
                <span className="text-lg font-black text-purple-800">1 расталды</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-1">
              <p className="font-black text-amber-900">💡 Ата-анаға педагогикалық кеңес:</p>
              <p className="font-medium">
                Аяла бұл аптада құстарға жемсалғыш жасап, мейірімділік танытты. Кешкі уақытта жаңа ертегіні бірге талқылап, мадақтаңыз!
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. «МЕНІҢ БАЛАМНЫҢ ЖЕТІСТІКТЕРІ» (LEVEL PROGRESS & BADGES) */}
      <Card className="p-6 sm:p-7 bg-white border-2 border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Менің баламның жетістіктері & Деңгейі</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Аяла қазір <strong>«{levelInfo.currentLevel.name}»</strong> дәрежесінде
            </p>
          </div>

          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
            Келесі деңгейге {levelInfo.pointsRemaining} XP қалды
          </span>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>{levelInfo.currentLevel.minPoints} XP</span>
            <span className="text-slate-800 font-black">{child.points} XP (Қазіргі)</span>
            <span>{levelInfo.nextLevel ? `${levelInfo.nextLevel.minPoints} XP` : "MAX"}</span>
          </div>
          <Progress value={levelInfo.progressPercentage} variant="green" height="sm" />
        </div>

        {/* Badges showcase */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-black text-slate-700 block">Ашылған медальдар мен белгілер:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GAMIFICATION_BADGES.map((b) => {
              const isUnlocked = unlockedBadgesList.includes(b.key);
              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border text-center space-y-1 ${
                    isUnlocked
                      ? "bg-amber-50/60 border-amber-300"
                      : "bg-slate-50 border-slate-200 opacity-50 grayscale"
                  }`}
                >
                  <span className="text-2xl block">{b.emoji}</span>
                  <p className="text-[11px] font-black text-slate-800 truncate">{b.title}</p>
                  <span className="text-[9px] font-bold text-slate-400 block">
                    {isUnlocked ? "✓ Ашылған" : "🔒 Құлыптаулы"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 5. APPROVAL STREAM (РАСТАУ & БАҒАЛАУ) */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Баланың жақсы істері мен челендждері (Ата-ананың растауы)</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Балаңыздың нәтижесін көріп, растаңыз және жылы лебіз білдіріңіз
            </p>
          </div>
          <Badge variant={totalPending > 0 ? "coral" : "green"} size="sm">
            {totalPending} күтілуде
          </Badge>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveApprovalTab("deeds")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeApprovalTab === "deeds"
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ❤️ Жақсы істер ({pendingSubmissions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveApprovalTab("family")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeApprovalTab === "family"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            👨‍👩‍👧 Отбасылық челендждер ({pendingFamily.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeApprovalTab === "deeds" && (
          <div className="space-y-3">
            {submissions.map((deed) => {
              const isApproved = deed.status === "approved";
              return (
                <div
                  key={deed.id}
                  className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        {deed.value_emoji} {deed.value_name_kk}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {new Date(deed.created_at).toLocaleDateString("kk-KZ")}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">{deed.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{deed.description}</p>
                    {isApproved && deed.reviewer_comment && (
                      <p className="text-xs text-emerald-800 font-bold italic pt-1">
                        💬 Сіздің лебізіңіз: «{deed.reviewer_comment}»
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isApproved ? (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Расталған (+20 XP) ✓
                      </span>
                    ) : (
                      <Button
                        variant="green"
                        size="sm"
                        onClick={() => setCommentModal({ type: "deed", id: deed.id })}
                        className="text-xs font-black"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        <span>Растау және +20 XP беру</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeApprovalTab === "family" && (
          <div className="space-y-3">
            {familySubmissions.map((fam) => {
              const isApproved = fam.status === "approved";
              return (
                <div
                  key={fam.id}
                  className="p-4 rounded-3xl bg-emerald-50/40 border border-emerald-200 space-y-2.5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="green" size="sm">
                        {fam.week_number}-апта отбасылық челенджі
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-400">{fam.date}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed italic">
                      «{fam.text}»
                    </p>
                    {isApproved && fam.parent_comment && (
                      <p className="text-xs text-emerald-900 font-bold pt-1">
                        💬 Сіздің лебізіңіз: «{fam.parent_comment}»
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isApproved ? (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Расталды (+20 XP & ❤️) ✓
                      </span>
                    ) : (
                      <Button
                        variant="green"
                        size="sm"
                        onClick={() => setCommentModal({ type: "family", id: fam.id })}
                        className="text-xs font-black"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        <span>Растау (+20 XP & ❤️)</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 6. TIMELINE (ОҚУШЫНЫҢ ТОЛЫҚ ХРОНОЛОГИЯСЫ) */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-edu-sky-600" />
          <span>Баланың оқу және тәрбие хронологиясы (Timeline)</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div>
                <h4 className="font-extrabold text-slate-900">«Мақта қыз бен мысық» ертегісін оқып аяқтады</h4>
                <p className="text-slate-500 font-medium">3/3 бет толық оқылды • +10 ұпай</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Бүгін, 14:00</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-extrabold text-slate-900">«Түсін» тестін 100% нәтижемен тапсырды</h4>
                <p className="text-slate-500 font-medium">3 сұраққа толық дұрыс жауап берді • +10 ұпай</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Бүгін, 14:15</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❤️</span>
              <div>
                <h4 className="font-extrabold text-slate-900">Жақсы іс: Құстарға жемсалғыш жасау</h4>
                <p className="text-slate-500 font-medium">Қамқорлық құндылығы • +20 ұпай</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Кеше, 16:30</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👨‍👩‍👧</span>
              <div>
                <h4 className="font-extrabold text-slate-900">Отбасылық кешкі 20 минут оқу</h4>
                <p className="text-slate-500 font-medium">1-апта челенджі орындалды • +20 ұпай & 1 ❤️</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400">3 күн бұрын</span>
          </div>
        </div>
      </Card>

      {/* 7. FAMILY SECTION WIDGET (ОТБАСЫЛЫҚ ТАПСЫРМА) */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-emerald-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-black text-slate-900">
                Ағымдағы отбасылық челендж: 2-апта 👨‍👩‍👧
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              «Ата-әжемнен бір ертегі тыңдаймын» — ғибратты аңыз тыңдап, бата алу.
            </p>
          </div>

          <Link href="/parent/family">
            <Button variant="green" size="sm" className="font-black text-xs">
              <span>Отбасылық күнделік пен альбомды ашу →</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* MODAL 1: CONFIRMATION & COMMENT MODAL WITH POSITIVE PRESETS */}
      {commentModal && (
        <Modal
          isOpen={!!commentModal}
          onClose={() => setCommentModal(null)}
          title="Нәтижені растау & Лебіз жазу ❤️"
          description="Балаңыздың жақсы ісін растап, мадақтау сөзін таңдаңыз немесе жазыңыз!"
          emoji="💖"
          maxWidth="md"
        >
          <div className="space-y-4 text-left">
            {/* Quick Positive Reaction Chips */}
            <div className="space-y-1.5">
              <span className="text-xs font-black text-slate-700 block">
                Дайын мадақтау сөздері (басып таңдаңыз):
              </span>
              <div className="flex flex-wrap gap-2">
                {POSITIVE_REACTION_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setParentComment(preset.text)}
                    className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    {preset.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-800">
                Ата-ананың пікірі мен лебізі:
              </label>
              <textarea
                rows={3}
                value={parentComment}
                onChange={(e) => setParentComment(e.target.value)}
                placeholder="Жарайсың, қызым! Өте мақтанамын..."
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs sm:text-sm font-medium focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setCommentModal(null)}
                className="w-1/3 justify-center text-xs"
              >
                Болдырмау
              </Button>
              <Button
                type="button"
                variant="green"
                size="md"
                onClick={handleConfirm}
                className="w-2/3 justify-center font-black text-xs sm:text-sm shadow-md py-3.5"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Растау (+20 XP марапат)</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: SEND MOTIVATIONAL MESSAGE TO CHILD */}
      {isSendMessageModalOpen && (
        <Modal
          isOpen={isSendMessageModalOpen}
          onClose={() => setIsSendMessageModalOpen(false)}
          title="Балаға мадақтау хатын жіберу 💌"
          description="Аяланың оқу кабинетіне сіздің жылы сөзіңіз бен мадақтауыңыз көрсетіледі."
          emoji="🌸"
          maxWidth="md"
        >
          <form onSubmit={handleSendMotivation} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <span className="text-xs font-black text-slate-700 block">
                Дайын мадақтау сөздері:
              </span>
              <div className="flex flex-wrap gap-2">
                {POSITIVE_REACTION_PRESETS.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setMotivationMessage(p.text)}
                    className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-950 border border-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-800">
                Хабарлама мәтіні:
              </label>
              <textarea
                rows={3}
                required
                value={motivationMessage}
                onChange={(e) => setMotivationMessage(e.target.value)}
                placeholder="Мысалы: Мен сені мақтан тұтамын, қызым! Бүгін тағы бір жақсы іс жаса..."
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs sm:text-sm font-medium focus:border-amber-400 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsSendMessageModalOpen(false)}
                className="w-1/3 justify-center text-xs"
              >
                Болдырмау
              </Button>
              <Button
                type="submit"
                variant="yellow"
                size="md"
                className="w-2/3 justify-center font-black text-xs sm:text-sm shadow-md py-3.5"
              >
                <Send className="w-4 h-4 mr-1.5" />
                <span>Балаға жіберу 💌</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
