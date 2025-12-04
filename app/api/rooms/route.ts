// ──────────────────────────────────────────────────────────────
// app/api/rooms/route.ts   ← FINAL VERSION
// ──────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { getAllRoomsService, createRoomService, updateRoomService } from '@/lib/services/room-service';
import type { ApiResponse } from '@/types/api';
import type { RoomWithRelations } from '@/types/database';
import type { RoomCreateData, RoomUpdateData } from '@/lib/services/room-service';
import { ne } from 'drizzle-orm';


/* ==============================================================
   GET – List all rooms
   ============================================================== */
export async function GET() {
  try {
    console.error("here we fail")
    const result = await getAllRoomsService();
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    console.error('GET /api/rooms error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// app/api/rooms/route.ts

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const roomNumber = formData.get('roomNumber') as string | null;
    const roomPrice = formData.get('roomPrice') as string | null;
    const categoryId = formData.get('categoryId') as string | null;
    const floor = formData.get('floor') as string | null;
    const viewTypeId = formData.get('viewTypeId') as string | null;
    const status = formData.get('status') as string | null;
    const amenityIds = formData.getAll('amenityIds') as string[];
    
    // THIS IS THE KEY: Extract files correctly
    const imageFiles = formData.getAll('images') as File[];
    const validImageFiles = imageFiles.filter(
      (f): f is File => f instanceof File && f.size > 0 && f.name !== 'undefined'
    );

    // Basic validation
    if (!roomNumber || !roomPrice || !status || !floor) {
      return NextResponse.json(
        { success: false, error: 'Room Number Room Price, Status, and Floor are required' },
        { status: 400 }
      );
    }

    const floorNum = Number(floor);
    if (isNaN(floorNum) || floorNum < 1 || floorNum > 100) {
      return NextResponse.json(
        { success: false, error: 'Floor must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Build correct data object
    const roomPriceNum = Number(roomPrice);
    const createData: RoomCreateData = {
      roomNumber: roomNumber.trim(),
      roomPrice: roomPriceNum,
      categoryId: categoryId ? Number(categoryId) : undefined,
      floor: floorNum,
      viewTypeId: viewTypeId ? Number(viewTypeId) : undefined,
      status: status as 'available' | 'occupied' | 'maintenance',
      amenityIds: amenityIds.length > 0 
        ? amenityIds.map(Number).filter(n => !isNaN(n))
        : undefined,
      images: validImageFiles.length > 0 ? validImageFiles : undefined,
    };

    // NOW pass the correct object
    
    const result = await createRoomService(createData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data, message: 'Room created successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/rooms error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create room' },
      { status: 500 }
    );
  }
}


/**
 * Handle FormData (with file uploads)
 */
// async function createRoomWithFormData(formData: FormData) {
//   const roomNumber = formData.get('roomNumber') as string | null;
//   const roomPrice = formData.get('roomPrice') as string | null;
//   const categoryId = formData.get('categoryId') as string | null;
//   const status = formData.get('status') as string | null;
//   const floor = formData.get('floor') as string | null;
//   const viewTypeId = formData.get('viewTypeId') as string | null;
//   const amenityIds = formData.getAll('amenityIds') as string[];
//   const imageFiles = (formData.getAll('images') as File[]).filter(
//     (f): f is File => f instanceof File && f.size > 0
//   );

//   if (!roomNumber || !roomPrice || !status || !floor) {
//     return NextResponse.json(
//       { success: false, error: 'Missing required fields' },
//       { status: 400 }
//     );
//   }

//   const floorNum = Number(floor);
//   if (isNaN(floorNum) || floorNum < 1 || floorNum > 100) {
//     return NextResponse.json(
//       { success: false, error: 'Floor must be 1-100' },
//       { status: 400 }
//     );
//   }

//   const validStatuses = ['available', 'occupied', 'maintenance'] as const;
//   type StatusType = typeof validStatuses[number];
//   if (!validStatuses.includes(status as StatusType)) {
//     return NextResponse.json(
//       { success: false, error: 'Invalid status' },
//       { status: 400 }
//     );
//   }

//   const createData: RoomCreateData = {
//     roomNumber: roomNumber.trim(),
//     roomPrice: roomPrice.trim(),
//     categoryId: categoryId ? Number(categoryId) : undefined,
//     status: status as StatusType,
//     floor: floorNum,
//     viewTypeId: viewTypeId ? Number(viewTypeId) : undefined,
//     amenityIds: amenityIds.length > 0 ? amenityIds.map(Number).filter(n => !isNaN(n)) : undefined,
//     images: imageFiles.length > 0 ? imageFiles : undefined,
//   };

//   const result = await createRoomService(createData);
//   if (!result.success) {
//     return NextResponse.json({ success: false, error: result.error }, { status: 400 });
//   }

//   return NextResponse.json(
//     { success: true, data: result.data, message: 'Room created' },
//     { status: 201 }
//   );
// }

/**
 * Handle JSON (no file uploads)
 */
// async function createRoomWithJson(body: Partial<RoomCreateData>) {
//   const { roomNumber, roomPrice, categoryId, status, floor, viewTypeId, amenityIds } = body;

//   if (!roomNumber || !roomPrice || !status || !floor) {
//     return NextResponse.json(
//       { success: false, error: 'Missing required fields' },
//       { status: 400 }
//     );
//   }

//   const floorNum = Number(floor);
//   if (isNaN(floorNum) || floorNum < 1 || floorNum > 100) {
//     return NextResponse.json(
//       { success: false, error: 'Floor must be 1-100' },
//       { status: 400 }
//     );
//   }

//   const validStatuses = ['available', 'occupied', 'maintenance'] as const;
//   type StatusType = typeof validStatuses[number];
//   if (!validStatuses.includes(status as StatusType)) {
//     return NextResponse.json(
//       { success: false, error: 'Invalid status' },
//       { status: 400 }
//     );
//   }

//   const createData: RoomCreateData = {
//     roomNumber: roomNumber.trim(),
//     roomPrice: roomPrice.trim(),
//     categoryId: categoryId ? Number(categoryId) : undefined,
//     status: status as StatusType,
//     floor: floorNum,
//     viewTypeId: viewTypeId ? Number(viewTypeId) : undefined,
//     amenityIds: amenityIds?.length ? amenityIds.map(Number).filter(n => !isNaN(n)) : undefined,
//   };

//   const result = await createRoomService(createData);
//   if (!result.success) {
//     return NextResponse.json({ success: false, error: result.error }, { status: 400 });
//   }

//   return NextResponse.json(
//     { success: true, data: result.data, message: 'Room created' },
//     { status: 201 }
//   );
// }
