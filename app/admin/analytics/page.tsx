"use client";

import { BarChart3 } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-cream font-heading text-3xl tracking-widest mb-6">ANALYTICS</h1>
      <div className="bg-card border border-border p-12 text-center">
        <BarChart3 className="w-16 h-16 text-border mx-auto mb-4" />
        <p className="text-cream font-heading text-xl tracking-widest mb-2">COMING SOON</p>
        <p className="text-silver/50 font-body text-sm">Advanced analytics with revenue trends, customer insights, and product performance.</p>
      </div>
    </div>
  );
}
