// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/location/location-section.tsx
// ──────────────────────────────────────────────────────────────

import MapEmbed from './map-embed';
import { Playfair_Display } from 'next/font/google';
import Link from 'next/link';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function LocationSection() {
  return (
    <section className="py-32 md:py-40 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Title & Subtitle */}
        <div className="text-center mb-24 md:mb-32">
          <h2 className={`${playfair.className} text-5xl md:text-7xl font-bold text-gray-900 mb-6`}>
            Visit Us in the Heart of Limuru
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-montserrat max-w-3xl mx-auto leading-relaxed">
            Nestled in the serene hills of Limuru Town, SixtyFour offers a tranquil escape with world-class hospitality, just 30 minutes from Nairobi.
          </p>
        </div>

        {/* Grid: Equal Height Columns */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch min-h-0">
          
          {/* Left: Map — Full height of right column */}
          <div className="order-2 lg:order-1">
            <MapEmbed />
          </div>

          {/* Right: Info Cards — Define height */}
          <div className="order-1 lg:order-2 flex flex-col gap-8 min-h-0">
            {/* Address Card */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col justify-center">
              <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-3">Our Address</h3>
              <p className="text-gray-600 font-montserrat leading-relaxed">
                SixtyFour Hotel & Suites<br />
                Limuru Road, Limuru Town<br />
                Kiambu County, Kenya
              </p>
            </div>

            {/* Hours Card */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col justify-center">
              <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-3">Opening Hours</h3>
              <p className="text-gray-600 font-montserrat leading-relaxed">
                <strong>Hotel:</strong> 24/7<br />
                <strong>Restaurant:</strong> 7:00 AM – 11:00 PM<br />
                <strong>Night Club:</strong> 9:00 PM – 3:00 AM (Wed, Thu, Fri)
              </p>
            </div>

            {/* CTA Card */}
            <div className="flex-1 bg-gradient-to-r from-[#EB1B69] to-[#d4165a] p-8 rounded-2xl shadow-lg text-white flex flex-col justify-center">
              <h3 className="text-2xl font-playfair font-semibold mb-3">Plan Your Visit</h3>
              <p className="font-montserrat mb-6">
                Get in touch to book a table, reserve a room, or inquire about events.
              </p>
              <div className="mt-auto">
                <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-[#EB1B69] font-montserrat font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </section>
  );
}