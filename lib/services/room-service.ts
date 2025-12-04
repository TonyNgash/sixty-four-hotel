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
  getRoomImagesByRoomId,
  addRoomAmenities,
  updateRoomAmenities,
  // IMPORTANT: This function is required and MUST be added to lib/database/queries/rooms.ts
  deleteRoomImageByUrl
} from '@/lib/database/queries/rooms';
import type { RoomInsert, RoomUpdate } from '@/types/database';
import {
  uploadRoomImage,
  deleteRoomImage,
  type FileUploadResult
} from '@/lib/utils/file-upload';
import type { RoomWithRelations, Room, RoomImage } from '@/types/database';
import { tr } from 'date-fns/locale';
// import { roomAmenities } from '@/lib/database/schema';
// import { eq } from 'drizzle-orm';

export interface RoomCreateData {
  roomNumber: string;
  roomPrice: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  categoryId?: number | null;
  viewTypeId?: number | null;
  amenityIds?: number[];
  images?: File[];
}

export interface RoomUpdateData {
  roomNumber?: string;
  roomPrice?: string;
  status?: 'available' | 'occupied' | 'maintenance';
  floor?: number;
  categoryId?: number | null;
  viewTypeId?: number | null;
  amenityIds?: number[];
  images?: File[];
  // NEW: List of existing image URLs that should NOT be deleted
  imagesToKeep?:number[];
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
  // This check is now handled in updateRoomService for string input
  if (data.roomPrice == null || data.roomPrice < 0) {
    return 'Room price must be a positive number';
  }
  if (data.roomPrice > 1000000) {
    return 'Room price is too high';
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
export async function processImageUploads(files: File[]): Promise<string[]> {
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
export async function cleanupOldImages(imageUrls: string[]): Promise<void> {
  const deletePromises = imageUrls.map(async (url) => {
    if (!url || !url.includes('/images/rooms/')) return;
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
 * Get a room by id
 */
export async function getRoomByIdService(id: number):Promise<ServiceResult<Room>>{
  try{
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid category ID'
      };
    }

    const room = await getRoomById(id);

    if(!room){
      return {
        success: false,
        error: 'Room by id not found'
      }
    }

    return {
      success: true,
      data: room
    }

  } catch (error){
    console.error("Error fetching room by id: ",error);
    return{
      success: false,
      error: 'Failed to fetch room by id'
    }
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
        return { success: false, error: `Failed to upload images ${error}` };
      }
    }

    // === MAP TO RoomInsert (camelCase → matches your type) ===
    const insertData: RoomInsert = {
      roomNumber: trimmedRoomNumber,
      roomPrice: data.roomPrice,
      status: data.status,
      floor: data.floor,
      categoryId: data.categoryId ?? undefined,
      viewTypeId: data.viewTypeId ?? undefined,
    };

    const newRoom = await createRoom(insertData);

    // i added this but its wrong
    if (data.amenityIds && data.amenityIds.length > 0) {
      await addRoomAmenities(newRoom.id, data.amenityIds);
    }
    // i added the above but its due for edit

    // === INSERT IMAGES ===
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
      const existing = existingRoom.room_number.toString();
      if (trimmed !== existing) {
        const exists = await roomExistsByNumber(trimmed.toString());
        if (exists) {
          return { success: false, error: 'Room number already existsasses' };
        }
      }
    }

    let parsedRoomPrice: number | undefined;
    if(data.roomPrice !== undefined && data.roomPrice !== null && data.roomPrice.trim() !== ""){
      const priceCandidate = parseFloat(data.roomPrice.trim());

      if(isNaN(priceCandidate) || priceCandidate < 0){
        return {success: false, error: "Room price must be a positive number"};
      }
      if(priceCandidate > 1000000){
        return {success:false, error: 'Room price is too high'};
      }
      parsedRoomPrice = priceCandidate;
    }

    let newImageUrls: string[] = [];
    // 1. UPLOAD NEW IMAGES
    if (data.images && data.images.length > 0) {
      try {
        newImageUrls = await processImageUploads(data.images);
      } catch (error) {
        // Ensure we don't proceed with DB update if upload fails
        return { success: false, error: `Failed to upload images ${error}` };
      }
    }

    // 2. HANDLE EXISTING IMAGE DELETIONS/UPDATES
	  // This block runs if imagesToKeep was provided by the client (even if empty)
    // if(data.imagesToKeep !== undefined){
    //   const existingImages = await getRoomImagesByRoomId(id);
    //   const existingUrlsSet = new Set(existingImages.map(img => img.image_url));
    //   const imagesToKeepSet = new Set(data.imagesToKeep);

    //   const urlsToDelete: string[] = [];

    //   // FInd URLs that are in the database but NOT in the list of images to keep
    //   for(const url of existingUrlsSet){
    //     if(!imagesToKeepSet.has(url)){
    //       urlsToDelete.push(url);
    //     }
    //   }

    //   // START OF NEW LOGGING BLOCK
    //   console.log('--- Service Layer Log: Image Deletion Check ---');
    //   console.log(`Room ID: ${id}`);
    //   // CHECK A: What images are currently in the database for this room?
    //   console.log('Existing DB URLs:', Array.from(existingUrlsSet)); 
    //   // CHECK B: What images did the API tell us to keep?
    //   console.log('ImagesToKeep from API:', data.imagesToKeep); 
    //   // CRITICAL CHECK C: What URLs did the logic calculate must be deleted?
    //   console.log('Calculated URLs to DELETE:', urlsToDelete); 
    //   console.log('--- End Service Layer Log ---');
    //   // END OF NEW LOGGING BLOCK

    //   //Perform cleanup (files) and database deletion (records) for removed images
    //   if(urlsToDelete.length > 0){
    //     //Delete files from public/images/rooms
    //     await cleanupOldImages(urlsToDelete);

    //     //Delete records from the database using the new query function
    //     for(const url of urlsToDelete){
    //       await deleteRoomImageByUrl(url);
    //     }
    //   }

    //   //3. Re-index/insert remaining and new images

    //   //Combine existing images to keep and new uploaded images
    //   const imagesToInsertOrUpdate:{imageUrl:string; isPrimary: boolean}[] = [];

    //   //Get kept images data (with original primary status)
    //   existingImages
    //   .filter(img => imagesToKeepSet.has(img.image_url))
    //   .forEach(img => imagesToInsertOrUpdate.push({
    //     imageUrl:img.image_url,
    //     isPrimary:img.is_primary
    //   }));

    //   //Add new images (defaulting to not primary)
    //   newImageUrls.forEach(url => imagesToInsertOrUpdate.push({imageUrl:url, isPrimary:false}));

    //   //Re-evaluate primary image and sort order for all remaining/new images
    //   if(imagesToInsertOrUpdate.length > 0){
    //     //Determine if we need to set a new primary image
    //     const hasPrimary = imagesToInsertOrUpdate.some(img => img.isPrimary);
        
    //     //Ensure the first item is primary if no primary image was kept
    //     if(hasPrimary){
    //       //if the list is not empty, set the first element as primary
    //       if(imagesToInsertOrUpdate.length > 0){
    //         imagesToInsertOrUpdate[0].isPrimary = true;
    //       }
    //     }

    //     // Delete all remaining images DB records to prepare for re-insertion
    //     // We delete ALL records associated with the room ID, even those we plan to re-insert
    //     // This is safe because we stored the imagesToInsertOrUpdate array first.
    //     await deleteRoomImagesByRoomId(id);

    //     //Re-insert the combined list with the correct sort order and primary status
    //     const insertPromises = imagesToInsertOrUpdate.map((img, index) => 
    //     insertRoomImage({
    //       roomId:id,
    //       imageUrl: img.imageUrl,
    //       sortOrder:index,
    //       isPrimary:img.isPrimary,
    //     })
    //   );
    //   await Promise.all(insertPromises);
    //   } else if(data.imagesToKeep.length === 0 && newImageUrls.length === 0){
    //     //if the client sent and empty imagesToKeep array and no new files were uploaded,
    //     //it means all images were removed. We delete all image records for this room.
    //     await deleteRoomImagesByRoomId(id);
    //   }
    // }


    //4. Update core room fields
    const updateData: RoomUpdate = {
      roomNumber: data.roomNumber,
      roomPrice: parsedRoomPrice, //Now a number of undefined
      status: data.status,
      floor: data.floor,
      categoryId: data.categoryId,
      viewTypeId: data.viewTypeId,
      imagesToKeep: data.imagesToKeep,
    };

    const filteredUpdateData: Partial<RoomUpdate> = {};
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) filteredUpdateData[key as keyof RoomUpdate] = value;
    });

    const updatedRoom = await updateRoom(id, filteredUpdateData);
    if (!updatedRoom) {
      return { success: false, error: 'Failed to update room' };
    }

    // Amenity update logic
    if(data.amenityIds !== undefined){
      await updateRoomAmenities(id, data.amenityIds || []);
    }

    const roomWithRelations = await getRoomById(id);
    if (!roomWithRelations) {
      return { success: false, error: 'Failed to fetch updated room' };
    }

    // i added this but its wrong

    if (data.amenityIds !== undefined) {
      await updateRoomAmenities(id, data.amenityIds || []);
    }
    //  due for change

    return { success: true, data: roomWithRelations };
  } catch (error) {
    console.error('Error updating room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update room'
    };
  }
}

/**
 * Delete a room
 */

export async function deleteRoomService(id: number): Promise<ServiceResult<Room>> {
  try{
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid room ID'
      };
    }
    const existingRoom = await getRoomById(id);
    if (!existingRoom) {
      return {
        success: false,
        error: 'Room not found'
      };
    }
    // 1. get image urls BEFORE deleting the database records
    const existingRoomImages = await getRoomImagesByRoomId(id);
    const imageUrls: string[] = existingRoomImages.map(image=>image.image_url);

    //delete the room from db
    const deletedRoom = await deleteRoom(id);
    if(!deletedRoom){
      return{
        success: false,
        error: 'Failed to delete room. (Room might not have been found)'
      }
    }

    // clean up associated images files after successful deletion
    if(imageUrls){
      await cleanupOldImages(imageUrls);
    }

    return {
      success: true,
      data: deletedRoom
    }



  } catch (error){
    console.error('Error deleting room:', error);
    return {
      success: false,
      error: 'Failed to delete room'
    };
  }
}