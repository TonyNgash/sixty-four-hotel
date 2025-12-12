// app/(frontend)/(pages)/accommodation/[slug]/[roomId]/page.tsx
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getRoomDetailById } from '@/lib/services/public/rooms-service';
import RoomGallery from '@/components/frontend/pages/room-gallery';
import RoomBookingCta from '@/components/frontend/pages/room-booking-cta';
import RoomHero from '@/components/frontend/pages/room-hero';
import PagesCta from '@/components/frontend/pages/pages-cta';

interface Params {
  slug: string;
  roomId: string;
}

interface RoomDetailPageProps{
  params: Params;
}

export const revalidate = 3600;

// 

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {

  const awaitedParams = await params;
  const  roomId  = awaitedParams.roomId;
  const room = await getRoomDetailById(Number(roomId));

  
  
  const parentPath = `/accommodation/${awaitedParams.slug}`;

  if (!room) notFound();

  return (
    <>
      <RoomHero
        title={`Room ${room.roomNumber}`}
        subtitle={room.categoryName}
        backgroundImage={room.primaryImageUrl}
        backLink={parentPath}
      />

      <section className="py-16 container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Room</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{room.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'Max Occupancy', value: `${room.maxOccupancy} guests` },
                { label: 'View', value: room.view },
              ].map((item) => (
                <div key={item.label} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-amber-600 font-semibold mb-2">{item.label}</div>
                  <div className="text-xl font-bold text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity.name}
                    className="group relative flex items-center gap-3 bg-amber-50 px-5 py-4 rounded-xl hover:bg-amber-100 transition-all duration-300 cursor-default"
                  >
                    {/* The Star of the Show: The Emoji */}
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {amenity.icon || ''}
                    </span>

                    {/* The Name */}
                    <span className="font-medium text-gray-800">
                      {amenity.name}
                    </span>

                    {/* Optional: Hover Tooltip with Description */}
                    {amenity.description && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {amenity.description}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-8 border-transparent border-t-gray-900" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <RoomBookingCta 
            price={room.roomPrice} 
            roomId={room.id} 
            roomNumber={room.roomNumber}
            roomCategory={room.categoryName}
            roomFloor={room.roomFloor} />
        </div>
      </section>

      <RoomGallery images={room.gallery} roomName={`Room ${room.roomNumber}`} />

      <PagesCta />
    </>
  );
}