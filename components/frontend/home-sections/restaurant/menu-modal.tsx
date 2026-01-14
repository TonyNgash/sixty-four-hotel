// components/frontend/home-sections/restaurant/menu-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, getMenuByCategory, MenuItem } from '@/lib/home-data/restaurant-data';
import CheckoutModal from '@/components/frontend/home-sections/restaurant/checkout-modal';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

const CART_STORAGE_KEY = 'hotel-menu-cart';

export default function MenuModal({
  isOpen,
  onClose,
  initialCategoryKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryKey: string | null;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

// Load + fix corrupted cart from localStorage (type-safe, no `any`)
// 2. REPLACE YOUR ENTIRE CART LOADING useEffect WITH THIS ONE (type-safe & bulletproof)

useEffect(() => {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved) as CartItem[];

    // Fix prices that might have been saved wrong
    const fixedCart: CartItem[] = parsed.map(cartItem => ({
      ...cartItem,
      item: {
        ...cartItem.item,
        price: String(cartItem.item.price).startsWith('Ksh')
          ? cartItem.item.price
          : `${parseFloat(String(cartItem.item.price)) || 0}` // fallback to 0 if NaN
      }
    }));

    setCart(fixedCart);
  } catch (error) {
    console.error('Corrupted cart data, clearing...', error);
    localStorage.removeItem(CART_STORAGE_KEY);
    setCart([]);
  }
}, []);

  // Set initial category when modal opens
  useEffect(() => {
    if (initialCategoryKey) {
      const i = categories.findIndex(c => c.key === initialCategoryKey);
      if (i !== -1) setIndex(i);
    }
  }, [initialCategoryKey]);

  // Load cart
  // useEffect(() => {
  //   const saved = localStorage.getItem(CART_STORAGE_KEY);
  //   if (saved) setCart(JSON.parse(saved));
  // }, []);

  // Save cart
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  const prev = () => setIndex(i => (i - 1 + categories.length) % categories.length);
  const next = () => setIndex(i => (i + 1) % categories.length);
  
  const formatPrice = (amount: number): string => {
    return amount.toLocaleString('en-KE', {
      minimumFractionDigits:2,
      maximumFractionDigits: 2,
    });
  };

  // 3. OPTIONAL BUT RECOMMENDED — clean the price when adding to cart too
  const addToCart = (item: MenuItem) => {
    // Ensure price is always a proper string like "$32.00"
    const cleanItem: MenuItem = {
      ...item,
      price: String(item.price).startsWith('Ksh') ? item.price : `${item.price}`
    };

    setCart(prev => {
      const existing = prev.find(x => x.item.id === cleanItem.id);
      if (existing) {
        return prev.map(x => 
          x.item.id === cleanItem.id 
            ? { ...x, quantity: x.quantity + 1 } 
            : x
        );
      }
      return [...prev, { item: cleanItem, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev
      .map(x => x.item.id === id ? { ...x, quantity: Math.max(0, x.quantity + delta) } : x)
      .filter(x => x.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const total = cart.reduce((sum, {item, quantity }) => {
    const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
    return sum + (isNaN(price) ? 0 : price) * quantity;
  }, 0);

  

  if (!isOpen) return null;

  const currentCategory = categories[index];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 px-4 pb-4 md:p-0">
      <div className="bg-white w-[70vw] md:w-[70vw] max-w-2xl h-[92vh] md:h-auto md:max-h-[90vh] rounded-t-3xl flex flex-col shadow-2xl">

        {/* Header */}
        <div className="pl-4 pr-4 lg:pl-6 lg:pr-6 border-b bg-gradient-to-r from-[#EB1B69] to-pink-600 text-white flex justify-between items-center rounded-t-xl">
          <h2 className="text-center text-xl md:text-2xl font-bold font-playfair">Price Calculator</h2>
          <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-full">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="bg-amber-50 px-6 py-2 flex justify-between items-center border-b">
            <div className="text-sm font-bold">
              {cart.reduce((s, x) => s + x.quantity, 0)} items • Ksh {formatPrice(total)}
            </div>
            <button onClick={clearCart} className="text-red-600 text-sm flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Clear Calculator
            </button>
          </div>
        )}

        {/* Carousel Body – exactly like your nightclub one */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="flex h-full transition-transform duration-500 ease-in-out"
               style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {categories.map((category) => {
              const items = getMenuByCategory(category.key);
              return (
                <section 
                  key={category.key} 
                  className="min-w-full px-1 sm:px-4 md:px-6 pb-6 overflow-y-auto" 
                  style={{
                    height:'calc(100vh - 200px)',
                    maxHeight: '100%',
                }}
                onWheel={(e) => {
                  const atBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 5;
                  const atTop = e.currentTarget.scrollTop <= 0;
                  if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)){
                    e.preventDefault();
                  }
                }}
                >
                  <h3 className="text-lg font-bold text-center mb-4 sticky top-0 text-gray-800 z-10 py-4  bg-white">
                    {category.label}
                  </h3>
                  <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-6 pb-10 md:pb-20 ">
                    {items.map(item => {
                      const qty = cart.find(c => c.item.id === item.id)?.quantity || 0;
                      const itemPrice = parseInt(item.price);
                      return (
                        <div key={item.id} className="flex gap-1 bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
                          {/* <img src={item.image} alt={item.name} className="w-32 h-32 object-cover" /> */}
                          <img  src={item.image}  alt={item.name}  className="w-22 object-cover" />
                          <div className="flex-1 py-2 pr-5 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-md text-black">{item.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
                              <span className="text-md lg:text-2xl font-bold text-pink-500">
                                Ksh {formatPrice(itemPrice)}/-
                              </span>
                              <span>
                                {qty === 0 ? (
                                  <button
                                    onClick={() => addToCart(item)}
                                    className="px-8 py-3 bg-[#EB1B69] text-white rounded-full font-medium hover:bg-[#c7155a] transition"
                                  >
                                    Add
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-blue-500 text-white flex items-center">
                                      <Minus className="w-6 h-6 p-1 lg:w-10 lg:h-10 lg:p-2" />
                                    </button>
                                    <span className="text-xl lg:text-3xl font-bold w-8 lg:w-12 text-center">{qty}</span>
                                    <button onClick={() => updateQuantity(item.id, +1)} className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-[#EB1B69] text-white flex items-center">
                                      <Plus className="w-6 h-6 p-1 lg:w-10 lg:h-10 lg:p-2" />
                                    </button>
                                  </div>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Left / Right Arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-18 lg:h-18 rounded-full bg-white/90 shadow-xl flex items-center hover:bg-white transition"
          >
            <ChevronLeft className="w-7 h-7 text-pink-700 lg:w-17 lg:h-17" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-18 lg:h-18 rounded-full bg-white/90 shadow-xl flex-center hover:bg-white transition"
          >
            <ChevronRight className="w-7 h-7 text-pink-700 lg:w-17 lg:h-17" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full transition-all ${i === index ? 'bg-[#EB1B69] w-12' : 'bg-gray-400 w-3'}`}
              />
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        {cart.length > 0 && (
          <div className="pt-4 pb-10 px-4 lg:pt-6 border-t bg-white flex-shrink-0">
            <button
              onClick={() => setIsCheckoutOpen(true)} 
              className="w-full py-2 lg:py-6 bg-[#EB1B69] text-white text-md lg:text-xl rounded-full hover:bg-[#d4165a] transition shadow-xl cursor-pointer">
              View Selection • Ksh {formatPrice(total)}
            </button>
          </div>
        )}
      </div>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        onClearCart={clearCart}
      />
    </div>
  );
}