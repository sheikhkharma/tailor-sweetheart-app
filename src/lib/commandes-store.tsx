import { createContext, useContext, useState, type ReactNode } from "react";
import { mockCommandes as initialCommandes, type Commande, type OrderStatus } from "./mock-data";

interface CommandesStore {
  commandes: Commande[];
  updateStatut: (id: string, statut: OrderStatus) => void;
  updateNotes: (id: string, notes: string) => void;
}

const CommandesContext = createContext<CommandesStore | null>(null);

export function CommandesProvider({ children }: { children: ReactNode }) {
  const [commandes, setCommandes] = useState<Commande[]>(initialCommandes);

  const updateStatut = (id: string, statut: OrderStatus) => {
    setCommandes((prev) => prev.map((c) => (c.id === id ? { ...c, statut } : c)));
  };

  const updateNotes = (id: string, notes: string) => {
    setCommandes((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
  };

  return (
    <CommandesContext.Provider value={{ commandes, updateStatut, updateNotes }}>
      {children}
    </CommandesContext.Provider>
  );
}

export function useCommandes() {
  const ctx = useContext(CommandesContext);
  if (!ctx) throw new Error("useCommandes must be used within CommandesProvider");
  return ctx;
}
