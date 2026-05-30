import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    );
  }

  // Fetch reviews separately
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    success: true,
    data: { ...product, reviews: reviews || [] },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("products")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("slug", slug)
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

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("slug", slug);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: "Product deleted" });
}
