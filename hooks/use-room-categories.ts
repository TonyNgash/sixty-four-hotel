'use client';

import { useState, useEffect } from 'react';
import type { RoomCategory } from '@/types/database';
import type { ApiResponse, RoomCategoryCreateRequest, RoomCategoryUpdateRequest } from '@/types/api';

interface RoomCategoriesState {
  categories: RoomCategory[];
  loading: boolean;
  error: string | null;
}

interface UseRoomCategoriesReturn extends RoomCategoriesState {
  createCategory: (data: RoomCategoryCreateRequest & { featuredImage?: File }) => Promise<{ success: boolean; error?: string }>;
  
  updateCategory: (id: number, data: RoomCategoryUpdateRequest & { featuredImage?: File }) => Promise<{ success: boolean; error?: string }>;
  
  deleteCategory: (id: number) => Promise<{ success: boolean; error?: string }>;
  
  bulkDeleteCategories: (ids: number[]) => Promise<{ success: boolean; error?: string }>;
  
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing room categories
 * Follows patterns from use-rooms.ts and use-bookings.ts
 */
export function useRoomCategories(): UseRoomCategoriesReturn {
  const [state, setState] = useState<RoomCategoriesState>({
    categories: [],
    loading: true,
    error: null,
  });

  /**
   * Fetch all room categories
   */
  const fetchCategories = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/room-categories');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const result: ApiResponse<RoomCategory[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch room categories');
      }

      setState({
        categories: result.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching room categories:', error);
      setState({
        categories: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch room categories',
      });
    }
  };

  /**
   * Create a new room category with FormData for file upload
   */
  const createCategory = async (data: RoomCategoryCreateRequest & { featuredImage?: File }): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append text fields
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('basePrice', data.basePrice.toString());
      formData.append('maxOccupancy', data.maxOccupancy.toString());
      
      // Append image file if provided
      if (data.featuredImage) {
        formData.append('featuredImage', data.featuredImage);
      }

      const response = await fetch('/api/room-categories', {
        method: 'POST',
        body: formData
      });

      const result: ApiResponse<RoomCategory> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to create room category',
        };
      }

      // Refresh the categories list after successful creation
      await fetchCategories();

      return { success: true };
    } catch (error) {
      console.error('Error creating room category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create room category',
      };
    }
  };

  /**
   * Update a room category with FormData for file upload
   */
  const updateCategory = async (id: number, data: RoomCategoryUpdateRequest & { featuredImage?: File }): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append text fields if provided
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.description !== undefined) formData.append('description', data.description);
      if (data.basePrice !== undefined) formData.append('basePrice', data.basePrice.toString());
      if (data.maxOccupancy !== undefined) formData.append('maxOccupancy', data.maxOccupancy.toString());
      
      // Append image file if provided
      if (data.featuredImage) {
        formData.append('featuredImage', data.featuredImage);
      }

      const response = await fetch(`/api/room-categories/${id}`, {
        method: 'PUT',
        body: formData
      });

      const result: ApiResponse<RoomCategory> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to update room category',
        };
      }

      // Refresh the categories list after successful update
      await fetchCategories();

      return { success: true };
    } catch (error) {
      console.error('Error updating room category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update room category',
      };
    }
  };

  /**
   * Delete a room category
   */
  const deleteCategory = async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/room-categories/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<void> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to delete room category',
        };
      }

      // Refresh the categories list after successful deletion
      await fetchCategories();

      return { success: true };
    } catch (error) {
      console.error('Error deleting room category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete room category',
      };
    }
  };

  /**
   * Bulk delete multiple room categories
   */
  /**
 * Bulk delete room categories using the generic bulk delete endpoint
 */
const bulkDeleteCategories = async (ids: number[]): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/bulk-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableName: 'room-categories',
        ids: ids,
      }),
    });

    const result: ApiResponse<{ deletedCount: number; tableName: string }> = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || 'Failed to delete room categories',
      };
    }

    // Refresh the categories list after successful bulk deletion
    await fetchCategories();

    return { success: true };
  } catch (error) {
    console.error('Error bulk deleting room categories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete room categories',
    };
  }
};

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
    refetch: fetchCategories,
  };
}