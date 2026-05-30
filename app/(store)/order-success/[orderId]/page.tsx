"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="pt-24 pb-20 bg-black min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
        >
          <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
        </motion.div>

        <h1 className="text-cream font-heading text-4xl tracking-widest mb-4">ORDER CONFIRMED!</h1>
        <p className="text-silver/60 font-body mb-2">Your order has been placed successfully.</p>

        <div className="bg-card border border-border p-6 my-8">
          <p className="text-silver/40 text-xs font-heading tracking-widest mb-2">ORDER ID</p>
          <p className="text-cream font-mono text-2xl tracking-wider">{params.orderId}</p>
        </div>

        <p className="text-silver/40 font-body text-sm mb-8">
          We&apos;ve sent a confirmation email with your order details. You can track your order anytime.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/track">
            <Button variant="primary" className="w-full" icon={<Package className="w-4 h-4" />}>Track Order</Button>
          </Link>
          <Link href="/shop">
            <Button variant="secondary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>Continue Shopping</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
