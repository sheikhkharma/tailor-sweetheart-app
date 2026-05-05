import { createFileRoute, Link } from "@tanstack/react-router";
import {
  mockClients,
  getStatusLabel,
  getStatusColor,
  getCategoryLabel,
  formatCFA,
} from "@/lib/mock-data";
import { useCommandes } from "@/lib/commandes-store";
import { Users, ClipboardList, CheckCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { commandes } = useCommandes();
  const recentOrders = commandes.slice(0, 5);

  const stats = [
    {
      label: "Total Clients",
      value: mockClients.length.toString().padStart(2, "0"),
      icon: Users,
      detail: `${mockClients.filter((c) => c.categorie === "homme").length} hommes, ${mockClients.filter((c) => c.categorie === "femme").length} femmes`,
    },
    {
      label: "Commandes Actives",
      value: commandes
        .filter((c) => c.statut === "en_cours" || c.statut === "essayage")
        .length.toString()
        .padStart(2, "0"),
      icon: ClipboardList,
      detail: `${commandes.filter((c) => c.statut === "essayage").length} prêtes pour essayage`,
    },
    {
      label: "Terminées",
      value: commandes
        .filter((c) => c.statut === "termine")
        .length.toString()
        .padStart(2, "0"),
      icon: CheckCircle,
      detail: "Ce mois-ci",
    },
    {
      label: "En Attente",
      value: commandes
        .filter((c) => c.statut === "en_cours")
        .length.toString()
        .padStart(2, "0"),
      icon: Clock,
      detail: "Livraisons prochaines",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
          Tableau de Bord
        </h1>
        <p className="text-muted-foreground font-mono text-sm mt-2">
          Omar Walyfashion — Vue d'ensemble de l'atelier
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card ring-1 ring-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <stat.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="font-mono text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="col-span-12 lg:col-span-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Commandes Récentes</h2>
            <Link to="/commandes" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Voir tout →</Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((cmd) => {
              const client = mockClients.find((c) => c.id === cmd.clientId);
              return (
                <div key={cmd.id} className="bg-card ring-1 ring-border p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground shrink-0">{cmd.id}</span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{client?.nom}</p>
                      <p className="text-sm text-muted-foreground truncate">{cmd.modele}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-sm">{formatCFA(cmd.prixTotal)}</span>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusColor(cmd.statut)}`}>
                      {getStatusLabel(cmd.statut)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="col-span-12 lg:col-span-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Clients Récents</h2>
            <Link to="/clients" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Voir tout →</Link>
          </div>

          <div className="space-y-3">
            {mockClients.slice(0, 5).map((client) => (
              <Link key={client.id} to="/clients/$clientId" params={{ clientId: client.id }} className="block bg-card ring-1 ring-border p-4 hover:ring-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-muted flex items-center justify-center font-mono text-sm font-bold uppercase">
                    {client.nom.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{client.nom}</p>
                    <p className="text-xs text-muted-foreground">{getCategoryLabel(client.categorie)} • {client.telephone}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
