"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import { Sparkles, Award, Star, Trophy, ArrowUpCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { StudentLevelInfo, BadgeItem } from "@/types/database.types";

interface RewardEventDetail {
  pointsEarned: number;
  coinsEarned: number;
  title: string;
  levelUp?: StudentLevelInfo | null;
  newBadges?: BadgeItem[];
}

export function RewardToastListener() {
  const [floatingNotification, setFloatingNotification] = React.useState<{
    points: number;
    coins: number;
    title: string;
  } | null>(null);

  const [levelUpModal, setLevelUpModal] = React.useState<StudentLevelInfo | null>(null);
  const [badgeModal, setBadgeModal] = React.useState<BadgeItem | null>(null);

  React.useEffect(() => {
    const handleReward = (e: Event) => {
      const customEvent = e as CustomEvent<RewardEventDetail>;
      const detail = customEvent.detail;
      if (!detail) return;

      // 1. Show floating toast (+10 ⭐)
      setFloatingNotification({
        points: detail.pointsEarned,
        coins: detail.coinsEarned,
        title: detail.title,
      });

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#FACC15", "#4ADE80", "#38BDF8", "#EC4899"],
      });

      setTimeout(() => {
        setFloatingNotification(null);
      }, 3500);

      // 2. Check Level Up
      if (detail.levelUp) {
        setTimeout(() => {
          setLevelUpModal(detail.levelUp || null);
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ["#F59E0B", "#10B981", "#6366F1", "#EC4899"],
          });
        }, 800);
      }

      // 3. Check New Badge Unlocked
      if (detail.newBadges && detail.newBadges.length > 0) {
        setTimeout(() => {
          setBadgeModal(detail.newBadges![0]);
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ["#FBBF24", "#34D399", "#60A5FA"],
          });
        }, 1200);
      }
    };

    window.addEventListener("kitaptan_reward_event", handleReward);
    return () => {
      window.removeEventListener("kitaptan_reward_event", handleReward);
    };
  }, []);

  return (
    <>
      {/* 1. FLOATING REWARD TOAST */}
      {floatingNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-2xl border-3 border-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/40 flex items-center justify-center text-2xl shadow-inner animate-spin-slow">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-amber-950">
                  +{floatingNotification.points} ⭐ Ұпай!
                </span>
                {floatingNotification.coins > 0 && (
                  <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full font-black text-amber-900">
                    +{floatingNotification.coins} 🪙
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-950/90 font-bold max-w-[220px] truncate">
                {floatingNotification.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEVEL UP MODAL */}
      {levelUpModal && (
        <Modal
          isOpen={!!levelUpModal}
          onClose={() => setLevelUpModal(null)}
          title="ЖАҢА ДЕҢГЕЙГЕ ЖЕТТІҢ! 🎉"
          description="Құттықтаймыз! Сенің оқырмандық дәрежең жоғарылады!"
          emoji="🚀"
          maxWidth="md"
        >
          <div className="space-y-6 text-center py-2">
            <div className="w-24 h-24 mx-auto rounded-4xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-wiggle">
              {levelUpModal.badgeEmoji}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full">
                {levelUpModal.levelNumber}-деңгей ашылды
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                «{levelUpModal.name}»
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-sm mx-auto">
                {levelUpModal.description}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-xs font-bold text-emerald-900">
              🎁 Марапат: {levelUpModal.reward_title || "Жаңа мүмкіндіктер мен белгілер ашылды!"}
            </div>

            <Button
              variant="yellow"
              size="lg"
              onClick={() => setLevelUpModal(null)}
              className="w-full justify-center font-black text-sm shadow-lg py-4"
            >
              <span>Алға, жаңа белестерге! 🌟</span>
            </Button>
          </div>
        </Modal>
      )}

      {/* 3. BADGE UNLOCKED MODAL */}
      {badgeModal && (
        <Modal
          isOpen={!!badgeModal}
          onClose={() => setBadgeModal(null)}
          title="ЖАҢА МЕДАЛЬ АШЫЛДЫ! 🏅"
          description="Сен жаңа жетістікке қол жеткіздің!"
          emoji="🏆"
          maxWidth="md"
        >
          <div className="space-y-6 text-center py-2">
            <div className="w-24 h-24 mx-auto rounded-4xl bg-gradient-to-br from-purple-400 to-pink-500 border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-bounce">
              {badgeModal.emoji}
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">
                «{badgeModal.title}»
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-sm mx-auto">
                {badgeModal.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-900">
              +{badgeModal.points_reward} Бонус ұпай қосылды! ⭐
            </div>

            <Button
              variant="green"
              size="lg"
              onClick={() => setBadgeModal(null)}
              className="w-full justify-center font-black text-sm shadow-lg py-4"
            >
              <span>Тамаша! Қабылдау 🎊</span>
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
