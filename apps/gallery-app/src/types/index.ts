export interface Image {
  id: string;
  url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  filename: string;
  original_name: string;
  size: number;
  mime_type: string;
  width?: number;
  height?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  success: boolean;
  image?: Image;
  error?: string;
}

export interface GalleryProps {
  images: Image[];
  loading?: boolean;
  error?: string;
}

export interface ImageCardProps {
  image: Image;
  onImageClick: (image: Image) => void;
  onImageDelete?: (imageId: string) => void;
}

export interface SharedGallery {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  owner?: User;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  image_count?: number;
  cover_image_url?: string;
}

export interface SharedGalleryImage {
  id: string;
  gallery_id: string;
  image_id: string;
  image?: Image;
  created_at: string;
}

export interface SharedGalleryMember {
  id: string;
  gallery_id: string;
  user_id: string;
  user?: User;
  role: 'viewer' | 'contributor' | 'admin';
  created_at: string;
}

export interface CreateSharedGalleryRequest {
  name: string;
  description?: string;
  is_public: boolean;
}
