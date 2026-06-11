'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import { Image } from '../types';
import UserAvatar from './UserAvatar';
import LoadingSpinner from './LoadingSpinner';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, userProfile, profileLoading } = useAuth();
  const [userImages, setUserImages] = useState<Image[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fetchUserImages = async () => {
    if (!user) return;

    try {
      setImagesLoading(true);
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserImages(data || []);
    } catch (error) {
      console.error('Error fetching user images:', error);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleEditUsername = () => {
    setEditedUsername(username);
    setIsEditingUsername(true);
    setUpdateError(null);
  };

  const handleSaveUsername = async () => {
    if (!user || !editedUsername.trim()) return;

    setIsUpdatingUsername(true);
    setUpdateError(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({ username: editedUsername.trim() })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditingUsername(false);
      // Refresh the page to update the username everywhere
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating username:', error);
      setUpdateError(error.message);
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingUsername(false);
    setEditedUsername('');
    setUpdateError(null);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUpdateError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUpdateError('Image must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    setUpdateError(null);

    try {
      // Delete old avatar if it exists
      if (userProfile?.avatar_url) {
        const oldFileName = userProfile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('gallery-profile-images')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-profile-images')
        .getPublicUrl(filePath);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh the page to update the avatar everywhere
      window.location.reload();
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setUpdateError(error.message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleClose = () => {
    // Cancel any ongoing edit when closing the modal
    if (isEditingUsername) {
      handleCancelEdit();
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchUserImages();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const username = userProfile?.username || userProfile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">User Profile</h2>
          <button
            onClick={handleClose}
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
            {/* Avatar with upload functionality */}
            <div className="relative mb-4">
              <UserAvatar 
                username={username} 
                avatarUrl={userProfile?.avatar_url}
                size="lg" 
              />
              <label 
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 bg-gray-700 hover:bg-gray-600 rounded-full p-2 cursor-pointer transition-colors shadow-lg"
                title="Change profile picture"
              >
                <img src="/edit.svg" alt="Change avatar" className="w-3 h-3" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploadingAvatar}
                className="hidden"
              />
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
            
            {/* Username with edit functionality */}
            <div className="flex items-center gap-2 mb-2">
              {isEditingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="text-2xl font-bold text-white bg-gray-800 border border-gray-600 rounded px-2 py-1 text-center min-w-[200px]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveUsername();
                      } else if (e.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                  />
                  <button
                    onClick={handleSaveUsername}
                    disabled={isUpdatingUsername || !editedUsername.trim()}
                    className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                    title="Save changes"
                  >
                    <img src="/checkmark-thin.svg" alt="Save" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdatingUsername}
                    className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                    title="Cancel edit"
                  >
                    <img src="/cancel.svg" alt="Cancel" className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">{username}</h3>
                  <button
                    onClick={handleEditUsername}
                    className="p-1 hover:bg-gray-700 rounded transition-colors opacity-60 hover:opacity-100"
                    title="Edit username"
                  >
                    <img src="/edit.svg" alt="Edit" className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Error message */}
            {updateError && (
              <div className="text-red-400 text-sm mb-2 text-center">
                {updateError}
              </div>
            )}

            {userProfile?.full_name && userProfile.full_name !== username && (
              <p className="text-gray-400 text-sm mb-2">{userProfile.full_name}</p>
            )}
            {user?.created_at && (
              <div className="text-gray-400 text-xs mb-1">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long'
                })}
              </div>
            )}
            <div className="text-gray-400 text-xs mt-1">
              {userImages.length} image{userImages.length !== 1 ? 's' : ''} uploaded
            </div>
          </div>

          {/* User Gallery */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">My Gallery</h4>
            </div>

            {imagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : userImages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No images uploaded yet
                </div>
                <p className="text-gray-500">
                  Upload your first image to get started!
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
