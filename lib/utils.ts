import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats paise to display ₹. E.g., 49900 → "₹499" */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

/** Calculate discount percentage from price & mrp (both paise) */
export function calculateDiscount(price: number, mrp: number): number {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "KNK-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Returns estimated delivery date, skipping Sundays */
export function getEstimatedDelivery(type: "standard" | "express"): Date {
  const days = type === "express" ? 3 : 7;
  const date = new Date();
  let addedDays = 0;
  while (addedDays < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) addedDays++;
  }
  return date;
}

/** All values in paise */
export function getShippingCost(
  subtotalPaise: number,
  type: "standard" | "express"
): number {
  if (type === "express") return 14900; // ₹149
  return subtotalPaise >= 99900 ? 0 : 6000; // Free over ₹999, else ₹60
}

export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    color: "#eab308",
    badgeClass: "badge-pending",
  },
  confirmed: {
    label: "Confirmed",
    color: "#3b82f6",
    badgeClass: "badge-confirmed",
  },
  packed: {
    label: "Packed",
    color: "#a855f7",
    badgeClass: "badge-packed",
  },
  shipped: {
    label: "Shipped",
    color: "#f97316",
    badgeClass: "badge-shipped",
  },
  delivered: {
    label: "Delivered",
    color: "#22c55e",
    badgeClass: "badge-delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "#E63946",
    badgeClass: "badge-cancelled",
  },
};

export const STATUS_MESSAGES: Record<string, string> = {
  pending: "Order placed successfully",
  confirmed: "Order has been confirmed",
  packed: "Your order has been packed and is ready for dispatch",
  shipped: "Your order is on its way!",
  delivered: "Your order has been delivered",
  cancelled: "Order has been cancelled",
};

/** Free shipping threshold in paise */
export const FREE_SHIPPING_THRESHOLD = 99900; // ₹999
