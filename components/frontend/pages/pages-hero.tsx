// components/frontend/pages/pages-hero.tsx
import Image from 'next/image';

interface PagesHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export default function PagesHero({ title, subtitle, backgroundImage }: PagesHeroProps) {
  return (
    <section className="relative h-96 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-60" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="text-white max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl leading-relaxed drop-shadow-md">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}