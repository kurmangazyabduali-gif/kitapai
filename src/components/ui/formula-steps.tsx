"use client";

import * as React from "react";
import { BookOpen, Lightbulb, Gamepad2, HeartHandshake, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: number;
  emoji: string;
  title: string;
  action: string;
  tagline: string;
  description: string;
  color: "sky" | "yellow" | "purple" | "rose" | "green";
  icon: typeof BookOpen;
  example: string;
}

export const FORMULA_STEPS: StepItem[] = [
  {
    id: 1,
    emoji: "📚",
    title: "1. ОҚЫ",
    action: "Кітаппен сырласу",
    tagline: "Қызықты ертегілер мен ғибратты әңгімелерді өз қарқыныңмен оқы",
    description: "Оқушы қызықты аудио, мәтін және иллюстрациялар арқылы қазақ балалар әдебиетінің жауһарларымен танысады.",
    color: "sky",
    icon: BookOpen,
    example: "Мысалы: «Мақта қыз бен мысық» немесе «Алтын сақа» ертегісін оқу",
  },
  {
    id: 2,
    emoji: "💡",
    title: "2. ТҮСІН",
    action: "Түйінді ұғыну",
    tagline: "Кейіпкердің іс-әрекетіне баға беріп, басты өнегені жүрегіңе тоқы",
    description: "«Бұл кітап бізді неге үйретеді? Қандай қателіктер болды?» деген сұрақтарға жауап іздеп, сыни ойлауын дамытады.",
    color: "yellow",
    icon: Lightbulb,
    example: "Мысалы: Досқа көмектесудің және уәдеде тұрудың маңызын түсіну",
  },
  {
    id: 3,
    emoji: "🎮",
    title: "3. ОЙНА",
    action: "Білімді бекіту",
    tagline: "Интерактивті викториналар, мини-ойындар шешіп, тиын мен жұлдыз жина",
    description: "Ойын элементтері арқылы түсінгенін бекітіп, маскотты киіндіріп, деңгейін өсіреді.",
    color: "purple",
    icon: Gamepad2,
    example: "Мысалы: 5 сұрақты тест шешіп, +50 Алтын тиын ұтып алу",
  },
  {
    id: 4,
    emoji: "❤️",
    title: "4. ЖАҚСЫ ІС ЖАСА",
    action: "Әрекетке көшу",
    tagline: "Кітаптан алған өнегені шынайы өмірде нақты жақсы іске айналдыр!",
    description: "Платформаның басты жүрегі — теорияны практикаға көшіру: табиғатқа, жануарларға, ата-анаға немесе сыныптасына қол ұшын созу.",
    color: "rose",
    icon: HeartHandshake,
    example: "Мысалы: Құстарға жемсалғыш жасау немесе анасына үй шаруасына көмектесу",
  },
  {
    id: 5,
    emoji: "👨‍👩‍👧",
    title: "5. ОТБАСЫҢМЕН БӨЛІС",
    action: "Бірге қуану",
    tagline: "Жақсы ісіңді фотоға түсіріп күнделікке сал, ата-анаңнан жылы лебіз ал",
    description: "Отбасылық құндылықтарды нығайту: ата-ана баласының жетістігін көріп, бірге шабыттанады.",
    color: "green",
    icon: Users,
    example: "Мысалы: Отбасылық күнделікке фото жүктеп, «Мейірімді жүрек» медалін алу",
  },
];

export function FormulaSteps() {
  const [activeStep, setActiveStep] = React.useState<number>(1);

  const activeData = FORMULA_STEPS.find((s) => s.id === activeStep) || FORMULA_STEPS[0];

  const colorVariants = {
    sky: "from-sky-400 to-sky-600 text-sky-900 border-sky-300 bg-sky-50 shadow-sky-200",
    yellow: "from-amber-400 to-amber-500 text-amber-900 border-amber-300 bg-amber-50 shadow-amber-200",
    purple: "from-purple-500 to-purple-700 text-purple-900 border-purple-300 bg-purple-50 shadow-purple-200",
    rose: "from-rose-400 to-rose-600 text-rose-900 border-rose-300 bg-rose-50 shadow-rose-200",
    green: "from-emerald-400 to-emerald-600 text-emerald-900 border-emerald-300 bg-emerald-50 shadow-emerald-200",
  };

  const activeRingVariants = {
    sky: "ring-edu-sky-400 bg-edu-sky-500 text-white shadow-kid-sky",
    yellow: "ring-amber-400 bg-amber-400 text-amber-950 shadow-kid-yellow",
    purple: "ring-purple-400 bg-purple-600 text-white shadow-kid-purple",
    rose: "ring-rose-400 bg-rose-500 text-white shadow-kid-coral",
    green: "ring-emerald-400 bg-emerald-500 text-white shadow-kid-green",
  };

  return (
    <div className="w-full space-y-8">
      {/* 5 Steps horizontal stepper on Desktop / Scrollable on Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {FORMULA_STEPS.map((step) => {
          const isSelected = activeStep === step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={cn(
                "p-4 sm:p-5 rounded-3xl border-2 text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group",
                isSelected
                  ? "bg-white border-b-4 border-slate-800 scale-102 shadow-kid-lg"
                  : "bg-white/80 border-slate-200/80 hover:border-slate-300 hover:bg-white hover:-translate-y-0.5"
              )}
            >
              {/* Step indicator pill */}
              <div className="flex items-center justify-between w-full mb-3">
                <span
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-110",
                    isSelected
                      ? activeRingVariants[step.color]
                      : "bg-slate-100 text-slate-700"
                  )}
                >
                  {step.emoji}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {step.id}-қадам
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight">
                  {step.title}
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-1 line-clamp-1">
                  {step.action}
                </p>
              </div>

              {isSelected && (
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r",
                    step.color === "sky" && "from-sky-400 to-sky-600",
                    step.color === "yellow" && "from-amber-400 to-amber-500",
                    step.color === "purple" && "from-purple-500 to-purple-600",
                    step.color === "rose" && "from-rose-400 to-rose-600",
                    step.color === "green" && "from-emerald-400 to-emerald-600"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Step Detailed Feature Banner */}
      <div
        className={cn(
          "rounded-4xl p-6 sm:p-8 border-3 transition-all duration-300 shadow-kid-md",
          activeData.color === "sky" && "bg-sky-50/80 border-sky-200",
          activeData.color === "yellow" && "bg-amber-50/80 border-amber-200",
          activeData.color === "purple" && "bg-purple-50/80 border-purple-200",
          activeData.color === "rose" && "bg-rose-50/80 border-rose-200",
          activeData.color === "green" && "bg-emerald-50/80 border-emerald-200"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeData.emoji}</span>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 border border-slate-200/60 text-slate-700">
                Формуланың {activeData.id}-кезеңі
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeData.title} — {activeData.action}
            </h3>

            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
              {activeData.tagline}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeData.description}
            </p>

            {/* Example Box */}
            <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-slate-200 flex items-center gap-3 shadow-sm">
              <span className="text-xl">✨</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                <span className="text-slate-500 font-medium">Шынайы мысал: </span>
                {activeData.example}
              </p>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="w-full max-w-[240px] aspect-square rounded-3xl bg-white p-5 border-2 border-slate-100 shadow-kid-md flex flex-col items-center justify-center text-center space-y-3">
              <div className="text-6xl animate-float">{activeData.emoji}</div>
              <span className="font-extrabold text-slate-800 text-lg">
                {activeData.title}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Әрекетке бағытталған
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
