'use client';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  UsersIcon 
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

// Mock data - we'll replace this with real data later
const mockStaff = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Mwangi',
    email: 'john.mwangi@hotel.com',
    phone: '+254712345678',
    role: 'manager',
    department: 'Operations',
    status: 'active',
    joinDate: '2023-05-15',
    lastLogin: '2024-01-15 14:30',
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Kamau',
    email: 'sarah.kamau@hotel.com',
    phone: '+254723456789',
    role: 'receptionist',
    department: 'Front Desk',
    status: 'active',
    joinDate: '2023-08-22',
    lastLogin: '2024-01-15 09:15',
  },
  {
    id: 3,
    firstName: 'David',
    lastName: 'Ochieng',
    email: 'david.ochieng@hotel.com',
    phone: '+254734567890',
    role: 'housekeeping',
    department: 'Housekeeping',
    status: 'on_leave',
    joinDate: '2023-11-10',
    lastLogin: '2024-01-10 16:45',
  },
  {
    id: 4,
    firstName: 'Grace',
    lastName: 'Wambui',
    email: 'grace.wambui@hotel.com',
    phone: '+254745678901',
    role: 'chef',
    department: 'Kitchen',
    status: 'active',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-15 07:20',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  on_leave: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
};

const roleColors = {
  manager: 'bg-purple-100 text-purple-800',
  receptionist: 'bg-blue-100 text-blue-800',
  housekeeping: 'bg-orange-100 text-orange-800',
  chef: 'bg-red-100 text-red-800',
  security: 'bg-gray-100 text-gray-800',
};

export default function StaffPage() {
  const [staff, setStaff] = useState(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleStaffSelection = (staffId: number) => {
    setSelectedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const selectAllStaff = () => {
    setSelectedStaff(staff.length === selectedStaff.length ? [] : staff.map(member => member.id));
  };

  const handleDelete = () => {
    // Temporary mock delete - we'll implement real delete later
    setStaff(prev => prev.filter(member => !selectedStaff.includes(member.id)));
    setSelectedStaff([]);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UsersIcon className="h-6 w-6" />
              Staff Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage hotel staff members, roles, and permissions
            </p>
          </div>
          
          <div className="flex gap-2">
            {selectedStaff.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Selected ({selectedStaff.length})
              </button>
            )}
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-4 w-4" />
              Add Staff Member
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{staff.length}</div>
            <div className="text-gray-600 text-sm">Total Staff</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {staff.filter(s => s.status === 'active').length}
            </div>
            <div className="text-gray-600 text-sm">Active</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {staff.filter(s => s.status === 'on_leave').length}
            </div>
            <div className="text-gray-600 text-sm">On Leave</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {new Set(staff.map(s => s.department)).size}
            </div>
            <div className="text-gray-600 text-sm">Departments</div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedStaff.length === staff.length && staff.length > 0}
                      onChange={selectAllStaff}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact & Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employment
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((member) => (
                  <tr 
                    key={member.id} 
                    className={cn(
                      selectedStaff.includes(member.id) ? 'bg-blue-50' : 'hover:bg-gray-50',
                      'transition-colors'
                    )}
                  >
                    <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedStaff.includes(member.id)}
                        onChange={() => toggleStaffSelection(member.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <EnvelopeIcon className="h-4 w-4" />
                        {member.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <PhoneIcon className="h-4 w-4" />
                        {member.phone}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {member.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize',
                          roleColors[member.role as keyof typeof roleColors]
                        )}>
                          {member.role.replace('_', ' ')}
                        </span>
                        <div>
                          <span className={cn(
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize',
                            statusColors[member.status as keyof typeof statusColors]
                          )}>
                            {member.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Joined: {member.joinDate}</div>
                      <div className="text-xs text-gray-400">
                        Last login: {member.lastLogin}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <EnvelopeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedStaff([member.id]);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {staff.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first staff member.</p>
            <div className="mt-6">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="h-4 w-4" />
                Add Staff Member
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Staff Members
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedStaff.length} selected staff member(s)? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}