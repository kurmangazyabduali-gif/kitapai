import {
  Book,
  BookCategory,
  GoodDeedTask,
  FamilyChallenge,
  BadgeItem,
  Profile,
  ClassRoom,
  GradeLevel,
  MoralValueKey,
  ReaderSkillCategory,
} from "@/types/database.types";
import { MOCK_BOOKS } from "./mock-data";
import { FAMILY_CHALLENGES } from "./family-data";
import { MOCK_GOOD_DEED_TASKS } from "./good-deeds-data";
import { GAMIFICATION_BADGES } from "./gamification";

export interface ClassComparisonItem {
  id: string;
  class_name: string;
  grade_level: number;
  teacher_name: string;
  total_students: number;
  active_students: number;
  average_points: number;
  books_read: number;
  good_deeds_count: number;
  family_participation_rate: number; // percentage
  status_badge: "top" | "active" | "developing";
}

export const MOCK_CLASS_COMPARISON: ClassComparisonItem[] = [
  {
    id: "cls-2a",
    class_name: "2 «А»",
    grade_level: 2,
    teacher_name: "Гүлнар Әділбекқызы",
    total_students: 25,
    active_students: 23,
    average_points: 295,
    books_read: 210,
    good_deeds_count: 84,
    family_participation_rate: 88,
    status_badge: "top",
  },
  {
    id: "cls-2ae",
    class_name: "2 «Ә»",
    grade_level: 2,
    teacher_name: "Сәуле Мұратқызы",
    total_students: 24,
    active_students: 20,
    average_points: 260,
    books_read: 175,
    good_deeds_count: 65,
    family_participation_rate: 76,
    status_badge: "active",
  },
  {
    id: "cls-2b",
    class_name: "2 «Б»",
    grade_level: 2,
    teacher_name: "Жанна Серікқызы",
    total_students: 26,
    active_students: 19,
    average_points: 230,
    books_read: 150,
    good_deeds_count: 52,
    family_participation_rate: 68,
    status_badge: "developing",
  },
  {
    id: "cls-2v",
    class_name: "2 «В»",
    grade_level: 2,
    teacher_name: "Қарлығаш Бақытбек",
    total_students: 24,
    active_students: 21,
    average_points: 275,
    books_read: 190,
    good_deeds_count: 72,
    family_participation_rate: 80,
    status_badge: "active",
  },
  {
    id: "cls-2a",
    class_name: "2 «А»",
    grade_level: 2,
    teacher_name: "Айнұр Серікқызы",
    total_students: 26,
    active_students: 25,
    average_points: 310,
    books_read: 245,
    good_deeds_count: 96,
    family_participation_rate: 92,
    status_badge: "top",
  },
];

export interface AdminWeeklyAnalytics {
  day: string;
  day_short: string;
  books_read: number;
  quizzes_done: number;
  good_deeds: number;
  family_actions: number;
}

export const MOCK_WEEKLY_ACTIVITY: AdminWeeklyAnalytics[] = [
  { day: "Дүйсенбі", day_short: "Дүй", books_read: 65, quizzes_done: 58, good_deeds: 28, family_actions: 14 },
  { day: "Сейсенбі", day_short: "Сей", books_read: 78, quizzes_done: 72, good_deeds: 35, family_actions: 20 },
  { day: "Сәрсенбі", day_short: "Сәр", books_read: 92, quizzes_done: 84, good_deeds: 40, family_actions: 24 },
  { day: "Бейсенбі", day_short: "Бей", books_read: 85, quizzes_done: 79, good_deeds: 38, family_actions: 22 },
  { day: "Жұма", day_short: "Жұм", books_read: 110, quizzes_done: 102, good_deeds: 55, family_actions: 36 },
  { day: "Сенбі", day_short: "Сен", books_read: 135, quizzes_done: 120, good_deeds: 68, family_actions: 58 },
  { day: "Жексенбі", day_short: "Жек", books_read: 142, quizzes_done: 130, good_deeds: 72, family_actions: 65 },
];

const ADMIN_BOOKS_KEY = "kitaptan_admin_books";
const ADMIN_GOOD_DEEDS_KEY = "kitaptan_admin_deeds";
const ADMIN_FAMILY_KEY = "kitaptan_admin_family";
const ADMIN_USERS_KEY = "kitaptan_admin_users";

export function getAdminBooks(): Book[] {
  if (typeof window === "undefined") return MOCK_BOOKS;
  try {
    const raw = localStorage.getItem(ADMIN_BOOKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return MOCK_BOOKS;
}

export function saveAdminBook(book: Omit<Book, "id" | "created_at" | "reads_count"> & { id?: string }): Book {
  const current = getAdminBooks();
  const now = new Date().toISOString();

  let saved: Book;
  let updatedList: Book[];

  if (book.id) {
    const idx = current.findIndex((b) => b.id === book.id);
    saved = {
      ...current[idx],
      ...book,
      id: book.id,
      created_at: current[idx]?.created_at || now,
    };
    updatedList = [...current];
    if (idx >= 0) updatedList[idx] = saved;
    else updatedList.unshift(saved);
  } else {
    saved = {
      ...book,
      id: `book-${Date.now()}`,
      reads_count: 0,
      created_at: now,
    };
    updatedList = [saved, ...current];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ADMIN_BOOKS_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  }
  return saved;
}

export function deleteAdminBook(bookId: string): boolean {
  const current = getAdminBooks();
  const updated = current.filter((b) => b.id !== bookId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ADMIN_BOOKS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return true;
}

export function getAdminUsersList(): Profile[] {
  const defaultUsers: Profile[] = [
    {
      id: "usr-1",
      email: "ayala@kitaptan.kz",
      full_name: "Аяла Ерболқызы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 340,
      stars: 280,
      streak_days: 7,
      total_books_read: 12,
      total_deeds_done: 3,
      avatar_emoji: "🌸",
      created_at: "2026-09-01T08:00:00Z",
    },
    {
      id: "usr-2",
      email: "alikhan@kitaptan.kz",
      full_name: "Әлихан Нұрланұлы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 310,
      stars: 260,
      streak_days: 6,
      total_books_read: 11,
      total_deeds_done: 3,
      avatar_emoji: "🦁",
      created_at: "2026-09-01T08:30:00Z",
    },
    {
      id: "usr-3",
      email: "madina@kitaptan.kz",
      full_name: "Мәдина Бақытбекқызы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 240,
      stars: 210,
      streak_days: 5,
      total_books_read: 8,
      total_deeds_done: 2,
      avatar_emoji: "🦋",
      created_at: "2026-09-02T08:00:00Z",
    },
    {
      id: "usr-4",
      email: "dauren@kitaptan.kz",
      full_name: "Дәурен Серікұлы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 220,
      stars: 195,
      streak_days: 4,
      total_books_read: 7,
      total_deeds_done: 2,
      avatar_emoji: "🚀",
      created_at: "2026-09-02T09:00:00Z",
    },
    {
      id: "usr-5",
      email: "aizere@kitaptan.kz",
      full_name: "Айзере Мұратқызы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 350,
      stars: 290,
      streak_days: 8,
      total_books_read: 13,
      total_deeds_done: 4,
      avatar_emoji: "☀️",
      created_at: "2026-09-03T08:00:00Z",
    },
    {
      id: "usr-6",
      email: "sanzhar@kitaptan.kz",
      full_name: "Санжар Болатұлы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 130,
      stars: 95,
      streak_days: 2,
      total_books_read: 4,
      total_deeds_done: 1,
      avatar_emoji: "🐺",
      created_at: "2026-09-04T08:00:00Z",
    },
    {
      id: "usr-7",
      email: "nurasyl@kitaptan.kz",
      full_name: "Нұрасыл Асқарұлы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 200,
      stars: 175,
      streak_days: 3,
      total_books_read: 6,
      total_deeds_done: 2,
      avatar_emoji: "🦊",
      created_at: "2026-09-04T09:00:00Z",
    },
    {
      id: "usr-8",
      email: "zhaniya@kitaptan.kz",
      full_name: "Жания Дәулетқызы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 300,
      stars: 255,
      streak_days: 6,
      total_books_read: 10,
      total_deeds_done: 3,
      avatar_emoji: "🌺",
      created_at: "2026-09-05T08:00:00Z",
    },
    {
      id: "usr-9",
      email: "ersultan@kitaptan.kz",
      full_name: "Ерсұлтан Бауыржанұлы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 210,
      stars: 185,
      streak_days: 4,
      total_books_read: 7,
      total_deeds_done: 2,
      avatar_emoji: "🦅",
      created_at: "2026-09-05T09:00:00Z",
    },
    {
      id: "usr-10",
      email: "inzhu@kitaptan.kz",
      full_name: "Інжу Қанатқызы",
      role: "student",
      grade_level: 2,
      class_name: "2 «А»",
      school: "№271 мектеп-лицейі",
      coins: 320,
      stars: 270,
      streak_days: 7,
      total_books_read: 11,
      total_deeds_done: 3,
      avatar_emoji: "⭐",
      created_at: "2026-09-06T08:00:00Z",
    },
    {
      id: "usr-t1",
      email: "ainur.teacher@kitaptan.kz",
      full_name: "Айнұр Серікқызы",
      role: "teacher",
      school: "№271 мектеп-лицейі",
      class_name: "2 «А» жетекшісі",
      coins: 500,
      stars: 3500,
      streak_days: 28,
      total_books_read: 45,
      total_deeds_done: 60,
      avatar_emoji: "👩‍🏫",
      created_at: "2026-08-15T09:00:00Z",
    },
    {
      id: "usr-t2",
      email: "zhanar.teacher@kitaptan.kz",
      full_name: "Жанар Болатқызы",
      role: "teacher",
      school: "№271 мектеп-лицейі",
      class_name: "2 «Ә» жетекшісі",
      coins: 450,
      stars: 2800,
      streak_days: 22,
      total_books_read: 38,
      total_deeds_done: 48,
      avatar_emoji: "👩‍🏫",
      created_at: "2026-08-20T09:00:00Z",
    },
    {
      id: "usr-p1",
      email: "bauyrzhan.parent@kitaptan.kz",
      full_name: "Бауыржан Сұлтанұлы",
      role: "parent",
      school: "№271 мектеп-лицейі (Аяланың әкесі)",
      phone: "+7 (777) 123-45-67",
      coins: 200,
      stars: 890,
      streak_days: 14,
      total_books_read: 8,
      total_deeds_done: 9,
      avatar_emoji: "👨‍👩‍👧",
      created_at: "2026-09-02T10:00:00Z",
    },
    {
      id: "usr-adm",
      email: "admin@kitaptan.kz",
      full_name: "Ерлан Құрманғалиұлы",
      role: "admin",
      school: "Оқу-ағарту министрлігі / №271 мектеп",
      coins: 9999,
      stars: 99999,
      streak_days: 120,
      total_books_read: 150,
      total_deeds_done: 500,
      avatar_emoji: "🛡️",
      created_at: "2026-01-01T00:00:00Z",
    },
  ];

  if (typeof window === "undefined") return defaultUsers;
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return defaultUsers;
}

export function saveAdminUser(user: Omit<Profile, "id" | "created_at"> & { id?: string }): Profile {
  const current = getAdminUsersList();
  const now = new Date().toISOString();
  let saved: Profile;
  let updated: Profile[];

  if (user.id) {
    const idx = current.findIndex((u) => u.id === user.id);
    saved = { ...current[idx], ...user, id: user.id, created_at: current[idx]?.created_at || now };
    updated = [...current];
    if (idx >= 0) updated[idx] = saved;
    else updated.unshift(saved);
  } else {
    saved = {
      ...user,
      id: `usr-${Date.now()}`,
      created_at: now,
    };
    updated = [saved, ...current];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return saved;
}

export function deleteAdminUser(userId: string): boolean {
  const current = getAdminUsersList();
  const updated = current.filter((u) => u.id !== userId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return true;
}
