"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product, PaginatedResponse, ProductFilters } from "@/types";

export function useProducts(filters?: ProductFilters) {
  const [data, setData] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (filters?.category) params.set("category", filters.category);
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.size) params.set("size", filters.size);
    if (filters?.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.search) params.set("search", filters.search);

    try {
      const res = await fetch(`/api/products?${params}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setTotal(json.total);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [
    filters?.category,
    filters?.sort,
    filters?.size,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.page,
    filters?.search,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products: data, total, loading, refetch: fetchProducts };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProduct(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading };
}
