import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { asPricing } from "@/types";
import type { Profile, Order } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  let rpc = supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false });

  if (search) {
    rpc = rpc.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data, error } = await rpc;
  const profiles = (data || []) as Profile[];

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  const customers = await Promise.all(
    profiles.map(async (profile) => {
      const { data: orderData } = await supabaseAdmin
        .from("orders")
        .select("pricing")
        .eq("user_id", profile.id)
        .eq("payment_status", "paid");

      const orders = (orderData || []) as { pricing: Order["pricing"] }[];
      const orderCount = orders.length;
      const totalSpent = orders.reduce(
        (sum, o) => sum + (asPricing(o.pricing)?.total || 0),
        0
      );

      return {
        id: profile.id,
        name: profile.name,
        email: "",
        phone: profile.phone,
        orderCount,
        totalSpent,
        created_at: profile.created_at,
      };
    })
  );

  return NextResponse.json({ success: true, data: customers });
}
