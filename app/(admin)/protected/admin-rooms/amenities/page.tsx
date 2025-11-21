'use client';

import { useState, ReactElement } from 'react';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { RoomManagementTable } from '@/components/admin/data-tables/room-management-table';
import { AmenityForm } from '@/components/admin/forms/amenity-form';
import { Modal } from '@/components/ui/modal';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { useAmenities } from '@/hooks/use-amenities';
import type { Amenity } from '@/types/database';
import type { Column } from '@/components/admin/data-tables/room-management-table';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AmenityFormData {
  name: string;
  description: string;
  icon: string;
}

interface TableAmenity extends Omit<Amenity, 'icon'> {
  icon: ReactElement;
}

const columns: Column<TableAmenity>[] = [
  { key: 'icon', label: 'Icon', sortable: false },
  { key: 'name', label: 'Amenity Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
];

export default function AmenitiesPage() {
  const { 
    amenities, 
    loading, 
    error, 
    createAmenity, 
    updateAmenity, 
    deleteAmenity,
    bulkDeleteAmenities,
    refetch 
  } = useAmenities();

  const [showAmenityForm, setShowAmenityForm] = useState(false);
  const [showEditAmenityForm, setShowEditAmenityForm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusModalData, setStatusModalData] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ type: 'success', title: '', message: '' });
  const [pendingBulkDeleteIds, setPendingBulkDeleteIds] = useState<number[]>([]);
  const [editingAmenity, setEditingAmenity] = useState<{
    id: number;
    data: AmenityFormData;
  } | null>(null);

  const handleAddNew = () => {
    setShowAmenityForm(true);
    setSubmitError(null);
  };

  const handleEdit = (amenity: TableAmenity) => {
    // Find the original amenity data to get the icon
    const originalAmenity = amenities.find(a => a.id === amenity.id);
    
    if (!originalAmenity) {
      console.error('Amenity not found for editing:', amenity.id);
      return;
    }

    // Convert the table data back to form data format
    const formData: AmenityFormData = {
      name: amenity.name,
      description: amenity.description || '',
      icon: originalAmenity.icon || '⭐', // Use the original icon from database
    };

    setEditingAmenity({
      id: amenity.id,
      data: formData,
    });
    setShowEditAmenityForm(true);
  };

  const handleDelete = async (amenity: TableAmenity) => {
    setPendingBulkDeleteIds([amenity.id]);
    setStatusModalData({
      type: 'error',
      title: 'Delete Amenity',
      message: `Are you sure you want to delete "${amenity.name}"? This action cannot be undone.`,
    });
    setShowBulkDeleteConfirm(true);
  };

  const handleBulkDelete = async (selectedIds: number[]) => {
    if (selectedIds.length === 0) return;
    
    setPendingBulkDeleteIds(selectedIds);
    setStatusModalData({
      type: 'error',
      title: 'Delete Amenities',
      message: `Are you sure you want to delete ${selectedIds.length} amenit${selectedIds.length === 1 ? 'y' : 'ies'}? This action cannot be undone.`,
    });
    setShowBulkDeleteConfirm(true);
  };

  const executeBulkDelete = async () => {
    if (pendingBulkDeleteIds.length === 0) return;

    setShowBulkDeleteConfirm(false);
    setIsSubmitting(true);

    try {
      const result = await bulkDeleteAmenities(pendingBulkDeleteIds);
      
      if (!result.success) {
        setStatusModalData({
          type: 'error',
          title: 'Deletion Failed',
          message: result.error || 'Failed to delete amenities. Please try again.',
        });
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: `${pendingBulkDeleteIds.length} amenit${pendingBulkDeleteIds.length === 1 ? 'y was' : 'ies were'} deleted successfully.`,
        });
      }
    } catch (error) {
      console.error('Error bulk deleting amenities:', error);
      setStatusModalData({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred while deleting amenities.',
      });
    } finally {
      setIsSubmitting(false);
      setShowStatusModal(true);
      setPendingBulkDeleteIds([]);
    }
  };

  const handleAmenitySubmit = async (amenityData: AmenityFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createAmenity({
        name: amenityData.name,
        description: amenityData.description,
        icon: amenityData.icon,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Failed to create amenity');
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: 'Amenity created successfully!',
        });
        setShowAmenityForm(false);
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Error creating amenity:', error);
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmenityUpdate = async (amenityData: AmenityFormData) => {
    if (!editingAmenity) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await updateAmenity(editingAmenity.id, {
        name: amenityData.name,
        description: amenityData.description,
        icon: amenityData.icon,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Failed to update amenity');
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: 'Amenity updated successfully!',
        });
        setShowEditAmenityForm(false);
        setEditingAmenity(null);
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Error updating amenity:', error);
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format data for table display with icons and descriptions
  const tableData: TableAmenity[] = amenities.map(amenity => ({
    id: amenity.id,
    name: amenity.name,
    description: amenity.description || '', // Ensure description is never null
    created_at: amenity.created_at,
    icon: <span className="text-2xl">{amenity.icon}</span>, // Use the actual icon from database
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link 
          href="/rooms"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Rooms
        </Link>

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

        {/* Room Management Table */}
        <RoomManagementTable<TableAmenity>
          title="Amenities"
          data={tableData}
          columns={columns}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading amenities...</p>
          </div>
        )}
      </div>

      {/* Add Amenity Form Modal */}
      <Modal
        isOpen={showAmenityForm}
        onClose={() => setShowAmenityForm(false)}
        title="Add New Amenity"
        size="md"
      >
        <AmenityForm
          onSubmit={handleAmenitySubmit}
          onCancel={() => setShowAmenityForm(false)}
          isSubmitting={isSubmitting}
          error={submitError}
          mode="create"
        />
      </Modal>

      {/* Edit Amenity Form Modal */}
      <Modal
        isOpen={showEditAmenityForm}
        onClose={() => {
          setShowEditAmenityForm(false);
          setEditingAmenity(null);
        }}
        title="Edit Amenity"
        size="md"
      >
        <AmenityForm
          onSubmit={handleAmenityUpdate}
          onCancel={() => {
            setShowEditAmenityForm(false);
            setEditingAmenity(null);
          }}
          isSubmitting={isSubmitting}
          initialData={editingAmenity?.data}
          error={submitError}
          mode="edit"
        />
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkDeleteConfirm}
        onClose={() => {
          setShowBulkDeleteConfirm(false);
          setPendingBulkDeleteIds([]);
        }}
        onConfirm={executeBulkDelete}
        title={statusModalData.title}
        message={statusModalData.message}
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
    </AdminLayout>
  );
}