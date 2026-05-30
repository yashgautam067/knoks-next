import type { Database, Json } from "./supabase";

/* ─── Row Type Aliases ─── */

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Newsletter = Database["public"]["Tables"]["newsletter"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];

/* ─── JSON Column Cast Helpers ─── */
// Supabase types JSON columns as `Json`. These helpers safely cast them.
export function asPricing(j: Json): IPricing {
  return j as unknown as IPricing;
}
export function asItems(j: Json): IOrderItem[] {
  return (j as unknown as IOrderItem[]) || [];
}
export function asAddress(j: Json): IShippingAddress {
  return j as unknown as IShippingAddress;
}
export function asTimeline(j: Json): ITrackingEvent[] {
  return (j as unknown as ITrackingEvent[]) || [];
}
export function asColors(j: Json): IColor[] {
  return (j as unknown as IColor[]) || [];
}

/* ─── Parsed JSON Sub-types ─── */

export interface IColor {
  name: string;
  hex: string;
}

export interface IOrderItem {
  product_id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  qty: number;
  price: number; // paise
}

export interface IShippingAddress {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IPricing {
  subtotal: number; // paise
  discount: number;
  shipping: number;
  total: number;
}

export interface ITrackingEvent {
  status: string;
  message: string;
  timestamp: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

/* ─── Cart Types ─── */

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number; // paise
  mrp: number; // paise
  size: string;
  color: string;
  qty: number;
  stock: number;
}

export interface CouponResult {
  valid: boolean;
  code: string;
  type: "percent" | "flat";
  value: number;
  discount: number; // paise
  message: string;
}

/* ─── Filter Types ─── */

export interface ProductFilters {
  category?: string;
  sort?: string;
  size?: string;
  color?: string;
  minPrice?: number; // paise
  maxPrice?: number; // paise
  page?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

/* ─── Admin Types ─── */

export interface DashboardStats {
  totalRevenue: number; // paise
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  revenueData: { date: string; revenue: number }[];
  statusBreakdown: { name: string; value: number; color: string }[];
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  orderCount: number;
  totalSpent: number; // paise
  created_at: string;
}

/* ─── API Response ─── */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

/* ─── Wishlist ─── */

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number; // paise
  mrp: number; // paise
}

/* ─── Indian States ─── */

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

/* ─── Size Chart ─── */

export const SIZE_CHART = {
  S: { waist: "28-30", hip: "34-36" },
  M: { waist: "30-32", hip: "36-38" },
  L: { waist: "32-34", hip: "38-40" },
  XL: { waist: "34-36", hip: "40-42" },
  XXL: { waist: "36-38", hip: "42-44" },
} as const;
