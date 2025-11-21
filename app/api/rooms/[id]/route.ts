import { NextRequest, NextResponse } from 'next/server';
import { getRoomByIdService, updateRoomService, deleteRoomService } from '@/lib/services/room-service';
import type { RoomUpdateData } from '@/lib/services/room-service';
import type { ApiResponse } from '@/types/api';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/rooms/[id]
 * Get room by ID with relationships
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid room ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await getRoomByIdService(id);

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
    console.error('Error in GET /api/rooms/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: RouteParams) {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id < 1) {
    return NextResponse.json({ success: false, error: 'Invalid room ID' }, { status: 400 });
  }

  try {
    const formData = await request.formData();

    const roomNumber = getString(formData, 'roomNumber');
    const status = getString(formData, 'status');
    const floorStr = getString(formData, 'floor');
    const categoryIdStr = getString(formData, 'categoryId');
    const viewTypeIdStr = getString(formData, 'viewTypeId');
    const amenityIdStrs = formData.getAll('amenityIds') as string[];
    const imageFiles = getFiles(formData, 'images');

    // At least one field
    if (
      !roomNumber &&
      !status &&
      !floorStr &&
      !categoryIdStr &&
      !viewTypeIdStr &&
      amenityIdStrs.length === 0 &&
      imageFiles.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'At least one field required' },
        { status: 400 }
      );
    }

    let floor: number | undefined;
    if (floorStr) {
      floor = parseInt(floorStr, 10);
      if (isNaN(floor) || floor < 1 || floor > 100) {
        return NextResponse.json(
          { success: false, error: 'Floor must be 1–100' },
          { status: 400 }
        );
      }
    }

    const validStatuses = ['available', 'occupied', 'maintenance'] as const;
    type StatusType = typeof validStatuses[number];
    if (status && !validStatuses.includes(status as StatusType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const categoryId = categoryIdStr
      ? categoryIdStr === 'null'
        ? null
        : parseInt(categoryIdStr, 10)
      : undefined;
    if (categoryIdStr && categoryIdStr !== 'null' && (isNaN(categoryId!) || categoryId! < 1)) {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId' },
        { status: 400 }
      );
    }

    const viewTypeId = viewTypeIdStr
      ? viewTypeIdStr === 'null'
        ? null
        : parseInt(viewTypeIdStr, 10)
      : undefined;
    if (viewTypeIdStr && viewTypeIdStr !== 'null' && (isNaN(viewTypeId!) || viewTypeId! < 1)) {
      return NextResponse.json(
        { success: false, error: 'Invalid viewTypeId' },
        { status: 400 }
      );
    }

    const amenityIds = amenityIdStrs
      .map(id => parseInt(id, 10))
      .filter(id => !isNaN(id) && id > 0);

    const updateData: RoomUpdateData = {
      ...(roomNumber && { roomNumber: roomNumber.trim() }),
      ...(status && { status: status as StatusType }),
      ...(floor && { floor }),
      ...(categoryId !== undefined && { categoryId }),
      ...(viewTypeId !== undefined && { viewTypeId }),
      ...(amenityIds.length > 0 && { amenityIds }),
      ...(imageFiles.length > 0 && { images: imageFiles }),
    };

    const result = await updateRoomService(id, updateData);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, data: result.data, message: 'Room updated' }
    );
  } catch (err: unknown) {
    console.error('PUT error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Invalid FormData: ' + message },
      { status: 400 }
    );
  }
}

/* ==============================================================
   TYPE-SAFE HELPERS (SHARED)
   ============================================================== */
function getString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === 'string' ? value : null;
}

function getFiles(formData: FormData, key: string): File[] {
  return (formData.getAll(key) as File[]).filter(
    (f): f is File => f instanceof File && f.size > 0 && f.name !== ''
  );
}

/**
 * Handle FormData request with file uploads for room update
 */
/**
 * Handle FormData request with file uploads for room update
 */
/**
 * Handle FormData request with file uploads for room update
 */
async function handleFormDataRequest(formData: FormData, id: number) {
  try {
    const roomNumber = formData.get('roomNumber') as string | null;
    const categoryId = formData.get('categoryId') as string | null;
    const status = formData.get('status') as string | null;
    const floor = formData.get('floor') as string | null;
    const viewTypeId = formData.get('viewTypeId') as string | null;
    const amenityIds = formData.getAll('amenityIds') as string[];
    const imageFiles = (formData.getAll('images') as File[]).filter(
      (f): f is File => f instanceof File && f.size > 0
    );

    // Validate at least one field
    if (
      roomNumber === null &&
      categoryId === null &&
      status === null &&
      floor === null &&
      viewTypeId === null &&
      amenityIds.length === 0 &&
      imageFiles.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'At least one field must be provided' },
        { status: 400 }
      );
    }

    // Validate floor
    let floorNum: number | undefined;
    if (floor !== null) {
      floorNum = Number(floor);
      if (isNaN(floorNum) || floorNum < 1 || floorNum > 100) {
        return NextResponse.json(
          { success: false, error: 'Floor must be between 1 and 100' },
          { status: 400 }
        );
      }
    }

    // Validate status (TYPE-SAFE)
    const validStatuses = ['available', 'occupied', 'maintenance'] as const;
    type StatusType = typeof validStatuses[number];

    if (status !== null && !validStatuses.includes(status as StatusType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be available, occupied, or maintenance' },
        { status: 400 }
      );
    }

    // Parse IDs
    const categoryIdNum = categoryId
      ? categoryId === 'null'
        ? null
        : Number(categoryId)
      : undefined;
    if (categoryId && categoryId !== 'null' && isNaN(Number(categoryId))) {
      return NextResponse.json(
        { success: false, error: 'Invalid categoryId' },
        { status: 400 }
      );
    }

    const viewTypeIdNum = viewTypeId
      ? viewTypeId === 'null'
        ? null
        : Number(viewTypeId)
      : undefined;
    if (viewTypeId && viewTypeId !== 'null' && isNaN(Number(viewTypeId))) {
      return NextResponse.json(
        { success: false, error: 'Invalid viewTypeId' },
        { status: 400 }
      );
    }

    const amenityIdsNum = amenityIds
      .map(id => Number(id))
      .filter(id => !isNaN(id));

    // Build update data
    const updateData: RoomUpdateData = {
      ...(roomNumber !== null && { roomNumber: roomNumber.trim() }),
      ...(categoryIdNum !== undefined && { categoryId: categoryIdNum }),
      ...(status !== null && { status: status as StatusType }),
      ...(floorNum !== undefined && { floor: floorNum }),
      ...(viewTypeIdNum !== undefined && { viewTypeId: viewTypeIdNum }),
      ...(amenityIdsNum.length > 0 && { amenityIds: amenityIdsNum }),
      ...(imageFiles.length > 0 && { images: imageFiles }),
    };

    const result = await updateRoomService(id, updateData);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, data: result.data, message: 'Room updated' }
    );
  } catch (error) {
    console.error('FormData error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

/**
 * Handle JSON request (no file upload)
 */
async function handleJsonRequest(body: RoomUpdateData, id: number) {
  try {
    // const body: RoomUpdateData = await request.json();

    // Validate at least one field
    if (
      !body.roomNumber &&
      body.categoryId === undefined &&
      !body.status &&
      body.floor === undefined &&
      body.viewTypeId === undefined &&
      !body.amenityIds
    ) {
      return NextResponse.json(
        { success: false, error: 'At least one field must be provided' },
        { status: 400 }
      );
    }

    // Validate types
    if (body.roomNumber !== undefined && typeof body.roomNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'roomNumber must be string' },
        { status: 400 }
      );
    }

    if (body.status !== undefined && !['available', 'occupied', 'maintenance'].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    if (body.floor !== undefined && (typeof body.floor !== 'number' || body.floor < 1 || body.floor > 100)) {
      return NextResponse.json(
        { success: false, error: 'Floor must be 1–100' },
        { status: 400 }
      );
    }

    const result = await updateRoomService(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data, message: 'Room updated' }
    );
  } catch (error) {
    console.error('JSON error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/rooms/[id]
 * Delete a room
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id) || id < 1) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid room ID'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await deleteRoomService(id);

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Room deleted successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in DELETE /api/rooms/[id]:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    return NextResponse.json(response, { status: 500 });
  }
}