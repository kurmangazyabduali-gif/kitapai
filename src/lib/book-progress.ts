import { Book, BookProgress, ReadingStatus } from "@/types/database.types";
import { recordPointsTransaction } from "@/lib/gamification";
import { MOCK_BOOKS } from "@/lib/mock-data";

export interface BookProgressRecord {
  student_id: string;
  book_id: string;
  progress: number; // 0 to 100
  current_page: number;
  total_pages: number;
  started_at: string;
  completed_at?: string | null;
  last_position: {
    page: number;
    paragraphIndex?: number;
    scrollPercent?: number;
    updatedAt: string;
  };
  audio_position_seconds: number;
  is_bookmarked: boolean;
  bookmarked_page: number;
  is_favorite: boolean;
  is_rewarded: boolean; // strictly prevents infinite reward duplication
  font_size: "sm" | "md" | "lg" | "xl";
  theme: "light" | "sepia" | "dark";
  status: ReadingStatus;
}

const STORAGE_PREFIX = "kitaptan_book_progress_";
const REWARDS_STORAGE_KEY = "kitaptan_rewarded_books_";

/**
 * Get progress for a specific student and book
 */
export function getBookProgress(
  studentId: string = "student-1",
  bookId: string,
  totalPages: number = 3
): BookProgressRecord {
  if (typeof window === "undefined") {
    return {
      student_id: studentId,
      book_id: bookId,
      progress: 0,
      current_page: 1,
      total_pages: totalPages,
      started_at: new Date().toISOString(),
      completed_at: null,
      last_position: {
        page: 1,
        paragraphIndex: 0,
        scrollPercent: 0,
        updatedAt: new Date().toISOString(),
      },
      audio_position_seconds: 0,
      is_bookmarked: false,
      bookmarked_page: 1,
      is_favorite: false,
      is_rewarded: false,
      font_size: "lg",
      theme: "light",
      status: "reading",
    };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${studentId}_${bookId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        total_pages: totalPages || parsed.total_pages || 3,
      };
    }
  } catch (err) {
    console.error("Error reading book progress:", err);
  }

  // Fallback default
  const defaultRecord: BookProgressRecord = {
    student_id: studentId,
    book_id: bookId,
    progress: 0,
    current_page: 1,
    total_pages: totalPages,
    started_at: new Date().toISOString(),
    completed_at: null,
    last_position: {
      page: 1,
      paragraphIndex: 0,
      scrollPercent: 0,
      updatedAt: new Date().toISOString(),
    },
    audio_position_seconds: 0,
    is_bookmarked: false,
    bookmarked_page: 1,
    is_favorite: false,
    is_rewarded: checkIfAlreadyRewarded(studentId, bookId),
    font_size: "lg", // kid friendly 2nd grade default
    theme: "light",
    status: "reading",
  };

  return defaultRecord;
}

/**
 * Save / Update progress
 */
export function saveBookProgress(
  record: Partial<BookProgressRecord> & { student_id: string; book_id: string }
): BookProgressRecord {
  if (typeof window === "undefined") {
    return record as BookProgressRecord;
  }

  try {
    const existing = getBookProgress(
      record.student_id,
      record.book_id,
      record.total_pages || 3
    );

    const updated: BookProgressRecord = {
      ...existing,
      ...record,
      last_position: {
        ...existing.last_position,
        ...(record.last_position || {}),
        page: record.current_page || record.last_position?.page || existing.current_page,
        updatedAt: new Date().toISOString(),
      },
    };

    localStorage.setItem(
      `${STORAGE_PREFIX}${record.student_id}_${record.book_id}`,
      JSON.stringify(updated)
    );

    return updated;
  } catch (err) {
    console.error("Error saving book progress:", err);
    return record as BookProgressRecord;
  }
}

/**
 * Checks if a book reward was already given to prevent duplicate point abuse
 */
export function checkIfAlreadyRewarded(studentId: string, bookId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const rewardedRaw = localStorage.getItem(`${REWARDS_STORAGE_KEY}${studentId}`);
    if (!rewardedRaw) return false;
    const rewardedList: string[] = JSON.parse(rewardedRaw);
    return rewardedList.includes(bookId);
  } catch {
    return false;
  }
}

/**
 * Mark a book as completed and award points ONLY ONCE
 */
export function completeBookReading(
  studentId: string = "student-1",
  bookId: string,
  pointsReward: number = 10,
  coinsReward: number = 20
): {
  isFirstTime: boolean;
  pointsAwarded: number;
  coinsAwarded: number;
  completedAt: string;
} {
  const isAlreadyRewarded = checkIfAlreadyRewarded(studentId, bookId);
  const now = new Date().toISOString();

  // Save completion state
  saveBookProgress({
    student_id: studentId,
    book_id: bookId,
    progress: 100,
    completed_at: now,
    is_rewarded: true,
  });

  if (!isAlreadyRewarded) {
    // Record reward
    if (typeof window !== "undefined") {
      try {
        const rewardedRaw = localStorage.getItem(`${REWARDS_STORAGE_KEY}${studentId}`);
        const rewardedList: string[] = rewardedRaw ? JSON.parse(rewardedRaw) : [];
        if (!rewardedList.includes(bookId)) {
          rewardedList.push(bookId);
          localStorage.setItem(
            `${REWARDS_STORAGE_KEY}${studentId}`,
            JSON.stringify(rewardedList)
          );
        }

        // Record transaction in Points Engine
        try {
          recordPointsTransaction({
            student_id: studentId,
            action_type: "book_read",
            source_id: bookId,
            title: "Ертегіні оқып аяқтады",
            description: "Кітап толық оқылды",
            custom_points: pointsReward,
            custom_coins: coinsReward,
          });
        } catch {
          // ignore
        }
      } catch (err) {
        console.error("Error updating rewarded list:", err);
      }
    }

    return {
      isFirstTime: true,
      pointsAwarded: pointsReward,
      coinsAwarded: coinsReward,
      completedAt: now,
    };
  }

  return {
    isFirstTime: false,
    pointsAwarded: 0,
    coinsAwarded: 0,
    completedAt: now,
  };
}

/**
 * Retrieves the full guaranteed 3-page reading content for any book
 */
export function getBookReadingPages(book?: import("@/types/database.types").Book | null): string[] {
  if (!book) {
    return [
      "Баяғы өткен заманда қазақ даласында ғибратты оқиғалар мен халық даналығына толы қызықты ертегілер мен әңгімелер көп болған екен.",
      "Шығарма кейіпкерлері адалдық пен табандылықтың үлгісін көрсетіп, достарына көмектеседі және өздерінің асыл қасиеттерін шыңдайды.",
      "Кітаптан алған өнеге әрбір оқырманның жүрегіне мейірім шуағын сеуіп, шынайы өмірде жақсы істер жасауға үндейді.",
    ];
  }

  if (Array.isArray(book.content) && book.content.length >= 3) {
    return book.content;
  }

  const existingPages = Array.isArray(book.content) && book.content.length > 0 ? book.content : [];

  const page1 =
    existingPages[0] ||
    `${book.title} — ${book.author} жазған бастауыш сынып оқушыларына арналған ғибратты әрі өнегелі туынды. ${book.description || "Бұл шығарма баланы жақсылыққа, адалдық пен білімге құштар болуға баулиды."}`;

  const page2 =
    existingPages[1] ||
    `Шығарма барысында кейіпкерлер түрлі қызықты оқиғалар мен сынақтарға тап болады. Олар қиындықтан қорықпай, тапқырлық пен адал достықтың арқасында барлық кедергілерді сәтті жеңіп шығады. Кітаптың басты өнегесі: ${book.moral_lesson || "Адал болу және жақындарыңа қамқорлық жасау."}`;

  const page3 =
    existingPages[2] ||
    `Оқиға соңында барлық жақсы әрекеттер өз жемісін беріп, жақсылық пен әділдік салтанат құрады. Осы кітапты оқыған әрбір оқушы: «${book.good_deed_prompt || "Айналаңа мейірім шуағын шашып, бүгін бір жақсы іс жаса!"}» деген ізгі қағиданы жадында сақтайды. Өнеге: ${book.moral_lesson || "Жақсылық жасау — әрбір азаматтың парызы."}`;

  return [page1, page2, page3];
}

/**
 * Find book by ID from localStorage (admin content) or mock data
 */
export function getFullBookById(bookId: string): import("@/types/database.types").Book {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("kitaptan_admin_books");
      if (raw) {
        const adminBooks: import("@/types/database.types").Book[] = JSON.parse(raw);
        const foundAdmin = adminBooks.find((b) => b.id === bookId);
        if (foundAdmin) return foundAdmin;
      }
    } catch {
      // ignore
    }
  }

  return MOCK_BOOKS.find((b: Book) => b.id === bookId) || MOCK_BOOKS[0];
}
