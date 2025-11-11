import { NextRequest, NextResponse } from 'next/server';
import { getViewTypeByIdService, updateViewTypeService, deleteViewTypeService } from '@/lib/services/view-type-service';
import type { ViewTypeUpdateData } from '@/lib/services/view-type-service';
import type { ApiResponse } from '@/types/api';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/view-types/[id]
 * Get view type by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid view type ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await getViewTypeByIdService(id);

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
    console.error('Error in GET /api/view-types/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * PUT /api/view-types/[id]
 * Update a view type
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid view type ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Parse and validate request body
    const body: ViewTypeUpdateData = await request.json();

    // Validate that at least one field is provided
    if (!body.name && !body.description) {
      const response: ApiResponse = {
        success: false,
        error: 'At least one field must be provided for update: name or description'
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

    // Call service layer to update view type
    const result = await updateViewTypeService(id, {
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
      message: 'View type updated successfully'
    };
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in PUT /api/view-types/[id]:', error);
    
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
 * DELETE /api/view-types/[id]
 * Delete a view type
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid view type ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await deleteViewTypeService(id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'View type deleted successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in DELETE /api/view-types/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}