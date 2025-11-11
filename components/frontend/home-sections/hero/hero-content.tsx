// File: components/frontend/home-sections/hero/hero-content.tsx
// Purpose: This renders the left-side text stack and button. Use h1 for title with Playfair Display font (className="font-playfair"), p for subtitle and description with Montserrat (font-montserrat). Button uses Tailwind for pink bg (#EB1B69), white text, rounded. All responsive: larger text on desktop, centered on mobile. Space-y for vertical spacing.

interface HeroContentProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonColor: string;
}

export default function HeroContent({ title, subtitle, description, buttonText, buttonColor }: HeroContentProps) {
  return (
    <div className="text-left md:text-left space-y-4">
      <h1 className="text-6xl md:text-8xl font-playfair font-bold text-black">{title}</h1>
      <h2 className="text-3xl md:text-4xl font-montserrat text-gray-800">{subtitle}</h2>
      <p className="text-lg md:text-xl font-montserrat text-gray-600 max-w-md">{description}</p>
      <button
        className="px-6 py-3 rounded-md text-white font-montserrat font-semibold"
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>
    </div>
  );
}