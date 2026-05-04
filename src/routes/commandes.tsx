import { createFileRoute, Link } from "@tanstack/react-router";
import {
  mockCommandes,
  mockClients,
  getStatusLabel,
  getStatusColor,
  formatCFA,
} from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/commandes")({
  component: CommandesPage,
});

function CommandesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = mockCommandes.filter(
    (c) => statusFilter === "all" || c.statut === statusFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
          Commandes
        </h1>
        <p className="text-muted-foreground font-mono text-sm mt-2">
          {mockCommandes.length} commandes au total
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {[
          { key: "all", label: "Toutes" },
          { key: "en_cours", label: "En cours" },
          { key: "essayage", label: "Essayage" },
          { key: "termine", label: "Terminé" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              statusFilter === f.key
                ? "bg-foreground text-background"
                : "bg-card ring-1 ring-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="hidden md:grid grid-cols-[100px_1fr_1fr_120px_140px_120px] gap-4 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
          <span>Réf</span>
          <span>Client</span>
          <span>Modèle</span>
          <span>Livraison</span>
          <span className="text-right">Montant</span>
          <span className="text-right">Statut</span>
        </div>

        <div className="space-y-0 divide-y divide-border">
          {filtered.map((cmd) => {
            const client = mockClients.find((c) => c.id === cmd.clientId);
            return (
              <div
                key={cmd.id}
                className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_120px_140px_120px] gap-2 md:gap-4 px-5 py-4 hover:bg-card/50 transition-colors items-center"
              >
                <span className="font-mono text-xs text-muted-foreground">{cmd.id}</span>
                <Link
                  to="/clients/$clientId"
                  params={{ clientId: cmd.clientId }}
                  className="font-semibold text-sm hover:text-primary transition-colors"
                >
                  {client?.nom}
                </Link>
                <span className="text-sm text-muted-foreground">{cmd.modele}</span>
                <span className="font-mono text-xs">
                  {new Date(cmd.dateLivraison).toLocaleDateString("fr-FR")}
                </span>
                <span className="font-mono text-sm text-right">{formatCFA(cmd.prixTotal)}</span>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusColor(cmd.statut)}`}>
                    {getStatusLabel(cmd.statut)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-mono text-sm">Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
