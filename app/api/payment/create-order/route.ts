import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json(); // amount in paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `knoks_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
