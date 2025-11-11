// File: components/frontend/home-sections/hero/hero-background.tsx
// Purpose: This handles all right-side visuals as layered elements in an absolute-positioned div spanning the full hero. Use CSS for sun ellipse (div with bg-#FFFEFB, border-radius 50%, size ~300x300px, positioned top-right). CSS radial gradient for haze (div with the provided background, size larger ~600px, centered on sun, opacity blended). Then <Image> for sunglare_overlay_01.webp (positioned top-right aligned to sun's visible edge, opacity ~0.7 for translucency, extending left/down). <Image> for palm_tree_01.webp (below sun, slightly left, under flare z-index). <Image> for building_sketch_01.webp (far right, aligned with navbar right edge, partially obscuring sun). All images use Next Image with priority=true for hero, sizes for responsiveness, loading=eager. Positions use Tailwind absolute with top/right/left/bottom percentages for flexibility. Z-index: haze lowest, sun next, palm, flare, building highest.

import Image from 'next/image';

export default function HeroBackground() {
  return (
    <div className="relative w-full h-full">
      {/* Haze: CSS radial gradient, large and faded */}
      <div
        className="absolute top-[-40%] right-[-3%] w-[800px] h-[800px] opacity-80"
        style={{
          background: `
            radial-gradient(
            circle at center, 
            rgba(255, 249, 199, 1)     0%,
            rgba(255, 249, 199, 0.98)  5%,
            rgba(255, 220, 180, 0.92) 15%,
            rgba(255, 182, 193, 0.75) 30%,
            rgba(177, 156, 217, 0.45) 50%,
            rgba(177, 156, 217, 0.20) 70%,
            rgba(177, 156, 217, 0.05) 85%,
            rgba(177, 156, 217, 0.01) 95%,
            rgba(177, 156, 217, 0)   100%)`,
            filter: 'blur(40px)', // This is the magic: feathers the edge pixels
            transform: 'translateZ(0)', // Hardware acceleration
        }}
      />

      {/* Sun: CSS ellipse */}
      <div
        className="absolute top-[17%] right-[49%] w-[138px] h-[138px] rounded-full"
        style={{ backgroundColor: '#FFFEFB' }}
      />

      {/* Palm Tree: Image below sun, under flare */}
      <Image
        src="/images/home/hero/palm_tree_01.webp"
        alt="Palm Tree"
        width={100}
        height={350}
        className="absolute top-[44%] right-[55%] z-10"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Sun Glare Overlay: Image aligned to sun's right-top, extending left/down */}
      <Image
        src="/images/home/hero/sunglare_overlay_01.webp"
        alt="Sun Glare"
        width={400}
        height={400}
        className="absolute top-[28%] right-[53%] z-20"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Building: Far right, obscuring part of sun */}
      <Image
        src="/images/home/hero/building_sketch_01.webp"
        alt="Building Sketch"
        width={400}
        height={600}
        className="absolute top-[5%] right-[5%] z-30"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}