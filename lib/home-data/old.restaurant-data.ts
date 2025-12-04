// ──────────────────────────────────────────────────────────────
// lib/home-data/restaurant-data.ts
// ──────────────────────────────────────────────────────────────

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  slug: string;
}

const staticMenu: MenuItem[] = [
  {
    id: 1,
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter, seasonal vegetables.',
    price: '$32',
    image: '/images/home/restaurant/food1.webp',
    slug: 'grilled-salmon',
  },
  {
    id: 2,
    name: 'Ribeye Steak',
    description: 'Prime cut, grilled to perfection with garlic herb butter.',
    price: '$48',
    image: '/images/home/restaurant/food2.webp',
    slug: 'ribeye-steak',
  },
  {
    id: 3,
    name: 'Truffle Pasta',
    description: 'Handmade tagliatelle with wild mushrooms and black truffle.',
    price: '$28',
    image: '/images/home/restaurant/food3.webp',
    slug: 'truffle-pasta',
  },
  {
    id: 4,
    name: 'Chocolate Soufflé',
    description: 'Warm, molten center with vanilla bean ice cream.',
    price: '$14',
    image: '/images/home/restaurant/food4.webp',
    slug: 'chocolate-souffle',
  },
];

export const getMenuHighlights = async (): Promise<MenuItem[]> => {
  return staticMenu;
  // LATER: return db.menuItem.findMany({ where: { featured: true } })
};