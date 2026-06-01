export default function MarqueeStrip() {
  const text =
    "FAST DELIVERY • 100% COTTON • PREMIUM UNDERWEAR • MADE FOR MEN • KNOKS • BUILT DIFFERENT • WORN BETTER • ESSENTIAL LUXURY • ";

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-charcoal py-2 overflow-hidden border-b border-gold/10"
      style={{ zIndex: 10000, height: "36px" }}
    >
      <div className="marquee-container">
        <div className="marquee-content">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-white font-heading text-[11px] tracking-[0.3em] uppercase whitespace-nowrap mx-4"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
