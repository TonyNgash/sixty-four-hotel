'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

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
            {/* Main Image */}
            <div className="relative h-96 md:h-screen max-h-screen rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={images[currentIndex]}
                alt={`${roomName} - Image ${currentIndex + 1}`}
                fill
                className="object-cover"
              />

              {/* EXPAND BUTTON — Now says "make it big!" */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="View full size"
              >
                <Maximize2 className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`flex-shrink-0 relative h-20 w-32 rounded-lg overflow-hidden transition-all ${
                      i === currentIndex ? 'ring-4 ring-amber-600 ring-offset-2' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LIGHTBOX — Now with visible, beautiful controls */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <Image 
              src={images[currentIndex]} 
              alt={`${roomName} - Full view`}
              width={1400} 
              height={900} 
              className="max-w-full max-h-full object-contain"
            />

            {/* Close button — visible and classy */}
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 right-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-4 rounded-full transition-all"
              aria-label="Close"
            >
              <X className="w-8 h-8 text-white drop-shadow-lg" />
            </button>

            {/* Nav buttons — big, visible, luxurious */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-5 rounded-full transition-all"
                >
                  <ChevronLeft className="w-10 h-10 text-white drop-shadow-lg" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-5 rounded-full transition-all"
                >
                  <ChevronRight className="w-10 h-10 text-white drop-shadow-lg" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}