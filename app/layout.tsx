import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KNOKS — Premium Men's Underwear | Hit Different",
  description:
    "Premium men's underwear brand. Engineered for comfort, designed for confidence. Shop boxer briefs, trunks, briefs & packs. Free shipping over ₹999.",
  keywords: [
    "men's underwear",
    "premium underwear",
    "boxer briefs",
    "trunks",
    "KNOKS",
    "cotton underwear",
    "India",
  ],
  openGraph: {
    title: "KNOKS — Hit Different",
    description: "Premium men's underwear. Engineered for comfort.",
    type: "website",
    locale: "en_IN",
    siteName: "KNOKS",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="grain-overlay" />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1C1C1C",
              color: "#F5F5F0",
              border: "1px solid #2A2A2A",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#E63946", secondary: "#F5F5F0" },
            },
          }}
        />
      </body>
    </html>
  );
}
