"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import {
  Users,
  Heart,
  Sparkles,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  MessageCircle,
  ShieldCheck,
  Send,
  Star,
  Printer,
  ChevronRight,
  Smile,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  FAMILY_CHALLENGES,
  FAMILY_ACHIEVEMENTS,
  getStoredFamilySubmissions,
  submitFamilyChallenge,
  getFamilyProgressStats,
} from "@/lib/family-data";
import { FamilyChallenge, FamilySubmission } from "@/types/database.types";
import { useAuth } from "@/contexts/AuthContext";

const SAMPLE_PHOTO_PRESETS = [
  {
    title: "Кітап оқу сәті",
    url: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=600",
    emoji: "📖",
  },
  {
    title: "Ата-әжемен сұхбат",
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600",
    emoji: "👵",
  },
  {
    title: "Құстарға жем беру",
    url: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&q=80&w=600",
    emoji: "🐦",
  },
  {
    title: "Үй тазалығы",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    emoji: "🧹",
  },
];

export default function StudentFamilyPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = React.useState<FamilySubmission[]>([]);
  const [selectedChallenge, setSelectedChallenge] = React.useState<FamilyChallenge | null>(null);
  const [activeTab, setActiveTab] = React.useState<"challenges" | "diary" | "achievements">("challenges");
  
  // Submission Form State
  const [answerText, setAnswerText] = React.useState("");
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>("");
  const [submissionDate, setSubmissionDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showCertificateModal, setShowCertificateModal] = React.useState(false);
  const [showSuccessToast, setShowSuccessToast] = React.useState(false);

  const reloadData = React.useCallback(() => {
    setSubmissions(getStoredFamilySubmissions());
  }, []);

  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  const stats = React.useMemo(() => {
    return getFamilyProgressStats();
  }, [submissions]);

  const getChallengeSubmission = (challengeId: string) => {
    return submissions.find((s) => s.challenge_id === challengeId);
  };

  const handleOpenSubmitModal = (challenge: FamilyChallenge) => {
    const existing = getChallengeSubmission(challenge.id);
    setSelectedChallenge(challenge);
    if (existing) {
      setAnswerText(existing.text || "");
      setSelectedPhoto(existing.photo_url || "");
      setSubmissionDate(existing.date || new Date().toISOString().split("T")[0]);
    } else {
      setAnswerText("");
      setSelectedPhoto("");
      setSubmissionDate(new Date().toISOString().split("T")[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !answerText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitFamilyChallenge({
        challenge_id: selectedChallenge.id,
        week_number: selectedChallenge.week_number,
        student_id: user?.id || "student-1",
        student_name: user?.full_name || "Аяла Ерболқызы",
        student_avatar: "🌸",
        student_class: "3 «А»",
        text: answerText.trim(),
        photo_url: selectedPhoto || undefined,
        date: submissionDate,
        parent_name: "Бауыржан Сұлтанұлы (Әкесі)",
      });

      reloadData();
      setIsSubmitting(false);
      setSelectedChallenge(null);
      setShowSuccessToast(true);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10B981", "#F59E0B", "#EC4899", "#3B82F6"],
      });

      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden p-6 sm:p-9 rounded-4xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-kid-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
            <Users className="w-4 h-4 text-emerald-200" />
            <span>«Кітап оқитын оқушыдан — кітап оқитын отбасына»</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
            Отбасыммен жасаған жақсы істерім 👨‍👩‍👧❤️
          </h1>

          <p className="text-emerald-100 font-semibold text-xs sm:text-sm leading-relaxed">
            Апта сайын отбасыңмен бірге кітап оқып, ғибрат алып, игі іс жаса! Әрбір орындалған апталық челендж үшін{" "}
            <strong className="text-amber-300">❤️ «Отбасы жүрегі»</strong> мен{" "}
            <strong className="text-amber-300">+20 ұпай</strong> сыйға беріледі.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 z-10 w-full sm:w-auto">
          <div className="flex items-center gap-3 p-3.5 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
            <Avatar emoji="👨‍👩‍👧" name="Бауыржан С." size="sm" borderVariant="gold" />
            <div className="text-left">
              <p className="text-xs font-black">Бауыржан С. (Әкесі)</p>
              <p className="text-[11px] font-bold text-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-300" /> Байланысқан
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowCertificateModal(true)}
            variant="yellow"
            size="md"
            className="w-full justify-center font-black text-xs shadow-lg"
          >
            <Award className="w-4 h-4 mr-1.5" />
            <span>Отбасылық Сертификат 📜</span>
          </Button>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="p-4 rounded-3xl bg-emerald-500 text-white shadow-kid-md flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              🎉
            </div>
            <div>
              <h4 className="font-black text-sm">Тамаша! Нәтиже ата-анаңа жіберілді!</h4>
              <p className="text-xs text-emerald-100 font-semibold">
                Ата-анаң растаған кезде бірден +20 ұпай мен ❤️ Отбасы жүрегі қосылады!
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuccessToast(false)}
            className="text-white hover:bg-white/20"
          >
            Жабу ✕
          </Button>
        </div>
      )}

      {/* Family Progress & Heart Meter Card */}
      <Card className="p-6 sm:p-8 bg-white border-3 border-emerald-200 shadow-kid-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stats.familyBadge}</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                Біздің отбасының жетістігі
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Дәреже: <span className="text-emerald-700">{stats.familyLevelTitle}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="px-4 py-2 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-rose-600 block leading-tight">Отбасы жүрегі:</span>
                <span className="text-base font-black text-rose-800">
                  {stats.totalHearts} ❤️ жиналды
                </span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <div>
                <span className="text-xs font-bold text-amber-600 block leading-tight">Отбасылық ұпай:</span>
                <span className="text-base font-black text-amber-800">
                  +{stats.totalPoints} ⭐
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Week Progress Steps Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black">
            <span className="text-slate-700">Апталық челендж барысы:</span>
            <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              {stats.completedCount} / {stats.totalCount} Апта орындалды ({stats.progressPercent}%)
            </span>
          </div>

          <Progress value={stats.progressPercent} variant="green" height="lg" showLabel={false} />

          {/* 6 Week Step Circles */}
          <div className="grid grid-cols-6 gap-2 pt-2">
            {FAMILY_CHALLENGES.map((ch) => {
              const sub = getChallengeSubmission(ch.id);
              const isDone = sub?.status === "approved";
              const isPending = sub?.status === "pending";

              return (
                <div key={ch.id} className="text-center space-y-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-2xl flex items-center justify-center font-black text-sm sm:text-base transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-500 text-white shadow-kid-sm ring-4 ring-emerald-200"
                        : isPending
                        ? "bg-amber-400 text-amber-950 ring-4 ring-amber-200 animate-pulse"
                        : "bg-slate-100 text-slate-400 border-2 border-slate-200"
                    }`}
                  >
                    {isDone ? "❤️" : isPending ? "⏳" : `${ch.week_number}`}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-500 block truncate">
                    {ch.week_number}-апта
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("challenges")}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "challenges"
              ? "bg-emerald-600 text-white shadow-kid-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🌟 6 Апталық Челендждер
        </button>
        <button
          onClick={() => setActiveTab("diary")}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "diary"
              ? "bg-emerald-600 text-white shadow-kid-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          📖 Отбасылық шежіре & Күнделік ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "achievements"
              ? "bg-emerald-600 text-white shadow-kid-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🏆 Жетістіктер мен белгілер
        </button>
      </div>

      {/* TAB 1: 6 WEEKLY CHALLENGES */}
      {activeTab === "challenges" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FAMILY_CHALLENGES.map((challenge) => {
            const sub = getChallengeSubmission(challenge.id);
            const isApproved = sub?.status === "approved";
            const isPending = sub?.status === "pending";

            return (
              <Card
                key={challenge.id}
                className={`p-6 bg-white border-3 transition-all duration-300 hover:shadow-kid-md flex flex-col justify-between ${
                  isApproved
                    ? "border-emerald-300 bg-emerald-50/20"
                    : isPending
                    ? "border-amber-300 bg-amber-50/20"
                    : "border-slate-200"
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header with Week and Rewards */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : isPending
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {challenge.week_number}-апта тапсырмасы
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      <span>+20 ⭐</span>
                      <span>•</span>
                      <span>❤️ +1</span>
                    </div>
                  </div>

                  {/* Title & Emoji */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl shrink-0 border border-emerald-200">
                      {challenge.emoji}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800 leading-snug">
                        «{challenge.title}»
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                        {challenge.badge_name}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {challenge.description}
                  </p>

                  {/* Submission Status Preview if exists */}
                  {sub && (
                    <div
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                        isApproved
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                          : "bg-amber-50 border-amber-200 text-amber-900"
                      }`}
                    >
                      <div className="flex items-center justify-between font-black">
                        <span className="flex items-center gap-1.5">
                          {isApproved ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Ата-ана растады ✓ (+20 ұпай)
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                              Ата-ананың растауын күтуде ⏳
                            </>
                          )}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {sub.date}
                        </span>
                      </div>

                      <p className="text-[11px] italic font-medium line-clamp-2 text-slate-700">
                        «{sub.text}»
                      </p>

                      {isApproved && sub.parent_comment && (
                        <div className="pt-1 border-t border-emerald-200 text-[11px] font-bold text-emerald-800">
                          💬 Әкесінің лебізі: «{sub.parent_comment}»
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  {isApproved ? (
                    <Button
                      variant="green"
                      size="sm"
                      onClick={() => handleOpenSubmitModal(challenge)}
                      className="w-full justify-center font-black text-xs"
                    >
                      <span>Орындалды ❤️ Толық көру</span>
                    </Button>
                  ) : isPending ? (
                    <Button
                      variant="yellow"
                      size="sm"
                      onClick={() => handleOpenSubmitModal(challenge)}
                      className="w-full justify-center font-black text-xs"
                    >
                      <span>Жауапты өңдеу немесе көру ✏️</span>
                    </Button>
                  ) : (
                    <Button
                      variant="green"
                      size="sm"
                      onClick={() => handleOpenSubmitModal(challenge)}
                      className="w-full justify-center font-black text-xs shadow-sm hover:shadow-md"
                    >
                      <span>Нәтижені жазу ✍️</span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 2: FAMILY DIARY & HISTORY FEED */}
      {activeTab === "diary" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Отбасылық күнделік пен альбом</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Барлығы: {submissions.length} жазба
            </span>
          </div>

          {submissions.length === 0 ? (
            <Card className="p-12 text-center bg-white border-2 border-dashed border-slate-300 space-y-3">
              <span className="text-5xl block">👨‍👩‍👧📖</span>
              <h4 className="text-base font-black text-slate-700">
                Әзірге отбасылық күнделік бос
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                1-аптаның челенджін орындап, отбасыңмен бірге оқыған сәтіңді жазып қалдыр!
              </p>
              <Button
                variant="green"
                size="sm"
                onClick={() => {
                  setActiveTab("challenges");
                  handleOpenSubmitModal(FAMILY_CHALLENGES[0]);
                }}
              >
                1-аптаны бастау 🚀
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submissions.map((sub) => {
                const challenge = FAMILY_CHALLENGES.find((c) => c.id === sub.challenge_id);
                const isApproved = sub.status === "approved";

                return (
                  <Card
                    key={sub.id}
                    className="p-6 bg-white border-2 border-slate-200 hover:border-emerald-300 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={isApproved ? "green" : "coral"} size="sm">
                        {challenge?.week_number}-апта • {challenge?.title}
                      </Badge>
                      <span className="text-xs font-bold text-slate-400">
                        {sub.date}
                      </span>
                    </div>

                    {sub.photo_url && (
                      <div className="w-full h-48 rounded-3xl overflow-hidden border-2 border-slate-100 bg-slate-50 relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sub.photo_url}
                          alt="Отбасылық сәт"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Осы аптада отбасыммен не жасадық?
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {sub.text}
                      </p>
                    </div>

                    {isApproved && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between font-black text-emerald-800">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            {sub.parent_name || "Ата-ананың пікірі"}:
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">
                            +20 ұпай берілді ❤️
                          </span>
                        </div>
                        <p className="text-slate-700 italic">
                          «{sub.parent_comment || "Жарайсың, өте жақсы орындалған іс!"}»
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS & BADGES */}
      {activeTab === "achievements" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FAMILY_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = stats.completedCount >= ach.required_weeks;

              return (
                <Card
                  key={ach.id}
                  className={`p-6 bg-white border-3 text-center space-y-3 transition-all ${
                    isUnlocked
                      ? "border-amber-300 bg-gradient-to-b from-amber-50/50 to-white shadow-kid-md"
                      : "border-slate-200 opacity-70"
                  }`}
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center text-3xl shadow-sm ${
                      isUnlocked
                        ? "bg-amber-100 border-2 border-amber-300 animate-bounce"
                        : "bg-slate-100 border-2 border-slate-200 grayscale"
                    }`}
                  >
                    {ach.emoji}
                  </div>

                  <h4 className="font-black text-base text-slate-800">
                    {ach.title}
                  </h4>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {ach.description}
                  </p>

                  <div className="pt-2">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ашылды! Құттықтаймыз 🎉
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        {ach.required_weeks} апта орындау қажет ({stats.completedCount}/{ach.required_weeks})
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {selectedChallenge && (
        <Modal
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          title={`${selectedChallenge.week_number}-апта: «${selectedChallenge.title}»`}
          description="Отбасыңмен бірге орындаған жақсы ісіңді жазып, ата-анаңа растауға жібер!"
          emoji={selectedChallenge.emoji}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Objective box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs text-slate-700">
              <span className="font-black text-emerald-900 block">🎯 Апталық мақсат:</span>
              <p>{selectedChallenge.description}</p>
            </div>

            {/* Reflection question & text area */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                <span>
                  Сұрақ: <strong className="text-emerald-700">{selectedChallenge.prompt_question}</strong>
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {answerText.length} таңба
                </span>
              </label>

              <textarea
                required
                rows={4}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Мысалы: Бүгін кешке әкем мен анама «Мақта қыз бен мысық» ертегісін дауыстап оқып бердім. Бәріміз кейіпкерлерді талқылап, көңілді уақыт өткіздік..."
                className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm font-medium transition-all"
              />
            </div>

            {/* Quick Template suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-500 block">
                💡 Дайын үлгі сөйлемдер (басып таңда):
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedChallenge.sample_deeds.map((sample, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAnswerText(sample)}
                    className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 px-2.5 py-1 rounded-xl transition-all text-left"
                  >
                    + {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Picker (Optional) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-sky-600" />
                  <span>Фотосурет қосу (Қосымша):</span>
                </span>
                {selectedPhoto && (
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto("")}
                    className="text-[11px] text-rose-500 font-bold hover:underline"
                  >
                    Фотоны өшіру ✕
                  </button>
                )}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_PHOTO_PRESETS.map((preset, idx) => {
                  const isSelected = selectedPhoto === preset.url;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedPhoto(preset.url)}
                      className={`p-2 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-200"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 block truncate">
                        {preset.emoji} {preset.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700">Орындалған күні:</label>
              <Input
                type="date"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
              />
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setSelectedChallenge(null)}
                className="w-1/3 justify-center text-xs font-bold"
              >
                Болдырмау
              </Button>

              <Button
                type="submit"
                variant="green"
                size="md"
                disabled={isSubmitting || !answerText.trim()}
                className="w-2/3 justify-center text-xs sm:text-sm font-black shadow-md py-3.5"
              >
                <Send className="w-4 h-4 mr-1.5" />
                <span>{isSubmitting ? "Жіберілуде..." : "Ата-анаға жіберу 📩"}</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* FAMILY CERTIFICATE MODAL */}
      {showCertificateModal && (
        <Modal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          title="Отбасылық Сертификат 📜"
          description="«Кітаптан – жақсы іске» республикалық цифрлық оқу жобасы"
          emoji="🏆"
          maxWidth="lg"
        >
          <div className="space-y-5 text-center">
            {/* Printable Certificate Canvas Card */}
            <div className="p-8 sm:p-10 rounded-4xl bg-gradient-to-br from-amber-50 via-white to-amber-100 border-8 border-amber-300/80 shadow-2xl relative overflow-hidden text-slate-900">
              {/* Golden corner flourishes */}
              <div className="absolute top-3 left-3 text-amber-500 font-serif text-2xl">⚜️</div>
              <div className="absolute top-3 right-3 text-amber-500 font-serif text-2xl">⚜️</div>
              <div className="absolute bottom-3 left-3 text-amber-500 font-serif text-2xl">⚜️</div>
              <div className="absolute bottom-3 right-3 text-amber-500 font-serif text-2xl">⚜️</div>

              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-200/80 px-4 py-1 rounded-full inline-block">
                  СЕРТИФИКАТ • ҚҰРМЕТ ГРАМОТАСЫ
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-amber-950 font-serif">
                  «Кітап оқитын үлгілі отбасы»
                </h3>

                <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                  Осы құжат баласымен бірге кітап оқу мәдениетін қалыптастырып, отбасылық жақсы істерді үздік орындағаны үшін беріледі:
                </p>

                <div className="py-2 border-y-2 border-amber-300/60 max-w-sm mx-auto space-y-1">
                  <h4 className="text-lg sm:text-xl font-black text-emerald-900 font-serif">
                    {user?.full_name || "Аяла Ерболқызы"} және Отбасы
                  </h4>
                  <p className="text-xs font-bold text-slate-500">
                    3 «А» сыныбы • №10 мектеп-гимназия
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-left text-xs bg-white/70 p-3 rounded-2xl border border-amber-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Орындалғаны:</span>
                    <strong className="text-emerald-700 font-black">{stats.completedCount} / 6 Апта</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Жүректер:</span>
                    <strong className="text-rose-600 font-black">{stats.totalHearts} ❤️ Жүрек</strong>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-left text-[11px] font-bold text-slate-600 px-4">
                  <div>
                    <p>Күні: {new Date().toLocaleDateString("kk-KZ")}</p>
                    <p className="text-slate-400">«Кітаптан – жақсы іске»</p>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-xl mx-auto mb-1">
                      👑
                    </div>
                    <span className="text-[10px] text-amber-900 font-black">Ресми мөр</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="yellow"
                size="md"
                onClick={() => window.print()}
                className="font-black text-xs shadow-md"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                <span>Сертификатты басып шығару (PDF) 🖨️</span>
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowCertificateModal(false)}
                className="text-xs font-bold"
              >
                Жабу
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
