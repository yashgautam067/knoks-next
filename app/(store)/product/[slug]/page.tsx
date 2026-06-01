"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, Heart, Truck, RefreshCw, Shield } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import SizeGuideModal from "@/components/store/SizeGuideModal";
import ReviewSection from "@/components/store/ReviewSection";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { Product, Review } from "@/types";
import { asColors } from "@/types";
import type { IColor } from "@/types";  
import toast from "react-hot-toast";

interface ProductWithReviews extends Product {
  reviews: Review[];
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<IColor | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.data);
          const colors = asColors(data.data.colors);
          if (colors.length > 0) setSelectedColor(colors[0]);
          if (data.data.sizes.length > 0) setSelectedSize(data.data.sizes[1] || data.data.sizes[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <FullPageSpinner />;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-cream">Product not found</div>;

  const colors = asColors(product.colors);
  const discount = calculateDiscount(product.price, product.mrp);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      price: product.price,
      mrp: product.mrp,
      size: selectedSize,
      color: selectedColor?.name || "Default",
      qty,
      stock: product.stock,
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-card border border-border overflow-hidden group">
              {product.images[selectedImage] ? (
                <Image src={product.images[selectedImage]} alt={product.name} fill className="object-contain object-center group-hover:scale-110 transition-transform duration-700" sizes="(max-width:1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><span className="text-red/20 font-heading text-8xl">K</span></div>
              )}
              {product.badge && (
                <div className={cn("absolute top-4 left-4 px-3 py-1.5 text-xs font-heading tracking-widest", product.badge === "BESTSELLER" && "bg-red text-cream", product.badge === "NEW" && "bg-cream text-black", product.badge === "LIMITED" && "bg-gold text-black")}>
                  {product.badge}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={cn("relative w-20 h-20 border overflow-hidden transition-all", selectedImage === i ? "border-red" : "border-border hover:border-silver/50")}>
                    <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-silver/40 text-xs font-heading tracking-[0.2em] uppercase mb-2">{product.category.replace("-", " ")}</p>
              <h1 className="text-cream font-heading text-3xl md:text-4xl tracking-wider mb-3">{product.name}</h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={cn("w-4 h-4", i < Math.round(product.rating) ? "text-gold fill-gold" : "text-border")} />))}</div>
                  <span className="text-cream font-mono text-sm">{product.rating}</span>
                  <span className="text-silver/30 text-sm font-body">({product.review_count} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-cream font-heading text-3xl">{formatPrice(product.price)}</span>
              {discount > 0 && (<><span className="text-silver/30 font-mono text-lg line-through">{formatPrice(product.mrp)}</span><span className="text-red text-sm font-heading tracking-wider">SAVE {discount}%</span></>)}
            </div>

            <p className="text-silver/60 font-body leading-relaxed">{product.description}</p>

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <p className="text-cream text-xs font-heading tracking-widest mb-3">COLOR — {selectedColor?.name}</p>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button key={c.name} onClick={() => setSelectedColor(c)} className={cn("w-10 h-10 rounded-full border-2 transition-all", selectedColor?.name === c.name ? "border-cream scale-110" : "border-border hover:border-silver")} style={{ backgroundColor: c.hex }} title={c.name} />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-cream text-xs font-heading tracking-widest">SIZE</p>
                <button onClick={() => setShowSizeGuide(true)} className="text-red text-xs font-body hover:underline">Size Guide</button>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={cn("w-12 h-12 border text-sm font-heading tracking-wider transition-all", selectedSize === size ? "bg-red border-red text-cream" : "border-border text-silver hover:border-silver hover:text-cream")}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex gap-3 pt-2">
              <div className="flex items-center border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 text-silver hover:text-cream flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center text-cream font-mono">{qty}</span>
                <button onClick={() => setQty(Math.min(10, qty + 1))} className="w-10 h-12 text-silver hover:text-cream flex items-center justify-center"><Plus className="w-4 h-4" /></button>
              </div>
              <Button variant="primary" size="lg" className="flex-1" icon={<ShoppingBag className="w-5 h-5" />} onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <button onClick={() => { toggleItem({ productId: product.id, name: product.name, slug: product.slug, image: product.images[0] || "", price: product.price, mrp: product.mrp }); toast.success(inWishlist ? "Removed" : "Added to wishlist"); }} className={cn("w-12 h-12 border flex items-center justify-center transition-colors", inWishlist ? "bg-red border-red text-cream" : "border-border text-silver hover:text-cream hover:border-silver")}>
                <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
              </button>
            </div>

            {/* Stock */}
            {product.stock < 20 && product.stock > 0 && (
              <p className="text-red text-xs font-body animate-pulse">Only {product.stock} left in stock!</p>
            )}

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              {[{ icon: Truck, text: "Fast delivery" }, { icon: Shield, text: "100% Cotton" }, { icon: Shield, text: "Quality guaranteed" }].map((perk) => (
                <div key={perk.text} className="text-center">
                  <perk.icon className="w-5 h-5 text-silver/30 mx-auto mb-1" />
                  <p className="text-silver/40 text-[10px] font-body">{perk.text}</p>
                </div>
              ))}
            </div>

            {/* Material & Care */}
            {product.material && (
              <div className="pt-4 border-t border-border space-y-2 text-sm">
                <div className="flex"><span className="text-silver/40 font-body w-24">Material</span><span className="text-cream font-body">{product.material}</span></div>
                {product.care_instructions && <div className="flex"><span className="text-silver/40 font-body w-24">Care</span><span className="text-cream font-body">{product.care_instructions}</span></div>}
              </div>
            )}
          </motion.div>
        </div>

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16">
            <ReviewSection reviews={product.reviews} rating={product.rating} reviewCount={product.review_count} />
          </div>
        )}
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
}
