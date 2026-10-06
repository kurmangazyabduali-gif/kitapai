import {
  FamilyChallenge,
  FamilySubmission,
  FamilyAchievement,
} from "@/types/database.types";

export const FAMILY_CHALLENGES: FamilyChallenge[] = [
  {
    id: "fam-chal-1",
    week_number: 1,
    title: "Отбасымызбен 20 минут кітап оқимыз",
    subtitle: "1-апта • Ортақ оқу дәстүрі",
    description: "Отбасы мүшелерімен (әке, ана, бауырлар) бірге жиналып, 20 минут бойы сүйікті ертегіні немесе әңгімені дауыстап оқып, әсерлеріңмен бөлісіңдер.",
    objective_kk: "Кешкі уақытта 20 минут бірлесіп кітап оқу және кейіпкерлерді талқылау.",
    prompt_question: "Осы аптада отбасыммен не жасадық?",
    emoji: "📖",
    color: "emerald",
    bg_gradient: "from-emerald-500 to-teal-600",
    points_reward: 20,
    coins_reward: 30,
    hearts_reward: 1,
    badge_name: "Кітапсүйер отбасы",
    sample_deeds: [
      "Әкем мен анама «Мақта қыз бен мысық» ертегісін мәнерлеп оқып бердім",
      "Кешкі шай үстінде «Әке мен бала» әңгімесін бәріміз кезекпен оқыдық",
      "Бауырыма суретті кітап оқып, ертегінің мазмұнын түсіндірдім",
    ],
  },
  {
    id: "fam-chal-2",
    week_number: 2,
    title: "Ата-әжемнен бір ертегі тыңдаймын",
    subtitle: "2-апта • Ұрпақтар сабақтастығы",
    description: "Ата-әжеңнің немесе үйдің үлкенінің қасына барып, олардың бала кездегі ғибратты ертегісін, аңызын немесе өнегелі естелігін тыңдап, батасын ал.",
    objective_kk: "Үлкендердің ақылы мен қазақ халық аңыздарын тыңдау, қарияларға құрмет көрсету.",
    prompt_question: "Осы аптада отбасыммен не жасадық?",
    emoji: "👵👴",
    color: "amber",
    bg_gradient: "from-amber-500 to-yellow-600",
    points_reward: 20,
    coins_reward: 30,
    hearts_reward: 1,
    badge_name: "Өнегелі ұрпақ",
    sample_deeds: [
      "Әжем маған «Алтын сақа» ертегісін және оның тәрбиелік сырын айтып берді",
      "Атамнан балалық шағы туралы естелікті тыңдап, ақ батасын алдым",
      "Ата-әжеме ыстық шай ұсынып, көне батырлар туралы аңызды тыңдадым",
    ],
  },
  {
    id: "fam-chal-3",
    week_number: 3,
    title: "Отбасымызбен бір жақсы іс жасаймыз",
    subtitle: "3-апта • Ортақ ізгілік",
    description: "Бүкіл отбасы болып бірлесіп, айналаға бір игі іс жасаңдар: ауладағы құстарға жемсалғыш орнату, көршіге көмектесу немесе көшет отырғызу.",
    objective_kk: "Отбасылық ынтымақпен қоғамға немесе табиғатқа нақты қайырымдылық жасау.",
    prompt_question: "Осы аптада отбасыммен не жасадық?",
    emoji: "🤝✨",
    color: "sky",
    bg_gradient: "from-sky-500 to-blue-600",
    points_reward: 20,
    coins_reward: 30,
    hearts_reward: 1,
    badge_name: "Мейірім ұясы",
    sample_deeds: [
      "Әкем екеуміз ағаштан құстарға жемсалғыш жасап, аулаға іліп қойдық",
      "Көрші жалғызбасты әжейге дүкеннен нан мен сүт әкеліп бердік",
      "Үй жанындағы бақшаға анаммен бірге әдемі гүлдер мен бұтақтар отырғыздық",
    ],
  },
  {
    id: "fam-chal-4",
    week_number: 4,
    title: "Ата-анама сүйікті ертегімді айтып беремін",
    subtitle: "4-апта • Шешендік пен әңгімелеу",
    description: "Өзің оқып шыққан ең қызықты ертегіні немесе хикаяны ата-анаңа рөлдерге бөліп, мәнерлеп әрі эмоциямен әңгімелеп бер.",
    objective_kk: "Оқылған мәтінді өз сөзімен жеткізу, сөйлеу мәдениетін дамыту және ой бөлісу.",
    prompt_question: "Осы аптада отбасыммен не жасадық?",
    emoji: "🗣️❤️",
    color: "purple",
    bg_gradient: "from-purple-500 to-indigo-600",
    points_reward: 20,
    coins_reward: 30,
    hearts_reward: 1,
    badge_name: "Шешен оқырман",
    sample_deeds: [
      "Ата-анама «Бала Абай» әңгімесін әсерлі етіп айтып беріп, сұрақтарына жауап бердім",
      "Анама «Ер Төстік» ертегісінің ең қызықты бөлімін рөлге бөліп оқып бердім",
      "Кешкі отырыста бүгінгі оқыған журналымнан білген қызықты деректермен бөлістім",
    ],
  },
  {
    id: "fam-chal-5",
    week_number: 5,
    title: "Үйімізді немесе ауламызды таза ұстауға көмектесеміз",
    subtitle: "5-апта • Тазалық пен ұқыптылық",
    description: "Отбасылық шағын сенбілік өткізіп, үйді ретке келтіруге, өз бөлмеңдегі кітап сөрелерін жинауға немесе ауланы тазартуға белсенді көмектес.",
    objective_kk: "Еңбекқорлық, ұқыптылық және ортақ үй шаруасына жауапкершілікпен қарау.",
    prompt_question: "Осы аптада отбасыммен не жасадық?",
    emoji: "🏡🧹",
    color: "teal",
    bg_gradient: "from-teal-500 to-emerald-600",
    points_reward: 20,
    coins_reward: 30,
    hearts_reward: 1,
    badge_name: "Еңбекқор шаңырақ",
    sample_deeds: [
      "Үйдегі барлық кітап сөресінің шаңын сүртіп, кітаптарды алфавитпен жинадым",
      "Ауладағы жапырақтарды тырмалап, қоқыстарды арнайы орынға тастадық",
      "Бөлмемдегі оқу құралдарым мен ойыншықтарымды ұқыпты реттеп қойдым",
    ],
  },
  {
    id: "fam-chal-6",
    week_number: 6,
    title: "Отбасымызбен бір адамға жақсылық жасаймыз",
    subtitle: "6-апта • Жанашырлық пен ізгілік шыңы",
    description: "Мұқтаж жанға, көпбалалы отбасыға немесе қарт адамға отбасы атынан жылы лебіз білдіріп, көмек қолын созып, үлкен қуаныш сыйлаңдар.",
    objective_kk: "Жанашырлық пен қайырымдылықты өмірлік қағидаға айналдыру.",
    prompt_question: "Осы аптада отбасыммен не жасадық?",
    emoji: "🎁💖",
    color: "rose",
    bg_gradient: "from-rose-500 to-pink-600",
    points_reward: 20,
    coins_reward: 30,
    hearts_reward: 1,
    badge_name: "Алтын шаңырақ",
    sample_deeds: [
      "Кітапханаға өз қолымызбен оқылған 3 қызықты балалар кітабын сыйға тарттық",
      "Үйсіз жануарларға арналған орталыққа жем-азық апарып бердік",
      "Ауырып қалған досымның үйіне отбасымызбен тәттілер апарып, көңілін сұрадық",
    ],
  },
];

export const FAMILY_ACHIEVEMENTS: FamilyAchievement[] = [
  {
    id: "fam-ach-1",
    title: "Алғашқы қадам",
    description: "1-ші апталық отбасылық тапсырманы сәтті орындап, растаттыңыз",
    emoji: "🌱",
    required_weeks: 1,
    unlocked: true,
    badge_variant: "sky",
  },
  {
    id: "fam-ach-2",
    title: "Ынтымақты отбасы",
    description: "3 апталық отбасылық челенджді аяқтап, 3 «Отбасы жүрегін» жинадыңыз",
    emoji: "🤝",
    required_weeks: 3,
    unlocked: false,
    badge_variant: "yellow",
  },
  {
    id: "fam-ach-3",
    title: "Кітапсүйер өнегелі шаңырақ",
    description: "Барлық 6 апталық отбасылық тапсырманы орындап, бас жүлдеге ие болдыңыз",
    emoji: "👑",
    required_weeks: 6,
    unlocked: false,
    badge_variant: "coral",
  },
];

export const INITIAL_FAMILY_SUBMISSIONS: FamilySubmission[] = [
  {
    id: "fsub-1",
    challenge_id: "fam-chal-1",
    week_number: 1,
    student_id: "student-1",
    student_name: "Аяла Ерболқызы",
    student_avatar: "🌸",
    student_class: "3 «А»",
    text: "Кеше кешкі ас соңынан кейін әкем Бауыржан мен анам Гүлнәр екеумізге 20 минут бойы «Әке мен бала» әңгімесін дауыстап оқып бердім. Әкем еңбектің маңызы туралы өте жақсы ой айтты!",
    photo_url: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=600",
    date: "2026-10-01",
    status: "approved",
    parent_name: "Әкесі (Бауыржан Сұлтанұлы)",
    parent_comment: "Жарайсың, қызым! Кешкі оқу бәрімізге керемет көңіл-күй сыйлады. Отбасымыздың нағыз мақтанышысың!",
    points_awarded: 20,
    coins_awarded: 30,
    hearts_awarded: 1,
    is_rewarded: true,
    created_at: "2026-10-01T19:30:00Z",
    approved_at: "2026-10-01T20:15:00Z",
  },
  {
    id: "fsub-2",
    challenge_id: "fam-chal-2",
    week_number: 2,
    student_id: "student-1",
    student_name: "Аяла Ерболқызы",
    student_avatar: "🌸",
    student_class: "3 «А»",
    text: "Демалыс күні ауылдағы әжемнің қасына барып, көне «Алтын сақа» ертегісін тыңдадым. Әжем ертегі соңында маған ақ батасын беріп, басымнан сипады.",
    photo_url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600",
    date: "2026-10-05",
    status: "pending",
    parent_name: "Анасы (Гүлнәр Сұлтанқызы)",
    points_awarded: 20,
    coins_awarded: 30,
    hearts_awarded: 1,
    is_rewarded: false,
    created_at: "2026-10-05T16:45:00Z",
  },
];

const FAMILY_SUBMISSIONS_STORAGE_KEY = "kitaptan_family_submissions";
const FAMILY_REWARDS_STORAGE_KEY = "kitaptan_family_rewards_claimed";

/**
 * Get Submissions from LocalStorage or default
 */
export function getStoredFamilySubmissions(): FamilySubmission[] {
  if (typeof window === "undefined") return INITIAL_FAMILY_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(FAMILY_SUBMISSIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading family submissions:", err);
  }
  return INITIAL_FAMILY_SUBMISSIONS;
}

/**
 * Save new or update Family Challenge Submission
 */
export function submitFamilyChallenge(
  submission: Omit<FamilySubmission, "id" | "created_at" | "status" | "points_awarded" | "coins_awarded" | "hearts_awarded" | "is_rewarded">
): FamilySubmission {
  const current = getStoredFamilySubmissions();
  
  // Check if an existing pending submission exists for this challenge
  const existingIndex = current.findIndex(
    (s) => s.challenge_id === submission.challenge_id && s.student_id === submission.student_id
  );

  let updatedList: FamilySubmission[];
  let savedRecord: FamilySubmission;

  if (existingIndex >= 0 && current[existingIndex].status !== "approved") {
    // Update existing pending
    savedRecord = {
      ...current[existingIndex],
      text: submission.text,
      photo_url: submission.photo_url,
      date: submission.date,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    updatedList = [...current];
    updatedList[existingIndex] = savedRecord;
  } else {
    // Create new submission
    savedRecord = {
      ...submission,
      id: `fsub-${Date.now()}`,
      status: "pending",
      points_awarded: 20,
      coins_awarded: 30,
      hearts_awarded: 1,
      is_rewarded: false,
      created_at: new Date().toISOString(),
    };
    updatedList = [savedRecord, ...current];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(FAMILY_SUBMISSIONS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.error("Error saving family submission:", err);
    }
  }

  return savedRecord;
}

/**
 * Approve Family Submission by Parent
 * Guarantees strict IDEMPOTENCY: points and hearts are only awarded ONCE per challenge!
 */
export function approveFamilySubmission(
  submissionId: string,
  parentName: string = "Ата-ана (Бауыржан Сұлтанұлы)",
  parentComment: string = "Жарайсың! Отбасымызбен жасаған керемет іс болды!"
): { success: boolean; pointsAwarded: number; heartsAwarded: number; alreadyRewarded: boolean } {
  const current = getStoredFamilySubmissions();
  let found = false;
  let alreadyRewarded = false;
  let targetChallengeId = "";

  const updated = current.map((sub) => {
    if (sub.id === submissionId) {
      found = true;
      targetChallengeId = sub.challenge_id;
      if (sub.status === "approved" || sub.is_rewarded) {
        alreadyRewarded = true;
      }
      return {
        ...sub,
        status: "approved" as const,
        parent_name: parentName,
        parent_comment: parentComment,
        is_rewarded: true,
        approved_at: sub.approved_at || new Date().toISOString(),
      };
    }
    return sub;
  });

  if (!found) {
    return { success: false, pointsAwarded: 0, heartsAwarded: 0, alreadyRewarded: false };
  }

  // Idempotency check via reward claims storage
  if (typeof window !== "undefined") {
    try {
      const claimsRaw = localStorage.getItem(FAMILY_REWARDS_STORAGE_KEY);
      const claims: string[] = claimsRaw ? JSON.parse(claimsRaw) : ["fam-chal-1"];

      if (claims.includes(targetChallengeId) || alreadyRewarded) {
        // Already claimed, do not award duplicate points
        localStorage.setItem(FAMILY_SUBMISSIONS_STORAGE_KEY, JSON.stringify(updated));
        return { success: true, pointsAwarded: 0, heartsAwarded: 0, alreadyRewarded: true };
      }

      // Add to claimed rewards
      claims.push(targetChallengeId);
      localStorage.setItem(FAMILY_REWARDS_STORAGE_KEY, JSON.stringify(claims));
      localStorage.setItem(FAMILY_SUBMISSIONS_STORAGE_KEY, JSON.stringify(updated));

      // Record in unified Points Engine
      try {
        const { recordPointsTransaction } = require("@/lib/gamification");
        const targetSub = updated.find((s) => s.id === submissionId);
        recordPointsTransaction({
          student_id: targetSub?.student_id || "student-1",
          action_type: "family_challenge",
          source_id: targetChallengeId,
          title: `Отбасылық челендж: ${targetSub?.week_number || 1}-апта`,
          description: `Ата-ана растады (${parentName})`,
          custom_points: 20,
          custom_coins: 30,
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error("Error saving approved family submission:", err);
    }
  }

  return {
    success: true,
    pointsAwarded: 20,
    heartsAwarded: 1,
    alreadyRewarded: false,
  };

}

/**
 * Calculate Family Progress and Level Info
 */
export function getFamilyProgressStats() {
  const submissions = getStoredFamilySubmissions();
  const approvedList = submissions.filter((s) => s.status === "approved");
  
  const completedCount = approvedList.length; // e.g. 1/6, 2/6, 3/6
  const totalCount = FAMILY_CHALLENGES.length; // 6
  const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));
  
  const totalHearts = approvedList.reduce((acc, curr) => acc + (curr.hearts_awarded || 1), 0);
  const totalPoints = approvedList.reduce((acc, curr) => acc + (curr.points_awarded || 20), 0);

  let familyLevelTitle = "Жаңа бастаған оқырман шаңырағы";
  let familyBadge = "🌱";
  if (completedCount >= 5) {
    familyLevelTitle = "Алтын шаңырақ — Үлгілі оқырман отбасы";
    familyBadge = "👑";
  } else if (completedCount >= 3) {
    familyLevelTitle = "Ынтымақты кітапсүйер отбасы";
    familyBadge = "⭐";
  } else if (completedCount >= 1) {
    familyLevelTitle = "Белсенді оқырман отбасы";
    familyBadge = "❤️";
  }

  return {
    completedCount,
    totalCount,
    progressPercent,
    totalHearts,
    totalPoints,
    familyLevelTitle,
    familyBadge,
    approvedSubmissions: approvedList,
    pendingSubmissions: submissions.filter((s) => s.status === "pending"),
  };
}
