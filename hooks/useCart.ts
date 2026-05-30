"use client";

import { useCartStore } from "@/store/cartStore";

export function useCart() {
  const store = useCartStore();

  return {
    items: store.items,
    itemCount: store.getItemCount(),
    subtotal: store.getSubtotal(),
    couponCode: store.couponCode,
    couponDiscount: store.couponDiscount,

    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQty: store.updateQty,
    clearCart: store.clearCart,
    applyCoupon: store.applyCouponResult,
    removeCoupon: store.removeCoupon,

    getShipping: store.getShipping,
    getTotal: store.getTotal,

    isEmpty: store.items.length === 0,
  };
}
