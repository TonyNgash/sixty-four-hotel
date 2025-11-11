'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface AmenityFormData {
  name: string;
  description: string;
  icon: string;
}

interface AmenityFormProps {
  onSubmit: (amenityData: AmenityFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: AmenityFormData;
  error?: string | null;
  mode?: 'create' | 'edit';
}

export function AmenityForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialData,
  error,
  mode = 'create'
}: AmenityFormProps) {
  const [formData, setFormData] = useState<AmenityFormData>({
    name: '',
    description: '',
    icon: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic client-side validation
    if (!formData.name.trim()) {
      setFormError('Amenity name is required');
      return;
    }

    if (!formData.icon.trim()) {
      setFormError('Please select an icon');
      return;
    }

    onSubmit(formData);
  };

  const displayError = error || formError;

  // Common amenity icons for selection
  const commonIcons = [
    { value: '📶', label: 'WiFi', emoji: '📶' },
    { value: '❄️', label: 'Air Conditioning', emoji: '❄️' },
    { value: '📺', label: 'TV', emoji: '📺' },
    { value: '🏊', label: 'Pool', emoji: '🏊' },
    { value: '💪', label: 'Gym', emoji: '💪' },
    { value: '🧖', label: 'Spa', emoji: '🧖' },
    { value: '🅿️', label: 'Parking', emoji: '🅿️' },
    { value: '🍳', label: 'Breakfast', emoji: '🍳' },
    { value: '🍽️', label: 'Restaurant', emoji: '🍽️' },
    { value: '🍸', label: 'Bar', emoji: '🍸' },
    { value: '🔔', label: 'Room Service', emoji: '🔔' },
    { value: '👕', label: 'Laundry', emoji: '👕' },
    { value: '🚿', label: 'Shower', emoji: '🚿' },
    { value: '🛁', label: 'Bathtub', emoji: '🛁' },
    { value: '☕', label: 'Coffee', emoji: '☕' },
    { value: '🧴', label: 'Toiletries', emoji: '🧴' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {displayError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{displayError}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Amenity Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Swimming Pool, Free WiFi"
          disabled={isSubmitting}
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
          placeholder="Describe this amenity..."
          disabled={isSubmitting}
        />
      </div>

      {/* Icon Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon *
        </label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
          {commonIcons.map((icon) => (
            <label 
              key={icon.value}
              className={cn(
                "flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all",
                formData.icon === icon.value 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              <input
                type="radio"
                name="icon"
                value={icon.value}
                checked={formData.icon === icon.value}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="sr-only"
                disabled={isSubmitting}
              />
              <span className="text-2xl mb-1">{icon.emoji}</span>
              <span className="text-xs text-gray-600 text-center">{icon.label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Select an emoji that represents this amenity
        </p>
      </div>

      {/* Custom Icon Input */}
      <div>
        <label htmlFor="customIcon" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Icon
        </label>
        <input
          type="text"
          id="customIcon"
          value={formData.icon}
          onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter any emoji..."
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">
          Or type any emoji directly. The selected emoji above will be overridden.
        </p>
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
            mode === 'edit' ? 'Update Amenity' : 'Add Amenity'
          )}
        </button>
      </div>
    </form>
  );
}