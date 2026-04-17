import { act } from "@testing-library/react";
import { useAuthStore } from "./authStore";
import type { OrderRecord } from "../types/order";

const sampleOrder: OrderRecord = {
  id: "order-1",
  orderNumber: "PSJ-100001",
  status: "Hazirlaniyor",
  createdAt: "2026-04-18T10:00:00.000Z",
  customer: {
    fullName: "Bilal Talha",
    phone: "05555555555",
    city: "Istanbul",
    district: "Kartal",
    address: "Demo adres"
  },
  payment: {
    cardName: "BILAL TALHA",
    cardNumberLast4: "4242",
    expireDate: "12/30",
    installment: "Pesin"
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
        user: {
          fullName: "Bilal Talha",
          email: "bilal@pasajclone.dev",
          phone: "05xx xxx xx xx",
          membership: "Platin Uye",
          role: "admin",
          orders: [
            { id: "PSJ-24031", date: "28 Mart 2026", status: "Kargoda", total: 79999 },
            { id: "PSJ-23984", date: "25 Mart 2026", status: "Teslim Edildi", total: 9999 }
          ],
          favorites: ["iPhone 16 Pro 256 GB", "MacBook Air M4 13 in", "AirPods Pro 2"],
          addresses: [
            {
              id: "addr-1",
              title: "Ev",
              detail: "Istanbul / Pendik"
            }
          ]
        }
      });
    });
  });

  it("logs in and keeps admin role for admin-like emails", () => {
    act(() => {
      useAuthStore.getState().login("admin@pasajclone.dev");
    });

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.user?.email).toBe("admin@pasajclone.dev");
    expect(state.user?.role).toBe("admin");
  });

  it("logs in as a regular user for non-admin emails", () => {
    act(() => {
      useAuthStore.getState().login("user@example.com");
    });

    expect(useAuthStore.getState().user?.role).toBe("user");
  });

  it("creates a fallback user when login runs without an existing profile", () => {
    act(() => {
      useAuthStore.setState({ isLoggedIn: false, user: null });
      useAuthStore.getState().login("admin-reset@example.com");
    });

    const user = useAuthStore.getState().user;
    expect(user?.fullName).toBe("Bilal Talha");
    expect(user?.role).toBe("admin");
  });

  it("registers a new user and forces the user role", () => {
    act(() => {
      useAuthStore.getState().register("Yeni Kullanici", "new@example.com");
    });

    const user = useAuthStore.getState().user;
    expect(user?.fullName).toBe("Yeni Kullanici");
    expect(user?.email).toBe("new@example.com");
    expect(user?.role).toBe("user");
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
      useAuthStore.setState({ isLoggedIn: false, user: null });
      useAuthStore.getState().addOrder(sampleOrder);
    });

    expect(useAuthStore.getState().user).toBeNull();
  });

  it("falls back to 'Bugun' for invalid order dates", () => {
    act(() => {
      useAuthStore.getState().addOrder({
        ...sampleOrder,
        orderNumber: "PSJ-INVALID",
        createdAt: "gecersiz-tarih"
      });
    });

    expect(useAuthStore.getState().user?.orders[0]?.date).toBe("Bugun");
  });

  it("logs out and clears session data", () => {
    act(() => {
      useAuthStore.getState().logout();
    });

    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
