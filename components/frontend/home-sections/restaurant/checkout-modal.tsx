// components/frontend/home-sections/restaurant/checkout-modal.tsx
'use client';

import { X } from 'lucide-react';
import { MenuItem } from '@/lib/home-data/restaurant-data';

// Define CartItem right here — it's only used in the UI
interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onClearCart: () => void;
}
const formatPrice = (amount: number): string => {
    return amount.toLocaleString('en-KE', {
        minimumFractionDigits:2,
        maximumFractionDigits: 2,
    });
};

export default function CheckoutModal({ isOpen, onClose, cart, total, onClearCart }: CheckoutModalProps) {
  if (!isOpen) return null;

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#EB1B69] to-pink-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-playfair">Price Calculator</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="max-h-96 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            cart.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-gray-100 rounded-xl px-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{formatPrice(parseInt(item.price))} × {quantity}</p>
                </div>
                <p className="font-bold text-[#EB1B69]">
                  {formatPrice((parseFloat(item.price.replace(/[^0-9.]/g, '')) * quantity))}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Total & Actions */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total ({itemCount} items)</span>
            <span className="text-3xl font-bold text-[#EB1B69]">Ksh {formatPrice(total)}/-</span>
          </div>

          <div className="space-y-3">
            {/* <button className="w-full py-4 bg-[#EB1B69] text-white font-bold rounded-full hover:bg-[#c7155a] transition shadow-lg">
              Send Order via WhatsApp
            </button>
            <button
                onClick={() => {
                    const orderText = cart
                    .map(({ item, quantity }) => `• ${quantity}x ${item.name} — ${item.price}`)
                    .join('\n');
                    const message = `Hello! I'd like to order:\n\n${orderText}\n\nTotal: Ksh ${total.toFixed(2)}`;
                    window.open(`https://wa.me/254790818789?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition shadow-lg"
            >
                Send Order via WhatsApp
            </button> */}
            {/* <button
              onClick={onClearCart}
              className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-full transition"
            >
              Clear All Items
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}