// app/contact/page.tsx
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Send } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = {
    name: 'Sixty Four Hotel',
    address: 'Limuru Town, Kiambu County, Kenya',
    phone: '+254 700 640 064',
    email: 'reservations@sixtyfourhotel.co.ke',
    hours: 'Open 24 hours, 7 days a week',
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/frontend/bg_01.jpeg"
              alt="Sixty Four Hotel - Limuru"
              fill
              className="object-cover"
              priority
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-60" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Get in Touch
              </h1>
              <p className="text-xl leading-relaxed drop-shadow-md">
                We’d love to hear from you. Reach out to <span className="font-semibold">Sixty Four Hotel</span> — your home away from home in Limuru.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info + Map */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Visit Us in Limuru</h2>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {contactInfo.address}
                    </p>
                    <a
                      href="https://maps.google.com/?q=Sixty+Four+Hotel+Limuru"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-medium mt-2 transition-colors"
                    >
                      View on Google Maps
                      <Send className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                    <Phone className="w-7 h-7 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Phone</h3>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                      className="text-gray-700 hover:text-amber-700 font-medium transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                    <Mail className="w-7 h-7 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Email</h3>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-700 hover:text-amber-700 font-medium transition-colors break-all"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="w-7 h-7 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">We’re Open</h3>
                    <p className="text-gray-700 font-medium">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {[
                    { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com/sixtyfourhotel' },
                    { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com/sixtyfourhotel' },
                    { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com/sixtyfourhotel' },
                  ].map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors group"
                    >
                      <Icon className="w-6 h-6 text-amber-700 group-hover:text-amber-800" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-96 lg:h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                title="Sixty Four Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.789!2d36.642!3d-1.108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f4e5f5e5f5e5f%3A0x5e5f5e5f5e5f5e5f!2sLimuru%20Town!5e0!3m2!1sen!2ske!4v1712345678901!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                <p className="text-xl text-gray-700">
                  Whether it’s a booking inquiry or feedback — we’re here to help.
                </p>
              </div>

              <form className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Booking Inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                    placeholder="How can we assist you today?"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-amber-700 to-orange-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your Limuru Escape Awaits
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Just 30 minutes from Nairobi, Sixty Four Hotel offers peace, luxury, and authentic Kenyan hospitality.
            </p>
            <a
              href="/accommodations"
              className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
            >
              Explore Rooms
            </a>
          </div>
        </section>
      </div>
    </>
  );
}