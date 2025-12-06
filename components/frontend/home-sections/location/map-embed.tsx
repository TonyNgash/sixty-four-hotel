// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/location/map-embed.tsx
// ──────────────────────────────────────────────────────────────

export default function MapEmbed() {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=SixtyFour+Hotel+Limuru+Kenya`;

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      <div className="h-96 lg:h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                title="Sixty Four Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.789!2d36.642!3d-1.108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f4e5f5e5f5e5f%3A0x5e5f5e5f5e5f5e5f!2sLimuru%20Town!5e0!3m2!1sen!2ske!4v1712345678901!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
    </div>
  );
}