'use client';

import { useState, useTransition, useEffect, useRef } from 'react'; // Import useEffect and useRef
import { Smartphone, ChevronRight, Shield, Lock, XCircle } from 'lucide-react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns/format';
import { createBookingAction } from '@/app/(frontend)/actions/create-booking';

// ... (interfaces remain the same)
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
  roomNumber: string;
  pricePerNight: number;
  roomCategory: string;
  roomFloor: number;
}

interface BookingFormData {
  checkIn: string;
  checkOut: string;
  fullName: string;
  phone: string;
  email: string;
  roomNumber: string;
  roomCategory: string;
  roomFloor: number;
}

export default function BookingModal({ isOpen, onClose, roomId, roomNumber, roomCategory, roomFloor, pricePerNight }: BookingModalProps) {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<'form' | 'waiting' | 'success' | 'error'>('form');
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState<number | null>(null); // NEW: State to store the booking ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // NEW: Ref to store the interval ID

  const [formData, setFormData] = useState<BookingFormData>({
    // ... (formData state remains the same)
    checkIn: '',
    checkOut: '',
    fullName: '',
    phone: '',
    email: '',
    roomNumber: roomNumber,
    roomCategory: roomCategory,
    roomFloor: roomFloor,
  });

  // NEW: Polling logic using useEffect
  useEffect(() => {
    // Only start polling if we are in the 'waiting' stage and have a bookingId
    if (stage === 'waiting' && bookingId) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set up a new interval to poll for status every 5 seconds
      intervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(`/api/payments/status/${bookingId}`);
          const data = await response.json();

          if (data.success) {
            if (data.payment_status === 'paid') {
              setStage('success');
            } else if (data.payment_status === 'failed') {
              setError('Payment was cancelled or failed. Please try again.');
              setStage('error');
            }
            // If status is 'pending', do nothing and let the interval continue
          } else {
            console.error('Error polling status:', data.error);
            // Optionally, handle polling errors
          }
        } catch (err) {
          console.error('Failed to poll payment status:', err);
        }
      }, 5000); // Poll every 5 seconds
    }

    // Cleanup function: clear the interval when the component unmounts or stage changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stage, bookingId]); // Rerun effect only when stage or bookingId changes

  if (!isOpen) return null;

  // ... (nights, total, handleInputChange, validateForm functions remain the same)
  const nights = formData.checkIn && formData.checkOut 
    ? Math.max(1, Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))) 
    : 0;
  const total = nights * pricePerNight;

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = async(): Promise<boolean> => {
    if (!formData.checkIn || !formData.checkOut || !formData.fullName || !formData.phone || !formData.email) {
      setError('Please fill all fields');
      return false;
    }

    console.log('Validating full name length:', formData.fullName.length);
    if(formData.fullName.length < 2){
      setError('Full Name must be at least 2 characters long');
      return false;
    }

    const typePhoneNumber = formData.phone.replace('254', '');
    if (typePhoneNumber.length !== 9) {
      setError('Invalid Phone number');
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

  const handleSubmit = async () => {
    const validationPassed = await validateForm();
    if (!validationPassed) return;

    startTransition(async () => {
      setError('');
      setStage('waiting');

      const result = await createBookingAction({
        roomId,
        archivedRoomNumber: formData.roomNumber,
        archivedRoomCategory: formData.roomCategory, 
        archivedRoomFloor: formData.roomFloor.toString(),    
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        totalAmount: total,
      });

      if (result.success) {
        // NEW: Store the bookingId to be used for polling
        setBookingId(result.bookingId || null);
        // The setTimeout is removed. Polling will handle the stage change.
      } else {
        setError(result.error || 'Something went wrong');
        setStage('error');
      }
    });
  };

  

  // ... (The JSX return statement remains largely the same, but ensure the 'waiting' stage message is appropriate)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred translucent overlay with smooth fade */}
      <div 
        className="absolute inset-0 bg-white/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal container with smooth entrance animation */}
      <div 
        className="relative w-full max-w-md animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - positioned outside for cleaner mobile UI */}
          <button 
            onClick={onClose}
            className="absolute -top-3 -right-3 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-pink-600 transition-colors z-10"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        {/* Modal content with subtle pink accents */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Decorative pink gradient top border */}
          <div className="h-1 bg-gradient-to-r from-pink-300 via-pink-500 to-pink-300" />
          
          

          {/* Modal content with proper spacing for mobile */}
          <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
            {stage === 'form' && (
              <>
                {/* ... (form JSX remains the same) */}
                {/* Header with subtle pink accent */}
                <div className="mb-8 text-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-pink-300 to-pink-500 mx-auto mb-4 rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Complete Your Booking</h2>
                  <p className="text-gray-500 text-sm mt-2">Luxury accommodation awaits</p>
                </div>

                <div className="space-y-6">
                  {/* Date inputs with improved styling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Check-in
                        <span className="ml-1 text-xs text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]} 
                          value={formData.checkIn} 
                          onChange={(e) => handleInputChange('checkIn', e.target.value)} 
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
                        />
                        
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Check-out
                        <span className="ml-1 text-xs text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="date" 
                          min={formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : ''} 
                          value={formData.checkOut} 
                          onChange={(e) => handleInputChange('checkOut', e.target.value)} 
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                        <span className="ml-1 text-xs text-pink-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.fullName} 
                        onChange={(e) => handleInputChange('fullName', e.target.value)} 
                        placeholder="John Doe" 
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                        <span className="ml-1 text-xs text-pink-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)} 
                        placeholder="john@example.com" 
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone (M-Pesa)
                        <span className="ml-1 text-xs text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3.5 flex items-center gap-1">
                          <span className="text-sm text-gray-500">+254</span>
                          <div className="w-px h-4 bg-gray-300 mx-2" />
                        </div>
                        <input 
                          type="tel"
                          value={formData.phone.replace('254', '')} 
                          onChange={(e) =>{
                            let digits = e.target.value.replace(/\D/g, '');
                            if(digits.startsWith('0')) {
                              digits = digits.substring(1);
                            }
                            const fullNumber = '254' + digits;
                            handleInputChange('phone', fullNumber);
                          }}
                          pattern="[0-9]*"
                          inputMode='numeric'
                          placeholder="712345678" 
                          maxLength={9}
                          className="w-full border border-gray-200 rounded-xl pl-20 pr-4 py-3 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Price summary - enhanced */}
                  {nights > 0 && (
                    <div className="bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-100 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{nights} night{nights > 1 ? 's' : ''}</span>
                        <span className="text-pink-600 font-bold">KSh {pricePerNight.toLocaleString()}/night</span>
                      </div>
                      <div className="pt-3 border-t border-pink-100">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total</span>
                          <span className="text-2xl font-bold text-gray-900">KSh {total.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">Taxes and fees included</p>
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {/* Submit button - enhanced */}
                  <button
                    onClick={handleSubmit}
                    disabled={isPending || !formData.checkIn || !formData.checkOut || !formData.fullName || !formData.phone || !formData.email}
                    className="w-full bg-gradient-to-r from-pink-500 to-amber-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-3 group"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <Smartphone className="w-5 h-5" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                        </div>
                        <span>Pay KSh {total.toLocaleString()}</span>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </button>

                  {/* Trust indicators for mobile */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Secure payment</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock className="w-4 h-4 text-blue-500" />
                        <span>SSL encrypted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Waiting stage - enhanced */}
            {stage === 'waiting' && (
              <div className="text-center py-12">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-100 to-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone className="w-12 h-12 text-pink-500 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Payment Request Sent!</h3>
                <p className="text-gray-600 mb-1">Check your phone and approve the M-Pesa prompt</p>
                <p className="text-sm text-gray-500">We are waiting for confirmation...</p>
                
                {/* Animated dots for waiting effect */}
                <div className="flex justify-center gap-1 mt-6">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {/* Success stage - enhanced */}
            {stage === 'success' && (
              <div className="text-center py-12">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <div className="absolute -inset-2 border-4 border-green-200 rounded-full animate-ping" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-3">Booking Confirmed!</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
                  <p className="text-gray-800 mb-2">
                    <span className="font-semibold">Room {roomNumber}</span> is reserved for you
                  </p>
                  <p className="text-gray-600 text-sm">
                    {format(new Date(formData.checkIn), 'PPP')} → {format(new Date(formData.checkOut), 'PPP')}
                  </p>
                </div>
                <p className="text-gray-600 mb-6">
                  Confirmation sent to <span className="font-semibold text-pink-600">{formData.phone.replace('254','0')}</span>
                </p>
                <button 
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-pink-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-amber-600 transition-all duration-300 shadow-md"
                >
                  Return to Room
                </button>
              </div>
            )}

            {/* Error stage - enhanced */}
            {stage === 'error' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
                <button 
                  onClick={() => setStage('form')}
                  className="w-full bg-gradient-to-r from-pink-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-amber-600 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
          
          {/* Decorative bottom border */}
          <div className="h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300" />
        </div>
      </div>
    </div>
  );
}