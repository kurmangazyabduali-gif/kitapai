import {
  BookQuestion,
  ReaderSkillCategory,
  AIDiagnosticReport,
  QuizAnswer,
  TeacherClassSkillDiagnostic,
} from "@/types/database.types";

export interface QuizAnswerSubmission {
  question_id: string;
  user_answer: string | string[] | Record<string, string>;
  is_correct: boolean;
  time_spent_seconds: number;
}

export const SKILL_METADATA: Record<
  ReaderSkillCategory,
  {
    name_kk: string;
    icon: string;
    description: string;
    strength_template: string;
    weakness_template: string;
    tip_template: string;
  }
> = {
  text_comprehension: {
    name_kk: "Мәтінді тікелей түсіну",
    icon: "📖",
    description: "Мәтіндегі фактілерді, кейіпкерлердің есімдері мен оқиға орнын есте сақтау",
    strength_template: "Мәтіндегі басты оқиғалар мен кейіпкерлерді өте жақсы есте сақтайсың!",
    weakness_template: "Мәтіннің кейбір маңызды детальдарына көбірек көңіл бөлу қажет.",
    tip_template: "Кітапты оқығанда ең қызықты сөздер мен кейіпкер аттарына назар аудар.",
  },
  main_idea: {
    name_kk: "Негізгі ой мен өнегені анықтау",
    icon: "💡",
    description: "Шығарманың түпкі мәнін, автордың айтпақ болған ғибратын табу",
    strength_template: "Шығарманың негізгі тәрбиелік мәні мен өнегесін терең түсінесің!",
    weakness_template: "Мәтіннің басты идеясын қосалқы оқиғалардан ажыратуға жаттығу керек.",
    tip_template: "Өзіңе «Бұл ертегі маған қандай жақсылық жасауды үйретті?» деген сұрақ қой.",
  },
  hero_evaluation: {
    name_kk: "Кейіпкер әрекетін бағалау",
    icon: "❤️",
    description: "Кейіпкердің жақсы немесе теріс қылықтарын саралап, адамгершілік баға беру",
    strength_template: "Кейіпкерлердің сезімі мен жақсы-жаман әрекеттерін керемет ажыратасың!",
    weakness_template: "Кейіпкердің неліктен олай істеген себебін тереңірек талдау қажет.",
    tip_template: "«Мен оның орнында болсам не істер едім?» деп ойланып көр.",
  },
  logical_reasoning: {
    name_kk: "Логикалық ойлау & себеп-салдар",
    icon: "🧩",
    description: "Оқиғалардың себебі мен оның нәтижесін байланыстыра білу",
    strength_template: "Себеп-салдарлық байланыстар мен логикалық сұрақтарды оңай шешесің!",
    weakness_template: "Оқиғалардың не себепті орын алғанын байқауға көбірек жаттығу қажет.",
    tip_template: "«Егер ол бұлай істемегенде не болар еді?» деп ойланып көр.",
  },
  vocabulary: {
    name_kk: "Сөздік қор & мағына",
    icon: "📚",
    description: "Көркемдегіш сөздер мен мақал-мәтелдердің мағынасын ұғыну",
    strength_template: "Қазақ тілінің бай сөздік қорын, мақал-мәтелдер мен тұрақты тіркестерді жақсы білесің!",
    weakness_template: "Бейтаныс сөздердің мағынасын мәтін контекстінен ұғынуға жаттығу қажет.",
    tip_template: "Түсініксіз сөз кездессе, ата-анаңнан немесе сөздіктен сұрап ал.",
  },
  attention_detail: {
    name_kk: "Назар аудару & оқиғалар реті",
    icon: "⏱️",
    description: "Оқиғалардың жүру реттілігін (1-ші, 2-ші, 3-ші) және ұсақ детальдарды бақылау",
    strength_template: "Оқиғалардың рет-ретімен қалай өрбігенін мүлтіксіз қадағалайсың!",
    weakness_template: "Оқиғалардың басы, ортасы және соңғы ретін шатастырмай есте сақтау керек.",
    tip_template: "Оқиғаларды көз алдыңа мультфильм кадрлары сияқты тізіп елестет.",
  },
};

/**
 * Deterministic, purely data-driven AI Diagnostic Generator for Student
 * Analyzes exact user answers without hallucination.
 */
export function generateStudentAIDiagnosis(
  studentId: string,
  bookId: string,
  bookTitle: string,
  submissions: QuizAnswerSubmission[],
  questions: BookQuestion[]
): AIDiagnosticReport {
  const totalQuestions = questions.length;
  let correctCount = 0;

  // Initialize skill scores accumulator
  const skillScores: AIDiagnosticReport["skill_scores"] = {
    text_comprehension: {
      category_name_kk: SKILL_METADATA.text_comprehension.name_kk,
      total: 0,
      correct: 0,
      percentage: 0,
      status: "developing",
      feedback_kk: "",
    },
    main_idea: {
      category_name_kk: SKILL_METADATA.main_idea.name_kk,
      total: 0,
      correct: 0,
      percentage: 0,
      status: "developing",
      feedback_kk: "",
    },
    hero_evaluation: {
      category_name_kk: SKILL_METADATA.hero_evaluation.name_kk,
      total: 0,
      correct: 0,
      percentage: 0,
      status: "developing",
      feedback_kk: "",
    },
    logical_reasoning: {
      category_name_kk: SKILL_METADATA.logical_reasoning.name_kk,
      total: 0,
      correct: 0,
      percentage: 0,
      status: "developing",
      feedback_kk: "",
    },
    vocabulary: {
      category_name_kk: SKILL_METADATA.vocabulary.name_kk,
      total: 0,
      correct: 0,
      percentage: 0,
      status: "developing",
      feedback_kk: "",
    },
    attention_detail: {
      category_name_kk: SKILL_METADATA.attention_detail.name_kk,
      total: 0,
      correct: 0,
      percentage: 0,
      status: "developing",
      feedback_kk: "",
    },
  };

  // Evaluate each submission by mapped skill
  submissions.forEach((sub) => {
    const q = questions.find((item) => item.id === sub.question_id);
    if (!q) return;

    const skill = q.skill_category || "text_comprehension";
    if (skillScores[skill]) {
      skillScores[skill].total += 1;
      if (sub.is_correct) {
        skillScores[skill].correct += 1;
        correctCount += 1;
      }
    }
  });

  // Calculate percentages and statuses
  const strengths: string[] = [];
  const needsPractice: string[] = [];
  const nextTips: string[] = [];

  (Object.keys(skillScores) as ReaderSkillCategory[]).forEach((skillKey) => {
    const item = skillScores[skillKey];
    if (item.total > 0) {
      item.percentage = Math.round((item.correct / item.total) * 100);
      if (item.percentage >= 80) {
        item.status = "mastered";
        item.feedback_kk = SKILL_METADATA[skillKey].strength_template;
        strengths.push(SKILL_METADATA[skillKey].strength_template);
      } else if (item.percentage >= 50) {
        item.status = "developing";
        item.feedback_kk = SKILL_METADATA[skillKey].weakness_template;
        needsPractice.push(SKILL_METADATA[skillKey].weakness_template);
        nextTips.push(SKILL_METADATA[skillKey].tip_template);
      } else {
        item.status = "needs_attention";
        item.feedback_kk = SKILL_METADATA[skillKey].weakness_template;
        needsPractice.push(SKILL_METADATA[skillKey].weakness_template);
        nextTips.push(SKILL_METADATA[skillKey].tip_template);
      }
    }
  });

  // Ensure there are at least 1-2 positive strengths and actionable tips
  if (strengths.length === 0) {
    strengths.push("Сен тапсырманы орындауға үлкен талпыныс таныттың! Әрбір қадам жаңа білімге бастайды 🌟");
  }
  if (needsPractice.length === 0) {
    needsPractice.push("Барлық сұрақтарды жоғары деңгейде меңгердің! Енді күрделірек мәтіндерді оқып көр 🚀");
  }
  if (nextTips.length === 0) {
    nextTips.push("Келесі кітапты оқығанда кейіпкерлердің диалогтарына ерекше назар аудар 💡");
  }

  const overallPercent = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

  return {
    student_id: studentId,
    book_id: bookId,
    book_title: bookTitle,
    overall_score_percent: overallPercent,
    correct_count: correctCount,
    total_questions: totalQuestions,
    strengths: strengths.slice(0, 3),
    needs_practice: needsPractice.slice(0, 3),
    next_tips: nextTips.slice(0, 3),
    skill_scores: skillScores,
    recommendations: {
      suggest_reread: overallPercent < 70,
      reread_hint:
        overallPercent < 70
          ? "Мәтіннің 2-бөлімін қайта бір шолып шығу негізгі ойды толық ұғынуға көмектеседі."
          : undefined,
      suggest_easy_task: overallPercent < 50,
      suggest_similar_book_id: bookId === "book-1" ? "book-2" : "book-1",
      suggest_similar_book_title:
        bookId === "book-1" ? "Алтын сақа" : "Мақта қыз бен мысық",
      bonus_questions_available: overallPercent >= 80,
    },
    generated_at: new Date().toISOString(),
  };
}

/**
 * Teacher Class Skill Aggregation Diagnostic
 * Provides pedagogical insights e.g. "Сыныптың 32%-ына мәтіннің негізгі ойын анықтау тапсырмалары қиын болды."
 */
export function getMockTeacherClassDiagnostic(): TeacherClassSkillDiagnostic {
  return {
    class_id: "class-1",
    class_name: "3 «А» сыныбы",
    total_students: 25,
    tested_students: 22,
    average_comprehension_score: 78,
    key_challenge_summary_kk:
      "Сыныптың 32%-ына мәтіннің негізгі ойын анықтау тапсырмалары қиын болды.",
    skill_breakdown: [
      {
        skill: "hero_evaluation",
        name_kk: "Кейіпкер әрекетін бағалау",
        icon: "❤️",
        success_rate: 92,
        struggling_percentage: 8,
        status: "good",
      },
      {
        skill: "text_comprehension",
        name_kk: "Мәтінді тікелей түсіну",
        icon: "📖",
        success_rate: 88,
        struggling_percentage: 12,
        status: "good",
      },
      {
        skill: "vocabulary",
        name_kk: "Сөздік қор & көркем тіл",
        icon: "📚",
        success_rate: 82,
        struggling_percentage: 18,
        status: "good",
      },
      {
        skill: "logical_reasoning",
        name_kk: "Логикалық себеп-салдар",
        icon: "🧩",
        success_rate: 74,
        struggling_percentage: 26,
        status: "moderate",
      },
      {
        skill: "main_idea",
        name_kk: "Негізгі ойды анықтау",
        icon: "💡",
        success_rate: 68,
        struggling_percentage: 32, // Exactly 32% problem highlight!
        status: "critical",
      },
      {
        skill: "attention_detail",
        name_kk: "Назар аудару & оқиға реті",
        icon: "⏱️",
        success_rate: 76,
        struggling_percentage: 24,
        status: "moderate",
      },
    ],
    student_matrix: [
      {
        student_id: "s-1",
        student_name: "Аяла Ерболқызы",
        avatar_emoji: "🌸",
        score: 90,
        hardest_skill_kk: "Оқиғалардың реттілігі",
        suggested_action_kk: "Қосымша реттілік логикалық ойынын ұсыну",
      },
      {
        student_id: "s-2",
        student_name: "Әлихан Мұратұлы",
        avatar_emoji: "🦁",
        score: 65,
        hardest_skill_kk: "Негізгі ойды анықтау",
        suggested_action_kk: "«Әке мен бала» әңгімесінің ғибратты бөлімін қайта талқылау",
      },
      {
        student_id: "s-3",
        student_name: "Нұрлан Бақытұлы",
        avatar_emoji: "🚀",
        score: 70,
        hardest_skill_kk: "Сөздік қор",
        suggested_action_kk: "Түсіндірме сөздікпен жұмыс жасау",
      },
      {
        student_id: "s-4",
        student_name: "Диана Серікқызы",
        avatar_emoji: "🎨",
        score: 85,
        hardest_skill_kk: "Логикалық себеп-салдар",
        suggested_action_kk: "Ертегілердегі кейіпкер шешімдерін салыстыру",
      },
      {
        student_id: "s-5",
        student_name: "Санжар Болатұлы",
        avatar_emoji: "⚽",
        score: 60,
        hardest_skill_kk: "Негізгі ойды анықтау",
        suggested_action_kk: "Мұғаліммен бірге шағын топта қорытынды шығару жаттығуы",
      },
    ],
    pedagogical_recommendations: [
      "📚 Сынып сағатында «Мәтін бізге не үйретті?» атты 10 минуттық дөңгелек үстел өткізу ұсынылады.",
      "💡 Оқушыларға қосымша сұрақтар бергенде, негізгі идеяны анықтауға арналған 3 нұсқалы жеңілдетілген сұрақтарды қолдану.",
      "🔄 Қиналған 32% оқушы үшін «Әке мен бала» және «Мақта қыз» мәтіндерінің мақал-мәтелдерге құрылған түйінін қайта қарау.",
      "🧩 Оқиғалар тізбегін реттеу үшін суретті карточкалармен «Оқиғалар қалай басталды?» ойынын өткізу.",
    ],
  };
}
