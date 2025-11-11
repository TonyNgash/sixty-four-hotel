'use client';

import { useState, useEffect } from 'react';
import type { Amenity } from '@/types/database';
import type { ApiResponse, AmenityCreateData, AmenityUpdateData } from '@/types/api';

interface AmenitiesState {
  amenities: Amenity[];
  loading: boolean;
  error: string | null;
}

interface UseAmenitiesReturn extends AmenitiesState {
  createAmenity: (data: AmenityCreateData) => Promise<{ success: boolean; error?: string }>;
  updateAmenity: (id: number, data: AmenityUpdateData) => Promise<{ success: boolean; error?: string }>;
  deleteAmenity: (id: number) => Promise<{ success: boolean; error?: string }>;
  bulkDeleteAmenities: (ids: number[]) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing amenities
 * Follows the same pattern as use-room-categories.ts
 */
export function useAmenities(): UseAmenitiesReturn {
  const [state, setState] = useState<AmenitiesState>({
    amenities: [],
    loading: true,
    error: null,
  });

  /**
   * Fetch all amenities
   */
  const fetchAmenities = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/amenities');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch amenities: ${response.status}`);
      }

      const result: ApiResponse<Amenity[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch amenities');
      }

      setState({
        amenities: result.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setState({
        amenities: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch amenities',
      });
    }
  };

  /**
   * Create a new amenity
   */
  const createAmenity = async (data: AmenityCreateData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/amenities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<Amenity> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to create amenity',
        };
      }

      // Refresh the amenities list after successful creation
      await fetchAmenities();

      return { success: true };
    } catch (error) {
      console.error('Error creating amenity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create amenity',
      };
    }
  };

  /**
   * Update an amenity
   */
  const updateAmenity = async (id: number, data: AmenityUpdateData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/amenities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<Amenity> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to update amenity',
        };
      }

      // Refresh the amenities list after successful update
      await fetchAmenities();

      return { success: true };
    } catch (error) {
      console.error('Error updating amenity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update amenity',
      };
    }
  };

  /**
   * Delete an amenity
   */
  const deleteAmenity = async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/amenities/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<void> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to delete amenity',
        };
      }

      // Refresh the amenities list after successful deletion
      await fetchAmenities();

      return { success: true };
    } catch (error) {
      console.error('Error deleting amenity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete amenity',
      };
    }
  };

  /**
   * Bulk delete amenities using the generic bulk delete endpoint
   */
  const bulkDeleteAmenities = async (ids: number[]): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName: 'amenities',
          ids: ids,
        }),
      });

      const result: ApiResponse<{ deletedCount: number; tableName: string }> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to delete amenities',
        };
      }

      // Refresh the amenities list after successful bulk deletion
      await fetchAmenities();

      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting amenities:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete amenities',
      };
    }
  };

  // Fetch amenities on mount
  useEffect(() => {
    fetchAmenities();
  }, []);

  return {
    amenities: state.amenities,
    loading: state.loading,
    error: state.error,
    createAmenity,
    updateAmenity,
    deleteAmenity,
    bulkDeleteAmenities,
    refetch: fetchAmenities,
  };
}