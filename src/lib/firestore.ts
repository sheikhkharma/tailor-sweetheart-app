import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Client, ClientCategory, Commande, Mesures, OrderStatus } from "./mock-data";

// ── Clients ──

const clientsCol = collection(db, "clients");

export async function getClients(): Promise<Client[]> {
  const snap = await getDocs(query(clientsCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Client);
}

export async function getClient(id: string): Promise<Client | null> {
  const snap = await getDoc(doc(db, "clients", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Client;
}

export async function addClient(data: Omit<Client, "id" | "createdAt">) {
  const ref = await addDoc(clientsCol, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateClient(id: string, data: Partial<Client>) {
  await updateDoc(doc(db, "clients", id), data as DocumentData);
}

export async function deleteClient(id: string) {
  await deleteDoc(doc(db, "clients", id));
}

// ── Mesures ──

export async function getMesures(clientId: string): Promise<Mesures | null> {
  const snap = await getDoc(doc(db, "mesures", clientId));
  if (!snap.exists()) return null;
  return snap.data() as Mesures;
}

export async function saveMesures(clientId: string, mesures: Mesures) {
  await updateDoc(doc(db, "mesures", clientId), mesures as DocumentData).catch(() => {
    // If doc doesn't exist, create it
    const { setDoc } = require("firebase/firestore");
    return setDoc(doc(db, "mesures", clientId), mesures);
  });
}

// ── Commandes ──

const commandesCol = collection(db, "commandes");

export async function getCommandes(): Promise<Commande[]> {
  const snap = await getDocs(query(commandesCol, orderBy("dateDepot", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Commande);
}

export async function getCommandesByClient(clientId: string): Promise<Commande[]> {
  const snap = await getDocs(query(commandesCol, where("clientId", "==", clientId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Commande);
}

export async function addCommande(data: Omit<Commande, "id">) {
  const ref = await addDoc(commandesCol, data);
  return ref.id;
}

export async function updateCommande(id: string, data: Partial<Commande>) {
  await updateDoc(doc(db, "commandes", id), data as DocumentData);
}

export async function updateCommandeStatut(id: string, statut: OrderStatus) {
  await updateDoc(doc(db, "commandes", id), { statut });
}

export async function updateCommandeNotes(id: string, notes: string) {
  await updateDoc(doc(db, "commandes", id), { notes });
}
