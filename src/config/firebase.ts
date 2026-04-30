import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { env } from "./env";

const hasFirebaseConfig = Object.values(env.firebase).every(Boolean);

export const firebaseApp = hasFirebaseConfig
  ? initializeApp(env.firebase)
  : null;

export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
export const isFirebaseReady = Boolean(firebaseApp);

