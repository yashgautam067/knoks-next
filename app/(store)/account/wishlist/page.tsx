"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <Heart className="w-20 h-20 text-border mx-auto mb-6" />
          <h1 className="text-cream font-heading text-3xl tracking-widest mb-4">WISHLIST EMPTY</h1>
          <p className="text-silver/50 font-body mb-8">Save items you love for later</p>
          <Link href="/shop"><Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>Browse Shop</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <Link href="/account" className="text-silver/40 text-xs font-body hover:text-cream transition-colors">← Back to Account</Link>
        <h1 className="text-cream font-heading text-4xl tracking-widest mt-4 mb-8">WISHLIST ({items.length})</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const discount = calculateDiscount(item.price, item.mrp);
            return (
              <motion.div key={item.productId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border group overflow-hidden">
                <Link href={`/product/${item.slug}`}>
                  <div className="relative aspect-[3/4]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-charcoal flex items-center justify-center"><span className="text-red/20 font-heading text-6xl">K</span></div>
                    )}
                  </div>
                </Link>
                <div className="p-4 space-y-2">
                  <h3 className="text-cream text-sm font-body font-medium line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-cream font-mono text-sm">{formatPrice(item.price)}</span>
                    {discount > 0 && <span className="text-silver/30 font-mono text-xs line-through">{formatPrice(item.mrp)}</span>}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => { addToCart({ productId: item.productId, name: item.name, slug: item.slug, image: item.image, price: item.price, mrp: item.mrp, size: "M", color: "Default", qty: 1, stock: 100 }); removeItem(item.productId); toast.success("Moved to cart!"); }} className="flex-1 bg-red hover:bg-red-dark text-cream text-[10px] font-heading tracking-widest py-2 flex items-center justify-center gap-1 transition-colors">
                      <ShoppingBag className="w-3 h-3" /> MOVE TO CART
                    </button>
                    <button onClick={() => { removeItem(item.productId); toast.success("Removed"); }} className="w-8 border border-border text-silver hover:text-red hover:border-red flex items-center justify-center transition-colors">
                      <Heart className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
