import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  // Try by order_id first (KNK-XXXXXX), then by UUID
  let query = supabaseAdmin.from("orders").select("*");

  if (orderId.startsWith("KNK-")) {
    query = query.eq("order_id", orderId);
  } else {
    query = query.eq("id", orderId);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  const body = await request.json();

  // Get current order for timeline
  const { data: current } = await supabaseAdmin
    .from("orders")
    .select("tracking_timeline")
    .eq("order_id", orderId)
    .single();

  const currentTimeline = (current?.tracking_timeline as Array<{
    status: string;
    message: string;
    timestamp: string;
  }>) || [];

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.status) {
    updateData.status = body.status;
    updateData.tracking_timeline = [
      ...currentTimeline,
      {
        status: body.status,
        message:
          body.statusMessage ||
          `Order ${body.status}`,
        timestamp: new Date().toISOString(),
      },
    ];
  }
  if (body.tracking_number !== undefined)
    updateData.tracking_number = body.tracking_number;
  if (body.admin_notes !== undefined)
    updateData.admin_notes = body.admin_notes;
  if (body.payment_status)
    updateData.payment_status = body.payment_status;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(updateData)
    .eq("order_id", orderId)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data });
}
