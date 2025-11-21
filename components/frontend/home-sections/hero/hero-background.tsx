// File: components/frontend/home-sections/hero/hero-background.tsx
// Purpose: This handles all right-side visuals as layered elements in an absolute-positioned div spanning the full hero. Use CSS for sun ellipse (div with bg-#FFFEFB, border-radius 50%, size ~300x300px, positioned top-right). CSS radial gradient for haze (div with the provided background, size larger ~600px, centered on sun, opacity blended). Then <Image> for sunglare_overlay_01.webp (positioned top-right aligned to sun's visible edge, opacity ~0.7 for translucency, extending left/down). <Image> for palm_tree_01.webp (below sun, slightly left, under flare z-index). <Image> for building_sketch_01.webp (far right, aligned with navbar right edge, partially obscuring sun). All images use Next Image with priority=true for hero, sizes for responsiveness, loading=eager. Positions use Tailwind absolute with top/right/left/bottom percentages for flexibility. Z-index: haze lowest, sun next, palm, flare, building highest.


// File: components/frontend/home-sections/hero/hero-background.tsx
// Clean, minimal responsive version using ONLY Tailwind md: prefixes
// - Mobile (< md): All visuals 50% smaller (halved widths/heights)
// - Desktop (≥ md): ZERO changes — exact original sizes, positions, styles
// - Positions: Kept original on desktop; tweaked slightly on mobile to avoid heavy overlay on text (pushed down ~20-30% vertically, anchored right for "right-side" feel)
//   - Why tweaks? Halving sizes makes them float too high/right on tall mobile screens; adjustments ensure they cluster nicely below text while preserving design vibe
//   - Building: Starts at top-[30%] (pushes down to mid-screen)
//   - Sun/Glare: Shifted down to align behind building top
//   - Palm: Lowered to building base
//   - Haze: Scaled but kept offset for glow without cutoff
// - No wrappers, no scale(), no cn() — pure Tailwind for reliability
// - Images: Use object-contain to prevent distortion; updated sizes= for better optimization
// - Test this: Desktop unchanged; mobile smaller + repositioned for clean, non-intrusive visuals

import Image from 'next/image';

export default function HeroBackground() {
  return (
    <div className="
    relative 
    w-full h-full
    md:w-full md:h-full
    lg:w-full lg:h-full
    ">
      {/* Haze: 50% smaller on mobile, slight position tweak to center glow */}
      <div
        className="
        absolute 
        top-[10%] right-[-50%] 
        w-[600px] h-[600px] 
        md:top-[-30%] md:right-[-35%] 
        md:w-[800px] md:h-[800px] 
        lg:top-[-40%] lg:right-[-3%] 
        lg:w-[800px] lg:h-[800px] 
        opacity-80"
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
            filter: 'blur(40px)', // Kept same — blur scales naturally
            transform: 'translateZ(0)',
        }}
      />

      {/* Sun: 50% smaller on mobile, pushed down to mid-screen */}
      <div
        className="
        absolute 
        top-[45%] right-[25%] 
        w-[69px] h-[69px] 
        md:top-[35%] md:right-[60%]
        md:w-[90px] md:h-[90px] 
        lg:top-[20%] lg:right-[48%]
        lg:w-[138px] lg:h-[138px] 
        rounded-full
        "
        style={{ backgroundColor: '#FFFEFB' }}
      />

      {/* Sun Glare: 50% smaller on mobile, aligned to sun */}
      <Image
        src="/images/home/hero/sunglare_overlay_01.webp"
        alt="Sun Glare"
        width={400}
        height={400}
        className="
        absolute 
        top-[50%] right-[28%] 
        w-[200px] h-[200px] 
        md:top-[44%] md:right-[60%] 
        md:w-[400px] md:h-[400px] 
        lg:top-[32%] lg:right-[48%] 
        lg:w-[400px] lg:h-[400px] 
        z-1 object-contain
        "
        priority
        sizes="(max-width: 768px) 50vw, 50vw"
      />

      {/* Building: 50% smaller on mobile, pushed down for visibility below text */}
      <Image
        src="/images/home/hero/building_sketch_01.webp"
        alt="Building Sketch"
        width={400}
        height={600}
        className="
        absolute 
        top-[38%] right-[-8%] 
        w-[200px] h-[300px] 
        md:top-[18%] md:right-[-5%]
        md:w-[350px] md:h-[550px] 
        lg:top-[5%] lg:right-[28px]
        lg:w-[400px] lg:h-[600px] 
        z-30 object-contain"
        priority
        sizes="(max-width: 768px) 50vw, 50vw"
      />

      {/* Palm Tree: 50% smaller on mobile, lowered to base */}
      <Image
        src="/images/home/hero/palm_tree_01.webp"
        alt="Palm Tree"
        width={100} // Max intrinsic for optimization (desktop max)
        height={350}
        className="
        absolute 
        top-[54%] right-[33%] 
        w-[53px] h-[173px] 
        md:top-[50%] md:right-[68%]
        md:w-[100px] md:h-[350px] 
        lg:top-[45%] lg:w-[100px] 
        lg:h-[350px] 
        z-10 object-contain"
        priority
        sizes="(max-width: 768px) 50vw, 50vw"
      />

      

      
    </div>
  );
}