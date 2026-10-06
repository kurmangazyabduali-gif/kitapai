"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Profile, UserRole, GradeLevel } from "@/types/database.types";
import { MOCK_USERS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  register: (data: {
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
    gradeLevel?: GradeLevel;
    school?: string;
    avatarEmoji?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  getRoleDashboardUrl: (role: UserRole) => string;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function getRoleDashboardUrl(role: UserRole): string {
  switch (role) {
    case "student":
      return "/student/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "parent":
      return "/parent/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/student/dashboard";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize session from LocalStorage
  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem("kitaptan_auth_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as Profile;
        setUser(parsed);
      } else {
        // Default to demo student for interactive preview
        setUser(MOCK_USERS.student);
        localStorage.setItem("kitaptan_auth_user", JSON.stringify(MOCK_USERS.student));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
      setUser(MOCK_USERS.student);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password?: string,
    selectedRole?: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Find matching mock user by role or email
      let targetUser = selectedRole ? MOCK_USERS[selectedRole] : null;
      if (!targetUser) {
        targetUser =
          Object.values(MOCK_USERS).find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          ) || MOCK_USERS.student;
      }

      setUser(targetUser);
      localStorage.setItem("kitaptan_auth_user", JSON.stringify(targetUser));
      document.cookie = `kitaptan_role=${targetUser.role}; path=/; max-age=86400`;

      // Redirect to specific role dashboard
      const dashboardUrl = getRoleDashboardUrl(targetUser.role);
      router.push(dashboardUrl);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
    gradeLevel?: GradeLevel;
    school?: string;
    avatarEmoji?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser: Profile = {
        id: `user-${Date.now()}`,
        email: data.email,
        full_name: data.fullName,
        role: data.role,
        grade_level: data.gradeLevel || (data.role === "student" ? 2 : undefined),
        school: data.school || "№84 мектеп-лицейі",
        avatar_emoji: data.avatarEmoji || (data.role === "student" ? "🦁" : "👤"),
        coins: 100, // Welcome bonus
        stars: 50,
        streak_days: 1,
        total_books_read: 0,
        total_deeds_done: 0,
        created_at: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem("kitaptan_auth_user", JSON.stringify(newUser));
      document.cookie = `kitaptan_role=${newUser.role}; path=/; max-age=86400`;

      const dashboardUrl = getRoleDashboardUrl(newUser.role);
      router.push(dashboardUrl);
      return true;
    } catch (err) {
      console.error("Registration failed", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("kitaptan_auth_user");
      document.cookie = "kitaptan_role=; path=/; max-age=0";
      setUser(null);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const demoUser = MOCK_USERS[targetRole];
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem("kitaptan_auth_user", JSON.stringify(demoUser));
      document.cookie = `kitaptan_role=${demoUser.role}; path=/; max-age=86400`;
      router.push(getRoleDashboardUrl(targetRole));
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    return true;
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        forgotPassword,
        resetPassword,
        getRoleDashboardUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
