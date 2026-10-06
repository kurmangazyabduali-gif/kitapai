import * as React from "react";
import { Header } from "@/components/layout/Header";
import { ParentSidebar } from "@/components/layout/ParentSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["parent", "admin"]}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <ParentSidebar className="hidden lg:flex" />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-16 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
