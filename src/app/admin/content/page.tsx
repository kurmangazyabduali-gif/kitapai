"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Book, LibraryCategoryKey, DifficultyLevel } from "@/types/database.types";
import {
  getAdminBooks,
  saveAdminBook,
  deleteAdminBook,
} from "@/lib/admin-data";

export default function AdminContentPage() {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingBook, setEditingBook] = React.useState<Book | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Book | null>(null);

  // Form
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [category, setCategory] = React.useState<
    "kazakh_tales" | "children_literature" | "short_stories" | "children_magazines"
  >("kazakh_tales");
  const [gradeLevel, setGradeLevel] = React.useState(2);
  const [description, setDescription] = React.useState("");
  const [moralLesson, setMoralLesson] = React.useState("");
  const [goodDeedPrompt, setGoodDeedPrompt] = React.useState("");

  const reloadBooks = React.useCallback(() => {
    setBooks(getAdminBooks());
  }, []);

  React.useEffect(() => {
    reloadBooks();
  }, [reloadBooks]);

  const handleOpenAdd = () => {
    setEditingBook(null);
    setTitle("");
    setAuthor("");
    setCategory("kazakh_tales");
    setGradeLevel(2);
    setDescription("");
    setMoralLesson("");
    setGoodDeedPrompt("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(
      (book.category as any) === "ертегі"
        ? "kazakh_tales"
        : (book.category as any) === "әңгіме"
        ? "short_stories"
        : (book.category as any) === "журнал"
        ? "children_magazines"
        : (book.category as any) || "kazakh_tales"
    );
    setGradeLevel(book.grade_level || 2);
    setDescription(book.description);
    setMoralLesson(book.moral_lesson);
    setGoodDeedPrompt(book.good_deed_prompt);
    setIsAddModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 50, spread: 60 });

    const categoryNames: Record<string, string> = {
      kazakh_tales: "Қазақ ертегілері",
      children_literature: "Балалар әдебиеті",
      short_stories: "Қысқа әңгімелер",
      children_magazines: "Балалар журналдары",
    };

    saveAdminBook({
      id: editingBook ? editingBook.id : undefined,
      title,
      author,
      category,
      category_name_kk: categoryNames[category] || "Балалар әдебиеті",
      grade_level: gradeLevel as 1 | 2 | 3 | 4,
      difficulty: "жеңіл",
      age_group: `${gradeLevel + 5}-${gradeLevel + 7} жас`,
      reading_time_minutes: 8,
      estimated_minutes: 8,
      total_pages: 3,
      description,
      moral_lesson: moralLesson,
      good_deed_prompt: goodDeedPrompt,
      points_reward: 10,
      coins_reward: 20,
      cover_url:
        editingBook?.cover_url ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
      content: editingBook?.content || [
        `${title} шығармасының қызықты бөлімі. Кітаптан алған өнеге: ${moralLesson}`,
      ],
    });

    setIsAddModalOpen(false);
    reloadBooks();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteAdminBook(deleteTarget.id);
      setDeleteTarget(null);
      reloadBooks();
    }
  };

  const filtered = books.filter((b) => {
    const matchCat = selectedCategory === "all" || b.category === selectedCategory;
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Контентті басқару: Кітаптар мен журналдар қоры 📚
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Платформадағы {books.length} туынды, ертегілер мен балалар журналдарының толық тізілімі
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="yellow" size="md" className="font-black shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Жаңа кітап қосу 📖</span>
        </Button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Кітап немесе авторды іздеу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border-2 border-slate-200 bg-white text-xs font-semibold focus:border-edu-sky-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Барлығы ({books.length})
          </button>
          {[
            { key: "kazakh_tales", label: "📖 Ертегілер" },
            { key: "children_literature", label: "📚 Әдебиет" },
            { key: "short_stories", label: "📝 Әңгімелер" },
            { key: "children_magazines", label: "📰 Журналдар" },
          ].map((c) => {
            const count = books.filter((b) => b.category === c.key).length;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedCategory === c.key
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="📚"
          title="Кітап табылмады"
          description="Іздеу сөзін өзгертіп немесе сүзгіні тазартып көріңіз."
          actionText="Барлық кітаптарды көрсету"
          onAction={() => {
            setSearch("");
            setSelectedCategory("all");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((book) => (
            <Card
              key={book.id}
              className="p-5 bg-white border-2 border-slate-200 shadow-kid-sm flex flex-col justify-between hover:border-edu-sky-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="sky" size="sm">
                    {book.grade_level}-сынып
                  </Badge>
                  <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    +{book.points_reward} ⭐ • +{book.coins_reward} 🪙
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    {book.author}
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {book.description}
                </p>

                {/* Moral Lesson */}
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-800 space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-amber-900">
                    💡 Басты өнеге:
                  </p>
                  <p className="line-clamp-1 font-semibold">{book.moral_lesson}</p>
                </div>

                {/* Good Deed Prompt */}
                <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-slate-800 space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-rose-700">
                    ❤️ Жақсы іс:
                  </p>
                  <p className="line-clamp-1 font-semibold">{book.good_deed_prompt}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Button
                  onClick={() => handleOpenEdit(book)}
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center text-xs font-bold"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Өңдеу
                </Button>
                <Button
                  onClick={() => setDeleteTarget(book)}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-rose-600 hover:bg-rose-50 font-bold px-3"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingBook ? "Кітапты өңдеу ✏️" : "Жаңа кітап қосу 📖"}
          description="Платформа кітапханасына жаңа шығарма енгізу"
          emoji="📚"
          maxWidth="md"
        >
          <form onSubmit={handleSaveBook} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-black text-slate-800">Кітап атауы:</label>
              <Input
                required
                placeholder="Мысалы: Мақта қыз бен мысық"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-800">Авторы:</label>
              <Input
                required
                placeholder="Мысалы: Қазақ халық ертегісі немесе Ыбырай Алтынсарин"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-800">Санаты:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-2xl border-2 border-slate-200 text-xs font-bold bg-white outline-none focus:border-edu-sky-400"
                >
                  <option value="kazakh_tales">📖 Қазақ ертегілері</option>
                  <option value="children_literature">📚 Балалар әдебиеті</option>
                  <option value="short_stories">📝 Қысқа әңгімелер</option>
                  <option value="children_magazines">📰 Балалар журналдары</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-800">Сынып деңгейі:</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(Number(e.target.value))}
                  className="w-full p-2.5 rounded-2xl border-2 border-slate-200 text-xs font-bold bg-white outline-none focus:border-edu-sky-400"
                >
                  <option value={1}>1-сынып</option>
                  <option value={2}>2-сынып</option>
                  <option value={3}>3-сынып</option>
                  <option value={4}>4-сынып</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-slate-800">Қысқаша сипаттамасы:</label>
              <textarea
                required
                rows={2}
                placeholder="Шығарманың мазмұны мен басты кейіпкерлері туралы..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-medium focus:border-edu-sky-400 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-800">💡 Тәрбиелік өнегесі:</label>
              <Input
                required
                placeholder="Мысалы: Уәдеге берік болу, бір-біріне көмектесу"
                value={moralLesson}
                onChange={(e) => setMoralLesson(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-800">❤️ Ұсынылатын жақсы іс:</label>
              <Input
                required
                placeholder="Мысалы: Ауладағы құстарға немесе үй жануарына жем бер"
                value={goodDeedPrompt}
                onChange={(e) => setGoodDeedPrompt(e.target.value)}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs"
              >
                Болдырмау
              </Button>
              <Button type="submit" variant="yellow" size="md" className="text-xs font-black">
                Сақтау ✓
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Кітапты өшіру ⚠️"
          description={`«${deleteTarget.title}» шығармасын қордан өшіргіңіз келе ме?`}
          emoji="🗑️"
          maxWidth="sm"
        >
          <div className="space-y-4 text-center pt-2">
            <p className="text-xs text-slate-600 font-semibold">
              Бұл әрекетті кері қайтару мүмкін емес.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setDeleteTarget(null)}
                className="text-xs font-bold"
              >
                Болдырмау
              </Button>
              <Button
                onClick={handleDelete}
                variant="coral"
                size="md"
                className="text-xs font-black"
              >
                Иә, өшіру 🗑️
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
