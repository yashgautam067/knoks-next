"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import CheckoutStepper from "@/components/store/CheckoutStepper";
import DeliveryForm, { DeliveryFormData } from "@/components/store/DeliveryForm";
import PaymentSection from "@/components/store/PaymentSection";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [deliveryData, setDeliveryData] = useState<DeliveryFormData | null>(null);
  const { items, getSubtotal, couponCode, couponDiscount, getShipping, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    if (typeof window !== "undefined") router.push("/cart");
    return null;
  }

  const handleDeliverySubmit = (data: DeliveryFormData) => {
    setDeliveryData(data);
    setStep(1);
    window.scrollTo(0, 0);
  };

  const deliveryType = deliveryData?.deliveryType || "standard";
  const subtotal = getSubtotal();
  const shipping = getShipping(deliveryType);
  const total = getTotal(deliveryType);

  const handlePaymentSuccess = async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.productId,
          name: item.name,
          image: item.image,
          size: item.size,
          color: item.color,
          qty: item.qty,
          price: item.price,
        })),
        shippingAddress: {
          full_name: deliveryData!.fullName,
          phone: deliveryData!.phone,
          line1: deliveryData!.line1,
          line2: deliveryData!.line2 || "",
          city: deliveryData!.city,
          state: deliveryData!.state,
          pincode: deliveryData!.pincode,
        },
        guestInfo: {
          name: deliveryData!.fullName,
          email: deliveryData!.email,
          phone: deliveryData!.phone,
        },
        pricing: {
          subtotal,
          discount: couponDiscount,
          shipping,
          total,
        },
        couponCode: couponCode || undefined,
        deliveryType,
      };

      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, orderData }),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push(`/order-success/${data.data.orderId}`);
      } else {
        toast.error("Payment verification failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-cream font-heading text-4xl tracking-widest text-center mb-8">CHECKOUT</h1>
          <CheckoutStepper currentStep={step} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-cream font-heading text-xl tracking-widest mb-6">DELIVERY DETAILS</h2>
                <DeliveryForm onSubmit={handleDeliverySubmit} subtotal={subtotal} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-cream font-heading text-xl tracking-widest mb-6">PAYMENT</h2>
                <PaymentSection
                  amount={total}
                  customerName={deliveryData!.fullName}
                  customerEmail={deliveryData!.email}
                  customerPhone={deliveryData!.phone}
                  onSuccess={handlePaymentSuccess}
                  onFailure={() => toast.error("Payment failed. Please try again.")}
                />
                <button onClick={() => setStep(0)} className="mt-4 text-silver/40 text-sm font-body hover:text-cream transition-colors">
                  ← Back to delivery
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border p-6 sticky top-24">
              <h3 className="text-cream font-heading text-sm tracking-widest mb-4">ORDER SUMMARY</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="w-12 h-12 bg-charcoal border border-border flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="text-red/20 font-heading text-sm">K</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-xs font-body truncate">{item.name}</p>
                      <p className="text-silver/30 text-[10px] font-body">{item.size} / {item.color} × {item.qty}</p>
                    </div>
                    <span className="text-cream text-xs font-mono">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm font-body">
                <div className="flex justify-between text-silver"><span>Subtotal</span><span className="font-mono text-cream">{formatPrice(subtotal)}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span className="font-mono">-{formatPrice(couponDiscount)}</span></div>}
                <div className="flex justify-between text-silver"><span>Shipping</span><span className="font-mono text-cream">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-cream font-semibold pt-2 border-t border-border"><span>Total</span><span className="font-mono text-lg">{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
