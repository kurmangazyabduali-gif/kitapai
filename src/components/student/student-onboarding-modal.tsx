"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import {
  BookOpen,
  HelpCircle,
  Gamepad2,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  Award,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export function StudentOnboardingModal({
  isOpen,
  onClose,
  studentName = "Оқушы",
}: StudentOnboardingModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    {
      id: "welcome",
      title: "«Кітаптан – жақсы іске» әлеміне қош келдің! 🎒",
      subtitle: "Сенің қызықты білім мен ізгілік саяхатың осы жерден басталады",
      emoji: "🌟",
      color: "yellow",
      bgGradient: "from-amber-400 via-yellow-400 to-orange-400",
      content: (
        <div className="space-y-4 text-center">
          <div className="w-24 h-24 mx-auto rounded-4xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-4 flex items-center justify-center text-5xl shadow-kid-md animate-bounce">
            🦁✨
          </div>
          <p className="text-sm font-bold text-slate-700 leading-relaxed max-w-md mx-auto">
            Сәлем, <strong className="text-amber-800 font-black">{studentName}</strong>! Біздің платформада кітап оқу — жай ғана оқу емес, ол нақты жақсы істер жасау мен достарыңмен және отбасыңмен бірге қуанудың бірегей жолы!
          </p>
          <div className="p-3.5 rounded-3xl bg-amber-50 border-2 border-amber-200 text-xs font-black text-amber-900 flex items-center justify-center gap-2">
            <span>💡 5 кезеңді бірегей формуламен танысайық!</span>
          </div>
        </div>
      ),
    },
    {
      id: "step-1-read",
      title: "1-кезең: Кітап оқы 📚",
      subtitle: "Ертегілер мен танымдық журналдар әлемі",
      emoji: "📖",
      color: "sky",
      bgGradient: "from-sky-400 to-blue-500",
      content: (
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-sky-50 border-2 border-sky-200">
            <div className="w-14 h-14 rounded-2xl bg-edu-sky-500 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
              📚
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Кітапхананы аш</h4>
              <p className="text-xs text-slate-600 font-semibold">
                Қазақ ертегілері, балалар әдебиеті, қысқа әңгімелер мен «Балдырған», «Айгөлек» журналдарын оқы немесе аудиосын тыңда.
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-xs font-bold text-slate-700 pl-2">
            <li className="flex items-center gap-2">
              <span className="text-edu-sky-600 font-black">✓</span> Әр оқылған кітап немесе журнал үшін <strong className="text-edu-sky-800">+10 ⭐ Ұпай</strong> аласың.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-edu-sky-600 font-black">✓</span> Ыңғайлы аудио ойнатқыш пен қаріп өлшемін баптау мүмкіндігі бар.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "step-2-understand",
      title: "2-кезең: Түсін 💡",
      subtitle: "Сұрақтарға жауап беріп, өнегені ұғын",
      emoji: "💡",
      color: "yellow",
      bgGradient: "from-yellow-400 to-amber-500",
      content: (
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-amber-50 border-2 border-amber-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
              💡
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Интерактивті мини-тест</h4>
              <p className="text-xs text-slate-600 font-semibold">
                Кітапты оқып болған соң, 3-5 қызықты сұраққа жауап беріп, кейіпкерлердің әрекетін бағала.
              </p>
            </div>
          </div>
          <div className="p-3.5 rounded-3xl bg-indigo-50 border-2 border-indigo-200 text-xs font-semibold text-indigo-950">
            <strong className="font-black text-indigo-900 block mb-0.5">🤖 AI Диагност:</strong>
            Қай жерде қиналғаныңды анықтап, сенің оқырмандық сауаттылығыңды дамытуға пайдалы кеңес береді!
          </div>
        </div>
      ),
    },
    {
      id: "step-3-play",
      title: "3-кезең: Ойна 🎮",
      subtitle: "«Ойна да, ойлан!» ойын залы",
      emoji: "🎮",
      color: "purple",
      bgGradient: "from-purple-500 to-indigo-600",
      content: (
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-purple-50 border-2 border-purple-200">
            <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
              🎮
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">6 Интерактивті ойын</h4>
              <p className="text-xs text-slate-600 font-semibold">
                «Кейіпкерді тап», «Оқиғалар реті», «Сиқырлы сандық» арқылы біліміңді бекітіп, <strong className="text-purple-800">+10 ұпай</strong> жина!
              </p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-600">
            Ойындар ертегідегі кейіпкерлер мен оқиғаларды жадыда берік сақтауға көмектеседі.
          </p>
        </div>
      ),
    },
    {
      id: "step-4-good-deed",
      title: "4-кезең: Жақсылық жаса ❤️",
      subtitle: "«Кітаптан – жақсы іске» негізгі өзегі",
      emoji: "❤️",
      color: "coral",
      bgGradient: "from-rose-500 to-pink-600",
      content: (
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-rose-50 border-2 border-rose-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
              ❤️
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Ізгі істер тақтасы</h4>
              <p className="text-xs text-slate-600 font-semibold">
                Мейірімділік, Достық, Қамқорлық, Үлкенді сыйлау секілді 8+ құндылық бойынша нақты жақсы іс жаса.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-100/60 border border-rose-300 text-xs font-bold text-rose-900">
            ✨ Жақсы ісіңнің суретін немесе мәтінін жазып жіберсең, <strong className="font-black">+20 ⭐ Ұпай</strong> және арнайы бейдж аласың!
          </div>
        </div>
      ),
    },
    {
      id: "step-5-family",
      title: "5-кезең: Отбасыңмен бөліс 👨‍👩‍👧",
      subtitle: "Кітап оқитын оқушыдан — кітап оқитын отбасына",
      emoji: "👨‍👩‍👧",
      color: "green",
      bgGradient: "from-emerald-500 to-teal-600",
      content: (
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
              👨‍👩‍👧
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Апталық отбасылық челендж</h4>
              <p className="text-xs text-slate-600 font-semibold">
                Ата-анаңмен 20 минут кітап оқы, әжеңнен ертегі тыңда және ортақ жақсы істер жаса!
              </p>
            </div>
          </div>
          <div className="p-3.5 rounded-3xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
            <span>Ата-анаң жақсы ісіңді растап, жылы лебіз бен <strong className="font-black">+20 ұпай</strong> сыйлайды!</span>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("kitaptan_onboarding_completed", "true");
      }
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={current.title}
      description={current.subtitle}
      emoji={current.emoji}
      maxWidth="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-between gap-1.5 px-2">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx === currentStep
                  ? "bg-amber-400 ring-2 ring-amber-300"
                  : idx < currentStep
                  ? "bg-emerald-500"
                  : "bg-slate-200"
              }`}
              title={`Қадам ${idx + 1}`}
            />
          ))}
        </div>

        {/* Step Dynamic Content */}
        <div className="min-h-[220px] flex items-center justify-center">
          {current.content}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <Button
              onClick={handlePrev}
              variant="outline"
              size="md"
              className="font-extrabold text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Артқа
            </Button>
          ) : (
            <Button
              onClick={onClose}
              variant="ghost"
              size="md"
              className="text-slate-400 font-bold text-xs"
            >
              Өткізіп жіберу
            </Button>
          )}

          <Button
            onClick={handleNext}
            variant="yellow"
            size="md"
            className="font-black text-xs shadow-md"
          >
            <span>
              {currentStep === steps.length - 1 ? "Саяхатты бастау! 🚀" : "Келесі қадам →"}
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
