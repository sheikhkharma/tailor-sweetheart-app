import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getStatusLabel, getStatusColor, getCategoryLabel } from "@/lib/mock-data";
import type { Client } from "@/lib/mock-data";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCommandes } from "@/lib/commandes-store";
import { getClients } from "@/lib/firestore";

export const Route = createFileRoute("/clients/")({
  component: ClientsPage,
});

function ClientsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { commandes } = useCommandes();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) getClients().then(setClients).catch(console.error);
  }, [user]);

  if (authLoading || !user) return null;

  const filtered = clients.filter((c) => {
    const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase()) || c.telephone.includes(search);
    const matchFilter = filter === "all" || c.categorie === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
          Clients
        </h1>
        <p className="text-muted-foreground font-mono text-sm mt-2">
          {clients.length} clients enregistrés
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card ring-1 ring-border pl-10 pr-4 py-3 text-sm font-mono focus:outline-none focus:ring-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          {["all", "homme", "femme", "enfant"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-card ring-1 ring-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Tous" : getCategoryLabel(f as "homme" | "femme" | "enfant")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
        {filtered.map((client) => {
          const clientOrders = commandes.filter((c) => c.clientId === client.id);
          const activeOrder = clientOrders.find((c) => c.statut !== "termine" && c.statut !== "annule");

          return (
            <Link
              key={client.id}
              to="/clients/$clientId"
              params={{ clientId: client.id }}
              className="block bg-card ring-1 ring-border p-5 hover:ring-primary/30 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-12 bg-muted flex items-center justify-center font-mono text-sm font-bold uppercase shrink-0">
                    {client.nom.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg truncate">{client.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryLabel(client.categorie)} • {client.telephone} • {client.adresse}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {activeOrder && (
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusColor(activeOrder.statut)}`}>
                      {getStatusLabel(activeOrder.statut)}
                    </span>
                  )}
                  <span className="font-mono text-xs text-muted-foreground">
                    {clientOrders.length} cmd
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-mono text-sm">Aucun client trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
