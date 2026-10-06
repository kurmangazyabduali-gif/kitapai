import * as React from "react";
import { Header } from "@/components/layout/Header";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["student", "admin"]}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <StudentSidebar className="hidden lg:flex" />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 overflow-y-auto">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}
