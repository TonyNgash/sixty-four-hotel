import { 
  getAllAmenities,
  getAmenityById,
  getAmenityByName,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  amenityExistsByName,
  type AmenityInsert,
  type AmenityUpdate
} from '@/lib/database/queries/amenities';
import type { Amenity } from '@/types/database';

export interface AmenityCreateData {
  name: string;
  description?: string;
  icon: string;
}

export interface AmenityUpdateData {
  name?: string;
  description?: string;
  icon?: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate amenity data
 */
function validateAmenityData(data: AmenityCreateData): string | null {
  if (!data.name || data.name.trim().length === 0) {
    return 'Amenity name is required';
  }

  if (data.name.trim().length < 2) {
    return 'Amenity name must be at least 2 characters long';
  }

  if (data.name.trim().length > 100) {
    return 'Amenity name must be less than 100 characters';
  }

  if (data.description && data.description.length > 500) {
    return 'Description must be less than 500 characters';
  }

  if (!data.icon || data.icon.trim().length === 0) {
    return 'Icon is required';
  }

  if (data.icon.trim().length > 10) {
    return 'Icon must be a short emoji or code';
  }

  return null;
}

/**
 * Get all amenities
 */
export async function getAllAmenitiesService(): Promise<ServiceResult<Amenity[]>> {
  try {
    const amenities = await getAllAmenities();
    return {
      success: true,
      data: amenities
    };
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return {
      success: false,
      error: 'Failed to fetch amenities'
    };
  }
}

/**
 * Get amenity by ID
 */
export async function getAmenityByIdService(id: number): Promise<ServiceResult<Amenity>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid amenity ID'
      };
    }

    const amenity = await getAmenityById(id);
    
    if (!amenity) {
      return {
        success: false,
        error: 'Amenity not found'
      };
    }

    return {
      success: true,
      data: amenity
    };
  } catch (error) {
    console.error('Error fetching amenity:', error);
    return {
      success: false,
      error: 'Failed to fetch amenity'
    };
  }
}

/**
 * Create a new amenity
 */
export async function createAmenityService(data: AmenityCreateData): Promise<ServiceResult<Amenity>> {
  try {
    // Validate input data
    const validationError = validateAmenityData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    // Check if amenity name already exists
    const nameExists = await amenityExistsByName(data.name.trim());
    if (nameExists) {
      return {
        success: false,
        error: 'An amenity with this name already exists'
      };
    }

    // Prepare data for insertion
    const insertData: AmenityInsert = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      icon: data.icon.trim(),
    };

    // Create the amenity
    const newAmenity = await createAmenity(insertData);
    
    return {
      success: true,
      data: newAmenity
    };
  } catch (error) {
    console.error('Error creating amenity:', error);
    return {
      success: false,
      error: 'Failed to create amenity'
    };
  }
}

/**
 * Update an amenity
 */
export async function updateAmenityService(id: number, data: AmenityUpdateData): Promise<ServiceResult<Amenity>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid amenity ID'
      };
    }

    // Check if amenity exists
    const existingAmenity = await getAmenityById(id);
    if (!existingAmenity) {
      return {
        success: false,
        error: 'Amenity not found'
      };
    }

    // Validate data if provided
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        return {
          success: false,
          error: 'Amenity name is required'
        };
      }
      if (data.name.trim().length < 2) {
        return {
          success: false,
          error: 'Amenity name must be at least 2 characters long'
        };
      }
      if (data.name.trim().length > 100) {
        return {
          success: false,
          error: 'Amenity name must be less than 100 characters'
        };
      }
    }

    if (data.description && data.description.length > 500) {
      return {
        success: false,
        error: 'Description must be less than 500 characters'
      };
    }

    if (data.icon !== undefined) {
      if (data.icon.trim().length === 0) {
        return {
          success: false,
          error: 'Icon is required'
        };
      }
      if (data.icon.trim().length > 10) {
        return {
          success: false,
          error: 'Icon must be a short emoji or code'
        };
      }
    }

    // Check for duplicate name (excluding current amenity)
    if (data.name && data.name.trim() !== existingAmenity.name) {
      const nameExists = await amenityExistsByName(data.name.trim(), id);
      if (nameExists) {
        return {
          success: false,
          error: 'An amenity with this name already exists'
        };
      }
    }

    // Prepare data for update
    const updateData: AmenityUpdate = {
      name: data.name?.trim(),
      description: data.description?.trim(),
      icon: data.icon?.trim(),
    };

    // Remove undefined values in a type-safe way
    const filteredUpdateData: Partial<AmenityUpdate> = {};
    
    if (updateData.name !== undefined) filteredUpdateData.name = updateData.name;
    if (updateData.description !== undefined) filteredUpdateData.description = updateData.description;
    if (updateData.icon !== undefined) filteredUpdateData.icon = updateData.icon;

    // Update the amenity
    const updatedAmenity = await updateAmenity(id, filteredUpdateData);
    
    if (!updatedAmenity) {
      return {
        success: false,
        error: 'Failed to update amenity'
      };
    }

    return {
      success: true,
      data: updatedAmenity
    };
  } catch (error) {
    console.error('Error updating amenity:', error);
    return {
      success: false,
      error: 'Failed to update amenity'
    };
  }
}

/**
 * Delete an amenity
 */
export async function deleteAmenityService(id: number): Promise<ServiceResult<Amenity>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid amenity ID'
      };
    }

    // Check if amenity exists
    const existingAmenity = await getAmenityById(id);
    if (!existingAmenity) {
      return {
        success: false,
        error: 'Amenity not found'
      };
    }

    // TODO: Add check if amenity is being used by any rooms
    // This would prevent deletion of amenities that are in use

    const deletedAmenity = await deleteAmenity(id);
    
    if (!deletedAmenity) {
      return {
        success: false,
        error: 'Failed to delete amenity'
      };
    }

    return {
      success: true,
      data: deletedAmenity
    };
  } catch (error) {
    console.error('Error deleting amenity:', error);
    return {
      success: false,
      error: 'Failed to delete amenity'
    };
  }
}