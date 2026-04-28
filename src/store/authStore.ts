import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fallbackProducts } from "../data/fallbackProducts";
import type { OrderRecord } from "../types/order";

export type MockOrder = {
  id: string;
  date: string;
  status: "Hazirlaniyor" | "Kargoda" | "Teslim Edildi";
  total: number;
};

export type MockAddress = {
  id: string;
  title: string;
  detail: string;
};

export type MockUser = {
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
  user: MockUser | null;
  login: (email: string) => void;
  register: (fullName: string, email: string) => void;
  addOrder: (order: OrderRecord) => void;
  toggleFavorite: (favoriteSlug: string) => void;
  logout: () => void;
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

const defaultUser: MockUser = {
  fullName: "Bilal Talha",
  email: "bilal@pasajclone.dev",
  phone: "05xx xxx xx xx",
  membership: "Platin Uye",
  role: "admin",
  orders: [
    { id: "PSJ-24031", date: "28 Mart 2026", status: "Kargoda", total: 79999 },
    { id: "PSJ-23984", date: "25 Mart 2026", status: "Teslim Edildi", total: 9999 }
  ],
  favorites: normalizeFavorites(["iphone-16-pro-256-gb", "macbook-air-m4-13", "airpods-pro-2"]),
  addresses: [
    {
      id: "addr-1",
      title: "Ev",
      detail: "Istanbul / Pendik, Orta Mah. Demo Sok. No:18 D:5"
    },
    {
      id: "addr-2",
      title: "Staj Ofisi",
      detail: "Istanbul / Kartal, Teknoloji Cad. No:42 Kat:3"
    }
  ]
};

const formatOrderDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return Number.isNaN(date.getTime())
    ? "Bugun"
    : new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
};

const getRoleFromEmail = (email: string): MockUser["role"] =>
  email.toLocaleLowerCase("tr-TR").includes("admin") ? "admin" : "user";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: true,
      user: defaultUser,
      login: (email) =>
        set((state) => ({
          isLoggedIn: true,
          user: state.user
            ? { ...state.user, email, role: getRoleFromEmail(email) }
            : { ...defaultUser, email, role: getRoleFromEmail(email) }
        })),
      register: (fullName, email) =>
        set(() => ({
          isLoggedIn: true,
          user: {
            ...defaultUser,
            fullName,
            email,
            role: "user"
          }
        })),
      addOrder: (order) =>
        set((state) => {
          if (!state.user) {
            return state;
          }

          const nextOrder: MockOrder = {
            id: order.orderNumber,
            date: formatOrderDate(order.createdAt),
            status: "Hazirlaniyor",
            total: order.total
          };

          return {
            user: {
              ...state.user,
              orders: [nextOrder, ...state.user.orders]
            }
          };
        }),
      toggleFavorite: (favoriteSlug) =>
        set((state) => {
          if (!state.user) {
            return state;
          }

          const favorites = normalizeFavorites(state.user.favorites);
          const nextFavorites = favorites.includes(favoriteSlug)
            ? favorites.filter((item) => item !== favoriteSlug)
            : [favoriteSlug, ...favorites];

          return {
            user: {
              ...state.user,
              favorites: nextFavorites
            }
          };
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          user: null
        })
    }),
    {
      name: "pasaj-auth-store",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
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
