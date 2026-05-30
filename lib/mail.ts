import nodemailer from "nodemailer";
import { formatPrice } from "./utils";
import type { IOrderItem, IPricing, IShippingAddress } from "@/types";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface OrderEmailData {
  to: string;
  orderId: string;
  items: IOrderItem[];
  pricing: IPricing;
  shippingAddress: IShippingAddress;
  estimatedDelivery: string;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #2A2A2A;color:#C0C0C0;font-family:sans-serif;font-size:14px;">
          ${item.name} (${item.size} / ${item.color}) × ${item.qty}
        </td>
        <td style="padding:12px;border-bottom:1px solid #2A2A2A;color:#F5F5F0;font-family:monospace;text-align:right;">
          ${formatPrice(item.price * item.qty)}
        </td>
      </tr>`
    )
    .join("");

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background-color:#0A0A0A;">
    <div style="max-width:600px;margin:0 auto;background:#141414;border:1px solid #2A2A2A;">
      <!-- Header -->
      <div style="padding:32px;text-align:center;border-bottom:1px solid #2A2A2A;">
        <h1 style="margin:0;font-family:sans-serif;font-size:28px;letter-spacing:8px;color:#F5F5F0;">KNOKS</h1>
        <p style="margin:8px 0 0;font-family:sans-serif;font-size:11px;letter-spacing:3px;color:#C0C0C0;">UNDERWEAR — HIT DIFFERENT</p>
      </div>

      <!-- Content -->
      <div style="padding:32px;">
        <h2 style="font-family:sans-serif;color:#F5F5F0;font-size:20px;letter-spacing:4px;margin:0 0 8px;">ORDER CONFIRMED</h2>
        <p style="font-family:sans-serif;color:#C0C0C0;font-size:14px;margin:0 0 24px;">
          Thank you for your order. Here are your details:
        </p>

        <!-- Order ID -->
        <div style="background:#0A0A0A;border:1px solid #2A2A2A;padding:16px;margin-bottom:24px;">
          <p style="font-family:sans-serif;color:#C0C0C0;font-size:11px;letter-spacing:2px;margin:0 0 4px;">ORDER ID</p>
          <p style="font-family:monospace;color:#F5F5F0;font-size:24px;letter-spacing:2px;margin:0;">${data.orderId}</p>
        </div>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:12px;border-bottom:2px solid #2A2A2A;color:#C0C0C0;font-family:sans-serif;font-size:11px;letter-spacing:2px;">ITEM</th>
              <th style="text-align:right;padding:12px;border-bottom:2px solid #2A2A2A;color:#C0C0C0;font-family:sans-serif;font-size:11px;letter-spacing:2px;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <!-- Pricing -->
        <div style="background:#0A0A0A;border:1px solid #2A2A2A;padding:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="font-family:sans-serif;color:#C0C0C0;font-size:14px;">Subtotal</span>
            <span style="font-family:monospace;color:#F5F5F0;">${formatPrice(data.pricing.subtotal)}</span>
          </div>
          ${data.pricing.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="font-family:sans-serif;color:#22c55e;font-size:14px;">Discount</span><span style="font-family:monospace;color:#22c55e;">-${formatPrice(data.pricing.discount)}</span></div>` : ""}
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="font-family:sans-serif;color:#C0C0C0;font-size:14px;">Shipping</span>
            <span style="font-family:monospace;color:#F5F5F0;">${data.pricing.shipping === 0 ? "FREE" : formatPrice(data.pricing.shipping)}</span>
          </div>
          <div style="border-top:1px solid #2A2A2A;padding-top:12px;margin-top:8px;display:flex;justify-content:space-between;">
            <span style="font-family:sans-serif;color:#F5F5F0;font-size:16px;font-weight:bold;">Total</span>
            <span style="font-family:monospace;color:#F5F5F0;font-size:18px;font-weight:bold;">${formatPrice(data.pricing.total)}</span>
          </div>
        </div>

        <!-- Delivery Address -->
        <div style="margin-top:24px;">
          <p style="font-family:sans-serif;color:#C0C0C0;font-size:11px;letter-spacing:2px;margin:0 0 8px;">DELIVERY ADDRESS</p>
          <p style="font-family:sans-serif;color:#F5F5F0;font-size:14px;line-height:1.6;margin:0;">
            ${data.shippingAddress.full_name}<br>
            ${data.shippingAddress.line1}${data.shippingAddress.line2 ? ", " + data.shippingAddress.line2 : ""}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}<br>
            📞 ${data.shippingAddress.phone}
          </p>
        </div>

        <!-- Estimated Delivery -->
        <div style="margin-top:24px;background:#E63946;padding:16px;text-align:center;">
          <p style="font-family:sans-serif;color:#F5F5F0;font-size:11px;letter-spacing:2px;margin:0 0 4px;">ESTIMATED DELIVERY</p>
          <p style="font-family:sans-serif;color:#F5F5F0;font-size:18px;font-weight:bold;margin:0;">${data.estimatedDelivery}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:24px;text-align:center;border-top:1px solid #2A2A2A;">
        <p style="font-family:sans-serif;color:#C0C0C0;font-size:12px;margin:0;">
          Questions? Reply to this email or reach us at support@knoks.in
        </p>
        <p style="font-family:sans-serif;color:#C0C0C0;font-size:10px;letter-spacing:2px;margin:12px 0 0;">
          © ${new Date().getFullYear()} KNOKS. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>`;

  try {
    await transporter.sendMail({
      from: `"KNOKS" <${process.env.EMAIL_USER}>`,
      to: data.to,
      subject: `Order Confirmed — ${data.orderId} | KNOKS`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
