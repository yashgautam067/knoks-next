"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { Product } from "@/types";

const categories = [
  { value: "", label: "All" },
  { value: "boxer-brief", label: "Boxer Briefs" },
  { value: "trunk", label: "Trunks" },
  { value: "brief", label: "Briefs" },
  { value: "pack", label: "Packs" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("sort", sort);
    params.set("limit", "50");

    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, sort]);

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-cream font-heading text-4xl md:text-5xl tracking-widest mb-2">
            {category
              ? categories.find((c) => c.value === category)?.label?.toUpperCase()
              : "SHOP ALL"}
          </h1>
          <p className="text-silver/40 font-body">
            {products.length} products
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-border pb-4">
          <div className="hidden md:flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 text-xs font-heading tracking-widest transition-all ${
                  category === cat.value
                    ? "bg-gold text-black"
                    : "text-silver/50 hover:text-cream"
                }`}
              >
                {cat.label.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 text-silver text-sm font-body"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 bg-card border border-border text-cream text-sm font-body px-4 py-2.5 hover:border-silver/30 transition-colors focus:outline-none focus:border-gold min-w-[180px] justify-between"
            >
              <span>{sortOptions.find((o) => o.value === sort)?.label}</span>
              <svg
                className={`w-4 h-4 text-silver/50 transition-transform duration-200 ${showSort ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showSort && (
              <>
                {/* Invisible backdrop to close dropdown */}
                <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-charcoal border border-border min-w-[200px] shadow-xl shadow-black/50">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value);
                        setShowSort(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors ${
                        sort === opt.value
                          ? "bg-gold/10 text-gold"
                          : "text-silver/70 hover:bg-card hover:text-cream"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            className="md:hidden mb-6 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pb-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategory(cat.value);
                    setShowFilters(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-heading tracking-widest ${
                    category === cat.value
                      ? "bg-gold text-black"
                      : "border border-border text-silver"
                  }`}
                >
                  {cat.label.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <FullPageSpinner />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream font-heading text-xl tracking-widest mb-2">
              NO PRODUCTS FOUND
            </p>
            <p className="text-silver/50 font-body text-sm">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <ShopContent />
    </Suspense>
  );
}

