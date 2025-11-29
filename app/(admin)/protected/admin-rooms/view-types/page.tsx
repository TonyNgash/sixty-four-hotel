'use client';

import { useState, ReactElement } from 'react';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { RoomManagementTable } from '@/components/admin/data-tables/room-management-table';
import { ViewTypeForm } from '@/components/admin/forms/view-type-form';
import { Modal } from '@/components/ui/modal';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { useViewTypes } from '@/hooks/use-view-types';
import type { ViewType } from '@/types/database';
import type { Column } from '@/components/admin/data-tables/room-management-table';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ViewTypeFormData {
  name: string;
  description: string;
}

interface TableViewType extends Omit<ViewType, 'description'> {
  description: string;
}

const columns: Column<TableViewType>[] = [
  { key: 'name', label: 'View Type', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
];

export default function ViewTypesPage() {
  const { 
    viewTypes, 
    loading, 
    error, 
    createViewType, 
    updateViewType, 
    deleteViewType,
    bulkDeleteViewTypes,
    refetch 
  } = useViewTypes();

  const [showViewTypeForm, setShowViewTypeForm] = useState(false);
  const [showEditViewTypeForm, setShowEditViewTypeForm] = useState(false);
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
  const [editingViewType, setEditingViewType] = useState<{
    id: number;
    data: ViewTypeFormData;
  } | null>(null);

  const handleAddNew = () => {
    setShowViewTypeForm(true);
    setSubmitError(null);
  };

  const handleEdit = (viewType: TableViewType) => {
    // Convert the table data back to form data format
    const formData: ViewTypeFormData = {
      name: viewType.name,
      description: viewType.description || '',
    };

    setEditingViewType({
      id: viewType.id,
      data: formData,
    });
    setShowEditViewTypeForm(true);
  };

  const handleDelete = async (viewType: TableViewType) => {
    setPendingBulkDeleteIds([viewType.id]);
    setStatusModalData({
      type: 'error',
      title: 'Delete View Type',
      message: `Are you sure you want to delete "${viewType.name}"? This action cannot be undone.`,
    });
    setShowBulkDeleteConfirm(true);
  };

  const handleBulkDelete = async (selectedIds: number[]) => {
    if (selectedIds.length === 0) return;
    
    setPendingBulkDeleteIds(selectedIds);
    setStatusModalData({
      type: 'error',
      title: 'Delete View Types',
      message: `Are you sure you want to delete ${selectedIds.length} view type${selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.`,
    });
    setShowBulkDeleteConfirm(true);
  };

  const executeBulkDelete = async () => {
    if (pendingBulkDeleteIds.length === 0) return;

    setShowBulkDeleteConfirm(false);
    setIsSubmitting(true);

    try {
      const result = await bulkDeleteViewTypes(pendingBulkDeleteIds);
      
      if (!result.success) {
        setStatusModalData({
          type: 'error',
          title: 'Deletion Failed',
          message: result.error || 'Failed to delete view types. Please try again.',
        });
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: `${pendingBulkDeleteIds.length} view type${pendingBulkDeleteIds.length === 1 ? ' was' : 's were'} deleted successfully.`,
        });
      }
    } catch (error) {
      console.error('Error bulk deleting view types:', error);
      setStatusModalData({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred while deleting view types.',
      });
    } finally {
      setIsSubmitting(false);
      setShowStatusModal(true);
      setPendingBulkDeleteIds([]);
    }
  };

  const handleViewTypeSubmit = async (viewTypeData: ViewTypeFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createViewType({
        name: viewTypeData.name,
        description: viewTypeData.description,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Failed to create view type');
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: 'View type created successfully!',
        });
        setShowViewTypeForm(false);
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Error creating view type:', error);
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTypeUpdate = async (viewTypeData: ViewTypeFormData) => {
    if (!editingViewType) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await updateViewType(editingViewType.id, {
        name: viewTypeData.name,
        description: viewTypeData.description,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Failed to update view type');
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: 'View type updated successfully!',
        });
        setShowEditViewTypeForm(false);
        setEditingViewType(null);
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Error updating view type:', error);
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format data for table display
  const tableData: TableViewType[] = viewTypes.map(viewType => ({
    id: viewType.id,
    name: viewType.name,
    description: viewType.description || '', // Ensure description is never null
    created_at: viewType.created_at,
  }));

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <Link 
          href="/protected/admin-rooms"
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
        <RoomManagementTable<TableViewType>
          title="View Types"
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
            <p className="mt-2 text-gray-600">Loading view types...</p>
          </div>
        )}
      </div>

      {/* Add View Type Form Modal */}
      <Modal
        isOpen={showViewTypeForm}
        onClose={() => setShowViewTypeForm(false)}
        title="Add New View Type"
        size="md"
      >
        <ViewTypeForm
          onSubmit={handleViewTypeSubmit}
          onCancel={() => setShowViewTypeForm(false)}
          isSubmitting={isSubmitting}
          error={submitError}
          mode="create"
        />
      </Modal>

      {/* Edit View Type Form Modal */}
      <Modal
        isOpen={showEditViewTypeForm}
        onClose={() => {
          setShowEditViewTypeForm(false);
          setEditingViewType(null);
        }}
        title="Edit View Type"
        size="md"
      >
        <ViewTypeForm
          onSubmit={handleViewTypeUpdate}
          onCancel={() => {
            setShowEditViewTypeForm(false);
            setEditingViewType(null);
          }}
          isSubmitting={isSubmitting}
          initialData={editingViewType?.data}
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
    </>
  );
}