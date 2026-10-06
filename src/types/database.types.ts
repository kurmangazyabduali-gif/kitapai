export type UserRole = "student" | "parent" | "teacher" | "admin";

export type GradeLevel = 1 | 2 | 3 | 4;

export type StudentLevelName =
  | "Кітаппен таныстым"
  | "Кітаптың досымын"
  | "Белсенді оқырманмын"
  | "Жақсылық жаршысымын"
  | "Оқырман көшбасшысымын";

export type LibraryCategoryKey =
  | "all"
  | "kazakh_tales"
  | "children_literature"
  | "short_stories"
  | "children_magazines";

export type DifficultyLevel = "жеңіл" | "орташа" | "күрделі";

export type ReadingStatus = "unread" | "reading" | "completed";

export interface BookCategory {
  id: string;
  key: LibraryCategoryKey;
  display_name_kk: string;
  emoji: string;
  color: string;
  bgGradient: string;
  description: string;
}

export interface StudentLevelInfo {
  levelNumber: number;
  name: StudentLevelName;
  minPoints: number;
  maxPoints: number;
  badgeEmoji: string;
  badgeColor: string;
  description: string;
  reward_title?: string;
}

export type PointActionType =
  | "book_read"
  | "magazine_read"
  | "quiz_passed"
  | "game_completed"
  | "good_deed"
  | "family_challenge"
  | "streak_bonus"
  | "mission_bonus";

export interface PointsTransaction {
  id: string;
  student_id: string;
  action_type: PointActionType;
  source_id: string; // e.g. "book-1", "game-1", "sub-1", "fam-chal-1"
  points: number; // e.g. +10, +20
  coins: number; // e.g. +20, +30
  title: string;
  description: string;
  created_at: string;
}

export type BadgeKey =
  | "first_step"
  | "reader_friend"
  | "active_reader"
  | "good_doer"
  | "family_heart"
  | "reader_leader";

export interface BadgeItem {
  id: string;
  key: BadgeKey;
  title: string;
  description: string;
  emoji: string;
  category: "reading" | "quiz" | "deed" | "family" | "level";
  required_condition: string;
  points_reward: number;
  badge_color: "sky" | "yellow" | "green" | "purple" | "rose" | "gold";
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_key: BadgeKey;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface StreakMilestone {
  days: number;
  title: string;
  description: string;
  bonus_points: number;
  bonus_coins: number;
  emoji: string;
  is_claimed: boolean;
}

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  is_active_today: boolean;
  milestones: StreakMilestone[];
}


export interface StudentStatsBreakdown {
  tales_count: number;
  tales_points: number;
  magazines_count: number;
  magazines_points: number;
  games_count: number;
  games_points: number;
  good_deeds_count: number;
  good_deeds_points: number;
  family_actions_count: number;
  family_actions_points: number;
  total_points: number;
  total_coins: number;
  streak_days: number;
}

export interface DailyMissionTask {
  id: string;
  type: "tale" | "game" | "deed" | "family";
  title: string;
  description: string;
  emoji: string;
  points: number;
  coins: number;
  completed: boolean;
  actionUrl: string;
}

export interface ActivityTimelineItem {
  id: string;
  type: "reading" | "game" | "deed" | "family" | "badge";
  title: string;
  description: string;
  pointsEarned: number;
  coinsEarned?: number;
  timestamp: string;
  timeAgoKk: string;
  icon: string;
  badgeVariant: "sky" | "yellow" | "green" | "purple" | "coral";
}

export interface Role {
  id: string;
  name: UserRole;
  display_name_kk: string;
}

export interface School {
  id: string;
  name: string;
  city: string;
  region: string;
  code: string;
  created_at: string;
}

export interface ClassRoom {
  id: string;
  school_id: string;
  school_name?: string;
  grade_level: GradeLevel;
  letter: string;
  academic_year: string;
  teacher_id?: string;
  teacher_name?: string;
  student_count?: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  grade_level?: GradeLevel;
  school?: string;
  school_id?: string;
  class_id?: string;
  class_name?: string;
  avatar_url?: string;
  avatar_emoji?: string;
  phone?: string;
  coins: number;
  stars: number;
  streak_days: number;
  total_books_read: number;
  total_deeds_done: number;
  created_at: string;
  updated_at?: string;
}

export interface StudentDetail {
  id: string;
  profile_id: string;
  full_name: string;
  avatar_emoji: string;
  grade_level: GradeLevel;
  class_name: string;
  school_name: string;
  parent_id?: string;
  parent_name?: string;
  coins: number;
  stars: number;
  streak_days: number;
  total_books_read: number;
  total_deeds_done: number;
  reading_level: "бастаушы" | "орта" | "озат";
}

export interface TeacherDetail {
  id: string;
  profile_id: string;
  full_name: string;
  school_id: string;
  school_name: string;
  class_ids: string[];
  class_names: string[];
  subject: string;
}

export interface ParentDetail {
  id: string;
  profile_id: string;
  full_name: string;
  phone: string;
  children: StudentDetail[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  grade_level: GradeLevel;
  category: "kazakh_tales" | "children_literature" | "short_stories" | "children_magazines" | "ертегі" | "әңгіме" | "мысал" | "дастан" | "өнеге" | "журнал";
  category_name_kk: string;
  difficulty: DifficultyLevel;
  age_group: string;
  reading_time_minutes: number;
  estimated_minutes: number;
  total_pages: number;
  description: string;
  content: string[]; // Pages for in-app reader
  audio_url?: string;
  audio_duration?: string;
  moral_lesson: string;
  good_deed_prompt: string;
  points_reward: number;
  coins_reward: number;
  reads_count: number;
  is_featured?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  status?: ReadingStatus;
  current_page?: number;
  is_favorite?: boolean;
  quiz_questions?: BookQuizQuestion[];
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  book_title?: string;
  current_page: number;
  total_pages: number;
  status: "reading" | "quiz_ready" | "completed";
  completed_at?: string;
  last_read_at: string;
}

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "matching"
  | "ordering"
  | "main_idea"
  | "hero_action_evaluation";

export type ReaderSkillCategory =
  | "text_comprehension" // мәтінді түсіну
  | "main_idea"          // негізгі ойды анықтау
  | "hero_evaluation"    // кейіпкер әрекетін түсіну
  | "logical_reasoning"  // логикалық ойлау
  | "vocabulary"         // сөздік қор
  | "attention_detail";  // назар аудару / оқиғалар реті

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  match_target?: string; // For matching pairs e.g. "Мақта қыз" -> "Қатығы төгілді"
  order_position?: number; // For ordering questions e.g. 1, 2, 3
  explanation?: string;
}

export interface BookQuestion {
  id: string;
  book_id: string;
  question_text: string;
  question_type: QuestionType;
  skill_category: ReaderSkillCategory;
  points_reward: number;
  explanation: string;
  moral_insight?: string;
  order_index: number;
  options: QuestionOption[];
  // For matching type
  matching_pairs?: { left: string; right: string; id: string }[];
  // For ordering type
  ordering_items?: { text: string; correctOrder: number; id: string }[];
}

export interface AIDiagnosticReport {
  student_id: string;
  book_id: string;
  book_title: string;
  overall_score_percent: number;
  correct_count: number;
  total_questions: number;
  // Visual Feedback Sections
  strengths: string[]; // «Сенің күшті жағың»
  needs_practice: string[]; // «Көбірек жаттығу қажет»
  next_tips: string[]; // «Келесіде мынаны байқап көр»
  // Skill Category Breakdown
  skill_scores: Record<
    ReaderSkillCategory,
    {
      category_name_kk: string;
      total: number;
      correct: number;
      percentage: number;
      status: "mastered" | "developing" | "needs_attention";
      feedback_kk: string;
    }
  >;
  // Recommendations
  recommendations: {
    suggest_reread: boolean;
    reread_hint?: string;
    suggest_easy_task: boolean;
    suggest_similar_book_id?: string;
    suggest_similar_book_title?: string;
    bonus_questions_available: boolean;
  };
  generated_at: string;
}

export interface QuizAttempt {
  id: string;
  student_id: string;
  book_id: string;
  score: number;
  max_score: number;
  percentage: number;
  points_earned: number;
  coins_earned: number;
  started_at: string;
  completed_at: string;
  ai_diagnosis: AIDiagnosticReport;
}

export interface QuizAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id?: string;
  user_answer: string | string[] | Record<string, string>;
  is_correct: boolean;
  skill_category: ReaderSkillCategory;
  time_spent_seconds: number;
}

export interface TeacherClassSkillDiagnostic {
  class_id: string;
  class_name: string;
  total_students: number;
  tested_students: number;
  average_comprehension_score: number;
  // Specific problem highlight e.g. "Сыныптың 32%-ына мәтіннің негізгі ойын анықтау тапсырмалары қиын болды."
  key_challenge_summary_kk: string;
  skill_breakdown: {
    skill: ReaderSkillCategory;
    name_kk: string;
    icon: string;
    success_rate: number; // percentage e.g. 68%
    struggling_percentage: number; // percentage e.g. 32%
    status: "good" | "moderate" | "critical";
  }[];
  student_matrix: {
    student_id: string;
    student_name: string;
    avatar_emoji: string;
    score: number;
    hardest_skill_kk: string;
    suggested_action_kk: string;
  }[];
  pedagogical_recommendations: string[];
}

export interface BookQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  moralInsight: string;
}

export interface BookProgress {
  id?: string;
  user_id?: string;
  student_id: string;
  book_id: string;
  progress: number; // 0 to 100 percent
  current_page: number;
  total_pages: number;
  progress_percent?: number;
  status: ReadingStatus;
  started_at: string;
  last_read_at: string;
  completed_at?: string | null;
  last_position: {
    page: number;
    paragraphIndex?: number;
    scrollPercent?: number;
    updatedAt: string;
  };
  audio_position_seconds?: number;
  is_bookmarked?: boolean;
  bookmarked_page?: number;
  is_rewarded?: boolean;
}

export interface BookFavorite {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
}

export type MoralValueKey =
  | "kindness"
  | "friendship"
  | "honesty"
  | "diligence"
  | "caring"
  | "responsibility"
  | "nature_protection"
  | "respect_elders"
  | "creativity"
  | "patriotism";

export interface MoralValue {
  id: string;
  key: MoralValueKey;
  name_kk: string;
  emoji: string;
  color: "rose" | "sky" | "yellow" | "green" | "purple" | "coral" | "emerald" | "amber";
  bg_gradient: string;
  prompt_kk: string; // e.g. "Бір адамға көмектес."
  description_kk: string;
  sample_deeds: string[];
}

export interface GoodDeedTask {
  id: string;
  book_id?: string;
  book_title?: string;
  title: string;
  description: string;
  value_key: MoralValueKey;
  value_name_kk: string;
  value_emoji: string;
  points_reward: number; // e.g. 20 XP
  coins_reward: number; // e.g. 30 coins
  deadline_kk: string; // e.g. "Бүгін кешке дейін"
  advice_kk: string; // e.g. "Кітаптан алған өнеге..."
  category?: "табиғат" | "жануарлар" | "отбасы" | "сынып" | "қоғам";
  icon?: string;
}

export interface GoodDeedSubmission {
  id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  student_class?: string;
  deed_id?: string;
  book_id?: string;
  book_title?: string;
  value_key: MoralValueKey;
  value_name_kk: string;
  value_emoji: string;
  title: string;
  description: string; // "Бүгін не істедің?"
  image_url?: string; // "Фото қосу"
  status: "pending" | "approved" | "rejected";
  reviewer_type?: "parent" | "teacher";
  reviewer_name?: string;
  reviewer_comment?: string;
  points_awarded: number;
  coins_awarded: number;
  likes_count: number;
  created_at: string;
  approved_at?: string;
}

export interface GoodDeed {
  id: string;
  user_id: string;
  student_name: string;
  student_avatar?: string;
  student_class?: string;
  book_id?: string;
  book_title?: string;
  title: string;
  description: string;
  image_url?: string;
  value_key?: MoralValueKey;
  value_name_kk?: string;
  value_emoji?: string;
  category: "табиғат" | "жануарлар" | "отбасы" | "сынып" | "қоғам";
  status: "pending" | "approved" | "featured";
  family_confirmed: boolean;
  parent_comment?: string;
  reviewer_type?: "parent" | "teacher";
  points_reward?: number;
  likes_count: number;
  created_at: string;
}

export type GameKey =
  | "find_character"
  | "order_events"
  | "find_good_action"
  | "if_i_were_hero"
  | "true_false_speed"
  | "magic_chest";

export interface GameOptionItem {
  id: string;
  text: string;
  emoji?: string;
  is_correct: boolean;
  image_url?: string;
  explanation_kk?: string;
}

export interface GameQuestionItem {
  id: string;
  game_id: string;
  question_text: string;
  clue_kk?: string;
  book_title?: string;
  mechanic: "character_pick" | "drag_order" | "action_pick" | "scenario_choice" | "true_false" | "chest_unlock";
  points: number;
  options: GameOptionItem[];
  // For drag order
  order_sequence?: { id: string; text: string; correctPos: number }[];
  // For magic chest
  chest_rewards?: { keyId: number; title: string; rewardKk: string; coins: number; xp: number; sticker: string }[];
}

export interface GameItem {
  id: string;
  key: GameKey;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  book_id?: string;
  book_title?: string;
  emoji: string;
  color: "purple" | "sky" | "yellow" | "green" | "coral" | "amber";
  bg_gradient: string;
  points_reward: number; // e.g. 30 ⭐
  coins_reward: number; // e.g. 40 🪙
  badge_reward: string;
  questions_count: number;
  difficulty: "жеңіл" | "орташа" | "күрделі";
  questions: GameQuestionItem[];
}

export interface GameAttempt {
  id: string;
  student_id: string;
  game_id: string;
  game_title: string;
  score: number;
  max_score: number;
  accuracy_percent: number;
  points_earned: number;
  coins_earned: number;
  completed_at: string;
}

export interface FamilyChallenge {
  id: string;
  week_number: number; // 1 to 6
  title: string;
  subtitle: string;
  description: string;
  objective_kk: string;
  prompt_question: string; // «Осы аптада отбасыммен не жасадық?»
  emoji: string;
  color: "emerald" | "purple" | "sky" | "amber" | "rose" | "teal";
  bg_gradient: string;
  points_reward: number; // 20
  coins_reward: number; // 30
  hearts_reward: number; // 1
  badge_name: string;
  sample_deeds: string[];
}

export interface FamilySubmission {
  id: string;
  challenge_id: string;
  week_number: number;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  student_class?: string;
  text: string; // «Осы аптада отбасыммен не жасадық?» жауабы
  photo_url?: string;
  date: string; // YYYY-MM-DD
  status: "pending" | "approved" | "rejected";
  parent_name?: string;
  parent_comment?: string;
  points_awarded: number;
  coins_awarded: number;
  hearts_awarded: number;
  is_rewarded: boolean;
  created_at: string;
  approved_at?: string;
}

export interface FamilyAchievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  required_weeks: number;
  unlocked: boolean;
  badge_variant: "green" | "purple" | "yellow" | "sky" | "coral";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  badge_color: "sky" | "yellow" | "green" | "purple" | "rose";
  required_action: string;
  unlocked: boolean;
  unlocked_at?: string;
}

