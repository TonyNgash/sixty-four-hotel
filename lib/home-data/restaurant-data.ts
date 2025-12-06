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
  { id: 101, name: 'Fried eggs', description: 'Two Fired Eggs, toast', price: '150', image: '/images/home/restaurant/menu/breakfast/fried_eggs_01.webp', slug: 'fried-eggs', category: 'breakfast' },
  { id: 102, name: 'Fried eggs combo', description: 'Two fried eggs, Toast, 1 Sausage', price: '200', image: '/images/home/restaurant/menu/breakfast/fried_eggs_combo_02.jpg', slug: 'fried-eggs-combo', category: 'breakfast' },
  { id: 103, name: 'Fried eggs & Fries', description: 'Two fried eggs, Toast, 1 Sausage, Homemade fries', price: '200', image: '/images/home/restaurant/menu/breakfast/fried_eggs_fries_01.webp', slug: 'fried-eggs-fries', category: 'breakfast' },
  { id: 104, name: 'Pancakes', description: '2 Pieces of Pancakes', price: '150', image: '/images/home/restaurant/menu/breakfast/pancakes_01.jpg', slug: 'pancakes', category: 'breakfast' },
  { id: 105, name: 'Spanish Omelets', description: 'Two eggs, tomato, onions', price: '130', image: '/images/home/restaurant/menu/breakfast/spanish_omelet_01.jpeg', slug: 'spanish-omelets', category: 'breakfast' },
  { id: 106, name: 'B.E.S.T', description: 'Bacon, Eggs, Sausage, Toast', price: '450', image: '/images/home/restaurant/menu/breakfast/best_01.jpg', slug: 'b-e-s-t', category: 'breakfast' },

  // Hot Beverages
  { id: 201, name: 'African Tea', price: '100', description: 'Single Mug', image: '/images/home/restaurant/menu/hot-beverages/african_tea_01.jpg', slug: 'african-tea', category: 'hot-beverages' },
  { id: 202, name: 'Black Tea', price: '80', description: 'Single Mug', image: '/images/home/restaurant/menu/hot-beverages/black_tea_01.jpeg', slug: 'black-tea', category: 'hot-beverages' },
  { id: 203, name: 'Lemon Tea', price: '120', description: 'Single Mug', image: '/images/home/restaurant/menu/hot-beverages/lemon_tea_01.webp', slug: 'lemon-tea', category: 'hot-beverages' },
  { id: 204, name: 'Dawa (Hot lemon, ginger)', price: '150', description: 'Single Mug', image: '/images/home/restaurant/menu/hot-beverages/dawa_01.jpg', slug: 'dawa-lemon-ginger', category: 'hot-beverages' },
  { id: 205, name: 'Hot chocolate', price: '130', description: 'Single Mug', image: '/images/home/restaurant/menu/hot-beverages/hot_chocolate_01.jpg', slug: 'hot-chocolate', category: 'hot-beverages' },
  { id: 206, name: 'White Coffee', price: '150', description: 'Single Mug', image: '/images/home/restaurant/menu/hot-beverages/white_coffee_01.jpg', slug: 'white-coffee', category: 'hot-beverages' },
  { id: 207, name: 'Black Coffee', price: '120', description: 'Single Mug', image: '/images/home/restaurant/menu/hot-beverages/black_coffee_01.webp', slug: 'black-coffee', category: 'hot-beverages' },
  { id: 208, name: 'Herbal Tea', price: '150', description: 'Single Mug', image: '/images/home/restaurant/menu/hot-beverages/herbal_tea_01.jpg', slug: 'herbal-tea', category: 'hot-beverages' },
  
  // Snacks
  { id: 301, name: 'Beef samosa', description: '2 beef samosas', price: '120', image: '/images/home/restaurant/menu/snacks/beef_samosa_01.png', slug: 'beef-samosa', category: 'snacks' },
  { id: 302, name: 'Sausage', description: '2 beef/pork sausages', price: '150', image: '/images/home/restaurant/menu/snacks/sausages_01.webp', slug: 'sausages', category: 'snacks' },
  { id: 303, name: 'Eggs', description: '2 Eggs Boiled/Fried', price: '120', image: '/images/home/restaurant/menu/snacks/eggs_boiled_fried_02.jpg', slug: 'eggs', category: 'snacks' },
  { id: 304, name: 'Choma sausage', description: '2 grilled beef/pork sausages', price: '150', image: '/images/home/restaurant/menu/snacks/choma_sausage_01.jpeg', slug: 'choma-sausage', category: 'snacks' },
  { id: 305, name: 'Chips', description: 'A plate of fries', price: '150', image: '/images/home/restaurant/menu/snacks/chips_01.jpg', slug: 'chips', category: 'snacks' },
  { id: 306, name: 'Sautee Potatoes', description: 'Sauteed potatoes, onions, tomatoes', price: '200', image: '/images/home/restaurant/menu/snacks/sauteed_potatoes_01.jpg', slug: 'sautee-potatoes', category: 'snacks' },

  // Quick Bites
  { id: 401, name: 'Chicken Wings', description: 'Deep fried chicken wings', price: '400', image: '/images/home/restaurant/menu/quick-bites/chicken_wings_01.jpg', slug: 'chicken-wings', category: 'quick-bites' },
  { id: 402, name: 'Fish Fingers', description: 'Fish fingers served with fries', price: '450', image: '/images/home/restaurant/menu/quick-bites/fish_fingers_01.webp', slug: 'fish-fingers', category: 'quick-bites' },
  { id: 403, name: 'Beef Burger', description: 'One large beef burger', price: '450', image: '/images/home/restaurant/menu/quick-bites/beef_burger_01.jpg', slug: 'beef-burger', category: 'quick-bites' },
  { id: 404, name: 'Cheese Burger', description: 'One large beef burger', price: '500', image: '/images/home/restaurant/menu/quick-bites/cheese_burger_01.webp', slug: 'cheese-burger', category: 'quick-bites' },

  //Soups
  { id: 501, name: 'Mushroom soup', description: 'Cream of mushroom soup', price: '250', image: '/images/home/restaurant/menu/soups/mushroom_soup_01.webp', slug: 'mushroom-soup', category: 'soups' },
  { id: 502, name: 'Ossubucco', description: 'Ossubucco soup served with toast', price: '250', image: '/images/home/restaurant/menu/soups/ossubucco_01.jpg', slug: 'ossubucco-soup', category: 'soups' },

  //Main Dishes
  { id: 601, name: 'Beef Quarter(1/4)', description: 'Beef Quarter(1/4) wet/dry fry', price: '400', image: '/images/home/restaurant/menu/main-dishes/beef_quarter_01.jpg', slug: 'beef-quarter', category: 'main-dishes' },
  { id: 602, name: 'Beef Half(1/2)', description: 'Beef Half(1/2) wet/dry fry', price: '600', image: '/images/home/restaurant/menu/main-dishes/beef_half_01.jpg', slug: 'beef-half', category: 'main-dishes' },
  { id: 603, name: 'Beef 1Kg', description: 'Beef 1Kg wet/dry fry', price: '1200', image: '/images/home/restaurant/menu/main-dishes/beef_1kg_01.jpg', slug: 'beef-1kg', category: 'main-dishes' },
  { id: 604, name: 'Chicken Quarter(1/4)', description: 'Chicken Quarter(1/4) wet/dry fry', price: '450', image: '/images/home/restaurant/menu/main-dishes/chicken_quarter_01.jpg', slug: 'chicken-quarter', category: 'main-dishes' },
  { id: 605, name: 'Chicken Half(1/2)', description: 'Chicken Half(1/2) wet/dry fry', price: '650', image: '/images/home/restaurant/menu/main-dishes/chicken_half_01.webp', slug: 'chicken-half', category: 'main-dishes' },
  { id: 606, name: 'Chicken Full', description: 'Chicken 1Kg wet/dry fry', price: '1200', image: '/images/home/restaurant/menu/main-dishes/chicken_full_01.jpg', slug: 'chicken-full', category: 'main-dishes' },
  { id: 607, name: 'Fish', description: 'Pan fried 200grams fish fillet', price: '500', image: '/images/home/restaurant/menu/main-dishes/fish_200_01.jpg', slug: 'fish-200', category: 'main-dishes' },
  { id: 608, name: 'Pork Half(1/2)', description: 'Pork Half(1/2) wet/dry fry', price: '500', image: '/images/home/restaurant/menu/main-dishes/pork_half_01.jpg', slug: 'pork-half', category: 'main-dishes' },
  { id: 609, name: 'Pork 1Kg', description: 'Pork 1Kg wet/dry fry', price: '950', image: '/images/home/restaurant/menu/main-dishes/pork_1kg_01.jpg', slug: 'pork-1kg', category: 'main-dishes' },
  { id: 6010, name: 'Mini Platter', description: 'Platter of 2, Chicken, Beef, Pork, Choma Sausage, Fried Sausage and a choice of two accompaniments', price: '1200', image: '/images/home/restaurant/menu/main-dishes/mini_platter_01.jpg', slug: 'mini-platter', category: 'main-dishes' },
  { id: 6011, name: 'King Platter', description: 'Platter of 4, Chicken, Beef, Pork, Choma Sausage, Fried Sausage and a choice of two accompaniments', price: '2300', image: '/images/home/restaurant/menu/main-dishes/king_platter_01.jpg', slug: 'king-platter', category: 'main-dishes' },

  // Accompaniments
  { id: 701, name: 'Regular Chips', description: 'Standard plate of fries', price: '150', image: '/images/home/restaurant/menu/accompaniments/regular_chips_01.webp', slug: 'regular-chips', category: 'accompaniments' },
  { id: 702, name: 'Roast Potatoes', description: 'Full Sized/Wedged roasted potatoes', price: '200', image: '/images/home/restaurant/menu/accompaniments/roast_potatoes_01.jpg', slug: 'roast-potatoes', category: 'accompaniments' },
  { id: 703, name: 'Ugali', description: 'Standard ugali serving', price: '80', image: '/images/home/restaurant/menu/accompaniments/ugali_01.jpg', slug: 'ugali', category: 'accompaniments' },
  { id: 704, name: 'Mukimo', description: 'Standard mukimo serving ', price: '120', image: '/images/home/restaurant/menu/accompaniments/mukimo_01.jpg', slug: 'mukimo', category: 'accompaniments' },
  { id: 705, name: 'Rice', description: 'Standard rice serving ', price: '100', image: '/images/home/restaurant/menu/accompaniments/rice_02.jpg', slug: 'rice', category: 'accompaniments' },

  
  // ... add more as you like
];

export const getMenuByCategory = (category: CategoryKey): MenuItem[] => {
  return fullMenu.filter(item => item.category === category);
};

export const getAllMenuItems = () => fullMenu;