import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
  type Unsubscribe
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, type DocumentData } from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { env } from "../config/env";
import { auth, firestore } from "../config/firebase";
import { fallbackProducts } from "../data/fallbackProducts";
import type { OrderRecord } from "../types/order";
import { useCartStore } from "./cartStore";
import { useUiStore } from "./uiStore";

export type MockOrder = {
  id: string;
  date: string;
  status: "Hazırlanıyor" | "Kargoda" | "Teslim Edildi";
  total: number;
};

export type MockAddress = {
  id: string;
  title: string;
  detail: string;
};

export type MockUser = {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  membership: string;
  role: "user" | "admin";
  orders: MockOrder[];
  favorites: string[];
  addresses: MockAddress[];
};

interface AuthState {
  isLoggedIn: boolean;
  isAuthReady: boolean;
  isAuthLoading: boolean;
  authError: string;
  user: MockUser | null;
  initAuthListener: () => Unsubscribe;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  addOrder: (order: OrderRecord) => void;
  toggleFavorite: (favoriteSlug: string) => void;
  logout: () => Promise<void>;
}

const favoriteSlugLookup = new Map(
  fallbackProducts.flatMap((product) => [
    [product.slug, product.slug] as const,
    [product.name, product.slug] as const
  ])
);

const normalizeFavorites = (favorites: string[]) =>
  Array.from(
    new Set(
      favorites
        .map((favorite) => favoriteSlugLookup.get(favorite) ?? favorite)
        .filter(Boolean)
    )
  );

const defaultOrders: MockOrder[] = [];
const defaultAddresses: MockAddress[] = [];

const formatOrderDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return Number.isNaN(date.getTime())
    ? "Bugün"
    : new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
};

const DEFAULT_USER_ROLE: MockUser["role"] = "user";

const getFallbackName = (firebaseUser: FirebaseUser, fullName?: string) => {
  if (fullName?.trim()) {
    return fullName.trim();
  }

  if (firebaseUser.displayName?.trim()) {
    return firebaseUser.displayName.trim();
  }

  return firebaseUser.email?.split("@")[0] || "Pasaj Kullanıcısı";
};

const isValidRole = (role: unknown): role is MockUser["role"] =>
  role === "user" || role === "admin";

const isOrderStatus = (status: unknown): status is MockOrder["status"] =>
  status === "Hazırlanıyor" || status === "Kargoda" || status === "Teslim Edildi";

const mapOrders = (orders: unknown): MockOrder[] =>
  Array.isArray(orders)
    ? orders
        .map((order): MockOrder | null => {
          if (!order || typeof order !== "object") {
            return null;
          }

          const record = order as Record<string, unknown>;
          return {
            id: typeof record.id === "string" ? record.id : "",
            date: typeof record.date === "string" ? record.date : "Bugün",
            status: isOrderStatus(record.status) ? record.status : "Hazırlanıyor",
            total: typeof record.total === "number" ? record.total : 0
          };
        })
        .filter((order): order is MockOrder => Boolean(order?.id))
    : defaultOrders;

const mapAddresses = (addresses: unknown): MockAddress[] =>
  Array.isArray(addresses)
    ? addresses
        .map((address): MockAddress | null => {
          if (!address || typeof address !== "object") {
            return null;
          }

          const record = address as Record<string, unknown>;
          return {
            id: typeof record.id === "string" ? record.id : "",
            title: typeof record.title === "string" ? record.title : "Adres",
            detail: typeof record.detail === "string" ? record.detail : ""
          };
        })
        .filter((address): address is MockAddress => Boolean(address?.id))
    : defaultAddresses;

const buildProfile = (
  firebaseUser: FirebaseUser,
  data: DocumentData | undefined,
  fullName?: string
): MockUser => {
  const email = firebaseUser.email ?? "";
  const rawFavorites = Array.isArray(data?.favorites) ? data?.favorites : [];

  return {
    uid: firebaseUser.uid,
    fullName: typeof data?.fullName === "string" ? data.fullName : getFallbackName(firebaseUser, fullName),
    email: typeof data?.email === "string" ? data.email : email,
    phone: typeof data?.phone === "string" ? data.phone : "",
    membership: typeof data?.membership === "string" ? data.membership : "Standart Üye",
    role: isValidRole(data?.role) ? data.role : DEFAULT_USER_ROLE,
    orders: mapOrders(data?.orders),
    favorites: normalizeFavorites(rawFavorites),
    addresses: mapAddresses(data?.addresses)
  };
};

const persistUserPatch = async (uid: string, patch: Partial<MockUser>) => {
  if (!firestore) {
    return;
  }

  try {
    await setDoc(
      doc(firestore, env.usersCollection, uid),
      {
        ...patch,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (error) {
    useUiStore.getState().showToast(resolveAuthError(error), "info");
  }
};

const loadFirebaseUser = async (firebaseUser: FirebaseUser, fullName?: string) => {
  if (!firestore) {
    return buildProfile(firebaseUser, undefined, fullName);
  }

  const userRef = doc(firestore, env.usersCollection, firebaseUser.uid);
  let existingData: DocumentData | undefined;

  try {
    const snapshot = await getDoc(userRef);
    existingData = snapshot.exists() ? snapshot.data() : undefined;
  } catch (error) {
    if (!isPermissionDenied(error)) {
      throw error;
    }
  }

  const profile = buildProfile(firebaseUser, existingData, fullName);
  const profilePayload: Record<string, unknown> = {
    uid: profile.uid,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    membership: profile.membership,
    role: profile.role,
    orders: profile.orders,
    favorites: profile.favorites,
    addresses: profile.addresses,
    updatedAt: serverTimestamp()
  };

  if (!existingData?.createdAt) {
    profilePayload.createdAt = serverTimestamp();
  }

  try {
    await setDoc(
      userRef,
      profilePayload,
      { merge: true }
    );
  } catch (error) {
    if (!isPermissionDenied(error)) {
      throw error;
    }

    useUiStore.getState().showToast(resolveAuthError(error), "info");
  }

  return profile;
};

const isPermissionDenied = (error: unknown) =>
  Boolean(error && typeof error === "object" && "code" in error && String((error as { code: unknown }).code) === "permission-denied");

const resolveAuthError = (error: unknown) => {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
  }

  const code = String((error as { code: unknown }).code);

  switch (code) {
    case "permission-denied":
      return "Firestore izinleri kullanıcı profilini okumaya/yazmaya izin vermiyor. Firebase Console > Firestore Database > Rules alanında users koleksiyonuna kullanıcı bazlı izin verin.";
    case "auth/configuration-not-found":
      return "Firebase Authentication bu projede etkin görünmüyor. Firebase Console'da Authentication bölümünü başlatın ve Email/Password sağlayıcısını açın.";
    case "auth/operation-not-allowed":
      return "Email/Password girişi Firebase Console'da kapalı. Authentication > Sign-in method bölümünden Email/Password sağlayıcısını etkinleştirin.";
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
      return "Firebase API anahtarı geçersiz görünüyor. .env dosyasındaki VITE_FIREBASE_API_KEY değerini kontrol edin.";
    case "auth/app-not-authorized":
    case "auth/unauthorized-domain":
      return "Bu domain Firebase Auth için yetkilendirilmemiş. Firebase Console > Authentication > Settings > Authorized domains alanına localhost/127.0.0.1 ekleyin.";
    case "auth/network-request-failed":
      return "Firebase'e bağlanılamadı. İnternet bağlantısını veya Firebase erişimini kontrol edin.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-posta veya şifre hatalı.";
    case "auth/email-already-in-use":
      return "Bu e-posta adresiyle oluşturulmuş bir hesap var.";
    case "auth/weak-password":
      return "Şifre en az 6 karakter olmalı.";
    case "auth/invalid-email":
      return "Geçerli bir e-posta adresi girin.";
    case "auth/too-many-requests":
      return "Çok fazla deneme yapıldı. Bir süre sonra tekrar deneyin.";
    default:
      return `Firebase Auth işlemi tamamlanamadı. Hata kodu: ${code}.`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      isAuthReady: !auth,
      isAuthLoading: false,
      authError: "",
      user: null,
      initAuthListener: () => {
        if (!auth) {
          useCartStore.getState().setOwner("guest");
          set({ isAuthReady: true, isAuthLoading: false, isLoggedIn: false, user: null });
          return () => undefined;
        }

        set({ isAuthLoading: true });

        return onAuthStateChanged(auth, async (firebaseUser) => {
          if (!firebaseUser) {
            useCartStore.getState().setOwner("guest");
            set({
              isLoggedIn: false,
              isAuthReady: true,
              isAuthLoading: false,
              authError: "",
              user: null
            });
            return;
          }

          try {
            const profile = await loadFirebaseUser(firebaseUser);
            useCartStore.getState().setOwner(profile.uid);
            set({
              isLoggedIn: true,
              isAuthReady: true,
              isAuthLoading: false,
              authError: "",
              user: profile
            });
          } catch (error) {
            set({
              isAuthReady: true,
              isAuthLoading: false,
              authError: resolveAuthError(error)
            });
          }
        });
      },
      login: async (email, password) => {
        if (!auth) {
          throw new Error("Firebase Auth ayarları eksik.");
        }

        set({ isAuthLoading: true, authError: "" });

        try {
          const credential = await signInWithEmailAndPassword(auth, email, password);
          const profile = await loadFirebaseUser(credential.user);
          useCartStore.getState().setOwner(profile.uid);
          set({ isLoggedIn: true, isAuthLoading: false, isAuthReady: true, user: profile });
          useUiStore.getState().showToast("Giriş başarılı.");
        } catch (error) {
          const message = resolveAuthError(error);
          set({ isAuthLoading: false, authError: message });
          throw new Error(message);
        }
      },
      register: async (fullName, email, password) => {
        if (!auth) {
          throw new Error("Firebase Auth ayarları eksik.");
        }

        set({ isAuthLoading: true, authError: "" });

        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(credential.user, { displayName: fullName });
          const profile = await loadFirebaseUser(credential.user, fullName);
          useCartStore.getState().setOwner(profile.uid);
          set({ isLoggedIn: true, isAuthLoading: false, isAuthReady: true, user: profile });
          useUiStore.getState().showToast("Kayıt başarılı. Hesabınız oluşturuldu.");
        } catch (error) {
          const message = resolveAuthError(error);
          set({ isAuthLoading: false, authError: message });
          throw new Error(message);
        }
      },
      resetPassword: async (email) => {
        if (!auth) {
          throw new Error("Firebase Auth ayarları eksik.");
        }

        try {
          await sendPasswordResetEmail(auth, email);
          useUiStore.getState().showToast("Şifre sıfırlama bağlantısı gönderildi.");
        } catch (error) {
          throw new Error(resolveAuthError(error));
        }
      },
      addOrder: (order) => {
        const currentUser = get().user;

        if (!currentUser) {
          useUiStore.getState().showToast("Sipariş oluşturmak için giriş yapın.", "info");
          return;
        }

        const nextOrder: MockOrder = {
          id: order.orderNumber,
          date: formatOrderDate(order.createdAt),
          status: "Hazırlanıyor",
          total: order.total
        };
        const nextOrders = [nextOrder, ...currentUser.orders];

        set({
          user: {
            ...currentUser,
            orders: nextOrders
          }
        });

        void persistUserPatch(currentUser.uid, { orders: nextOrders });
      },
      toggleFavorite: (favoriteSlug) => {
        const currentUser = get().user;

        if (!currentUser || !get().isLoggedIn) {
          useUiStore.getState().showToast("Favorilere eklemek için giriş yapın.", "info");
          return;
        }

        const favorites = normalizeFavorites(currentUser.favorites);
        const wasRemoved = favorites.includes(favoriteSlug);
        const nextFavorites = wasRemoved
          ? favorites.filter((item) => item !== favoriteSlug)
          : [favoriteSlug, ...favorites];

        set({
          user: {
            ...currentUser,
            favorites: nextFavorites
          }
        });

        void persistUserPatch(currentUser.uid, { favorites: nextFavorites });

        useUiStore
          .getState()
          .showToast(wasRemoved ? "Ürün favorilerden kaldırıldı." : "Ürün favorilere eklendi.");
      },
      logout: async () => {
        if (auth) {
          await signOut(auth);
        }

        useCartStore.getState().setOwner("guest");
        set({
          isLoggedIn: false,
          isAuthReady: true,
          isAuthLoading: false,
          authError: "",
          user: null
        });
        useUiStore.getState().showToast("Çıkış yapıldı.", "info");
      }
    }),
    {
      name: "pasaj-auth-store",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        isAuthReady: state.isAuthReady,
        user: state.user
          ? {
              ...state.user,
              favorites: normalizeFavorites(state.user.favorites)
            }
          : null
      })
    }
  )
);
