// app/accommodations/[id]/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Users, Wifi, Car, Coffee, MapPin, Calendar, X } from 'lucide-react';
import Link from 'next/link';

interface RoomDetail {
  id: string;
  name: string;
  price: number;
  rating: number;
  maxOccupancy: number;
  description: string;
  featuredImage: string;
  gallery: string[];
  amenities: string[];
  size: string;
  bedType: string;
  view: string;
}

const roomData: Record<string, RoomDetail> = {
  '1': {
    id: '1',
    name: 'Deluxe Suite',
    price: 25000,
    rating: 4.8,
    maxOccupancy: 2,
    size: '45 m²',
    bedType: 'King Bed',
    view: 'Garden & Pool View',
    description: 'Indulge in pure luxury with our Deluxe Suite. Featuring a private balcony, plush king bed, and elegant marble bathroom with rain shower and soaking tub. Perfect for couples seeking romance and relaxation.',
    featuredImage: '/images/frontend/bg_03.jpeg',
    gallery: [
      '/images/frontend/image.jpg',
      '/images/frontend/image2.jpg',
      '/images/frontend/image3.jpg',
      '/images/frontend/image4.jpg',
      '/images/frontend/image5.jpg',
    ],
    amenities: ['WiFi', 'Mini Bar', 'Room Service', 'Balcony', 'Air Conditioning', 'Safe'],
  },
  '2': {
    id: '2',
    name: 'Family Room',
    price: 18000,
    rating: 4.6,
    maxOccupancy: 4,
    size: '55 m²',
    bedType: '2 Queen Beds',
    view: 'City View',
    description: 'Spacious and comfortable, our Family Room offers two queen beds, a cozy sitting area, and child-friendly amenities. Ideal for families or small groups.',
    featuredImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a7923128d8?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de6a421a?w=1200&h=800&fit=crop',
    ],
    amenities: ['WiFi', 'Crib Available', 'Extra Bed', 'Kids Menu', 'Air Conditioning'],
  },
  '3': {
    id: '3',
    name: 'Standard Room',
    price: 12000,
    rating: 4.4,
    maxOccupancy: 2,
    size: '32 m²',
    bedType: 'Queen Bed',
    view: 'Garden View',
    description: 'Clean, modern, and comfortable. Our Standard Room provides everything you need for a restful stay with premium bedding and thoughtful touches.',
    featuredImage: 'https://images.unsplash.com/photo-1566665797739-1674de6a421a?w=1200&h=800&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de6a421a?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
    ],
    amenities: ['WiFi', 'Room Service', 'Air Conditioning', 'Work Desk'],
  },
};

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = roomData[params.id] || roomData['1'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.gallery.length) % room.gallery.length);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero with Featured Image */}
        <section className="relative h-96 md:h-screen max-h-screen overflow-hidden">
          <Image
            src={room.featuredImage}
            alt={room.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
            <div className="container mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">{room.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{room.rating}</span>
                  <span className="text-gray-300">(Excellent)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  <span>Up to {room.maxOccupancy} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  <span>{room.view}</span>
                </div>
              </div>
              <div className="mt-4 text-3xl md:text-4xl font-bold">
                KSh {room.price.toLocaleString()}<span className="text-lg font-normal text-gray-300"> / night</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Description & Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Room</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{room.description}</p>
              </div>

              {/* Room Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: 'ruler', label: 'Room Size', value: room.size },
                  { icon: 'bed', label: 'Bed Type', value: room.bedType },
                  { icon: 'users', label: 'Max Occupancy', value: `${room.maxOccupancy} guests` },
                  { icon: 'eye', label: 'View', value: room.view },
                ].map((item) => (
                  <div key={item.label} className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-amber-600 font-semibold mb-2">{item.label}</div>
                    <div className="text-xl font-bold text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map((amenity) => {
                    const Icon = {
                      'WiFi': Wifi,
                      'Mini Bar': Coffee,
                      'Room Service': Coffee,
                      'Balcony': MapPin,
                      'Air Conditioning': Wifi,
                      'Safe': Wifi,
                      'Crib Available': Users,
                      'Extra Bed': Users,
                      'Kids Menu': Coffee,
                      'Work Desk': Wifi,
                    }[amenity] || Wifi;
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-lg"
                      >
                        <Icon className="w-5 h-5 text-amber-700" />
                        <span className="font-medium text-gray-800">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Booking CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  KSh {room.price.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600"> / night</span>
                </div>
                <div className="text-sm text-gray-600 mb-6">Taxes included</div>

                <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg mb-4 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <Link href="/payment">

                  Book Room Now
                  </Link>
                  
                </button>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Free cancellation</span>
                    <span className="font-medium">Until 48h before</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakfast included</span>
                    <span className="font-medium">On request</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in</span>
                    <span className="font-medium">2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out</span>
                    <span className="font-medium">11:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Room Gallery</h2>
            
            {/* Main Gallery with Navigation */}
            <div className="relative max-w-5xl mx-auto">
              <div className="relative h-96 md:h-screen max-h-screen rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={room.gallery[currentImageIndex]}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Thumbnail Strip */}
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                {room.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 relative h-20 w-32 rounded-lg overflow-hidden transition-all ${
                      idx === currentImageIndex ? 'ring-4 ring-amber-600' : ''
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
              <Image
                src={room.gallery[currentImageIndex]}
                alt="Lightbox"
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 p-4 rounded-full backdrop-blur-sm"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 p-4 rounded-full backdrop-blur-sm"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-8 right-8 bg-white bg-opacity-20 hover:bg-opacity-40 p-3 rounded-full backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}