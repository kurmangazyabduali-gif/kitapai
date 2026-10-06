"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Volume1,
  Bookmark,
  BookmarkCheck,
  Heart,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  HelpCircle,
  Lightbulb,
  Award,
  Check,
  X,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { MOCK_BOOKS } from "@/lib/mock-data";
import { Book, BookQuizQuestion } from "@/types/database.types";
import {
  getBookProgress,
  saveBookProgress,
  completeBookReading,
  checkIfAlreadyRewarded,
  BookProgressRecord,
} from "@/lib/book-progress";
import { cn } from "@/lib/utils";

export default function BookReadingPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "book-1";

  // Find book or fallback
  const book: Book =
    MOCK_BOOKS.find((b) => b.id === bookId) || MOCK_BOOKS[0];

  const totalPages = book.content?.length || 3;
  const studentId = "student-1"; // Ayala

  // 1. Progress State (Loaded & Synced with Database / LocalStorage)
  const [currentPage, setCurrentPage] = React.useState(1);
  const [progressPercent, setProgressPercent] = React.useState(33);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [bookmarkedPage, setBookmarkedPage] = React.useState(1);
  const [isFavorite, setIsFavorite] = React.useState(!!book.is_favorite);
  const [fontSize, setFontSize] = React.useState<"sm" | "md" | "lg" | "xl">("lg");
  const [readingTheme, setReadingTheme] = React.useState<"light" | "sepia" | "dark">("light");
  const [showResumeNotice, setShowResumeNotice] = React.useState(false);

  // 2. Audio Player State
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioSeconds, setAudioSeconds] = React.useState(0);
  const [audioSpeed, setAudioSpeed] = React.useState<number>(1.0);
  const [volume, setVolume] = React.useState<number>(80);
  const [isMuted, setIsMuted] = React.useState(false);
  const totalAudioSeconds = 240; // 4 minutes simulated

  // 3. Completion & Success State Modal
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [rewardResult, setRewardResult] = React.useState<{
    isFirstTime: boolean;
    pointsAwarded: number;
    coinsAwarded: number;
  }>({ isFirstTime: false, pointsAwarded: 0, coinsAwarded: 0 });

  // 4. Stage 2 «ТҮСІН» (Comprehension Mode State)
  const [isUnderstandMode, setIsUnderstandMode] = React.useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [quizScore, setQuizScore] = React.useState(0);
  const [quizSubmitted, setQuizSubmitted] = React.useState(false);
  const [quizFinished, setQuizFinished] = React.useState(false);

  // Default Comprehension Questions for this book if not specifically provided
  const comprehensionQuestions: BookQuizQuestion[] = [
    {
      id: "q-1",
      question: `«${book.title}» шығармасының басты кейіпкері кім?`,
      options: [book.author, book.title.split(" ")[0] || "Басты кейіпкер", "Бөгде адам", "Көрші ауыл тұрғыны"],
      correctIndex: 1,
      explanation: "Шығарма оқиғасы осы негізгі кейіпкердің әрекеттері мен басынан кешкен оқиғаларына құрылған.",
      moralInsight: "Әр кейіпкердің іс-әрекеті бізге жақсы мен жаманды ажыратуға көмектеседі.",
    },
    {
      id: "q-2",
      question: "Шығармадағы басты өнеге мен тәрбиелік мағына қандай?",
      options: [
        "Тек өз пайдаңды ойлау",
        book.moral_lesson || "Бір-біріне адал дос болу, уәдеде тұру және жақсылық жасау",
        "Қиындықтан қашып кету",
        "Басқалардың сөзін тыңдамау",
      ],
      correctIndex: 1,
      explanation: `Дұрыс! Бұл шығарма бізді: ${book.moral_lesson} қасиеттеріне баулиды.`,
      moralInsight: "Кітаптан түйген өнеге шынайы өмірде жақсы іс жасауға бағыттайды!",
    },
    {
      id: "q-3",
      question: `Осы кітапты оқығаннан кейін қандай жақсы іс жасауға болады?`,
      options: [
        book.good_deed_prompt || "Ата-анама көмектесу немесе құстарға жем беру",
        "Үйде күні бойы телефон қарау",
        "Достармен ренжісу",
        "Ойыншықтарды шашып тастау",
      ],
      correctIndex: 0,
      explanation: `Өте жақсы! Кітаптың басты үндеуі: «${book.good_deed_prompt}»`,
      moralInsight: "«Әр оқылған кітап — бір жақсы әрекетке бастайды!» 🌟",
    },
  ];

  // 1. Initial Mount: Load saved progress from storage/database
  React.useEffect(() => {
    const saved = getBookProgress(studentId, bookId, totalPages);
    if (saved) {
      const savedPage = Math.min(Math.max(1, saved.current_page || saved.last_position?.page || 1), totalPages);
      setCurrentPage(savedPage);
      setProgressPercent(Math.round((savedPage / totalPages) * 100));
      setIsBookmarked(saved.is_bookmarked && saved.bookmarked_page === savedPage);
      setBookmarkedPage(saved.bookmarked_page || 1);
      setIsFavorite(saved.is_favorite ?? !!book.is_favorite);
      setFontSize(saved.font_size || "lg");
      setReadingTheme(saved.theme || "light");
      setAudioSeconds(saved.audio_position_seconds || 0);

      // Show resume notice if resumed from middle
      if (savedPage > 1 || (saved.audio_position_seconds && saved.audio_position_seconds > 0)) {
        setShowResumeNotice(true);
        setTimeout(() => setShowResumeNotice(false), 4000);
      }
    }
  }, [bookId, totalPages]);

  // 2. Autosave progress on page/theme/font/bookmark change
  const persistCurrentProgress = (pageToSave: number, isMarked: boolean = isBookmarked) => {
    const calculatedPercent = Math.round((pageToSave / totalPages) * 100);
    setProgressPercent(calculatedPercent);

    saveBookProgress({
      student_id: studentId,
      book_id: bookId,
      current_page: pageToSave,
      total_pages: totalPages,
      progress: calculatedPercent,
      is_bookmarked: isMarked,
      bookmarked_page: isMarked ? pageToSave : bookmarkedPage,
      is_favorite: isFavorite,
      font_size: fontSize,
      theme: readingTheme,
      audio_position_seconds: audioSeconds,
      status: calculatedPercent === 100 ? "completed" : "reading",
    });
  };

  // 3. Audio Simulator Tick
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= totalAudioSeconds) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          // Synchronize reading page with audio progress
          const simulatedPage = Math.min(
            totalPages,
            Math.floor((next / totalAudioSeconds) * totalPages) + 1
          );
          if (simulatedPage !== currentPage) {
            setCurrentPage(simulatedPage);
            persistCurrentProgress(simulatedPage);
          }
          return next;
        });
      }, 1000 / audioSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audioSpeed, currentPage, totalPages]);

  // Audio helpers
  const togglePlayAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReplayAudio = () => {
    setAudioSeconds((prev) => Math.max(0, prev - 10));
  };

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Navigation handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextP = currentPage + 1;
      setCurrentPage(nextP);
      setIsBookmarked(isBookmarked && bookmarkedPage === nextP);
      persistCurrentProgress(nextP);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleCompleteBook();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevP = currentPage - 1;
      setCurrentPage(prevP);
      setIsBookmarked(isBookmarked && bookmarkedPage === prevP);
      persistCurrentProgress(prevP);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Bookmark Toggle
  const toggleBookmark = () => {
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    setBookmarkedPage(currentPage);
    persistCurrentProgress(currentPage, nextBookmarked);

    if (nextBookmarked) {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.2 },
        colors: ["#38BDF8", "#FACC15"],
      });
    }
  };

  // Favorite Toggle
  const toggleFav = () => {
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);
    saveBookProgress({
      student_id: studentId,
      book_id: bookId,
      is_favorite: nextFav,
    });
    if (nextFav) {
      confetti({ particleCount: 40, spread: 50, colors: ["#FB7185", "#F43F5E"] });
    }
  };

  // Font Size Cycles
  const cycleFontSize = () => {
    const sizes: Array<"sm" | "md" | "lg" | "xl"> = ["sm", "md", "lg", "xl"];
    const nextIndex = (sizes.indexOf(fontSize) + 1) % sizes.length;
    const nextSize = sizes[nextIndex];
    setFontSize(nextSize);
    saveBookProgress({
      student_id: studentId,
      book_id: bookId,
      font_size: nextSize,
    });
  };

  // Theme Cycles
  const cycleTheme = () => {
    const themes: Array<"light" | "sepia" | "dark"> = ["light", "sepia", "dark"];
    const nextIndex = (themes.indexOf(readingTheme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setReadingTheme(nextTheme);
    saveBookProgress({
      student_id: studentId,
      book_id: bookId,
      theme: nextTheme,
    });
  };

  // Handle Complete Book Reading
  const handleCompleteBook = () => {
    // Award points only once!
    const reward = completeBookReading(
      studentId,
      bookId,
      book.points_reward || 10,
      book.coins_reward || 20
    );

    setRewardResult(reward);
    setProgressPercent(100);
    setShowSuccessModal(true);

    // Confetti explosion
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#38BDF8", "#FACC15", "#4ADE80", "#C084FC", "#FB7185"],
    });
  };

  // Transition from Reading -> Stage 2: «ТҮСІН»
  const handleStartUnderstandStage = () => {
    setShowSuccessModal(false);
    router.push(`/student/library/${book.id}/understand`);
  };

  // Handle Quiz selection & answer
  const handleSelectQuizOption = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleCheckQuizAnswer = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedAnswer === comprehensionQuestions[currentQuizIndex].correctIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < comprehensionQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Styling maps based on font size and theme for 2nd grade kids
  const fontSizeClasses = {
    sm: "text-lg sm:text-xl leading-loose",
    md: "text-xl sm:text-2xl leading-loose",
    lg: "text-2xl sm:text-3xl leading-[2.2]", // optimal for grade 2
    xl: "text-3xl sm:text-4xl leading-[2.3]",
  };

  const themeStyles = {
    light: {
      pageBg: "bg-slate-50",
      cardBg: "bg-white border-slate-200 text-slate-800",
      headerBg: "bg-white/95 border-slate-200 text-slate-800",
      subText: "text-slate-500",
      playerBg: "bg-edu-sky-50/90 border-edu-sky-200 text-slate-800",
      highlight: "bg-amber-100 text-amber-950",
    },
    sepia: {
      pageBg: "bg-[#FBF0D9]",
      cardBg: "bg-[#F4ECD8] border-[#E2D4B7] text-[#433422]",
      headerBg: "bg-[#F4ECD8]/95 border-[#E2D4B7] text-[#433422]",
      subText: "text-[#7A6447]",
      playerBg: "bg-[#EFE3C8] border-[#DECFA9] text-[#433422]",
      highlight: "bg-[#FBE49D] text-[#433422]",
    },
    dark: {
      pageBg: "bg-[#0F172A]",
      cardBg: "bg-[#1E293B] border-slate-700 text-slate-100",
      headerBg: "bg-[#1E293B]/95 border-slate-700 text-slate-100",
      subText: "text-slate-400",
      playerBg: "bg-[#0F172A] border-slate-700 text-slate-100",
      highlight: "bg-indigo-950 text-indigo-200 border border-indigo-700",
    },
  };

  const activeTheme = themeStyles[readingTheme];
  const currentPageContent = book.content?.[currentPage - 1] || book.content?.[0] || "";

  return (
    <div className={cn("min-h-screen transition-colors duration-300 pb-28", activeTheme.pageBg)}>
      {/* 1. TOP STICKY TOOLBAR (Navigation, Progress, Controls) */}
      <header
        className={cn(
          "sticky top-0 z-40 backdrop-blur-md border-b-2 transition-colors px-4 sm:px-8 py-3.5 shadow-sm",
          activeTheme.headerBg
        )}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Back & Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href={`/student/library/${book.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-black transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Артқа</span>
            </Link>

            <div>
              <h1 className="text-base sm:text-lg font-black truncate max-w-[200px] sm:max-w-xs">
                {book.title}
              </h1>
              <p className={cn("text-xs font-bold truncate", activeTheme.subText)}>
                {book.author}
              </p>
            </div>
          </div>

          {/* Center: Reading Progress Badge & Bar */}
          <div className="w-full sm:w-64 flex flex-col items-center gap-1">
            <div className="flex items-center justify-between w-full text-xs font-extrabold px-1">
              <span className="text-edu-sky-600 font-black">
                Оқылу барысы: {progressPercent}%
              </span>
              <span className={activeTheme.subText}>
                {currentPage} / {totalPages}-бет
              </span>
            </div>
            <Progress
              value={progressPercent}
              max={100}
              variant="sky"
              height="sm"
              className="w-full"
            />
          </div>

          {/* Right: Font Size, Theme, Bookmark & Favorite Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Font size button */}
            <button
              onClick={cycleFontSize}
              title={`Қаріп өлшемі: ${fontSize.toUpperCase()}`}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-black flex items-center gap-1 transition-all"
            >
              <span className="text-sm font-black">A</span>
              <span className="text-[10px] text-edu-sky-600 font-extrabold uppercase">
                {fontSize === "sm" ? "18" : fontSize === "md" ? "22" : fontSize === "lg" ? "26" : "30"}
              </span>
            </button>

            {/* Theme switcher */}
            <button
              onClick={cycleTheme}
              title="Оқу реңкі (Ашық / Сепия / Кешкі)"
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              {readingTheme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
              {readingTheme === "sepia" && <Coffee className="w-4 h-4 text-[#8C6D46]" />}
              {readingTheme === "dark" && <Moon className="w-4 h-4 text-edu-sky-400" />}
            </button>

            {/* Bookmark button */}
            <button
              onClick={toggleBookmark}
              title={isBookmarked ? "Бетбелгі алынды" : "Осы бетке бетбелгі қою"}
              className={cn(
                "p-2.5 rounded-2xl transition-all flex items-center gap-1.5 text-xs font-extrabold",
                isBookmarked
                  ? "bg-amber-400 text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 text-slate-600 dark:text-slate-300"
              )}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-slate-900" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="hidden md:inline">
                {isBookmarked ? "Бетбелгіде" : "Бетбелгі"}
              </span>
            </button>

            {/* Favorite button */}
            <button
              onClick={toggleFav}
              title="Таңдаулы"
              className={cn(
                "p-2.5 rounded-2xl transition-all",
                isFavorite
                  ? "bg-rose-100 text-rose-600 border border-rose-200"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-400"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-rose-500 text-rose-500")} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. RESUME BANNER NOTICE (Shown on return if restored from last position) */}
      {showResumeNotice && (
        <div className="max-w-4xl mx-auto px-4 mt-3 animate-bounce">
          <div className="p-3.5 rounded-3xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔖</span>
              <span>
                Соңғы тоқтаған жеріңізден жалғастырылды ({currentPage}-бет)!
              </span>
            </div>
            <button
              onClick={() => setShowResumeNotice(false)}
              className="px-2.5 py-1 rounded-xl bg-slate-900/10 hover:bg-slate-900/20 text-xs"
            >
              Жабу ✕
            </button>
          </div>
        </div>
      )}

      {/* 3. STAGE 2: «ТҮСІН» COMPREHENSION MODE (if unlocked / active) */}
      {isUnderstandMode ? (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
          {/* Header of Stage «ТҮСІН» */}
          <Card className="p-6 sm:p-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-4xl border-none shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                <span>2-КЕЗЕҢ: «ТҮСІН»</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                «{book.title}» ертегісін түсіну викторинасы 💡
              </h2>
              <p className="text-sm text-purple-100 font-medium">
                Оқыған мәтініңнен алған өнеге мен мазмұнын сұрақтар арқылы тексерейік!
              </p>
            </div>
            <div className="absolute right-4 -bottom-6 text-8xl opacity-20 pointer-events-none select-none">
              💡
            </div>
          </Card>

          {/* Quiz Card */}
          {!quizFinished ? (
            <Card className={cn("p-6 sm:p-8 rounded-4xl border-3 shadow-kid-md space-y-6", activeTheme.cardBg)}>
              {/* Question Index Progress */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black text-edu-sky-600 uppercase tracking-wide">
                  Сұрақ {currentQuizIndex + 1} / {comprehensionQuestions.length}
                </span>
                <span className="text-xs font-extrabold text-amber-600">
                  Ұпай: {quizScore} / {comprehensionQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-xl sm:text-2xl font-black leading-snug">
                {comprehensionQuestions[currentQuizIndex].question}
              </h3>

              {/* Options List */}
              <div className="space-y-3">
                {comprehensionQuestions[currentQuizIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === comprehensionQuestions[currentQuizIndex].correctIndex;

                  let optionStyle = "border-slate-200 hover:border-edu-sky-400 bg-white/60 dark:bg-slate-800/60";
                  if (isSelected && !quizSubmitted) {
                    optionStyle = "border-edu-sky-500 bg-edu-sky-50 dark:bg-edu-sky-950/40 ring-4 ring-edu-sky-200";
                  }
                  if (quizSubmitted) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 ring-4 ring-emerald-200";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 ring-4 ring-rose-200";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizSubmitted}
                      onClick={() => handleSelectQuizOption(idx)}
                      className={cn(
                        "w-full p-4 sm:p-5 rounded-3xl border-3 text-left font-bold text-base sm:text-lg transition-all flex items-center justify-between gap-3 select-none",
                        optionStyle
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-black">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {quizSubmitted && isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      )}
                      {quizSubmitted && isSelected && !isCorrect && (
                        <X className="w-6 h-6 text-rose-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Moral Insight after Answer */}
              {quizSubmitted && (
                <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-300 uppercase">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Түсіндірме & Өнеге:</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {comprehensionQuestions[currentQuizIndex].explanation}
                  </p>
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-400">
                    💡 {comprehensionQuestions[currentQuizIndex].moralInsight}
                  </p>
                </div>
              )}

              {/* Action Button: Check or Next */}
              <div className="pt-2">
                {!quizSubmitted ? (
                  <Button
                    variant="sky"
                    size="lg"
                    disabled={selectedAnswer === null}
                    onClick={handleCheckQuizAnswer}
                    className="w-full justify-center text-base font-black shadow-lg"
                  >
                    Жауапты тексеру ✓
                  </Button>
                ) : (
                  <Button
                    variant="green"
                    size="lg"
                    onClick={handleNextQuizQuestion}
                    className="w-full justify-center text-base font-black shadow-lg"
                  >
                    {currentQuizIndex < comprehensionQuestions.length - 1
                      ? "Келесі сұрақ →"
                      : "Нәтижені көру 🏆"}
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            /* Quiz Completed Celebration Card */
            <Card className={cn("p-8 rounded-4xl border-3 shadow-kid-lg text-center space-y-6", activeTheme.cardBg)}>
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-4xl shadow-inner">
                🏆
              </div>

              <div className="space-y-2">
                <Badge variant="solidGreen" size="lg">
                  «ТҮСІН» КЕЗЕҢІ СӘТТІ АЯҚТАЛДЫ! 🎉
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Керемет нәтиже, Аяла!
                </h3>
                <p className={cn("text-sm max-w-md mx-auto font-medium", activeTheme.subText)}>
                  Сен ертегінің негізгі мазмұны мен өнегесін толық түсіндің. Енді осы өнегені жақсы іске асыруға дайынсың ба?
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 inline-flex items-center gap-4">
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-500">Дұрыс жауаптар:</div>
                  <div className="text-2xl font-black text-emerald-600">
                    {quizScore} / {comprehensionQuestions.length}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-500">Қосымша ұпай:</div>
                  <div className="text-2xl font-black text-amber-600">
                    +{comprehensionQuestions.length * 5} XP
                  </div>
                </div>
              </div>

              {/* Next Actions: Good Deeds or Back to Library */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link href="/student/good-deeds">
                  <Button variant="coral" size="lg" className="w-full justify-center text-sm font-black shadow-lg">
                    ❤️ Жақсы іс жасауға өту →
                  </Button>
                </Link>
                <Link href="/student/library">
                  <Button variant="outline" size="lg" className="w-full justify-center text-sm font-black">
                    📚 Кітапханаға қайту
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </main>
      ) : (
        /* 4. MAIN READING INTERFACE */
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
          {/* SYNC AUDIO PLAYER BAR (Play, Pause, Replay, Volume, Speed) */}
          <Card
            className={cn(
              "p-4 sm:p-5 rounded-3xl border-2 transition-all shadow-sm space-y-3",
              activeTheme.playerBg
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left: Audio Play / Pause / Replay buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayAudio}
                  className="w-12 h-12 rounded-2xl bg-edu-sky-500 hover:bg-edu-sky-400 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                  title={isPlaying ? "Тоқтату" : "Аудионы тыңдау"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleReplayAudio}
                  className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800 hover:bg-white text-slate-700 dark:text-slate-200 shadow-sm text-xs font-bold transition-all flex items-center gap-1"
                  title="10 секунд артқа"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">10с артқа</span>
                </button>

                {/* Animated sound wave bars when playing */}
                {isPlaying && (
                  <div className="flex items-end gap-1 h-6 px-2">
                    <span className="w-1 bg-edu-sky-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                    <span className="w-1 bg-edu-sky-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-5" />
                    <span className="w-1 bg-edu-sky-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-4" />
                    <span className="w-1 bg-edu-sky-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-6" />
                  </div>
                )}
              </div>

              {/* Center: Audio duration info */}
              <div className="text-xs font-black text-slate-600 dark:text-slate-300">
                <span>{formatAudioTime(audioSeconds)}</span>
                <span className="opacity-50"> / </span>
                <span>{book.audio_duration || "04:00"}</span>
              </div>

              {/* Right: Speed & Volume */}
              <div className="flex items-center gap-2">
                {/* Speed selector */}
                <div className="flex items-center bg-white/80 dark:bg-slate-800 rounded-2xl p-1 shadow-sm text-xs font-black">
                  {[0.75, 1.0, 1.25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setAudioSpeed(speed)}
                      className={cn(
                        "px-2 py-1 rounded-xl transition-all",
                        audioSpeed === speed
                          ? "bg-edu-sky-500 text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                {/* Volume toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-white transition-all"
                  title={isMuted ? "Дыбысты қосу" : "Дыбысты өшіру"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  ) : volume > 50 ? (
                    <Volume2 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                  ) : (
                    <Volume1 className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Audio timeline progress slider */}
            <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-2 cursor-pointer relative overflow-hidden">
              <div
                className="bg-edu-sky-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (audioSeconds / totalAudioSeconds) * 100)}%`,
                }}
              />
            </div>
          </Card>

          {/* READING BOOK CARD (Formatted for 2nd Grade: Large Text, Generous Line Height, Zero Clutter) */}
          <Card
            className={cn(
              "p-6 sm:p-12 rounded-4xl border-3 shadow-kid-md relative transition-all min-h-[420px] flex flex-col justify-between",
              activeTheme.cardBg
            )}
          >
            {/* Bookmark marker on top if active */}
            {isBookmarked && (
              <div className="absolute top-0 right-8 bg-amber-400 text-slate-900 px-3 py-1.5 rounded-b-xl shadow-md font-black text-xs flex items-center gap-1 animate-fadeIn">
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Бетбелгі {currentPage}-бетте</span>
              </div>
            )}

            {/* Book Chapter & Page Header */}
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="solidSky" size="sm">
                  {book.category_name_kk}
                </Badge>
                <span className="text-xs font-bold opacity-60">
                  {book.difficulty} деңгей
                </span>
              </div>
              <div className="text-xs font-extrabold text-edu-sky-600 bg-edu-sky-50 dark:bg-edu-sky-950 px-3 py-1 rounded-full">
                {currentPage} / {totalPages}-бет
              </div>
            </div>

            {/* Text Paragraphs (Child-Friendly 2nd Grade Layout) */}
            <div className="py-6 space-y-6 flex-1">
              <div
                className={cn(
                  "font-medium transition-all tracking-wide text-justify sm:text-left select-text",
                  fontSizeClasses[fontSize]
                )}
              >
                {/* Paragraph highlight if audio is active or reading */}
                <p className="leading-relaxed sm:leading-[2.2]">
                  {currentPageContent}
                </p>
              </div>
            </div>

            {/* Page Turning Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="md"
                disabled={currentPage === 1}
                onClick={handlePrevPage}
                className="text-xs sm:text-sm font-black gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Алдыңғы бет</span>
              </Button>

              <div className="text-xs font-bold opacity-60 hidden sm:block">
                Клавиатура: ← / → батырмалары
              </div>

              {currentPage < totalPages ? (
                <Button
                  variant="sky"
                  size="md"
                  onClick={handleNextPage}
                  className="text-xs sm:text-sm font-black gap-1.5 shadow-md"
                >
                  <span>Келесі бет</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="green"
                  size="md"
                  onClick={handleCompleteBook}
                  className="text-xs sm:text-sm font-black gap-1.5 shadow-md"
                >
                  <span>Аяқтау 🎉</span>
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>

          {/* 5. BOTTOM MAIN ACTION BUTTON: «Мен оқып болдым» */}
          <div className="text-center pt-2">
            <Button
              variant="green"
              size="lg"
              onClick={handleCompleteBook}
              className="w-full sm:w-auto px-10 py-5 text-lg sm:text-xl font-black rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all gap-2"
            >
              <span>🎉 Мен оқып болдым!</span>
            </Button>
            <p className={cn("text-xs mt-2 font-medium", activeTheme.subText)}>
              Оқып болған соң түсінгеніңді тексеріп, ұпай жина!
            </p>
          </div>
        </main>
      )}

      {/* 6. SUCCESS STATE MODAL («Жарайсың! Сен ертегіні оқып аяқтадың!») */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Оқу сәтті аяқталды! 🎉"
        maxWidth="md"
      >
        <div className="text-center space-y-6 py-2">
          {/* Joyful Mascot & Celebration Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-emerald-300 mx-auto flex items-center justify-center text-5xl shadow-lg animate-bounce">
            🌟
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Жарайсың! Сен ертегіні оқып аяқтадың! 🏆
            </h3>
            <p className="text-sm text-slate-600 font-semibold max-w-sm mx-auto">
              «{book.title}» кітабын толықтай оқып шықтың. Сен нағыз білімпаз оқырмансың!
            </p>
          </div>

          {/* Reward Block (Idempotent: points given only once) */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-yellow-50 to-emerald-50 border-2 border-amber-200 text-center space-y-2">
            {rewardResult.isFirstTime ? (
              <>
                <div className="text-xs font-black text-amber-900 uppercase">
                  Жаңа марапат алынды:
                </div>
                <div className="flex items-center justify-center gap-4 text-xl font-black">
                  <span className="text-edu-sky-700">+{rewardResult.pointsAwarded} XP Ұпай</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-700">+{rewardResult.coinsAwarded} 🪙 Тиын</span>
                </div>
              </>
            ) : (
              <div className="text-xs font-bold text-slate-600 py-1">
                ✓ Бұл кітаптың марапаты бұрын алынған (+{book.points_reward} XP)
              </div>
            )}
          </div>

          {/* Next Stage Button: «Түсінгенімді тексерейік →» */}
          <div className="space-y-3 pt-2">
            <Button
              variant="purple"
              size="lg"
              onClick={handleStartUnderstandStage}
              className="w-full justify-center text-base sm:text-lg font-black shadow-lg py-4 gap-2"
            >
              <span>💡 Түсінгенімді тексерейік →</span>
            </Button>

            <Link href="/student/library" className="block">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center text-xs font-bold text-slate-500"
              >
                Кітапхана тізіміне оралу
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
