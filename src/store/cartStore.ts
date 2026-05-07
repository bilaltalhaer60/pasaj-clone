import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";
import { useUiStore } from "./uiStore";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  ownerKey: string;
  cartsByOwner: Record<string, CartItem[]>;
  items: CartItem[];
  setOwner: (ownerKey: string) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const guestOwnerKey = "guest";

const getOwnerItems = (state: CartState) => state.cartsByOwner[state.ownerKey] ?? [];

const writeOwnerItems = (state: CartState, items: CartItem[]) => ({
  items,
  cartsByOwner: {
    ...state.cartsByOwner,
    [state.ownerKey]: items
  }
});

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ownerKey: guestOwnerKey,
      cartsByOwner: {
        [guestOwnerKey]: []
      },
      items: [],
      setOwner: (ownerKey) =>
        set((state) => ({
          ownerKey,
          items: state.cartsByOwner[ownerKey] ?? []
        })),
      addItem: (product) => {
        set((state) => {
          const ownerItems = getOwnerItems(state);
          const existing = ownerItems.find((item) => item.product.id === product.id);

          if (existing) {
            return writeOwnerItems(
              state,
              ownerItems.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + 1, 5) }
                  : item
              )
            );
          }

          return writeOwnerItems(state, [...ownerItems, { product, quantity: 1 }]);
        });
        useUiStore.getState().showToast(`${product.name} sepete eklendi.`);
      },
      removeItem: (productId) => {
        set((state) =>
          writeOwnerItems(
            state,
            getOwnerItems(state).filter((item) => item.product.id !== productId)
          )
        );
        useUiStore.getState().showToast("Ürün sepetten silindi.");
      },
      updateQuantity: (productId, quantity) =>
        set((state) =>
          writeOwnerItems(
            state,
            getOwnerItems(state)
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.max(1, Math.min(quantity, 5)) }
                : item
            )
            .filter((item) => item.quantity > 0)
          )
        ),
      clearCart: () => set((state) => writeOwnerItems(state, []))
    }),
    {
      name: "pasaj-cart-store",
      partialize: (state) => ({
        ownerKey: state.ownerKey,
        cartsByOwner: {
          ...state.cartsByOwner,
          [state.ownerKey]: state.items
        },
        items: state.items
      })
    }
  )
);

export const getCartItemCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0);

export const getCartSubtotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const getCartRemainingForFreeShipping = (items: CartItem[], threshold: number) =>
  Math.max(threshold - getCartSubtotal(items), 0);

