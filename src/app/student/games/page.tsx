"use client";

import * as React from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Star,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Flame,
  Gift,
  Key,
  HelpCircle,
  Award,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Smile,
  XCircle,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { MOCK_GAMES } from "@/lib/games-data";
import { GameItem, GameQuestionItem } from "@/types/database.types";
import { cn } from "@/lib/utils";

export default function StudentGamesPage() {
  const [selectedGame, setSelectedGame] = React.useState<GameItem | null>(null);

  // In-Game State
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [gameScore, setGameScore] = React.useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = React.useState(false);
  const [isGameFinished, setIsGameFinished] = React.useState(false);
  const [feedbackToast, setFeedbackToast] = React.useState<string | null>(null);

  // Interactive Choices
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);
  const [orderingList, setOrderingList] = React.useState<
    { id: string; text: string; correctPos: number }[]
  >([]);
  const [selectedChestKey, setSelectedChestKey] = React.useState<number | null>(null);
  const [openedChestReward, setOpenedChestReward] = React.useState<{
    title: string;
    rewardKk: string;
    coins: number;
    xp: number;
    sticker: string;
  } | null>(null);

  const startNewGame = (game: GameItem) => {
    setSelectedGame(game);
    setCurrentQuestionIdx(0);
    setGameScore(0);
    setIsAnswerChecked(false);
    setIsGameFinished(false);
    setSelectedOptionId(null);
    setSelectedChestKey(null);
    setOpenedChestReward(null);

    // Initialize ordering list if first question is ordering
    const firstQ = game.questions[0];
    if (firstQ?.mechanic === "drag_order" && firstQ.order_sequence) {
      const shuffled = [...firstQ.order_sequence].sort(() => Math.random() - 0.5);
      setOrderingList(shuffled);
    }
  };

  const currentQ: GameQuestionItem | undefined = selectedGame?.questions[currentQuestionIdx];
  const totalQuestions = selectedGame?.questions.length || 1;
  const gameProgress = Math.round(((currentQuestionIdx + (isGameFinished ? 1 : 0)) / totalQuestions) * 100);

  // Reset/prepare state when question changes
  React.useEffect(() => {
    if (currentQ?.mechanic === "drag_order" && currentQ.order_sequence) {
      const shuffled = [...currentQ.order_sequence].sort(() => Math.random() - 0.5);
      setOrderingList(shuffled);
    } else {
      setSelectedOptionId(null);
    }
    setIsAnswerChecked(false);
  }, [currentQuestionIdx, currentQ]);

  // Handle Option Pick
  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(optId);
  };

  // Move ordering items up/down
  const handleMoveOrderItem = (fromIdx: number, direction: "up" | "down") => {
    if (isAnswerChecked) return;
    const toIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= orderingList.length) return;

    const copy = [...orderingList];
    const temp = copy[fromIdx];
    copy[fromIdx] = copy[toIdx];
    copy[toIdx] = temp;
    setOrderingList(copy);
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (!currentQ) return;
    setIsAnswerChecked(true);

    let isCorrect = false;

    if (currentQ.mechanic === "drag_order") {
      isCorrect = orderingList.every((item, idx) => item.correctPos === idx + 1);
    } else if (currentQ.mechanic === "chest_unlock") {
      isCorrect = true;
    } else {
      const chosen = currentQ.options.find((o) => o.id === selectedOptionId);
      isCorrect = !!chosen?.is_correct;
    }

    if (isCorrect) {
      setGameScore((prev) => prev + (currentQ.points || 10));
      setFeedbackToast("Жарайсың! +10 ⭐");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#FACC15", "#4ADE80", "#38BDF8", "#C084FC"],
      });
      setTimeout(() => setFeedbackToast(null), 2500);
    }
  };

  // Magic Chest Open
  const handleOpenChest = (keyId: number) => {
    if (!currentQ?.chest_rewards) return;
    setSelectedChestKey(keyId);
    const reward = currentQ.chest_rewards.find((r) => r.keyId === keyId) || currentQ.chest_rewards[0];
    setOpenedChestReward(reward);
    setGameScore((prev) => prev + reward.xp);
    setIsAnswerChecked(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#FACC15", "#FB7185", "#38BDF8", "#4ADE80"],
    });
  };

  // Move to Next Question or Finish
  const handleNextQuestion = () => {
    if (!selectedGame) return;
    if (currentQuestionIdx < selectedGame.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setIsGameFinished(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#FACC15", "#38BDF8", "#C084FC", "#4ADE80"],
      });
    }
  };

  // Accuracy calculation
  const accuracyPercent = isGameFinished
    ? Math.round(
        (gameScore /
          Math.max(
            1,
            selectedGame?.questions.reduce((acc, q) => acc + q.points, 0) || 30
          )) *
          100
      )
    : 0;

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO HEADER */}
      <div className="p-8 sm:p-10 rounded-5xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white shadow-kid-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Gamepad2 className="w-4 h-4" />
            <span>3-КЕЗЕҢ: «ОЙНА ДА, ОЙЛАН!» 🎮</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Оқыған ертегілеріңмен ойнап, жұлдыз жина! ⭐
          </h1>

          <p className="text-sm sm:text-base text-purple-100 font-semibold leading-relaxed">
            Кейіпкерлерді тап, оқиғалар тізбегін құрастыр, дұрыс әрекеттерді таңда және сиқырлы сандықтан алтын тиындар ұтып ал!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <div className="px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md text-xs font-black flex items-center gap-2">
              <span>🎮 Қолжетімді ойындар:</span>
              <span className="text-amber-300 font-extrabold text-sm">6 ойын</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md text-xs font-black flex items-center gap-2">
              <span>⭐ Сыйлық:</span>
              <span className="text-emerald-300 font-extrabold text-sm">+30 ⭐ • +40 🪙</span>
            </div>
          </div>
        </div>

        <div className="absolute right-4 -bottom-10 text-9xl opacity-20 pointer-events-none select-none">
          🎮
        </div>
      </div>

      {/* 2. 6 GAME CARDS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>Танымдық ойындар топтамасы:</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_GAMES.map((game) => (
            <Card
              key={game.id}
              className="p-6 sm:p-7 bg-white border-3 border-slate-200 rounded-4xl shadow-kid-sm hover:border-purple-300 hover:shadow-kid-md hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-purple-100 to-indigo-100 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                    {game.emoji}
                  </div>

                  <Badge variant="solidYellow" size="sm">
                    +{game.points_reward} ⭐ • +{game.coins_reward} 🪙
                  </Badge>
                </div>

                <div>
                  <span className="text-[11px] font-black text-purple-600 uppercase tracking-wide">
                    {game.category}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-purple-600 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs font-extrabold text-edu-sky-700 mt-0.5">
                    📖 «{game.book_title}»
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {game.description}
                </p>

                {/* Badge reward preview */}
                <div className="p-2.5 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-xs font-extrabold text-purple-900 flex items-center gap-2">
                  <span>🏅 Сыйлық:</span>
                  <span>{game.badge_reward}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100">
                <Button
                  variant="purple"
                  size="md"
                  onClick={() => startNewGame(game)}
                  className="w-full justify-center font-black shadow-md gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Ойнау 🚀</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 3. IN-GAME ARENA MODAL */}
      {selectedGame && (
        <Modal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          title={`${selectedGame.emoji} ${selectedGame.title}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Feedback Float Toast */}
            {feedbackToast && (
              <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-center text-sm shadow-md animate-bounce">
                🎉 {feedbackToast}
              </div>
            )}

            {!isGameFinished ? (
              <div className="space-y-6">
                {/* Game Progress Bar & Score Counter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-purple-700">
                      Сұрақ {currentQuestionIdx + 1} / {totalQuestions}
                    </span>
                    <span className="text-amber-600 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{gameScore} ⭐ Ұпай</span>
                    </span>
                  </div>
                  <Progress value={gameProgress} max={100} variant="purple" height="sm" />
                </div>

                {/* Question Text Box */}
                {currentQ && (
                  <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 border-2 border-purple-200 space-y-2">
                    <span className="text-[11px] font-black text-purple-700 uppercase">
                      📖 «{currentQ.book_title || selectedGame.book_title}»
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      {currentQ.question_text}
                    </h3>
                    {currentQ.clue_kk && (
                      <p className="text-xs font-bold text-slate-600">
                        💡 Тұспал: {currentQ.clue_kk}
                      </p>
                    )}
                  </div>
                )}

                {/* MECHANIC 1: CHARACTER PICK / ACTION PICK / SCENARIO CHOICE */}
                {currentQ &&
                  (currentQ.mechanic === "character_pick" ||
                    currentQ.mechanic === "action_pick" ||
                    currentQ.mechanic === "scenario_choice") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQ.options.map((opt, idx) => {
                        const isSelected = selectedOptionId === opt.id;
                        let cardStyle = "border-slate-200 hover:border-purple-300 bg-white";

                        if (isSelected && !isAnswerChecked) {
                          cardStyle = "border-purple-500 bg-purple-50 ring-4 ring-purple-200";
                        }

                        if (isAnswerChecked) {
                          if (opt.is_correct) {
                            cardStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-4 ring-emerald-200";
                          } else if (isSelected && !opt.is_correct) {
                            cardStyle = "border-rose-500 bg-rose-50 text-rose-950 ring-4 ring-rose-200";
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={isAnswerChecked}
                            onClick={() => handleSelectOption(opt.id)}
                            className={cn(
                              "p-4 rounded-3xl border-3 text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between gap-3 select-none",
                              cardStyle
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                              <span>{opt.text}</span>
                            </div>

                            {isAnswerChecked && opt.is_correct && (
                              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                            )}
                            {isAnswerChecked && isSelected && !opt.is_correct && (
                              <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                {/* MECHANIC 2: DRAG & DROP / TAP-SWAP ORDERING */}
                {currentQ && currentQ.mechanic === "drag_order" && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500">
                      Оқиғаларды дұрыс ретпен қойыңыз (1-ден 4-ке дейін):
                    </p>
                    {orderingList.map((item, idx) => {
                      const isCorrectPos = item.correctPos === idx + 1;
                      let orderStyle = "border-slate-200 bg-white";

                      if (isAnswerChecked) {
                        orderStyle = isCorrectPos
                          ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                          : "border-rose-500 bg-rose-50 text-rose-950";
                      }

                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "p-3.5 rounded-3xl border-3 flex items-center justify-between gap-3 transition-all",
                            orderStyle
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-black text-sm">
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800">
                              {item.text}
                            </span>
                          </div>

                          {!isAnswerChecked && (
                            <div className="flex items-center gap-1">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveOrderItem(idx, "up")}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                disabled={idx === orderingList.length - 1}
                                onClick={() => handleMoveOrderItem(idx, "down")}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MECHANIC 3: TRUE / FALSE SPEED */}
                {currentQ && currentQ.mechanic === "true_false" && (
                  <div className="grid grid-cols-2 gap-4">
                    {currentQ.options.map((opt) => {
                      const isSelected = selectedOptionId === opt.id;
                      let tfStyle = "border-slate-200 hover:border-purple-300 bg-white";

                      if (isSelected && !isAnswerChecked) {
                        tfStyle = "border-purple-500 bg-purple-50 ring-4 ring-purple-200";
                      }
                      if (isAnswerChecked) {
                        if (opt.is_correct) {
                          tfStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-4 ring-emerald-200";
                        } else if (isSelected && !opt.is_correct) {
                          tfStyle = "border-rose-500 bg-rose-50 text-rose-950 ring-4 ring-rose-200";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isAnswerChecked}
                          onClick={() => handleSelectOption(opt.id)}
                          className={cn(
                            "p-6 rounded-3xl border-3 font-black text-base sm:text-lg text-center transition-all flex flex-col items-center justify-center gap-2 select-none",
                            tfStyle
                          )}
                        >
                          <span className="text-3xl">{opt.emoji}</span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* MECHANIC 4: MAGIC CHEST RANDOM REWARD UNLOCK */}
                {currentQ && currentQ.mechanic === "chest_unlock" && (
                  <div className="space-y-5 text-center">
                    <div className="w-24 h-24 mx-auto text-6xl animate-bounce">
                      🎁
                    </div>
                    <p className="text-xs font-bold text-slate-600">
                      3 алтын кілттің бірін таңдап, сандықтағы тосын сыйды ашыңыз:
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((keyId) => (
                        <button
                          key={keyId}
                          disabled={isAnswerChecked}
                          onClick={() => handleOpenChest(keyId)}
                          className={cn(
                            "p-4 rounded-3xl border-3 flex flex-col items-center gap-2 font-black transition-all",
                            selectedChestKey === keyId
                              ? "border-amber-500 bg-amber-50 ring-4 ring-amber-200 scale-105"
                              : "border-slate-200 bg-white hover:border-amber-300 hover:scale-105"
                          )}
                        >
                          <span className="text-3xl">🗝️</span>
                          <span className="text-xs font-extrabold">{keyId}-кілт</span>
                        </button>
                      ))}
                    </div>

                    {openedChestReward && (
                      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 space-y-2 animate-fadeIn">
                        <span className="text-3xl">{openedChestReward.sticker}</span>
                        <h4 className="font-black text-base text-amber-950">
                          {openedChestReward.title}
                        </h4>
                        <p className="text-xs font-bold text-amber-900">
                          {openedChestReward.rewardKk}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons in Game */}
                <div className="pt-2">
                  {!isAnswerChecked && currentQ?.mechanic !== "chest_unlock" ? (
                    <Button
                      variant="purple"
                      size="lg"
                      disabled={!selectedOptionId && currentQ?.mechanic !== "drag_order"}
                      onClick={handleCheckAnswer}
                      className="w-full justify-center text-base font-black shadow-lg py-4"
                    >
                      Жауапты тексеру ✓
                    </Button>
                  ) : (
                    <Button
                      variant="green"
                      size="lg"
                      onClick={handleNextQuestion}
                      className="w-full justify-center text-base font-black shadow-lg py-4"
                    >
                      {currentQuestionIdx < totalQuestions - 1
                        ? "Келесі сұраққа өту →"
                        : "Ойынды аяқтау 🏆"}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* 4. SUCCESS STATE: «ОЙЫН АЯҚТАЛДЫ!» */
              <div className="text-center space-y-6 py-4 animate-fadeIn">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-emerald-300 mx-auto flex items-center justify-center text-5xl shadow-lg animate-bounce">
                  🏆
                </div>

                <div className="space-y-1">
                  <Badge variant="solidGreen" size="lg">
                    ОЙЫН АЯҚТАЛДЫ! 🎉
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Жарайсың, Аяла!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-sm mx-auto">
                    «{selectedGame.title}» ойынын сәтті аяқтадың!
                  </p>
                </div>

                {/* Score & Rewards Summary Grid */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-slate-50 border-2 border-slate-200">
                  <div className="text-center space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500">Жинаған ұпай:</span>
                    <div className="text-xl font-black text-amber-600">
                      +{gameScore} ⭐
                    </div>
                  </div>

                  <div className="text-center space-y-0.5 border-x border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500">Дәлдік:</span>
                    <div className="text-xl font-black text-emerald-600">
                      100%
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-500">Тиын:</span>
                    <div className="text-xl font-black text-edu-sky-600">
                      +{selectedGame.coins_reward} 🪙
                    </div>
                  </div>
                </div>

                {/* Badge progress prompt */}
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900 flex items-center justify-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>«10 тапсырма» медаліне +1 қадам қосылды! 🎯</span>
                </div>

                {/* Action Buttons: Retry or Next */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="purple"
                    size="lg"
                    onClick={() => startNewGame(selectedGame)}
                    className="w-full justify-center font-black gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Қайта ойнау ↺</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSelectedGame(null)}
                    className="w-full justify-center font-black"
                  >
                    Басқа ойын таңдау 🎮
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
