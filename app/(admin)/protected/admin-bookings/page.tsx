// app/(admin)/protected/admin-bookings/page.tsx
'use client';

import { 
  PlusIcon, 
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import { useState, useEffect } from 'react';
import { useAdminBookings, AdminBooking } from '@/hooks/use-admin-bookings';
import { format } from 'date-fns';
import { BookingDetailsModal } from '@/components/admin/modals/booking-details-modal';

// Define a proper type for the filter status
type FilterStatus = 'all' | 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

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

const statusIcons = {
  pending: ClockIcon,
  confirmed: CheckCircleIcon,
  checked_in: CheckCircleIcon,
  checked_out: CheckCircleIcon,
  cancelled: XCircleIcon,
};

// Helper function to safely format a date
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

export default function BookingsPage() {
  const { bookings, isLoading, error, refetch } = useAdminBookings();
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const toggleBookingSelection = (bookingId: number) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const selectAllBookings = () => {
    setSelectedBookings(
      filteredBookings.length === selectedBookings.length 
        ? [] 
        : filteredBookings.map(booking => booking.id)
    );
  };

  const handleCancel = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingIds: selectedBookings,
          action: 'cancel'
        }),
      });

      if (response.ok) {
        setSelectedBookings([]);
        setShowCancelModal(false);
        refetch();
      } else {
        console.error('Failed to cancel bookings');
      }
    } catch (error) {
      console.error('Error cancelling bookings:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingIds: selectedBookings,
          action: 'delete'
        }),
      });

      if (response.ok) {
        setSelectedBookings([]);
        setShowDeleteModal(false);
        refetch();
      } else {
        console.error('Failed to delete bookings');
      }
    } catch (error) {
      console.error('Error deleting bookings:', error);
    }
  };

  const handleViewDetails = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleSingleCancel = (booking: AdminBooking) => {
    setSelectedBookings([booking.id]);
    setShowCancelModal(true);
  };

  const handleSingleDelete = (booking: AdminBooking) => {
    setSelectedBookings([booking.id]);
    setShowDeleteModal(true);
  };

  const getStatusIcon = (status: keyof typeof statusIcons) => {
    const IconComponent = statusIcons[status];
    return <IconComponent className="h-4 w-4" />;
  };

  const getCustomerFullName = (booking: AdminBooking) => {
    if (booking.customerName && booking.customerLastName) {
      return `${booking.customerName} ${booking.customerLastName}`;
    }
    if (booking.customerName) {
      return booking.customerName;
    }
    if (booking.specialRequests && booking.specialRequests.includes('Customer:')) {
      // Extract name from special requests if customer info is not available
      const match = booking.specialRequests.match(/Customer: ([^,]+)/);
      return match ? match[1] : 'Unknown Customer';
    }
    return 'Unknown Customer';
  };

  const getRoomInfo = (booking: AdminBooking) => {
    if (booking.roomNumber && booking.categoryName) {
      return `Room ${booking.roomNumber} • ${booking.categoryName}`;
    }
    return `${booking.archivedRoomNumber} • ${booking.archivedRoomCategory}`;
  };

  const getNightsCount = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              Bookings Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer reservations, check-ins, and check-outs
            </p>
          </div>
          
          <div className="flex gap-2">
            {selectedBookings.length > 0 && (
              <>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Cancel Selected ({selectedBookings.length})
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete Selected ({selectedBookings.length})
                </button>
              </>
            )}
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-4 w-4" />
              New Booking
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
            <div className="text-gray-600 text-sm">Total Bookings</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-gray-600 text-sm">Confirmed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'checked_in').length}
            </div>
            <div className="text-gray-600 text-sm">Checked In</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'cancelled').length}
            </div>
            <div className="text-gray-600 text-sm">Cancelled</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {status.replace('_', ' ')} ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                      onChange={selectAllBookings}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking & Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room & Dates
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount & Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className={cn(
                      selectedBookings.includes(booking.id) ? 'bg-blue-50' : 'hover:bg-gray-50',
                      'transition-colors'
                    )}
                  >
                    <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={() => toggleBookingSelection(booking.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          BK-{String(booking.id).padStart(3, '0')}
                        </div>
                        <div className="text-sm text-gray-900 font-semibold mt-1">
                          {getCustomerFullName(booking)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customerEmail || 'No email'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {booking.customerPhone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getRoomInfo(booking)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {booking.checkInDate} → {booking.checkOutDate}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getNightsCount(booking.checkInDate, booking.checkOutDate)} night(s)
                      </div>
                      {booking.specialRequests && (
                        <div className="text-xs text-blue-600 mt-1">
                          💬 Special request
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        KSh {(booking.totalAmount / 100).toLocaleString()}
                      </div>
                      <div className="mt-1">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full capitalize',
                          paymentStatusColors[booking.paymentStatus as keyof typeof paymentStatusColors]
                        )}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Booked: {safeFormatDate(booking.createdAt, 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full capitalize',
                        statusColors[booking.status as keyof typeof statusColors]
                      )}>
                        {getStatusIcon(booking.status as keyof typeof statusIcons)}
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleViewDetails(booking)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleSingleCancel(booking)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Cancel Booking"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleSingleDelete(booking)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Booking"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "Get started by creating your first booking." 
                : `No ${filter.replace('_', ' ')} bookings found.`
              }
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="h-4 w-4" />
                New Booking
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cancel Bookings
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel {selectedBookings.length} selected booking(s)? 
              This will change their status to &apos;cancelled&apos; but keep them in the system.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep Bookings
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Cancel Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Bookings
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete {selectedBookings.length} selected booking(s)? 
              This action cannot be undone and will remove all booking data from the system.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep Bookings
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal 
        booking={selectedBooking}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  );
}