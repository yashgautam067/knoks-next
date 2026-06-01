import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import MarqueeStrip from "@/components/store/MarqueeStrip";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarqueeStrip />
      <Navbar />
      <main className="min-h-screen" style={{ paddingTop: "116px" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
