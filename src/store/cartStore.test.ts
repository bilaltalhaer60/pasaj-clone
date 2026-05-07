import { act } from "@testing-library/react";
import {
  getCartItemCount,
  getCartRemainingForFreeShipping,
  getCartSubtotal,
  useCartStore
} from "./cartStore";
import type { Product } from "../types/product";

const product = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  slug: "iphone-16",
  name: "iPhone 16",
  brand: "Apple",
  category: "Telefon",
  stock: 8,
  price: 1000,
  previousPrice: 1200,
  discount: 17,
  popularity: 10,
  rating: 4.8,
  reviewCount: 12,
  installment: "3 taksit",
  badge: "Yeni",
  image: "/phone.png",
  summary: "Demo",
  shippingNote: "Hızlı teslimat",
  highlights: ["A", "B"],
  specs: [{ label: "RAM", value: "8 GB" }],
  ...overrides
});

describe("cartStore", () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({
        ownerKey: "guest",
        cartsByOwner: {
          guest: []
        },
        items: []
      });
      window.localStorage.clear();
    });
  });

  it("adds a new product with quantity one", () => {
    act(() => {
      useCartStore.getState().addItem(product());
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.quantity).toBe(1);
  });

  it("increments quantity when the same product is added again", () => {
    act(() => {
      const store = useCartStore.getState();
      store.addItem(product());
      store.addItem(product());
    });

    expect(useCartStore.getState().items[0]?.quantity).toBe(2);
  });

  it("caps product quantity at five", () => {
    act(() => {
      const store = useCartStore.getState();
      for (let index = 0; index < 7; index += 1) {
        store.addItem(product());
      }
    });

    expect(useCartStore.getState().items[0]?.quantity).toBe(5);
  });

  it("removes a product by id", () => {
    act(() => {
      const store = useCartStore.getState();
      store.addItem(product());
      store.removeItem("p1");
    });

    expect(useCartStore.getState().items).toEqual([]);
  });

  it("updates quantity within the supported range", () => {
    act(() => {
      const store = useCartStore.getState();
      store.addItem(product());
      store.addItem(product({ id: "p2", slug: "ipad", name: "iPad" }));
      store.updateQuantity("p1", 4);
    });

    expect(useCartStore.getState().items[0]?.quantity).toBe(4);
    expect(useCartStore.getState().items[1]?.quantity).toBe(1);
  });

  it("clamps quantity updates below one and above five", () => {
    act(() => {
      const store = useCartStore.getState();
      store.addItem(product());
      store.updateQuantity("p1", 0);
    });
    expect(useCartStore.getState().items[0]?.quantity).toBe(1);

    act(() => {
      useCartStore.getState().updateQuantity("p1", 10);
    });
    expect(useCartStore.getState().items[0]?.quantity).toBe(5);
  });

  it("clears the entire cart", () => {
    act(() => {
      const store = useCartStore.getState();
      store.addItem(product());
      store.addItem(product({ id: "p2", slug: "ipad", name: "iPad" }));
      store.clearCart();
    });

    expect(useCartStore.getState().items).toEqual([]);
  });

  it("keeps carts separate for different signed-in users", () => {
    act(() => {
      const store = useCartStore.getState();
      store.setOwner("user-a");
      store.addItem(product());
      store.setOwner("user-b");
      store.addItem(product({ id: "p2", slug: "ipad", name: "iPad" }));
      store.setOwner("user-a");
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.product.id).toBe("p1");

    act(() => {
      useCartStore.getState().setOwner("user-b");
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.product.id).toBe("p2");
  });

  it("calculates derived totals and free shipping remainder", () => {
    const items = [
      { product: product(), quantity: 2 },
      { product: product({ id: "p2", price: 250 }), quantity: 1 }
    ];

    expect(getCartItemCount(items)).toBe(3);
    expect(getCartSubtotal(items)).toBe(2250);
    expect(getCartRemainingForFreeShipping(items, 3000)).toBe(750);
    expect(getCartRemainingForFreeShipping(items, 1000)).toBe(0);
  });
});

