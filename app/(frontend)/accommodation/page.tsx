// app/accommodations/page.tsx
import Image from 'next/image';
import { Star, Users, MapPin, Wifi, Car, Coffee } from 'lucide-react';
import Link from 'next/link';

export default function Accommodation() {
  const roomCategories = [
    {
      id: 1,
      name: 'Deluxe Suite',
      description: 'Spacious suite with king bed, private balcony, and ocean view',
      price: 25000,
      maxOccupancy: 2,
      image: '/images/rooms/image.jpg',
      amenities: ['WiFi', 'Parking', 'Breakfast', 'Mini Bar'],
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Family Room',
      description: 'Perfect for families with two queen beds and extra space',
      price: 18000,
      maxOccupancy: 4,
      image: '/images/rooms/image2.jpg',
      amenities: ['WiFi', 'Parking', 'Kids Menu', 'Crib Available'],
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Standard Room',
      description: 'Cozy and comfortable with modern amenities that make the stay very special',
      price: 12000,
      maxOccupancy: 2,
      image: '/images/rooms/image3.jpg',
      amenities: ['WiFi', 'Parking', 'Room Service'],
      rating: 4.4,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/frontend/bg_01.jpeg"
              alt="Sixty Four Hotel - Limuru"
              fill
              className="object-cover"
              priority
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-60" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Our Accommodation
              </h1>
              <p className="text-xl leading-relaxed drop-shadow-md">
                Experience comfort and luxury in every stay
              </p>
            </div>
          </div>
        </section>

        {/* Room Categories */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomCategories.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-64">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                    KSh {room.price.toLocaleString()}/night
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{room.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{room.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{room.description}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.map((amenity) => {
                      const Icon = {
                        WiFi: Wifi,
                        Parking: Car,
                        Breakfast: Coffee,
                        'Mini Bar': Coffee,
                        'Kids Menu': Coffee,
                        'Crib Available': Users,
                      }[amenity] || Wifi;
                      return (
                        <span
                          key={amenity}
                          className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          <Icon className="w-3 h-3" />
                          {amenity}
                        </span>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span className="text-sm">Up to {room.maxOccupancy} guests</span>
                    </div>
                    <Link 
                      href={`/room-details`}
                     className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-pink-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Stay?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact our reservations team to check availability and make your booking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+254700000000"
                className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Call +254 700 000 000
              </a>
              <a
                href="mailto:reservations@hotel.com"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}