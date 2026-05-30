export default function MarqueeStrip() {
  const text =
    "FREE SHIPPING ABOVE ₹999 • 30-DAY RETURNS • PREMIUM COTTON • MADE FOR MEN • KNOKS • BUILT DIFFERENT • WORN BETTER • ";

  return (
    <div className="bg-red py-3 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-cream font-heading text-sm tracking-[0.3em] uppercase whitespace-nowrap mx-4"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
