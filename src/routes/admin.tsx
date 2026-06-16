import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUsers, updateUserRole, type AppUser, type AppRole } from "@/lib/firestore";
import { ShieldCheck, Scissors } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ROLES: AppRole[] = ["admin", "tailleur"];

function AdminPage() {
  const { user, profile, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [savingUid, setSavingUid] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
    if (!authLoading && user && !isAdmin) navigate({ to: "/" });
  }, [user, authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin) getUsers().then(setUsers).catch(console.error);
  }, [user, isAdmin]);

  if (authLoading || !user || !isAdmin) return null;

  const changeRole = async (uid: string, role: AppRole) => {
    setSavingUid(uid);
    try {
      await updateUserRole(uid, role);
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
    } catch (e) {
      console.error(e);
    } finally {
      setSavingUid(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
          Administration
        </h1>
        <p className="text-muted-foreground font-mono text-sm mt-2">
          {users.length} utilisateurs — gestion des rôles
        </p>
      </div>

      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {users.map((u) => {
          const isSelf = u.uid === profile?.uid;
          return (
            <div key={u.uid} className="bg-card ring-1 ring-border p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-11 bg-muted flex items-center justify-center font-mono text-sm font-bold uppercase shrink-0">
                  {(u.displayName || u.email || "?").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">
                    {u.displayName || "—"}
                    {isSelf && <span className="ml-2 text-[10px] text-muted-foreground font-mono">(vous)</span>}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {u.role === "admin" ? (
                  <ShieldCheck className="size-4 text-primary" />
                ) : (
                  <Scissors className="size-4 text-muted-foreground" />
                )}
                <select
                  value={u.role}
                  disabled={isSelf || savingUid === u.uid}
                  onChange={(e) => changeRole(u.uid, e.target.value as AppRole)}
                  className="bg-background ring-1 ring-border px-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-mono text-sm">Aucun utilisateur</p>
          </div>
        )}
      </div>
    </div>
  );
}
