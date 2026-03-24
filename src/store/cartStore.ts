import { create } from 'zustand';

interface CartState {
  totalItems: number;
  setTotalItems: (count: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  totalItems: 2,
  setTotalItems: (count) => set({ totalItems: count }),
}));
