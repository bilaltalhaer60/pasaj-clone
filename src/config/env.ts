const getEnv = (key: keyof ImportMetaEnv, fallback = ""): string => {
  return import.meta.env[key] ?? fallback;
};

const parseNumber = (value: string, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  appName: getEnv("VITE_APP_NAME", "Pasaj Clone"),
  shippingThreshold: parseNumber(getEnv("VITE_SHIPPING_THRESHOLD", "200"), 200),
  shippingCost: parseNumber(getEnv("VITE_SHIPPING_COST", "29.9"), 29.9),
  firebase: {
    apiKey: getEnv("VITE_FIREBASE_API_KEY"),
    authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnv("VITE_FIREBASE_APP_ID")
  }
};
