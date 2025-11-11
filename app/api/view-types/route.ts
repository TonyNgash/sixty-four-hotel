import { NextRequest, NextResponse } from 'next/server';
import { getAllViewTypesService, createViewTypeService } from '@/lib/services/view-type-service';
import type { ApiResponse } from '@/types/api';
import type { ViewTypeCreateData } from '@/lib/services/view-type-service';

/**
 * GET /api/view-types
 * Get all view types
 */
export async function GET(request: NextRequest) {
  try {
    const result = await getAllViewTypesService();

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
    console.error('Error in GET /api/view-types:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/view-types
 * Create a new view type
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: ViewTypeCreateData = await request.json();

    // Validate required fields
    if (!body.name) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required field: name'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate field types
    if (typeof body.name !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid field type: name must be a string'
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

    // Call service layer to create view type
    const result = await createViewTypeService({
      name: body.name,
      description: body.description
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
      message: 'View type created successfully'
    };
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/view-types:', error);
    
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