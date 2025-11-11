'use client';

export function AccountLocked() {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center">
      <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <h3 className="text-lg font-semibold mb-2">Account Temporarily Locked</h3>
      <p className="text-red-600">
        For security reasons, your account has been locked due to multiple failed login attempts. 
        Please try again in 15 minutes or contact system administrator.
      </p>
    </div>
  );
}