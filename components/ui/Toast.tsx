"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1C1C1C",
          color: "#F5F5F0",
          border: "1px solid #2A2A2A",
          borderRadius: "0",
          fontFamily: "var(--font-dm-sans)",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#1C1C1C",
          },
        },
        error: {
          iconTheme: {
            primary: "#E63946",
            secondary: "#1C1C1C",
          },
        },
      }}
    />
  );
}
