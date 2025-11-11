'use client';

import { useState, useEffect } from 'react';
import type { ViewType } from '@/types/database';
import type { ApiResponse, ViewTypeCreateData, ViewTypeUpdateData } from '@/types/api';

interface ViewTypesState {
  viewTypes: ViewType[];
  loading: boolean;
  error: string | null;
}

interface UseViewTypesReturn extends ViewTypesState {
  createViewType: (data: ViewTypeCreateData) => Promise<{ success: boolean; error?: string }>;
  updateViewType: (id: number, data: ViewTypeUpdateData) => Promise<{ success: boolean; error?: string }>;
  deleteViewType: (id: number) => Promise<{ success: boolean; error?: string }>;
  bulkDeleteViewTypes: (ids: number[]) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing view types
 * Follows the same pattern as use-amenities.ts
 */
export function useViewTypes(): UseViewTypesReturn {
  const [state, setState] = useState<ViewTypesState>({
    viewTypes: [],
    loading: true,
    error: null,
  });

  /**
   * Fetch all view types
   */
  const fetchViewTypes = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/view-types');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch view types: ${response.status}`);
      }

      const result: ApiResponse<ViewType[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch view types');
      }

      setState({
        viewTypes: result.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching view types:', error);
      setState({
        viewTypes: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch view types',
      });
    }
  };

  /**
   * Create a new view type
   */
  const createViewType = async (data: ViewTypeCreateData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/view-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<ViewType> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to create view type',
        };
      }

      // Refresh the view types list after successful creation
      await fetchViewTypes();

      return { success: true };
    } catch (error) {
      console.error('Error creating view type:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create view type',
      };
    }
  };

  /**
   * Update a view type
   */
  const updateViewType = async (id: number, data: ViewTypeUpdateData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/view-types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<ViewType> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to update view type',
        };
      }

      // Refresh the view types list after successful update
      await fetchViewTypes();

      return { success: true };
    } catch (error) {
      console.error('Error updating view type:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update view type',
      };
    }
  };

  /**
   * Delete a view type
   */
  const deleteViewType = async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/view-types/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<void> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to delete view type',
        };
      }

      // Refresh the view types list after successful deletion
      await fetchViewTypes();

      return { success: true };
    } catch (error) {
      console.error('Error deleting view type:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete view type',
      };
    }
  };

  /**
   * Bulk delete view types using the generic bulk delete endpoint
   */
  const bulkDeleteViewTypes = async (ids: number[]): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName: 'view-types',
          ids: ids,
        }),
      });

      const result: ApiResponse<{ deletedCount: number; tableName: string }> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to delete view types',
        };
      }

      // Refresh the view types list after successful bulk deletion
      await fetchViewTypes();

      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting view types:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete view types',
      };
    }
  };

  // Fetch view types on mount
  useEffect(() => {
    fetchViewTypes();
  }, []);

  return {
    viewTypes: state.viewTypes,
    loading: state.loading,
    error: state.error,
    createViewType,
    updateViewType,
    deleteViewType,
    bulkDeleteViewTypes,
    refetch: fetchViewTypes,
  };
}