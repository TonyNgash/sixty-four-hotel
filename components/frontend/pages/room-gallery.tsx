// components/frontend/pages/room-gallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  if (images.length === 0) return null;

  return (
    <>
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Room Gallery</h2>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="relative h-96 md:h-screen max-h-screen rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={images[currentIndex]}
                alt={`${roomName} - Image ${currentIndex + 1}`}
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

            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`flex-shrink-0 relative h-20 w-32 rounded-lg overflow-hidden transition-all ${i === currentIndex ? 'ring-4 ring-amber-600' : ''}`}
                >
                  <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <Image src={images[currentIndex]} alt="Lightbox" width={1200} height={800} className="max-w-full max-h-full object-contain" />
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 p-4 rounded-full">
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 p-4 rounded-full">
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-8 right-8 bg-white bg-opacity-20 hover:bg-opacity-40 p-3 rounded-full">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}