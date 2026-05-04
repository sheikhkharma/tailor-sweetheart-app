export type ClientCategory = "homme" | "femme" | "enfant";

export type OrderStatus = "en_cours" | "essayage" | "termine" | "annule";

export interface Client {
  id: string;
  nom: string;
  telephone: string;
  adresse: string;
  categorie: ClientCategory;
  createdAt: string;
}

export interface MesuresHomme {
  encolure?: number;
  carrure?: number;
  longueurBras?: number;
  tourPoitrine?: number;
  tourTaille?: number;
  longueurChemise?: number;
  tourCeinture?: number;
  tourHanches?: number;
  longueurPantalon?: number;
  entrejambe?: number;
  tourCuisse?: number;
  basPantalon?: number;
}

export interface MesuresFemme {
  tourPoitrine?: number;
  hauteurPoitrine?: number;
  ecartPoitrine?: number;
  tourTaille?: number;
  longueurEpaule?: number;
  tourHanches?: number;
  hauteurHanches?: number;
  longueurJupe?: number;
  longueurRobe?: number;
  tourBras?: number;
  tourPoignet?: number;
  longueurManche?: number;
}

export interface MesuresEnfant {
  age?: number;
  stature?: number;
  tourPoitrine?: number;
  tourTaille?: number;
  longueurTotale?: number;
}

export type Mesures = MesuresHomme | MesuresFemme | MesuresEnfant;

export interface Commande {
  id: string;
  clientId: string;
  modele: string;
  dateDepot: string;
  dateLivraison: string;
  acompte: number;
  prixTotal: number;
  statut: OrderStatus;
  notes?: string;
}

export const mesuresLabelsHomme: Record<keyof MesuresHomme, string> = {
  encolure: "Encolure (Cou)",
  carrure: "Carrure (Épaules)",
  longueurBras: "Longueur Bras",
  tourPoitrine: "Tour de Poitrine",
  tourTaille: "Tour de Taille",
  longueurChemise: "Longueur Chemise/Boubou",
  tourCeinture: "Tour de Ceinture",
  tourHanches: "Tour de Hanches",
  longueurPantalon: "Longueur Pantalon",
  entrejambe: "Entrejambe",
  tourCuisse: "Tour de Cuisse",
  basPantalon: "Bas de Pantalon",
};

export const mesuresLabelsFemme: Record<keyof MesuresFemme, string> = {
  tourPoitrine: "Tour de Poitrine",
  hauteurPoitrine: "Hauteur Poitrine",
  ecartPoitrine: "Écart de Poitrine",
  tourTaille: "Tour de Taille",
  longueurEpaule: "Longueur Épaule",
  tourHanches: "Tour de Hanches",
  hauteurHanches: "Hauteur des Hanches",
  longueurJupe: "Longueur Jupe",
  longueurRobe: "Longueur Robe",
  tourBras: "Tour de Bras",
  tourPoignet: "Tour de Poignet",
  longueurManche: "Longueur Manche",
};

export const mesuresLabelsEnfant: Record<keyof MesuresEnfant, string> = {
  age: "Âge (ans)",
  stature: "Stature",
  tourPoitrine: "Tour de Poitrine",
  tourTaille: "Tour de Taille",
  longueurTotale: "Longueur Totale",
};

export const mockClients: Client[] = [
  { id: "1", nom: "Amadou Diallo", telephone: "+221 77 123 45 67", adresse: "Dakar, Plateau", categorie: "homme", createdAt: "2021-03-15" },
  { id: "2", nom: "Fatoumata Bâ", telephone: "+221 78 234 56 78", adresse: "Dakar, Almadies", categorie: "femme", createdAt: "2022-06-20" },
  { id: "3", nom: "Moussa Fall", telephone: "+221 76 345 67 89", adresse: "Dakar, Médina", categorie: "homme", createdAt: "2023-01-10" },
  { id: "4", nom: "Aïssatou Diop", telephone: "+221 77 456 78 90", adresse: "Thiès", categorie: "femme", createdAt: "2023-08-05" },
  { id: "5", nom: "Ibrahim Sy", telephone: "+221 78 567 89 01", adresse: "Dakar, Parcelles", categorie: "enfant", createdAt: "2024-02-14" },
];

export const mockMesures: Record<string, Mesures> = {
  "1": { encolure: 42.5, carrure: 48, longueurBras: 65, tourPoitrine: 104, tourTaille: 92, longueurChemise: 145, tourCeinture: 88, tourHanches: 108, longueurPantalon: 105, entrejambe: 78, tourCuisse: 58, basPantalon: 22 },
  "2": { tourPoitrine: 92, hauteurPoitrine: 28, ecartPoitrine: 20, tourTaille: 72, longueurEpaule: 14, tourHanches: 100, hauteurHanches: 22, longueurJupe: 65, longueurRobe: 130, tourBras: 30, tourPoignet: 16, longueurManche: 58 },
  "3": { encolure: 40, carrure: 46, longueurBras: 63, tourPoitrine: 100, tourTaille: 85, longueurChemise: 140, tourCeinture: 82, tourHanches: 102, longueurPantalon: 100, entrejambe: 76, tourCuisse: 55, basPantalon: 21 },
  "4": { tourPoitrine: 88, hauteurPoitrine: 26, ecartPoitrine: 19, tourTaille: 68, longueurEpaule: 13, tourHanches: 96, hauteurHanches: 21, longueurJupe: 60, longueurRobe: 125, tourBras: 28, tourPoignet: 15, longueurManche: 56 },
  "5": { age: 8, stature: 128, tourPoitrine: 64, tourTaille: 58, longueurTotale: 70 },
};

export const mockCommandes: Commande[] = [
  { id: "CMD-001", clientId: "1", modele: "Costume 3 Pièces", dateDepot: "2025-04-10", dateLivraison: "2025-05-10", acompte: 150000, prixTotal: 350000, statut: "en_cours", notes: "Lin d'Italie bleu minuit" },
  { id: "CMD-002", clientId: "2", modele: "Robe de Gala", dateDepot: "2025-04-15", dateLivraison: "2025-05-05", acompte: 100000, prixTotal: 250000, statut: "essayage" },
  { id: "CMD-003", clientId: "3", modele: "Boubou Traditionnel", dateDepot: "2025-03-20", dateLivraison: "2025-04-20", acompte: 75000, prixTotal: 180000, statut: "termine" },
  { id: "CMD-004", clientId: "4", modele: "Ensemble Tailleur", dateDepot: "2025-04-20", dateLivraison: "2025-05-15", acompte: 80000, prixTotal: 200000, statut: "en_cours" },
  { id: "CMD-005", clientId: "1", modele: "Bazin Riche Indigo", dateDepot: "2025-02-01", dateLivraison: "2025-03-01", acompte: 60000, prixTotal: 150000, statut: "termine" },
];

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    en_cours: "En cours",
    essayage: "Essayage",
    termine: "Terminé",
    annule: "Annulé",
  };
  return labels[status];
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    en_cours: "bg-primary/10 text-primary",
    essayage: "bg-atelier-gold/20 text-foreground",
    termine: "bg-green-100 text-green-800",
    annule: "bg-destructive/10 text-destructive",
  };
  return colors[status];
}

export function getCategoryLabel(cat: ClientCategory): string {
  return cat === "homme" ? "Homme" : cat === "femme" ? "Femme" : "Enfant";
}

export function formatCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}
