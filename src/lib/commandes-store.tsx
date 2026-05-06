import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Commande, OrderStatus } from "./mock-data";
import {
  getCommandes as fetchCommandes,
  updateCommandeStatut,
  updateCommandeNotes,
} from "./firestore";

interface CommandesStore {
  commandes: Commande[];
  loading: boolean;
  refreshCommandes: () => Promise<void>;
  updateStatut: (id: string, statut: OrderStatus) => void;
  updateNotes: (id: string, notes: string) => void;
}

const CommandesContext = createContext<CommandesStore | null>(null);

export function CommandesProvider({ children }: { children: ReactNode }) {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCommandes = async () => {
    setLoading(true);
    try {
      const data = await fetchCommandes();
      setCommandes(data);
    } catch (err) {
      console.error("Error fetching commandes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCommandes();
  }, []);

  const updateStatut = (id: string, statut: OrderStatus) => {
    setCommandes((prev) => prev.map((c) => (c.id === id ? { ...c, statut } : c)));
    updateCommandeStatut(id, statut).catch(console.error);
  };

  const updateNotes = (id: string, notes: string) => {
    setCommandes((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
    updateCommandeNotes(id, notes).catch(console.error);
  };

  return (
    <CommandesContext.Provider value={{ commandes, loading, refreshCommandes, updateStatut, updateNotes }}>
      {children}
    </CommandesContext.Provider>
  );
}

export function useCommandes() {
  const ctx = useContext(CommandesContext);
  if (!ctx) throw new Error("useCommandes must be used within CommandesProvider");
  return ctx;
}
