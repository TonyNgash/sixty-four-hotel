'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/use-login';
import { LoginErrorAlert } from './login-error-alert';
import { AttemptWarning } from './attempt-warning';
import { AccountLocked } from './account-locked';
import { cn } from '@/lib/utils/cn';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, error, attempts, handleLogin } = useLogin();

  const isLocked = attempts >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    await handleLogin(email, password);
  };

  if (isLocked) {
    return <AccountLocked />;
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Sign in to your hotel management account
          </p>
        </div>

        <LoginErrorAlert error={error} className="mb-4" />
        <AttemptWarning attempts={attempts} className="mb-4" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                'disabled:bg-gray-50 disabled:text-gray-500',
                error && 'border-red-300'
              )}
              placeholder="admin@hotel.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                'disabled:bg-gray-50 disabled:text-gray-500',
                error && 'border-red-300'
              )}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className={cn(
              'w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:bg-gray-400 disabled:cursor-not-allowed',
              'flex items-center justify-center'
            )}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}