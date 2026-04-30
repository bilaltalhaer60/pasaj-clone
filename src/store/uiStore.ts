import { create } from "zustand";

interface UiState {
  isCartDrawerOpen: boolean;
  toast: {
    id: number;
    message: string;
    type: "success" | "info";
  } | null;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  showToast: (message: string, type?: "success" | "info") => void;
  clearToast: (id?: number) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCartDrawerOpen: false,
  toast: null,
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  showToast: (message, type = "success") =>
    set({
      toast: {
        id: Date.now(),
        message,
        type
      }
    }),
  clearToast: (id) =>
    set((state) => {
      if (id && state.toast?.id !== id) {
        return state;
      }

      return { toast: null };
    })
}));

