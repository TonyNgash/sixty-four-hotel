// components/customer/shared/booking-card.tsx
'use client';

import { format } from 'date-fns';
import { Booking } from '@/hooks/use-bookings';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const roomInfo = booking.roomNumber 
    ? `${booking.roomNumber} - ${booking.categoryName || 'Unknown Category'}`
    : `${booking.archivedRoomNumber} - ${booking.archivedRoomCategory}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking #{booking.id}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{roomInfo}</p>
          {booking.viewName && (
            <p className="text-sm text-gray-500">{booking.viewName} View</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
            {booking.paymentStatus.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Check-in</p>
          <p className="font-medium">
            {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Check-out</p>
          <p className="font-medium">
            {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-xl font-bold text-gray-900">
            KES {(booking.totalAmount / 100).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            Booked on {format(new Date(booking.createdAt * 1000), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      {booking.specialRequests && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Special Requests</p>
          <p className="text-sm text-gray-700">{booking.specialRequests}</p>
        </div>
      )}
    </div>
  );
}