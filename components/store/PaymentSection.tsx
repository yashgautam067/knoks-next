"use client";

import { useState } from "react";
import Script from "next/script";
import { Shield, CreditCard, Smartphone, Building2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface PaymentSectionProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: () => void) => void;
    };
  }
}

export default function PaymentSection({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
}: PaymentSectionProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create Razorpay order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customerName,
          customerEmail,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.data.amount,
        currency: data.data.currency,
        name: "KNOKS",
        description: "Premium Men's Underwear",
        order_id: data.data.id,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#E63946",
        },
        handler: (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          onSuccess(response);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setLoading(false);
        onFailure();
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Payment Methods */}
      <div className="bg-card border border-border p-6 space-y-4">
        <h3 className="text-cream text-sm font-heading tracking-widest uppercase">
          Accepted Payment Methods
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Smartphone, label: "UPI" },
            { icon: CreditCard, label: "Cards" },
            { icon: Building2, label: "Net Banking" },
            { icon: CreditCard, label: "Wallets" },
          ].map((method) => (
            <div
              key={method.label}
              className="flex items-center gap-2 p-3 border border-border text-silver/50 text-xs font-body"
            >
              <method.icon className="w-4 h-4" />
              {method.label}
            </div>
          ))}
        </div>
      </div>

      {/* Pay Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handlePayment}
        isLoading={loading}
      >
        Pay {formatPrice(amount)} Securely
      </Button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-silver/40 text-xs font-body">
        <Shield className="w-4 h-4" />
        100% Secure Payment — Powered by Razorpay
      </div>
    </div>
  );
}
