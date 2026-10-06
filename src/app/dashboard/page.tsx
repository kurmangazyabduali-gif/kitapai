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
  Clock,
  Camera,
  ArrowRight,
  Share2,
  Smile,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_STUDENT, MOCK_BOOKS, MOCK_GOOD_DEEDS, MOCK_ACHIEVEMENTS } from "@/lib/mock-data";

export default function DashboardPage() {
  const router = useRouter();
  const { role, user } = useAuth();

  React.useEffect(() => {
    if (role === "teacher") router.replace("/teacher/dashboard");
    else if (role === "parent") router.replace("/parent/dashboard");
    else if (role === "admin") router.replace("/admin/dashboard");
  }, [role, router]);

  const [student, setStudent] = React.useState(user || MOCK_STUDENT);
  const [isDeedModalOpen, setIsDeedModalOpen] = React.useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = React.useState(false);
  const [deedTitle, setDeedTitle] = React.useState("");
  const [deedDescription, setDeedDescription] = React.useState("");
  const [quizScore, setQuizScore] = React.useState<number | null>(null);

  const activeBook = MOCK_BOOKS[0]; // Мақта қыз бен мысық

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti();
    setStudent((prev) => ({
      ...prev,
      coins: prev.coins + 50,
      stars: prev.stars + 100,
      total_deeds_done: prev.total_deeds_done + 1,
    }));
    setIsDeedModalOpen(false);
    setDeedTitle("");
    setDeedDescription("");
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      triggerConfetti();
      setQuizScore(100);
      setStudent((prev) => ({
        ...prev,
        coins: prev.coins + 30,
        stars: prev.stars + 50,
      }));
    } else {
      setQuizScore(50);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. WELCOME HERO BANNER */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-edu-sky-500 via-edu-purple-600 to-amber-400 p-6 sm:p-8 text-white shadow-kid-md">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              <span>🦁 {student.grade_level}-сынып оқушысы</span>
              <span>•</span>
              <span className="text-yellow-200">Озат оқырман</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Қайырлы күн, {student.full_name}! 👋
            </h1>
            <p className="text-sky-100 text-sm sm:text-base font-semibold max-w-xl">
              Бүгін «{activeBook.title}» ертегісінің соңғы 4 бетін оқып, жақсы іс миссиясын орындауға дайынсың ба?
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3">
            <Button
              onClick={() => setIsDeedModalOpen(true)}
              variant="yellow"
              size="lg"
              className="font-black text-sm"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>Жақсы іс қосу ❤️</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Алтын тиындар"
          value={student.coins}
          subtitle="Ойынға және дүкенге"
          icon="🪙"
          variant="yellow"
          trend="+50 бүгін"
        />
        <StatCard
          title="Жұлдыздар (XP)"
          value={student.stars}
          subtitle="Рейтинг ұпайы"
          icon="⭐"
          variant="sky"
          trend="Деңгей 3"
        />
        <StatCard
          title="Оқу сериясы"
          value={`${student.streak_days} күн`}
          subtitle="Үздіксіз белсенділік"
          icon="🔥"
          variant="rose"
          trend="Жарайсың!"
        />
        <StatCard
          title="Жақсы істерім"
          value={student.total_deeds_done}
          subtitle="Ата-анаң растаған"
          icon="❤️"
          variant="green"
          trend="9 орындалды"
        />
      </div>

      {/* 3. ACTIVE BOOK & TODAY'S GOOD DEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Book Card */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-7 border-3 border-edu-sky-200 bg-white h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="sky" size="md">
                  📖 Қазір оқылып жатыр
                </Badge>
                <span className="text-xs font-black text-slate-400">
                  10 / {activeBook.total_pages} бет
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-24 h-32 rounded-2xl bg-gradient-to-tr from-sky-400 to-amber-300 flex-shrink-0 flex items-center justify-center text-4xl shadow-md">
                  🐱
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-2xl font-black text-slate-800">
                    {activeBook.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    {activeBook.author} • {activeBook.category}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {activeBook.description}
                  </p>

                  <div className="pt-2">
                    <Progress value={70} variant="sky" showLabel height="md" />
                  </div>
                </div>
              </div>

              {/* 5-Step Formula Tracker for This Book */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Формула бойынша прогресс:
                </p>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-black">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ 1. ОҚЫ
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ 2. ТҮСІН
                  </div>
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    3. ОЙНА 🎮
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-400">
                    4. ЖАҚСЫ ІС
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-400">
                    5. ОТБАСЫ
                  </div>
                </div>
              </div>
            </div>

            {/* Book Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              <Button
                variant="sky"
                size="md"
                onClick={triggerConfetti}
                className="flex-1 justify-center"
              >
                <BookOpen className="w-4 h-4" />
                <span>Оқуды жалғастыру</span>
              </Button>
              <Button
                variant="purple"
                size="md"
                onClick={() => setIsQuizModalOpen(true)}
                className="flex-1 justify-center"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Викторинаны шешу (+30 🪙)</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Daily Good Deed Card */}
        <div className="lg:col-span-5">
          <Card className="p-6 sm:p-7 border-3 border-rose-200 bg-gradient-to-b from-rose-50/70 to-amber-50/50 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="coral" size="md">
                  ❤️ Бүгінгі жақсы іс
                </Badge>
                <span className="text-xs font-black text-rose-600">
                  +50 Тиын & 100 XP
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800">
                  «Қамқорлық таныту» миссиясы
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  «Мақта қыз бен мысық» ертегісінен үлгі алып, бүгін жануарға немесе ауладағы құстарға жем беріп, қамқорлық жаса!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black text-rose-700">
                  <Sparkles className="w-4 h-4" />
                  <span>Қалай орындау керек?</span>
                </div>
                <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside font-medium">
                  <li>Құстарға нан қиқымын немесе дән сал</li>
                  <li>Жасаған сәтіңді фотоға түсір</li>
                  <li>Күнделікке салып, ата-анаңа көрсет</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-200/80">
              <Button
                variant="coral"
                size="lg"
                onClick={() => setIsDeedModalOpen(true)}
                className="w-full justify-center text-sm font-black"
              >
                <Camera className="w-4 h-4" />
                <span>Істі орындадым, фото салу 📸</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. RECENT ACHIEVEMENTS & BADGES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-black text-slate-800">
              Менің жетістіктерім мен марапаттарым
            </h3>
          </div>
          <Link
            href="/dashboard#achievements"
            className="text-xs font-extrabold text-edu-sky-600 hover:underline"
          >
            Барлығын көру →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_ACHIEVEMENTS.map((ach) => (
            <Card
              key={ach.id}
              className={`p-4 text-center border-2 flex flex-col items-center justify-between ${
                ach.unlocked
                  ? "bg-white border-amber-200 shadow-sm"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="text-4xl mb-2 animate-wiggle">{ach.emoji}</div>
              <h4 className="text-xs font-black text-slate-800 line-clamp-1">
                {ach.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                {ach.description}
              </p>
              <div className="mt-3">
                {ach.unlocked ? (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ✓ Ашылды
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                    🔒 Құлыптаулы
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. RECOMMENDED BOOKS CAROUSEL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-edu-sky-600" />
            <h3 className="text-xl font-black text-slate-800">
              Сені күтіп тұрған келесі кітаптар
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BOOKS.slice(1, 4).map((book) => (
            <Card
              key={book.id}
              interactive
              className="bg-white border-2 border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="sky" size="sm">
                    {book.grade_level}-сынып
                  </Badge>
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    +{book.points_reward} 🪙
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-800">
                  {book.title}
                </h4>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  {book.author}
                </p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {book.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  ⏱️ ~{book.reading_time_minutes} мин
                </span>
                <Button variant="sky" size="sm" className="text-xs">
                  Таңдау 📖
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal 1: Good Deed Submission */}
      <Modal
        isOpen={isDeedModalOpen}
        onClose={() => setIsDeedModalOpen(false)}
        title="Жақсы іс күнделігі ❤️"
        description="Кітаптан алған өнегеңді жазып, суретіңмен бөліс!"
        emoji="✨"
        maxWidth="md"
      >
        <form onSubmit={handleDeedSubmit} className="space-y-4 text-left">
          <Input
            label="Жасаған жақсы ісіңнің атауы"
            placeholder="Мысалы: Құстарға жемсалғыш жасадым"
            value={deedTitle}
            onChange={(e) => setDeedTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Қысқаша сипаттамасы (қалай жасадың?)
            </label>
            <textarea
              className="w-full h-24 p-3 rounded-2xl border-2 border-slate-200 text-sm font-semibold focus:border-edu-sky-400 focus:outline-none focus:ring-4 focus:ring-edu-sky-100"
              placeholder="Әкеммен бірге ағаштан жасап, ауладағы ағашқа ілдік..."
              value={deedDescription}
              onChange={(e) => setDeedDescription(e.target.value)}
              required
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-2 cursor-pointer hover:bg-slate-100 transition-colors">
            <Camera className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-600">
              Суретті таңдаңыз немесе осында сүйреңіз 📸
            </p>
            <p className="text-[10px] text-slate-400">PNG, JPG 5MB дейін</p>
          </div>

          <Button type="submit" variant="coral" size="lg" className="w-full justify-center">
            Жақсы істі жариялау және +50 🪙 алу! 🎉
          </Button>
        </form>
      </Modal>

      {/* Modal 2: Interactive Quiz Minigame */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setQuizScore(null);
        }}
        title="«Мақта қыз бен мысық» викторинасы 🎮"
        description="Кітапты қаншалықты түсінгеніңді тексер!"
        emoji="💡"
        maxWidth="md"
      >
        {quizScore === null ? (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-edu-sky-50 border-2 border-edu-sky-200">
              <p className="text-xs font-black text-edu-sky-800 uppercase mb-1">
                1-сұрақ:
              </p>
              <p className="text-sm font-bold text-slate-800">
                Мысық Мақта қыздың қатығын не үшін төкті?
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleQuizAnswer(false)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 text-left transition-all"
              >
                A) Мақта қыз оны ойнатпағаны үшін
              </button>
              <button
                onClick={() => handleQuizAnswer(true)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 hover:border-edu-sky-400 hover:bg-edu-sky-50 text-xs font-bold text-slate-800 text-left transition-all"
              >
                B) Мақта қыз дүкенге кеткенде қатықты төгіп қойды
              </button>
              <button
                onClick={() => handleQuizAnswer(false)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 text-left transition-all"
              >
                C) Ағаштан алма түскендіктен
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="text-6xl animate-bounce">🎉</div>
            <h3 className="text-2xl font-black text-slate-800">
              Керемет! Дұрыс жауап!
            </h3>
            <p className="text-xs text-slate-600 font-semibold">
              Сен ертегіні мұқият түсініп оқыдың! Сенің қоржыныңа +30 🪙 тиын қосылды!
            </p>
            <Button
              variant="yellow"
              size="md"
              onClick={() => {
                setIsQuizModalOpen(false);
                setQuizScore(null);
              }}
            >
              Жарайсың! Жалғастыру 🚀
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
