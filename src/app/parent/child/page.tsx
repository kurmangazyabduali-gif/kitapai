"use client";

import * as React from "react";
import { User, BookOpen, Award, Flame, CheckCircle2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MOCK_STUDENT, MOCK_BOOKS } from "@/lib/mock-data";

export default function ParentChildPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Баламның оқу барысы мен жетістіктері 🎒
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Алихан Сұлтанның оқылған кітаптары, тестілеу нәтижелері мен белсенділігі
        </p>
      </div>

      <Card className="p-6 bg-white border-2 border-slate-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar emoji="🦁" name="Алихан" size="xl" borderVariant="gold" />
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="sky" size="md">
                3 «А» сыныбы
              </Badge>
              <Badge variant="green" size="md">
                Озат оқырман 🌟
              </Badge>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Алихан Сұлтан</h2>
            <p className="text-xs font-bold text-slate-500">
              №84 мектеп-лицейі • Сынып жетекшісі: Айнұр Серікқызы
            </p>
          </div>

          <div className="flex gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-lg font-black text-amber-900">340</p>
              <p className="text-[10px] font-bold text-amber-700">Тиын 🪙</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-center">
              <p className="text-lg font-black text-sky-900">1250</p>
              <p className="text-[10px] font-bold text-sky-700">XP ⭐</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Book reading history */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
        <h3 className="text-lg font-black text-slate-800">
          Оқылған және оқылып жатқан кітаптар тарихы
        </h3>

        <div className="space-y-3">
          {MOCK_BOOKS.slice(0, 3).map((book, idx) => (
            <div
              key={book.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={idx === 0 ? "sky" : "green"} size="sm">
                    {idx === 0 ? "Оқылуда (70%)" : "Аяқталды ✓"}
                  </Badge>
                  <span className="text-xs font-bold text-slate-400">
                    {book.grade_level}-сынып
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-500">{book.author}</p>
              </div>

              <div className="w-full sm:w-48 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Прогресс:</span>
                  <span>{idx === 0 ? "10/14 бет" : "100% толық"}</span>
                </div>
                <Progress value={idx === 0 ? 70 : 100} variant={idx === 0 ? "sky" : "green"} height="sm" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
