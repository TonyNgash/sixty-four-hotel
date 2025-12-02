import { NextRequest, NextResponse } from 'next/server';
import { updateRoomService, getRoomByIdService, deleteRoomService } from '@/lib/services/room-service';
import type { RoomUpdateData } from '@/lib/services/room-service';
import type { ApiResponse } from '@/types/api';

interface RouteParams {
  params: {
    id: string;
  };
}

// Define valid statuses and StatusType globally within the file for proper scope
const validStatuses = ['available', 'occupied', 'maintenance'] as const;
type StatusType = typeof validStatuses[number];

type JsonUpdateBody = RoomUpdateData & {images?: File[]; imagesToKeep?: string[] };
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

/**
 * * PUT /api/rooms/[id]
* Update a room's details (including images and amenities)
*/
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const awaitedParams = await params;
  const id = parseInt(awaitedParams.id, 10);
  if (isNaN(id) || id < 1) {
    return NextResponse.json({ success: false, error: 'Invalid room ID' }, { status: 400 });
  }

  const contentType = request.headers.get('content-type') || '';
  let parsedData: Partial<RoomUpdateData> = {};
  let imageFiles: File[] = [];
  let imageUrlsToKeep: string[] | undefined = undefined;// New field for existing images

  try {
    if(contentType.includes('multipart/form-data')){
      // path 1: multipart form data client sent files
      const formData = await request.formData();
      const roomNumber = getString(formData, 'roomNumber');
      const roomPrice = getString(formData, 'roomPrice');
      const status = getString(formData, 'status');
      const floorStr = getString(formData, 'floor');
      const categoryIdStr = getString(formData, 'categoryId');
      const viewTypeIdStr = getString(formData, 'viewTypeId');
      const amenityIdStr = formData.getAll('amenityIds') as string[];

      	// NEW: Get array of existing image URLs to keep
      const imageUrlsToKeepStr = formData.getAll('imagesToKeep') as string[];

      // extract images separately 
      imageFiles = getFiles(formData, 'images');

      // setup up parsed data based on form data extraction logic
      parsedData = {
        ...(roomNumber && { roomNumber: roomNumber.trim() }),
        // roomPrice is passed as string and parsed to number in service
        ...(roomPrice && { roomPrice: roomPrice.trim() }),
        ...(status && { status: status as StatusType }),
      };

      // set the imagesToKeepArray 
      if(imageUrlsToKeepStr.length > 0){
        imageUrlsToKeep = imageUrlsToKeepStr.filter(url => url.trim() !== '');
      } else if (formData.has('imagesToKeep') && imageFiles.length === 0){
        // If the field was present but empty (e.g., removing the last image)
        imageUrlsToKeep = [];
      }

      // parse numeric fields from strings
      const floor = floorStr ? parseInt(floorStr, 10) : undefined;
      if(floor !== undefined && !isNaN(floor)) parsedData.floor = floor;

      const categoryId = categoryIdStr 
          ? categoryIdStr === 'null' ? null: parseInt(categoryIdStr, 10)
          : undefined;
      if (categoryId !== undefined) parsedData.categoryId = categoryId;

      const viewTypeId = viewTypeIdStr 
          ? viewTypeIdStr === 'null' ? null : parseInt(viewTypeIdStr, 10) 
          : undefined;
      if (viewTypeId !== undefined) parsedData.viewTypeId = viewTypeId;

      const amenityIds = amenityIdStr
          .map(id => parseInt(id, 10))
          .filter(id => !isNaN(id) && id > 0);
      if(amenityIds.length > 0) parsedData.amenityIds = amenityIds;

    } else if(contentType.includes('application/json')){
        //path 2: application/json (client send data only)
        const jsonBody: JsonUpdateBody = await request.json();
        parsedData = { ...jsonBody } as Partial<RoomUpdateData>;
        imageUrlsToKeep = jsonBody.imagesToKeep;// Assuming client sends imagesToKeep in JSON too

    }else{
        return NextResponse.json(
          {success: false, error: "Unsupported content type for PUT request"},
          {status: 400}
        );
    }

    // Check if any data was provided
    const hasData = Object.keys(parsedData).some(key => {
      const val = parsedData[key as keyof RoomUpdateData];
      return val !== undefined && val !== null;
    }) || imageFiles.length > 0 || imageUrlsToKeep !== undefined;

    if (!hasData){
      return NextResponse.json(
        {success: false, error: 'At least one field or image operation required'},
        {status: 400}
      )
    }

    // validate status
    if(parsedData.status && !validStatuses.includes(parsedData.status as StatusType)){
      return NextResponse.json(
        {success: false, error: 'Invalid status'},
        {status: 400}
      );
    }

    // final object passed to service
    const updateData: RoomUpdateData = {
      ...parsedData,
      // Only include imagesToKeep if it was explicitly defined by the client
      ...(imageUrlsToKeep !== undefined && {imageUrlsToKeep: imageUrlsToKeep}),
      ...(imageFiles.length > 0 && {images: imageFiles}),
    } as RoomUpdateData;

    // START OF NEW LOGGING BLOCK
    console.log('--- API Route Log: Room Update ---');
    console.log(`Room ID: ${id}`);
    console.log('Images received for upload:', imageFiles.length);
    // CRITICAL CHECK: What URLs did the client tell us to KEEP?
    console.log('Image URLs received to KEEP:', imageUrlsToKeep);
    console.log('--- End API Route Log ---');
    // END OF NEW LOGGING BLOCK
    
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