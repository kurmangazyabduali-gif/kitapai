"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import {
  Users,
  Search,
  Plus,
  Filter,
  ShieldCheck,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { UserRole, Profile } from "@/types/database.types";
import {
  getAdminUsersList,
  saveAdminUser,
  deleteAdminUser,
} from "@/lib/admin-data";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [selectedRole, setSelectedRole] = React.useState<UserRole | "all">("all");
  const [search, setSearch] = React.useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<Profile | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Profile | null>(null);

  // Form
  const [formName, setFormName] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formRole, setFormRole] = React.useState<UserRole>("student");
  const [formSchool, setFormSchool] = React.useState("№84 мектеп-лицейі");
  const [formClass, setFormClass] = React.useState("3 «А»");

  const reloadUsers = React.useCallback(() => {
    setUsers(getAdminUsersList());
  }, []);

  React.useEffect(() => {
    reloadUsers();
  }, [reloadUsers]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRole("student");
    setFormSchool("№84 мектеп-лицейі");
    setFormClass("3 «А»");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: Profile) => {
    setEditingUser(user);
    setFormName(user.full_name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormSchool(user.school || "№84 мектеп-лицейі");
    setFormClass(user.class_name || "3 «А»");
    setIsAddModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 50, spread: 60 });

    saveAdminUser({
      id: editingUser ? editingUser.id : undefined,
      full_name: formName,
      email: formEmail,
      role: formRole,
      school: formSchool,
      class_name: formClass,
      coins: editingUser ? editingUser.coins : formRole === "student" ? 200 : 500,
      stars: editingUser ? editingUser.stars : formRole === "student" ? 150 : 3000,
      streak_days: editingUser ? editingUser.streak_days : 1,
      total_books_read: editingUser ? editingUser.total_books_read : 0,
      total_deeds_done: editingUser ? editingUser.total_deeds_done : 0,
      avatar_emoji:
        formRole === "student"
          ? "🦁"
          : formRole === "teacher"
          ? "👩‍🏫"
          : formRole === "parent"
          ? "👨‍👩‍👧"
          : "🛡️",
    });

    setIsAddModalOpen(false);
    reloadUsers();
  };

  const handleDeleteUser = () => {
    if (deleteTarget) {
      deleteAdminUser(deleteTarget.id);
      setDeleteTarget(null);
      reloadUsers();
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = selectedRole === "all" || u.role === selectedRole;
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.class_name && u.class_name.toLowerCase().includes(search.toLowerCase()));
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Пайдаланушыларды басқару 👥
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Оқушылар ({users.filter((u) => u.role === "student").length}), Мұғалімдер ({users.filter((u) => u.role === "teacher").length}), Ата-аналар ({users.filter((u) => u.role === "parent").length}) мен Әкімшілер ({users.filter((u) => u.role === "admin").length})
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="sky" size="md" className="font-extrabold shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Жаңа пайдаланушы қосу</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Аты немесе Email бойынша іздеу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border-2 border-slate-200 bg-white text-xs font-semibold focus:border-edu-sky-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedRole("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedRole === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Барлығы ({users.length})
          </button>
          {(["student", "teacher", "parent", "admin"] as UserRole[]).map((r) => {
            const count = users.filter((u) => u.role === r).length;
            return (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedRole === r
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {r === "student"
                  ? `🎒 Оқушы (${count})`
                  : r === "teacher"
                  ? `👩‍🏫 Мұғалім (${count})`
                  : r === "parent"
                  ? `👨‍👩‍👧 Ата-ана (${count})`
                  : `🛡️ Әкімші (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table / Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          emoji="👥"
          title="Пайдаланушы табылмады"
          description="Іздеу сөзін немесе сүзгіні өзгертіп көріңіз."
          actionText="Барлығын көрсету"
          onAction={() => {
            setSearch("");
            setSelectedRole("all");
          }}
        />
      ) : (
        <Card className="p-0 overflow-hidden bg-white border-2 border-slate-200 shadow-kid-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
                <tr>
                  <th className="p-4">Аты-жөні</th>
                  <th className="p-4">Рөлі</th>
                  <th className="p-4">Мектеп / Сынып</th>
                  <th className="p-4">Ұпайы / Монета</th>
                  <th className="p-4">Күйі</th>
                  <th className="p-4 text-right">Әрекеттер</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar emoji={u.avatar_emoji || "👤"} name={u.full_name} size="sm" />
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">
                            {u.full_name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          u.role === "student"
                            ? "yellow"
                            : u.role === "teacher"
                            ? "sky"
                            : u.role === "parent"
                            ? "purple"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {u.role === "student"
                          ? "🎒 Оқушы"
                          : u.role === "teacher"
                          ? "👩‍🏫 Мұғалім"
                          : u.role === "parent"
                          ? "👨‍👩‍👧 Ата-ана"
                          : "🛡️ Әкімші"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>{u.school}</div>
                      {u.class_name && (
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {u.class_name}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-amber-700">
                      {u.stars || 0} ⭐ • {u.coins || 0} 🪙
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ✓ Белсенді
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <Button
                        onClick={() => handleOpenEdit(u)}
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Өңдеу
                      </Button>
                      <Button
                        onClick={() => setDeleteTarget(u)}
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingUser ? "Пайдаланушыны өңдеу ✏️" : "Жаңа пайдаланушы қосу 👤"}
          description="Платформаға жаңа оқушы, ұстаз немесе ата-ана тіркеу"
          emoji="👥"
          maxWidth="md"
        >
          <form onSubmit={handleSaveUser} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-black text-slate-800">Аты-жөні:</label>
              <Input
                required
                placeholder="Мысалы: Аяла Ерболқызы"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-800">Email:</label>
              <Input
                type="email"
                required
                placeholder="user@kitaptan.kz"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-800">Рөлі:</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-2xl border-2 border-slate-200 text-xs font-bold bg-white outline-none focus:border-edu-sky-400"
                >
                  <option value="student">🎒 Оқушы</option>
                  <option value="teacher">👩‍🏫 Мұғалім</option>
                  <option value="parent">👨‍👩‍👧 Ата-ана</option>
                  <option value="admin">🛡️ Әкімші</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-800">Сыныбы:</label>
                <Input
                  placeholder="3 «А»"
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-slate-800">Мектеп:</label>
              <Input
                placeholder="№84 мектеп-лицейі"
                value={formSchool}
                onChange={(e) => setFormSchool(e.target.value)}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs"
              >
                Болдырмау
              </Button>
              <Button type="submit" variant="sky" size="md" className="text-xs font-black">
                Сақтау ✓
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Жоюды растаңыз ⚠️"
          description={`«${deleteTarget.full_name}» пайдаланушысын тізімнен өшіргіңіз келе ме?`}
          emoji="🗑️"
          maxWidth="sm"
        >
          <div className="space-y-4 text-center pt-2">
            <p className="text-xs text-slate-600 font-semibold">
              Бұл әрекетті кері қайтару мүмкін емес.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setDeleteTarget(null)}
                className="text-xs font-bold"
              >
                Болдырмау
              </Button>
              <Button
                onClick={handleDeleteUser}
                variant="coral"
                size="md"
                className="text-xs font-black"
              >
                Иә, жою 🗑️
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
