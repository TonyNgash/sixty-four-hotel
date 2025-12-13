// app/(customer)/login/page.tsx
'use client';


import { useState, useEffect } from 'react'; // Make sure useEffect is imported
import { useRouter } from 'next/navigation'; // Make sure useRouter is imported
import { useCustomerAuthContext } from '@/components/customer/auth/customer-auth-provider'; // Make sure this is imported
import { ROUTES } from '@/lib/constants/routes';
import { Loader2, Smartphone } from 'lucide-react';

// type LoginStage = 'email' | 'otp';
type LoginStage = 'phone' | 'otp';

interface LoginFormData {
  phone: string;
}

export default function CustomerLoginPage() {
  const [stage, setStage] = useState<LoginStage>('phone');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [testOtp, setTestOtp] = useState('');
  const [formData, setFormData] = useState<LoginFormData>({ phone: '' });
  const { user } = useCustomerAuthContext(); // This is where you get the auth state
  const { requestOtp, verifyOtp } = useCustomerAuthContext();
  
  const router = useRouter();

  useEffect(() => {
    // If the user is already logged in, redirect them to the dashboard
    if (!isLoading && user) {
      router.push(ROUTES.customer.dashboard);
    }
  }, [user, isLoading, router]); // Dependency array

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({...prev,[field]: value}));
    setError('');
  };

  const handlePhoneSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const fullPhone = formData.phone;

    const result = await requestOtp(fullPhone);
    
    if (result.success) {
      setStage('otp');
      setTestOtp(result.otp ?? '');
      setSuccessMessage('OTP sent successfully! Check the console for the code.');
    } else {
      setError(result.error || 'Failed to send OTP');
    }
    setIsLoading(false);
  }

  const handleEmailSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await requestOtp(email);
    
    if (result.success) {
      setStage('otp');
      setTestOtp(result.otp ?? '');
      setSuccessMessage('OTP sent successfully! Check the console for the code.');
    } else {
      setError(result.error || 'Failed to send OTP');
    }
    
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await verifyOtp(formData.phone, otp);
    
    if (result.success) {
      // The user state is already updated in the context by the verifyOtp function.
      // We can now safely navigate. The dashboard page will see the updated user state immediately.
      router.push(ROUTES.customer.dashboard);
    } else {
      setError(result.error || 'Invalid OTP code');
    }
    
    setIsLoading(false);
  };

  const handleBackToEmail = (): void => {
    setStage('phone');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-6 h-6 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Login</h1>
        <p className="text-gray-600 mt-2">
          {stage === 'phone' 
            ? 'Enter your phone number to receive an OTP' 
            : 'Enter the 4-digit OTP sent to your phone'
          }
        </p>
      </div>

      {stage === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            {/* <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your phone number"
            /> */}
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

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !formData.phone}
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              4-digit OTP Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
              placeholder="0000"
            />
          </div>

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleBackToEmail}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 4}
              className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Verify OTP
            </button>
          </div>
        </form>
      )}

      {testOtp && (
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Testing Mode:</strong> 
          Use this otp for now: <span className="font-mono bg-white px-2 py-1 rounded border border-gray-300">{testOtp}</span>
        </p>
      </div>
      )}
      {/* Error message */}
      {/* {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )} */}
      
    </div>
  );
}