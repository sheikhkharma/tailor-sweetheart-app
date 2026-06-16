import { Link, useRouterState } from "@tanstack/react-router";
import { Users, ClipboardList, LayoutDashboard, Plus, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { label: "Tableau de Bord", to: "/", icon: LayoutDashboard },
  { label: "Clients", to: "/clients", icon: Users },
  { label: "Commandes", to: "/commandes", icon: ClipboardList },
] as const;


export function AtelierNav() {
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  });
  const { profile, logout, isAdmin } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-mono font-bold tracking-tighter text-xl uppercase">
          Omar Waly / Atelier
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium tracking-tight uppercase">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-1.5 transition-colors ${
                currentPath === item.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {profile && (
          <span className="hidden sm:block text-xs font-mono text-muted-foreground">
            {profile.displayName || profile.email}
          </span>
        )}
        <Link to="/clients/nouveau">
          <Button variant="atelier">
            <Plus className="size-4" />
            Nouveau Client
          </Button>
        </Link>
        <button
          onClick={logout}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Déconnexion"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </nav>
  );
}
