'use client';

import { useState } from 'react';
import Image from 'next/image';
// import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { RoomManagementTable } from '@/components/admin/data-tables/room-management-table';
import { RoomCategoryForm } from '@/components/admin/forms/room-category-form';
import { Modal } from '@/components/ui/modal';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { useRoomCategories } from '@/hooks/use-room-categories';
import type { RoomCategory } from '@/types/database';
import type { Column } from '@/components/admin/data-tables/room-management-table';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface RoomCategoryFormData {
  name: string;
  description: string;
  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  // basePrice: string;
  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  maxOccupancy: string;
  featuredImage?: File;
  featuredImageUrl?: string;
}

// /////////////////////////////////////////////////////////////////////////////// gats to  go
interface TableRoomCategory extends Omit<RoomCategory, 'max_occupancy'> {
  // base_price: string;
  max_occupancy: number;
  image: React.ReactElement;
}

const columns: Column<TableRoomCategory>[] = [
  { key: 'image', label: 'Image', sortable: false },
  { key: 'name', label: 'Name', sortable: true },
  // { key: 'description', label: 'Description', sortable: false },
  // { key: 'base_price', label: 'Base Price (KSh)', sortable: true },
  { key: 'max_occupancy', label: 'Max Occupancy', sortable: true },
];

export default function RoomCategoriesPage() {
  const { 
    categories, 
    loading, 
    error, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    bulkDeleteCategories,
    refetch 
  } = useRoomCategories();

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showEditCategoryForm, setShowEditCategoryForm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusModalData, setStatusModalData] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ type: 'success', title: '', message: '' });
  const [pendingBulkDeleteIds, setPendingBulkDeleteIds] = useState<number[]>([]);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    data: RoomCategoryFormData;
  } | null>(null);

  const handleAddNew = () => {
    setShowCategoryForm(true);
    setSubmitError(null);
  };

  const handleEdit = async (category: TableRoomCategory) => {
    setIsLoadingEditData(true);
    setShowEditCategoryForm(true);
    
    try {
      // Convert the table data back to form data format
      const formData: RoomCategoryFormData = {
        name: category.name,
        description: category.description || '',
        // /////////////////////////////////////////////////////////////////////////////// gats to  go
        // basePrice: category.base_price.replace(/,/g, ''), // Remove formatting for editing
        // /////////////////////////////////////////////////////////////////////////////// gats to  go
        maxOccupancy: category.max_occupancy.toString(),
        featuredImageUrl: category.featured_image_url || undefined,
      };

      setEditingCategory({
        id: category.id,
        data: formData,
      });
    } catch (error) {
      console.error('Error preparing edit data:', error);
      setStatusModalData({
        type: 'error',
        title: 'Error',
        message: 'Failed to load category data for editing.',
      });
      setShowStatusModal(true);
      setShowEditCategoryForm(false);
    } finally {
      setIsLoadingEditData(false);
    }
  };

  const handleDelete = async (category: TableRoomCategory) => {
    setPendingBulkDeleteIds([category.id]);
    setStatusModalData({
      type: 'error',
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
    });
    setShowBulkDeleteConfirm(true);
  };

  const handleBulkDelete = async (selectedIds: number[]) => {
    if (selectedIds.length === 0) return;
    
    setPendingBulkDeleteIds(selectedIds);
    setStatusModalData({
      type: 'error',
      title: 'Delete Categories',
      message: `Are you sure you want to delete ${selectedIds.length} categor${selectedIds.length === 1 ? 'y' : 'ies'}? This action cannot be undone.`,
    });
    setShowBulkDeleteConfirm(true);
  };

  const executeBulkDelete = async () => {
    if (pendingBulkDeleteIds.length === 0) return;

    setShowBulkDeleteConfirm(false);
    setIsSubmitting(true);

    try {
      const result = await bulkDeleteCategories(pendingBulkDeleteIds);
      
      if (!result.success) {
        setStatusModalData({
          type: 'error',
          title: 'Deletion Failed',
          message: result.error || 'Failed to delete categories. Please try again.',
        });
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: `${pendingBulkDeleteIds.length} categor${pendingBulkDeleteIds.length === 1 ? 'y was' : 'ies were'} deleted successfully.`,
        });
      }
    } catch (error) {
      console.error('Error bulk deleting categories:', error);
      setStatusModalData({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred while deleting categories.',
      });
    } finally {
      setIsSubmitting(false);
      setShowStatusModal(true);
      setPendingBulkDeleteIds([]);
    }
  };

  const handleCategorySubmit = async (categoryData: RoomCategoryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createCategory({
        name: categoryData.name,
        description: categoryData.description,
        // /////////////////////////////////////////////////////////////////////////////// gats to  go
        // basePrice: Number(categoryData.basePrice),
        maxOccupancy: Number(categoryData.maxOccupancy),
        featuredImage: categoryData.featuredImage,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Failed to create room category');
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: 'Room category created successfully!',
        });
        setShowCategoryForm(false);
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryUpdate = async (categoryData: RoomCategoryFormData) => {
    if (!editingCategory) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await updateCategory(editingCategory.id, {
        name: categoryData.name,
        description: categoryData.description,
        // /////////////////////////////////////////////////////////////////////////////// gats to  go
        // basePrice: Number(categoryData.basePrice),
        maxOccupancy: Number(categoryData.maxOccupancy),
        featuredImage: categoryData.featuredImage,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Failed to update room category');
      } else {
        setStatusModalData({
          type: 'success',
          title: 'Success',
          message: 'Room category updated successfully!',
        });
        setShowEditCategoryForm(false);
        setEditingCategory(null);
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format data for table display with proper typing and images
  const tableData: TableRoomCategory[] = categories.map(category => ({
    ...category,
    // /////////////////////////////////////////////////////////////////////////////// gats to  go
    // base_price: category.base_price.toLocaleString(),
    max_occupancy: category.max_occupancy,
    image: (
      <div className="flex justify-center">
        {category.featured_image_url ? (
          <div className="h-10 w-10 relative rounded overflow-hidden border border-gray-200">
            <Image 
              src={category.featured_image_url}
              alt={`${category.name} category`}
              fill
              sizes="40px"
              className="object-cover"
              priority={false}
            />
          </div>
        ) : (
          <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-400">No Image</span>
          </div>
        )}
      </div>
    ),
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
        <RoomManagementTable<TableRoomCategory>
          title="Room Categories"
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
            <p className="mt-2 text-gray-600">Loading room categories...</p>
          </div>
        )}
      </div>

      {/* Add Category Form Modal */}
      <Modal
        isOpen={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
        title="Add New Room Category"
        size="md"
      >
        <RoomCategoryForm
          onSubmit={handleCategorySubmit}
          onCancel={() => setShowCategoryForm(false)}
          isSubmitting={isSubmitting}
          error={submitError}
          mode="create"
        />
      </Modal>

      {/* Edit Category Form Modal */}
      <Modal
        isOpen={showEditCategoryForm}
        onClose={() => {
          setShowEditCategoryForm(false);
          setEditingCategory(null);
        }}
        title="Edit Room Category"
        size="md"
      >
        <RoomCategoryForm
          onSubmit={handleCategoryUpdate}
          onCancel={() => {
            setShowEditCategoryForm(false);
            setEditingCategory(null);
          }}
          isSubmitting={isSubmitting}
          isLoading={isLoadingEditData}
          initialData={editingCategory?.data}
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