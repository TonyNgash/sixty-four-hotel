import { AdminLayout } from '@/components/admin/layout/admin-layout';

export default function DashboardPage() {
  return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-gray-600">Total Rooms</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-gray-600">Active Bookings</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-gray-600">Staff Members</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">$0</div>
              <div className="text-gray-600">Today&apos;s Revenue</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-gray-600">No recent activity to display.</p>
        </div>
      </div>
  );
}