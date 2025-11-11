'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import { useRoomCategories } from '@/hooks/use-room-categories';
import { useViewTypes } from '@/hooks/use-view-types';
import { useAmenities } from '@/hooks/use-amenities';
import type { RoomCategory, ViewType, Amenity } from '@/types/database';

export interface RoomFormData {
  roomNumber: string;
  categoryId?: number;
  floor: string;
  viewTypeId?: number;
  status: 'available' | 'occupied' | 'maintenance';
  amenityIds: number[];
  images: File[];
}

interface RoomFormProps {
  onSubmit: (roomData: RoomFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: RoomFormData;
  error?: string | null;
  mode?: 'create' | 'edit';
}

export function RoomForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialData,
  error,
  mode = 'create'
}: RoomFormProps) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useRoomCategories();
  const { viewTypes, loading: viewTypesLoading, error: viewTypesError } = useViewTypes();
  const { amenities, loading: amenitiesLoading, error: amenitiesError } = useAmenities();

  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: '',
    categoryId: undefined,
    floor: '',
    viewTypeId: undefined,
    status: 'available',
    amenityIds: [],
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Note: For edit mode with existing images, we'd need to handle image URLs differently
    }
  }, [initialData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        newErrors.push(`Invalid file type: ${file.name}. Please select image files only.`);
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        newErrors.push(`File too large: ${file.name}. Maximum size is 10MB.`);
        return;
      }

      // Validate total number of images
      if (formData.images.length + validFiles.length >= 10) {
        newErrors.push('Maximum 10 images allowed');
        return;
      }

      validFiles.push(file);
    });

    if (newErrors.length > 0) {
      setFormError(newErrors[0]); // Show first error
      return;
    }

    setFormError(null);

    // Create previews for all valid files
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...validFiles] 
    }));

    // Reset input to allow selecting same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAmenityToggle = (amenityId: number) => {
    setFormData(prev => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter(id => id !== amenityId)
        : [...prev.amenityIds, amenityId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic client-side validation
    if (!formData.roomNumber.trim()) {
      setFormError('Room number is required');
      return;
    }

    if (!formData.categoryId) {
      setFormError('Category is required');
      return;
    }

    if (!formData.floor.trim()) {
      setFormError('Floor is required');
      return;
    }

    if (parseInt(formData.floor) < 1 || parseInt(formData.floor) > 20) {
      setFormError('Floor must be between 1 and 20');
      return;
    }

    // Image validation - required for new rooms
    if (mode === 'create' && formData.images.length === 0) {
      setFormError('At least one room image is required');
      return;
    }

    onSubmit(formData);
  };

  const displayError = error || formError || categoriesError || viewTypesError || amenitiesError;

  // Loading state while fetching data
  if (categoriesLoading || viewTypesLoading || amenitiesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Loading form data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {displayError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{displayError}</p>
        </div>
      )}

      {/* Room Number */}
      <div>
        <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Room Number *
        </label>
        <input
          type="text"
          id="roomNumber"
          required
          value={formData.roomNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 101, 202"
          disabled={isSubmitting}
        />
      </div>

      {/* Category and Floor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            required
            value={formData.categoryId || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              categoryId: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">
            Floor *
          </label>
          <input
            type="number"
            id="floor"
            required
            min="1"
            max="20"
            value={formData.floor}
            onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Floor number"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* View Type and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="viewType" className="block text-sm font-medium text-gray-700 mb-2">
            View Type
          </label>
          <select
            id="viewType"
            value={formData.viewTypeId || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              viewTypeId: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select View Type</option>
            {viewTypes.map((viewType) => (
              <option key={viewType.id} value={viewType.id}>
                {viewType.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              status: e.target.value as RoomFormData['status'] 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenities.map((amenity) => (
            <label key={amenity.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.amenityIds.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-700">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Room Images Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Images {mode === 'create' && '*'}
        </label>
        
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Selected images ({imagePreviews.length}/10)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="h-24 w-full relative rounded-lg border border-gray-300 overflow-hidden">
                    <Image 
                      src={preview} 
                      alt={`Room image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isSubmitting}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {formData.images[index]?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Area */}
        <div className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors relative",
          isSubmitting ? "opacity-50 cursor-not-allowed" : "border-gray-300 hover:border-gray-400 cursor-pointer"
        )}>
          <div className="flex flex-col items-center justify-center">
            <PlusIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload room images
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to 10MB each (max 10 images)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isSubmitting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
        
        {/* Helper text for edit mode */}
        {mode === 'edit' && formData.images.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">
            No new images selected. Existing images will be preserved.
          </p>
        )}
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
            mode === 'edit' ? 'Update Room' : 'Add Room'
          )}
        </button>
      </div>
    </form>
  );
}