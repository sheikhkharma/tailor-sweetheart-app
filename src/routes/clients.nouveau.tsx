import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  mesuresLabelsHomme,
  mesuresLabelsFemme,
  mesuresLabelsEnfant,
  type ClientCategory,
} from "@/lib/mock-data";

export const Route = createFileRoute("/clients/nouveau")({
  component: NouveauClientPage,
});

function NouveauClientPage() {
  const [categorie, setCategorie] = useState<ClientCategory>("homme");

  const mesureLabels =
    categorie === "homme"
      ? mesuresLabelsHomme
      : categorie === "femme"
        ? mesuresLabelsFemme
        : mesuresLabelsEnfant;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div className="animate-slide-up">
        <Link to="/clients" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-3" /> Retour
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">
          Nouveau Client
        </h1>
      </div>

      {/* Client Info */}
      <section className="space-y-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-border pb-4">
          Informations Personnelles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Nom complet" placeholder="Ex: Amadou Diallo" />
          <InputField label="Téléphone" placeholder="+221 77 000 00 00" />
          <InputField label="Adresse" placeholder="Dakar, Plateau" />
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Catégorie
            </label>
            <div className="flex gap-2">
              {(["homme", "femme", "enfant"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategorie(cat)}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                    categorie === cat
                      ? "bg-foreground text-background"
                      : "bg-card ring-1 ring-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat === "homme" ? "Homme" : cat === "femme" ? "Femme" : "Enfant"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Measurements */}
      <section className="space-y-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-border pb-4">
          Mesures ({categorie === "homme" ? "Homme" : categorie === "femme" ? "Femme" : "Enfant"})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8">
          {Object.entries(mesureLabels).map(([key, label]) => (
            <div key={key} className="space-y-2 group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                {label}
              </label>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="—"
                  className="w-full bg-transparent border-b border-border py-2 font-mono text-2xl focus:outline-none focus:border-foreground transition-colors"
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {key === "age" ? "ans" : "CM"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-8 border-t border-border animate-slide-up" style={{ animationDelay: "300ms" }}>
        <Button variant="atelier" className="flex-1 py-6">
          Enregistrer le Client
        </Button>
        <Button variant="atelierOutline" className="flex-1 py-6">
          Enregistrer & Nouvelle Commande
        </Button>
      </div>
    </div>
  );
}

function InputField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );
}
