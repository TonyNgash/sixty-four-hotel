// app/book/[id]/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Users, CreditCard, Phone, Mail, ChevronRight, Check, AlertCircle, Lock, Shield } from 'lucide-react';

interface BookingData {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

const roomData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Deluxe Suite',
    price: 25000,
    image: '/images/frontend/image.jpg',
  },
  '2': {
    id: '2',
    name: 'Family Room',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
  },
  '3': {
    id: '3',
    name: 'Standard Room',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de6a421a?w=800&h=600&fit=crop',
  },
};

export default function BookingPage({ params }: { params: { id: string } }) {
  const room = roomData[params.id] || roomData['1'];
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingData>({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const nights = 1; // Static for now
  const subtotal = room.price * nights;
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              
              
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure Booking</span>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-amber-100 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between text-sm">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex items-center gap-2 ${step >= s ? 'text-amber-700' : 'text-gray-500'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step > s
                        ? 'bg-green-600 text-white'
                        : step === s
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  <span className="hidden sm:inline">
                    {s === 1 ? 'Dates & Guests' : s === 2 ? 'Your Details' : 'Payment'}
                  </span>
                </div>
              ))}
              <div className="flex-1 h-1 bg-gray-300 mx-2">
                <div className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Step 1: Dates & Guests */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Select Your Stay</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-in Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            value={booking.checkIn}
                            onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-out Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            value={booking.checkOut}
                            onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adults
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          value={booking.adults}
                          onChange={(e) => setBooking({ ...booking, adults: Number(e.target.value) })}
                        >
                          {[1, 2, 3, 4].map(n => (
                            <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Children
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          value={booking.children}
                          onChange={(e) => setBooking({ ...booking, children: Number(e.target.value) })}
                        >
                          {[0, 1, 2, 3].map(n => (
                            <option key={n} value={n}>{n} Children</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                      Continue to Details
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Step 2: Guest Details */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Your Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="John"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          value={booking.firstName}
                          onChange={(e) => setBooking({ ...booking, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          value={booking.lastName}
                          onChange={(e) => setBooking({ ...booking, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            value={booking.email}
                            onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            placeholder="+254 700 000 000"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            value={booking.phone}
                            onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g., Late check-in, dietary needs..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                        value={booking.specialRequests}
                        onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBack}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        Proceed to Payment
                        <Lock className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: M-Pesa Payment */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-10 h-10 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Pay with M-Pesa</h2>
                      <p className="text-gray-600">Secure & instant payment via your phone</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-800">M-PESA</div>
                          <div className="text-sm text-green-600">Powered by Safaricom</div>
                        </div>
                      </div>

                      <div className="space-y-4 text-center">
                        <div className="text-4xl font-bold text-gray-900">
                          KSh {total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Enter your M-Pesa PIN on your phone to complete
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-inner">
                          <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            Waiting for M-Pesa confirmation...
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-xs text-gray-600 bg-amber-50 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p>
                            You will receive an M-Pesa prompt on <strong>{booking.phone || '+254...'}</strong>. 
                            Enter your PIN to confirm. Do not close this page.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBack}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => alert('Booking confirmed! (Static demo)')}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Complete Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <div className="flex gap-4 mb-6">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                    <div className="flex items-center gap-1 text-amber-600 mt-1">
                      {/* <Star className="w-4 h-4 fill-current" /> */}
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room rate × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="font-semibold">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="font-semibold">KSh {tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-amber-600">KSh {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Free cancellation until 48h before</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>No payment needed today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Secure M-Pesa transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}