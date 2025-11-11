// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/night-club/event-carousel.tsx
// ──────────────────────────────────────────────────────────────

'use client';

import { useState } from 'react';
import { ClubEvent } from '@/lib/home-data/night-club-data';
// import EventCard from './event-card';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './event-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventCarouselProps {
  events: ClubEvent[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + events.length) % events.length);
  const next = () => setIndex((i) => (i + 1) % events.length);

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Feathered Background */}
      <div
        className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10"
        style={{
          boxShadow: '0 0 60px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div className="text-white space-y-4 animate-fade">
            <h3 className="text-3xl md:text-4xl font-montserrat font-bold">
              {events[index].title}
            </h3>
            <p className="text-gray-300 font-montserrat">
              {events[index].description}
            </p>
            <p className="text-xl font-montserrat text-purple-400">
              DJ: {events[index].dj}
            </p>
          </div>

          {/* Right: 3D Cards */}
          <div className="relative h-96 flex justify-center items-center perspective-1000">
            {events.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                isActive={i === index}
                position={(i - index + events.length) % events.length}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? 'bg-purple-500 w-8' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}