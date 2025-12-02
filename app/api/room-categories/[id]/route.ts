import { NextRequest, NextResponse } from 'next/server';
import { getCategoryByIdService, updateCategoryService, deleteCategoryService } from '@/lib/services/room-category-service';
import type { RoomCategoryUpdateData } from '@/lib/services/room-category-service';
import type { ApiResponse } from '@/types/api';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/room-categories/[id]
 * Get room category by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid category ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await getCategoryByIdService(id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: result.data
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/room-categories/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * PUT /api/room-categories/[id]
 * Update a room category with support for file uploads
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const awaitedParams = await(params);
    const id = parseInt(awaitedParams.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid category ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if the request is multipart/form-data (file upload)
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      const formData = await request.formData();
      
      // Prepare update data with proper typing
      const updateData: RoomCategoryUpdateData & { featuredImage?: File } = {};
      
      // Extract text fields from form data
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const basePrice = formData.get('basePrice') as string;
      const maxOccupancy = formData.get('maxOccupancy') as string;
      const featuredImage = formData.get('featuredImage') as File;

      if (name !== null) updateData.name = name;
      if (description !== null) updateData.description = description;
      
      // Parse numeric fields
      if (basePrice !== null) {
        const basePriceNum = Number(basePrice);
        if (isNaN(basePriceNum)) {
          const response: ApiResponse = {
            success: false,
            error: 'basePrice must be a valid number'
          };
          return NextResponse.json(response, { status: 400 });
        }
        updateData.basePrice = basePriceNum;
      }

      if (maxOccupancy !== null) {
        const maxOccupancyNum = Number(maxOccupancy);
        if (isNaN(maxOccupancyNum)) {
          const response: ApiResponse = {
            success: false,
            error: 'maxOccupancy must be a valid number'
          };
          return NextResponse.json(response, { status: 400 });
        }
        updateData.maxOccupancy = maxOccupancyNum;
      }

      // Handle file upload if provided
      if (featuredImage && featuredImage.size > 0) {
        updateData.featuredImage = featuredImage;
      }

      const result = await updateCategoryService(id, updateData);

      if (!result.success) {
        const response: ApiResponse = {
          success: false,
          error: result.error
        };
        return NextResponse.json(response, { status: 400 });
      }

      const response: ApiResponse = {
        success: true,
        data: result.data,
        message: 'Room category updated successfully'
      };
      return NextResponse.json(response);
    } else {
      // Handle JSON data (no file upload)
      const body = await request.json();

      // Prepare update data with proper typing
      const updateData: RoomCategoryUpdateData = {};
      
      if (body.name !== undefined) updateData.name = body.name;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.basePrice !== undefined) updateData.basePrice = Number(body.basePrice);
      if (body.maxOccupancy !== undefined) updateData.maxOccupancy = Number(body.maxOccupancy);
      if (body.featuredImageUrl !== undefined) updateData.featuredImageUrl = body.featuredImageUrl;

      // Validate numeric fields if provided
      if (updateData.basePrice !== undefined && isNaN(updateData.basePrice)) {
        const response: ApiResponse = {
          success: false,
          error: 'basePrice must be a valid number'
        };
        return NextResponse.json(response, { status: 400 });
      }

      if (updateData.maxOccupancy !== undefined && isNaN(updateData.maxOccupancy)) {
        const response: ApiResponse = {
          success: false,
          error: 'maxOccupancy must be a valid number'
        };
        return NextResponse.json(response, { status: 400 });
      }

      const result = await updateCategoryService(id, updateData);

      if (!result.success) {
        const response: ApiResponse = {
          success: false,
          error: result.error
        };
        return NextResponse.json(response, { status: 400 });
      }

      const response: ApiResponse = {
        success: true,
        data: result.data,
        message: 'Room category updated successfully'
      };
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Error in PUT /api/room-categories/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * DELETE /api/room-categories/[id]
 * Delete a room category
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid category ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await deleteCategoryService(id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Room category deleted successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in DELETE /api/room-categories/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}