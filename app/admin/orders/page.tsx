"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, Eye, Truck, Package } from "lucide-react";
import { formatPrice, formatDate, ORDER_STATUS_CONFIG, STATUS_MESSAGES, cn } from "@/lib/utils";
import { FullPageSpinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import type { Order } from "@/types";
import { asPricing, asItems, asAddress } from "@/types";
import toast from "react-hot-toast";

const statusOptions = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    if (data.success) setOrders(data.data);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, statusMessage: STATUS_MESSAGES[status] }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(`Order updated to ${status}`);
      fetchOrders();
      setSelectedOrder(null);
    } else {
      toast.error(data.error || "Update failed");
    }
  };

  if (loading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-cream font-heading text-3xl tracking-widest mb-6">ORDERS</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/30" />
          <input
            type="text"
            placeholder="Search by Order ID or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border text-cream pl-10 pr-4 py-2.5 text-sm font-body placeholder:text-silver/30 focus:outline-none focus:border-red"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-card border border-border text-cream px-4 py-2.5 text-sm font-body focus:outline-none focus:border-red"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Order ID</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Status</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Date</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const pricing = asPricing(order.pricing);
                const address = asAddress(order.shipping_address);
                return (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-cream font-mono text-xs">{order.order_id}</td>
                    <td className="py-3 px-4 text-silver font-body text-xs">{address?.full_name || order.guest_name || "—"}</td>
                    <td className="py-3 px-4 text-cream font-mono text-xs">{formatPrice(pricing?.total || 0)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 ${ORDER_STATUS_CONFIG[order.status]?.badgeClass || ""}`}>
                        {ORDER_STATUS_CONFIG[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-silver/50 font-body text-xs">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => setSelectedOrder(order)} className="text-red text-xs font-body hover:underline flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-border mx-auto mb-3" />
            <p className="text-silver/50 font-body text-sm">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder.order_id}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-silver/40 font-body">Status</span><p className="text-cream mt-1">{ORDER_STATUS_CONFIG[selectedOrder.status]?.label}</p></div>
              <div><span className="text-silver/40 font-body">Payment</span><p className="text-cream mt-1">{selectedOrder.payment_status}</p></div>
              <div><span className="text-silver/40 font-body">Amount</span><p className="text-cream font-mono mt-1">{formatPrice(asPricing(selectedOrder.pricing)?.total || 0)}</p></div>
              <div><span className="text-silver/40 font-body">Date</span><p className="text-cream mt-1">{formatDate(selectedOrder.created_at)}</p></div>
            </div>

            {/* Items */}
            <div className="border-t border-border pt-4">
              <h4 className="text-cream text-xs font-heading tracking-widest mb-3">ITEMS</h4>
              {(asItems(selectedOrder.items)).map((item, i) => (
                <div key={i} className="flex justify-between py-1.5 text-sm">
                  <span className="text-silver font-body">{item.name} ({item.size}/{item.color}) × {item.qty}</span>
                  <span className="text-cream font-mono">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Update Status */}
            <div className="border-t border-border pt-4">
              <h4 className="text-cream text-xs font-heading tracking-widest mb-3">UPDATE STATUS</h4>
              <div className="flex flex-wrap gap-2">
                {["confirmed", "packed", "shipped", "delivered", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder.order_id, status)}
                    disabled={selectedOrder.status === status}
                    className={cn(
                      "px-3 py-1.5 text-xs font-heading tracking-widest transition-colors",
                      selectedOrder.status === status ? "bg-silver/10 text-silver/30" : "border border-border text-silver hover:bg-red hover:text-cream hover:border-red"
                    )}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
