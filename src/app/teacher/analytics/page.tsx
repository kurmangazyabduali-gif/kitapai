"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Heart,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Brain,
  Sparkles,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getMockTeacherClassDiagnostic } from "@/lib/ai-diagnost";
import { cn } from "@/lib/utils";

export default function TeacherAnalyticsPage() {
  const diagnostic = getMockTeacherClassDiagnostic();
  const [selectedSkillFilter, setSelectedSkillFilter] = React.useState<string>("all");

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black mb-1">
            <Brain className="w-3.5 h-3.5" />
            <span>AI ПЕДАГОГИКАЛЫҚ ДИАГНОСТИКА</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Сынып оқырмандық сауаттылығы & AI Талдау 📊
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            {diagnostic.class_name} • 25 оқушының мәтінді түсіну («ТҮСІН» кезеңі) және жақсы істер статистикасы
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="solidPurple" size="lg">
            Орташа балл: {diagnostic.average_comprehension_score}%
          </Badge>
        </div>
      </div>

      {/* 1. KEY CHALLENGE HIGHLIGHT ALERT BANNER (32% Problem Area) */}
      <div className="p-6 rounded-4xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-kid-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-200" />
              <span>Басты педагогикалық назар аударатын тұс:</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-snug">
              «{diagnostic.key_challenge_summary_kk}»
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
              Оқушылар оқиғалар мен кейіпкерлерді жақсы есте сақтағанымен (88%), ертегінің түпкі өнегесі мен авторының айтпақ болған басты ойын қорытуда көмек қажет етеді.
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-white/20 backdrop-blur-md text-center min-w-[150px] border border-white/30">
            <span className="text-xs font-extrabold text-amber-100 uppercase">
              Қиналғандар үлесі
            </span>
            <div className="text-4xl font-black text-amber-200 mt-1">32%</div>
            <span className="text-[11px] font-bold opacity-80">(8 оқушы)</span>
          </div>
        </div>
      </div>

      {/* 2. 6 SKILL CATEGORIES CLASS-WIDE BREAKDOWN MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span>Сынып бойынша 6 оқырмандық дағдының меңгерілуі:</span>
          </h2>
          <span className="text-xs font-bold text-slate-400">Тест тапсырғандар: 22/25 оқушы</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {diagnostic.skill_breakdown.map((item) => (
            <Card
              key={item.skill}
              className={cn(
                "p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4",
                item.status === "critical"
                  ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-100"
                  : item.status === "moderate"
                  ? "bg-purple-50/50 border-purple-200"
                  : "bg-white border-slate-200 shadow-sm"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <Badge
                    variant={
                      item.status === "critical"
                        ? "coral"
                        : item.status === "moderate"
                        ? "yellow"
                        : "green"
                    }
                    size="sm"
                  >
                    {item.status === "critical"
                      ? "Қиындық туғызды (32%)"
                      : item.status === "moderate"
                      ? "Дамыту қажет"
                      : "Жақсы меңгерілген"}
                  </Badge>
                </div>

                <h3 className="font-black text-base text-slate-900 leading-snug">
                  {item.name_kk}
                </h3>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Сәттілік деңгейі:</span>
                  <span className="text-slate-900 font-extrabold">{item.success_rate}%</span>
                </div>
                <Progress
                  value={item.success_rate}
                  max={100}
                  variant={
                    item.status === "critical"
                      ? "yellow"
                      : item.status === "moderate"
                      ? "purple"
                      : "green"
                  }
                  height="sm"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 3. STUDENT DIFFICULTY MATRIX TABLE */}
      <Card className="p-6 bg-white border-3 border-slate-200 rounded-4xl shadow-kid-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-edu-sky-600" />
              <span>Оқушылардың жеке диагностикалық матрицасы</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Әр оқушының қай жерде қиналғаны және ұсынылатын педагогикалық әрекет
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-400 font-black">
                <th className="pb-3">Оқушы</th>
                <th className="pb-3 text-center">Орташа балл</th>
                <th className="pb-3">Ең көп қателескен бағыты</th>
                <th className="pb-3">Ұсынылатын іс-әрекет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {diagnostic.student_matrix.map((std) => (
                <tr key={std.student_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 flex items-center gap-2.5">
                    <span className="text-2xl">{std.avatar_emoji}</span>
                    <span className="font-extrabold text-slate-900">{std.student_name}</span>
                  </td>
                  <td className="py-3.5 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-black",
                        std.score >= 80
                          ? "bg-emerald-100 text-emerald-800"
                          : std.score >= 70
                          ? "bg-sky-100 text-sky-800"
                          : "bg-amber-100 text-amber-900"
                      )}
                    >
                      {std.score}%
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                      {std.hardest_skill_kk}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600 font-medium">
                    {std.suggested_action_kk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. TEACHER ACTION RECOMMENDATIONS (Мұғалімге арналған кеңестер) */}
      <Card className="p-6 sm:p-8 rounded-4xl bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 border-3 border-purple-200 space-y-4 shadow-kid-sm">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-black text-slate-900">
            Мұғалімге арналған AI Педагогикалық кеңестер:
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {diagnostic.pedagogical_recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-3xl bg-white border-2 border-purple-100 shadow-xs flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
