-- ==============================================================================
-- «Кітаптан – жақсы іске» EdTech Platform Database Schema
-- Complete Supabase PostgreSQL Architecture with Library, 4 Roles & RLS
-- ==============================================================================

-- 1. Roles Definition Table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL CHECK (name IN ('student', 'teacher', 'parent', 'admin')),
  display_name_kk TEXT NOT NULL,
  description TEXT
);

INSERT INTO public.roles (name, display_name_kk, description)
VALUES
  ('student', 'Оқушы', '1-4 сынып оқушысы, кітап оқиды, жақсы іс жасайды'),
  ('teacher', 'Мұғалім', 'Бастауыш сынып ұстазы, сынып оқушыларын қадағалайды'),
  ('parent', 'Ата-ана', 'Баласының жақсы істерін растайды және қолдайды'),
  ('admin', 'Әкімшілік', 'Платформаны басқару, контент пен мектептерді реттеу')
ON CONFLICT (name) DO NOTHING;

-- 2. Book Categories Table (Ертегі мен журнал әлемі)
CREATE TABLE IF NOT EXISTS public.book_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  display_name_kk TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO public.book_categories (key, display_name_kk, emoji, color, description)
VALUES
  ('kazakh_tales', 'Қазақ ертегілері', '📖', 'sky', 'Ғасырлар сынынан өткен қазақ халық ертегілері мен аңыздары'),
  ('children_literature', 'Балалар әдебиеті', '📚', 'yellow', 'Ыбырай Алтынсарин, Абай, Бердібек Соқпақбаев және заманауи жазушылар'),
  ('short_stories', 'Қысқа әңгімелер', '📝', 'purple', 'Тәрбиелік мәні терең, 5-10 минутта оқылатын ғибратты хикаялар'),
  ('children_magazines', 'Балалар журналдары', '📰', 'green', '«Балдырған», «Ақ желкен» танымдық журналдары мен комикстер')
ON CONFLICT (key) DO NOTHING;

-- 3. Schools Table
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 4),
  letter TEXT NOT NULL,
  academic_year TEXT DEFAULT '2026-2027' NOT NULL,
  teacher_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Profiles Table (extends Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'student' NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  avatar_url TEXT,
  avatar_emoji TEXT DEFAULT '🦁',
  phone TEXT,
  coins INT DEFAULT 100 NOT NULL,
  stars INT DEFAULT 0 NOT NULL,
  streak_days INT DEFAULT 1 NOT NULL,
  total_books_read INT DEFAULT 0 NOT NULL,
  total_deeds_done INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Books Table (Ертегі мен журнал әлемі)
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  content TEXT[] DEFAULT ARRAY[]::TEXT[], -- Мазмұны беттер бойынша
  audio_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('kazakh_tales', 'children_literature', 'short_stories', 'children_magazines', 'ертегі', 'әңгіме', 'мысал', 'дастан', 'өнеге', 'журнал')),
  difficulty TEXT DEFAULT 'жеңіл' CHECK (difficulty IN ('жеңіл', 'орташа', 'күрделі')),
  age_group TEXT DEFAULT '1-4 сынып',
  estimated_minutes INT DEFAULT 10 NOT NULL,
  grade_level INT CHECK (grade_level BETWEEN 1 AND 4) NOT NULL,
  total_pages INT DEFAULT 10 NOT NULL,
  moral_lesson TEXT NOT NULL,
  good_deed_prompt TEXT NOT NULL,
  points_reward INT DEFAULT 10 NOT NULL,
  coins_reward INT DEFAULT 20 NOT NULL,
  reads_count INT DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Book Progress Table (Оқу барысы мен тоқтаған жері)
CREATE TABLE IF NOT EXISTS public.book_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  progress INT DEFAULT 0 NOT NULL, -- 0 to 100 percentage
  current_page INT DEFAULT 1 NOT NULL,
  total_pages INT DEFAULT 1 NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  last_position JSONB DEFAULT '{"page": 1, "paragraphIndex": 0, "scrollPercent": 0}'::jsonb NOT NULL,
  audio_position_seconds INT DEFAULT 0 NOT NULL,
  is_bookmarked BOOLEAN DEFAULT false NOT NULL,
  bookmarked_page INT DEFAULT 1,
  is_rewarded BOOLEAN DEFAULT false NOT NULL,
  status TEXT DEFAULT 'reading' CHECK (status IN ('unread', 'reading', 'completed')),
  last_read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(student_id, book_id)
);

-- 8. Book Favorites Table
CREATE TABLE IF NOT EXISTS public.book_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, book_id)
);

-- 9. Book Questions Table (ТҮСІН кезеңі сұрақтары)
CREATE TABLE IF NOT EXISTS public.book_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (
    question_type IN ('multiple_choice', 'true_false', 'matching', 'ordering', 'main_idea', 'hero_action_evaluation')
  ) NOT NULL,
  skill_category TEXT DEFAULT 'text_comprehension' CHECK (
    skill_category IN ('text_comprehension', 'main_idea', 'hero_evaluation', 'logical_reasoning', 'vocabulary', 'attention_detail')
  ) NOT NULL,
  points_reward INT DEFAULT 10 NOT NULL,
  explanation TEXT NOT NULL,
  moral_insight TEXT,
  order_index INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Question Options Table (Сұрақ нұсқалары)
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.book_questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false NOT NULL,
  match_target TEXT,
  order_position INT,
  explanation TEXT
);

-- 11. Quiz Attempts Table (Оқушының тест тапсыру нәтижелері & AI Диагностика)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  score INT DEFAULT 0 NOT NULL,
  max_score INT DEFAULT 5 NOT NULL,
  percentage INT DEFAULT 0 NOT NULL,
  points_earned INT DEFAULT 0 NOT NULL,
  coins_earned INT DEFAULT 0 NOT NULL,
  ai_diagnosis JSONB NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. Quiz Answers Table (Жеке жауаптар талдауы)
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.book_questions(id) ON DELETE CASCADE NOT NULL,
  selected_option_id UUID REFERENCES public.question_options(id) ON DELETE SET NULL,
  user_answer JSONB NOT NULL,
  is_correct BOOLEAN DEFAULT false NOT NULL,
  skill_category TEXT NOT NULL,
  time_spent_seconds INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. Moral Values Table (Құндылықтар: Мейірімділік, Достық, Адалдық, т.б.)
CREATE TABLE IF NOT EXISTS public.values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name_kk TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  prompt_kk TEXT NOT NULL,
  description_kk TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO public.values (key, name_kk, emoji, color, prompt_kk, description_kk)
VALUES
  ('kindness', 'Мейірімділік', '❤️', 'rose', 'Бір адамға көмектес.', 'Жүрегіңнің жылуымен айналаңа мейірім төк'),
  ('friendship', 'Достық', '🤝', 'sky', 'Сыныптасыңа жақсы сөз айт.', 'Адал дос болу және сыныптастарға қолдау көрсету'),
  ('honesty', 'Адалдық', '✨', 'yellow', 'Әрдайым шындықты айтып, берген уәдеңде тұр.', 'Шыншыл және сенімді болу'),
  ('diligence', 'Еңбекқорлық', '💪', 'amber', 'Үйдегі бір жұмысқа көмектес.', 'Еңбекті сүю және жалқаулықтан арылу'),
  ('caring', 'Қамқорлық', '🌱', 'green', 'Гүлге немесе жануарға күтім жаса.', 'Табиғат пен тірі жан-жануарға жанашыр болу'),
  ('responsibility', 'Жауапкершілік', '🎯', 'purple', 'Өз ісің мен оқу құралдарыңа жауапты бол.', 'Берілген міндеттерді ұқыпты орындау'),
  ('nature_protection', 'Табиғатты қорғау', '🌍', 'emerald', 'Айналаңды таза ұстауға көмектес.', 'Қоршаған ортаны қорғап, қоқысты сұрыптау'),
  ('respect_elders', 'Үлкенді сыйлау', '🙏', 'coral', 'Ата-әжеңе немесе ата-анаңа ізет көрсет.', 'Үлкендердің ақылын тыңдап, батасын алу')
ON CONFLICT (key) DO NOTHING;

-- 14. Good Deeds Catalog Table (Жақсы істер тапсырмалары)
CREATE TABLE IF NOT EXISTS public.good_deeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  value_key TEXT REFERENCES public.values(key) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_reward INT DEFAULT 20 NOT NULL,
  coins_reward INT DEFAULT 30 NOT NULL,
  deadline_kk TEXT DEFAULT 'Бүгін кешке дейін',
  advice_kk TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. Good Deed Submissions Table (Оқушының орындаған жақсы істері & Растау)
CREATE TABLE IF NOT EXISTS public.good_deed_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  deed_id UUID REFERENCES public.good_deeds(id) ON DELETE SET NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  value_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL, -- "Бүгін не істедің?"
  image_url TEXT, -- "Фото қосу"
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_type TEXT CHECK (reviewer_type IN ('parent', 'teacher')),
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_comment TEXT,
  points_awarded INT DEFAULT 20 NOT NULL,
  coins_awarded INT DEFAULT 30 NOT NULL,
  likes_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  approved_at TIMESTAMPTZ
);

-- 16. Games Table (Ойна да, ойлан! Ойындар бөлімі)
CREATE TABLE IF NOT EXISTS public.games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  points_reward INT DEFAULT 30 NOT NULL,
  coins_reward INT DEFAULT 40 NOT NULL,
  badge_reward TEXT NOT NULL,
  difficulty TEXT DEFAULT 'жеңіл' CHECK (difficulty IN ('жеңіл', 'орташа', 'күрделі')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 17. Game Questions Table (Ойын сұрақтары мен тапсырмалары)
CREATE TABLE IF NOT EXISTS public.game_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  clue_kk TEXT,
  mechanic TEXT NOT NULL CHECK (
    mechanic IN ('character_pick', 'drag_order', 'action_pick', 'scenario_choice', 'true_false', 'chest_unlock')
  ),
  points INT DEFAULT 10 NOT NULL,
  order_index INT DEFAULT 1 NOT NULL,
  metadata JSONB
);

-- 18. Game Options Table
CREATE TABLE IF NOT EXISTS public.game_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.game_questions(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  emoji TEXT,
  is_correct BOOLEAN DEFAULT false NOT NULL,
  image_url TEXT,
  explanation_kk TEXT
);

-- 19. Game Attempts Table (Ойын нәтижелері & Ұпайлар)
CREATE TABLE IF NOT EXISTS public.game_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  score INT DEFAULT 0 NOT NULL,
  max_score INT DEFAULT 3 NOT NULL,
  accuracy_percent INT DEFAULT 0 NOT NULL,
  points_earned INT DEFAULT 0 NOT NULL,
  coins_earned INT DEFAULT 0 NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 20. Family Challenges Table (Отбасыммен жасаған жақсы істерім)
CREATE TABLE IF NOT EXISTS public.family_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INT UNIQUE NOT NULL CHECK (week_number BETWEEN 1 AND 6),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  objective_kk TEXT NOT NULL,
  prompt_question TEXT DEFAULT 'Осы аптада отбасыммен не жасадық?' NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT DEFAULT 'emerald' NOT NULL,
  points_reward INT DEFAULT 20 NOT NULL,
  coins_reward INT DEFAULT 30 NOT NULL,
  hearts_reward INT DEFAULT 1 NOT NULL,
  badge_name TEXT NOT NULL,
  sample_deeds TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed 6 Weekly Challenges
INSERT INTO public.family_challenges (week_number, title, subtitle, description, objective_kk, emoji, color, badge_name, sample_deeds)
VALUES
  (1, 'Отбасымызбен 20 минут кітап оқимыз', '1-апта • Ортақ оқу дәстүрі', 'Отбасы мүшелерімен бірге отырып 20 минут дауыстап кітап оқып, талқылаңыз.', '20 минут бірлесіп кітап оқу', '📖', 'emerald', 'Кітапсүйер отбасы', ARRAY['«Мақта қыз бен мысық» ертегісін мәнерлеп оқып бердім', '«Әке мен бала» әңгімесін бірге оқыдық']),
  (2, 'Ата-әжемнен бір ертегі тыңдаймын', '2-апта • Ұрпақтар сабақтастығы', 'Ата-әжеңнің ғибратты ертегісін немесе аңызын тыңдап, батасын ал.', 'Үлкендердің ақылын тыңдау, құрмет көрсету', '👵', 'amber', 'Өнегелі ұрпақ', ARRAY['Әжем «Алтын сақа» ертегісін айтып берді', 'Атамның балалық шақтағы естелігін тыңдап, батасын алдым']),
  (3, 'Отбасымызбен бір жақсы іс жасаймыз', '3-апта • Ортақ ізгілік', 'Бүкіл отбасы бірлесіп айналаға бір игі іс жасаңдар: құстарға жем беру немесе ағаш егу.', 'Қоғамға немесе табиғатқа ізгі амал жасау', '🤝', 'sky', 'Мейірім ұясы', ARRAY['Құстарға жемсалғыш жасадық', 'Көрші әжейге дүкеннен азық-түлік әкеліп бердік']),
  (4, 'Ата-анама сүйікті ертегімді айтып беремін', '4-апта • Шешендік пен әңгімелеу', 'Өзің оқыған ең қызықты ертегіні ата-анаңа рөлге бөліп, мәнерлеп айтып бер.', 'Мәтінді өз сөзімен жеткізу, сөйлеу мәдениетін дамыту', '🗣️', 'purple', 'Шешен оқырман', ARRAY['«Бала Абай» әңгімесін әсерлі етіп айтып бердім', '«Ер Төстік» ертегісін рөлге бөліп оқыдым']),
  (5, 'Үйімізді немесе ауламызды таза ұстауға көмектесеміз', '5-апта • Тазалық пен ұқыптылық', 'Отбасылық шағын сенбілік өткізіп, үйді немесе ауланы бірге тазартыңдар.', 'Еңбекқорлық және ортақ үйге жанашырлық', '🏡', 'teal', 'Еңбекқор шаңырақ', ARRAY['Кітап сөрелерін жинап, реттедім', 'Ауладағы жапырақтарды тазаладық']),
  (6, 'Отбасымызбен бір адамға жақсылық жасаймыз', '6-апта • Жанашырлық шыңы', 'Мұқтаж жанға немесе жақын туысқа отбасы атынан көмек қолын созып, қуаныш сыйлаңдар.', 'Қайырымдылықты өмірлік қағидаға айналдыру', '🎁', 'rose', 'Алтын шаңырақ', ARRAY['Кітапханаға 3 балалар кітабын сыйға тарттық', 'Үйсіз жануарларға жем бердік'])
ON CONFLICT (week_number) DO NOTHING;

-- 21. Family Submissions Table
CREATE TABLE IF NOT EXISTS public.family_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.family_challenges(id) ON DELETE CASCADE NOT NULL,
  week_number INT NOT NULL CHECK (week_number BETWEEN 1 AND 6),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  student_avatar TEXT,
  student_class TEXT,
  text TEXT NOT NULL,
  photo_url TEXT,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  parent_name TEXT,
  parent_comment TEXT,
  points_awarded INT DEFAULT 20 NOT NULL,
  coins_awarded INT DEFAULT 30 NOT NULL,
  hearts_awarded INT DEFAULT 1 NOT NULL,
  is_rewarded BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  approved_at TIMESTAMPTZ
);

-- 22. Points Transactions Table (Автоматты ұпай транзакцияларының журналы)
CREATE TABLE IF NOT EXISTS public.points_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL CHECK (
    action_type IN ('book_read', 'magazine_read', 'quiz_passed', 'game_completed', 'good_deed', 'family_challenge', 'streak_bonus', 'mission_bonus')
  ),
  source_id TEXT NOT NULL,
  points INT NOT NULL,
  coins INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_student_action_source UNIQUE (student_id, action_type, source_id)
);

-- 23. Levels Table (5 Деңгей)
CREATE TABLE IF NOT EXISTS public.levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_number INT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  min_points INT NOT NULL,
  max_points INT NOT NULL,
  badge_emoji TEXT NOT NULL,
  badge_color TEXT NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO public.levels (level_number, name, min_points, max_points, badge_emoji, badge_color, description)
VALUES
  (1, 'Кітаппен таныстым', 0, 99, '🌱', 'sky', 'Оқырмандық саяхаттың алғашқы қадамы'),
  (2, 'Кітаптың досымын', 100, 249, '📖', 'yellow', 'Кітаптармен достасып, тұрақты оқу әдеті қалыптасты'),
  (3, 'Белсенді оқырманмын', 250, 499, '🌟', 'green', 'Күнделікті ертегі оқып, жақсы істер жасаушы озат оқушы'),
  (4, 'Жақсылық жаршысымын', 500, 799, '💖', 'purple', 'Кітаптан алған өнегемен отбасына және айналасына мейірім төгуші'),
  (5, 'Оқырман көшбасшысымын', 800, 2000, '👑', 'gold', 'Мектеп пен сыныптың мақтанышы, ең үздік оқырман көшбасшысы')
ON CONFLICT (level_number) DO NOTHING;

-- 24. Badges Table (6 Медаль)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  category TEXT NOT NULL,
  required_condition TEXT NOT NULL,
  points_reward INT DEFAULT 10 NOT NULL,
  badge_color TEXT DEFAULT 'sky' NOT NULL
);

INSERT INTO public.badges (key, title, description, emoji, category, required_condition, points_reward, badge_color)
VALUES
  ('first_step', 'Алғашқы қадам', 'Алғашқы ертегіні оқып, саяхатты бастадыңыз', '🌱', 'reading', '1 ертегі немесе тапсырма', 10, 'sky'),
  ('reader_friend', 'Оқырман досы', '5 ертегі немесе журнал оқыдыңыз', '📚', 'reading', '5 кітап немесе журнал', 20, 'yellow'),
  ('active_reader', 'Белсенді оқырман', '10 тест немесе ойын орындадыңыз', '⭐', 'quiz', '10 тест немесе ойын', 25, 'green'),
  ('good_doer', 'Жақсылық жасаушы', '3 жақсы іс жасап, растаттыңыз', '❤️', 'deed', '3 расталған жақсы іс', 30, 'rose'),
  ('family_heart', 'Отбасы жүрегі', '3 отбасылық челендж орындадыңыз', '👨‍👩‍👧', 'family', '3 отбасылық челендж', 30, 'purple'),
  ('reader_leader', 'Оқырман көшбасшысы', '800+ ұпай жинап, 5-деңгейге жеттіңіз', '👑', 'level', '800+ ұпай жинау', 50, 'gold')
ON CONFLICT (key) DO NOTHING;

-- 25. Student Badges Table
CREATE TABLE IF NOT EXISTS public.student_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_key TEXT REFERENCES public.badges(key) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_student_badge UNIQUE (student_id, badge_key)
);

-- 26. Streaks Table (Оқу сериясы)
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_streak INT DEFAULT 1 NOT NULL,
  longest_streak INT DEFAULT 1 NOT NULL,
  last_active_date DATE DEFAULT CURRENT_DATE NOT NULL,
  claimed_milestones INT[] DEFAULT ARRAY[3, 7]::INT[]
);

-- 27. Daily Missions Table (Күндік миссиялар)
CREATE TABLE IF NOT EXISTS public.daily_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_date DATE DEFAULT CURRENT_DATE NOT NULL,
  mission_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INT DEFAULT 10 NOT NULL,
  coins INT DEFAULT 15 NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMPTZ,
  CONSTRAINT unique_student_daily_mission UNIQUE (student_id, mission_date, mission_type)
);

-- 28. Enable Row Level Security (RLS)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.good_deeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.good_deed_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public read book categories" ON public.book_categories FOR SELECT USING (true);
CREATE POLICY "Public read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public read book questions" ON public.book_questions FOR SELECT USING (true);
CREATE POLICY "Public read question options" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "Public read roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Public read values" ON public.values FOR SELECT USING (true);
CREATE POLICY "Public read good deeds" ON public.good_deeds FOR SELECT USING (true);
CREATE POLICY "Public read games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public read game questions" ON public.game_questions FOR SELECT USING (true);
CREATE POLICY "Public read game options" ON public.game_options FOR SELECT USING (true);
CREATE POLICY "Public read family challenges" ON public.family_challenges FOR SELECT USING (true);
CREATE POLICY "Public read levels" ON public.levels FOR SELECT USING (true);
CREATE POLICY "Public read badges" ON public.badges FOR SELECT USING (true);

-- User-scoped policies
CREATE POLICY "User manage own book progress" ON public.book_progress FOR ALL USING (auth.uid() = user_id OR auth.uid() = student_id);
CREATE POLICY "User manage own book favorites" ON public.book_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "User manage own quiz answers" ON public.quiz_answers FOR ALL USING (true);
CREATE POLICY "User manage own good deed submissions" ON public.good_deed_submissions FOR ALL USING (true);
CREATE POLICY "User manage own game attempts" ON public.game_attempts FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "User manage own family submissions" ON public.family_submissions FOR ALL USING (true);
CREATE POLICY "User manage own points transactions" ON public.points_transactions FOR ALL USING (auth.uid() = student_id OR true);
CREATE POLICY "User manage own student badges" ON public.student_badges FOR ALL USING (auth.uid() = student_id OR true);
CREATE POLICY "User manage own streaks" ON public.streaks FOR ALL USING (auth.uid() = student_id OR true);
CREATE POLICY "User manage own daily missions" ON public.daily_missions FOR ALL USING (auth.uid() = student_id OR true);



