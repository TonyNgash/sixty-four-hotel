import { NextRequest, NextResponse } from 'next/server';
import { getAllAmenitiesService, createAmenityService } from '@/lib/services/amenity-service';
import type { ApiResponse } from '@/types/api';
import type { AmenityCreateData } from '@/lib/services/amenity-service';

/**
 * GET /api/amenities
 * Get all amenities
 */
export async function GET(request: NextRequest) {
  try {
    const result = await getAllAmenitiesService();

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
    console.error('Error in GET /api/amenities:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/amenities
 * Create a new amenity
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: AmenityCreateData = await request.json();

    // Validate required fields
    if (!body.name || !body.icon) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields: name and icon'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate field types
    if (typeof body.name !== 'string' || typeof body.icon !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid field types: name and icon must be strings'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate description if provided
    if (body.description && typeof body.description !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid field type: description must be a string'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Call service layer to create amenity
    const result = await createAmenityService({
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
      message: 'Amenity created successfully'
    };
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/amenities:', error);
    
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