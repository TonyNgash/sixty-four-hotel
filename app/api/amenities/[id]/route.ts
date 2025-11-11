import { NextRequest, NextResponse } from 'next/server';
import { getAmenityByIdService, updateAmenityService, deleteAmenityService } from '@/lib/services/amenity-service';
import type { AmenityUpdateData } from '@/lib/services/amenity-service';
import type { ApiResponse } from '@/types/api';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/amenities/[id]
 * Get amenity by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid amenity ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await getAmenityByIdService(id);

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
    console.error('Error in GET /api/amenities/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * PUT /api/amenities/[id]
 * Update an amenity
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid amenity ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Parse and validate request body
    const body: AmenityUpdateData = await request.json();

    // Validate that at least one field is provided
    if (!body.name && !body.description && !body.icon) {
      const response: ApiResponse = {
        success: false,
        error: 'At least one field must be provided for update: name, description, or icon'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate field types if provided
    if (body.name !== undefined && typeof body.name !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid field type: name must be a string'
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (body.description !== undefined && typeof body.description !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid field type: description must be a string'
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (body.icon !== undefined && typeof body.icon !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid field type: icon must be a string'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Call service layer to update amenity
    const result = await updateAmenityService(id, {
      name: body.name,
      description: body.description,
      icon: body.icon
    });

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
      message: 'Amenity updated successfully'
    };
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in PUT /api/amenities/[id]:', error);
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid JSON in request body'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * DELETE /api/amenities/[id]
 * Delete an amenity
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid amenity ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await deleteAmenityService(id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Amenity deleted successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in DELETE /api/amenities/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}