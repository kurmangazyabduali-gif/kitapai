"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Users, BookOpen, Heart, School } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Жалпы Платформа Аналитикасы 📈
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Республикалық көлемдегі оқырмандық белсенділік пен тәрбиелік нәтижелер
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
          <h3 className="text-base font-black text-slate-800">
            Өңірлер бойынша белсенділік
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Астана қаласы</span>
                <span>420 оқушы (34%)</span>
              </div>
              <Progress value={34} variant="sky" height="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Алматы қаласы</span>
                <span>380 оқушы (30%)</span>
              </div>
              <Progress value={30} variant="yellow" height="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Шымкент қаласы</span>
                <span>240 оқушы (19%)</span>
              </div>
              <Progress value={19} variant="green" height="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Басқа облыстар</span>
                <span>205 оқушы (17%)</span>
              </div>
              <Progress value={17} variant="purple" height="sm" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-2 border-slate-200 space-y-4">
          <h3 className="text-base font-black text-slate-800">
            Сыныптар бойынша оқу көрсеткіші
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>1-сынып оқушылары</span>
                <span>310 оқушы</span>
              </div>
              <Progress value={25} variant="yellow" height="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>2-сынып оқушылары</span>
                <span>345 оқушы</span>
              </div>
              <Progress value={28} variant="sky" height="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>3-сынып оқушылары</span>
                <span>390 оқушы</span>
              </div>
              <Progress value={31} variant="green" height="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>4-сынып оқушылары</span>
                <span>200 оқушы</span>
              </div>
              <Progress value={16} variant="purple" height="sm" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
