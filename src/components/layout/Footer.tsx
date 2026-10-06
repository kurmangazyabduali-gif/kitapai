import * as React from "react";
import Link from "next/link";
import { BookOpen, Heart, Sparkles, School, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t-4 border-edu-sky-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-edu-sky-500 flex items-center justify-center text-white shadow-lg">
                <BookOpen className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Кітаптан <span className="text-edu-sky-400">–</span> жақсы іске
                </span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Бастауыш сынып EdTech платформасы
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              «Кітаптан – жақсы іске: цифрлық платформа арқылы бастауыш сынып оқушысының оқырмандық және тәрбиелік белсенділігін арттыру» ғылыми-тәжірибелік жобасының ресми білім беру платформасы.
            </p>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 inline-flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-xs font-semibold text-amber-200">
                «Әр оқылған кітап — бір жақсы әрекетке бастайды!»
              </p>
            </div>
          </div>

          {/* Formula */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-edu-sky-400">
              5-қадам формуласы
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li className="flex items-center gap-2">
                <span>📚</span> 1. ОҚЫ (Кітаппен сырлас)
              </li>
              <li className="flex items-center gap-2">
                <span>💡</span> 2. ТҮСІН (Өнегені таны)
              </li>
              <li className="flex items-center gap-2">
                <span>🎮</span> 3. ОЙНА (Білімді бекіт)
              </li>
              <li className="flex items-center gap-2">
                <span>❤️</span> 4. ЖАҚСЫ ІС ЖАСА (Әрекет ет)
              </li>
              <li className="flex items-center gap-2">
                <span>👨‍👩‍👧</span> 5. ОТБАСЫҢМЕН БӨЛІС
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
              Платформа бөлімдері
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li>
                <Link href="/#books" className="hover:text-white transition-colors">
                  Кітаптар сөресі
                </Link>
              </li>
              <li>
                <Link href="/#deeds" className="hover:text-white transition-colors">
                  Жақсы істер тақтасы
                </Link>
              </li>
              <li>
                <Link href="/#family" className="hover:text-white transition-colors">
                  Ата-аналар мен Ұстаздарға
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Оқушы кабинеті
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  Тегін тіркелу
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Pedagogy */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">
              Қауіпсіздік & Тәрбие
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Балаларға қауіпсіз орта</span>
              </div>
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-400" />
                <span>Педагогикалық сүзгіден өткен</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Қазақстан бастауыш мектептерінің бағдарламасына сәйкес жасалған.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & quote */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p>© {new Date().getFullYear()} «Кітаптан – жақсы іске». Барлық құқықтар қорғалған.</p>
          <p className="italic text-slate-400 text-center">
            «Кітап – білім бұлағы, ал жақсы іс – өмір шырағы»
          </p>
        </div>
      </div>
    </footer>
  );
}
