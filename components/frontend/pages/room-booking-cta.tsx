'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingModal from './booking-modal';

interface RoomBookingCtaProps {
  price: number;
  roomId: number;
  roomNumber: string;
}

export default function RoomBookingCta({ price, roomId, roomNumber }: RoomBookingCtaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {/* KSh {price.toLocaleString()} */}
            <span className="text-lg font-normal text-gray-600"> / night</span>
          </div>
          <div className="text-sm text-gray-600 mb-6">Taxes included</div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Room Now
          </button>

          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <div className="flex justify-between"><span>Free cancellation</span><span className="font-medium">Until 48h before</span></div>
            <div className="flex justify-between"><span>Breakfast included</span><span className="font-medium">On request</span></div>
            <div className="flex justify-between"><span>Check-in</span><span className="font-medium">2:00 PM</span></div>
            <div className="flex justify-between"><span>Check-out</span><span className="font-medium">11:00 AM</span></div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomId={roomId}
        roomNumber={roomNumber}
        pricePerNight={price}
      />
    </>
  );
}