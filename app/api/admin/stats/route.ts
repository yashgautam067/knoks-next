import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { asPricing } from "@/types";
import type { Order, Product } from "@/types";

export async function GET() {
  try {
    // Total orders
    const { count: totalOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Pending orders
    const { count: pendingOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Total customers
    const { count: totalCustomers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user");

    // Revenue — sum from paid orders
    const { data: paidData } = await supabaseAdmin
      .from("orders")
      .select("pricing")
      .eq("payment_status", "paid");

    const paidOrders = (paidData || []) as Pick<Order, "pricing">[];
    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + (asPricing(order.pricing)?.total || 0),
      0
    );

    // Revenue data — last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentPaidData } = await supabaseAdmin
      .from("orders")
      .select("pricing, created_at")
      .eq("payment_status", "paid")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    const recentPaidOrders = (recentPaidData || []) as Pick<Order, "pricing" | "created_at">[];
    const revenueMap: Record<string, number> = {};
    recentPaidOrders.forEach((order) => {
      const date = new Date(order.created_at).toISOString().split("T")[0];
      revenueMap[date] =
        (revenueMap[date] || 0) + (asPricing(order.pricing)?.total || 0);
    });

    const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    // Status breakdown
    const statusList = [
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
    ] as const;
    const statusBreakdown = await Promise.all(
      statusList.map(async (status) => {
        const { count } = await supabaseAdmin
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", status);
        return {
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count || 0,
          color:
            ({
              pending: "#eab308",
              confirmed: "#3b82f6",
              packed: "#a855f7",
              shipped: "#f97316",
              delivered: "#22c55e",
              cancelled: "#E63946",
            } as Record<string, string>)[status] || "#C0C0C0",
        };
      })
    );

    // Recent orders
    const { data: recentData } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    const recentOrders = (recentData || []) as Order[];

    // Low stock products
    const { data: lowStockData } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("is_active", true)
      .lt("stock", 20)
      .order("stock", { ascending: true })
      .limit(5);

    const lowStockProducts = (lowStockData || []) as Product[];

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalCustomers: totalCustomers || 0,
        revenueData,
        statusBreakdown,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
