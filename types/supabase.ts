export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          full_name: string;
          phone: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          full_name: string;
          phone: string;
          line1: string;
          line2?: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          label?: string;
          full_name?: string;
          phone?: string;
          line1?: string;
          line2?: string | null;
          city?: string;
          state?: string;
          pincode?: string;
          is_default?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          short_desc: string;
          price: number;
          mrp: number;
          images: string[];
          category: "boxer-brief" | "trunk" | "brief" | "pack";
          sizes: string[];
          colors: Json;
          stock: number;
          badge: "NEW" | "BESTSELLER" | "LIMITED" | null;
          material: string | null;
          care_instructions: string | null;
          rating: number;
          review_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          short_desc: string;
          price: number;
          mrp: number;
          images?: string[];
          category: "boxer-brief" | "trunk" | "brief" | "pack";
          sizes: string[];
          colors: Json;
          stock?: number;
          badge?: "NEW" | "BESTSELLER" | "LIMITED" | null;
          material?: string | null;
          care_instructions?: string | null;
          rating?: number;
          review_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          short_desc?: string;
          price?: number;
          mrp?: number;
          images?: string[];
          category?: "boxer-brief" | "trunk" | "brief" | "pack";
          sizes?: string[];
          colors?: Json;
          stock?: number;
          badge?: "NEW" | "BESTSELLER" | "LIMITED" | null;
          material?: string | null;
          care_instructions?: string | null;
          rating?: number;
          review_count?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          reviewer_name: string;
          rating: number;
          comment: string;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          reviewer_name: string;
          rating: number;
          comment: string;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          reviewer_name?: string;
          rating?: number;
          comment?: string;
          is_verified?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          order_id: string;
          user_id: string | null;
          guest_name: string | null;
          guest_email: string | null;
          guest_phone: string | null;
          items: Json;
          shipping_address: Json;
          pricing: Json;
          coupon_code: string | null;
          delivery_type: "standard" | "express";
          payment_method: string | null;
          payment_status: "pending" | "paid" | "failed";
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
          tracking_number: string | null;
          tracking_timeline: Json;
          admin_notes: string | null;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          user_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          items: Json;
          shipping_address: Json;
          pricing: Json;
          coupon_code?: string | null;
          delivery_type?: "standard" | "express";
          payment_method?: string | null;
          payment_status?: "pending" | "paid" | "failed";
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          status?: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
          tracking_number?: string | null;
          tracking_timeline?: Json;
          admin_notes?: string | null;
          estimated_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          items?: Json;
          shipping_address?: Json;
          pricing?: Json;
          coupon_code?: string | null;
          delivery_type?: "standard" | "express";
          payment_method?: string | null;
          payment_status?: "pending" | "paid" | "failed";
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          status?: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
          tracking_number?: string | null;
          tracking_timeline?: Json;
          admin_notes?: string | null;
          estimated_delivery?: string | null;
          updated_at?: string;
        };
      };
      newsletter: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          email?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: "percent" | "flat";
          value: number;
          min_order: number;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: "percent" | "flat";
          value: number;
          min_order?: number;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          code?: string;
          type?: "percent" | "flat";
          value?: number;
          min_order?: number;
          is_active?: boolean;
          expires_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
