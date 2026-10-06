import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleSwitcherBar } from "@/components/layout/RoleSwitcherBar";
import { RewardToastListener } from "@/components/gamification/reward-toast-listener";

export const metadata: Metadata = {
  title: "«Кітаптан – жақсы іске» | Бастауыш сынып EdTech платформасы",
  description:
    "Цифрлық платформа арқылы бастауыш сынып оқушысының оқырмандық және тәрбиелік белсенділігін арттыру. ОҚЫ → ТҮСІН → ОЙНА → ЖАҚСЫ ІС ЖАСА → ОТБАСЫҢМЕН БӨЛІС.",
  keywords: [
    "Кітаптан жақсы іске",
    "EdTech",
    "бастауыш сынып",
    "қазақша кітаптар",
    "тәрбие",
    "оқырмандық мәдениет",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-edu-cloud text-slate-900 selection:bg-edu-yellow-200">
        <AuthProvider>
          <RoleSwitcherBar />
          {children}
          <RewardToastListener />
        </AuthProvider>
      </body>
    </html>
  );
}

