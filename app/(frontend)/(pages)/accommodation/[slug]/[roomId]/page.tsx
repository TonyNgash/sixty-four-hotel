// app/(frontend)/(pages)/accommodation/[slug]/[roomId]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Users, MapPin } from 'lucide-react';
import { getRoomDetailById } from '@/lib/services/public/rooms-service';
import RoomGallery from '@/components/frontend/pages/room-gallery';
import RoomBookingCta from '@/components/frontend/pages/room-booking-cta';
import PagesHero from '@/components/frontend/pages/pages-hero';
import PagesCta from '@/components/frontend/pages/pages-cta';

interface Params {
  roomId: string;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Params }) {
  const room = await getRoomDetailById(Number(params.roomId));
  if (!room) return { title: 'Room Not Found' };
  return {
    title: `Room ${room.roomNumber} - ${room.categoryName} | SixtyFour Hotel`,
    description: room.description,
  };
}

export default async function RoomDetailPage({ params }: { params: Params }) {
  const room = await getRoomDetailById(Number(params.roomId));

  if (!room) notFound();

  return (
    <>
      <PagesHero
        title={`Room ${room.roomNumber}`}
        subtitle={room.categoryName}
        backgroundImage={room.primaryImageUrl}
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
                { label: 'Room Size', value: room.size ?? '45 m²' },
                { label: 'Bed Type', value: room.bedType ?? 'King Bed' },
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-lg">
                    <div className="w-5 h-5 bg-amber-700 rounded" />
                    <span className="font-medium text-gray-800">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <RoomBookingCta price={room.basePrice} roomId={room.id} />
        </div>
      </section>

      <RoomGallery images={room.gallery} roomName={`Room ${room.roomNumber}`} />

      <PagesCta />
    </>
  );
}