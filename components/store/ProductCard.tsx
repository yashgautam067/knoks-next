"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";
import { asColors } from "@/types";
import type { IColor } from "@/types";  
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const colors = asColors(product.colors);
  const discount = calculateDiscount(product.price, product.mrp);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      price: product.price,
      mrp: product.mrp,
      size: product.sizes[1] || product.sizes[0] || "M",
      color: colors[0]?.name || "Default",
      qty: 1,
      stock: product.stock,
    });
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      price: product.price,
      mrp: product.mrp,
    });
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="bg-card border border-border overflow-hidden transition-all duration-300 hover:border-silver/30 hover:shadow-lg hover:shadow-gold/5">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-black">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-card to-charcoal flex items-center justify-center">
                <span className="text-gold/20 font-heading text-6xl">K</span>
              </div>
            )}

            {/* Badge */}
            {product.badge && (
              <div
                className={cn(
                  "absolute top-3 left-3 px-2 py-1 text-[10px] font-heading tracking-[0.15em]",
                  product.badge === "BESTSELLER" &&
                    "bg-gold text-black",
                  product.badge === "NEW" &&
                    "bg-cream text-black",
                  product.badge === "LIMITED" &&
                    "bg-gold text-black"
                )}
              >
                {product.badge}
              </div>
            )}

            {/* Discount */}
            {discount > 0 && (
              <div className="absolute top-3 right-3 bg-gold text-black text-[10px] font-mono px-2 py-0.5">
                -{discount}%
              </div>
            )}

            {/* Hover Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gold hover:bg-gold-dark text-black text-[10px] font-heading tracking-widest py-2.5 flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                ADD TO CART
              </button>
              <button
                onClick={handleToggleWishlist}
                className={cn(
                  "w-10 border flex items-center justify-center transition-colors",
                  inWishlist
                    ? "bg-gold border-gold text-black"
                    : "border-border bg-black/80 text-silver hover:text-cream hover:border-silver"
                )}
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    inWishlist && "fill-current"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <h3 className="text-cream text-sm font-body font-medium line-clamp-2 group-hover:text-silver transition-colors">
              {product.name}
            </h3>
            <p className="text-silver/40 text-xs font-body line-clamp-1">
              {product.short_desc}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-cream font-mono text-sm">
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <span className="text-silver/30 font-mono text-xs line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="flex gap-1.5 pt-1">
                {colors.map((color) => (
                  <div
                    key={color.name}
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            )}

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-gold text-xs">★</span>
                <span className="text-cream text-xs font-mono">
                  {product.rating}
                </span>
                <span className="text-silver/30 text-xs font-body">
                  ({product.review_count})
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
