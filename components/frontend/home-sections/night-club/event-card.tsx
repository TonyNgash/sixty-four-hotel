// ──────────────────────────────────────────────────────────────
// components/frontend/home-sections/night-club/event-card.tsx
// ──────────────────────────────────────────────────────────────

'use client';

import Image from 'next/image';
import { ClubEvent } from '@/lib/home-data/night-club-data';

interface EventCardProps {
  event: ClubEvent;
  isActive: boolean;
  position: number; // 0 = front, 1 = behind right, 2 = behind left
}

export default function EventCard({ event, isActive, position }: EventCardProps) {
  if (!isActive && position > 1) return null;

  const z = isActive ? 0 : position === 1 ? -40 : -80;
  const scale = isActive ? 1 : position === 1 ? 0.9 : 0.8;
  const rotate = position === 1 ? -6 : position === 2 ? 6 : 0;
  const opacity = isActive ? 1 : 0.7;

  return (
    <div
      className="absolute transition-all duration-700 ease-in-out"
      style={{
        zIndex: isActive ? 10 : 5 - position,
        transform: `translateZ(${z}px) scale(${scale}) rotateY(${rotate}deg)`,
        opacity,
      }}
    >
      <div className="relative w-64 h-80 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="256px"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm font-montserrat">{event.day}</p>
        </div>
      </div>
    </div>
  );
}