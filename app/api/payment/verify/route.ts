import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateOrderId, getEstimatedDelivery, formatDate } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/mail";
import type { IOrderItem, IPricing, IShippingAddress } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Create order in Supabase
    const orderId = generateOrderId();
    const estimatedDelivery = getEstimatedDelivery(
      orderData.deliveryType || "standard"
    );

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_id: orderId,
        user_id: orderData.userId || null,
        guest_name: orderData.guestInfo?.name || null,
        guest_email: orderData.guestInfo?.email || null,
        guest_phone: orderData.guestInfo?.phone || null,
        items: orderData.items as unknown as IOrderItem[],
        shipping_address: orderData.shippingAddress as unknown as IShippingAddress,
        pricing: orderData.pricing as unknown as IPricing,
        coupon_code: orderData.couponCode || null,
        delivery_type: orderData.deliveryType || "standard",
        payment_method: "razorpay",
        payment_status: "paid",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: "confirmed",
        estimated_delivery: estimatedDelivery.toISOString().split("T")[0],
        tracking_timeline: [
          {
            status: "confirmed",
            message: "Payment received. Order confirmed!",
            timestamp: new Date().toISOString(),
          },
        ],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Update product stock
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        const { error: rpcError } = await supabaseAdmin.rpc("decrement_stock", {
          product_id: item.product_id,
          quantity: item.qty,
        });

        if (rpcError) {
          // If RPC doesn't exist, do manual update
          const { data: prod } = await supabaseAdmin
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();

          if (prod) {
            await supabaseAdmin
              .from("products")
              .update({ stock: Math.max(0, (prod.stock as number) - item.qty) })
              .eq("id", item.product_id);
          }
        }
      }
    }

    // Send confirmation email
    const email =
      orderData.guestInfo?.email || orderData.userEmail;
    if (email) {
      sendOrderConfirmation({
        to: email,
        orderId,
        items: orderData.items,
        pricing: orderData.pricing,
        shippingAddress: orderData.shippingAddress,
        estimatedDelivery: formatDate(estimatedDelivery),
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      data: { orderId, id: order.id },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
