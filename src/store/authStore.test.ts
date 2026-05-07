import { act } from "@testing-library/react";
import { useAuthStore } from "./authStore";
import type { OrderRecord } from "../types/order";

const sampleOrder: OrderRecord = {
  id: "order-1",
  orderNumber: "PSJ-100001",
  status: "Hazırlanıyor",
  createdAt: "2026-04-18T10:00:00.000Z",
  customer: {
    fullName: "Bilal Talha",
    phone: "05555555555",
    city: "İstanbul",
    district: "Kartal",
    address: "Demo adres"
  },
  payment: {
    cardName: "BILAL TALHA",
    cardNumberLast4: "4242",
    expireDate: "12/30",
    installment: "Peşin"
  },
  items: [],
  subtotal: 1200,
  shippingCost: 0,
  total: 1200
};

describe("authStore", () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.persist.clearStorage();
      useAuthStore.setState({
        isLoggedIn: true,
        isAuthReady: true,
        isAuthLoading: false,
        authError: "",
        user: {
          uid: "user-1",
          fullName: "Bilal Talha",
          email: "bilal@pasajclone.dev",
          phone: "05xx xxx xx xx",
          membership: "Platin Uye",
          role: "admin",
          orders: [
            { id: "PSJ-24031", date: "28 Mart 2026", status: "Kargoda", total: 79999 },
            { id: "PSJ-23984", date: "25 Mart 2026", status: "Teslim Edildi", total: 9999 }
          ],
          favorites: ["iphone-16-pro-256-gb", "macbook-air-m4-13", "airpods-pro-2"],
          addresses: [
            {
              id: "addr-1",
              title: "Ev",
              detail: "İstanbul / Pendik"
            }
          ]
        }
      });
    });
  });

  it("adds new orders to the beginning of the order history", () => {
    act(() => {
      useAuthStore.getState().addOrder(sampleOrder);
    });

    const orders = useAuthStore.getState().user?.orders ?? [];
    expect(orders[0]?.id).toBe("PSJ-100001");
    expect(orders[0]?.total).toBe(1200);
    expect(orders).toHaveLength(3);
  });

  it("ignores addOrder when there is no active user", () => {
    act(() => {
      useAuthStore.setState({ isLoggedIn: false, user: null, isAuthReady: true });
      useAuthStore.getState().addOrder(sampleOrder);
    });

    expect(useAuthStore.getState().user).toBeNull();
  });

  it("falls back to 'Bugün' for invalid order dates", () => {
    act(() => {
      useAuthStore.getState().addOrder({
        ...sampleOrder,
        orderNumber: "PSJ-INVALID",
        createdAt: "gecersiz-tarih"
      });
    });

    expect(useAuthStore.getState().user?.orders[0]?.date).toBe("Bugün");
  });

  it("adds and removes favorites by product slug", () => {
    act(() => {
      useAuthStore.getState().toggleFavorite("iphone-17-256-gb");
    });

    expect(useAuthStore.getState().user?.favorites[0]).toBe("iphone-17-256-gb");

    act(() => {
      useAuthStore.getState().toggleFavorite("iphone-17-256-gb");
    });

    expect(useAuthStore.getState().user?.favorites.includes("iphone-17-256-gb")).toBe(false);
  });

  it("does not create favorites when there is no active session", () => {
    act(() => {
      useAuthStore.setState({ isLoggedIn: false, user: null, isAuthReady: true });
      useAuthStore.getState().toggleFavorite("iphone-17-256-gb");
    });

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
  });

  it("normalizes legacy favorite names into slugs", () => {
    act(() => {
      useAuthStore.setState((state) => ({
        ...state,
        user: state.user
          ? {
              ...state.user,
              favorites: ["iPhone 16 Pro 256 GB"]
            }
          : null
      }));
      useAuthStore.getState().toggleFavorite("airpods-pro-2");
    });

    expect(useAuthStore.getState().user?.favorites).toEqual(["airpods-pro-2", "iphone-16-pro-256-gb"]);
  });

  it("logs out and clears session data", async () => {
    await act(async () => {
      await useAuthStore.getState().logout();
    });

    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});

