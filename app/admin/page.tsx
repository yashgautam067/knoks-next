"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";
import { formatPrice, formatDate, ORDER_STATUS_CONFIG } from "@/lib/utils";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { DashboardStats } from "@/types";
import { asPricing } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) return <FullPageSpinner />;

  const statCards = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      color: "text-green-400",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      color: "text-blue-400",
    },
    {
      icon: Clock,
      label: "Pending Orders",
      value: stats.pendingOrders.toString(),
      color: "text-yellow-400",
    },
    {
      icon: Users,
      label: "Total Customers",
      value: stats.totalCustomers.toString(),
      color: "text-purple-400",
    },
  ];

  return (
    <div>
      <h1 className="text-cream font-heading text-3xl tracking-widest mb-8">
        DASHBOARD
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-silver/50 text-xs font-body">
                {card.label}
              </span>
            </div>
            <p className="text-cream font-heading text-2xl tracking-wider">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="md:col-span-2 bg-card border border-border p-6">
          <h3 className="text-cream text-xs font-heading tracking-widest mb-4">
            REVENUE (30 DAYS)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={stats.revenueData.map((d) => ({
                ...d,
                revenue: d.revenue / 100,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#C0C0C0", fontSize: 10 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis tick={{ fill: "#C0C0C0", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#1C1C1C",
                  border: "1px solid #2A2A2A",
                  color: "#F5F5F0",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#E63946"
                fill="#E63946"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-card border border-border p-6">
          <h3 className="text-cream text-xs font-heading tracking-widest mb-4">
            ORDER STATUS
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.statusBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {stats.statusBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1C1C1C",
                  border: "1px solid #2A2A2A",
                  color: "#F5F5F0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {stats.statusBreakdown.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-silver/50 text-[10px] font-body">
                  {s.name} ({s.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Low Stock */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border p-6">
          <h3 className="text-cream text-xs font-heading tracking-widest mb-4">
            RECENT ORDERS
          </h3>
          <div className="space-y-3">
            {stats.recentOrders.slice(0, 5).map((order) => {
              const pricing = asPricing(order.pricing);
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="text-cream text-sm font-mono">
                      {order.order_id}
                    </p>
                    <p className="text-silver/30 text-[10px] font-body">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-cream text-sm font-mono">
                      {formatPrice(pricing?.total || 0)}
                    </p>
                    <span
                      className={`text-[10px] font-heading tracking-wider ${
                        ORDER_STATUS_CONFIG[order.status]?.badgeClass || ""
                      }`}
                    >
                      {ORDER_STATUS_CONFIG[order.status]?.label || order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-card border border-border p-6">
          <h3 className="text-cream text-xs font-heading tracking-widest mb-4">
            <AlertTriangle className="w-4 h-4 text-yellow-500 inline mr-2" />
            LOW STOCK ALERTS
          </h3>
          <div className="space-y-3">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-silver/30 text-sm font-body">
                All products are well stocked
              </p>
            ) : (
              stats.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <p className="text-cream text-sm font-body truncate mr-4">
                    {product.name}
                  </p>
                  <span
                    className={`text-xs font-mono whitespace-nowrap ${
                      product.stock < 5
                        ? "text-red"
                        : "text-yellow-500"
                    }`}
                  >
                    {product.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
