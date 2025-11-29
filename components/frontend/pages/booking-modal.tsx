'use client';

import { useState, useTransition } from 'react';
import { X, Calendar, Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns/format';
import { createBookingAction } from '@/app/(frontend)/actions/create-booking';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
  roomNumber: string;
  pricePerNight: number;
}

interface BookingFormData {
  checkIn: string;
  checkOut: string;
  fullName: string;
  phone: string;
  email: string;
}

export default function BookingModal({ isOpen, onClose, roomId, roomNumber, pricePerNight }: BookingModalProps) {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<'form' | 'waiting' | 'success' | 'error'>('form');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: '',
    checkOut: '',
    fullName: '',
    phone: '',
    email: '',
  });

  if (!isOpen) return null;

  const nights = formData.checkIn && formData.checkOut 
    ? Math.max(1, Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))) 
    : 0;
  const total = nights * pricePerNight;

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.checkIn || !formData.checkOut || !formData.fullName || !formData.phone || !formData.email) {
      setError('Please fill all fields');
      return false;
    }

    if (!formData.phone.match(/^254[17]\d{8}$/)) {
      setError('Phone must be in format 2547... or 2541...');
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    startTransition(async () => {
      setError('');
      setStage('waiting');

      const result = await createBookingAction({
        roomId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        totalAmount: total,
      });

      if (result.success) {
        // Simulate payment processing delay
        setTimeout(() => {
          setStage('success');
        }, 3000);
      } else {
        setError(result.error || 'Something went wrong');
        setStage('error');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-pink-400 bg-opacity-20 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        {stage === 'form' && (
          <>
            <h2 className="text-2xl font-bold mb-6">Complete Your Booking</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]} 
                  value={formData.checkIn} 
                  onChange={(e) => handleInputChange('checkIn', e.target.value)} 
                  className="w-full border rounded-lg px-4 py-3" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <input 
                  type="date" 
                  min={formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : ''} 
                  value={formData.checkOut} 
                  onChange={(e) => handleInputChange('checkOut', e.target.value)} 
                  className="w-full border rounded-lg px-4 py-3" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName} 
                  onChange={(e) => handleInputChange('fullName', e.target.value)} 
                  placeholder="John Doe" 
                  className="w-full border rounded-lg px-4 py-3" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  placeholder="john@example.com" 
                  className="w-full border rounded-lg px-4 py-3" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone (M-Pesa)</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))} 
                  placeholder="254712345678" 
                  className="w-full border rounded-lg px-4 py-3" 
                />
              </div>

              {nights > 0 && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex justify-between font-semibold">
                    <span>{nights} night{nights > 1 ? 's' : ''} × KSh {pricePerNight.toLocaleString()}</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={isPending || !formData.checkIn || !formData.checkOut || !formData.fullName || !formData.phone || !formData.email}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calendar className="w-5 h-5" />}
                Pay KSh {total.toLocaleString()} with M-Pesa
              </button>
            </div>
          </>
        )}

        {stage === 'waiting' && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-amber-600 animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-2">Payment Request Sent!</h3>
            <p className="text-gray-600">Check your phone and approve the M-Pesa prompt</p>
            <p className="text-sm text-gray-500 mt-2">(Simulation mode - processing...)</p>
          </div>
        )}

        {stage === 'success' && (
          <div className="text-center py-12">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h3>
            <p>Room {roomNumber} is yours from {format(new Date(formData.checkIn), 'PPP')}.</p>
            <p className="mt-4 text-sm text-gray-600">We sent confirmation to {formData.email}</p>
            <button 
              onClick={onClose}
              className="mt-6 bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700"
            >
              Close
            </button>
          </div>
        )}

        {stage === 'error' && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={() => setStage('form')} className="bg-amber-600 text-white px-8 py-3 rounded-lg">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}