import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4Hc2M53ZhsIGD1WMFjXcuEppLF0zUVJQ",
  authDomain: "sama-tailleur.firebaseapp.com",
  projectId: "sama-tailleur",
  storageBucket: "sama-tailleur.firebasestorage.app",
  messagingSenderId: "886319929798",
  appId: "1:886319929798:web:c775b8f97a627fbf8a7ac7",
  measurementId: "G-827GN7BLMF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
