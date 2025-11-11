import { NextRequest, NextResponse } from 'next/server';
import { deleteRoomCategories } from '@/lib/database/queries/room-categories'; // Fixed import path
import type { ApiResponse } from '@/types/api';

interface BulkDeleteRequest {
  ids: number[];
}

/**
 * DELETE /api/room-categories/bulk-delete
 * Bulk delete room categories
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<void>>> {
  try {
    // Parse and validate request body
    const body: BulkDeleteRequest = await request.json();

    // Validate required fields
    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category IDs are required and must be an array',
        },
        { status: 400 }
      );
    }

    // Validate IDs are positive numbers
    if (body.ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No category IDs provided',
        },
        { status: 400 }
      );
    }

    const invalidIds = body.ids.filter(id => typeof id !== 'number' || id <= 0);
    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category IDs: ${invalidIds.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Perform bulk deletion
    const result = await deleteRoomCategories(body.ids);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to delete categories',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: undefined,
    });
  } catch (error) {
    console.error('Error in bulk delete room categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}