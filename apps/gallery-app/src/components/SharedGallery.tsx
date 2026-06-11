'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';
import LoadingSpinner from './LoadingSpinner';
import UserAvatar from './UserAvatar';
import ImageDetailModal from './ImageDetailModal';
import { Image, User } from '../types';

interface SharedGalleryProps {
  onUserClick: (user: User) => void;
  onUploadClick?: () => void;
}

export default function CommunityGallery({ onUserClick, onUploadClick }: SharedGalleryProps) {
  const { user } = useAuth();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const fetchCommunityImages = async () => {
    try {
      setLoading(true);
      
      // Fetch all images from all users for the community gallery with user profile information
      const { data, error } = await supabase
        .from('images')
        .select(`
          id,
          user_id,
          filename,
          original_name,
          url,
          size,
          mime_type,
          width,
          height,
          title,
          description,
          created_at,
          updated_at,
          user:users!inner(
            id,
            username,
            full_name,
            email,
            avatar_url,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setImages(data as any || []);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">Community Gallery</h3>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Discover images shared by the community
          </p>
        </div>
        {onUploadClick && (
          <div className="flex items-center">
            <button
              onClick={onUploadClick}
              className="bg-white hover:bg-gray-200 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
            >
              <img 
                src="/uploadFile.svg" 
                alt="Upload" 
                className="w-3 h-3 sm:w-4 sm:h-4"
              />
              <span className="hidden sm:inline">Upload Image</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            No images in the community gallery yet
          </div>
          <p className="text-gray-500">
            Be the first to upload and share your images!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => {
            const username = image.user?.username || image.user?.full_name || 'User';
            
            return (
              <div
                key={image.id}
                className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800/50 overflow-hidden group hover:border-gray-700/50 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title || image.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <div className="text-sm font-medium mb-1">
                        {image.title || "Untitled"}
                      </div>
                      <div className="text-xs text-gray-300">
                        {new Date(image.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800/50 rounded p-1 -m-1 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      image.user && onUserClick(image.user);
                    }}
                    title={`View ${username}'s profile`}
                  >
                    <UserAvatar 
                      username={username} 
                      avatarUrl={image.user?.avatar_url}
                      size="sm" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate hover:text-blue-300 transition-colors">
                        {username}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onUserClick={onUserClick}
        />
      )}
    </div>
  );
}
