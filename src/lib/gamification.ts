import {
  StudentLevelInfo,
  StudentLevelName,
  PointsTransaction,
  PointActionType,
  BadgeKey,
  BadgeItem,
  StudentBadge,
  StreakInfo,
  StreakMilestone,
  StudentStatsBreakdown,
  DailyMissionTask,
} from "@/types/database.types";

// ==============================================================================
// 1. EXACT LEVELS CONFIGURATION (0–99, 100–249, 250–499, 500–799, 800+)
// ==============================================================================
export const GAMIFICATION_LEVELS: StudentLevelInfo[] = [
  {
    levelNumber: 1,
    name: "Кітаппен таныстым",
    minPoints: 0,
    maxPoints: 99,
    badgeEmoji: "🌱",
    badgeColor: "sky",
    description: "Оқырмандық саяхаттың алғашқы қадамы. Кітаптар мен ертегілер әлеміне қош келдің!",
    reward_title: "Жас оқырман белгісі",
  },
  {
    levelNumber: 2,
    name: "Кітаптың досымын",
    minPoints: 100,
    maxPoints: 249,
    badgeEmoji: "📖",
    badgeColor: "yellow",
    description: "Кітаптармен достасып, тұрақты оқу және ізгі істер жасау әдеті қалыптасты.",
    reward_title: "Кітап досы белгісі",
  },
  {
    levelNumber: 3,
    name: "Белсенді оқырманмын",
    minPoints: 250,
    maxPoints: 499,
    badgeEmoji: "🌟",
    badgeColor: "green",
    description: "Күнделікті ертегі оқып, ойын ойнап, жақсы істер жасаушы озат оқушы.",
    reward_title: "Белсенді оқырман жұлдызы",
  },
  {
    levelNumber: 4,
    name: "Жақсылық жаршысымын",
    minPoints: 500,
    maxPoints: 799,
    badgeEmoji: "💖",
    badgeColor: "purple",
    description: "Кітаптан алған өнегемен отбасына және айналасына мейірім төгуші үлгілі оқушы.",
    reward_title: "Жақсылық жаршысы кубогы",
  },
  {
    levelNumber: 5,
    name: "Оқырман көшбасшысымын",
    minPoints: 800,
    maxPoints: 2000,
    badgeEmoji: "👑",
    badgeColor: "gold",
    description: "Мектеп пен сыныптың мақтанышы, ең үздік оқырман көшбасшысы және үлгісі!",
    reward_title: "Алтын Тәж & Оқырман Көшбасшысы",
  },
];

// ==============================================================================
// 2. BADGES CONFIGURATION (6 Required Core Badges)
// ==============================================================================
export const GAMIFICATION_BADGES: BadgeItem[] = [
  {
    id: "badge-1",
    key: "first_step",
    title: "Алғашқы қадам",
    description: "Алғашқы ертегіні оқып, білім саяхатын бастадыңыз",
    emoji: "🌱",
    category: "reading",
    required_condition: "1 ертегі немесе тапсырма орындау",
    points_reward: 10,
    badge_color: "sky",
  },
  {
    id: "badge-2",
    key: "reader_friend",
    title: "Оқырман досы",
    description: "5 ертегі немесе балалар журналын оқып шықтыңыз",
    emoji: "📚",
    category: "reading",
    required_condition: "5 кітап немесе журнал оқу",
    points_reward: 20,
    badge_color: "yellow",
  },
  {
    id: "badge-3",
    key: "active_reader",
    title: "Белсенді оқырман",
    description: "10 түсіну тесті мен интерактивті ойынды сәтті аяқтадыңыз",
    emoji: "⭐",
    category: "quiz",
    required_condition: "10 тест немесе ойын орындау",
    points_reward: 25,
    badge_color: "green",
  },
  {
    id: "badge-4",
    key: "good_doer",
    title: "Жақсылық жасаушы",
    description: "3 жақсы іс жасап, ата-ана мен ұстаздың растауын алдыңыз",
    emoji: "❤️",
    category: "deed",
    required_condition: "3 расталған жақсы іс жасау",
    points_reward: 30,
    badge_color: "rose",
  },
  {
    id: "badge-5",
    key: "family_heart",
    title: "Отбасы жүрегі",
    description: "3 отбасылық челенджді орындап, отбасымен оқу дәстүрін бекіттіңіз",
    emoji: "👨‍👩‍👧",
    category: "family",
    required_condition: "3 отбасылық челендж орындау",
    points_reward: 30,
    badge_color: "purple",
  },
  {
    id: "badge-6",
    key: "reader_leader",
    title: "Оқырман көшбасшысы",
    description: "800+ ұпай жинап, 5-ші «Оқырман көшбасшысы» деңгейіне жеттіңіз",
    emoji: "👑",
    category: "level",
    required_condition: "800+ ұпай және 5-деңгей",
    points_reward: 50,
    badge_color: "gold",
  },
];

// ==============================================================================
// 3. STREAK MILESTONES (3 күн, 7 күн, 30 күн қатарынан)
// ==============================================================================
export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    title: "3 күн қатарынан",
    description: "3 күн қатарынан үзбей кітап оқып, тапсырма орындадыңыз!",
    bonus_points: 15,
    bonus_coins: 25,
    emoji: "🔥",
    is_claimed: true,
  },
  {
    days: 7,
    title: "7 күн қатарынан",
    description: "Тұтас бір апта бойы күн сайын білім алдыңыз!",
    bonus_points: 30,
    bonus_coins: 50,
    emoji: "⚡",
    is_claimed: true,
  },
  {
    days: 30,
    title: "30 күн қатарынан",
    description: "Бір ай бойы үзбей оқыған нағыз кітап батыры!",
    bonus_points: 100,
    bonus_coins: 150,
    emoji: "🏆",
    is_claimed: false,
  },
];

// ==============================================================================
// 4. DEFAULT POINTS & COIN RULES
// ==============================================================================
export const ACTION_POINTS_CONFIG: Record<
  PointActionType,
  { points: number; coins: number; defaultTitle: string }
> = {
  book_read: {
    points: 10,
    coins: 20,
    defaultTitle: "Ертегіні оқып аяқтады",
  },
  magazine_read: {
    points: 10,
    coins: 20,
    defaultTitle: "Балалар журналын оқыды",
  },
  quiz_passed: {
    points: 10,
    coins: 15,
    defaultTitle: "«Түсін» тестін сәтті тапсырды",
  },
  game_completed: {
    points: 10,
    coins: 15,
    defaultTitle: "Интерактивті ойынды аяқтады",
  },
  good_deed: {
    points: 20,
    coins: 30,
    defaultTitle: "Жақсы іс жасап, расталды",
  },
  family_challenge: {
    points: 20,
    coins: 30,
    defaultTitle: "Отбасылық челендж орындалды",
  },
  streak_bonus: {
    points: 20,
    coins: 30,
    defaultTitle: "Күнделікті оқу сериясы бонусы",
  },
  mission_bonus: {
    points: 20,
    coins: 30,
    defaultTitle: "Күндік барлық миссияны орындады",
  },
};

// ==============================================================================
// 5. INITIAL SEED TRANSACTIONS
// ==============================================================================
export const INITIAL_TRANSACTIONS: PointsTransaction[] = [
  {
    id: "tx-1",
    student_id: "student-1",
    action_type: "book_read",
    source_id: "book-1",
    points: 10,
    coins: 20,
    title: "«Мақта қыз бен мысық» ертегісін оқыды",
    description: "3 беттік қазақ халық ертегісін толық оқып аяқтады",
    created_at: "2026-10-04T10:00:00Z",
  },
  {
    id: "tx-2",
    student_id: "student-1",
    action_type: "quiz_passed",
    source_id: "quiz-book-1",
    points: 10,
    coins: 15,
    title: "«Мақта қыз» бойынша «Түсін» тесті",
    description: "3 сұраққа дұрыс жауап беріп, 100% нәтиже көрсетті",
    created_at: "2026-10-04T10:15:00Z",
  },
  {
    id: "tx-3",
    student_id: "student-1",
    action_type: "good_deed",
    source_id: "sub-1",
    points: 20,
    coins: 30,
    title: "Құстарға жемсалғыш жасау (Қамқорлық)",
    description: "Ата-ана растап, жылы лебізін білдірді",
    created_at: "2026-10-05T14:30:00Z",
  },
  {
    id: "tx-4",
    student_id: "student-1",
    action_type: "game_completed",
    source_id: "game-find_character",
    points: 10,
    coins: 15,
    title: "«Кейіпкерді тап» ойыны",
    description: "Барлық 3 кейіпкерді сәйкестендіріп ұтты",
    created_at: "2026-10-05T17:00:00Z",
  },
  {
    id: "tx-5",
    student_id: "student-1",
    action_type: "family_challenge",
    source_id: "fam-chal-1",
    points: 20,
    coins: 30,
    title: "1-апталық отбасылық кешкі оқу",
    description: "Отбасымен 20 минут кітап оқып, әсерлерімен бөлісті",
    created_at: "2026-10-06T09:00:00Z",
  },
];

const TRANSACTIONS_KEY = "kitaptan_points_transactions";
const UNLOCKED_BADGES_KEY = "kitaptan_unlocked_badges";
const STREAK_KEY = "kitaptan_streak_info";
const REWARD_EVENT_NAME = "kitaptan_reward_event";

// ==============================================================================
// 6. STORAGE HELPERS
// ==============================================================================
export function getStoredTransactions(): PointsTransaction[] {
  if (typeof window === "undefined") return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading points transactions:", err);
  }
  return INITIAL_TRANSACTIONS;
}

export function getUnlockedBadges(): string[] {
  if (typeof window === "undefined") return ["first_step", "reader_friend", "active_reader", "good_doer"];
  try {
    const raw = localStorage.getItem(UNLOCKED_BADGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return ["first_step", "reader_friend", "active_reader", "good_doer"];
}

export function getStreakInfo(): StreakInfo {
  const defaultStreak: StreakInfo = {
    current_streak: 7,
    longest_streak: 12,
    last_active_date: new Date().toISOString().split("T")[0],
    is_active_today: true,
    milestones: STREAK_MILESTONES,
  };

  if (typeof window === "undefined") return defaultStreak;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return defaultStreak;
}

// ==============================================================================
// 7. LEVEL CALCULATOR
// ==============================================================================
export function calculateStudentLevel(totalPoints: number) {
  const currentLevel =
    GAMIFICATION_LEVELS.slice()
      .reverse()
      .find((l) => totalPoints >= l.minPoints) || GAMIFICATION_LEVELS[0];

  const nextLevel =
    GAMIFICATION_LEVELS.find((l) => l.levelNumber === currentLevel.levelNumber + 1) || null;

  const pointsInCurrentLevel = totalPoints - currentLevel.minPoints;
  const pointsRequiredForCurrentLevel = nextLevel
    ? nextLevel.minPoints - currentLevel.minPoints
    : 100;

  const progressPercentage = nextLevel
    ? Math.min(100, Math.round((pointsInCurrentLevel / pointsRequiredForCurrentLevel) * 100))
    : 100;

  const pointsRemaining = nextLevel ? Math.max(0, nextLevel.minPoints - totalPoints) : 0;

  return {
    currentLevel,
    nextLevel,
    progressPercentage,
    pointsRemaining,
  };
}

// ==============================================================================
// 8. DAILY MOTIVATIONAL MESSAGES
// ==============================================================================
export function getDailyMotivationalMessage(
  totalPoints: number,
  streakDays: number,
  pendingDeedsCount: number = 0
): { title: string; subtitle: string; emoji: string } {
  const levelData = calculateStudentLevel(totalPoints);

  if (levelData.pointsRemaining > 0 && levelData.pointsRemaining <= 30) {
    return {
      title: `Келесі деңгейге небәрі ${levelData.pointsRemaining} ұпай қалды! 🎯`,
      subtitle: `«${levelData.nextLevel?.name}» атану үшін тағы бір ертегі немесе тапсырма орында!`,
      emoji: "🚀",
    };
  }

  if (streakDays >= 7) {
    return {
      title: `Сен өте белсенді оқырмансың! 🌟`,
      subtitle: `Оқу сериясы: ${streakDays} күн қатарынан! Осы қарқыннан тайма!`,
      emoji: "🔥",
    };
  }

  if (pendingDeedsCount > 0) {
    return {
      title: `Бүгін бір жақсы іс жаса! ❤️`,
      subtitle: `Кітаптан үйренген мейірімділік пен қамқорлықты өмірде қолдан!`,
      emoji: "💖",
    };
  }

  return {
    title: `Бүгін жақсылық жасауға дайынсың ба? ✨`,
    subtitle: `«Оқы. Түсін. Ойна. Жақсылық жаса. Отбасыңмен бөліс!»`,
    emoji: "🌸",
  };
}

// ==============================================================================
// 9. AUTOMATIC POINTS ENGINE: RECORD TRANSACTION
// Guarantees IDEMPOTENCY — Prevents duplicate rewards for the same action/source
// ==============================================================================
export interface RecordPointParams {
  student_id: string;
  action_type: PointActionType;
  source_id: string; // unique ID of book, quiz, game, deed, family challenge
  title?: string;
  description?: string;
  custom_points?: number;
  custom_coins?: number;
}

export interface RecordPointResult {
  success: boolean;
  alreadyRewarded: boolean;
  transaction?: PointsTransaction;
  pointsEarned: number;
  coinsEarned: number;
  newTotalPoints: number;
  newTotalCoins: number;
  levelUp: {
    occurred: boolean;
    oldLevel?: StudentLevelInfo;
    newLevel?: StudentLevelInfo;
  };
  newBadgesUnlocked: BadgeItem[];
}

export function recordPointsTransaction({
  student_id,
  action_type,
  source_id,
  title,
  description,
  custom_points,
  custom_coins,
}: RecordPointParams): RecordPointResult {
  const currentTxs = getStoredTransactions();

  // 1. Strict Idempotency Check: Look for existing transaction for this action & source
  const existing = currentTxs.find(
    (tx) =>
      tx.student_id === student_id &&
      tx.action_type === action_type &&
      tx.source_id === source_id
  );

  if (existing) {
    const stats = calculateStudentStats(currentTxs);
    return {
      success: false,
      alreadyRewarded: true,
      transaction: existing,
      pointsEarned: 0,
      coinsEarned: 0,
      newTotalPoints: stats.total_points,
      newTotalCoins: stats.total_coins,
      levelUp: { occurred: false },
      newBadgesUnlocked: [],
    };
  }

  // 2. Determine Points & Coins
  const config = ACTION_POINTS_CONFIG[action_type];
  const points = custom_points !== undefined ? custom_points : config.points;
  const coins = custom_coins !== undefined ? custom_coins : config.coins;

  const newTx: PointsTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    student_id,
    action_type,
    source_id,
    points,
    coins,
    title: title || config.defaultTitle,
    description: description || "Жүйелік автоматты марапат",
    created_at: new Date().toISOString(),
  };

  const oldStats = calculateStudentStats(currentTxs);
  const oldLevel = calculateStudentLevel(oldStats.total_points).currentLevel;

  const updatedTxs = [newTx, ...currentTxs];

  // 3. Save to storage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTxs));
    } catch (err) {
      console.error("Error saving points transaction:", err);
    }
  }

  const newStats = calculateStudentStats(updatedTxs);
  const newLevel = calculateStudentLevel(newStats.total_points).currentLevel;

  // 4. Level Up Check
  const levelUpOccurred = newLevel.levelNumber > oldLevel.levelNumber;

  // 5. Badges Unlock Check
  const currentlyUnlocked = getUnlockedBadges();
  const newlyUnlocked: BadgeItem[] = [];

  // Evaluation criteria
  if (!currentlyUnlocked.includes("first_step") && newStats.tales_count >= 1) {
    newlyUnlocked.push(GAMIFICATION_BADGES.find((b) => b.key === "first_step")!);
  }
  if (!currentlyUnlocked.includes("reader_friend") && (newStats.tales_count + newStats.magazines_count >= 5)) {
    newlyUnlocked.push(GAMIFICATION_BADGES.find((b) => b.key === "reader_friend")!);
  }
  if (!currentlyUnlocked.includes("active_reader") && (newStats.games_count >= 5 || updatedTxs.filter((t) => t.action_type === "quiz_passed").length >= 5)) {
    newlyUnlocked.push(GAMIFICATION_BADGES.find((b) => b.key === "active_reader")!);
  }
  if (!currentlyUnlocked.includes("good_doer") && newStats.good_deeds_count >= 3) {
    newlyUnlocked.push(GAMIFICATION_BADGES.find((b) => b.key === "good_doer")!);
  }
  if (!currentlyUnlocked.includes("family_heart") && newStats.family_actions_count >= 3) {
    newlyUnlocked.push(GAMIFICATION_BADGES.find((b) => b.key === "family_heart")!);
  }
  if (!currentlyUnlocked.includes("reader_leader") && newStats.total_points >= 800) {
    newlyUnlocked.push(GAMIFICATION_BADGES.find((b) => b.key === "reader_leader")!);
  }

  if (newlyUnlocked.length > 0 && typeof window !== "undefined") {
    const updatedUnlocked = [...currentlyUnlocked, ...newlyUnlocked.map((b) => b.key)];
    try {
      localStorage.setItem(UNLOCKED_BADGES_KEY, JSON.stringify(updatedUnlocked));
    } catch {
      // ignore
    }
  }

  // 6. Dispatch Global Browser Event for Floating Toast & Celebrations
  if (typeof window !== "undefined") {
    const event = new CustomEvent(REWARD_EVENT_NAME, {
      detail: {
        pointsEarned: points,
        coinsEarned: coins,
        title: newTx.title,
        levelUp: levelUpOccurred ? newLevel : null,
        newBadges: newlyUnlocked,
      },
    });
    window.dispatchEvent(event);
  }

  return {
    success: true,
    alreadyRewarded: false,
    transaction: newTx,
    pointsEarned: points,
    coinsEarned: coins,
    newTotalPoints: newStats.total_points,
    newTotalCoins: newStats.total_coins,
    levelUp: {
      occurred: levelUpOccurred,
      oldLevel,
      newLevel,
    },
    newBadgesUnlocked: newlyUnlocked,
  };
}

// ==============================================================================
// 10. COMPUTE AGGREGATE STUDENT STATS FROM TRANSACTIONS
// ==============================================================================
export function calculateStudentStats(
  transactions: PointsTransaction[] = getStoredTransactions()
): StudentStatsBreakdown {
  let tales_count = 0;
  let tales_points = 0;
  let magazines_count = 0;
  let magazines_points = 0;
  let games_count = 0;
  let games_points = 0;
  let good_deeds_count = 0;
  let good_deeds_points = 0;
  let family_actions_count = 0;
  let family_actions_points = 0;
  let total_points = 0;
  let total_coins = 100; // base starter coins

  for (const tx of transactions) {
    total_points += tx.points;
    total_coins += tx.coins;

    switch (tx.action_type) {
      case "book_read":
        tales_count += 1;
        tales_points += tx.points;
        break;
      case "magazine_read":
        magazines_count += 1;
        magazines_points += tx.points;
        break;
      case "game_completed":
      case "quiz_passed":
        games_count += 1;
        games_points += tx.points;
        break;
      case "good_deed":
        good_deeds_count += 1;
        good_deeds_points += tx.points;
        break;
      case "family_challenge":
        family_actions_count += 1;
        family_actions_points += tx.points;
        break;
      default:
        break;
    }
  }

  // Set minimum defaults for initial rich experience
  tales_count = Math.max(tales_count, 8);
  tales_points = Math.max(tales_points, 80);
  magazines_count = Math.max(magazines_count, 4);
  magazines_points = Math.max(magazines_points, 40);
  games_count = Math.max(games_count, 6);
  games_points = Math.max(games_points, 60);
  good_deeds_count = Math.max(good_deeds_count, 3);
  good_deeds_points = Math.max(good_deeds_points, 60);
  family_actions_count = Math.max(family_actions_count, 2);
  family_actions_points = Math.max(family_actions_points, 40);

  const calculatedTotalPoints =
    tales_points +
    magazines_points +
    games_points +
    good_deeds_points +
    family_actions_points;

  return {
    tales_count,
    tales_points,
    magazines_count,
    magazines_points,
    games_count,
    games_points,
    good_deeds_count,
    good_deeds_points,
    family_actions_count,
    family_actions_points,
    total_points: Math.max(total_points, calculatedTotalPoints),
    total_coins: Math.max(total_coins, 340),
    streak_days: 7,
  };
}
