// lib/home-data/restaurant-data.ts  (updated)
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string; // e.g. "$32"
  image: string;
  slug: string;
  category: string;
}

export type CategoryKey =
  | 'breakfast'
  | 'hot-beverages'
  | 'snacks'
  | 'quick-bites'
  | 'soups'
  | 'main-dishes'
  | 'accompaniments';

export const categories: { key: CategoryKey; label: string; image: string }[] = [
  { key: 'breakfast', label: 'Breakfast', image:'/images/home/restaurant/breakfast_01.jpg' },
  { key: 'hot-beverages', label: 'Hot Beverages', image:'/images/home/restaurant/hot_bevarage_01.jpg' },
  { key: 'snacks', label: 'Snacks', image:'/images/home/restaurant/snacks_01.jpg' },
  { key: 'quick-bites', label: 'Quick Bites', image:'/images/home/restaurant/quick_bites_01.webp' },
  { key: 'soups', label: 'Soups', image:'/images/home/restaurant/soups_01.jpg' },
  { key: 'main-dishes', label: 'Main Dishes', image:'/images/home/restaurant/main_dishes_01.webp' },
  { key: 'accompaniments', label: 'Accompaniments', image:'/images/home/restaurant/accompaniments_01.jpg' },
];

const fullMenu: MenuItem[] = [
  // Breakfast
  { id: 101, name: 'Fried eggs', description: 'Two Fired Eggs, toast', price: '150', image: '/images/home/restaurant/menu/food1.webp', slug: 'fried-eggs', category: 'breakfast' },
  { id: 102, name: 'Fried eggs combo', description: 'Two fried eggs, Toast, 1 Sausage', price: '200', image: '/images/home/restaurant/menu/food1.webp', slug: 'fried-eggs-combo', category: 'breakfast' },
  { id: 103, name: 'Fried eggs Fries', description: 'Two fried eggs, Toast, 1 Sausage, Homemade fries', price: '200', image: '/images/home/restaurant/menu/food1.webp', slug: 'fried-eggs-fries', category: 'breakfast' },
  { id: 104, name: 'Pancakes', description: '2 Pieces of Pancakes', price: '150', image: '/images/home/restaurant/menu/food1.webp', slug: 'pancakes', category: 'breakfast' },
  { id: 105, name: 'Spanish Omelets', description: 'Two eggs, tomato, onions', price: '130', image: '/images/home/restaurant/menu/food1.webp', slug: 'spanish-omelets', category: 'breakfast' },
  { id: 106, name: 'B.E.S.T', description: 'Bacon, Eggs, Sausage, Toast', price: '450', image: '/images/home/restaurant/menu/food1.webp', slug: 'b-e-s-t', category: 'breakfast' },

  // Hot Beverages
  { id: 201, name: 'African Tea', price: '100', description: 'Single Mug', image: '/images/home/restaurant/menu/food2.webp', slug: 'african-tea', category: 'hot-beverages' },
  { id: 202, name: 'Black Tea', price: '80', description: 'Single Mug', image: '/images/home/restaurant/menu/food2.webp', slug: 'black-tea', category: 'hot-beverages' },
  { id: 203, name: 'Lemon Tea', price: '120', description: 'Single Mug', image: '/images/home/restaurant/menu/food2.webp', slug: 'lemon-tea', category: 'hot-beverages' },
  { id: 204, name: 'Dawa (Hot lemon, ginger', price: '150', description: 'Single Mug', image: '/images/home/restaurant/menu/food2.webp', slug: 'dawa-lemon-ginger', category: 'hot-beverages' },
  { id: 205, name: 'Hot chocolate', price: '130', description: 'Hot lemon, ginger', image: '/images/home/restaurant/menu/food2.webp', slug: 'hot-chocolate', category: 'hot-beverages' },
  { id: 206, name: 'White Coffee', price: '150', description: 'Hot lemon, ginger', image: '/images/home/restaurant/menu/food2.webp', slug: 'white-coffee', category: 'hot-beverages' },
  { id: 207, name: 'Black Coffee', price: '120', description: 'Hot lemon, ginger', image: '/images/home/restaurant/menu/food2.webp', slug: 'black-coffee', category: 'hot-beverages' },
  { id: 208, name: 'Herbal Tea', price: '150', description: 'Hot lemon, ginger', image: '/images/home/restaurant/menu/food2.webp', slug: 'herbal-tea', category: 'hot-beverages' },
  
  // Snacks
  { id: 301, name: 'Beef samosa', description: '2 beef samosas', price: '120', image: '/images/home/restaurant/menu/food3.webp', slug: 'beef-samosa', category: 'snacks' },
  { id: 302, name: 'Sausage', description: '2 beef/pork sausages', price: '150', image: '/images/home/restaurant/menu/food3.webp', slug: 'sausages', category: 'snacks' },
  { id: 303, name: 'Eggs', description: '2 Eggs Boiled/Fried', price: '120', image: '/images/home/restaurant/menu/food3.webp', slug: 'eggs', category: 'snacks' },
  { id: 304, name: 'Choma sausage', description: '2 grilled beef/pork sausages', price: '150', image: '/images/home/restaurant/menu/food3.webp', slug: 'choma-sausage', category: 'snacks' },
  { id: 305, name: 'Chips', description: 'A plate of fries', price: '150', image: '/images/home/restaurant/menu/food3.webp', slug: 'chips', category: 'snacks' },
  { id: 306, name: 'Sautee Potatoes', description: 'Sauteed potatoes, onions, tomatoes', price: '200', image: '/images/home/restaurant/menu/food3.webp', slug: 'sautee-potatoes', category: 'snacks' },

  // Quick Bites
  { id: 401, name: 'Chicken Wings', description: 'Deep fried chicken wings', price: '400', image: '/images/home/restaurant/menu/food4.webp', slug: 'chicken-wings', category: 'quick-bites' },
  { id: 402, name: 'Fish Fingers', description: 'Fish fingers served with fries', price: '450', image: '/images/home/restaurant/menu/food4.webp', slug: 'fish-fingers', category: 'quick-bites' },
  { id: 403, name: 'Beef Burger', description: 'One large beef burger', price: '450', image: '/images/home/restaurant/menu/food4.webp', slug: 'beef-burger', category: 'quick-bites' },
  { id: 404, name: 'Cheese Burger', description: 'One large beef burger', price: '500', image: '/images/home/restaurant/menu/food4.webp', slug: 'cheese-burger', category: 'quick-bites' },

  //Soups
  { id: 501, name: 'Mushroom soup', description: 'Cream of mushroom soup', price: '250', image: '/images/home/restaurant/menu/food1.webp', slug: 'cheese-burger', category: 'soups' },
  { id: 502, name: 'Ossubucco', description: 'Ossubucco soup served with toast', price: '250', image: '/images/home/restaurant/menu/food1.webp', slug: 'cheese-burger', category: 'soups' },

  //Main Dishes
  { id: 601, name: 'Beef Quarter(1/4)', description: 'Beef Quarter(1/4) wet/dry fry', price: '400', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 602, name: 'Beef Half(1/2)', description: 'Beef Half(1/2) wet/dry fry', price: '600', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 603, name: 'Beef 1Kg', description: 'Beef 1Kg wet/dry fry', price: '1200', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 604, name: 'Chicken Quarter(1/4)', description: 'Chicken Quarter(1/4) wet/dry fry', price: '450', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 605, name: 'Chicken Half(1/2)', description: 'Chicken Half(1/2) wet/dry fry', price: '650', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 606, name: 'Chicken 1Kg', description: 'Chicken 1Kg wet/dry fry', price: '1200', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 607, name: 'Fish', description: 'Pan fried 200grams fish fillet', price: '500', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 608, name: 'Pork Half(1/2)', description: 'Pork Half(1/2) wet/dry fry', price: '500', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 609, name: 'Pork 1Kg', description: 'Pork 1Kg wet/dry fry', price: '950', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 6010, name: 'Mini Platter', description: 'Platter of 2, Chicken, Beef, Pork, Choma Sausage, Fried Sausage and a choice of two accompaniments', price: '1200', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },
  { id: 6011, name: 'King Platter', description: 'Platter of 4, Chicken, Beef, Pork, Choma Sausage, Fried Sausage and a choice of two accompaniments', price: '1200', image: '/images/home/restaurant/menu/food2.webp', slug: 'cheese-burger', category: 'main-dishes' },

  // Accompaniments
  { id: 701, name: 'Regular Chips', description: 'Standard plate of fries', price: '150', image: '/images/home/restaurant/menu/food3.webp', slug: 'regular-chips', category: 'accompaniments' },
  { id: 702, name: 'Roast Potatoes', description: 'Full Sized/Wedged roasted potatoes', price: '200', image: '/images/home/restaurant/menu/food3.webp', slug: 'roast-potatoes', category: 'accompaniments' },
  { id: 703, name: 'Ugali', description: 'Standard ugali serving', price: '80', image: '/images/home/restaurant/menu/food3.webp', slug: 'ugali', category: 'accompaniments' },
  { id: 704, name: 'Mukimo', description: 'Standard mukimo serving ', price: '120', image: '/images/home/restaurant/menu/food3.webp', slug: 'mukimo', category: 'accompaniments' },
  { id: 705, name: 'Rice', description: 'Standard rice serving ', price: '100', image: '/images/home/restaurant/menu/food3.webp', slug: 'rice', category: 'accompaniments' },

  
  // ... add more as you like
];

export const getMenuByCategory = (category: CategoryKey): MenuItem[] => {
  return fullMenu.filter(item => item.category === category);
};

export const getAllMenuItems = () => fullMenu;