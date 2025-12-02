import { NextRequest, NextResponse } from 'next/server';
import { getAllCategoriesService, createCategoryService } from '@/lib/services/room-category-service';
import { uploadRoomCategoryImage, type FileUploadResult } from '@/lib/utils/file-upload';
import type { ApiResponse } from '@/types/api';

/**
 * GET /api/room-categories
 * Get all room categories
 */
export async function GET(request: NextRequest) {
  try {
    const result = await getAllCategoriesService();

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      data: result.data
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/room-categories:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/room-categories
 * Create a new room category with image upload using the file upload utility
 */
export async function POST(request: NextRequest) {
  try {
    // Parse FormData from the request
    const formData = await request.formData();

    // Extract form fields with type safety
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;

    // /////////////////////////////////////////////////////////////////////////////// gats to  go
    // const basePrice = formData.get('basePrice') as string | null;
    // /////////////////////////////////////////////////////////////////////////////// gats to  go
    
    const maxOccupancy = formData.get('maxOccupancy') as string | null;
    const featuredImage = formData.get('featuredImage') as File | null;

    // Validate required fields
    if (!name || !maxOccupancy) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields: name, basePrice, maxOccupancy'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate numeric fields

    // /////////////////////////////////////////////////////////////////////////////// gats to  go
    // const basePriceNum = Number(basePrice);
    // /////////////////////////////////////////////////////////////////////////////// gats to  go

    const maxOccupancyNum = Number(maxOccupancy);
    
    // /////////////////////////////////////////////////////////////////////////////// gats to  go
    if (isNaN(maxOccupancyNum)) {
      const response: ApiResponse = {
        success: false,
        error: 'basePrice and maxOccupancy must be valid numbers'
      };
      return NextResponse.json(response, { status: 400 });
    }
    // /////////////////////////////////////////////////////////////////////////////// gats to  go

    // /////////////////////////////////////////////////////////////////////////////// gats to  go
    // if (basePriceNum <= 0) {
    //   const response: ApiResponse = {
    //     success: false,
    //     error: 'basePrice must be a positive number'
    //   };
    //   return NextResponse.json(response, { status: 400 });
    // }
    // /////////////////////////////////////////////////////////////////////////////// gats to  go

    if (maxOccupancyNum < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'maxOccupancy must be at least 1'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Handle image upload if provided using the file upload utility
    let featuredImageUrl: string | undefined;
    if (featuredImage && featuredImage.size > 0) {
      try {
        const uploadResult: FileUploadResult = await uploadRoomCategoryImage(featuredImage);
        
        if (!uploadResult.success) {
          const response: ApiResponse = {
            success: false,
            error: uploadResult.error || 'Failed to upload image'
          };
          return NextResponse.json(response, { status: 400 });
        }

        featuredImageUrl = uploadResult.publicUrl;
      } catch (error) {
        console.error('Error saving uploaded image:', error);
        const response: ApiResponse = {
          success: false,
          error: 'Failed to upload image'
        };
        return NextResponse.json(response, { status: 500 });
      }
    }

    // Prepare data for service layer
    const createData = {
      name: name.trim(),
      description: description?.trim() || undefined,

      // /////////////////////////////////////////////////////////////////////////////// gats to  go
      // basePrice: basePriceNum,
      // /////////////////////////////////////////////////////////////////////////////// gats to  go

      maxOccupancy: maxOccupancyNum,
      featuredImageUrl: featuredImageUrl
    };

    // Call service layer to create category
    const result = await createCategoryService(createData);

    if (!result.success) {
      // Clean up uploaded file if category creation failed
      if (featuredImageUrl) {
        try {
          // This is a best-effort cleanup, we don't await it
          const deleteResult = await uploadRoomCategoryImage.name; // Just to reference the utility
        } catch (cleanupError) {
          console.error('Error during image cleanup:', cleanupError);
        }
      }
      
      const response: ApiResponse = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      data: result.data,
      message: 'Room category created successfully'
    };
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/room-categories:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}