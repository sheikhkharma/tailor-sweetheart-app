import { Link, useRouterState } from "@tanstack/react-router";
import { Users, ClipboardList, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Tableau de Bord", to: "/", icon: LayoutDashboard },
  { label: "Clients", to: "/clients", icon: Users },
  { label: "Commandes", to: "/commandes", icon: ClipboardList },
] as const;

export function AtelierNav() {
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  });

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
      <Link to="/clients/nouveau">
        <Button variant="atelier">
          <Plus className="size-4" />
          Nouveau Client
        </Button>
      </Link>
    </nav>
  );
}
