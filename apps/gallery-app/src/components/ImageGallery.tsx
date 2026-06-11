'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';
import LoadingSpinner from './LoadingSpinner';
import { Image } from '../types';

export default function ImageGallery() {
  const { user } = useAuth();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setImages(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: string, filename: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery-images')
        .remove([filename]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        throw dbError;
      }

      // Update local state
      setImages(images.filter(img => img.id !== imageId));
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800/50 text-red-200 p-4 rounded-md">
        Error loading images: {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">
          No images uploaded yet
        </div>
        <p className="text-gray-500">
          Upload your first image to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800/50 overflow-hidden group hover:border-gray-700/50 transition-all duration-200 cursor-pointer"
        >
          <div className="aspect-square relative overflow-hidden">
            <img
              src={image.url}
              alt={image.title || image.original_name || 'Gallery image'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                onClick={() => deleteImage(image.id, image.filename)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                title="Delete image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-3">
            <p className="text-white text-sm font-medium truncate">
              {image.title || 'Untitled'}
            </p>
            
            <p className="text-gray-500 text-xs mt-1">
              {new Date(image.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
