"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import {
  Users,
  Heart,
  Camera,
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles,
  Award,
  ShieldCheck,
  Star,
  Send,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  FAMILY_CHALLENGES,
  getStoredFamilySubmissions,
  approveFamilySubmission,
  getFamilyProgressStats,
} from "@/lib/family-data";
import { FamilySubmission, FamilyChallenge } from "@/types/database.types";

export default function ParentFamilyPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = React.useState<FamilySubmission[]>([]);
  const [confirmModalSub, setConfirmModalSub] = React.useState<FamilySubmission | null>(null);
  const [parentComment, setParentComment] = React.useState(
    "Жарайсың, қызым! Кешкі оқу бәрімізге керемет көңіл-күй сыйлады. Өте мақтанамын!"
  );
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const reloadData = React.useCallback(() => {
    setSubmissions(getStoredFamilySubmissions());
  }, []);

  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  const stats = React.useMemo(() => {
    return getFamilyProgressStats();
  }, [submissions]);

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const approvedSubmissions = submissions.filter((s) => s.status === "approved");

  const handleOpenConfirmModal = (sub: FamilySubmission) => {
    setConfirmModalSub(sub);
    setParentComment(
      sub.parent_comment ||
        `Жарайсың, ${sub.student_name.split(" ")[0]}! Отбасымызбен жасаған өте үлгілі жақсы іс болды!`
    );
  };

  const handleApprove = () => {
    if (!confirmModalSub) return;

    const result = approveFamilySubmission(
      confirmModalSub.id,
      user?.full_name || "Бауыржан Сұлтанұлы (Әкесі)",
      parentComment.trim()
    );

    if (result.success) {
      reloadData();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#F59E0B", "#EC4899", "#38BDF8"],
      });

      setToastMessage(
        result.alreadyRewarded
          ? "Тапсырма расталды (Бұған дейін ұпай берілген)"
          : "Тамаша! Тапсырма сәтті расталды: +20 ұпай және ❤️ Отбасы жүрегі берілді!"
      );

      setTimeout(() => setToastMessage(null), 4000);
    }

    setConfirmModalSub(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Parent Header */}
      <div className="p-6 sm:p-8 rounded-4xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-kid-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
            <Users className="w-4 h-4 text-emerald-200" />
            <span>«Кітап оқитын оқушыдан — кітап оқитын отбасына»</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">
            Отбасылық күнделік пен челендждер 👨‍👩‍👧❤️
          </h1>

          <p className="text-emerald-100 font-semibold text-xs sm:text-sm">
            Балаңыздың апталық отбасылық тапсырмаларын қарап, орындалған жақсы істерін растаңыз және жылы лебіз білдіріңіз!
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
          <div className="text-right">
            <p className="text-xs font-bold text-emerald-200">Баласы:</p>
            <p className="text-sm font-black">Аяла Ерболқызы (3 «А»)</p>
          </div>
          <Avatar emoji="🌸" name="Аяла" size="md" borderVariant="gold" />
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-3xl bg-emerald-600 text-white shadow-kid-md flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2 font-black text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setToastMessage(null)}
            className="text-white hover:bg-white/20"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Stats and Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-2 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Отбасылық барыс</span>
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-2xl font-black text-slate-800">
            {stats.completedCount} / {stats.totalCount} Апта
          </p>
          <Progress value={stats.progressPercent} variant="green" height="sm" />
          <p className="text-[11px] font-bold text-emerald-700 pt-1">
            {stats.familyLevelTitle}
          </p>
        </Card>

        <Card className="p-6 bg-white border-2 border-rose-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600">Жиналған жүректер</span>
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-rose-700">
            {stats.totalHearts} ❤️ «Отбасы жүрегі»
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            Әрбір расталған челендж үшін 1 жүрек
          </p>
        </Card>

        <Card className="p-6 bg-white border-2 border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600">Растау күтуде</span>
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-700">
            {pendingSubmissions.length} жаңа жазба
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            Балаңыз жіберген тапсырмалар
          </p>
        </Card>
      </div>

      {/* Submissions List for Parent */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>Отбасылық тапсырмалар мен фотокүнделік</span>
          </h2>
          <Badge variant={pendingSubmissions.length > 0 ? "coral" : "green"} size="md">
            {pendingSubmissions.length} растау күтуде
          </Badge>
        </div>

        {submissions.length === 0 ? (
          <Card className="p-12 text-center bg-white border-2 border-dashed border-slate-300">
            <p className="text-sm font-bold text-slate-500">
              Әзірге орындалған отбасылық тапсырмалар жоқ.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submissions.map((sub) => {
              const challenge = FAMILY_CHALLENGES.find((c) => c.id === sub.challenge_id);
              const isApproved = sub.status === "approved";

              return (
                <Card
                  key={sub.id}
                  className={`p-6 bg-white border-3 transition-all space-y-4 flex flex-col justify-between ${
                    isApproved
                      ? "border-emerald-300 bg-emerald-50/15"
                      : "border-amber-300 bg-amber-50/20"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <Badge variant={isApproved ? "green" : "coral"} size="md">
                        {challenge?.week_number}-апта: {challenge?.title}
                      </Badge>
                      <span className="text-xs font-bold text-slate-400">
                        {sub.date}
                      </span>
                    </div>

                    {/* Photo if available */}
                    {sub.photo_url && (
                      <div className="w-full h-48 rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sub.photo_url}
                          alt="Отбасылық сәт"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Question & Child Answer */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wide block">
                        Осы аптада отбасыммен не жасадық?
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        «{sub.text}»
                      </p>
                    </div>

                    {/* Feedback if approved */}
                    {isApproved && sub.parent_comment && (
                      <div className="p-3.5 rounded-2xl bg-emerald-100/70 border border-emerald-200 text-xs space-y-1">
                        <span className="font-black text-emerald-900 block flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Сіздің лебізіңіз:
                        </span>
                        <p className="text-emerald-950 italic">«{sub.parent_comment}»</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    {isApproved ? (
                      <div className="w-full flex items-center justify-between text-xs font-black text-emerald-700 bg-emerald-100 px-4 py-2.5 rounded-2xl">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Расталған ✓
                        </span>
                        <span>+20 XP & ❤️ берілді</span>
                      </div>
                    ) : (
                      <div className="w-full flex items-center gap-3">
                        <Button
                          variant="green"
                          size="md"
                          onClick={() => handleOpenConfirmModal(sub)}
                          className="w-full justify-center text-xs font-black shadow-md py-3"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          <span>Растау және +20 XP беру ❤️</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation & Praise Modal */}
      {confirmModalSub && (
        <Modal
          isOpen={!!confirmModalSub}
          onClose={() => setConfirmModalSub(null)}
          title="Отбасылық челенджді растау ❤️"
          description="Балаңыздың жақсы ісін растап, жылы лебіз бен мақтау сөз жазыңыз!"
          emoji="💖"
          maxWidth="md"
        >
          <div className="space-y-4 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-black text-slate-700">Баланың жауабы:</span>
              <p className="text-slate-600 italic">«{confirmModalSub.text}»</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800">
                Ата-ананың пікірі мен жылы сөзі:
              </label>
              <textarea
                rows={3}
                value={parentComment}
                onChange={(e) => setParentComment(e.target.value)}
                placeholder="Жарайсың, қызым! Өте үлгілі жақсы іс болды..."
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs sm:text-sm font-medium focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setConfirmModalSub(null)}
                className="w-1/3 justify-center text-xs font-bold"
              >
                Болдырмау
              </Button>
              <Button
                variant="green"
                size="md"
                onClick={handleApprove}
                className="w-2/3 justify-center text-xs sm:text-sm font-black shadow-md py-3.5"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Растау (+20 XP & ❤️)</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
