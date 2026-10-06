"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Heart,
  Camera,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Filter,
  MessageCircle,
  Upload,
  UserCheck,
  Smile,
  Flame,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  MORAL_VALUES,
  MOCK_GOOD_DEED_TASKS,
  getStoredSubmissions,
  submitNewGoodDeed,
  approveGoodDeedSubmission,
} from "@/lib/good-deeds-data";
import {
  MoralValueKey,
  GoodDeedTask,
  GoodDeedSubmission,
} from "@/types/database.types";
import { cn } from "@/lib/utils";

function StudentGoodDeedsContent() {
  const searchParams = useSearchParams();
  const initialValue = (searchParams.get("value") as MoralValueKey) || "caring";

  const [selectedValue, setSelectedValue] = React.useState<MoralValueKey>(initialValue);
  const [tasks, setTasks] = React.useState<GoodDeedTask[]>(MOCK_GOOD_DEED_TASKS);
  const [submissions, setSubmissions] = React.useState<GoodDeedSubmission[]>([]);
  const [activeTab, setActiveTab] = React.useState<"all" | "approved" | "pending">("all");

  // Modal State for "Мен орындадым!"
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<GoodDeedTask | null>(null);
  const [deedDescription, setDeedDescription] = React.useState("");
  const [selectedPhotoUrl, setSelectedPhotoUrl] = React.useState<string>(
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600"
  );
  const [reviewerChoice, setReviewerChoice] = React.useState<"parent" | "teacher">("parent");

  // Preset Deed Photos for easy kid-friendly simulation
  const PRESET_PHOTOS = [
    {
      title: "Гүл суғару / баптау",
      url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Құстарға жем беру",
      url: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Үй тазалау / көмек",
      url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Кітап оқып бөлісу",
      url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
    },
  ];

  // Load submissions on mount
  React.useEffect(() => {
    setSubmissions(getStoredSubmissions());
  }, []);

  // Filter tasks based on chosen moral value
  const filteredTasks = tasks.filter((t) =>
    selectedValue === "caring" ? true : t.value_key === selectedValue
  );

  // Filter history submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (activeTab === "approved") return sub.status === "approved";
    if (activeTab === "pending") return sub.status === "pending";
    return true;
  });

  // Open Submit modal for a task
  const handleOpenSubmit = (task: GoodDeedTask) => {
    setSelectedTask(task);
    setDeedDescription("");
    setIsSubmitModalOpen(true);
  };

  // Submit good deed form
  const handleSubmitDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !deedDescription.trim()) return;

    const newSub = submitNewGoodDeed({
      student_id: "student-1",
      student_name: "Аяла Ерболқызы",
      student_avatar: "🌸",
      student_class: "3 «А»",
      deed_id: selectedTask.id,
      book_id: selectedTask.book_id,
      book_title: selectedTask.book_title,
      value_key: selectedTask.value_key,
      value_name_kk: selectedTask.value_name_kk,
      value_emoji: selectedTask.value_emoji,
      title: selectedTask.title,
      description: deedDescription,
      image_url: selectedPhotoUrl,
      reviewer_type: reviewerChoice,
      reviewer_name: reviewerChoice === "parent" ? "Ата-анасы" : "Айнұр апай (Мұғалім)",
    });

    setSubmissions([newSub, ...submissions]);
    setIsSubmitModalOpen(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FB7185", "#FACC15", "#38BDF8", "#4ADE80"],
    });
  };

  // Demo Quick Approval Simulation
  const handleQuickApprove = (submissionId: string) => {
    const res = approveGoodDeedSubmission(
      submissionId,
      "parent",
      "Әкесі (Ербол аға)",
      "Жарайсың, Аяла! Жақсылық жасаудан жалықпа! +20 XP қосылды! ❤️"
    );

    if (res.success) {
      setSubmissions(getStoredSubmissions());
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ["#22C55E", "#EAB308", "#A855F7"],
      });
    }
  };

  const selectedValueObj = MORAL_VALUES.find((v) => v.key === selectedValue) || MORAL_VALUES[0];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO BANNER: «КІТАПТАН – ЖАҚСЫ ІСКЕ» */}
      <div className="p-8 sm:p-10 rounded-5xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-kid-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-rose-200 text-rose-200" />
            <span>БАСТЫ МИССИЯ: «КІТАПТАН – ЖАҚСЫ ІСКЕ»</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Әр оқылған кітап — бір жақсы әрекетке бастайды! ❤️
          </h1>

          <p className="text-sm sm:text-base text-rose-100 font-semibold leading-relaxed">
            Кітаптан алған өнегеңді нақты жақсы іске айналдыр, фотосын сал және ата-анаң мен ұстазыңнан растау алып, <strong>+20 XP</strong> ұпай жина!
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <div className="px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md text-xs font-black flex items-center gap-2">
              <span>🌟 Орындалған:</span>
              <span className="text-amber-300 font-extrabold text-sm">
                {submissions.filter((s) => s.status === "approved").length} іс
              </span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md text-xs font-black flex items-center gap-2">
              <span>⏳ Растау күтілуде:</span>
              <span className="text-yellow-200 font-extrabold text-sm">
                {submissions.filter((s) => s.status === "pending").length} іс
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Mascot Background */}
        <div className="absolute right-4 -bottom-10 text-9xl opacity-25 pointer-events-none select-none">
          ❤️
        </div>
      </div>

      {/* 2. INTERACTIVE MORAL VALUES PICKER («Бұл кітап саған қандай жақсы қасиетті үйретті?») */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span>Бұл кітап саған қандай жақсы қасиетті үйретті?</span>
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Өзіңе ұнаған ізгі қасиетті таңдаңыз, жүйе сәйкес жақсы істі ұсынады:
            </p>
          </div>
        </div>

        {/* 8 Moral Value Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {MORAL_VALUES.map((val) => {
            const isSelected = selectedValue === val.key;
            return (
              <button
                key={val.key}
                onClick={() => setSelectedValue(val.key)}
                className={cn(
                  "p-3.5 rounded-3xl border-3 flex flex-col items-center justify-between gap-2 transition-all text-center select-none group",
                  isSelected
                    ? "bg-white border-rose-500 shadow-kid-md scale-105 ring-4 ring-rose-200"
                    : "bg-white border-slate-200 hover:border-rose-300 hover:-translate-y-1 shadow-xs"
                )}
              >
                <div className="text-3xl transform group-hover:scale-110 transition-transform">
                  {val.emoji}
                </div>
                <div className="font-black text-xs text-slate-900 leading-tight">
                  {val.name_kk}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Value Prompt Banner */}
        <Card className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 border-2 border-rose-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-md">
              {selectedValueObj.emoji}
            </div>
            <div>
              <div className="text-xs font-black text-rose-700 uppercase">
                Таңдалған құндылық: {selectedValueObj.name_kk}
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                «{selectedValueObj.prompt_kk}»
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {selectedValueObj.description_kk}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. ACTIVE GOOD DEED MISSIONS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-rose-500" />
            <span>Орындауға ұсынылатын жақсы істер (Тапсырмалар):</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="p-6 sm:p-8 bg-white border-3 border-slate-200 rounded-4xl shadow-kid-sm hover:border-rose-300 hover:shadow-kid-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="coral" size="sm" className="gap-1">
                    <span>{task.value_emoji}</span>
                    <span>{task.value_name_kk}</span>
                  </Badge>

                  <Badge variant="solidGreen" size="sm">
                    +{task.points_reward} XP • +{task.coins_reward} 🪙
                  </Badge>
                </div>

                <div className="text-xs font-extrabold text-edu-sky-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Өнеге алынған кітап: «{task.book_title || "Қазақ ертегілері"}»</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-snug">
                  {task.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {task.description}
                </p>

                {/* Advice Quote Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs font-bold text-amber-900 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-800">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Кітаптан кеңес:</span>
                  </div>
                  <p className="text-slate-700 font-semibold">{task.advice_kk}</p>
                </div>
              </div>

              {/* Action Button: «Мен орындадым!» */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Мерзімі: {task.deadline_kk}</span>
                </div>

                <Button
                  variant="coral"
                  size="md"
                  onClick={() => handleOpenSubmit(task)}
                  className="font-black px-6 shadow-md gap-1.5"
                >
                  <span>Мен орындадым! 🚀</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. HISTORY GALLERY: «МЕНІҢ ЖАҚСЫ ІСТЕРІМ» */}
      <div className="space-y-5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              <span>Менің жақсы істерім (Күнделік) 📸</span>
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Орындалған игі амалдарыңның фотолары мен ата-ана/мұғалімнің жылы лебіздері
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all",
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Барлығы ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1",
                activeTab === "approved"
                  ? "bg-white text-emerald-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Мақұлданған</span>
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1",
                activeTab === "pending"
                  ? "bg-white text-amber-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Күтілуде</span>
            </button>
          </div>
        </div>

        {/* Submissions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((sub) => (
            <Card
              key={sub.id}
              className="p-0 bg-white border-3 border-slate-200 rounded-4xl shadow-kid-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Photo Preview Container */}
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                {sub.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sub.image_url}
                    alt={sub.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-rose-100">
                    ❤️
                  </div>
                )}

                {/* Status Badge Overlay */}
                <div className="absolute top-3 right-3">
                  {sub.status === "approved" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Мақұлданды (+20 XP)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md">
                      <Clock className="w-3.5 h-3.5" />
                      Растау күтілуде ⏳
                    </span>
                  )}
                </div>

                {/* Value Pill */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-black text-rose-900 shadow-sm">
                    {sub.value_emoji} {sub.value_name_kk}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-black text-base text-slate-900 leading-snug">
                    {sub.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                {/* Reviewer Feedback Section */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {sub.status === "approved" ? (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-black text-emerald-800">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Растаған: {sub.reviewer_name}</span>
                      </div>
                      <p className="text-emerald-950 font-semibold italic">
                        «{sub.reviewer_comment || "Жарайсың, өте жақсы іс!"}»
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{sub.reviewer_name || "Ата-ананың"} растауын күтуде</span>
                      </div>

                      {/* Quick Demo Approval Button for Testing */}
                      <button
                        onClick={() => handleQuickApprove(sub.id)}
                        className="w-full py-2 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-sm flex items-center justify-center gap-1 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>[Demo: Ата-ана ретінде растау (+20 XP)]</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. SUBMIT GOOD DEED MODAL («Мен орындадым!») */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Жақсы істі растауға жіберу ❤️"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitDeed} className="space-y-5">
          {selectedTask && (
            <div className="p-4 rounded-3xl bg-rose-50 border-2 border-rose-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-rose-800">
                <span>{selectedTask.value_emoji}</span>
                <span>{selectedTask.value_name_kk}</span>
                <span>• +{selectedTask.points_reward} XP</span>
              </div>
              <h4 className="font-black text-base text-slate-900">
                {selectedTask.title}
              </h4>
            </div>
          )}

          {/* Textarea: «Бүгін не істедің?» */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">
              Бүгін не істедің? (Жақсы ісіңді қысқаша баянда):
            </label>
            <textarea
              required
              rows={3}
              value={deedDescription}
              onChange={(e) => setDeedDescription(e.target.value)}
              placeholder="Мысалы: Бүгін ертегіні оқыған соң, үйдегі бөлме гүлдеріне су құйып, анама көмектестім..."
              className="w-full p-4 rounded-2xl border-2 border-slate-200 text-sm font-semibold focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all"
            />
          </div>

          {/* Photo Selector / Upload simulation */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 flex items-center justify-between">
              <span>Фото қосу 📸:</span>
              <span className="text-[11px] text-slate-400 font-bold">Фото таңдаңыз немесе жүктеңіз</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_PHOTOS.map((photo, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedPhotoUrl(photo.url)}
                  className={cn(
                    "p-1.5 rounded-2xl border-3 transition-all flex flex-col items-center gap-1 overflow-hidden",
                    selectedPhotoUrl === photo.url
                      ? "border-rose-500 bg-rose-50 ring-2 ring-rose-300"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full aspect-[4/3] object-cover rounded-xl"
                  />
                  <span className="text-[10px] font-extrabold text-slate-800 truncate max-w-full">
                    {photo.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reviewer Choice (Ата-ана немесе Мұғалім) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">
              Кімге растауға жібересіз?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReviewerChoice("parent")}
                className={cn(
                  "p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all",
                  reviewerChoice === "parent"
                    ? "border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-200"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                )}
              >
                <span>👨‍👩‍👧 Ата-анама</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewerChoice("teacher")}
                className={cn(
                  "p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all",
                  reviewerChoice === "teacher"
                    ? "border-purple-500 bg-purple-50 text-purple-950 ring-2 ring-purple-200"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                )}
              >
                <span>👩‍🏫 Мұғаліміме</span>
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="coral"
              size="lg"
              className="w-full justify-center text-sm font-black shadow-lg py-4"
            >
              <span>Жіберу және растауға қою ✉️</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function StudentGoodDeedsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center font-bold">Жүктелуде...</div>}>
      <StudentGoodDeedsContent />
    </React.Suspense>
  );
}
