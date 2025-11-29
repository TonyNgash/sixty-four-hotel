'use client';

import { useState } from 'react';
// import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { RoomForm } from '@/components/admin/forms/room-form';
import { Modal } from '@/components/ui/modal';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { useRooms } from '@/hooks/use-rooms';
import { useRoomCategories } from '@/hooks/use-room-categories';
import { useViewTypes } from '@/hooks/use-view-types';
import { useAmenities } from '@/hooks/use-amenities';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  TagIcon,
  ViewfinderCircleIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import type { RoomFormData } from '@/components/admin/forms/room-form';

// Define proper TypeScript interfaces
interface Room {
  id: number;
  roomNumber: string;
  category: string;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  viewType: string;
  basePrice: number;
  amenities: string[];
  lastCleaned: string;
}

const statusColors = {
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-red-100 text-red-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
};

export default function RoomsPage() {
  const { 
    rooms: apiRooms, 
    loading, 
    error, 
    createRoom, 
    bulkDeleteRooms,
    refetch 
  } = useRooms();

  const { categories: roomCategories } = useRoomCategories();
  const { viewTypes } = useViewTypes();
  const { amenities } = useAmenities();

  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusModalData, setStatusModalData] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ type: 'success', title: '', message: '' });

  const handleAddNew = () => {
    setShowRoomForm(true);
    setSubmitError(null);
  };

  // Transform API data to match existing interface
  const rooms: Room[] = apiRooms.map(room => ({
    id: room.id,
    roomNumber: room.room_number,
    category: room.category?.name || 'Uncategorized',
    status: room.status,
    floor: room.floor,
    viewType: room.viewType?.name || 'No View',
    basePrice: room.category?.base_price || 0,
    amenities: room.amenities?.map(a => a.name) || [],
    lastCleaned: room.created_at ? new Date(room.created_at).toISOString().split('T')[0] : 'N/A'
  }));

  const toggleRoomSelection = (roomId: number) => {
    setSelectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const selectAllRooms = () => {
    setSelectedRooms(rooms.length === selectedRooms.length ? [] : rooms.map(room => room.id));
  };

  const handleDelete = async () => {
    if (selectedRooms.length === 0) return;

    setIsSubmitting(true);
    
    try {
      const result = await bulkDeleteRooms(selectedRooms);
      
      if (!result.success) {
        setStatusModalData({
          type: 'error',
          title: 'Deletion Failed',
          message: result.error || 'Failed to delete rooms. Please try again.',
        });
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: `${selectedRooms.length} room${selectedRooms.length === 1 ? ' was' : 's were'} deleted successfully.`,
        });
      }
    } catch (error) {
      console.error('Error deleting rooms:', error);
      setStatusModalData({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred while deleting rooms.',
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
      setShowStatusModal(true);
      setSelectedRooms([]);
    }
  };

  const handleRoomSubmit = async (roomData: RoomFormData) => {
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Transform form data to API format - NOW USING IDs DIRECTLY
      const createData = {
        roomNumber: roomData.roomNumber,
        status: roomData.status,
        floor: parseInt(roomData.floor),
        categoryId: roomData.categoryId,
        viewTypeId: roomData.viewTypeId,
        amenityIds: roomData.amenityIds,
        images: roomData.images,
      };

      const result = await createRoom(createData);

      if (!result.success) {
        setSubmitError(result.error || 'Failed to create room page.tsx:156');
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: 'Room created successfully! page.tsx',
        });
        setShowRoomForm(false);
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Error creating room page.tsx:167', error);
      setSubmitError('An unexpected error occurred page.tsx');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use Link components for navigation instead of window.location
  const navigateToCategories = () => {
    window.location.href = 'admin-rooms/room-categories';
  };

  const navigateToAmenities = () => {
    window.location.href = 'admin-rooms/amenities';
  };

  const navigateToViewTypes = () => {
    window.location.href = 'admin-rooms/view-types';
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BuildingOfficeIcon className="h-6 w-6" />
              Room Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all hotel rooms, availability, and details
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedRooms.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Selected ({selectedRooms.length})
              </button>
            )}
            <button 
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Room
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{rooms.length}</div>
            <div className="text-gray-600 text-sm">Total Rooms</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {rooms.filter(r => r.status === 'available').length}
            </div>
            <div className="text-gray-600 text-sm">Available</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {rooms.filter(r => r.status === 'occupied').length}
            </div>
            <div className="text-gray-600 text-sm">Occupied</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {rooms.filter(r => r.status === 'maintenance').length}
            </div>
            <div className="text-gray-600 text-sm">Maintenance</div>
          </div>
        </div>

        {/* Configuration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={navigateToCategories}
            className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <TagIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Room Categories</h3>
                <p className="text-sm text-gray-600 mt-1">Manage room types and pricing</p>
              </div>
            </div>
          </button>

          <button
            onClick={navigateToAmenities}
            className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Cog6ToothIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Amenities</h3>
                <p className="text-sm text-gray-600 mt-1">Manage room features and services</p>
              </div>
            </div>
          </button>

          <button
            onClick={navigateToViewTypes}
            className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <ViewfinderCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Types</h3>
                <p className="text-sm text-gray-600 mt-1">Manage room views and orientations</p>
              </div>
            </div>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading rooms...</p>
          </div>
        )}

        {/* Rooms Table */}
        {!loading && (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedRooms.length === rooms.length && rooms.length > 0}
                        onChange={selectAllRooms}
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category & Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Cleaned
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr 
                      key={room.id} 
                      className={cn(
                        selectedRooms.includes(room.id) ? 'bg-blue-50' : 'hover:bg-gray-50',
                        'transition-colors'
                      )}
                    >
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedRooms.includes(room.id)}
                          onChange={() => toggleRoomSelection(room.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Room {room.roomNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              Floor {room.floor} • {room.viewType} View
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {room.amenities.slice(0, 2).join(', ')}
                              {room.amenities.length > 2 && ` +${room.amenities.length - 2} more`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{room.category}</div>
                        <div className="text-sm text-gray-500">KSh {room.basePrice.toLocaleString()}/night</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          statusColors[room.status]
                        )}>
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {room.lastCleaned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedRooms([room.id]);
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
        )}

        {/* Empty State */}
        {!loading && rooms.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new room.</p>
            <div className="mt-6">
              <button 
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add New Room
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Room Form Modal */}
      <Modal
        isOpen={showRoomForm}
        onClose={() => setShowRoomForm(false)}
        title="Add New Room"
        size="lg"
      >
        <RoomForm
          onSubmit={handleRoomSubmit}
          onCancel={() => setShowRoomForm(false)}
          isSubmitting={isSubmitting}
          error={submitError}
          mode="create"
          // roomCategories={roomCategories}
          // viewTypes={viewTypes}
          // amenities={amenities}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRooms([]);
        }}
        onConfirm={handleDelete}
        title="Delete Rooms"
        message={`Are you sure you want to delete ${selectedRooms.length} selected room(s)? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />

      {/* Status Modal (Success/Error) */}
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={() => setShowStatusModal(false)}
        title={statusModalData.title}
        message={statusModalData.message}
        confirmText="OK"
        cancelText={undefined}
        variant={statusModalData.type === 'success' ? 'info' : 'danger'}
      />
    </>
  );
}