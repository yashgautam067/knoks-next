"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { CustomerData } from "@/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/customers?${params}`);
    const data = await res.json();
    if (data.success) setCustomers(data.data);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  if (loading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-cream font-heading text-3xl tracking-widest mb-6">CUSTOMERS</h1>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/30" />
        <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card border border-border text-cream pl-10 pr-4 py-2.5 text-sm font-body placeholder:text-silver/30 focus:outline-none focus:border-red" />
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Name</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Phone</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Orders</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Total Spent</th>
                <th className="text-left py-3 px-4 text-silver/50 font-heading tracking-widest text-[10px] uppercase">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-cream font-body text-sm">{customer.name}</td>
                  <td className="py-3 px-4 text-silver font-body text-xs">{customer.phone || "—"}</td>
                  <td className="py-3 px-4 text-cream font-mono text-xs">{customer.orderCount}</td>
                  <td className="py-3 px-4 text-cream font-mono text-xs">{formatPrice(customer.totalSpent)}</td>
                  <td className="py-3 px-4 text-silver/50 font-body text-xs">{formatDate(customer.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-border mx-auto mb-3" />
            <p className="text-silver/50 font-body text-sm">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
