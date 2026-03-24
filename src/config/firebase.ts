import { initializeApp } from "firebase/app";
import { env } from "./env";

const hasFirebaseConfig = Object.values(env.firebase).every(Boolean);

export const firebaseApp = hasFirebaseConfig
  ? initializeApp(env.firebase)
  : null;

export const isFirebaseReady = Boolean(firebaseApp);
