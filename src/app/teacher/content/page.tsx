"use client";

import * as React from "react";
import { BookMarked, Plus, FileText, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeacherContentPage() {
  const materials = [
    {
      title: "«Мақта қыз бен мысық» тәрбие сағатының әдістемелік жоспары",
      type: "Тәрбие сағаты",
      grade: "1-сынып",
      duration: "45 минут",
    },
    {
      title: "«Алтын сақа» бойынша викториналық сұрақтар жинағы",
      type: "Тест & Ойын",
      grade: "2-сынып",
      duration: "20 минут",
    },
    {
      title: "«Әке мен бала» шығармасының талдау картасы мен жақсы іс миссиясы",
      type: "Әдебиеттік оқу",
      grade: "3-сынып",
      duration: "30 минут",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Әдістемелік контент және сабақ жоспарлары 📚
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Бастауыш сынып ұстаздарына арналған тәрбиелік материалдар мен тапсырмалар
          </p>
        </div>

        <Button variant="sky" size="md">
          <Plus className="w-4 h-4" />
          <span>Жаңа тапсырма бекіту</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {materials.map((mat, i) => (
          <Card key={i} className="bg-white border-2 border-slate-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="sky" size="sm">
                  {mat.grade}
                </Badge>
                <span className="text-[11px] font-bold text-slate-400">
                  ⏱️ {mat.duration}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-800 leading-snug">
                {mat.title}
              </h3>

              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">
                {mat.type}
              </span>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
              <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                <Download className="w-3.5 h-3.5" />
                <span>Жүктеп алу (PDF)</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
