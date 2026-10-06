"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/database.types";
import { ShieldAlert, ArrowLeft, LogIn, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isAuthenticated, isLoading, switchDemoRole } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-edu-cloud">
        <div className="text-center space-y-3">
          <div className="text-5xl animate-bounce">📚✨</div>
          <p className="font-extrabold text-slate-700">Жүйеге кіру тексерілуде...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full p-8 rounded-4xl bg-white border-3 border-rose-200 shadow-xl text-center space-y-5">
          <div className="text-5xl">🔒</div>
          <h2 className="text-2xl font-black text-slate-800">
            Кіру талап етіледі
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
            Бұл бөлімді көру үшін платформаға өз аккаунтыңызбен кіруіңіз қажет.
          </p>
          <Link href="/auth/login" className="block">
            <Button variant="yellow" size="lg" className="w-full justify-center">
              <LogIn className="w-4 h-4" />
              <span>Платформаға кіру</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isRoleAllowed = role && allowedRoles.includes(role);

  if (!isRoleAllowed) {
    const roleNames: Record<UserRole, string> = {
      student: "Оқушы 🎒",
      teacher: "Мұғалім 👩‍🏫",
      parent: "Ата-ана 👨‍👩‍👧",
      admin: "Әкімшілік 🛡️",
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-amber-50 to-purple-50">
        <div className="max-w-lg w-full p-8 rounded-4xl bg-white border-3 border-amber-300 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center text-3xl shadow-sm">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Қолжетімділік шектелген 🚫
            </h2>
            <p className="text-sm text-slate-600 font-semibold leading-relaxed">
              Сіз қазір <span className="font-extrabold text-edu-sky-600">«{roleNames[user.role]}»</span> ретінде кіріп тұрсыз.
              Бұл парақша тек <span className="font-extrabold text-amber-700">«{allowedRoles.map((r) => roleNames[r]).join(", ")}»</span> рөліне арналған.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2">
            <p className="text-xs font-black uppercase text-amber-900">
              💡 Сынақ үшін қажетті рөлге ауысыңыз:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allowedRoles.map((targetRole) => (
                <button
                  key={targetRole}
                  onClick={() => switchDemoRole(targetRole)}
                  className="p-2.5 rounded-xl bg-white border-2 border-amber-300 hover:bg-amber-100 text-xs font-extrabold text-slate-800 transition-all text-center shadow-sm active:scale-95"
                >
                  {roleNames[targetRole]} болу 🚀
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="sky"
              size="md"
              onClick={() => router.push(role ? `/${role}/dashboard` : "/")}
              className="w-full justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Өз кабинетіме оралу</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
