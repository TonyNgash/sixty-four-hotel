// components/admin/booking-details-modal.tsx
'use client';

import { 
  XMarkIcon,
  UserIcon,
  HomeIcon,
  CalendarIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { AdminBooking } from '@/hooks/use-admin-bookings';

interface BookingDetailsModalProps {
  booking: AdminBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

const safeFormatDate = (timestamp: number | string | null | undefined, formatString: string) => {
  if (!timestamp) return 'Unknown date';
  
  try {
    let date: Date;
    
    // If it's already a number, determine if it's in seconds or milliseconds
    if (typeof timestamp === 'number') {
      // Unix timestamps are typically in seconds, but JavaScript uses milliseconds
      // If timestamp is less than a reasonable year 2000 value in milliseconds, assume it's in seconds
      if (timestamp < 1000000000000) {
        date = new Date(timestamp * 1000);
      } else {
        date = new Date(timestamp);
      }
    } 
    // If it's a string, try to parse it
    else {
      date = new Date(timestamp);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
};

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!booking || !isOpen) return null;

  const getCustomerFullName = () => {
    if (booking.customerName && booking.customerLastName) {
      return `${booking.customerName} ${booking.customerLastName}`;
    }
    if (booking.customerName) {
      return booking.customerName;
    }
    if (booking.specialRequests && booking.specialRequests.includes('Customer:')) {
      const match = booking.specialRequests.match(/Customer: ([^,]+)/);
      return match ? match[1] : 'Unknown Customer';
    }
    return 'Unknown Customer';
  };

  const getRoomInfo = () => {
    if (booking.roomNumber && booking.categoryName) {
      return `Room ${booking.roomNumber} • ${booking.categoryName}`;
    }
    return `${booking.archivedRoomNumber} • ${booking.archivedRoomCategory}`;
  };

  const getNightsCount = () => {
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-green-100 text-green-800',
    checked_out: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-gray-100 text-gray-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Booking Details - #{booking.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <UserIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Customer Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{getCustomerFullName()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{booking.customerEmail || 'No email'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{booking.customerPhone || 'No phone'}</p>
              </div>
            </div>
          </div>

          {/* Room Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <HomeIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Room Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Room</p>
                <p className="font-medium">{getRoomInfo()}</p>
              </div>
              {booking.viewName && (
                <div>
                  <p className="text-sm text-gray-500">View Type</p>
                  <p className="font-medium">{booking.viewName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Booking Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Check-in Date</p>
                <p className="font-medium">{booking.checkInDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check-out Date</p>
                <p className="font-medium">{booking.checkOutDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{getNightsCount()} night(s)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booked On</p>
                <p className="font-medium">{safeFormatDate(booking.createdAt, 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCardIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Payment Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-lg">KSh {(booking.totalAmount / 100).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full capitalize ${paymentStatusColors[booking.paymentStatus as keyof typeof paymentStatusColors]}`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-5 w-5 text-gray-600">📊</span>
              <h3 className="font-semibold text-gray-900">Status Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Booking Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[booking.status as keyof typeof statusColors]}`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Special Requests</h3>
              </div>
              <p className="text-gray-700">{booking.specialRequests}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}