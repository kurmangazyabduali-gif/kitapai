import {
  MoralValue,
  MoralValueKey,
  GoodDeedTask,
  GoodDeedSubmission,
} from "@/types/database.types";

export const MORAL_VALUES: MoralValue[] = [
  {
    id: "val-1",
    key: "kindness",
    name_kk: "Мейірімділік",
    emoji: "❤️",
    color: "rose",
    bg_gradient: "from-rose-500 to-pink-600",
    prompt_kk: "Бір адамға көмектес.",
    description_kk: "Жүрегіңнің жылуымен айналаңа мейірім төк және көмекке мұқтаж жанға қол ұшын соз.",
    sample_deeds: [
      "Ауладағы немесе үйдегі кішкентай балаға ойыншығын жинауға көмектесу",
      "Көрші қарт кісіге ауыр сөмкесін көтеруге жәрдемдесу",
      "Көңілсіз отырған досыңа жылы сөз айтып, көңілін көтеру",
    ],
  },
  {
    id: "val-2",
    key: "friendship",
    name_kk: "Достық",
    emoji: "🤝",
    color: "sky",
    bg_gradient: "from-sky-500 to-blue-600",
    prompt_kk: "Сыныптасыңа жақсы сөз айт.",
    description_kk: "Адал дос болу, сыныптастарға қолдау көрсету және достықты қадірлеу.",
    sample_deeds: [
      "Сыныптасыңа бүгін жылы лебіз немесе комплимент айту",
      "Сабақта қарындашы немесе сызғышы жоқ досыңмен оқу құралыңды бөлісу",
      "Жаңадан келген оқушыны ойынға шақырып, дос болу",
    ],
  },
  {
    id: "val-3",
    key: "honesty",
    name_kk: "Адалдық",
    emoji: "✨",
    color: "yellow",
    bg_gradient: "from-amber-400 to-yellow-500",
    prompt_kk: "Әрдайым шындықты айтып, берген уәдеңде тұр.",
    description_kk: "Шыншыл болу, өз қателігіңді мойындау және сенімді серік атану.",
    sample_deeds: [
      "Мектепте немесе үйде байқаусызда бүлдіріп алған затыңды жасырмай шын айту",
      "Жолда не сыныпта тауып алған бөгде затты иесіне немесе мұғалімге тапсыру",
      "Бүгін берген уәдеңді (уақытында келу, көмектесу) бұлжытпай орындау",
    ],
  },
  {
    id: "val-4",
    key: "diligence",
    name_kk: "Еңбекқорлық",
    emoji: "💪",
    color: "amber",
    bg_gradient: "from-orange-500 to-amber-600",
    prompt_kk: "Үйдегі бір жұмысқа көмектес.",
    description_kk: "Еңбекті сүю, жалқаулықты жеңу және отбасылық шаруаларға қолғабыс ету.",
    sample_deeds: [
      "Тамақтан кейін үстелді жинап, ыдыс-аяқты жууға көмектесу",
      "Өз бөлмеңдегі төсегіңді және жазу үстеліңді ұқыпты жинап қою",
      "Анаңа киімдерді бүктеп, шкафқа реттеп салуға көмектесу",
    ],
  },
  {
    id: "val-5",
    key: "caring",
    name_kk: "Қамқорлық",
    emoji: "🌱",
    color: "green",
    bg_gradient: "from-emerald-500 to-green-600",
    prompt_kk: "Гүлге немесе жануарға күтім жаса.",
    description_kk: "Тірі табиғат пен жан-жануарларға мейіріммен қарап, қамқорлық таныту.",
    sample_deeds: [
      "Үйдегі немесе сыныптағы бөлме гүлдеріне су құйып, шаңын сүрту",
      "Ауладағы құстарға арнап жемсалғыш жасап, жем шашу",
      "Үй жануарына (мысық/ит) уақытында тамақ пен таза су беру",
    ],
  },
  {
    id: "val-6",
    key: "responsibility",
    name_kk: "Жауапкершілік",
    emoji: "🎯",
    color: "purple",
    bg_gradient: "from-purple-500 to-indigo-600",
    prompt_kk: "Өз ісің мен оқу құралдарыңа жауапты бол.",
    description_kk: "Берілген міндеттерді уақытында және сапалы орындау әдетін қалыптастыру.",
    sample_deeds: [
      "Ертеңгі күнге қажетті оқулықтар мен дәптерлерді кесте бойынша өзің жинау",
      "Үй тапсырмасын ешкімнің ескертуінсіз дер кезінде орындау",
      "Таңертең қоңырау шылдырымен өз еркіңмен оянып, төсегіңді жинау",
    ],
  },
  {
    id: "val-7",
    key: "nature_protection",
    name_kk: "Табиғатты қорғау",
    emoji: "🌍",
    color: "emerald",
    bg_gradient: "from-teal-500 to-emerald-600",
    prompt_kk: "Айналаңды таза ұстауға көмектес.",
    description_kk: "Табиғат ананы аялау, су мен энергияны үнемдеу, тазалықты сақтау.",
    sample_deeds: [
      "Аулада немесе саябақта серуендеп жүріп, қоқысты арнайы жәшікке тастау",
      "Тіс тазалаған кезде немесе қол жуғанда суды босқа ағызбай үнемдеу",
      "Қағаз бен пластик қалдықтарын бөлек сұрыптауға үлес қосу",
    ],
  },
  {
    id: "val-8",
    key: "respect_elders",
    name_kk: "Үлкенді сыйлау",
    emoji: "🙏",
    color: "coral",
    bg_gradient: "from-rose-400 to-red-500",
    prompt_kk: "Ата-әжеңе немесе ата-анаңа ізет көрсет.",
    description_kk: "Үлкендердің өмірлік ақылын тыңдау, құрмет көрсету және батасын алу.",
    sample_deeds: [
      "Ата-әжеңе ыстық шай құйып беріп, олардың көңілді әңгімесін тыңдау",
      "Қоғамдық көлікте немесе кезекте үлкен кісілерге орын беру",
      "Ата-анаңа «Рақмет!» айтып, оларға шын жүректен алғыс білдіру",
    ],
  },
  {
    id: "val-9",
    key: "creativity",
    name_kk: "Шығармашылық",
    emoji: "🎨",
    color: "purple",
    bg_gradient: "from-purple-500 to-fuchsia-600",
    prompt_kk: "Өз қолыңмен бір пайдалы зат жаса немесе сурет сал.",
    description_kk: "Қиялыңды дамыту, өнер мен қолөнер арқылы айналаңа сұлулық пен қуаныш сыйлау.",
    sample_deeds: [
      "Кітапқа арналған түрлі-түсті әдемі бетбелгі жасап, досыңа сыйлау",
      "Табиғатты қорғау тақырыбында әсерлі сурет салып, сыныпқа ілу",
      "Қалдық заттардан пайдалы ойыншық немесе қарындаш сауытын жасау",
    ],
  },
  {
    id: "val-10",
    key: "patriotism",
    name_kk: "Отансүйгіштік",
    emoji: "🇰🇿",
    color: "sky",
    bg_gradient: "from-sky-500 to-cyan-600",
    prompt_kk: "Туған жерің мен еліңе деген сүйіспеншілігіңді көрсет.",
    description_kk: "Қазақстанның тарихын, мәдениетін, мемлекеттік рәміздерін құрметтеу және туған өлкені аялау.",
    sample_deeds: [
      "Қазақстанның бір тарихи тұлғасы туралы қызықты деректі достарыңа айтып беру",
      "Мемлекеттік әнұранды немесе туған жер туралы өлеңді мәнерлеп жатқа оқу",
      "Өз мектебің мен қалаңның тазалығына үлес қосып, патриоттық сезіміңді білдіру",
    ],
  },
];

export const MOCK_GOOD_DEED_TASKS: GoodDeedTask[] = [
  {
    id: "task-1",
    book_id: "book-1",
    book_title: "Мақта қыз бен мысық",
    title: "Ауладағы құстарға немесе үй жануарына қамқорлық",
    description: "«Мақта қыз бен мысық» ертегісінен өнеге алып, үйдегі мысыққа немесе ауладағы құстарға жем беріп, суын жаңарт.",
    value_key: "caring",
    value_name_kk: "Қамқорлық",
    value_emoji: "🌱",
    points_reward: 20,
    coins_reward: 30,
    deadline_kk: "Бүгін кешке дейін",
    advice_kk: "«Жануарлар мен құстар — біздің кішкентай достарымыз. Оларға қамқор болу мейірімділікті арттырады.»",
    category: "жануарлар",
    icon: "🐱",
  },
  {
    id: "task-2",
    book_id: "book-4",
    book_title: "Әке мен бала",
    title: "Үйдегі тазалыққа көмектесу (Ата-анаға қолғабыс)",
    description: "Ыбырай Алтынсариннің «Әке мен бала» әңгімесінен ғибрат алып, үйдегі бір жұмысқа (еден сыпыру немесе гүл суғару) көмектес.",
    value_key: "diligence",
    value_name_kk: "Еңбекқорлық",
    value_emoji: "💪",
    points_reward: 20,
    coins_reward: 30,
    deadline_kk: "Ертеңге дейін",
    advice_kk: "«Аз ғана еңбектің өзі үлкен қуаныш сыйлайды. Ата-анаңның алғысы — ең үлкен марапат!»",
    category: "отбасы",
    icon: "🧹",
  },
  {
    id: "task-3",
    book_id: "book-2",
    book_title: "Алтын сақа",
    title: "Сыныптасыңа жылы сөз айтып, қолдау білдіру",
    description: "«Алтын сақа» ертегісіндегі достық пен адалдықты мысалға алып, бүгін сыныптасыңа немесе досыңа жылы комплимент айт.",
    value_key: "friendship",
    value_name_kk: "Достық",
    value_emoji: "🤝",
    points_reward: 20,
    coins_reward: 30,
    deadline_kk: "Бүгін",
    advice_kk: "«Жақсы сөз — жанға қуат. Бір ауыз жылы сөз досыңның бүкіл күнін жарқын етеді.»",
    category: "сынып",
    icon: "💬",
  },
  {
    id: "task-4",
    book_id: "book-5",
    book_title: "Бала Абай",
    title: "Ата-әжеңнің немесе үлкеннің әңгімесін тыңдап, батасын алу",
    description: "Бала Абай сияқты үлкендердің өнегелі әңгімесін ықыласпен тыңдап, үй шаруасында ізет көрсет.",
    value_key: "respect_elders",
    value_name_kk: "Үлкенді сыйлау",
    value_emoji: "🙏",
    points_reward: 20,
    coins_reward: 30,
    deadline_kk: "Осы аптада",
    advice_kk: "«Үлкенді сыйласаң — қадірлі боласың. Ата-әженің ақылы — өмірлік бағдаршам.»",
    category: "отбасы",
    icon: "👵",
  },
];

export const INITIAL_SUBMISSIONS: GoodDeedSubmission[] = [
  {
    id: "sub-1",
    student_id: "student-1",
    student_name: "Аяла Ерболқызы",
    student_avatar: "🌸",
    student_class: "3 «А»",
    deed_id: "task-1",
    book_id: "book-1",
    book_title: "Мақта қыз бен мысық",
    value_key: "caring",
    value_name_kk: "Қамқорлық",
    value_emoji: "🌱",
    title: "Ауладағы құстарға жемсалғыш жасап, жем шаштым 🐦",
    description: "«Мақта қыз бен мысық» ертегісін оқыған соң, әкеммен бірге ағашқа кішкентай жемсалғыш ілдік. Тары мен нан үгіндісін салып қойдым. Құстар жеп жатыр!",
    image_url: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&q=80&w=600",
    status: "approved",
    reviewer_type: "parent",
    reviewer_name: "Әкесі (Ербол аға)",
    reviewer_comment: "Жарайсың, қызым! Өте игі әрі үлгілі жақсы іс жасадың. Мақтанамын!",
    points_awarded: 20,
    coins_awarded: 30,
    likes_count: 5,
    created_at: "2026-10-05T14:30:00Z",
    approved_at: "2026-10-05T16:00:00Z",
  },
  {
    id: "sub-2",
    student_id: "student-1",
    student_name: "Аяла Ерболқызы",
    student_avatar: "🌸",
    student_class: "3 «А»",
    deed_id: "task-2",
    book_id: "book-4",
    book_title: "Әке мен бала",
    value_key: "diligence",
    value_name_kk: "Еңбекқорлық",
    value_emoji: "💪",
    title: "Үйдегі бөлме гүлдерін баптап, топырағын қопсыттым 🌸",
    description: "Ыбырай Алтынсариннің әңгімесінен кейін анама көмектесіп, барлық 6 гүлге су құйып, сарғайған жапырақтарын тазаладым.",
    image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600",
    status: "pending",
    reviewer_type: "parent",
    reviewer_name: "Анасы (Гүлнәр апай)",
    points_awarded: 20,
    coins_awarded: 30,
    likes_count: 2,
    created_at: "2026-10-06T11:20:00Z",
  },
];

const SUBMISSIONS_STORAGE_KEY = "kitaptan_good_deed_submissions";

/**
 * Get Submissions from LocalStorage or Initial Default
 */
export function getStoredSubmissions(): GoodDeedSubmission[] {
  if (typeof window === "undefined") return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading stored deeds:", err);
  }
  return INITIAL_SUBMISSIONS;
}

/**
 * Save new Good Deed Submission (Status = 'pending')
 */
export function submitNewGoodDeed(
  submission: Omit<GoodDeedSubmission, "id" | "created_at" | "status" | "likes_count" | "points_awarded" | "coins_awarded">
): GoodDeedSubmission {
  const current = getStoredSubmissions();
  const newRecord: GoodDeedSubmission = {
    ...submission,
    id: `sub-${Date.now()}`,
    status: "pending",
    points_awarded: 20,
    coins_awarded: 30,
    likes_count: 1,
    created_at: new Date().toISOString(),
  };

  const updated = [newRecord, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving deed submission:", err);
    }
  }
  return newRecord;
}

/**
 * Approve Good Deed by Parent or Teacher (Awards +20 XP)
 */
export function approveGoodDeedSubmission(
  submissionId: string,
  reviewerType: "parent" | "teacher" = "parent",
  reviewerName: string = "Ата-ана",
  comment: string = "Жарайсың! Өте жақсы орындалған игі іс!"
): { success: boolean; pointsAwarded: number } {
  const current = getStoredSubmissions();
  let found = false;

  const updated = current.map((sub) => {
    if (sub.id === submissionId && sub.status !== "approved") {
      found = true;
      return {
        ...sub,
        status: "approved" as const,
        reviewer_type: reviewerType,
        reviewer_name: reviewerName,
        reviewer_comment: comment,
        approved_at: new Date().toISOString(),
      };
    }
    return sub;
  });

  if (found && typeof window !== "undefined") {
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(updated));
      const targetSub = updated.find((s) => s.id === submissionId);
      if (targetSub) {
        const { recordPointsTransaction } = require("@/lib/gamification");
        recordPointsTransaction({
          student_id: targetSub.student_id || "student-1",
          action_type: "good_deed",
          source_id: submissionId,
          title: `Жақсы іс: «${targetSub.title}»`,
          description: `Ата-ана немесе ұстаз растады (${reviewerName})`,
          custom_points: 20,
          custom_coins: 30,
        });
      }
    } catch (err) {
      console.error("Error saving approved deed:", err);
    }
  }

  return {
    success: found,
    pointsAwarded: found ? 20 : 0,
  };
}
