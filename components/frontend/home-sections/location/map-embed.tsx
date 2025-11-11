// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/location/map-embed.tsx
// ──────────────────────────────────────────────────────────────

export default function MapEmbed() {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=SixtyFour+Hotel+Limuru+Kenya`;

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      <iframe
        title="SixtyFour Hotel Location"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
      />
      {/* Pulsing Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-10 h-10 bg-[#EB1B69] rounded-full animate-ping absolute" />
        <div className="w-10 h-10 bg-[#EB1B69] rounded-full relative" />
      </div>
    </div>
  );
}