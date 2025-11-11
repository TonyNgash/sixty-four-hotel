import { 
  getAllViewTypes,
  getViewTypeById,
  getViewTypeByName,
  createViewType,
  updateViewType,
  deleteViewType,
  viewTypeExistsByName,
  type ViewTypeInsert,
  type ViewTypeUpdate
} from '@/lib/database/queries/view-types';
import type { ViewType } from '@/types/database';

export interface ViewTypeCreateData {
  name: string;
  description?: string;
}

export interface ViewTypeUpdateData {
  name?: string;
  description?: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate view type data
 */
function validateViewTypeData(data: ViewTypeCreateData): string | null {
  if (!data.name || data.name.trim().length === 0) {
    return 'View type name is required';
  }

  if (data.name.trim().length < 2) {
    return 'View type name must be at least 2 characters long';
  }

  if (data.name.trim().length > 100) {
    return 'View type name must be less than 100 characters';
  }

  if (data.description && data.description.length > 500) {
    return 'Description must be less than 500 characters';
  }

  return null;
}

/**
 * Get all view types
 */
export async function getAllViewTypesService(): Promise<ServiceResult<ViewType[]>> {
  try {
    const viewTypes = await getAllViewTypes();
    return {
      success: true,
      data: viewTypes
    };
  } catch (error) {
    console.error('Error fetching view types:', error);
    return {
      success: false,
      error: 'Failed to fetch view types'
    };
  }
}

/**
 * Get view type by ID
 */
export async function getViewTypeByIdService(id: number): Promise<ServiceResult<ViewType>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid view type ID'
      };
    }

    const viewType = await getViewTypeById(id);
    
    if (!viewType) {
      return {
        success: false,
        error: 'View type not found'
      };
    }

    return {
      success: true,
      data: viewType
    };
  } catch (error) {
    console.error('Error fetching view type:', error);
    return {
      success: false,
      error: 'Failed to fetch view type'
    };
  }
}

/**
 * Create a new view type
 */
export async function createViewTypeService(data: ViewTypeCreateData): Promise<ServiceResult<ViewType>> {
  try {
    // Validate input data
    const validationError = validateViewTypeData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    // Check if view type name already exists
    const nameExists = await viewTypeExistsByName(data.name.trim());
    if (nameExists) {
      return {
        success: false,
        error: 'A view type with this name already exists'
      };
    }

    // Prepare data for insertion
    const insertData: ViewTypeInsert = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
    };

    // Create the view type
    const newViewType = await createViewType(insertData);
    
    return {
      success: true,
      data: newViewType
    };
  } catch (error) {
    console.error('Error creating view type:', error);
    return {
      success: false,
      error: 'Failed to create view type'
    };
  }
}

/**
 * Update a view type
 */
export async function updateViewTypeService(id: number, data: ViewTypeUpdateData): Promise<ServiceResult<ViewType>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid view type ID'
      };
    }

    // Check if view type exists
    const existingViewType = await getViewTypeById(id);
    if (!existingViewType) {
      return {
        success: false,
        error: 'View type not found'
      };
    }

    // Validate data if provided
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        return {
          success: false,
          error: 'View type name is required'
        };
      }
      if (data.name.trim().length < 2) {
        return {
          success: false,
          error: 'View type name must be at least 2 characters long'
        };
      }
      if (data.name.trim().length > 100) {
        return {
          success: false,
          error: 'View type name must be less than 100 characters'
        };
      }
    }

    if (data.description && data.description.length > 500) {
      return {
        success: false,
        error: 'Description must be less than 500 characters'
      };
    }

    // Check for duplicate name (excluding current view type)
    if (data.name && data.name.trim() !== existingViewType.name) {
      const nameExists = await viewTypeExistsByName(data.name.trim(), id);
      if (nameExists) {
        return {
          success: false,
          error: 'A view type with this name already exists'
        };
      }
    }

    // Prepare data for update
    const updateData: ViewTypeUpdate = {
      name: data.name?.trim(),
      description: data.description?.trim(),
    };

    // Remove undefined values in a type-safe way
    const filteredUpdateData: Partial<ViewTypeUpdate> = {};
    
    if (updateData.name !== undefined) filteredUpdateData.name = updateData.name;
    if (updateData.description !== undefined) filteredUpdateData.description = updateData.description;

    // Update the view type
    const updatedViewType = await updateViewType(id, filteredUpdateData);
    
    if (!updatedViewType) {
      return {
        success: false,
        error: 'Failed to update view type'
      };
    }

    return {
      success: true,
      data: updatedViewType
    };
  } catch (error) {
    console.error('Error updating view type:', error);
    return {
      success: false,
      error: 'Failed to update view type'
    };
  }
}

/**
 * Delete a view type
 */
export async function deleteViewTypeService(id: number): Promise<ServiceResult<ViewType>> {
  try {
    if (!id || id < 1) {
      return {
        success: false,
        error: 'Invalid view type ID'
      };
    }

    // Check if view type exists
    const existingViewType = await getViewTypeById(id);
    if (!existingViewType) {
      return {
        success: false,
        error: 'View type not found'
      };
    }

    // TODO: Add check if view type is being used by any rooms
    // This would prevent deletion of view types that are in use

    const deletedViewType = await deleteViewType(id);
    
    if (!deletedViewType) {
      return {
        success: false,
        error: 'Failed to delete view type'
      };
    }

    return {
      success: true,
      data: deletedViewType
    };
  } catch (error) {
    console.error('Error deleting view type:', error);
    return {
      success: false,
      error: 'Failed to delete view type'
    };
  }
}