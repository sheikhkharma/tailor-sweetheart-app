import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  getStatusLabel,
  getStatusColor,
  formatCFA,
  type OrderStatus,
} from "@/lib/mock-data";
import type { Client } from "@/lib/mock-data";
import { useCommandes } from "@/lib/commandes-store";
import { useAuth } from "@/lib/auth-context";
import { getClients } from "@/lib/firestore";
import { useState, useEffect } from "react";
import { Check, Edit2, X } from "lucide-react";

export const Route = createFileRoute("/commandes")({
  component: CommandesPage,
});

const ALL_STATUSES: OrderStatus[] = ["en_cours", "essayage", "termine", "annule"];

function CommandesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { commandes, updateStatut, updateNotes } = useCommandes();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) getClients().then(setClients).catch(console.error);
  }, [user]);

  if (authLoading || !user) return null;

  const filtered = commandes.filter(
    (c) => statusFilter === "all" || c.statut === statusFilter
  );

  const startEditNotes = (cmdId: string, current?: string) => {
    setEditingNotes(cmdId);
    setNotesValue(current ?? "");
  };

  const saveNotes = (cmdId: string) => {
    updateNotes(cmdId, notesValue);
    setEditingNotes(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
          Commandes
        </h1>
        <p className="text-muted-foreground font-mono text-sm mt-2">
          {commandes.length} commandes au total
        </p>
      </div>

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

      <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="hidden md:grid grid-cols-[100px_1fr_1fr_120px_140px_140px] gap-4 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
          <span>Réf</span>
          <span>Client</span>
          <span>Modèle</span>
          <span>Livraison</span>
          <span className="text-right">Montant</span>
          <span className="text-right">Statut</span>
        </div>

        <div className="space-y-0 divide-y divide-border">
          {filtered.map((cmd) => {
            const client = clients.find((c) => c.id === cmd.clientId);
            return (
              <div key={cmd.id} className="px-5 py-4 hover:bg-card/50 transition-colors space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_120px_140px_140px] gap-2 md:gap-4 items-center">
                  <span className="font-mono text-xs text-muted-foreground">{cmd.id}</span>
                  <Link
                    to="/clients/$clientId"
                    params={{ clientId: cmd.clientId }}
                    className="font-semibold text-sm hover:text-primary transition-colors"
                  >
                    {client?.nom || "—"}
                  </Link>
                  <span className="text-sm text-muted-foreground">{cmd.modele}</span>
                  <span className="font-mono text-xs">
                    {new Date(cmd.dateLivraison).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="font-mono text-sm text-right">{formatCFA(cmd.prixTotal)}</span>
                  <div className="text-right">
                    <select
                      value={cmd.statut}
                      onChange={(e) => updateStatut(cmd.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none outline-none cursor-pointer ${getStatusColor(cmd.statut)}`}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{getStatusLabel(s)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-0 md:ml-[100px]">
                  {editingNotes === cmd.id ? (
                    <>
                      <input
                        autoFocus
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveNotes(cmd.id)}
                        placeholder="Ajouter une note…"
                        className="flex-1 bg-transparent border-b border-border text-sm py-1 outline-none focus:border-primary font-mono placeholder:text-muted-foreground"
                      />
                      <button onClick={() => saveNotes(cmd.id)} className="text-green-600 hover:text-green-500">
                        <Check className="size-4" />
                      </button>
                      <button onClick={() => setEditingNotes(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="size-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditNotes(cmd.id, cmd.notes)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <Edit2 className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="italic">{cmd.notes || "Ajouter une note…"}</span>
                    </button>
                  )}
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
