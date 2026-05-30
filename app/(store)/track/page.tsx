"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, XCircle, Clock, PackageCheck } from "lucide-react";
import { formatPrice, formatDate, ORDER_STATUS_CONFIG } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { Order } from "@/types";
import { asPricing, asItems, asTimeline } from "@/types";

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle2,
  packed: PackageCheck,
  shipped: Truck,
  delivered: Package,
  cancelled: XCircle,
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${orderId.trim()}`);
      const data = await res.json();
      if (data.success) { setOrder(data.data); }
      else { setError("Order not found"); setOrder(null); }
    } catch { setError("Something went wrong"); }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-cream font-heading text-4xl tracking-widest text-center mb-2">TRACK ORDER</h1>
          <p className="text-silver/50 font-body text-center mb-8">Enter your order ID to track your delivery</p>

          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/30" />
              <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="KNK-XXXXXX" className="w-full bg-card border border-border text-cream pl-10 pr-4 py-3 font-mono text-sm placeholder:text-silver/30 focus:outline-none focus:border-red tracking-wider" />
            </div>
            <Button variant="primary" onClick={handleSearch} isLoading={loading}>Track</Button>
          </div>

          {error && <p className="text-red text-sm font-body text-center mb-4">{error}</p>}

          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-cream font-mono text-lg">{order.order_id}</p>
                  <p className="text-silver/40 text-xs font-body mt-1">{formatDate(order.created_at)}</p>
                </div>
                <span className={`text-xs font-heading tracking-wider uppercase px-3 py-1 ${ORDER_STATUS_CONFIG[order.status]?.badgeClass || ""}`}>
                  {ORDER_STATUS_CONFIG[order.status]?.label || order.status}
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-0 mb-6">
                {asTimeline(order.tracking_timeline).map((event, i) => {
                  const Icon = statusIcons[event.status] || Clock;
                  const isLast = i === asTimeline(order.tracking_timeline).length - 1;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isLast ? "border-red bg-red/10" : "border-border bg-charcoal"}`}>
                          <Icon className={`w-4 h-4 ${isLast ? "text-red" : "text-silver/50"}`} />
                        </div>
                        {i < asTimeline(order.tracking_timeline).length - 1 && <div className="w-[2px] h-8 bg-border" />}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-body ${isLast ? "text-cream" : "text-silver/50"}`}>{event.message}</p>
                        <p className="text-silver/30 text-[10px] font-body mt-0.5">{formatDate(event.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Items */}
              <div className="border-t border-border pt-4 space-y-2">
                {asItems(order.items).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-silver font-body">{item.name} ({item.size}) × {item.qty}</span>
                    <span className="text-cream font-mono">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-cream font-semibold pt-2 border-t border-border">
                  <span className="font-body">Total</span>
                  <span className="font-mono">{formatPrice(asPricing(order.pricing)?.total || 0)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
