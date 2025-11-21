'use client';

import { useState, useEffect } from 'react';
import type { RoomWithRelations } from '@/types/database';
import type { ApiResponse, RoomCreateData, RoomUpdateData } from '@/types/api';

interface RoomsState {
  rooms: RoomWithRelations[];
  loading: boolean;
  error: string | null;
}

interface UseRoomsReturn extends RoomsState {
  createRoom: (data: RoomCreateData & { images?: File[] }) => Promise<{ success: boolean; error?: string }>;
  updateRoom: (id: number, data: RoomUpdateData & { images?: File[] }) => Promise<{ success: boolean; error?: string }>;
  deleteRoom: (id: number) => Promise<{ success: boolean; error?: string }>;
  bulkDeleteRooms: (ids: number[]) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing rooms with image upload support
 * Follows the same pattern as use-room-categories.ts
 */
export function useRooms(): UseRoomsReturn {
  const [state, setState] = useState<RoomsState>({
    rooms: [],
    loading: true,
    error: null,
  });

  /**
   * Fetch all rooms with relationships
   */
  const fetchRooms = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/rooms');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.status}`);
      }

      const result: ApiResponse<RoomWithRelations[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch rooms');
      }

      setState({
        rooms: result.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setState({
        rooms: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch rooms',
      });
    }
  };

  /**
   * Create a new room with FormData for file upload
   */
  const createRoom = async (data: RoomCreateData & { images?: File[] }): Promise<{ success: boolean; error?: string }> => {
    console.log('createRoom RECEIVED:', {
    imagesCount: data.images?.length ?? 0,
    firstImageName: data.images?.[0]?.name,
    isFile: data.images?.[0] instanceof File,
    });
    try {
      // Check if we have images to upload
      const hasImages = data.images && data.images.length > 0;
      console.log('hasImages?', hasImages);

      if (hasImages) {
        // Use FormData for file upload
        return await createRoomWithFormData(data);
      } else {
        // Use JSON for regular data
        return await createRoomWithJson(data);
      }
    } catch (error) {
      console.error('Error creating room use-rooms.ts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create room use-rooms.ts',
      };
    }
  };

  /**
   * Create room using FormData for file upload
   */
  const createRoomWithFormData = async (
    data: RoomCreateData & { images?: File[] }
  ): Promise<{ success: boolean; error?: string }> => {
    const formData = new FormData();

    formData.append('roomNumber', data.roomNumber);
    formData.append('status', data.status);
    formData.append('floor', data.floor.toString());

    if (data.categoryId) formData.append('categoryId', data.categoryId.toString());
    if (data.viewTypeId) formData.append('viewTypeId', data.viewTypeId.toString());
    if (data.amenityIds) {
      data.amenityIds.forEach(id => formData.append('amenityIds', id.toString()));
    }
    if (data.images) {
      data.images.forEach(file => formData.append('images', file));
    }
    
    console.log('SENDING FormData with images:', data.images?.length);
    for (const [key, value] of formData.entries()) {
      console.log('FormData entry:', key, value instanceof File ? `File: ${value.name}` : value);
    }

    // CRITICAL: LET BROWSER SET Content-Type
    // DO NOT SET HEADERS

    const response = await fetch('/api/rooms', {
      method: 'POST',
      body: formData,
      // NO HEADERS
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Response error:', error);
      return { success: false, error: 'Network error' };
    }

    const result: ApiResponse<RoomWithRelations> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error };
    }

    await fetchRooms();
    return { success: true };
  };

  /**
   * Create room using JSON (for backward compatibility)
   */
  const createRoomWithJson = async (data: RoomCreateData): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<RoomWithRelations> = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || 'Failed to create room',
      };
    }

    // Refresh the rooms list after successful creation
    await fetchRooms();

    return { success: true };
  };

  /**
   * Update a room with FormData for file upload
   */
  const updateRoom = async (id: number, data: RoomUpdateData & { images?: File[] }): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if we have images to upload
      const hasImages = data.images && data.images.length > 0;

      if (hasImages) {
        // Use FormData for file upload
        return await updateRoomWithFormData(id, data);
      } else {
        // Use JSON for regular data
        return await updateRoomWithJson(id, data);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update room',
      };
    }
  };

  /**
   * Update room using FormData for file upload
   */
  const updateRoomWithFormData = async (id: number, data: RoomUpdateData & { images?: File[] }): Promise<{ success: boolean; error?: string }> => {
    const formData = new FormData();
    
    if (data.roomNumber !== undefined) formData.append('roomNumber', data.roomNumber);
    if (data.status !== undefined) formData.append('status', data.status);
    if (data.floor !== undefined) formData.append('floor', data.floor.toString());
    
    if (data.categoryId !== undefined) {
      formData.append('categoryId', data.categoryId === null ? 'null' : data.categoryId.toString());
    }
    
    if (data.viewTypeId !== undefined) {
      formData.append('viewTypeId', data.viewTypeId === null ? 'null' : data.viewTypeId.toString());
    }
    
    if (data.amenityIds !== undefined) {
      data.amenityIds.forEach(id => formData.append('amenityIds', id.toString()));
    }
    
    // FIXED: Use repeated field name
    if (data.images) {
      data.images.forEach(file => {
        formData.append('images', file); // ← NOW CORRECT
      });
    }

    const response = await fetch(`/api/rooms/${id}`, {
      method: 'PUT',
      body: formData, // ← Let browser set Content-Type
    });

    const result: ApiResponse<RoomWithRelations> = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, error: result.error || 'Failed to update room' };
    }

    await fetchRooms();
    return { success: true };
  };

  /**
   * Update room using JSON (for backward compatibility)
   */
  const updateRoomWithJson = async (id: number, data: RoomUpdateData): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`/api/rooms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<RoomWithRelations> = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || 'Failed to update room',
      };
    }

    // Refresh the rooms list after successful update
    await fetchRooms();

    return { success: true };
  };

  /**
   * Delete a room
   */
  const deleteRoom = async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<void> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to delete room',
        };
      }

      // Refresh the rooms list after successful deletion
      await fetchRooms();

      return { success: true };
    } catch (error) {
      console.error('Error deleting room:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete room',
      };
    }
  };

  /**
   * Bulk delete rooms using the generic bulk delete endpoint
   */
  const bulkDeleteRooms = async (ids: number[]): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName: 'rooms',
          ids: ids,
        }),
      });

      const result: ApiResponse<{ deletedCount: number; tableName: string }> = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Failed to delete rooms',
        };
      }

      // Refresh the rooms list after successful bulk deletion
      await fetchRooms();

      return { success: true };
    } catch (error) {
      console.error('Error bulk deleting rooms:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete rooms',
      };
    }
  };

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms: state.rooms,
    loading: state.loading,
    error: state.error,
    createRoom,
    updateRoom,
    deleteRoom,
    bulkDeleteRooms,
    refetch: fetchRooms,
  };
}