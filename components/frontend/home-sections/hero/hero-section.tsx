// File: components/frontend/home-sections/hero/hero-section.tsx
// Purpose: This is the top-level component for the hero section. It composes HeroBackground and HeroContent in a responsive layout. Use a section tag with full viewport height (h-screen), relative positioning for overflows, and a container div with max-width and padding. On desktop: flex row with left (content) and right (background visuals). On mobile: flex col, content first, visuals below scaled. Pass props from config to HeroContent. Use cn from lib/utils/cn.ts for class merging if needed (implement it if not present).

import HeroBackground from './hero-background';
import HeroContent from './hero-content';
import { cn } from '@/lib/utils/cn'; // For conditional classes

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonColor: string;
}

export default function HeroSection(props: HeroSectionProps) {
  return (
    <section className="relative h-screen overflow-hidden bg-white">
      <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between">
        {/* Left: Content */}
        <div className="w-full md:w-1/2 z-10 flex flex-col justify-center space-y-4 py-8 md:py-0">
          <HeroContent {...props} />
        </div>

        {/* Right: Background visuals, but actually full-width for overflows */}
        <div className={cn(
          'absolute inset-0 md:relative md:w-1/2 h-full',
          'pointer-events-none' // Prevent interaction with bg elements
        )}>
          <HeroBackground />
        </div>
      </div>
    </section>
  );
}