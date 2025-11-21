// components/frontend/pages/rooms-grid.tsx
import Image from 'next/image';
import Link from 'next/link';
import { PublicRoom } from '@/types/public/public-rooms';

interface RoomsGridProps {
  rooms: PublicRoom[];
  categoryName: string;
}

export default function RoomsGrid({ rooms, categoryName }: RoomsGridProps) {
  if (rooms.length === 0) {
    return (
      <section className="py-24 text-center">
        <p className="text-xl text-gray-600">
          No rooms available in {categoryName} at the moment.
        </p>
      </section>
    );
  }

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <Link
            key={room.id}
            href={`/accommodation/${room.categorySlug}/${room.id}`}
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-64 bg-gray-200">
              <Image
                src={room.primaryImageUrl}
                alt={`Room ${room.roomNumber}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                KSh {room.basePrice.toLocaleString()}/night
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Room {room.roomNumber}
              </h3>
              <p className="text-gray-600 mb-4">{categoryName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Up to {room.maxOccupancy} guests</span>
              </div>
              <div className="mt-4 text-pink-600 font-medium">View Details</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}