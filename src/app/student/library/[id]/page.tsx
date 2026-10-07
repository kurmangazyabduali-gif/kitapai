"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  BookOpen,
  ArrowLeft,
  Headphones,
  Heart,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Award,
  Gamepad2,
  Camera,
  Share2,
  Volume2,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Book } from "@/types/database.types";
import { getFullBookById, getBookReadingPages } from "@/lib/book-progress";
import { fairyTaleAudio, sfx } from "@/lib/audio-engine";
import { cn } from "@/lib/utils";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "book-1";

  // Find book from admin storage or mock data with full fallback
  const book = getFullBookById(bookId);
  const bookPages = getBookReadingPages(book);

  // Reader State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [fontSize, setFontSize] = React.useState<"sm" | "md" | "lg" | "xl">("md");
  const [isCompleted, setIsCompleted] = React.useState(book.status === "completed");
  const [isFavorite, setIsFavorite] = React.useState(!!book.is_favorite);

  // Audio State
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioProgress, setAudioProgress] = React.useState(0);
  const [audioSeconds, setAudioSeconds] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = fairyTaleAudio.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setAudioProgress(state.progressPercent);
      setAudioSeconds(state.currentTimeSec);
    });
    return () => {
      unsubscribe();
      fairyTaleAudio.stop();
    };
  }, []);

  const togglePlayAudio = () => {
    const textToRead = bookPages.join(" ") || book.description;
    fairyTaleAudio.toggle(textToRead, {
      audioUrl: book.audio_url,
      speed: 1.0,
    });
  };

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Deed & Quiz Modals
  const [isDeedModalOpen, setIsDeedModalOpen] = React.useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = React.useState(false);
  const [deedTitle, setDeedTitle] = React.useState("");
  const [deedDescription, setDeedDescription] = React.useState("");
  const [quizAnswered, setQuizAnswered] = React.useState(false);

  const totalPages = bookPages.length || 3;
  const progressPercent = Math.round((currentPage / totalPages) * 100);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#38BDF8", "#FACC15", "#4ADE80", "#C084FC", "#FB7185"],
    });
  };

  const handleNextPage = () => {
    sfx.playPageTurn();
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    } else {
      handleCompleteReading();
    }
  };

  const handlePrevPage = () => {
    sfx.playPageTurn();
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleCompleteReading = () => {
    setIsCompleted(true);
    sfx.playSuccessSound();
    triggerConfetti();
  };

  const toggleFav = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      confetti({ particleCount: 50, spread: 50 });
    }
  };

  const handleDeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti();
    setIsDeedModalOpen(false);
    setDeedTitle("");
    setDeedDescription("");
    alert("Жақсы іс сәтті сақталды! Ата-анаңызға растауға жіберілді. +20 XP берілді!");
  };

  const handleQuizWin = () => {
    triggerConfetti();
    setQuizAnswered(true);
  };

  const fontSizeClasses = {
    sm: "text-sm leading-relaxed",
    md: "text-base sm:text-lg leading-loose",
    lg: "text-lg sm:text-xl leading-loose font-medium",
    xl: "text-xl sm:text-2xl leading-loose font-medium",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/library"
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Кітап сөресіне оралу</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFav}
            className={cn(
              "p-2.5 rounded-2xl border-2 transition-all flex items-center gap-1.5 text-xs font-black",
              isFavorite
                ? "bg-rose-50 border-rose-300 text-rose-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-rose-500 text-rose-500")} />
            <span className="hidden sm:inline">
              {isFavorite ? "Таңдаулыда ❤️" : "Таңдаулыға қосу"}
            </span>
          </button>
        </div>
      </div>

      {/* 1. BOOK HEADER HERO CARD */}
      <Card className="p-6 sm:p-8 bg-white border-3 border-slate-200 shadow-kid-md relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Big Book Cover Preview */}
          <div className="md:col-span-4 flex justify-center">
            <div className="w-full max-w-[220px] aspect-[3/4] rounded-3xl bg-gradient-to-tr from-edu-sky-400 via-amber-300 to-purple-400 p-6 flex flex-col justify-between text-white shadow-2xl border-4 border-white transform hover:rotate-1 transition-transform relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <span className="text-3xl">📖</span>
                <Badge variant="solidYellow" size="sm">
                  {book.grade_level}-сынып
                </Badge>
              </div>

              <div className="z-10 space-y-1">
                <h3 className="text-xl font-black leading-tight text-white drop-shadow">
                  {book.title}
                </h3>
                <p className="text-xs font-bold text-yellow-100">
                  {book.author}
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>

          {/* Book Information */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sky" size="md">
                {book.category_name_kk || "Қазақ ертегілері"}
              </Badge>
              <Badge variant="yellow" size="md">
                ⏱️ ~{book.estimated_minutes} минут оқу
              </Badge>
              <Badge variant="green" size="md">
                +{book.points_reward} XP • +{book.coins_reward} 🪙
              </Badge>
              <span className="text-xs font-bold text-slate-500">
                Жас шамасы: {book.age_group}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              {book.title}
            </h1>

            <p className="text-sm font-extrabold text-edu-sky-700">
              Авторы: {book.author}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {book.description}
            </p>

            {/* Reading Progress Indicator */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center text-xs font-black text-slate-700">
                <span>Оқу прогресі ({currentPage} / {totalPages} бет)</span>
                <span className="text-edu-sky-600 font-extrabold">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} variant="sky" height="md" showLabel={false} />

              <div className="pt-1">
                <Link href={`/student/library/${book.id}/read`}>
                  <Button variant="sky" size="lg" className="w-full justify-center text-sm font-black shadow-md">
                    <BookOpen className="w-5 h-5" />
                    <span>Толық оқу режиміне өту 📖 →</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. AUDIO PLAYER BANNER (Аудиосын тыңдау) */}
      {book.audio_url && (
        <Card className="p-5 sm:p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white border-0 shadow-kid-purple space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayAudio}
                className="w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-300/40 border-4 border-white active:scale-95 transition-transform"
                title={isPlaying ? "Тоқтату" : "Тыңдау"}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-1" />}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-300" />
                  <h4 className="font-black text-base sm:text-lg">
                    Қазақша аудиоертегіні тыңдау
                  </h4>
                </div>
                <p className="text-xs text-purple-100">
                  Көркем оқылған аудионұсқасы • Ұзақтығы: {book.audio_duration || "04:15"}
                </p>
              </div>
            </div>

            {/* Animated audio waves */}
            <div className="flex items-center gap-1 h-8">
              {[30, 60, 90, 40, 80, 100, 50, 70, 30].map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 bg-yellow-300 rounded-full transition-all duration-300",
                    isPlaying ? "animate-pulse" : "h-1.5"
                  )}
                  style={{ height: isPlaying ? `${h}%` : "20%" }}
                />
              ))}
            </div>
          </div>

          <div className="w-full space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-bold text-purple-100">
              <span>{formatAudioTime(audioSeconds)}</span>
              <span>{book.audio_duration || "04:15"}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden cursor-pointer">
              <div
                className="h-full bg-amber-300 rounded-full transition-all"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* 3. INTERACTIVE READER (Оқушы ридері) */}
      <Card className="p-6 sm:p-10 bg-white border-3 border-slate-200 shadow-kid-md space-y-8">
        {/* Reader Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-800">
              {currentPage}-бет
            </span>
            <span className="text-xs font-bold text-slate-400">
              / барлығы {totalPages} бет
            </span>
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setFontSize("sm")}
              className={cn(
                "px-2.5 py-1 rounded-xl text-xs font-black transition-all",
                fontSize === "sm" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("md")}
              className={cn(
                "px-2.5 py-1 rounded-xl text-xs font-black transition-all",
                fontSize === "md" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={cn(
                "px-2.5 py-1 rounded-xl text-xs font-black transition-all",
                fontSize === "lg" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              )}
            >
              A+
            </button>
          </div>
        </div>

        {/* Page Content View */}
        <div className="min-h-[220px] sm:min-h-[280px] flex items-center justify-center p-4 sm:p-6 rounded-3xl bg-[#FFFDF7] border-2 border-amber-100/80 shadow-inner">
          <p
            className={cn(
              "text-slate-800 font-sans text-left max-w-2xl transition-all",
              fontSizeClasses[fontSize]
            )}
          >
            {bookPages[currentPage - 1] || bookPages[0] || book.description}
          </p>
        </div>

        {/* Page Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Алдыңғы бет</span>
          </Button>

          <div className="flex items-center gap-2">
            {currentPage < totalPages ? (
              <Button
                variant="sky"
                size="lg"
                onClick={handleNextPage}
                className="w-full sm:w-auto px-8 font-black"
              >
                <span>Келесі бетке өту</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="yellow"
                size="lg"
                onClick={handleCompleteReading}
                className="w-full sm:w-auto px-8 font-black shadow-lg"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Мен оқып болдым! 🎉</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 4. COMPLETED CELEBRATION & NEXT STEPS (5-Formula: Өнеге, Жақсы іс, Викторина) */}
      {isCompleted && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          {/* Celebration Banner */}
          <div className="p-6 rounded-4xl bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-500 text-white shadow-kid-green text-center space-y-3">
            <div className="text-6xl animate-bounce">🎉📚✨</div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Керемет! Кітапты толық оқып бітірдің!
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base font-semibold max-w-xl mx-auto">
              Сенің қоржыныңа <strong>+{book.points_reward} XP ұпай</strong> және <strong>+{book.coins_reward} 🪙 тиын</strong> қосылды! Енді өнегені жақсы іске айналдыр!
            </p>
          </div>

          {/* 5-Step Formula Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Moral & Good Deed Mission */}
            <Card className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 border-3 border-rose-200 shadow-kid-coral flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="coral" size="md">
                    ❤️ Жақсы іс миссиясы
                  </Badge>
                  <span className="text-xs font-black text-rose-700">
                    +20 XP • +30 🪙
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-snug">
                  «{book.title}» бойынша жақсы іс жасау
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  <span className="font-bold text-rose-900">Өнеге: </span>
                  {book.moral_lesson}
                </p>

                <div className="p-3.5 rounded-2xl bg-white border border-rose-200 text-xs font-bold text-slate-800 space-y-1">
                  <p className="text-[10px] font-black uppercase text-rose-700">
                    Тапсырма:
                  </p>
                  <p>{book.good_deed_prompt}</p>
                </div>
              </div>

              <Button
                variant="coral"
                size="lg"
                onClick={() => setIsDeedModalOpen(true)}
                className="w-full justify-center font-black"
              >
                <Camera className="w-4 h-4" />
                <span>Істі орындадым, фото салу 📸</span>
              </Button>
            </Card>

            {/* Quiz / Comprehension Challenge */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-3 border-purple-200 shadow-kid-purple flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="md">
                    🎮 Ойын & Викторина
                  </Badge>
                  <span className="text-xs font-black text-purple-700">
                    +10 XP • +15 🪙
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-snug">
                  Кітапты түсінгеніңді тексер!
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  Ертегінің оқиғалары бойынша интерактивті сұрақтарға жауап беріп, қосымша алтын тиындар ұтып ал!
                </p>

                <div className="p-3.5 rounded-2xl bg-white border border-purple-200 text-xs font-bold text-slate-800 space-y-1">
                  <p className="text-[10px] font-black uppercase text-purple-700">
                    Сұрақтар саны:
                  </p>
                  <p>3 сұрақтан тұратын қызықты викторина</p>
                </div>
              </div>

              <Button
                variant="purple"
                size="lg"
                onClick={() => setIsQuizModalOpen(true)}
                className="w-full justify-center font-black"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Викторинаны шешу 🎮</span>
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Modal 1: Good Deed Submission Modal */}
      <Modal
        isOpen={isDeedModalOpen}
        onClose={() => setIsDeedModalOpen(false)}
        title="Жақсы істі тіркеу ❤️"
        description={`«${book.title}» ертегісінен алған өнегеңді жазып, суретіңмен бөліс!`}
        emoji="✨"
      >
        <form onSubmit={handleDeedSubmit} className="space-y-4 text-left">
          <Input
            label="Жақсы істің атауы"
            placeholder="Мысалы: Ауладағы құстарға жемсалғыш жасадым"
            value={deedTitle}
            onChange={(e) => setDeedTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Қалай орындадың? (Сипаттамасы)
            </label>
            <textarea
              className="w-full h-20 p-3 rounded-2xl border-2 border-slate-200 text-sm font-semibold focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-100"
              placeholder="Әкеммен бірге жасап, ауладағы ағашқа ілдік..."
              value={deedDescription}
              onChange={(e) => setDeedDescription(e.target.value)}
              required
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-1 cursor-pointer hover:bg-slate-100">
            <Camera className="w-6 h-6 mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-600">
              Фотосурет жүктеу 📸
            </p>
          </div>

          <Button type="submit" variant="coral" size="lg" className="w-full justify-center">
            Жақсы істі сақтау (+20 XP, +30 🪙) 🎉
          </Button>
        </form>
      </Modal>

      {/* Modal 2: Quiz Modal */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setQuizAnswered(false);
        }}
        title={`«${book.title}» викторинасы 🎮`}
        description="Кітапты қаншалықты мұқият оқығаныңды тексер!"
        emoji="💡"
      >
        {!quizAnswered ? (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-edu-sky-50 border-2 border-edu-sky-200">
              <p className="text-xs font-black text-edu-sky-800 uppercase mb-1">
                1-сұрақ:
              </p>
              <p className="text-sm font-bold text-slate-800">
                Бұл шығарма бізді қандай басты құндылыққа үйретеді?
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleQuizWin}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-200 hover:border-edu-sky-400 hover:bg-edu-sky-50 text-xs font-bold text-slate-800 text-left transition-all"
              >
                A) {book.moral_lesson}
              </button>
              <button
                onClick={() => alert("Қайта ойланып көр!")}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 text-left transition-all"
              >
                B) Тек өзімшіл болу
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="text-6xl animate-bounce">🏆</div>
            <h3 className="text-2xl font-black text-slate-800">
              Жарайсың! Дұрыс жауап!
            </h3>
            <p className="text-xs text-slate-600 font-semibold">
              Сенің қоржыныңа +10 XP ұпай және +15 🪙 тиын сыйлық қосылды!
            </p>
            <Button
              variant="yellow"
              size="md"
              onClick={() => {
                setIsQuizModalOpen(false);
                setQuizAnswered(false);
              }}
            >
              Жалғастыру 🚀
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
