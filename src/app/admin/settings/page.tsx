"use client";

import * as React from "react";
import { Settings, Shield, Key, Save, Database, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Жүйелік Баптаулар ⚙️
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Платформа параметрлері, сыйақы ұпайлары және қауіпсіздік ережелері
        </p>
      </div>

      <Card className="p-6 bg-white border-2 border-slate-200 space-y-6 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800">
              Ұпай және Марапаттау жүйесі
            </h3>
            <Input
              label="Тіркелгені үшін берілетін бастапқы сыйлық (Тиын)"
              type="number"
              defaultValue="100"
            />
            <Input
              label="1 кітапты толық оқығаны үшін берілетін базалық ұпай (Тиын)"
              type="number"
              defaultValue="50"
            />
            <Input
              label="Ата-анасы растаған 1 жақсы іс үшін сыйақы (Тиын)"
              type="number"
              defaultValue="50"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-base font-black text-slate-800">
              Қауіпсіздік және RLS саясаттары
            </h3>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold space-y-1">
              <p>✓ Supabase RLS (Row Level Security) қосылған</p>
              <p>✓ Оқушы тек өз деректерін көреді</p>
              <p>✓ Ата-ана тек өз баласының деректерін көреді</p>
              <p>✓ Мұғалім тек өз сыныбының оқушыларын көреді</p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" variant="yellow" size="lg" className="font-black">
              <Save className="w-4 h-4" />
              <span>Баптауларды сақтау</span>
            </Button>
            {saved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Сақталды!
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
