import fs from 'fs/promises';
import path from 'path';

export interface FileUploadResult {
  success: boolean;
  fileName?: string;
  filePath?: string;
  publicUrl?: string;
  error?: string;
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

export class FileUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}

/**
 * Default validation options for room category images
 */
const DEFAULT_IMAGE_OPTIONS: FileValidationOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
};

/**
 * Room-specific validation options (larger files allowed for room galleries)
 */
const ROOM_IMAGE_OPTIONS: FileValidationOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB - larger for room galleries
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
};

/**
 * Ensure upload directory exists
 */
async function ensureUploadDirectory(uploadDir: string): Promise<void> {
  try {
    await fs.access(uploadDir);
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

/**
 * Validate file against options
 */
function validateFile(file: File, options: FileValidationOptions = DEFAULT_IMAGE_OPTIONS): string | null {
  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    return `File size must be less than ${options.maxSize / 1024 / 1024}MB`;
  }

  // Check MIME type
  if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`;
  }

  // Check file extension
  if (options.allowedExtensions) {
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!options.allowedExtensions.includes(fileExtension)) {
      return `File extension not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`;
    }
  }

  return null;
}

/**
 * Generate unique filename to avoid duplicates
 */
function generateUniqueFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  const nameWithoutExtension = path.basename(originalName, extension);
  
  // Clean filename (remove special characters, keep it URL-safe)
  const cleanName = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const baseName = prefix ? `${prefix}-${cleanName}` : cleanName;
  return `${baseName}-${timestamp}-${randomString}${extension}`;
}

/**
 * Upload file to specified directory
 */
export async function uploadFile(
  file: File, 
  uploadDir: string, 
  options: FileValidationOptions = DEFAULT_IMAGE_OPTIONS,
  fileNamePrefix?: string
): Promise<FileUploadResult> {
  try {
    // Validate file
    const validationError = validateFile(file, options);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    // Ensure upload directory exists
    await ensureUploadDirectory(uploadDir);

    // Generate unique filename with optional prefix
    const fileName = generateUniqueFileName(file.name, fileNamePrefix);
    const filePath = path.join(uploadDir, fileName);
    const publicUrl = `/images/${path.basename(uploadDir)}/${fileName}`;

    // Convert File to Buffer for Node.js file system operations
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      fileName,
      filePath,
      publicUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
}

/**
 * Delete file from filesystem
 */
export async function deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, which is fine for deletion
      return { success: true };
    }
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file'
    };
  }
}

/**
 * Extract filename from public URL for deletion
 */
export function getFileNameFromPublicUrl(publicUrl: string): string {
  return path.basename(publicUrl);
}

/**
 * Get full file path from public URL
 */
export function getFilePathFromPublicUrl(publicUrl: string, uploadDir: string): string {
  const fileName = getFileNameFromPublicUrl(publicUrl);
  return path.join(uploadDir, fileName);
}

/**
 * Room category specific upload function
 */
export async function uploadRoomCategoryImage(file: File): Promise<FileUploadResult> {
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'categories');
  return uploadFile(file, uploadDir, DEFAULT_IMAGE_OPTIONS);
}

/**
 * Room category specific delete function
 */
export async function deleteRoomCategoryImage(publicUrl: string): Promise<{ success: boolean; error?: string }> {
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'categories');
  const filePath = getFilePathFromPublicUrl(publicUrl, uploadDir);
  return deleteFile(filePath);
}

/**
 * Room image specific upload function
 */
// export async function uploadRoomImage(file: File, roomNumber?: string): Promise<FileUploadResult> {
//   const uploadDir = path.join(process.cwd(), 'public', 'images', 'rooms');
//   const fileNamePrefix = roomNumber ? `room-${roomNumber.replace(/\s+/g, '-').toLowerCase()}` : 'room';
//   return uploadFile(file, uploadDir, ROOM_IMAGE_OPTIONS, fileNamePrefix);
// }
export async function uploadRoomImage(file: File): Promise<FileUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/room', {
    method: 'POST',
    body: formData,
  });

  const result: FileUploadResult = await response.json();
  return result;
}

/**
 * Room image specific delete function
 */
export async function deleteRoomImage(publicUrl: string): Promise<{ success: boolean; error?: string }> {
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'rooms');
  const filePath = getFilePathFromPublicUrl(publicUrl, uploadDir);
  return deleteFile(filePath);
}

/**
 * Bulk delete room images
 */
export async function deleteRoomImages(publicUrls: string[]): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  for (const publicUrl of publicUrls) {
    const result = await deleteRoomImage(publicUrl);
    if (!result.success && result.error) {
      errors.push(result.error);
    }
  }
  
  return {
    success: errors.length === 0,
    errors
  };
}