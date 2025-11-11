// // ──────────────────────────────────────────────────────────────
// // components/frontend/home-sections/night-club/sound-wave.tsx
// // ──────────────────────────────────────────────────────────────

// 'use client';

// import Image from 'next/image';

// const barHeights = [100, 200, 320, 440, 260, 350, 240, 330, 200, 130]; // px
// const barImages = [
//   '/images/home/night-club/wave-1.webp',
//   '/images/home/night-club/wave-2.webp',
//   '/images/home/night-club/wave-3.webp',
//   '/images/home/night-club/wave-4.webp',
//   '/images/home/night-club/wave-5.webp',
//   '/images/home/night-club/wave-6.webp',
//   '/images/home/night-club/wave-7.webp',
//   '/images/home/night-club/wave-8.webp',
//   '/images/home/night-club/wave-9.webp',
//   '/images/home/night-club/wave-10.webp',
// ];

// export default function SoundWave() {
//   return (
//     <div className="flex justify-center items-center gap-2 md:gap-3 px-4 flex-wrap py-8">
//       {barHeights.map((height, i) => (
//         <div
//           key={i}
//           className="group relative w-16 md:w-15 rounded-full overflow-hidden 
//             transition-all duration-300 
//             hover:border-purple-400 hover:shadow-purple-lg"
//           style={{
//             height: `${height}px`
//           }}
//         >
//           <Image
//             src={barImages[i]}
//             alt={`Club scene ${i + 1}`}
//             fill
//             className="object-cover transition-transform duration-500 group-hover:scale-110"
//             sizes="400px"
//             loading="lazy"
//           />
//         </div>
//       ))}
//     </div>
//   );
// }


// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// components/frontend/home-sections/night-club/sound-wave.tsx
// 'use client';

// import Image from 'next/image';

// const barHeights = [100, 200, 320, 440, 260, 350, 240, 330, 200, 130];
// const barImages = [
//   '/images/home/night-club/wave-1.webp',
//   '/images/home/night-club/wave-2.webp',
//   '/images/home/night-club/wave-3.webp',
//   '/images/home/night-club/wave-4.webp',
//   '/images/home/night-club/wave-5.webp',
//   '/images/home/night-club/wave-6.webp',
//   '/images/home/night-club/wave-7.webp',
//   '/images/home/night-club/wave-8.webp',
//   '/images/home/night-club/wave-9.webp',
//   '/images/home/night-club/wave-10.webp',
// ];

// export default function SoundWave() {
//   return (
//     <div className="flex justify-center items-center gap-2 md:gap-3 px-4 flex-wrap py-8">
//       {barHeights.map((height, i) => (
//         <div
//           key={i}
//           className="
//             group relative w-16 md:w-15 rounded-full overflow-hidden transition-shadow duration-300
//           "
//           style={{
//             height: `${height}px`,
//             // Bright purple drop-shadow on hover
//             boxShadow: '0 0 0 rgba(180, 58, 255, 0)',
//             transition: 'box-shadow 0.3s ease',
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.boxShadow =
//               '0 0 40px rgba(180, 58, 255, 0.8), 0 0 80px rgba(139, 0, 255, 0.5)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.boxShadow = '0 0 0 rgba(180, 58, 255, 0)';
//           }}
//         >
//           {/* Image wrapper — now safe to clip */}
//           <div className="w-full h-full rounded-full overflow-hidden">
//             <Image
//               src={barImages[i]}
//               alt={`Club scene ${i + 1}`}
//               fill
//               className="object-cover transition-transform duration-500 group-hover:scale-110"
//               sizes="500px"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// ================================================================================================
// ================================================================================================
// ================================================================================================
// ================================================================================================
// ================================================================================================




// components/frontend/home-sections/night-club/sound-wave.tsx
// 'use client';

// import Image from 'next/image';

// const barHeights = [100, 200, 320, 440, 260, 350, 240, 330, 200, 130];
// const barImages = [
//   '/images/home/night-club/wave-1.webp',
//   '/images/home/night-club/wave-2.webp',
//   '/images/home/night-club/wave-3.webp',
//   '/images/home/night-club/wave-4.webp',
//   '/images/home/night-club/wave-5.webp',
//   '/images/home/night-club/wave-6.webp',
//   '/images/home/night-club/wave-7.webp',
//   '/images/home/night-club/wave-8.webp',
//   '/images/home/night-club/wave-9.webp',
//   '/images/home/night-club/wave-10.webp',
// ];

// export default function SoundWave() {
//   return (
//     <div 
//     className="relative flex justify-center items-center gap-2 md:gap-3 px-4 py-8 flex-wrap"
//     style={{ minHeight: '440px' }} // ← FIX 1: Ensure container is tall enough
//     >
        
//       {/* ====================== GLOWING STREAK (BEHIND) ====================== */}
//       <div
//         className="absolute pointer-events-none"
//         style={{
//             top: '50%',
//             transform: 'translateY(-50%)',   // vertical center
//             left: '140px',
//             width: 'calc(80% + 10px)',
//             height: '2px',                   // explicit height
//         }}
//       >
//         {/* Sharp purple core */}
//         <div
//           className="h-full w-full"
//           style={{
//             background: 'linear-gradient(to right, transparent 0%, rgba(180,58,255,1) 10%, rgba(180,58,255,1) 90%, transparent 100%)',
//             filter: 'blur(0.5px)',
//             boxShadow: '0 0 30px rgba(180,58,255,1), 0 0 60px rgba(180,58,255,0.9)'
//           }}
//         />

//         {/* Hazy outer glow (same as hover) */}
//         <div
//           className="absolute inset-0"
//           style={{
//             background: 'radial-gradient(ellipse at center, rgba(180,58,255,0.6) 0%, rgba(139,0,255,0.2) 50%, transparent 80%)',
//             filter: 'blur(60px)',
//             transform: 'scaleY(2.6)',
//           }}
//         />
//       </div>

//       {/* ====================== BARS (FRONT) ====================== */}
//       {barHeights.map((height, i) => (
//         <div
//           key={i}
//           className="
//             group relative w-16 md:w-20 rounded-full overflow-hidden 
//             transition-shadow duration-300
//           "
//           style={{
//             height: `${height}px`,
//             boxShadow: '0 0 0 rgba(180, 58, 255, 0)',
//             transition: 'box-shadow 0.3s ease',
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.boxShadow =
//               '0 0 40px rgba(180, 58, 255, 0.8), 0 0 80px rgba(139, 0, 255, 0.5)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.boxShadow = '0 0 0 rgba(180, 58, 255, 0)';
//           }}
//         >
//           <div className="w-full h-full rounded-full overflow-hidden">
//             <Image
//               src={barImages[i]}
//               alt={`Club scene ${i + 1}`}
//               fill
//               className="object-cover transition-transform duration-500 group-hover:scale-110"
//               sizes="500px"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================
// ==========================================================================================




// components/frontend/home-sections/night-club/sound-wave.tsx
'use client';

import Image from 'next/image';

const barHeights = [100, 200, 320, 410, 260, 350, 240, 330, 200, 130];
const barImages = [
  '/images/home/night-club/wave-1.webp',
  '/images/home/night-club/wave-2.webp',
  '/images/home/night-club/wave-3.webp',
  '/images/home/night-club/wave-4.webp',
  '/images/home/night-club/wave-5.webp',
  '/images/home/night-club/wave-6.webp',
  '/images/home/night-club/wave-7.webp',
  '/images/home/night-club/wave-8.webp',
  '/images/home/night-club/wave-9.webp',
  '/images/home/night-club/wave-10.webp',
];

export default function SoundWave() {
  return (
    <div className="relative flex justify-center items-center px-4 py-8">
      {/* ====================== GLOWING STREAK (BEHIND) ====================== */}
        <div
        className="absolute pointer-events-none"
        style={{
            top: '50%',
            transform: 'translateY(-50%)',
            left: '140px',                 // keep your exact value
            width: 'calc(80% + 10px)',     // keep your exact value
            height: '2px',               // behind the bars
        }}
        >
        {/* Sharp purple core + massive drop-shadow haze */}
        <div
            className="h-full w-full"
            style={{
            background:
                'linear-gradient(to right, transparent 0%, rgba(180,58,255,1) 10%, rgba(180,58,255,1) 90%, transparent 100%)',
            filter:
                'drop-shadow(0 0 30px rgba(180,58,255,1)) ' +   // bright inner glow
                'drop-shadow(0 0 70px rgba(180,58,255,0.8)) ' + // wide middle glow
                'drop-shadow(0 0 120px rgba(139,0,255,0.6))',   // huge outer haze
            }}
        />
        </div>

      {/* ====================== BARS (FRONT) ====================== */}
      <div
        className="
          flex justify-center items-center gap-1 sm:gap-2
          w-full overflow-x-auto whitespace-nowrap
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
        "
        style={{
          // Mobile: force 10 bars in one line, shrink as needed
          // Desktop: normal spacing
          '@media (maxWidth: 640px)': {
            gap: '0.25rem',
          },
        }}
      >
        {barHeights.map((height, i) => (
          <div
            key={i}
            className="
              group relative rounded-full overflow-hidden 
              transition-shadow duration-300
              flex-shrink-0
            "
            style={{
              width: 'clamp(32px, 8vw, 64px)',   // ← auto-shrink on mobile
              height: `${height}px`,
              boxShadow: '0 0 0 rgba(180,58,255,0)',
              transition: 'box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 0 40px rgba(180,58,255,0.8), 0 0 80px rgba(139,0,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 rgba(180,58,255,0)';
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              <Image
                src={barImages[i]}
                alt={`Club scene ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 40px, 800px"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}