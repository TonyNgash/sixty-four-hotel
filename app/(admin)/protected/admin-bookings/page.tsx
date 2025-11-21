'use client';

import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

// Mock data - we'll replace this with real data later
const mockBookings = [
  {
    id: 1,
    bookingNumber: 'BK-001',
    customerName: 'James Mutua',
    customerEmail: 'james.mutua@email.com',
    customerPhone: '+254712345678',
    roomNumber: '101',
    roomType: 'Single Bed',
    checkIn: '2024-01-20',
    checkOut: '2024-01-25',
    nights: 5,
    guests: 1,
    totalAmount: 60000,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingDate: '2024-01-15',
    specialRequests: 'Early check-in requested',
  },
  {
    id: 2,
    bookingNumber: 'BK-002',
    customerName: 'Mary Wanjiku',
    customerEmail: 'mary.wanjiku@email.com',
    customerPhone: '+254723456789',
    roomNumber: '201',
    roomType: 'Furnished Apartment',
    checkIn: '2024-01-22',
    checkOut: '2024-01-24',
    nights: 2,
    guests: 2,
    totalAmount: 50000,
    status: 'checked_in',
    paymentStatus: 'paid',
    bookingDate: '2024-01-18',
    specialRequests: 'Anniversary celebration',
  },
  {
    id: 3,
    bookingNumber: 'BK-003',
    customerName: 'Robert Omondi',
    customerEmail: 'robert.omondi@email.com',
    customerPhone: '+254734567890',
    roomNumber: '102',
    roomType: 'Double Bed',
    checkIn: '2024-02-01',
    checkOut: '2024-02-05',
    nights: 4,
    guests: 2,
    totalAmount: 72000,
    status: 'pending',
    paymentStatus: 'pending',
    bookingDate: '2024-01-19',
    specialRequests: '',
  },
  {
    id: 4,
    bookingNumber: 'BK-004',
    customerName: 'Grace Akinyi',
    customerEmail: 'grace.akinyi@email.com',
    customerPhone: '+254745678901',
    roomNumber: '103',
    roomType: 'Single Bed',
    checkIn: '2024-01-18',
    checkOut: '2024-01-19',
    nights: 1,
    guests: 1,
    totalAmount: 12000,
    status: 'checked_out',
    paymentStatus: 'paid',
    bookingDate: '2024-01-17',
    specialRequests: 'Late checkout needed',
  },
  {
    id: 5,
    bookingNumber: 'BK-005',
    customerName: 'Daniel Kibet',
    customerEmail: 'daniel.kibet@email.com',
    customerPhone: '+254756789012',
    roomNumber: '202',
    roomType: 'Furnished Apartment',
    checkIn: '2024-02-10',
    checkOut: '2024-02-15',
    nights: 5,
    guests: 3,
    totalAmount: 125000,
    status: 'cancelled',
    paymentStatus: 'refunded',
    bookingDate: '2024-01-16',
    specialRequests: '',
  },
];

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

export default function BookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'>('all');

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

  const handleDelete = () => {
    // Temporary mock delete - we'll implement real delete later
    setBookings(prev => prev.filter(booking => !selectedBookings.includes(booking.id)));
    setSelectedBookings([]);
    setShowDeleteModal(false);
  };

  const getStatusIcon = (status: keyof typeof statusIcons) => {
    const IconComponent = statusIcons[status];
    return <IconComponent className="h-4 w-4" />;
  };

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
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                Cancel Selected ({selectedBookings.length})
              </button>
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
            {['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
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
                          {booking.bookingNumber}
                        </div>
                        <div className="text-sm text-gray-900 font-semibold mt-1">
                          {booking.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customerEmail}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {booking.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        Room {booking.roomNumber} • {booking.roomType}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {booking.checkIn} → {booking.checkOut}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.nights} night{booking.nights !== 1 ? 's' : ''} • {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                      </div>
                      {booking.specialRequests && (
                        <div className="text-xs text-blue-600 mt-1">
                          💬 Special request
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        KSh {booking.totalAmount.toLocaleString()}
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
                        Booked: {booking.bookingDate}
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
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedBookings([booking.id]);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cancel Bookings
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel {selectedBookings.length} selected booking(s)? 
              This action cannot be undone.
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
                Cancel Bookings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}