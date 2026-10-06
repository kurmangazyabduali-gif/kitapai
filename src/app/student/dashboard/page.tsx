"use client";

import * as React from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Sparkles,
  Flame,
  Heart,
  Award,
  Gamepad2,
  CheckCircle2,
  Camera,
  ArrowRight,
  TrendingUp,
  Newspaper,
  Users,
  Star,
  Check,
  Clock,
  ChevronRight,
  Trophy,
  Smile,
  Zap,
  ListOrdered,
  History,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { StudentOnboardingModal } from "@/components/student/student-onboarding-modal";
import { useAuth } from "@/contexts/AuthContext";
import {
  GAMIFICATION_LEVELS,
  GAMIFICATION_BADGES,
  STREAK_MILESTONES,
  getDailyMotivationalMessage,
  getStoredTransactions,
  getUnlockedBadges,
  getStreakInfo,
  calculateStudentLevel,
  calculateStudentStats,
  recordPointsTransaction,
} from "@/lib/gamification";
import {
  MOCK_BOOKS,
  INITIAL_DAILY_MISSIONS,
  MOCK_ACTIVITY_TIMELINE,
} from "@/lib/mock-data";
import {
  DailyMissionTask,
  ActivityTimelineItem,
  StudentStatsBreakdown,
  BadgeItem,
  PointsTransaction,
  StreakInfo,
} from "@/types/database.types";
import { cn } from "@/lib/utils";

export default function StudentDashboardPage() {
  const { user } = useAuth();

  // Dynamic state for transactions, stats, and missions
  const [transactions, setTransactions] = React.useState<PointsTransaction[]>([]);
  const [unlockedBadges, setUnlockedBadges] = React.useState<string[]>([]);
  const [streakInfo, setStreakInfo] = React.useState<StreakInfo>(getStreakInfo());
  const [stats, setStats] = React.useState<StudentStatsBreakdown>(calculateStudentStats());
  const [missions, setMissions] = React.useState<DailyMissionTask[]>(INITIAL_DAILY_MISSIONS);
  const [timeline, setTimeline] = React.useState<ActivityTimelineItem[]>(MOCK_ACTIVITY_TIMELINE);
  
  // Modals
  const [selectedBadge, setSelectedBadge] = React.useState<BadgeItem | null>(null);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = React.useState(false);
  const [isDeedModalOpen, setIsDeedModalOpen] = React.useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = React.useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);
  const [deedTitle, setDeedTitle] = React.useState("");
  const [deedDescription, setDeedDescription] = React.useState("");
  const [quizAnswered, setQuizAnswered] = React.useState(false);

  const reloadGamificationData = React.useCallback(() => {
    const txs = getStoredTransactions();
    setTransactions(txs);
    setUnlockedBadges(getUnlockedBadges());
    setStreakInfo(getStreakInfo());
    setStats(calculateStudentStats(txs));

    if (typeof window !== "undefined") {
      const onboarded = localStorage.getItem("kitaptan_onboarding_completed");
      if (!onboarded) {
        setIsOnboardingOpen(true);
      }
    }
  }, []);

  React.useEffect(() => {
    reloadGamificationData();
  }, [reloadGamificationData]);

  // Level calculations based on current total points
  const levelInfo = calculateStudentLevel(stats.total_points);

  // Motivational message
  const motivation = getDailyMotivationalMessage(
    stats.total_points,
    stats.streak_days,
    stats.good_deeds_count
  );

  // Daily missions calculation
  const completedMissionsCount = missions.filter((m) => m.completed).length;
  const isMissionAllCompleted = completedMissionsCount === missions.length;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#38BDF8", "#FACC15", "#4ADE80", "#C084FC", "#FB7185"],
    });
  };

  // Toggle mission item completion
  const toggleMission = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.completed;
          if (nextState) {
            triggerConfetti();

            // Record transaction through Points Engine
            recordPointsTransaction({
              student_id: user?.id || "student-1",
              action_type: m.type === "tale" ? "book_read" : m.type === "game" ? "game_completed" : m.type === "deed" ? "good_deed" : "family_challenge",
              source_id: `mission-${m.id}-${new Date().toISOString().split("T")[0]}`,
              title: `Күндік миссия: «${m.title}»`,
              description: m.description,
              custom_points: m.points,
              custom_coins: m.coins,
            });

            reloadGamificationData();

            // Add to timeline
            const newAct: ActivityTimelineItem = {
              id: `act-${Date.now()}`,
              type: m.type === "tale" ? "reading" : m.type === "game" ? "game" : m.type === "deed" ? "deed" : "family",
              title: `Күндік миссия: «${m.title}» орындалды`,
              description: m.description,
              pointsEarned: m.points,
              coinsEarned: m.coins,
              timestamp: new Date().toISOString(),
              timeAgoKk: "Жаңа ғана",
              icon: m.emoji,
              badgeVariant: m.type === "tale" ? "sky" : m.type === "game" ? "purple" : m.type === "deed" ? "coral" : "green",
            };
            setTimeline((t) => [newAct, ...t]);
          }
          return { ...m, completed: nextState };
        }
        return m;
      })
    );
  };

  // Submit good deed directly
  const handleDeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti();

    recordPointsTransaction({
      student_id: user?.id || "student-1",
      action_type: "good_deed",
      source_id: `direct-deed-${Date.now()}`,
      title: deedTitle || "Жақсы іс жасалды",
      description: deedDescription || "Оқушы өз еркімен жақсы іс орындады",
      custom_points: 20,
      custom_coins: 30,
    });

    reloadGamificationData();

    // Auto-complete deed mission
    setMissions((prev) =>
      prev.map((m) => (m.type === "deed" ? { ...m, completed: true } : m))
    );

    setIsDeedModalOpen(false);
    setDeedTitle("");
    setDeedDescription("");
  };

  const studentName = user?.full_name?.split(" ")[0] || "Аяла";

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO SECTION (Сәлем, Аяла!) */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-edu-sky-500 via-indigo-600 to-purple-600 p-6 sm:p-9 text-white shadow-kid-md">
        {/* Playful background circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
              <span>{levelInfo.currentLevel.levelNumber}-деңгей • {levelInfo.currentLevel.name} {levelInfo.currentLevel.badgeEmoji}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Сәлем, {studentName}! 🌸
            </h1>

            <p className="text-xl sm:text-2xl font-black text-yellow-200">
              «Оқы. Түсін. Ойна. Жақсылық жаса!»
            </p>

            {/* Daily Motivational Message */}
            <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <span className="text-2xl">{motivation.emoji}</span>
              <div>
                <p className="text-sm font-black text-white">{motivation.title}</p>
                <p className="text-xs text-sky-100 font-semibold">{motivation.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setIsDeedModalOpen(true)}
              variant="yellow"
              size="lg"
              className="font-black text-sm justify-center shadow-lg"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>Жақсы іс қосу ❤️</span>
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsOnboardingOpen(true)}
                variant="ghost"
                size="sm"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-black text-xs justify-center border border-white/25 backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-yellow-300" />
                <span>Гид 🌟</span>
              </Button>

              <Button
                onClick={() => setIsTransactionsModalOpen(true)}
                variant="ghost"
                size="sm"
                className="flex-1 bg-white/15 hover:bg-white/25 text-white font-black text-xs justify-center border border-white/20 backdrop-blur-md"
              >
                <History className="w-3.5 h-3.5 mr-1" />
                <span>Тарих ({transactions.length}) 📜</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6 CORE STATISTICS (Ертегі, Журнал, Ойын, Жақсы іс, Отбасы, Жалпы ұпай) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-edu-sky-600" />
            <h2 className="text-xl font-black text-slate-900">
              Менің белсенділік көрсеткіштерім
            </h2>
          </div>
          <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            🪙 {stats.total_coins} Алтын тиын
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Ертегілер */}
          <Link href="/student/library?category=kazakh_tales" className="block">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-sky-50 to-sky-100/60 border-2 border-sky-200 shadow-kid-sm hover:-translate-y-1 transition-all h-full cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-edu-sky-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-sm">
                📚
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Ертегілер
              </p>
              <p className="text-xl font-black text-sky-950">
                {stats.tales_count} <span className="text-xs font-bold text-slate-500">ертегі</span>
              </p>
              <span className="text-[11px] font-black text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-full inline-block mt-1">
                +{stats.tales_points} ұпай
              </span>
            </div>
          </Link>

          {/* 2. Журналдар */}
          <Link href="/student/library?category=children_magazines" className="block">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100/60 border-2 border-amber-200 shadow-kid-sm hover:-translate-y-1 transition-all h-full cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black mb-2 shadow-sm">
                📰
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Журналдар
              </p>
              <p className="text-xl font-black text-amber-950">
                {stats.magazines_count} <span className="text-xs font-bold text-slate-500">журнал</span>
              </p>
              <span className="text-[11px] font-black text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full inline-block mt-1">
                +{stats.magazines_points} ұпай
              </span>
            </div>
          </Link>

          {/* 3. Ойындар */}
          <Link href="/student/games" className="block">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100/60 border-2 border-purple-200 shadow-kid-sm hover:-translate-y-1 transition-all h-full cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-sm">
                🎮
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Ойындар
              </p>
              <p className="text-xl font-black text-purple-950">
                {stats.games_count} <span className="text-xs font-bold text-slate-500">ойын</span>
              </p>
              <span className="text-[11px] font-black text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-full inline-block mt-1">
                +{stats.games_points} ұпай
              </span>
            </div>
          </Link>

          {/* 4. Жақсы істер */}
          <Link href="/student/good-deeds" className="block">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100/60 border-2 border-rose-200 shadow-kid-sm hover:-translate-y-1 transition-all h-full cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-sm">
                ❤️
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Жақсы істер
              </p>
              <p className="text-xl font-black text-rose-950">
                {stats.good_deeds_count} <span className="text-xs font-bold text-slate-500">іс</span>
              </p>
              <span className="text-[11px] font-black text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full inline-block mt-1">
                +{stats.good_deeds_points} ұпай
              </span>
            </div>
          </Link>

          {/* 5. Отбасылық әрекеттер */}
          <Link href="/student/family" className="block">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-2 border-emerald-200 shadow-kid-sm hover:-translate-y-1 transition-all h-full cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-black mb-2 shadow-sm">
                👨‍👩‍👧
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Отбасы
              </p>
              <p className="text-xl font-black text-emerald-950">
                {stats.family_actions_count} <span className="text-xs font-bold text-slate-500">әрекет</span>
              </p>
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full inline-block mt-1">
                +{stats.family_actions_points} ұпай
              </span>
            </div>
          </Link>

          {/* 6. Жалпы ұпай */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-amber-300 shadow-kid-md hover:-translate-y-1 transition-all relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-black mb-2 shadow-sm">
              ⭐
            </div>
            <p className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
              Жалпы ұпай
            </p>
            <p className="text-2xl font-black text-amber-950">
              {stats.total_points} <span className="text-xs font-extrabold">XP</span>
            </p>
            <span className="text-[10px] font-black text-rose-600 flex items-center gap-1 mt-1">
              <Flame className="w-3 h-3 fill-rose-500" />
              {stats.streak_days} күн серия
            </span>
          </div>
        </div>
      </div>

      {/* 3. STREAKS SECTION (3 күн, 7 күн, 30 күн қатарынан) */}
      <Card className="p-6 bg-white border-2 border-orange-200 shadow-kid-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-100 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Оқу сериясы (Streak) — {stats.streak_days} күн қатарынан! 🔥
              </h3>
              <p className="text-xs font-bold text-slate-500">
                Күн сайын кітап оқып, үзіліссіз білім алу сериясын сақта!
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-orange-800 bg-orange-100 px-3.5 py-1 rounded-full border border-orange-200 self-start sm:self-auto">
            ⚡ Белсенді серия
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STREAK_MILESTONES.map((m) => {
            const isUnlocked = stats.streak_days >= m.days;
            return (
              <div
                key={m.days}
                className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-3.5 ${
                  isUnlocked
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border-orange-300 shadow-sm"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${
                    isUnlocked ? "bg-orange-400 text-white shadow-sm" : "bg-slate-200 text-slate-400 grayscale"
                  }`}
                >
                  {m.emoji}
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">{m.title}</h4>
                  <p className="text-[11px] font-bold text-orange-700">+{m.bonus_points} ⭐ • +{m.bonus_coins} 🪙</p>
                  <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                    {isUnlocked ? "✓ Қол жеткізілді" : `${m.days - stats.streak_days} күн қалды`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. LEVEL PROGRESS BLOCK (5 ДЕҢГЕЙ: 0–99, 100–249, 250–499, 500–799, 800+) */}
      <Card className="p-6 sm:p-7 bg-white border-3 border-emerald-200 shadow-kid-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Деңгей жүйесі
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              «{levelInfo.currentLevel.name}» {levelInfo.currentLevel.badgeEmoji}
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              {levelInfo.currentLevel.description}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-black text-slate-400 block">Келесі деңгейге:</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700">
              {levelInfo.pointsRemaining > 0 ? `${levelInfo.pointsRemaining} ұпай қалды` : "Ең жоғары шың!"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>{levelInfo.currentLevel.minPoints} XP</span>
            <span className="text-emerald-800 font-black">{stats.total_points} XP</span>
            <span>{levelInfo.nextLevel ? `${levelInfo.nextLevel.minPoints} XP` : "MAX"}</span>
          </div>
          <Progress
            value={levelInfo.progressPercentage}
            variant="green"
            height="md"
            showLabel={false}
          />
        </div>

        {/* 5 Levels Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
          {GAMIFICATION_LEVELS.map((lvl) => {
            const isCurrent = lvl.levelNumber === levelInfo.currentLevel.levelNumber;
            const isPassed = stats.total_points >= lvl.minPoints;

            return (
              <div
                key={lvl.levelNumber}
                className={`p-2.5 rounded-2xl text-center border transition-all ${
                  isCurrent
                    ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300 shadow-sm"
                    : isPassed
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-slate-50 border-slate-200 opacity-50"
                }`}
              >
                <span className="text-lg block mb-0.5">{lvl.badgeEmoji}</span>
                <p className="text-[11px] font-black text-slate-800 truncate">{lvl.name}</p>
                <span className="text-[10px] font-bold text-slate-500 block">
                  {lvl.minPoints}{lvl.maxPoints < 2000 ? `–${lvl.maxPoints}` : "+"} XP
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. 6 CORE BADGES (Алғашқы қадам, Оқырман досы, Белсенді оқырман, Жақсылық жасаушы, Отбасы жүрегі, Оқырман көшбасшысы) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Менің медальдарым мен жетістіктерім 🏅
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {unlockedBadges.length} / {GAMIFICATION_BADGES.length} Ашылды
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {GAMIFICATION_BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.key);

            return (
              <Card
                key={badge.id}
                interactive
                onClick={() => setSelectedBadge(badge)}
                className={`p-4 bg-white border-2 text-center flex flex-col items-center justify-between space-y-2 group transition-all ${
                  isUnlocked
                    ? "border-amber-300 hover:border-amber-400 shadow-sm"
                    : "border-slate-200 opacity-60 grayscale"
                }`}
              >
                <div className={`text-4xl transition-transform group-hover:scale-110 ${isUnlocked ? "animate-wiggle" : ""}`}>
                  {badge.emoji}
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    {badge.description}
                  </p>
                </div>

                {isUnlocked ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    ✓ Ашылды
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    🔒 Құлыптаулы
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* 6. DAILY MISSIONS (Күндік миссиялар) */}
      <Card className="p-6 sm:p-7 bg-white border-2 border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>🎯 Күндік миссиялар</span>
              {isMissionAllCompleted && <span className="text-xl">🎉</span>}
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Миссияларды орындап, қосымша ұпай мен алтын тиындарды жина!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-edu-sky-700 bg-edu-sky-100 px-3 py-1 rounded-full">
              {completedMissionsCount}/{missions.length} Орындалды
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={cn(
                "p-4 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-3",
                mission.completed
                  ? "bg-emerald-50/70 border-emerald-300"
                  : "bg-slate-50/70 border-slate-200 hover:border-amber-300"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{mission.emoji}</span>
                  <span
                    className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full border",
                      mission.completed
                        ? "bg-emerald-200 text-emerald-900 border-emerald-400"
                        : "bg-amber-100 text-amber-900 border-amber-300"
                    )}
                  >
                    +{mission.points} ұпай • +{mission.coins} 🪙
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900">
                  {mission.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {mission.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                {mission.completed ? (
                  <button
                    onClick={() => toggleMission(mission.id)}
                    className="w-full py-2 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-600 transition-colors"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Орындалды ✓</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (mission.type === "deed") setIsDeedModalOpen(true);
                      else if (mission.type === "game") setIsQuizModalOpen(true);
                      else toggleMission(mission.id);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 hover:bg-amber-300 shadow-sm transition-all"
                  >
                    <span>Орындау 🚀</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 7. ACTIVITY TIMELINE */}
      <Card className="p-6 sm:p-7 bg-white border-2 border-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-edu-sky-600" />
            <h3 className="text-xl font-black text-slate-900">
              Менің соңғы әрекеттерім (Хронология)
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Соңғы 4 белсенділік
          </span>
        </div>

        <div className="space-y-3">
          {timeline.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-200 shrink-0">
                  {act.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <Badge variant={act.badgeVariant} size="sm">
                  +{act.pointsEarned} ұпай
                </Badge>
                <p className="text-[11px] font-bold text-slate-400 mt-1">
                  {act.timeAgoKk}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* MODAL 1: POINTS TRANSACTIONS HISTORY MODAL */}
      {isTransactionsModalOpen && (
        <Modal
          isOpen={isTransactionsModalOpen}
          onClose={() => setIsTransactionsModalOpen(false)}
          title="Ұпайлар тарихы (Transactions Ledger) 📜"
          description="Әрбір орындалған кітап, ойын және жақсы іс үшін жазылған транзакциялар"
          emoji="⭐"
          maxWidth="lg"
        >
          <div className="space-y-4 text-left">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs font-black text-amber-900">
              <span>Барлық жиналған: {stats.total_points} ⭐ XP</span>
              <span>Транзакциялар саны: {transactions.length}</span>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{tx.title}</span>
                      <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                        {tx.action_type}
                      </span>
                    </div>
                    <p className="text-slate-500">{tx.description}</p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(tx.created_at).toLocaleString("kk-KZ")}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full block">
                      +{tx.points} ⭐
                    </span>
                    {tx.coins > 0 && (
                      <span className="text-[10px] font-black text-amber-700 block mt-1">
                        +{tx.coins} 🪙
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsTransactionsModalOpen(false)}
              className="w-full justify-center text-xs font-bold"
            >
              Жабу
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL 2: BADGE DETAIL MODAL */}
      {selectedBadge && (
        <Modal
          isOpen={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
          title={`Медаль: «${selectedBadge.title}»`}
          description={selectedBadge.description}
          emoji={selectedBadge.emoji}
          maxWidth="md"
        >
          <div className="space-y-4 text-center py-2">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner animate-wiggle">
              {selectedBadge.emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">«{selectedBadge.title}»</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedBadge.description}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              Шарт: {selectedBadge.required_condition} (+{selectedBadge.points_reward} ⭐)
            </div>
            <Button
              onClick={() => setSelectedBadge(null)}
              variant="green"
              size="md"
              className="w-full justify-center font-black text-xs"
            >
              Жарайсың! Жабу ✓
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL 3: GOOD DEED SUBMIT MODAL */}
      {isDeedModalOpen && (
        <Modal
          isOpen={isDeedModalOpen}
          onClose={() => setIsDeedModalOpen(false)}
          title="Жақсы іс қосу ❤️"
          description="Бүгін жасаған қайырымды, ізгі немесе қамқор ісіңді жаз!"
          emoji="🌸"
          maxWidth="md"
        >
          <form onSubmit={handleDeedSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-black text-slate-800">Жақсы істің атауы:</label>
              <Input
                required
                placeholder="Мысалы: Ауладағы құстарға жем шаштым"
                value={deedTitle}
                onChange={(e) => setDeedTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-800">Толық сипаттамасы:</label>
              <textarea
                required
                rows={3}
                placeholder="Кімге көмектестің? Қандай сезімде болдың?.."
                value={deedDescription}
                onChange={(e) => setDeedDescription(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-medium focus:border-rose-400 outline-none"
              />
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsDeedModalOpen(false)}
                className="w-1/3 justify-center text-xs"
              >
                Болдырмау
              </Button>
              <Button
                type="submit"
                variant="coral"
                size="md"
                className="w-2/3 justify-center font-black text-xs shadow-md"
              >
                Жақсы істі тіркеу (+20 XP) 💖
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ONBOARDING MODAL */}
      <StudentOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        studentName={studentName}
      />
    </div>
  );
}
