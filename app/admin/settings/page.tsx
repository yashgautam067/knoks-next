"use client";

import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-cream font-heading text-3xl tracking-widest mb-6">SETTINGS</h1>
      <div className="bg-card border border-border p-12 text-center">
        <Settings className="w-16 h-16 text-border mx-auto mb-4" />
        <p className="text-cream font-heading text-xl tracking-widest mb-2">STORE SETTINGS</p>
        <p className="text-silver/50 font-body text-sm">Store configuration, payment settings, and notification preferences.</p>
      </div>
    </div>
  );
}
