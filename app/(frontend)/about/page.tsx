// app/about/page.tsx
import Image from 'next/image';
import { Hotel, Users, Award, Heart, Leaf, Clock } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: Hotel, label: 'Rooms', value: '85+' },
    { icon: Users, label: 'Happy Guests', value: '10,000+' },
    { icon: Award, label: 'Awards Won', value: '12' },
    { icon: Clock, label: 'Years of Service', value: '15+' },
  ];

  const team = [
    {
      name: 'Sarah Kimani',
      role: 'General Manager',
      image: '/images/team/sarah.jpg',
      bio: 'With over 20 years in hospitality, Sarah leads with warmth and precision.',
    },
    {
      name: 'James Otieno',
      role: 'Head Chef',
      image: '/images/team/james.jpg',
      bio: 'Master of fusion cuisine, blending local flavors with international flair.',
    },
    {
      name: 'Amina Hassan',
      role: 'Guest Experience Director',
      image: '/images/team/amina.jpg',
      bio: 'Dedicated to making every guest feel at home from the moment they arrive.',
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        
        <section className="relative h-96 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/frontend/bg_02.jpeg"
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
                Welcome to Sixty Four
              </h1>
              <p className="text-xl leading-relaxed drop-shadow-md">
                Where luxury meets tranquility in the heart of Limuru town
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Founded in (year), <span className="font-semibold text-emerald-700">Sixty Four</span> was born from a simple dream: to create a sanctuary where travelers could escape, recharge, and feel truly cared for.
                </p>
                <p>
                  What started as a humble boutique hotel has grown into an urban oasis, consistently ranked among the top luxury stays in Limuru.
                </p>
                <p>
                  We believe hospitality is an art — one that combines impeccable service, thoughtful design, and genuine human connection.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              {/* <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                alt="Serenity Heights Hotel"
                fill
                className="object-cover"
                priority
              /> */}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-emerald-900 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-4 bg-white bg-opacity-20 rounded-full">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-emerald-100">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Genuine Care', desc: 'We treat every guest like family' },
              { icon: Leaf, title: 'Sustainability', desc: 'Committed to eco-friendly practices' },
              { icon: Award, title: 'Excellence', desc: 'Striving for perfection in every detail' },
            ].map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-emerald-100 rounded-full">
                      <Icon className="w-8 h-8 text-emerald-700" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
              <p className="text-xl text-gray-600">The hearts behind the hospitality</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64 bg-gradient-to-br from-emerald-100 to-teal-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32" />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-emerald-700 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-emerald-700 to-teal-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Experience Sixty Four Hotel
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join us for an unforgettable stay where every detail is crafted with care
            </p>
            <a
              href="/accommodations"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Our Rooms
            </a>
          </div>
        </section>
      </div>
    </>
  );
}