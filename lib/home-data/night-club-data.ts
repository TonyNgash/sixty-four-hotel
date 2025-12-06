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
    day: 'Wednesday',
    title: 'EDM Night',
    description: 'Vibrant, high-energy event with the best electronic dance music.',
    dj: 'DJ Edu',
    image: '/images/home/night-club/edm_night_02.jpeg',
    slug: 'edm-night',
  },
  {
    id: 2,
    day: 'Thursday',
    title: 'Reggae Night',
    description: 'Vibes from the islands with live bands and classic reggae hits.',
    dj: 'DJ Edu',
    image: '/images/home/night-club/reggae-night.jpg',
    slug: 'reggae-night',
  },
  {
    id: 3,
    day: 'Friday',
    title: 'Soul Night',
    description: 'Dedicated to soulful grooves and smooth rhythms.',
    dj: 'DJ Velvet',
    image: '/images/home/night-club/soul_night_02.jpeg',
    slug: 'rnb-night',
  },
];

export const getClubEvents = async (): Promise<ClubEvent[]> => {
  return staticEvents;
  // LATER: return db.event.findMany({ where: { active: true } })
};