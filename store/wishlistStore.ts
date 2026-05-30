"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/types";

interface WishlistState {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (item: WishlistItem) => {
        const exists = get().items.find(
          (i) => i.productId === item.productId
        );
        if (exists) {
          set((state) => ({
            items: state.items.filter(
              (i) => i.productId !== item.productId
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      isInWishlist: (productId: string) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "knoks-wishlist" }
  )
);
