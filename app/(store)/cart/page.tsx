"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, removeItem, updateQty, getSubtotal, getShipping, getTotal } =
    useCartStore();
  const subtotal = getSubtotal();
  const shipping = getShipping("standard");
  const total = getTotal("standard");

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-border mx-auto mb-6" />
          <h1 className="text-cream font-heading text-3xl tracking-widest mb-4">
            YOUR CART IS EMPTY
          </h1>
          <p className="text-silver/50 font-body mb-8">
            Add some products to get started
          </p>
          <Link href="/shop">
            <Button
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-cream font-heading text-4xl tracking-widest mb-8"
        >
          YOUR CART
        </motion.h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.size}-${item.color}`}
                layout
                className="flex gap-4 bg-card border border-border p-4"
              >
                <div className="w-24 h-24 bg-charcoal border border-border flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-red/30 font-heading text-2xl">K</span>
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-cream font-body font-medium hover:text-silver transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-silver/40 text-xs font-body mt-1">
                    {item.size} / {item.color}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQty(
                            item.productId,
                            item.size,
                            item.color,
                            item.qty - 1
                          )
                        }
                        disabled={item.qty <= 1}
                        className="w-8 h-8 border border-border text-silver hover:text-cream hover:border-silver disabled:opacity-30 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-cream font-mono">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(
                            item.productId,
                            item.size,
                            item.color,
                            item.qty + 1
                          )
                        }
                        disabled={item.qty >= 10}
                        className="w-8 h-8 border border-border text-silver hover:text-cream hover:border-silver disabled:opacity-30 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-cream font-mono">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    removeItem(item.productId, item.size, item.color)
                  }
                  className="text-silver/30 hover:text-red transition-colors self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card border border-border p-6 sticky top-24 space-y-4">
              <h3 className="text-cream font-heading text-lg tracking-widest">
                ORDER SUMMARY
              </h3>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-silver">
                  <span>Subtotal</span>
                  <span className="font-mono text-cream">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>Shipping</span>
                  <span className="font-mono text-cream">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-cream font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="font-mono text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
              <Link href="/checkout">
                <Button variant="primary" className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-center text-silver/30 text-xs font-body">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                  free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
