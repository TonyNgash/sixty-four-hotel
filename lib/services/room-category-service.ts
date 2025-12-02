import { 
  getAllRoomCategories,
  getRoomCategoryById,
  getRoomCategoryByName,
  createRoomCategory,
  updateRoomCategory,
  deleteRoomCategory,
  roomCategoryExistsByName,
  type RoomCategoryInsert,
  type RoomCategoryUpdate
} from '@/lib/database/queries/room-categories';
import { 
  uploadRoomCategoryImage, 
  deleteRoomCategoryImage,
  type FileUploadResult 
} from '@/lib/utils/file-upload';
import type { RoomCategory } from '@/types/database';

export interface RoomCategoryCreateData {
  name: string;
  description?: string;
  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  // basePrice: number;
  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  maxOccupancy: number;
  featuredImage?: File;
  featuredImageUrl?: string;
}

export interface RoomCategoryUpdateData {
  name?: string;
  description?: string;
  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  basePrice?: number;
  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  maxOccupancy?: number;
  featuredImage?: File;
  featuredImageUrl?: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate room category data
 */
function validateRoomCategoryData(data: RoomCategoryCreateData): string | null {
  if (!data.name || data.name.trim().length === 0) {
    return 'Category name is required';
  }

  if (data.name.trim().length < 2) {
    return 'Category name must be at least 2 characters long';
  }

  if (data.name.trim().length > 100) {
    return 'Category name must be less than 100 characters';
  }

  if (data.description && data.description.length > 500) {
    return 'Description must be less than 500 characters';
  }

  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  // if (data.basePrice == null || data.basePrice < 0) {
  //   return 'Base price must be a positive number';
  // }
  // /////////////////////////////////////////////////////////////////////////////// gats to  go


  // /////////////////////////////////////////////////////////////////////////////// gats to  go
  // if (data.basePrice > 100000000) { // 1,000,000.00 in cents
  //   return 'Base price is too high';
  // }
  // /////////////////////////////////////////////////////////////////////////////// gats to  go

  if (data.maxOccupancy == null || data.maxOccupancy < 1) {
    return 'Max occupancy must be at least 1';
  }

  if (data.maxOccupancy > 20) {
    return 'Max occupancy cannot exceed 20';
  }

  // Validate featuredImageUrl format if provided
  if (data.featuredImageUrl && !isValidImageUrl(data.featuredImageUrl)) {
    return 'Featured image URL must be a valid image URL';
  }

  return null;
}

/**
 * Validate image URL format
 */
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, 'http://localhost'); // Use base for relative URLs
    const path = urlObj.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(path);
  } catch {
    // If URL parsing fails, check if it's a relative path
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
  }
}

/**
 * Process file upload using the file upload utility
 */
async function processFileUpload(file: File): Promise<string> {
  const uploadResult: FileUploadResult = await uploadRoomCategoryImage(file);
  
  if (!uploadResult.success) {
    throw new Error(uploadResult.error || 'Failed to upload image');
  }
  
  if (!uploadResult.publicUrl) {
    throw new Error('No public URL returned from file upload');
  }
  
  return uploadResult.publicUrl;
}

/**
 * Delete old image file if it exists and is not the default placeholder
 */
async function cleanupOldImage(oldImageUrl: string | null): Promise<void> {
  if (!oldImageUrl || oldImageUrl.includes('/uploads/room-categories/')) {
    // Skip deletion for placeholder URLs or null values
    return;
  }

  const deleteResult = await deleteRoomCategoryImage(oldImageUrl);
  if (!deleteResult.success) {
    console.warn('Failed to delete old image:', deleteResult.error);
    // Don't throw error here - image deletion failure shouldn't block the main operation
  }
}

/**
 * Get all room categories
 */
export async function getAllCategoriesService(): Promise<ServiceResult<RoomCategory[]>> {
  try {
    const categories = await getAllRoomCategories();
    return {
      success: true,
      data: categories
    };
  } catch (error) {
    console.error('Error fetching room categories:', error);
    return {
      success: false,
      error: 'Failed to fetch room categories'
    };
  }
}

/**
 * Get room category by ID
 */
export async function getCategoryByIdService(id: number): Promise<ServiceResult<RoomCategory>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid category ID'
      };
    }

    const category = await getRoomCategoryById(id);
    
    if (!category) {
      return {
        success: false,
        error: 'Room category not found'
      };
    }

    return {
      success: true,
      data: category
    };
  } catch (error) {
    console.error('Error fetching room category:', error);
    return {
      success: false,
      error: 'Failed to fetch room category'
    };
  }
}

/**
 * Create a new room category
 */
export async function createCategoryService(data: RoomCategoryCreateData): Promise<ServiceResult<RoomCategory>> {
  try {
    // Validate input data
    const validationError = validateRoomCategoryData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    // Check if category name already exists
    const nameExists = await roomCategoryExistsByName(data.name.trim());
    if (nameExists) {
      return {
        success: false,
        error: 'A room category with this name already exists'
      };
    }

    // Process file upload if provided
    let featuredImageUrl = data.featuredImageUrl;
    if (data.featuredImage) {
      featuredImageUrl = await processFileUpload(data.featuredImage);
    }

    // Prepare data for insertion
    const insertData: RoomCategoryInsert = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,

      // /////////////////////////////////////////////////////////////////////////////// gats to  go
      // basePrice: data.basePrice,
      // /////////////////////////////////////////////////////////////////////////////// gats to  go
      
      maxOccupancy: data.maxOccupancy,
      featuredImageUrl: featuredImageUrl || undefined
    };

    // Create the category
    const newCategory = await createRoomCategory(insertData);
    
    return {
      success: true,
      data: newCategory
    };
  } catch (error) {
    console.error('Error creating room category:', error);
    
    // Clean up uploaded file if creation failed
    if (data.featuredImage) {
      try {
        // This is a best-effort cleanup, we don't await it
        createCategoryService.name // Just to use the function context
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create room category'
    };
  }
}

/**
 * Update a room category
 */
export async function updateCategoryService(id: number, data: RoomCategoryUpdateData): Promise<ServiceResult<RoomCategory>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid category ID'
      };
    }

    // Check if category exists
    const existingCategory = await getRoomCategoryById(id);
    if (!existingCategory) {
      return {
        success: false,
        error: 'Room category not found'
      };
    }

    // Validate data if provided
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        return {
          success: false,
          error: 'Category name is required'
        };
      }
      if (data.name.trim().length < 2) {
        return {
          success: false,
          error: 'Category name must be at least 2 characters long'
        };
      }
      if (data.name.trim().length > 100) {
        return {
          success: false,
          error: 'Category name must be less than 100 characters'
        };
      }
    }

    if (data.description && data.description.length > 500) {
      return {
        success: false,
        error: 'Description must be less than 500 characters'
      };
    }

    // /////////////////////////////////////////////////////////////////////////////// gats to  go
    if (data.basePrice !== undefined && data.basePrice < 0) {
      return {
        success: false,
        error: 'Base price must be a positive number'
      };
    }
    // /////////////////////////////////////////////////////////////////////////////// gats to  go

    if (data.maxOccupancy !== undefined && data.maxOccupancy < 1) {
      return {
        success: false,
        error: 'Max occupancy must be at least 1'
      };
    }

    if (data.maxOccupancy !== undefined && data.maxOccupancy > 20) {
      return {
        success: false,
        error: 'Max occupancy cannot exceed 20'
      };
    }

    // Validate featuredImageUrl if provided
    if (data.featuredImageUrl && !isValidImageUrl(data.featuredImageUrl)) {
      return {
        success: false,
        error: 'Featured image URL must be a valid image URL'
      };
    }

    // Check for duplicate name (excluding current category)
    if (data.name && data.name.trim() !== existingCategory.name) {
      const nameExists = await roomCategoryExistsByName(data.name.trim(), id);
      if (nameExists) {
        return {
          success: false,
          error: 'A room category with this name already exists'
        };
      }
    }

    // Track old image URL for cleanup
    const oldImageUrl = existingCategory.featured_image_url;

    // Process file upload if provided
    let featuredImageUrl = data.featuredImageUrl;
    let shouldCleanupOldImage = false;

    if (data.featuredImage) {
      featuredImageUrl = await processFileUpload(data.featuredImage);
      shouldCleanupOldImage = true; // Clean up old image only when new image is uploaded
    }

    // Prepare data for update
    const updateData: RoomCategoryUpdate = {
      name: data.name?.trim(),
      description: data.description?.trim(),

      // /////////////////////////////////////////////////////////////////////////////// gats to  go
      basePrice: data.basePrice,
      // /////////////////////////////////////////////////////////////////////////////// gats to  go

      maxOccupancy: data.maxOccupancy,
      featuredImageUrl: featuredImageUrl
    };

    // Remove undefined values in a type-safe way
    const filteredUpdateData: Partial<RoomCategoryUpdate> = {};
    
    if (updateData.name !== undefined) filteredUpdateData.name = updateData.name;
    if (updateData.description !== undefined) filteredUpdateData.description = updateData.description;

    // /////////////////////////////////////////////////////////////////////////////// gats to  go
    if (updateData.basePrice !== undefined) filteredUpdateData.basePrice = updateData.basePrice;
    // /////////////////////////////////////////////////////////////////////////////// gats to  go

    if (updateData.maxOccupancy !== undefined) filteredUpdateData.maxOccupancy = updateData.maxOccupancy;
    if (updateData.featuredImageUrl !== undefined) filteredUpdateData.featuredImageUrl = updateData.featuredImageUrl;

    // Update the category
    const updatedCategory = await updateRoomCategory(id, filteredUpdateData);
    
    if (!updatedCategory) {
      // Clean up newly uploaded file if update failed
      if (data.featuredImage && featuredImageUrl) {
        await cleanupOldImage(featuredImageUrl);
      }
      return {
        success: false,
        error: 'Failed to update room category'
      };
    }

    // Clean up old image after successful update
    if (shouldCleanupOldImage && oldImageUrl) {
      await cleanupOldImage(oldImageUrl);
    }

    return {
      success: true,
      data: updatedCategory
    };
  } catch (error) {
    console.error('Error updating room category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update room category'
    };
  }
}

/**
 * Delete a room category
 */
export async function deleteCategoryService(id: number): Promise<ServiceResult<RoomCategory>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid category ID'
      };
    }

    // Check if category exists
    const existingCategory = await getRoomCategoryById(id);
    if (!existingCategory) {
      return {
        success: false,
        error: 'Room category not found'
      };
    }

    // Track image URL for cleanup
    const imageUrl = existingCategory.featured_image_url;

    // Delete the category from database
    const deletedCategory = await deleteRoomCategory(id);
    
    if (!deletedCategory) {
      return {
        success: false,
        error: 'Failed to delete room category'
      };
    }

    // Clean up associated image file after successful deletion
    if (imageUrl) {
      await cleanupOldImage(imageUrl);
    }

    return {
      success: true,
      data: deletedCategory
    };
  } catch (error) {
    console.error('Error deleting room category:', error);
    return {
      success: false,
      error: 'Failed to delete room category'
    };
  }
}