"use client";

import * as React from "react";
import { School, Plus, Search, Users, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_SCHOOLS, MOCK_CLASSES } from "@/lib/mock-data";

export default function AdminClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Мектептер мен Сыныптарды басқару 🏫
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Платформаға қосылған білім беру мекемелері және олардың сыныптары
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="sky" size="md">
            <Plus className="w-4 h-4" />
            <span>Жаңа мектеп қосу</span>
          </Button>
          <Button variant="yellow" size="md">
            <Plus className="w-4 h-4" />
            <span>Сынып ашу</span>
          </Button>
        </div>
      </div>

      {/* Schools List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-800">
          Қатысушы мектептер ({MOCK_SCHOOLS.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_SCHOOLS.map((sc) => (
            <Card key={sc.id} className="p-5 bg-white border-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {sc.code}
                </span>
                <Badge variant="green" size="sm">
                  Қосылған ✓
                </Badge>
              </div>

              <h4 className="text-base font-black text-slate-900">
                {sc.name}
              </h4>

              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-edu-sky-600" />
                <span>{sc.city}, {sc.region}</span>
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-black text-slate-800">
          Сыныптар тізілімі
        </h3>
        <Card className="p-0 overflow-hidden bg-white border-2 border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
              <tr>
                <th className="p-4">Сынып</th>
                <th className="p-4">Мектеп</th>
                <th className="p-4">Сынып жетекшісі</th>
                <th className="p-4">Оқушылар саны</th>
                <th className="p-4 text-right">Әрекеттер</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {MOCK_CLASSES.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-black text-slate-900 text-sm">
                    {cls.grade_level} «{cls.letter}»
                  </td>
                  <td className="p-4">{cls.school_name}</td>
                  <td className="p-4 font-bold text-edu-sky-700">
                    {cls.teacher_name || "Тағайындалмаған"}
                  </td>
                  <td className="p-4 font-extrabold">{cls.student_count} оқушы</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      Өңдеу ✏️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
