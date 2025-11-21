// components/frontend/pages/pages-cta.tsx
import { MapPin } from 'lucide-react';

interface PagesCtaProps {
  title?: string;
  subtitle?: string;
  bgColor?: string;
}

export default function PagesCta({
  title = "Ready to Book Your Stay?",
  subtitle = "Contact our reservations team to check availability and make your booking",
  bgColor = "bg-pink-600",
}: PagesCtaProps) {
  return (
    <section className={`${bgColor} py-16`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">{subtitle}</p>
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
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors"
          >
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}