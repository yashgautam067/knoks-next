"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AddressesPage() {
  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/account" className="text-silver/40 text-xs font-body hover:text-cream transition-colors">← Back to Account</Link>
          <div className="flex items-center justify-between mt-4 mb-8">
            <h1 className="text-cream font-heading text-4xl tracking-widest">ADDRESSES</h1>
            <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />}>Add New</Button>
          </div>

          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-border mx-auto mb-4" />
            <p className="text-cream font-heading text-xl tracking-widest mb-2">NO SAVED ADDRESSES</p>
            <p className="text-silver/50 text-sm font-body">Add an address during checkout and it will appear here</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
