"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Award,
  BookOpen,
  RotateCcw,
  Compass,
  TrendingUp,
  Brain,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Shuffle,
  Heart,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_BOOKS, MOCK_BOOK_QUESTIONS } from "@/lib/mock-data";
import { Book, BookQuestion, AIDiagnosticReport } from "@/types/database.types";
import {
  generateStudentAIDiagnosis,
  QuizAnswerSubmission,
  SKILL_METADATA,
} from "@/lib/ai-diagnost";
import { completeBookReading } from "@/lib/book-progress";
import { cn } from "@/lib/utils";

export default function BookUnderstandPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "book-1";

  // Find book
  const book: Book =
    MOCK_BOOKS.find((b) => b.id === bookId) || MOCK_BOOKS[0];

  // Retrieve questions for this book
  const questions: BookQuestion[] =
    MOCK_BOOK_QUESTIONS[bookId] ||
    MOCK_BOOK_QUESTIONS["book-1"] || [
      {
        id: "default-q1",
        book_id: bookId,
        question_text: `«${book.title}» шығармасының басты тәрбиелік өнегесі қандай?`,
        question_type: "main_idea",
        skill_category: "main_idea",
        points_reward: 10,
        explanation: "Шығарма бізге жақсылық жасауға және уәдеге берік болуға баулиды.",
        moral_insight: book.moral_lesson,
        order_index: 1,
        options: [
          { id: "o1", question_id: "default-q1", option_text: book.moral_lesson, is_correct: true },
          { id: "o2", question_id: "default-q1", option_text: "Тек өз пайдаңды ойлау", is_correct: false },
        ],
      },
    ];

  // Quiz State
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [submissions, setSubmissions] = React.useState<QuizAnswerSubmission[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const [diagnosticReport, setDiagnosticReport] = React.useState<AIDiagnosticReport | null>(null);

  // Question-specific interaction states
  // 1. Multiple choice / True False / Main Idea / Hero Eval
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);

  // 2. Matching State
  const [matchingSelections, setMatchingSelections] = React.useState<Record<string, string>>({});

  // 3. Ordering State
  const [orderedItems, setOrderedItems] = React.useState<
    { id: string; text: string; correctOrder: number }[]
  >([]);

  const currentQ = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + (isFinished ? 1 : 0)) / questions.length) * 100);

  // Initialize ordering state when entering an ordering question
  React.useEffect(() => {
    if (currentQ?.question_type === "ordering" && currentQ.ordering_items) {
      // Shuffled copy
      const shuffled = [...currentQ.ordering_items].sort(() => Math.random() - 0.5);
      setOrderedItems(shuffled);
    } else {
      setSelectedOptionId(null);
      setMatchingSelections({});
    }
    setIsAnswerChecked(false);
  }, [currentIdx, currentQ]);

  // Handle Selection
  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(optId);
  };

  const handleMatchSelect = (leftId: string, rightText: string) => {
    if (isAnswerChecked) return;
    setMatchingSelections((prev) => ({
      ...prev,
      [leftId]: rightText,
    }));
  };

  const handleMoveOrder = (fromIdx: number, direction: "up" | "down") => {
    if (isAnswerChecked) return;
    const toIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= orderedItems.length) return;

    const copy = [...orderedItems];
    const temp = copy[fromIdx];
    copy[fromIdx] = copy[toIdx];
    copy[toIdx] = temp;
    setOrderedItems(copy);
  };

  // Evaluate current question correctness
  const evaluateCurrentQuestion = (): { isCorrect: boolean; answerData: any } => {
    if (currentQ.question_type === "matching") {
      const pairs = currentQ.matching_pairs || [];
      const allCorrect = pairs.every((p) => matchingSelections[p.id] === p.right);
      return { isCorrect: allCorrect, answerData: matchingSelections };
    }

    if (currentQ.question_type === "ordering") {
      const allOrdered = orderedItems.every((item, idx) => item.correctOrder === idx + 1);
      return { isCorrect: allOrdered, answerData: orderedItems.map((o) => o.id) };
    }

    // Single choice / true-false / main-idea / hero-eval
    const chosenOpt = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!chosenOpt?.is_correct;
    return { isCorrect, answerData: selectedOptionId || "" };
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    const { isCorrect, answerData } = evaluateCurrentQuestion();
    setIsAnswerChecked(true);

    const newSub: QuizAnswerSubmission = {
      question_id: currentQ.id,
      user_answer: answerData,
      is_correct: isCorrect,
      time_spent_seconds: 15,
    };

    const nextSubmissions = [...submissions, newSub];
    setSubmissions(nextSubmissions);

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#4ADE80", "#38BDF8", "#FACC15"],
      });
    }
  };

  // Move to next question or generate AI Diagnostic report
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finished all questions! Generate pure data-driven AI Diagnost
      const report = generateStudentAIDiagnosis(
        "student-1",
        bookId,
        book.title,
        submissions,
        questions
      );
      setDiagnosticReport(report);
      setIsFinished(true);

      // Award bonus coins for completing understanding stage
      completeBookReading("student-1", bookId, 15, 25);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#C084FC", "#38BDF8", "#FACC15", "#4ADE80"],
      });
    }
  };

  const { isCorrect: isCurrentCorrect } = evaluateCurrentQuestion();

  const isNextDisabled =
    currentQ.question_type === "matching"
      ? Object.keys(matchingSelections).length < (currentQ.matching_pairs?.length || 1)
      : currentQ.question_type === "ordering"
      ? false
      : !selectedOptionId;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* 1. TOP HEADER & PROGRESS */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href={`/student/library/${book.id}/read`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Оқуға оралу</span>
          </Link>

          {/* Stage 2 Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="solidPurple" size="md" className="gap-1.5 shadow-sm">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>2-КЕЗЕҢ: «ТҮСІН»</span>
            </Badge>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-slate-500">
              Сұрақ {Math.min(currentIdx + 1, questions.length)} / {questions.length}
            </span>
          </div>
        </div>

        {/* Dynamic Progress Strip */}
        <div className="max-w-4xl mx-auto mt-2">
          <Progress value={progressPercent} max={100} variant="purple" height="sm" />
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      {!isFinished ? (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
          {/* Question Banner */}
          <Card className="p-6 sm:p-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white rounded-4xl border-none shadow-kid-purple relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  {SKILL_METADATA[currentQ.skill_category]?.name_kk || "Мәтінді түсіну"}
                </span>
                <span className="text-xs font-extrabold text-amber-300">
                  +{currentQ.points_reward} XP
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black leading-snug">
                {currentQ.question_text}
              </h2>
            </div>
            <div className="absolute right-4 -bottom-6 text-7xl opacity-20 pointer-events-none select-none">
              {SKILL_METADATA[currentQ.skill_category]?.icon || "💡"}
            </div>
          </Card>

          {/* QUESTION INTERACTIVE CARDS */}
          <Card className="p-6 sm:p-8 bg-white border-3 border-slate-200 rounded-4xl shadow-kid-md space-y-6">
            {/* TYPE A: MULTIPLE CHOICE & MAIN IDEA & HERO ACTION */}
            {(currentQ.question_type === "multiple_choice" ||
              currentQ.question_type === "main_idea" ||
              currentQ.question_type === "hero_action_evaluation") && (
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOptionId === opt.id;
                  let cardStyle = "border-slate-200 hover:border-edu-sky-400 bg-white";

                  if (isSelected && !isAnswerChecked) {
                    cardStyle = "border-edu-purple-500 bg-edu-purple-50 ring-4 ring-edu-purple-200";
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
                        "w-full p-4 sm:p-5 rounded-3xl border-3 text-left font-bold text-base sm:text-lg transition-all flex items-center justify-between gap-3 select-none",
                        cardStyle
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt.option_text}</span>
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

            {/* TYPE B: TRUE / FALSE */}
            {currentQ.question_type === "true_false" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let tfStyle = "border-slate-200 hover:border-edu-sky-400 bg-white";

                  if (isSelected && !isAnswerChecked) {
                    tfStyle = "border-edu-purple-500 bg-edu-purple-50 ring-4 ring-edu-purple-200";
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
                        "p-6 rounded-3xl border-3 font-black text-lg text-center transition-all flex flex-col items-center justify-center gap-2 select-none",
                        tfStyle
                      )}
                    >
                      <span className="text-3xl">
                        {opt.is_correct ? "👍" : "👎"}
                      </span>
                      <span>{opt.option_text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TYPE C: MATCHING (Сәйкестендіру) */}
            {currentQ.question_type === "matching" && currentQ.matching_pairs && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500">
                  Әр кейіпкерге оның сәйкес келетін әрекетін таңдаңыз:
                </p>
                {currentQ.matching_pairs.map((pair) => (
                  <div
                    key={pair.id}
                    className="p-4 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-2"
                  >
                    <div className="font-extrabold text-base text-slate-900">
                      {pair.left}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {currentQ.matching_pairs?.map((target) => {
                        const isChosen = matchingSelections[pair.id] === target.right;
                        const isCorrectMatch = target.right === pair.right;

                        let pillStyle = "border-slate-200 bg-white hover:border-purple-300";
                        if (isChosen && !isAnswerChecked) {
                          pillStyle = "border-purple-600 bg-purple-100 text-purple-900 ring-2 ring-purple-300";
                        }
                        if (isAnswerChecked && isChosen) {
                          pillStyle = isCorrectMatch
                            ? "border-emerald-500 bg-emerald-100 text-emerald-950"
                            : "border-rose-500 bg-rose-100 text-rose-950";
                        }

                        return (
                          <button
                            key={target.id}
                            disabled={isAnswerChecked}
                            onClick={() => handleMatchSelect(pair.id, target.right)}
                            className={cn(
                              "p-2.5 rounded-2xl border-2 text-xs font-bold transition-all text-left",
                              pillStyle
                            )}
                          >
                            {target.right}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TYPE D: ORDERING (Оқиғалар реті) */}
            {currentQ.question_type === "ordering" && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500">
                  Жоғары/төмен батырмалары арқылы оқиғаларды дұрыс ретпен қойыңыз (1-ден 4-ке дейін):
                </p>
                {orderedItems.map((item, idx) => {
                  const isCorrectPos = item.correctOrder === idx + 1;
                  let orderStyle = "border-slate-200 bg-white";

                  if (isAnswerChecked) {
                    orderStyle = isCorrectPos
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-rose-500 bg-rose-50";
                  }

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "p-4 rounded-3xl border-3 flex items-center justify-between gap-3 transition-all",
                        orderStyle
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {item.text}
                        </span>
                      </div>

                      {!isAnswerChecked && (
                        <div className="flex items-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(idx, "up")}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            disabled={idx === orderedItems.length - 1}
                            onClick={() => handleMoveOrder(idx, "down")}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {isAnswerChecked && (
                        <span className="text-xs font-extrabold">
                          {isCorrectPos ? "✓ Дұрыс" : `(Негізі: ${item.correctOrder}-ші)`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* EXPLANATION / MORAL INSIGHT BOX */}
            {isAnswerChecked && (
              <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-200 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Түсіндірме & Тәрбиелік мәні:</span>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {currentQ.explanation}
                </p>
                {currentQ.moral_insight && (
                  <p className="text-xs font-extrabold text-amber-800">
                    💡 {currentQ.moral_insight}
                  </p>
                )}
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="pt-2">
              {!isAnswerChecked ? (
                <Button
                  variant="purple"
                  size="lg"
                  disabled={isNextDisabled}
                  onClick={handleCheckAnswer}
                  className="w-full justify-center text-base font-black shadow-lg py-4"
                >
                  Жауапты тексеру ✓
                </Button>
              ) : (
                <Button
                  variant="green"
                  size="lg"
                  onClick={handleNext}
                  className="w-full justify-center text-base font-black shadow-lg py-4"
                >
                  {currentIdx < questions.length - 1
                    ? "Келесі сұраққа өту →"
                    : "Нәтижені & AI Диагностиканы көру 🏆"}
                </Button>
              )}
            </div>
          </Card>
        </main>
      ) : (
        /* 3. FINAL VISUAL AI DIAGNOSTIC REPORT FOR STUDENT */
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8 animate-fadeIn">
          {/* Top Score Banner */}
          <Card className="p-8 sm:p-10 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white rounded-5xl shadow-kid-lg text-center relative overflow-hidden">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-5xl mb-4 border-4 border-white/40 shadow-inner animate-bounce">
              🏆
            </div>

            <Badge variant="solidYellow" size="lg" className="mb-2">
              «ТҮСІН» КЕЗЕҢІ АЯҚТАЛДЫ! 🎉
            </Badge>

            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              Керемет нәтиже, Аяла!
            </h1>

            <p className="text-sm text-purple-100 max-w-md mx-auto font-medium">
              «{book.title}» ертегісінің мазмұны мен өнегесін түсіну деңгейің есептелді.
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-left">
                <div className="text-xs font-bold text-purple-200">Түсіну көрсеткіші:</div>
                <div className="text-3xl font-black text-amber-300">
                  {diagnosticReport?.overall_score_percent}%
                </div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-left">
                <div className="text-xs font-bold text-purple-200">Дұрыс жауаптар:</div>
                <div className="text-3xl font-black text-white">
                  {diagnosticReport?.correct_count} / {diagnosticReport?.total_questions}
                </div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-left">
                <div className="text-xs font-bold text-purple-200">Алынған ұпай:</div>
                <div className="text-3xl font-black text-emerald-300">
                  +{diagnosticReport?.correct_count ? diagnosticReport.correct_count * 10 : 30} XP
                </div>
              </div>
            </div>
          </Card>

          {/* AI ДИАГНОСТ БЛОГЫ (3 Card Visual Feedback) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-black text-slate-900">
                AI Диагност: Сенің оқырмандық талдауың
              </h2>
            </div>
            <p className="text-xs font-bold text-slate-500">
              * Бұл диагностика оқушының мәтінді түсіну ерекшелігін анықтауға арналған педагогикалық талдау болып табылады.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Күшті жағың */}
              <Card className="p-6 rounded-4xl bg-emerald-50 border-3 border-emerald-200 shadow-kid-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md">
                    🌟
                  </div>
                  <h3 className="text-lg font-black text-emerald-950">
                    Сенің күшті жағың
                  </h3>
                  <ul className="space-y-2 text-xs font-bold text-emerald-900">
                    {diagnosticReport?.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Badge variant="solidGreen" size="sm" className="w-fit">
                  Өте жақсы
                </Badge>
              </Card>

              {/* 2. Көбірек жаттығу қажет */}
              <Card className="p-6 rounded-4xl bg-amber-50 border-3 border-amber-200 shadow-kid-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-2xl shadow-md">
                    🧐
                  </div>
                  <h3 className="text-lg font-black text-amber-950">
                    Көбірек жаттығу қажет
                  </h3>
                  <ul className="space-y-2 text-xs font-bold text-amber-900">
                    {diagnosticReport?.needs_practice.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Badge variant="solidYellow" size="sm" className="w-fit">
                  Дамыту қажет
                </Badge>
              </Card>

              {/* 3. Келесіде мынаны байқап көр */}
              <Card className="p-6 rounded-4xl bg-purple-50 border-3 border-purple-200 shadow-kid-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md">
                    💡
                  </div>
                  <h3 className="text-lg font-black text-purple-950">
                    Келесіде мынаны байқап көр
                  </h3>
                  <ul className="space-y-2 text-xs font-bold text-purple-900">
                    {diagnosticReport?.next_tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-600">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Badge variant="solidPurple" size="sm" className="w-fit">
                  Кеңес
                </Badge>
              </Card>
            </div>
          </div>

          {/* 6 SKILL CATEGORY DETAILED PROGRESS BREAKDOWN */}
          <Card className="p-6 sm:p-8 rounded-4xl bg-white border-3 border-slate-200 shadow-kid-md space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-edu-sky-600" />
              <span>Оқырмандық дағдылар картасы (6 бағыт):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {diagnosticReport &&
                (Object.keys(diagnosticReport.skill_scores) as (keyof typeof diagnosticReport.skill_scores)[]).map(
                  (skillKey) => {
                    const item = diagnosticReport.skill_scores[skillKey];
                    const meta = SKILL_METADATA[skillKey];

                    return (
                      <div
                        key={skillKey}
                        className="p-4 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs font-black">
                          <div className="flex items-center gap-2">
                            <span>{meta.icon}</span>
                            <span>{item.category_name_kk}</span>
                          </div>
                          <span className="text-purple-700 font-extrabold">
                            {item.percentage}%
                          </span>
                        </div>
                        <Progress
                          value={item.percentage}
                          max={100}
                          variant={
                            item.percentage >= 80
                              ? "green"
                              : item.percentage >= 50
                              ? "yellow"
                              : "purple"
                          }
                          height="sm"
                        />
                      </div>
                    );
                  }
                )}
            </div>
          </Card>

          {/* NEXT FORMULA ACTIONS (ОҚЫ → ТҮСІН → ОЙНА → ЖАҚСЫ ІС ЖАСА) */}
          <div className="p-6 sm:p-8 rounded-4xl bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 border-3 border-rose-200 space-y-6 text-center shadow-kid-md">
            <div className="space-y-1">
              <Badge variant="coral" size="md">
                ❤️ 4-КЕЗЕҢ: «КІТАПТАН – ЖАҚСЫ ІСКЕ»
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Бұл кітап саған қандай жақсы қасиетті үйретті?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-lg mx-auto">
                Өзіңе ұнаған ізгі қасиетті таңдаңыз, осы кітаптың өнегесімен нақты жақсы іс миссиясын орындайық:
              </p>
            </div>

            {/* 8 Values Fast Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { key: "caring", name: "Қамқорлық", emoji: "🌱", prompt: "Гүлге немесе жануарға күтім жаса." },
                { key: "kindness", name: "Мейірімділік", emoji: "❤️", prompt: "Бір адамға көмектес." },
                { key: "diligence", name: "Еңбекқорлық", emoji: "💪", prompt: "Үйдегі бір жұмысқа көмектес." },
                { key: "friendship", name: "Достық", emoji: "🤝", prompt: "Сыныптасыңа жақсы сөз айт." },
                { key: "honesty", name: "Адалдық", emoji: "✨", prompt: "Әрдайым шындықты айт." },
                { key: "responsibility", name: "Жауапкершілік", emoji: "🎯", prompt: "Өз ісіңе жауапты бол." },
                { key: "nature_protection", name: "Табиғатты қорғау", emoji: "🌍", prompt: "Айналаңды таза ұста." },
                { key: "respect_elders", name: "Үлкенді сыйлау", emoji: "🙏", prompt: "Ата-әжеңе ізет көрсет." },
              ].map((val) => (
                <Link
                  key={val.key}
                  href={`/student/good-deeds?bookId=${book.id}&value=${val.key}`}
                  className="p-3.5 rounded-3xl bg-white border-2 border-rose-200 hover:border-rose-400 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center gap-1.5 text-center group"
                >
                  <span className="text-2xl transform group-hover:scale-110 transition-transform">
                    {val.emoji}
                  </span>
                  <span className="text-xs font-black text-slate-900 leading-tight">
                    {val.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold line-clamp-1">
                    {val.prompt}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/student/good-deeds">
                <Button variant="coral" size="lg" className="px-8 font-black shadow-lg gap-2 text-base">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Жақсы істер бөліміне өту (+20 XP) 🚀</span>
                </Button>
              </Link>

              <Link href="/student/library">
                <Button variant="outline" size="lg" className="px-6 font-black">
                  Кітапханаға қайту
                </Button>
              </Link>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
