import { createClient } from './server'

export type UploadResult = {
  success: boolean
  url?: string
  path?: string
  error?: string
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(bucket: string, path: string, file: File): Promise<UploadResult> {
  try {
    const supabase = await createClient()

    // Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type,
    })

    if (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * Get public URL for a file
 */
export async function getPublicUrl(bucket: string, path: string): Promise<string> {
  const supabase = await createClient()

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path)

  return publicUrl
}

/**
 * Upload avatar for a user
 */
export async function uploadAvatar(userId: string, file: File): Promise<UploadResult> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
    }
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      error: 'File size must be less than 5MB.',
    }
  }

  // Generate file path
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  return uploadFile('avatars', filePath, file)
}

/**
 * Upload logo for a branch
 */
export async function uploadLogo(branchId: string, file: File): Promise<UploadResult> {
  // Validate file type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ]
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.',
    }
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      error: 'File size must be less than 5MB.',
    }
  }

  // Generate file path
  const fileExt = file.name.split('.').pop()
  const filePath = `${branchId}/logo.${fileExt}`

  return uploadFile('logos', filePath, file)
}

/**
 * Delete avatar for a user
 */
export async function deleteAvatar(userId: string, avatarPath: string): Promise<boolean> {
  return deleteFile('avatars', avatarPath)
}

/**
 * Delete logo for a branch
 */
export async function deleteLogo(branchId: string, logoPath: string): Promise<boolean> {
  return deleteFile('logos', logoPath)
}
