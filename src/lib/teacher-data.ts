import {
  GradeLevel,
  StudentLevelName,
  MoralValueKey,
} from "@/types/database.types";

export interface TeacherStudentItem {
  id: string;
  profile_id: string;
  full_name: string;
  avatar_emoji: string;
  class_name: string;
  grade_level: GradeLevel;
  level_name: StudentLevelName;
  level_badge: string;
  level_number: number;
  points: number;
  coins: number;
  books_read: number;
  games_completed: number;
  good_deeds_count: number;
  family_tasks_count: number;
  streak_days: number;
  last_activity: string;
  last_active_date: string;
  reading_level: "озат" | "орта" | "бастаушы";
  parent_name: string;
  parent_phone: string;
  ai_summary_note: string;
  comprehension_score: number;
  recent_books: {
    id: string;
    title: string;
    category: string;
    progress: number;
    score: number;
    completed_at: string;
  }[];
  recent_deeds: {
    id: string;
    title: string;
    value_name: string;
    value_emoji: string;
    date: string;
    status: "approved" | "pending" | "rejected";
    description: string;
    image_url?: string;
  }[];
  recent_family: {
    id: string;
    week_number: number;
    title: string;
    date: string;
    status: "approved" | "pending" | "rejected";
    text: string;
    photo_url?: string;
  }[];
}

export const MOCK_TEACHER_CLASS_STUDENTS: TeacherStudentItem[] = [
  {
    id: "std-1",
    profile_id: "student-1",
    full_name: "Аяла Ерболқызы",
    avatar_emoji: "🌸",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Белсенді оқырманмын",
    level_badge: "🌟",
    level_number: 3,
    points: 280,
    coins: 340,
    books_read: 12,
    games_completed: 6,
    good_deeds_count: 3,
    family_tasks_count: 2,
    streak_days: 7,
    last_activity: "Бүгін, 14:20",
    last_active_date: "2026-10-06",
    reading_level: "озат",
    parent_name: "Бауыржан Сұлтанұлы (Әкесі)",
    parent_phone: "+7 (777) 123-45-67",
    ai_summary_note: "Мәтінді өте жылдам әрі терең түсінеді. Мейірімділік пен қамқорлық істерінде сынып бойынша көшбасшы.",
    comprehension_score: 95,
    recent_books: [
      { id: "book-1", title: "Мақта қыз бен мысық", category: "Қазақ ертегілері", progress: 100, score: 100, completed_at: "2026-10-05" },
      { id: "book-4", title: "Әке мен бала", category: "Балалар әдебиеті", progress: 100, score: 90, completed_at: "2026-10-04" },
      { id: "book-2", title: "Алтын сақа", category: "Қазақ ертегілері", progress: 100, score: 95, completed_at: "2026-10-02" },
    ],
    recent_deeds: [
      { id: "deed-1", title: "Ауладағы құстарға жемсалғыш жасау", value_name: "Қамқорлық", value_emoji: "🌱", date: "2026-10-05", status: "approved", description: "Әкесімен бірге ағаштан жемсалғыш жасап, ағашқа ілді.", image_url: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&q=80&w=600" },
      { id: "deed-2", title: "Бөлме гүлдерін баптау", value_name: "Еңбекқорлық", value_emoji: "💪", date: "2026-10-06", status: "pending", description: "Үйдегі 6 гүлдің жапырақтарын сүртіп, су құйды." },
    ],
    recent_family: [
      { id: "fsub-1", week_number: 1, title: "20 минут отбасымен кітап оқу", date: "2026-10-01", status: "approved", text: "Әкесі мен анасына «Әке мен бала» әңгімесін оқып берді." },
      { id: "fsub-2", week_number: 2, title: "Ата-әжеден ертегі тыңдау", date: "2026-10-05", status: "pending", text: "Әжесінен «Алтын сақа» ертегісін тыңдап, батасын алды." },
    ],
  },
  {
    id: "std-2",
    profile_id: "student-2",
    full_name: "Әлихан Нұрланұлы",
    avatar_emoji: "🦁",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Белсенді оқырманмын",
    level_badge: "🌟",
    level_number: 3,
    points: 260,
    coins: 310,
    books_read: 11,
    games_completed: 5,
    good_deeds_count: 3,
    family_tasks_count: 2,
    streak_days: 6,
    last_activity: "Бүгін, 11:45",
    last_active_date: "2026-10-06",
    reading_level: "озат",
    parent_name: "Нұрлан Серікұлы",
    parent_phone: "+7 (701) 987-65-43",
    ai_summary_note: "Батырлар жыры мен тарихи әңгімелерді жақсы көреді. Логикалық сұрақтарда жоғары нәтиже көрсетеді.",
    comprehension_score: 92,
    recent_books: [
      { id: "book-2", title: "Алтын сақа", category: "Қазақ ертегілері", progress: 100, score: 100, completed_at: "2026-10-04" },
      { id: "book-5", title: "Бала Абай", category: "Балалар әдебиеті", progress: 100, score: 85, completed_at: "2026-10-03" },
    ],
    recent_deeds: [
      { id: "deed-201", title: "Көрші қарияға дүкеннен нан әкелу", value_name: "Үлкенді сыйлау", value_emoji: "🙏", date: "2026-10-05", status: "approved", description: "Көрші әжейдің ауыр сөмкесін көтеріп, көмектесті." },
    ],
    recent_family: [
      { id: "fsub-201", week_number: 1, title: "Отбасылық кешкі оқу", date: "2026-10-02", status: "approved", text: "Атасына «Алтын сақа» ертегісінен үзінді оқып берді." },
    ],
  },
  {
    id: "std-3",
    profile_id: "student-3",
    full_name: "Мәдина Бақытбекқызы",
    avatar_emoji: "🦋",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Кітаптың досымын",
    level_badge: "📖",
    level_number: 2,
    points: 210,
    coins: 240,
    books_read: 8,
    games_completed: 4,
    good_deeds_count: 2,
    family_tasks_count: 1,
    streak_days: 5,
    last_activity: "Кеше, 18:30",
    last_active_date: "2026-10-05",
    reading_level: "орта",
    parent_name: "Бақытбек Мұратұлы",
    parent_phone: "+7 (775) 456-78-90",
    ai_summary_note: "Мәтіннің негізгі ойын анықтауда аздап қиналады, кейіпкерлерді бағалауда өте сезімтал.",
    comprehension_score: 78,
    recent_books: [
      { id: "book-1", title: "Мақта қыз бен мысық", category: "Қазақ ертегілері", progress: 100, score: 75, completed_at: "2026-10-03" },
    ],
    recent_deeds: [
      { id: "deed-301", title: "Сыныптасына оқу құралын бөлісу", value_name: "Достық", value_emoji: "🤝", date: "2026-10-04", status: "approved", description: "Қарындашы жоқ парталасына түсті фломастерлерін берді." },
    ],
    recent_family: [
      { id: "fsub-301", week_number: 1, title: "Отбасымен кітап оқу", date: "2026-10-03", status: "approved", text: "Анасымен бірге ертегіні рөлге бөліп оқыды." },
    ],
  },
  {
    id: "std-4",
    profile_id: "student-4",
    full_name: "Дәурен Серікұлы",
    avatar_emoji: "🚀",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Кітаптың досымын",
    level_badge: "📖",
    level_number: 2,
    points: 195,
    coins: 220,
    books_read: 7,
    games_completed: 4,
    good_deeds_count: 2,
    family_tasks_count: 1,
    streak_days: 4,
    last_activity: "Бүгін, 09:15",
    last_active_date: "2026-10-06",
    reading_level: "орта",
    parent_name: "Серік Аманжолұлы",
    parent_phone: "+7 (702) 345-67-89",
    ai_summary_note: "Журналдар мен комикстерді ұнатады. Оқиғалардың ретін анықтау тапсырмаларына қосымша жаттығу қажет.",
    comprehension_score: 80,
    recent_books: [
      { id: "book-8", title: "«Балдырған» журналы", category: "Балалар журналдары", progress: 100, score: 85, completed_at: "2026-10-04" },
    ],
    recent_deeds: [
      { id: "deed-401", title: "Сынып бөлмесін жинауға көмек", value_name: "Еңбекқорлық", value_emoji: "💪", date: "2026-10-05", status: "approved", description: "Тақта сүртіп, парталарды түзеді." },
    ],
    recent_family: [
      { id: "fsub-401", week_number: 1, title: "Кешкі 20 минут оқу", date: "2026-10-01", status: "approved", text: "Әкесімен журналдың қызықты беттерін бірге оқыды." },
    ],
  },
  {
    id: "std-5",
    profile_id: "student-5",
    full_name: "Айзере Мұратқызы",
    avatar_emoji: "☀️",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Белсенді оқырманмын",
    level_badge: "🌟",
    level_number: 3,
    points: 290,
    coins: 350,
    books_read: 13,
    games_completed: 6,
    good_deeds_count: 4,
    family_tasks_count: 2,
    streak_days: 8,
    last_activity: "Бүгін, 15:10",
    last_active_date: "2026-10-06",
    reading_level: "озат",
    parent_name: "Мұрат Қанатұлы",
    parent_phone: "+7 (778) 567-89-01",
    ai_summary_note: "Сыныптағы ең белсенді оқырман. Шығармашылық тапсырмалар мен рөлдік ойындарды үздік орындайды.",
    comprehension_score: 96,
    recent_books: [
      { id: "book-3", title: "Ер Төстік", category: "Қазақ ертегілері", progress: 100, score: 100, completed_at: "2026-10-05" },
    ],
    recent_deeds: [
      { id: "deed-501", title: "Кітапханаға өз кітабын сыйға тарту", value_name: "Мейірімділік", value_emoji: "❤️", date: "2026-10-06", status: "pending", description: "Мектеп кітапханасына 2 балалар ертегісін тарту етті." },
    ],
    recent_family: [
      { id: "fsub-501", week_number: 1, title: "Отбасымен оқу", date: "2026-10-02", status: "approved", text: "Анасына «Ер Төстік» ертегісін рөлмен айтып берді." },
    ],
  },
  {
    id: "std-6",
    profile_id: "student-6",
    full_name: "Санжар Болатұлы",
    avatar_emoji: "🐺",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Кітаппен таныстым",
    level_badge: "🌱",
    level_number: 1,
    points: 95,
    coins: 130,
    books_read: 4,
    games_completed: 2,
    good_deeds_count: 1,
    family_tasks_count: 1,
    streak_days: 2,
    last_activity: "3 күн бұрын",
    last_active_date: "2026-10-03",
    reading_level: "бастаушы",
    parent_name: "Болат Дәулетұлы",
    parent_phone: "+7 (707) 678-90-12",
    ai_summary_note: "Оқу жылдамдығы мен мәтінді түсінуде ұстаздың қосымша қолдауын қажет етеді. Қысқа аудио ертегілер ұсынылады.",
    comprehension_score: 64,
    recent_books: [
      { id: "book-1", title: "Мақта қыз бен мысық", category: "Қазақ ертегілері", progress: 70, score: 65, completed_at: "2026-10-02" },
    ],
    recent_deeds: [
      { id: "deed-601", title: "Үй жануарына күтім жасау", value_name: "Қамқорлық", value_emoji: "🌱", date: "2026-10-03", status: "approved", description: "Үйдегі күшікке су берді." },
    ],
    recent_family: [
      { id: "fsub-601", week_number: 1, title: "Кешкі оқу", date: "2026-10-01", status: "approved", text: "Әкесімен бірге 15 минут оқыды." },
    ],
  },
  {
    id: "std-7",
    profile_id: "student-7",
    full_name: "Нұрасыл Асқарұлы",
    avatar_emoji: "🦊",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Кітаптың досымын",
    level_badge: "📖",
    level_number: 2,
    points: 175,
    coins: 200,
    books_read: 6,
    games_completed: 3,
    good_deeds_count: 2,
    family_tasks_count: 1,
    streak_days: 3,
    last_activity: "Кеше, 16:00",
    last_active_date: "2026-10-05",
    reading_level: "орта",
    parent_name: "Асқар Ержанұлы",
    parent_phone: "+7 (771) 789-01-23",
    ai_summary_note: "Интерактивті ойындарды өте белсенді орындайды. Сөздік қорын байытуға мән беру керек.",
    comprehension_score: 76,
    recent_books: [
      { id: "book-6", title: "Шыншылдық пен әділдік", category: "Қысқа әңгімелер", progress: 100, score: 80, completed_at: "2026-10-04" },
    ],
    recent_deeds: [
      { id: "deed-701", title: "Досына шыншыл болу", value_name: "Адалдық", value_emoji: "✨", date: "2026-10-05", status: "approved", description: "Сыныптағы қателікті мойындады." },
    ],
    recent_family: [
      { id: "fsub-701", week_number: 1, title: "Бірге оқу", date: "2026-10-02", status: "approved", text: "Әжесіне ертегі айтып берді." },
    ],
  },
  {
    id: "std-8",
    profile_id: "student-8",
    full_name: "Жания Дәулетқызы",
    avatar_emoji: "🌺",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Белсенді оқырманмын",
    level_badge: "🌟",
    level_number: 3,
    points: 255,
    coins: 300,
    books_read: 10,
    games_completed: 5,
    good_deeds_count: 3,
    family_tasks_count: 2,
    streak_days: 6,
    last_activity: "Бүгін, 13:00",
    last_active_date: "2026-10-06",
    reading_level: "озат",
    parent_name: "Дәулет Жұмабайұлы",
    parent_phone: "+7 (777) 890-12-34",
    ai_summary_note: "Кейіпкерлерді талдау мен эссе жазуда өте шебер. Тұрақты кітап оқу әдеті қалыптасқан.",
    comprehension_score: 93,
    recent_books: [
      { id: "book-4", title: "Әке мен бала", category: "Балалар әдебиеті", progress: 100, score: 95, completed_at: "2026-10-05" },
    ],
    recent_deeds: [
      { id: "deed-801", title: "Үй тазалығына көмек", value_name: "Еңбекқорлық", value_emoji: "💪", date: "2026-10-06", status: "approved", description: "Өз бөлмесін мұнтаздай жинады." },
    ],
    recent_family: [
      { id: "fsub-801", week_number: 1, title: "Отбасымен оқу", date: "2026-10-03", status: "approved", text: "Әкесімен әңгіме оқып, талқылады." },
    ],
  },
  {
    id: "std-9",
    profile_id: "student-9",
    full_name: "Ерсұлтан Бауыржанұлы",
    avatar_emoji: "🦅",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Кітаптың досымын",
    level_badge: "📖",
    level_number: 2,
    points: 185,
    coins: 210,
    books_read: 7,
    games_completed: 4,
    good_deeds_count: 2,
    family_tasks_count: 1,
    streak_days: 4,
    last_activity: "Бүгін, 10:40",
    last_active_date: "2026-10-06",
    reading_level: "орта",
    parent_name: "Бауыржан Қайратұлы",
    parent_phone: "+7 (776) 234-56-78",
    ai_summary_note: "Танымдық ертегілерге қызығады. Тест сұрақтарында реттілікті анықтауда жақсы нәтиже көрсетеді.",
    comprehension_score: 82,
    recent_books: [
      { id: "book-10", title: "Ер Төстік", category: "Қазақ ертегілері", progress: 100, score: 85, completed_at: "2026-10-05" },
    ],
    recent_deeds: [
      { id: "deed-901", title: "Ауладағы ағаштарға күтім", value_name: "Табиғатты қорғау", value_emoji: "🌍", date: "2026-10-05", status: "approved", description: "Құрғаған бұтақтарды жинастырды." },
    ],
    recent_family: [
      { id: "fsub-901", week_number: 1, title: "Отбасылық оқу", date: "2026-10-02", status: "approved", text: "Әкесімен батырлар жырын оқыды." },
    ],
  },
  {
    id: "std-10",
    profile_id: "student-10",
    full_name: "Інжу Қанатқызы",
    avatar_emoji: "⭐",
    class_name: "2 «А»",
    grade_level: 2,
    level_name: "Белсенді оқырманмын",
    level_badge: "🌟",
    level_number: 3,
    points: 270,
    coins: 320,
    books_read: 11,
    games_completed: 5,
    good_deeds_count: 3,
    family_tasks_count: 2,
    streak_days: 7,
    last_activity: "Бүгін, 12:15",
    last_active_date: "2026-10-06",
    reading_level: "озат",
    parent_name: "Қанат Мұратұлы",
    parent_phone: "+7 (777) 345-67-89",
    ai_summary_note: "Мәтінді терең түсініп, кейіпкерлерге дәл баға береді. Журналдарды оқығанды жақсы көреді.",
    comprehension_score: 94,
    recent_books: [
      { id: "book-8", title: "«Балдырған» журналы", category: "Балалар журналдары", progress: 100, score: 95, completed_at: "2026-10-06" },
    ],
    recent_deeds: [
      { id: "deed-1001", title: "Анасына үй тазалауға қолғабыс", value_name: "Еңбекқорлық", value_emoji: "💪", date: "2026-10-06", status: "approved", description: "Асүйді жинауға көмектесті." },
    ],
    recent_family: [
      { id: "fsub-1001", week_number: 1, title: "20 минуттық оқу", date: "2026-10-04", status: "approved", text: "Анасымен бірге журналды талқылады." },
    ],
  },
];

export interface TeacherTaskItem {
  id: string;
  type: "reading" | "quiz" | "deed" | "family" | "content";
  title: string;
  target_class: string;
  description: string;
  deadline: string;
  points_reward: number;
  created_at: string;
  assigned_by: string;
}

export const INITIAL_TEACHER_TASKS: TeacherTaskItem[] = [
  {
    id: "ttask-1",
    type: "reading",
    title: "«Әке мен бала» әңгімесін толық оқып, түсін тестін тапсыру",
    target_class: "2 «А»",
    description: "Ыбырай Алтынсариннің әңгімесінен кейін еңбектің қадірі туралы 3 сөйлем ой қорыту.",
    deadline: "2026-10-08",
    points_reward: 20,
    created_at: "2026-10-05T09:00:00Z",
    assigned_by: "Айнұр Серікқызы",
  },
  {
    id: "ttask-2",
    type: "deed",
    title: "Табиғатты қорғау: Аула немесе сынып тазалығына үлес қосу",
    target_class: "2 «А»",
    description: "Айналаңа қамқор болып, тазалық жаса немесе гүлдерге су құй.",
    deadline: "2026-10-09",
    points_reward: 20,
    created_at: "2026-10-06T08:30:00Z",
    assigned_by: "Айнұр Серікқызы",
  },
];

const TEACHER_TASKS_KEY = "kitaptan_teacher_tasks";

export function getStoredTeacherTasks(): TeacherTaskItem[] {
  if (typeof window === "undefined") return INITIAL_TEACHER_TASKS;
  try {
    const raw = localStorage.getItem(TEACHER_TASKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_TEACHER_TASKS;
}

export function saveTeacherTask(task: Omit<TeacherTaskItem, "id" | "created_at">): TeacherTaskItem {
  const current = getStoredTeacherTasks();
  const newTask: TeacherTaskItem = {
    ...task,
    id: `ttask-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const updated = [newTask, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TEACHER_TASKS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return newTask;
}
