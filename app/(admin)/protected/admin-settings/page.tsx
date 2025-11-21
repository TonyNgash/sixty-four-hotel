'use client';

import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { 
  Cog6ToothIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CloudArrowDownIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

// Mock settings data
const initialSettings = {
  hotel: {
    name: 'Sixty Four Luxury Hotel',
    email: 'info@sixtyfourhotel.com',
    phone: '+254 700 000 000',
    address: '64 Luxury Street, Nairobi, Kenya',
    currency: 'KES',
    timezone: 'Africa/Nairobi',
    checkInTime: '14:00',
    checkOutTime: '11:00',
  },
  booking: {
    minStay: 1,
    maxStay: 30,
    advanceBooking: 365,
    cancellationHours: 48,
    requireDeposit: true,
    depositPercentage: 20,
  },
  payment: {
    acceptCard: true,
    acceptMobile: true,
    acceptCash: true,
    taxRate: 16,
    serviceCharge: 10,
  },
  notifications: {
    emailBookings: true,
    emailCancellations: true,
    smsConfirmations: true,
    lowStockAlerts: true,
    dailyReports: true,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState<'hotel' | 'booking' | 'payment' | 'notifications' | 'security'>('hotel');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // In real implementation, this would save to your backend
  };

  const handleInputChange = (category: keyof typeof settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      }
    }));
  };

  const tabs = [
    { id: 'hotel', name: 'Hotel Info', icon: BuildingLibraryIcon },
    { id: 'booking', name: 'Booking Rules', icon: DocumentTextIcon },
    { id: 'payment', name: 'Payment', icon: CreditCardIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Cog6ToothIcon className="h-6 w-6" />
              Hotel Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage hotel configuration, policies, and system preferences
            </p>
          </div>
          
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <CloudArrowDownIcon className="h-4 w-4" />
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors',
                isSaving 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors',
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border shadow-sm">
              {/* Hotel Information */}
              {activeTab === 'hotel' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BuildingLibraryIcon className="h-5 w-5" />
                    Hotel Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hotel Name
                      </label>
                      <input
                        type="text"
                        value={settings.hotel.name}
                        onChange={(e) => handleInputChange('hotel', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.hotel.email}
                        onChange={(e) => handleInputChange('hotel', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.hotel.phone}
                        onChange={(e) => handleInputChange('hotel', 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.hotel.currency}
                        onChange={(e) => handleInputChange('hotel', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="KES">Kenyan Shilling (KES)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={settings.hotel.address}
                        onChange={(e) => handleInputChange('hotel', 'address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Time
                      </label>
                      <input
                        type="time"
                        value={settings.hotel.checkInTime}
                        onChange={(e) => handleInputChange('hotel', 'checkInTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Time
                      </label>
                      <input
                        type="time"
                        value={settings.hotel.checkOutTime}
                        onChange={(e) => handleInputChange('hotel', 'checkOutTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.hotel.timezone}
                        onChange={(e) => handleInputChange('hotel', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Rules */}
              {activeTab === 'booking' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5" />
                    Booking Rules & Policies
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Stay (nights)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.booking.minStay}
                        onChange={(e) => handleInputChange('booking', 'minStay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Stay (nights)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.booking.maxStay}
                        onChange={(e) => handleInputChange('booking', 'maxStay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advance Booking (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.booking.advanceBooking}
                        onChange={(e) => handleInputChange('booking', 'advanceBooking', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cancellation Notice (hours)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.booking.cancellationHours}
                        onChange={(e) => handleInputChange('booking', 'cancellationHours', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Require Deposit
                        </label>
                        <p className="text-sm text-gray-500">
                          Require a deposit at time of booking
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('booking', 'requireDeposit', !settings.booking.requireDeposit)}
                        className={cn(
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                          settings.booking.requireDeposit ? 'bg-blue-600' : 'bg-gray-200'
                        )}
                      >
                        <span
                          className={cn(
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            settings.booking.requireDeposit ? 'translate-x-5' : 'translate-x-0'
                          )}
                        />
                      </button>
                    </div>

                    {settings.booking.requireDeposit && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deposit Percentage
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.booking.depositPercentage}
                            onChange={(e) => handleInputChange('booking', 'depositPercentage', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-sm font-medium text-gray-700 w-12">
                            {settings.booking.depositPercentage}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5" />
                    Payment Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Accept Credit/Debit Cards
                        </label>
                        <p className="text-sm text-gray-500">
                          Allow customers to pay with cards
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('payment', 'acceptCard', !settings.payment.acceptCard)}
                        className={cn(
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                          settings.payment.acceptCard ? 'bg-blue-600' : 'bg-gray-200'
                        )}
                      >
                        <span
                          className={cn(
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            settings.payment.acceptCard ? 'translate-x-5' : 'translate-x-0'
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Accept Mobile Money
                        </label>
                        <p className="text-sm text-gray-500">
                          Allow M-Pesa and other mobile payments
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('payment', 'acceptMobile', !settings.payment.acceptMobile)}
                        className={cn(
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                          settings.payment.acceptMobile ? 'bg-blue-600' : 'bg-gray-200'
                        )}
                      >
                        <span
                          className={cn(
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            settings.payment.acceptMobile ? 'translate-x-5' : 'translate-x-0'
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Accept Cash Payments
                        </label>
                        <p className="text-sm text-gray-500">
                          Allow customers to pay with cash on arrival
                        </p>
                      </div>
                      <button
                        onClick={() => handleInputChange('payment', 'acceptCash', !settings.payment.acceptCash)}
                        className={cn(
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                          settings.payment.acceptCash ? 'bg-blue-600' : 'bg-gray-200'
                        )}
                      >
                        <span
                          className={cn(
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            settings.payment.acceptCash ? 'translate-x-5' : 'translate-x-0'
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.payment.taxRate}
                        onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Charge (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.payment.serviceCharge}
                        onChange={(e) => handleInputChange('payment', 'serviceCharge', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BellIcon className="h-5 w-5" />
                    Notification Preferences
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'emailBookings', label: 'Email for New Bookings', description: 'Receive email notifications for new reservations' },
                      { key: 'emailCancellations', label: 'Email for Cancellations', description: 'Receive email notifications for booking cancellations' },
                      { key: 'smsConfirmations', label: 'SMS Confirmations', description: 'Send SMS confirmations to customers' },
                      { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Get alerts when room availability is low' },
                      { key: 'dailyReports', label: 'Daily Reports', description: 'Receive daily summary reports via email' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {item.label}
                          </label>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleInputChange('notifications', item.key, !settings.notifications[item.key as keyof typeof settings.notifications])}
                          className={cn(
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                            settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                              settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-5' : 'translate-x-0'
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5" />
                    Security Settings
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="text-sm font-medium text-blue-800">
                            Security Status: Excellent
                          </h3>
                          <p className="text-sm text-blue-600 mt-1">
                            All security measures are properly configured and active.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option value={60} selected>60 minutes</option>
                          <option>120 minutes</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Policy
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Standard (8+ characters)</option>
                          <option selected>Strong (12+ characters with complexity)</option>
                          <option>Very Strong (16+ characters with complexity)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your admin account
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Login Activity
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 text-center">
                          Last login: Today at 14:30 from Nairobi, Kenya
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}