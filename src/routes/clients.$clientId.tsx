import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  mesuresLabelsHomme,
  mesuresLabelsFemme,
  mesuresLabelsEnfant,
  getStatusLabel,
  getStatusColor,
  formatCFA,
  getCategoryLabel,
  type OrderStatus,
} from "@/lib/mock-data";
import type { Client, Mesures } from "@/lib/mock-data";
import { useCommandes } from "@/lib/commandes-store";
import { useAuth } from "@/lib/auth-context";
import { getClient, getMesures } from "@/lib/firestore";
import { ArrowLeft, FileText, MessageSquare, Check, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/clients/$clientId")({
  component: ClientDetailPage,
});

const ALL_STATUSES: OrderStatus[] = ["en_cours", "essayage", "termine", "annule"];

function ClientDetailPage() {
  const { clientId } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { commandes, updateStatut, updateNotes } = useCommandes();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [mesures, setMesures] = useState<Mesures | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      Promise.all([getClient(clientId), getMesures(clientId)])
        .then(([c, m]) => {
          setClient(c);
          setMesures(m);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, clientId]);

  if (authLoading || loading || !user) return null;

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="font-mono text-muted-foreground">Client introuvable</p>
        <Link to="/clients" className="text-primary text-sm mt-4 inline-block">← Retour</Link>
      </div>
    );
  }

  const clientCommandes = commandes.filter((c) => c.clientId === clientId);
  const mesureEntries = getMesureEntries(client.categorie);
  const hautEntries = mesureEntries.filter((_, i) => i < Math.ceil(mesureEntries.length / 2));
  const basEntries = mesureEntries.filter((_, i) => i >= Math.ceil(mesureEntries.length / 2));

  const startEditNotes = (cmdId: string, current?: string) => {
    setEditingNotes(cmdId);
    setNotesValue(current ?? "");
  };

  const saveNotes = (cmdId: string) => {
    updateNotes(cmdId, notesValue);
    setEditingNotes(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <div className="animate-slide-up">
        <Link to="/clients" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-3" /> Retour aux clients
        </Link>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground mb-1">
              ID: {clientId}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
              {client.nom}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {getCategoryLabel(client.categorie)} • {client.telephone} • {client.adresse}
            </p>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <Button variant="atelierOutline">
                <FileText className="size-4" />
                Fiche PDF
              </Button>
            )}
            <Button variant="atelierOutline">
              <MessageSquare className="size-4" />
              SMS
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
              Mesures ({getCategoryLabel(client.categorie)})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
                {client.categorie === "enfant" ? "Général" : "Haut du Corps"}
              </h3>
              <div className="space-y-0">
                {hautEntries.map(([key, label]) => (
                  <MesureRow key={key} label={label} value={mesures ? (mesures as Record<string, number | undefined>)[key] : undefined} />
                ))}
              </div>
            </div>

            {basEntries.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
                  {client.categorie === "enfant" ? "Dimensions" : "Bas du Corps"}
                </h3>
                <div className="space-y-0">
                  {basEntries.map(([key, label]) => (
                    <MesureRow key={key} label={label} value={mesures ? (mesures as Record<string, number | undefined>)[key] : undefined} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="border-b border-border pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
              Commandes ({clientCommandes.length})
            </h2>
          </div>

          {clientCommandes.map((cmd) => (
            <div key={cmd.id} className="bg-card ring-1 ring-border p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{cmd.modele}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">{cmd.id}</p>
                </div>
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

              <div>
                {editingNotes === cmd.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveNotes(cmd.id)}
                      placeholder="Ajouter une note…"
                      className="flex-1 bg-transparent border-b border-border text-xs py-1 outline-none focus:border-primary font-mono placeholder:text-muted-foreground"
                    />
                    <button onClick={() => saveNotes(cmd.id)} className="text-green-600 hover:text-green-500">
                      <Check className="size-3" />
                    </button>
                    <button onClick={() => setEditingNotes(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditNotes(cmd.id, cmd.notes)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group w-full text-left"
                  >
                    <Edit2 className="size-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    <span className="italic">{cmd.notes || "Ajouter une note…"}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Dépôt</span>
                  <p className="font-mono font-semibold">{new Date(cmd.dateDepot).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Livraison</span>
                  <p className="font-mono font-semibold">{new Date(cmd.dateLivraison).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Acompte: <span className="font-mono font-semibold text-foreground">{formatCFA(cmd.acompte)}</span>
                </div>
                <div className="font-mono text-sm font-bold">{formatCFA(cmd.prixTotal)}</div>
              </div>

              {cmd.statut !== "termine" && cmd.statut !== "annule" && (
                <div className="space-y-1">
                  <div className="h-1 bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary animate-width-reveal"
                      style={{ "--target-width": cmd.statut === "essayage" ? "75%" : "40%" } as React.CSSProperties}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {clientCommandes.length === 0 && (
            <p className="text-sm text-muted-foreground font-mono text-center py-8">
              Aucune commande
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MesureRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border/50 py-3 group">
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xl font-semibold">
          {value !== undefined ? value.toFixed(1) : "—"}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {label.toLowerCase().includes("âge") ? "ans" : "CM"}
        </span>
      </div>
    </div>
  );
}

function getMesureEntries(categorie: string): [string, string][] {
  if (categorie === "homme") return Object.entries(mesuresLabelsHomme);
  if (categorie === "femme") return Object.entries(mesuresLabelsFemme);
  return Object.entries(mesuresLabelsEnfant);
}
