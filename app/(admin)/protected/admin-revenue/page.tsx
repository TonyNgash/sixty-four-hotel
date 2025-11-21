'use client';

import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { 
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

// Mock data - we'll replace this with real data later
const revenueData = {
  overview: {
    totalRevenue: 2450000,
    monthlyRevenue: 450000,
    weeklyRevenue: 125000,
    dailyRevenue: 18500,
    averageBookingValue: 28500,
    occupancyRate: 78,
  },
  monthlyTrend: [
    { month: 'Jan', revenue: 420000, bookings: 18 },
    { month: 'Feb', revenue: 380000, bookings: 16 },
    { month: 'Mar', revenue: 450000, bookings: 20 },
    { month: 'Apr', revenue: 520000, bookings: 22 },
    { month: 'May', revenue: 480000, bookings: 21 },
    { month: 'Jun', revenue: 550000, bookings: 24 },
    { month: 'Jul', revenue: 610000, bookings: 26 },
    { month: 'Aug', revenue: 580000, bookings: 25 },
    { month: 'Sep', revenue: 530000, bookings: 23 },
    { month: 'Oct', revenue: 490000, bookings: 21 },
    { month: 'Nov', revenue: 440000, bookings: 19 },
    { month: 'Dec', revenue: 480000, bookings: 20 },
  ],
  revenueByRoomType: [
    { type: 'Single Bed', revenue: 980000, percentage: 40, bookings: 35 },
    { type: 'Double Bed', revenue: 882000, percentage: 36, bookings: 31 },
    { type: 'Furnished Apartment', revenue: 588000, percentage: 24, bookings: 21 },
  ],
  recentTransactions: [
    {
      id: 1,
      bookingNumber: 'BK-001',
      customerName: 'James Mutua',
      amount: 60000,
      type: 'booking',
      status: 'completed',
      date: '2024-01-15 14:30',
      paymentMethod: 'card',
    },
    {
      id: 2,
      bookingNumber: 'BK-002',
      customerName: 'Mary Wanjiku',
      amount: 50000,
      type: 'booking',
      status: 'completed',
      date: '2024-01-18 09:15',
      paymentMethod: 'mobile',
    },
    {
      id: 3,
      bookingNumber: 'REF-001',
      customerName: 'Robert Omondi',
      amount: -15000,
      type: 'refund',
      status: 'processed',
      date: '2024-01-16 11:20',
      paymentMethod: 'card',
    },
    {
      id: 4,
      bookingNumber: 'BK-003',
      customerName: 'Grace Akinyi',
      amount: 12000,
      type: 'booking',
      status: 'completed',
      date: '2024-01-17 16:45',
      paymentMethod: 'cash',
    },
    {
      id: 5,
      bookingNumber: 'BK-004',
      customerName: 'Daniel Kibet',
      amount: 25000,
      type: 'booking',
      status: 'pending',
      date: '2024-01-19 08:30',
      paymentMethod: 'mobile',
    },
  ],
};

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  processed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

const paymentMethodColors = {
  card: 'bg-purple-100 text-purple-800',
  mobile: 'bg-blue-100 text-blue-800',
  cash: 'bg-gray-100 text-gray-800',
  bank: 'bg-green-100 text-green-800',
};

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const { overview, monthlyTrend, revenueByRoomType, recentTransactions } = revenueData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (current: number, previous: number) => {
    const trend = current - previous;
    if (trend > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    } else if (trend < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getTrendText = (current: number, previous: number) => {
    const trend = current - previous;
    const percentage = previous > 0 ? Math.abs((trend / previous) * 100).toFixed(1) : '0';
    
    if (trend > 0) {
      return `+${percentage}% from previous`;
    } else if (trend < 0) {
      return `-${percentage}% from previous`;
    }
    return 'No change';
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CurrencyDollarIcon className="h-6 w-6" />
              Revenue Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track financial performance, revenue trends, and transactions
            </p>
          </div>
          
          <div className="flex gap-2 bg-white rounded-lg border shadow-sm p-1">
            {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={cn(
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize',
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(overview.totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              <span>+12.5% from last year</span>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(overview.monthlyRevenue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              <span>+8.2% from last month</span>
            </div>
          </div>

          {/* Average Booking Value */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Booking Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(overview.averageBookingValue)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DocumentChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              <span>+5.3% from last month</span>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {overview.occupancyRate}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <ArrowUpIcon className="h-4 w-4" />
              <span>+4.1% from last month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Room Type */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue by Room Type
            </h3>
            <div className="space-y-4">
              {revenueByRoomType.map((roomType, index) => (
                <div key={roomType.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          '#3B82F6', 
                          '#10B981', 
                          '#8B5CF6'
                        ][index % 3]
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {roomType.type}
                      </div>
                      <div className="text-xs text-gray-500">
                        {roomType.bookings} bookings
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(roomType.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {roomType.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Revenue Trend */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Revenue Trend
            </h3>
            <div className="space-y-3">
              {monthlyTrend.slice(-6).map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">
                    {month.month}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      {month.bookings} bookings
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(month.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.bookingNumber}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {transaction.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.customerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={cn(
                        'text-sm font-semibold',
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize',
                        paymentMethodColors[transaction.paymentMethod as keyof typeof paymentMethodColors]
                      )}>
                        {transaction.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize',
                        statusColors[transaction.status as keyof typeof statusColors]
                      )}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}