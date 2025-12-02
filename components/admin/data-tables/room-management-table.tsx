'use client';

import { useState, ReactNode } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

// Simplified interface - only requires id, other properties can be anything
interface BaseTableItem {
  id: number;
}

export interface Column<T extends BaseTableItem> {
  key: keyof T;
  label: string;
  sortable?: boolean;
}

interface RoomManagementTableProps<T extends BaseTableItem> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAddNew: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onBulkDelete: (selectedIds: number[]) => void;
}

export function RoomManagementTable<T extends BaseTableItem>({title, data, columns, onAddNew, onEdit, onDelete, onBulkDelete, }: RoomManagementTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(data.length === selectedItems.length ? [] : data.map(item => item.id));
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    onBulkDelete(selectedItems);
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">
            Manage {title.toLowerCase()} for your hotel
          </p>
        </div>
        
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <button  onClick={handleBulkDelete} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <TrashIcon className="h-4 w-4" />
              Delete Selected ({selectedItems.length})
            </button>
          )}
          <button onClick={onAddNew} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add New {title.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedItems.length === data.length && data.length > 0} onChange={selectAllItems} />
                </th>
                {columns.map((column) => (
                  <th  key={column.key as string} scope="col"  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr 
                  key={item.id} 
                  className={cn(
                    selectedItems.includes(item.id) ? 'bg-blue-50' : 'hover:bg-gray-50',
                    'transition-colors'
                  )}
                >
                  <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key as string} className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {/* Use type assertion since we know the data structure matches columns */}
                        {item[column.key] as ReactNode}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEdit(item)}
                        className="text-green-600 hover:text-green-900 p-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(item)}
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
      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No {title.toLowerCase()}</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new {title.slice(0, -1).toLowerCase()}.</p>
          <div className="mt-6">
            <button 
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New {title.slice(0, -1)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}