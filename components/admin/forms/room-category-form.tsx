'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

interface RoomCategoryFormData {
  name: string;
  description: string;
  basePrice: string;
  maxOccupancy: string;
  featuredImage?: File;
  featuredImageUrl?: string;
}

interface RoomCategoryFormProps {
  onSubmit: (roomData: RoomCategoryFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: RoomCategoryFormData;
  error?: string | null;
  mode?: 'create' | 'edit';
  isLoading?: boolean;
}

export function RoomCategoryForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialData,
  error,
  mode = 'create',
  isLoading = false
}: RoomCategoryFormProps) {
  const [formData, setFormData] = useState<RoomCategoryFormData>({
    name: '',
    description: '',
    basePrice: '',
    maxOccupancy: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.featuredImageUrl) {
        setImagePreview(initialData.featuredImageUrl);
      }
    }
  }, [initialData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size must be less than 5MB');
      return;
    }

    setFormError(null);
    setFormData(prev => ({ ...prev, featuredImage: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: undefined, featuredImageUrl: undefined }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic client-side validation
    if (!formData.name.trim()) {
      setFormError('Category name is required');
      return;
    }

    if (!formData.basePrice || Number(formData.basePrice) <= 0) {
      setFormError('Base price must be a positive number');
      return;
    }

    if (!formData.maxOccupancy || Number(formData.maxOccupancy) < 1) {
      setFormError('Max occupancy must be at least 1');
      return;
    }

    onSubmit(formData);
  };

  const displayError = error || formError;

  // Show loading state while initial data is being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Loading category data...</p>
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

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Deluxe Suite, Single Bed"
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
          placeholder="Describe this room category..."
          disabled={isSubmitting}
        />
      </div>

      {/* Base Price and Max Occupancy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-2">
            Base Price (KSh) *
          </label>
          <input
            type="number"
            id="basePrice"
            required
            min="0"
            step="100"
            value={formData.basePrice}
            onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 12000"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="maxOccupancy" className="block text-sm font-medium text-gray-700 mb-2">
            Max Occupancy *
          </label>
          <input
            type="number"
            id="maxOccupancy"
            required
            min="1"
            max="20"
            value={formData.maxOccupancy}
            onChange={(e) => setFormData(prev => ({ ...prev, maxOccupancy: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 2"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Category Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Image
        </label>
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <div className="relative inline-block">
              <div className="h-32 w-32 relative rounded-lg border border-gray-300 overflow-hidden">
                <Image 
                  src={imagePreview} 
                  alt="Category preview" 
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority={false}
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isSubmitting}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* File Upload Area */}
        <div className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors relative",
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"
        )}>
          <div className="flex flex-col items-center justify-center">
            <PlusIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload category image
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to 5MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isSubmitting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
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
            mode === 'edit' ? 'Update Category' : 'Add Category'
          )}
        </button>
      </div>
    </form>
  );
}