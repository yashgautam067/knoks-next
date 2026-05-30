import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { getShippingCost, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number; // paise
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQty: (
    productId: string,
    size: string,
    color: string,
    qty: number
  ) => void;
  clearCart: () => void;
  applyCouponResult: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getShipping: (type: "standard" | "express") => number;
  getTotal: (type: "standard" | "express") => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (item: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].qty = Math.min(
              newItems[existingIndex].qty + item.qty,
              item.stock
            );
            return { items: newItems };
          }

          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.size === size &&
                i.color === color
              )
          ),
        }));
      },

      updateQty: (productId, size, color, qty) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) }
              : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 });
      },

      applyCouponResult: (code: string, discount: number) => {
        set({ couponCode: code, couponDiscount: discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },

      getShipping: (type) => {
        const subtotal = get().getSubtotal();
        return getShippingCost(subtotal, type);
      },

      getTotal: (type) => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShipping(type);
        const discount = get().couponDiscount;
        return subtotal - discount + shipping;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },
    }),
    {
      name: "knoks-cart",
    }
  )
);
