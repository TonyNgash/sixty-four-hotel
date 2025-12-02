import { NextRequest, NextResponse } from 'next/server';
import { performBulkDelete, BulkDeleteTableName } from '@/lib/utils/bulk-delete';
import { cleanupOldImages } from '@/lib/services/room-service';

import type { ApiResponse } from '@/types/api';


interface BulkDeleteRequest {
  tableName: string;
  ids: number[];
}

/**
 * Type guard to check if value is a valid BulkDeleteRequest
 */
function isValidBulkDeleteRequest(body: unknown): body is BulkDeleteRequest {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const potentialRequest = body as Record<string, unknown>;
  
  return (
    typeof potentialRequest.tableName === 'string' &&
    Array.isArray(potentialRequest.ids) &&
    potentialRequest.ids.every((id: unknown) => typeof id === 'number' && Number.isInteger(id) && id > 0)
  );
}

/**
 * Type guard to check if parsed JSON has the expected structure
 */
function isValidParsedBody(value: unknown): value is BulkDeleteRequest {
  return isValidBulkDeleteRequest(value);
}

/**
 * Parse and validate request body
 */
async function parseAndValidateBody(request: NextRequest): Promise<{ success: true; data: BulkDeleteRequest } | { success: false; error: string }> {
  try {
    const body = await request.json();
    
    if (!isValidParsedBody(body)) {
      return {
        success: false,
        error: 'Invalid request body. Expected { tableName: string, ids: number[] } where ids are positive integers'
      };
    }

    if (!body.tableName || body.ids.length === 0) {
      return {
        success: false,
        error: 'Missing required fields: tableName and non-empty ids array'
      };
    }

    return {
      success: true,
      data: body
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: 'Invalid JSON in request body'
      };
    }
    return {
      success: false,
      error: 'Failed to parse request body'
    };
  }
}

/**
 * POST /api/bulk-delete
 * Generic bulk delete endpoint for all entities
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const parseResult = await parseAndValidateBody(request);
    if (!parseResult.success) {
      const response: ApiResponse = {
        success: false,
        error: parseResult.error
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { data: body } = parseResult;

    const tableName = body.tableName as BulkDeleteTableName;

    // Perform bulk deletion - NOW PASSING tableName STRING DIRECTLY
    console.warn("Are roomIds being sent to the performBulkDelete:",body.ids);
    const result = await performBulkDelete(tableName, body.ids);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: result.error || `Failed to delete records from ${body.tableName}`
      };
      return NextResponse.json(response, { status: 400 });
    }

    //file system cleanup (only after successful db commit)
    if(tableName === 'rooms' && result.imageUrls && result.imageUrls.length > 0){
      console.log(`Starting cleanup for ${result.imageUrls.length} images...`);
      await cleanupOldImages(result.imageUrls);
    }

    const response: ApiResponse = {
      success: true,
      data: {
        deletedCount: result.deletedCount,
        tableName: body.tableName
      },
      message: `Successfully deleted ${result.deletedCount} records from ${body.tableName}`
    };
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in bulk delete API:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * GET /api/bulk-delete
 * Provide information about available tables for bulk delete
 */
export async function GET(request: NextRequest) {
  try {
    // Note: You might want to keep this or remove it since performBulkDelete
    // now handles table resolution internally
    const availableTables = ['amenities', 'room-categories', 'view-types', 'rooms'];
    
    const response: ApiResponse = {
      success: true,
      data: {
        availableTables,
        description: 'Generic bulk delete endpoint. Send POST request with { tableName: string, ids: number[] }',
        example: {
          tableName: 'room-categories',
          ids: [1, 2, 3]
        }
      }
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in bulk delete GET:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}