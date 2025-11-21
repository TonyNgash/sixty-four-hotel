// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/night-club/nightclub-section.tsx
// ──────────────────────────────────────────────────────────────

import { getClubEvents } from '@/lib/home-data/night-club-data';
import SoundWave from './sound-wave';
import EventCarousel from './event-carousel';

export default async function NightClubSection() {
  const events = await getClubEvents();

  return (
    <section
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #380B34 0%, #120D13 50%, #1E101F 100%)',
      }}
    >
      {/* Section 1: Header */}
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-5xl md:text-5xl font-montserrat font-bold text-white mb-2">
          The best night <br/> you will ever have.
        </h2>
        <p className="text-sm text-gray-300 font-montserrat mt-4">
          Creating the best memories in our popular night club.
        </p>
      </div>

      {/* Section 2: Sound Wave */}
      <SoundWave />

      {/* Section 3: Carousel */}
      <div className="container mx-auto px-4 mt-24">
        <EventCarousel events={events} />
      </div>

      {/* Section 4: Bottom Border */}
      <div
        className="mt-16 h-px w-full"
        style={{
          background: 'linear-gradient(to right, #45119B, #D91AD7)',
        }}
      />
    </section>
  );
}