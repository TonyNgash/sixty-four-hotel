'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ViewTypeFormData {
  name: string;
  description: string;
}

interface ViewTypeFormProps {
  onSubmit: (viewTypeData: ViewTypeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: ViewTypeFormData;
  error?: string | null;  // ← ADD THIS PROP
  mode?: 'create' | 'edit';  // ← ALSO ADD MODE PROP FOR CONSISTENCY
}

export function ViewTypeForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialData,
  error,  // ← ADD ERROR PROP
  mode = 'create'  // ← ADD MODE PROP
}: ViewTypeFormProps) {
  const [formData, setFormData] = useState<ViewTypeFormData>(
    initialData || {
      name: '',
      description: '',
    }
  );

   const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    // Basic client-side validation
    if (!formData.name.trim()) {
      setFormError('View type name is required');
      return;
    }

    onSubmit(formData);
  };
  const displayError = error || formError;
  // Common view type suggestions
  const commonViewTypes = [
    { value: 'garden', label: 'Garden View', description: 'Overlooking hotel gardens' },
    { value: 'pool', label: 'Pool View', description: 'Facing the swimming pool' },
    { value: 'ocean', label: 'Ocean View', description: 'Direct view of the ocean' },
    { value: 'mountain', label: 'Mountain View', description: 'Scenic mountain landscape' },
    { value: 'city', label: 'City View', description: 'Urban city skyline' },
    { value: 'courtyard', label: 'Courtyard View', description: 'Internal hotel courtyard' },
    { value: 'beach', label: 'Beach View', description: 'Direct beach access view' },
    { value: 'forest', label: 'Forest View', description: 'Lush forest surroundings' },
  ];

  const handleQuickSelect = (viewType: typeof commonViewTypes[0]) => {
    setFormData({
      name: viewType.label,
      description: viewType.description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Add Error Message Display - SIMILAR TO AMENITY FORM */}
      {displayError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{displayError}</p>
        </div>
      )}
      {/* Quick Select Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select Common Views
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
          {commonViewTypes.map((viewType) => (
            <button
              key={viewType.value}
              type="button"
              onClick={() => handleQuickSelect(viewType)}
              className={cn(
                "p-2 text-left border rounded text-sm transition-all",
                formData.name === viewType.label 
                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className="font-medium">{viewType.label}</div>
              <div className="text-xs text-gray-500 truncate">{viewType.description}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Click to quickly fill common view types
        </p>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          View Type Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Ocean View, Garden View"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe what guests can expect from this view..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {mode === 'edit' ? 'Updating...' : 'Adding...'}  
            </>
          ) : (
            mode === 'edit' ? 'Update View Type' : 'Add View Type'  
          )}
        </button>
      </div>
    </form>
  );
}