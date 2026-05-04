import { createFileRoute, Link } from "@tanstack/react-router";
import {
  mockClients,
  mockMesures,
  mockCommandes,
  mesuresLabelsHomme,
  mesuresLabelsFemme,
  mesuresLabelsEnfant,
  getStatusLabel,
  getStatusColor,
  formatCFA,
  getCategoryLabel,
  type MesuresHomme,
  type MesuresFemme,
  type MesuresEnfant,
} from "@/lib/mock-data";
import { ArrowLeft, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/clients/$clientId")({
  component: ClientDetailPage,
});

function ClientDetailPage() {
  const { clientId } = Route.useParams();
  const client = mockClients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="font-mono text-muted-foreground">Client introuvable</p>
        <Link to="/clients" className="text-primary text-sm mt-4 inline-block">← Retour</Link>
      </div>
    );
  }

  const mesures = mockMesures[clientId];
  const commandes = mockCommandes.filter((c) => c.clientId === clientId);

  const mesureEntries = getMesureEntries(client.categorie, mesures);
  const hautEntries = mesureEntries.filter((_, i) => i < Math.ceil(mesureEntries.length / 2));
  const basEntries = mesureEntries.filter((_, i) => i >= Math.ceil(mesureEntries.length / 2));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Back & Header */}
      <div className="animate-slide-up">
        <Link to="/clients" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-3" /> Retour aux clients
        </Link>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground mb-1">
              ID: {new Date(client.createdAt).getFullYear()}-{client.nom.split(" ").map(w => w[0]).join("")}-{clientId.padStart(3, "0")}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
              {client.nom}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {getCategoryLabel(client.categorie)} • {client.telephone} • {client.adresse}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="atelierOutline">
              <FileText className="size-4" />
              Fiche PDF
            </Button>
            <Button variant="atelierOutline">
              <MessageSquare className="size-4" />
              SMS
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Measurements */}
        <div className="col-span-12 lg:col-span-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
              Mesures ({getCategoryLabel(client.categorie)})
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              Dernière mise à jour: {new Date().toLocaleDateString("fr-FR")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            {/* Column 1 */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
                {client.categorie === "enfant" ? "Général" : "Haut du Corps"}
              </h3>
              <div className="space-y-0">
                {hautEntries.map(([key, label]) => (
                  <MesureRow key={key} label={label} value={(mesures as Record<string, number | undefined>)[key]} />
                ))}
              </div>
            </div>

            {/* Column 2 */}
            {basEntries.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
                  {client.categorie === "enfant" ? "Dimensions" : "Bas du Corps"}
                </h3>
                <div className="space-y-0">
                  {basEntries.map(([key, label]) => (
                    <MesureRow key={key} label={label} value={(mesures as Record<string, number | undefined>)[key]} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Orders */}
        <div className="col-span-12 lg:col-span-4 space-y-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="border-b border-border pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
              Commandes ({commandes.length})
            </h2>
          </div>

          {commandes.map((cmd) => (
            <div key={cmd.id} className="bg-card ring-1 ring-border p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{cmd.modele}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">{cmd.id}</p>
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusColor(cmd.statut)}`}>
                  {getStatusLabel(cmd.statut)}
                </span>
              </div>

              {cmd.notes && (
                <p className="text-xs text-muted-foreground italic">{cmd.notes}</p>
              )}

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

              {/* Progress bar for active orders */}
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

          {commandes.length === 0 && (
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

function getMesureEntries(categorie: string, _mesures: unknown): [string, string][] {
  if (categorie === "homme") {
    return Object.entries(mesuresLabelsHomme);
  } else if (categorie === "femme") {
    return Object.entries(mesuresLabelsFemme);
  } else {
    return Object.entries(mesuresLabelsEnfant);
  }
}
