"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Award,
  Flame,
  BookOpen,
  Heart,
  Eye,
  Filter,
  ArrowUpDown,
  Download,
  Printer,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  MOCK_TEACHER_CLASS_STUDENTS,
  TeacherStudentItem,
} from "@/lib/teacher-data";

export default function TeacherStudentsPage() {
  const [students] = React.useState<TeacherStudentItem[]>(MOCK_TEACHER_CLASS_STUDENTS);
  const [search, setSearch] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"points" | "books" | "deeds" | "name">("points");

  const filtered = React.useMemo(() => {
    return students
      .filter((s) => s.class_name === "2 «А»") // strict class isolation
      .filter((s) => {
        const matchesSearch = s.full_name.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = levelFilter === "all" ? true : s.reading_level === levelFilter;
        return matchesSearch && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === "points") return b.points - a.points;
        if (sortBy === "books") return b.books_read - a.books_read;
        if (sortBy === "deeds") return b.good_deeds_count - a.good_deeds_count;
        if (sortBy === "name") return a.full_name.localeCompare(b.full_name);
        return 0;
      });
  }, [students, search, levelFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edu-sky-100 text-edu-sky-800 text-xs font-black mb-1">
            <span>🏫 №271 мектеп-лицейі</span>
            <span>•</span>
            <span>2 «А» сыныбы</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            2 «А» сынып оқушыларының тізімі 👥
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Оқушылардың жеке оқырмандық белсенділігі, жинаған ұпайлары мен істері
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs font-black"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            <span>Есепті басып шығару 🖨️</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-2 border-slate-200">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Оқушының аты-жөнін іздеу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:border-edu-sky-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
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
      </Card>

      {/* Students Table */}
      <Card className="p-0 overflow-hidden bg-white border-2 border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
              <tr>
                <th className="p-4">Оқушының аты-жөні</th>
                <th className="p-4">Сынып</th>
                <th className="p-4">Оқырман деңгейі</th>
                <th className="p-4">Ұпай (XP)</th>
                <th className="p-4">📚 Кітап</th>
                <th className="p-4">🎮 Ойын</th>
                <th className="p-4">❤️ Жақсы іс</th>
                <th className="p-4">👨‍👩‍👧 Отбасы</th>
                <th className="p-4">Соңғы кіруі</th>
                <th className="p-4 text-right">Әрекет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filtered.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="p-4">
                    <Link
                      href={`/teacher/students/${st.id}`}
                      className="flex items-center gap-3 group cursor-pointer"
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
                  <td className="p-4 font-bold text-slate-600">{st.class_name}</td>
                  <td className="p-4">
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
                  <td className="p-4 font-black text-amber-900">
                    ⭐ {st.points} XP
                  </td>
                  <td className="p-4 font-bold text-sky-800">
                    {st.books_read}
                  </td>
                  <td className="p-4 font-bold text-purple-800">
                    {st.games_completed}
                  </td>
                  <td className="p-4 font-bold text-rose-600">
                    {st.good_deeds_count}
                  </td>
                  <td className="p-4 font-bold text-emerald-700">
                    {st.family_tasks_count}
                  </td>
                  <td className="p-4 text-[11px] text-slate-500 font-bold">
                    {st.last_activity}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/teacher/students/${st.id}`}>
                      <Button variant="outline" size="sm" className="text-xs font-bold">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Күнделігі</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
