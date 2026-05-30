"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice, formatDate, ORDER_STATUS_CONFIG } from "@/lib/utils";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { Package } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Order } from "@/types";
import { asPricing, asItems } from "@/types";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner />;

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/account"
            className="text-silver/40 text-xs font-body hover:text-cream transition-colors"
          >
            ← Back to Account
          </Link>
          <h1 className="text-cream font-heading text-4xl tracking-widest mt-4 mb-8">
            MY ORDERS
          </h1>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-border mx-auto mb-4" />
              <p className="text-cream font-heading text-xl tracking-widest mb-4">
                NO ORDERS YET
              </p>
              <Link href="/shop">
                <Button variant="primary">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const pricing = asPricing(order.pricing);
                const items = asItems(order.items);
                const statusConfig =
                  ORDER_STATUS_CONFIG[order.status] ||
                  ORDER_STATUS_CONFIG.pending;
                return (
                  <Link key={order.id} href="/track">
                    <div className="bg-card border border-border p-4 md:p-6 hover:border-silver/30 transition-colors mb-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <span className="text-cream font-mono text-sm">
                            {order.order_id}
                          </span>
                          <p className="text-silver/40 text-xs font-body mt-1">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-cream font-mono">
                            {formatPrice(pricing?.total || 0)}
                          </span>
                          <span
                            className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 ${statusConfig.badgeClass}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {(items || []).slice(0, 3).map((item, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 bg-charcoal border border-border flex items-center justify-center overflow-hidden"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-red/20 font-heading text-xs">
                                K
                              </span>
                            )}
                          </div>
                        ))}
                        {(items || []).length > 3 && (
                          <div className="w-10 h-10 bg-charcoal border border-border flex items-center justify-center text-silver/30 text-xs">
                            +{items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
