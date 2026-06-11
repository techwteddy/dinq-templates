'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Image, User } from '../types';
import UserAvatar from './UserAvatar';
import LoadingSpinner from './LoadingSpinner';

interface PublicUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function PublicUserProfileModal({ isOpen, onClose, user }: PublicUserProfileModalProps) {
  const [userImages, setUserImages] = useState<Image[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserImages = async () => {
    if (!user) return;

    try {
      setImagesLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserImages(data || []);
    } catch (error: any) {
      console.error('Error fetching user images:', error);
      setError(error.message);
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchUserImages();
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const username = user.username || user.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <UserAvatar 
              username={username} 
              avatarUrl={user.avatar_url}
              size="lg" 
              className="mb-4" 
            />
            <h3 className="text-2xl font-bold text-white mb-2">{username}</h3>
            {user.full_name && user.full_name !== username && (
              <p className="text-gray-400 text-sm mb-2">{user.full_name}</p>
            )}
            {user.created_at && (
              <div className="text-gray-400 text-xs mt-2">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </div>
            )}
            <div className="text-gray-400 text-xs mt-1">
              {userImages.length} image{userImages.length !== 1 ? 's' : ''} uploaded
            </div>
          </div>

          {/* User Gallery */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{username}'s Gallery</h4>
            </div>

            {imagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800/50 text-red-200 p-4 rounded-md">
                Error loading images: {error}
              </div>
            ) : userImages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No images uploaded yet
                </div>
                <p className="text-gray-500">
                  {username} hasn't shared any images yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {userImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square relative overflow-hidden rounded-lg bg-gray-800 group hover:scale-105 transition-transform duration-200 cursor-pointer"
                  >
                    <img
                      src={image.url}
                      alt={image.original_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="text-white text-center p-2">
                        <div className="text-xs font-medium mb-1 truncate">
                          {image.original_name}
                        </div>
                        <div className="text-xs text-gray-300">
                          {new Date(image.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
