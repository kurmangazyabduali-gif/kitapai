"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import { User, Award, Sparkles, School, Flame, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_ACHIEVEMENTS } from "@/lib/mock-data";

const MASCOTS = [
  { emoji: "🦁", name: "Батыл Арыстан" },
  { emoji: "🦊", name: "Тапқыр Түлкі" },
  { emoji: "🦅", name: "Қыран Бүркіт" },
  { emoji: "🐻", name: "Мейірімді Қонжық" },
  { emoji: "🦄", name: "Жүйрік Тұлпар" },
  { emoji: "🦉", name: "Ақылды Үкі" },
];

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = React.useState(user?.avatar_emoji || "🦁");
  const [saved, setSaved] = React.useState(false);

  const handleSaveMascot = (emoji: string) => {
    setSelectedEmoji(emoji);
    confetti({ particleCount: 60, spread: 50 });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <Card className="p-6 sm:p-8 bg-white border-3 border-edu-sky-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <Avatar
            emoji={selectedEmoji}
            name={user?.full_name || "Алихан Сұлтан"}
            size="2xl"
            borderVariant="gold"
            showLevelBadge
            level={user?.grade_level || 3}
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="sky" size="md">
                {user?.grade_level || 3}-сынып оқушысы
              </Badge>
              <Badge variant="yellow" size="md">
                Озат оқырман 🌟
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {user?.full_name || "Алихан Сұлтан"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-bold flex items-center justify-center sm:justify-start gap-1.5">
              <School className="w-4 h-4 text-edu-sky-600" />
              <span>{user?.school || "№84 мектеп-лицейі, Астана"}</span>
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-200 text-center space-y-1">
            <span className="text-3xl">🪙</span>
            <p className="text-xl font-black text-amber-900">
              {user?.coins || 340}
            </p>
            <p className="text-[10px] font-black text-amber-700 uppercase">
              Алтын тиын
            </p>
          </div>
        </div>
      </Card>

      {/* Mascot Chooser */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800">
            Өз маскот-кейіпкеріңді таңда:
          </h3>
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Сақталды!
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {MASCOTS.map((m) => (
            <button
              key={m.emoji}
              onClick={() => handleSaveMascot(m.emoji)}
              className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center space-y-1 ${
                selectedEmoji === m.emoji
                  ? "border-amber-400 bg-amber-100 ring-2 ring-amber-300 scale-105 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <span className="text-4xl">{m.emoji}</span>
              <span className="text-[10px] font-extrabold text-slate-700">
                {m.name}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Badges / Achievements Collection */}
      <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <h3 className="text-lg font-black text-slate-800">
            Барлық марапаттар мен белгілер ({MOCK_ACHIEVEMENTS.filter((a) => a.unlocked).length} / {MOCK_ACHIEVEMENTS.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
                ach.unlocked
                  ? "bg-amber-50/50 border-amber-200"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <span className="text-4xl">{ach.emoji}</span>
              <div>
                <h4 className="text-xs font-black text-slate-800">
                  {ach.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {ach.description}
                </p>
                <span className="text-[10px] font-bold text-edu-sky-700">
                  {ach.unlocked ? "✓ Ашылды" : `Тапсырма: ${ach.required_action}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
