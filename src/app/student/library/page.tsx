"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Sparkles,
  Headphones,
  Heart,
  Flame,
  CheckCircle2,
  Clock,
  Filter,
  Play,
  Pause,
  Volume2,
  SlidersHorizontal,
  Bookmark,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MOCK_BOOKS, LIBRARY_CATEGORIES } from "@/lib/mock-data";
import { getAdminBooks } from "@/lib/admin-data";
import { Book, LibraryCategoryKey, DifficultyLevel, ReadingStatus } from "@/types/database.types";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export default function StudentLibraryPage() {
  const [books, setBooks] = React.useState<Book[]>(MOCK_BOOKS);
  const [selectedCategory, setSelectedCategory] = React.useState<LibraryCategoryKey>("all");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<DifficultyLevel | "all">("all");
  const [selectedStatus, setSelectedStatus] = React.useState<ReadingStatus | "all">("all");
  const [sortBy, setSortBy] = React.useState<"popular" | "newest" | "all">("all");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    setBooks(getAdminBooks());
  }, []);

  // Audio Player Modal State
  const [playingBook, setPlayingBook] = React.useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioProgress, setAudioProgress] = React.useState(35);

  // Toggle Favorite
  const toggleFavorite = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const nextFav = !b.is_favorite;
          if (nextFav) {
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
          }
          return { ...b, is_favorite: nextFav };
        }
        return b;
      })
    );
  };

  // Filtered & Sorted books
  const filteredBooks = books.filter((book) => {
    const matchCategory =
      selectedCategory === "all" ||
      book.category === selectedCategory ||
      (selectedCategory === "kazakh_tales" && book.category === "ертегі") ||
      (selectedCategory === "children_literature" && book.category === "әңгіме") ||
      (selectedCategory === "children_magazines" && book.category === "журнал");

    const matchDifficulty =
      selectedDifficulty === "all" || book.difficulty === selectedDifficulty;

    const matchStatus =
      selectedStatus === "all" || (book.status || "unread") === selectedStatus;

    const matchSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.description.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchDifficulty && matchStatus && matchSearch;
  });

  // Sort logic
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "popular") return b.reads_count - a.reads_count;
    if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });

  const handleOpenAudio = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPlayingBook(book);
    setIsPlaying(true);
    setAudioProgress(25);
  };

  return (
    <div className="space-y-8">
      {/* 1. HERO BANNER: «Ертегі мен журнал әлемі» (Gaming-like magical book world) */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-kid-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-spin" />
              <span>Балалардың сиқырлы кітап әлемі 🌟</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ертегі мен журнал әлемі 📖✨
            </h1>

            <p className="text-sky-100 text-sm sm:text-base font-semibold max-w-2xl leading-relaxed">
              Қазақ халық ертегілері, ғибратты қысқа әңгімелер мен танымдық журналдарды оқы немесе аудиосын тыңда!
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="p-4 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
              <p className="text-2xl font-black text-yellow-300">
                {books.length} кітап
              </p>
              <p className="text-[11px] font-extrabold uppercase text-sky-100">
                Қорда бар
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 MAIN CATEGORY TILES (Interactive World Gateways) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {LIBRARY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const count = books.filter(
            (b) =>
              b.category === cat.key ||
              (cat.key === "kazakh_tales" && b.category === "ертегі") ||
              (cat.key === "children_literature" && b.category === "әңгіме") ||
              (cat.key === "children_magazines" && b.category === "журнал")
          ).length;

          return (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(isSelected ? "all" : (cat.key as LibraryCategoryKey))
              }
              className={cn(
                "p-4 sm:p-5 rounded-3xl border-3 text-left transition-all flex flex-col justify-between space-y-3 group",
                isSelected
                  ? "bg-white border-amber-400 ring-4 ring-amber-200 shadow-kid-lg scale-102"
                  : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-kid-md hover:-translate-y-0.5"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-black px-2.5 py-0.5 rounded-full border",
                    isSelected
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  )}
                >
                  {count} туынды
                </span>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg leading-snug">
                  {cat.display_name_kk}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              {isSelected && (
                <span className="text-[10px] font-black text-edu-sky-600 flex items-center gap-1">
                  Таңдалды ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & ADVANCED FILTERS BAR */}
      <Card className="p-4 sm:p-5 bg-white border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Кітап, ертегі немесе авторды іздеу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 bg-slate-50/50 text-sm font-semibold focus:border-edu-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-edu-sky-100 transition-all"
            />
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setSortBy("all")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all",
                sortBy === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Барлығы
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1",
                sortBy === "popular"
                  ? "bg-white text-amber-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Танымал</span>
            </button>
            <button
              onClick={() => setSortBy("newest")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1",
                sortBy === "newest"
                  ? "bg-white text-edu-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-edu-sky-600" />
              <span>Жаңалары</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter Pills: Difficulty & Read Status */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider">
              Күрделілігі:
            </span>
            <button
              onClick={() => setSelectedDifficulty("all")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-all",
                selectedDifficulty === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Барлығы
            </button>
            {(["жеңіл", "орташа", "күрделі"] as DifficultyLevel[]).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-bold transition-all",
                  selectedDifficulty === diff
                    ? "bg-edu-sky-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {diff === "жеңіл" ? "🟢 Жеңіл" : diff === "орташа" ? "🟡 Орташа" : "🔴 Күрделі"}
              </button>
            ))}
          </div>

          {/* Read status filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider">
              Күйі:
            </span>
            <button
              onClick={() => setSelectedStatus("all")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-all",
                selectedStatus === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Барлығы
            </button>
            <button
              onClick={() => setSelectedStatus("reading")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-all",
                selectedStatus === "reading"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              📖 Оқылуда
            </button>
            <button
              onClick={() => setSelectedStatus("completed")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-all",
                selectedStatus === "completed"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              ✅ Оқылған
            </button>
          </div>
        </div>
      </Card>

      {/* 4. BOOKS GRID (Rich Gaming Cards with Read & Listen buttons) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">
            Кітаптар топтамасы ({sortedBooks.length})
          </h2>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-xs font-bold text-edu-sky-600 hover:underline"
            >
              Барлық санаттарды көрсету
            </button>
          )}
        </div>

        {sortedBooks.length === 0 ? (
          <div className="p-12 text-center rounded-4xl bg-white border-2 border-slate-200 space-y-3">
            <div className="text-5xl">🔍📚</div>
            <h3 className="text-xl font-black text-slate-800">
              Сұранысыңыз бойынша ешқандай кітап табылмады
            </h3>
            <p className="text-xs text-slate-500">
              Басқа сөз жазып немесе сүзгілерді тазартып көріңіз.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
                setSelectedStatus("all");
              }}
            >
              Сүзгілерді тазарту
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBooks.map((book) => {
              const statusColor =
                book.status === "completed"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : book.status === "reading"
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-slate-100 text-slate-600 border-slate-200";

              return (
                <div
                  key={book.id}
                  className="rounded-4xl bg-white border-3 border-slate-200/90 shadow-kid-sm hover:border-edu-sky-300 hover:shadow-kid-lg hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Top Cover Image / Preview Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-tr from-sky-200 via-amber-100 to-purple-200 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between z-10">
                      <Badge variant="solidSky" size="sm">
                        {book.category_name_kk}
                      </Badge>

                      <button
                        onClick={(e) => toggleFavorite(book.id, e)}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 shadow-sm transition-all"
                        title="Таңдаулыларға қосу"
                      >
                        <Heart
                          className={cn(
                            "w-5 h-5 transition-colors",
                            book.is_favorite
                              ? "fill-rose-500 text-rose-500"
                              : "text-slate-400"
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-end justify-between z-10">
                      <span className="text-xs font-black text-slate-800 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        ⏱️ ~{book.estimated_minutes} мин
                      </span>

                      <span
                        className={cn(
                          "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-sm",
                          statusColor
                        )}
                      >
                        {book.status === "completed"
                          ? "✓ Оқылды"
                          : book.status === "reading"
                          ? `📖 ${book.current_page || 1}/${book.total_pages} бет`
                          : "⏳ Оқылмаған"}
                      </span>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                        <span>{book.author}</span>
                        <span className="text-amber-600 font-black">
                          +{book.points_reward} XP • +{book.coins_reward} 🪙
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-edu-sky-600 transition-colors">
                        {book.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {book.description}
                      </p>

                      {/* Moral & Good deed hint */}
                      <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-xs font-bold text-slate-800 space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-700">
                          <span>❤️</span>
                          <span>Жақсы іс:</span>
                        </div>
                        <p className="line-clamp-1 text-slate-700 font-medium">
                          {book.good_deed_prompt}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Оқу & Тыңдау */}
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4">
                      <Link href={`/student/library/${book.id}/read`} className="flex-1">
                        <Button
                          variant="sky"
                          size="md"
                          className="w-full justify-center text-xs font-black shadow-sm"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Оқу 📖</span>
                        </Button>
                      </Link>

                      {book.audio_url && (
                        <Button
                          variant="yellow"
                          size="md"
                          onClick={(e) => handleOpenAudio(book, e)}
                          className="justify-center text-xs font-black px-3.5 shadow-sm"
                          title="Аудиосын тыңдау"
                        >
                          <Headphones className="w-4 h-4" />
                          <span className="hidden sm:inline">Тыңдау</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audio Player Modal */}
      {playingBook && (
        <Modal
          isOpen={!!playingBook}
          onClose={() => {
            setPlayingBook(null);
            setIsPlaying(false);
          }}
          title={`«${playingBook.title}» аудиоертегісі`}
          description={`${playingBook.author} • Ұзақтығы: ${playingBook.audio_duration || "04:15"}`}
          emoji="🎧"
        >
          <div className="space-y-6 text-center">
            {/* Animated Audio Visualizer */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500 via-indigo-600 to-sky-500 text-white flex flex-col items-center justify-center space-y-4 shadow-lg">
              <div className="text-6xl animate-bounce">📻</div>

              <div className="flex items-center justify-center gap-1.5 h-10 w-full">
                {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35].map((h, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1.5 bg-yellow-300 rounded-full transition-all duration-300",
                      isPlaying ? "animate-pulse" : "h-2"
                    )}
                    style={{ height: isPlaying ? `${h}%` : "15%" }}
                  />
                ))}
              </div>

              <div className="w-full space-y-1">
                <div className="flex justify-between text-xs font-bold text-sky-100">
                  <span>01:25</span>
                  <span>{playingBook.audio_duration || "04:15"}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-amber-300 rounded-full transition-all"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-200 border-4 border-white active:scale-95 transition-transform"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-slate-950" /> : <Play className="w-7 h-7 fill-slate-950 ml-1" />}
              </button>
            </div>

            <div className="pt-2 flex gap-3">
              <Link href={`/student/library/${playingBook.id}/read`} className="w-full">
                <Button variant="sky" size="md" className="w-full justify-center">
                  <span>Мәтінімен бірге оқу 📖</span>
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
