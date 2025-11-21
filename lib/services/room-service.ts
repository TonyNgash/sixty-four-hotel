import {
  getAllRooms,
  getRoomById,
  getRoomByNumber,
  createRoom,
  updateRoom,
  deleteRoom,
  roomExistsByNumber,
  insertRoomImage,
  deleteRoomImagesByRoomId,
  getRoomImagesByRoomId
} from '@/lib/database/queries/rooms';
import type { RoomInsert, RoomUpdate } from '@/types/database';
import {
  uploadRoomImage,
  deleteRoomImage,
  type FileUploadResult
} from '@/lib/utils/file-upload';
import type { RoomWithRelations } from '@/types/database';

export interface RoomCreateData {
  roomNumber: string;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  categoryId?: number | null;
  viewTypeId?: number | null;
  amenityIds?: number[];
  images?: File[];
}

export interface RoomUpdateData {
  roomNumber?: string;
  status?: 'available' | 'occupied' | 'maintenance';
  floor?: number;
  categoryId?: number | null;
  viewTypeId?: number | null;
  amenityIds?: number[];
  images?: File[];
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate room data
 */
function validateRoomData(data: RoomCreateData): string | null {
  if (!data.roomNumber || data.roomNumber.trim().length === 0) {
    return 'Room number is required';
  }
  if (data.roomNumber.trim().length > 10) {
    return 'Room number must be 10 characters or less';
  }
  if (!data.status) {
    return 'Status is required';
  }
  if (data.floor == null || data.floor < 1 || data.floor > 100) {
    return 'Floor must be between 1 and 100';
  }
  if (data.categoryId != null && data.categoryId < 1) {
    return 'Invalid category ID';
  }
  if (data.viewTypeId != null && data.viewTypeId < 1) {
    return 'Invalid view type ID';
  }
  return null;
}

/**
 * Process multiple image uploads
 */
async function processImageUploads(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const result: FileUploadResult = await uploadRoomImage(file);
    if (!result.success || !result.publicUrl) {
      throw new Error(result.error || 'Failed to upload image');
    }
    return result.publicUrl;
  });
  return await Promise.all(uploadPromises);
}

/**
 * Delete old room images
 */
async function cleanupOldImages(imageUrls: string[]): Promise<void> {
  const deletePromises = imageUrls.map(async (url) => {
    if (!url.includes('/uploads/rooms/')) return;
    const result = await deleteRoomImage(url);
    if (!result.success) {
      console.warn('Failed to delete old image:', result.error);
    }
  });
  await Promise.allSettled(deletePromises);
}

/**
 * Get all rooms
 */
export async function getAllRoomsService(): Promise<ServiceResult<RoomWithRelations[]>> {
  try {
    const rooms = await getAllRooms();
    return { success: true, data: rooms };
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return { success: false, error: 'Failed to fetch rooms' };
  }
}

/**
 * Create a new room
 */
export async function createRoomService(data: RoomCreateData): Promise<ServiceResult<RoomWithRelations>> {
  // console.log('createRoomService received:', typeof data, 'has images?', !!(data as any).images);
  try {
    const validationError = validateRoomData(data);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const trimmedRoomNumber = data.roomNumber.trim();

    const roomExists = await getRoomByNumber(trimmedRoomNumber);
    if (roomExists) {
      return { success: false, error: 'A room with this number already exists' };
    }

    // === UPLOAD IMAGES FIRST ===
    let imageUrls: string[] = [];
    if (data.images && data.images.length > 0) {
      try {
        imageUrls = await processImageUploads(data.images);
      } catch (error) {
        return { success: false, error: 'Failed to upload images' };
      }
    }

    // === MAP TO RoomInsert (camelCase → matches your type) ===
    const insertData: RoomInsert = {
      roomNumber: trimmedRoomNumber,
      status: data.status,
      floor: data.floor,
      categoryId: data.categoryId ?? undefined,
      viewTypeId: data.viewTypeId ?? undefined,
    };

    const newRoom = await createRoom(insertData);

    // === INSERT IMAGES ===
        // === INSERT IMAGES WITH FIRST AS PRIMARY ===
    if (imageUrls.length > 0) {
      const insertPromises = imageUrls.map((url, index) =>
        insertRoomImage({
          roomId: newRoom.id,
          imageUrl: url,
          sortOrder: index,
          isPrimary: index === 0, // First image is primary
        })
      );
      await Promise.all(insertPromises);
    }

    // === RETURN FULL ROOM ===
    const roomWithRelations = await getRoomById(newRoom.id);
    if (!roomWithRelations) {
      return { success: false, error: 'Failed to fetch created room' };
    }

    return { success: true, data: roomWithRelations };
  } catch (error) {
    console.error('Error creating room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create room',
    };
  }
}
/**
 * Update a room
 */
export async function updateRoomService(id: number, data: RoomUpdateData): Promise<ServiceResult<RoomWithRelations>> {
  try {
    if (!id || id < 1) {
      return { success: false, error: 'Invalid room ID' };
    }

    const existingRoom = await getRoomById(id);
    if (!existingRoom) {
      return { success: false, error: 'Room not found' };
    }

    if (data.roomNumber) {
      const trimmed = data.roomNumber.trim();
      if (trimmed !== existingRoom.room_number) {
        const exists = await roomExistsByNumber(trimmed);
        if (exists) {
          return { success: false, error: 'Room number already exists' };
        }
      }
    }

    let newImageUrls: string[] = [];
    if (data.images && data.images.length > 0) {
      try {
        newImageUrls = await processImageUploads(data.images);
      } catch (error) {
        return { success: false, error: 'Failed to upload images' };
      }
    }

    const updateData: RoomUpdate = {
      roomNumber: data.roomNumber?.trim(),
      status: data.status,
      floor: data.floor,
      categoryId: data.categoryId,
      viewTypeId: data.viewTypeId,
    };

    const filteredUpdateData: Partial<RoomUpdate> = {};
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) filteredUpdateData[key as keyof RoomUpdate] = value;
    });

    const updatedRoom = await updateRoom(id, filteredUpdateData);
    if (!updatedRoom) {
      return { success: false, error: 'Failed to update room' };
    }

    if (newImageUrls.length > 0) {
      const oldImageUrls = (await getRoomImagesByRoomId(id)).map(img => img.image_url);
      await cleanupOldImages(oldImageUrls);
      await deleteRoomImagesByRoomId(id);

      const insertPromises = newImageUrls.map(url =>
        insertRoomImage({ roomId: id, imageUrl: url })
      );
      await Promise.all(insertPromises);
    }

    const roomWithRelations = await getRoomById(id);
    if (!roomWithRelations) {
      return { success: false, error: 'Failed to fetch updated room' };
    }

    return { success: true, data: roomWithRelations };
  } catch (error) {
    console.error('Error updating room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update room'
    };
  }
}