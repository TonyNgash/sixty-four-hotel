// ──────────────────────────────────────────────────────────────
// lib/home-data/night-club-data.ts
// ──────────────────────────────────────────────────────────────

export interface ClubEvent {
  id: number;
  day: string;
  title: string;
  description: string;
  dj: string;
  image: string;
  slug: string;
}

const staticEvents: ClubEvent[] = [
  {
    id: 1,
    day: 'Friday',
    title: 'EDM Night',
    description: 'Vibes from the islands with live bands and classic reggae hits.',
    dj: 'DJ Rasta Road',
    image: '/images/home/night-club/reggae-night.jpg',
    slug: 'reggae-night',
  },
  {
    id: 2,
    day: 'Wednesday',
    title: 'Soul Night',
    description: 'Smooth grooves, soulful voices, and deep rhythms all night long.',
    dj: 'DJ Soul Sister',
    image: '/images/home/night-club/soul-night.webp',
    slug: 'soul-night',
  },
  {
    id: 3,
    day: 'Friday',
    title: 'RnB Night',
    description: 'The best in contemporary RnB, throwbacks, and slow jams.',
    dj: 'DJ Velvet',
    image: '/images/home/night-club/rnb-night.webp',
    slug: 'rnb-night',
  },
];

export const getClubEvents = async (): Promise<ClubEvent[]> => {
  return staticEvents;
  // LATER: return db.event.findMany({ where: { active: true } })
};