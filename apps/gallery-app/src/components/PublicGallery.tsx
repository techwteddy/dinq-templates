'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import LoadingSpinner from './LoadingSpinner';
import SharedGallery from './SharedGallery';
import UserAvatar from './UserAvatar';
import AuthForm from './AuthForm';
import PublicUserProfileModal from './PublicUserProfileModal';
import { User } from '../types';

export default function PublicGallery() {
  const { user, userProfile, signOut, loading, profileLoading } = useAuth();
  const router = useRouter();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPublicProfileModal, setShowPublicProfileModal] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      // Redirect to dashboard if user is authenticated
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleUserClick = (clickedUser: User) => {
    setSelectedUser(clickedUser);
    setShowPublicProfileModal(true);
  };

  const closePublicProfileModal = () => {
    setShowPublicProfileModal(false);
    setSelectedUser(null);
  };

  const handleLoginClick = () => {
    setShowAuthForm(true);
  };

  const closeAuthForm = () => {
    setShowAuthForm(false);
  };

  const handleUploadClick = () => {
    if (user) {
      // Redirect to dashboard for upload functionality
      router.push('/dashboard');
    } else {
      handleLoginClick();
    }
  };

  if (showAuthForm) {
    return <AuthForm onBack={closeAuthForm} />;
  }

  const displayName = userProfile?.username || userProfile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/Gallery Logo.svg" 
                alt="Gallery Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                The Gallery
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {profileLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <div className="flex items-center space-x-1 sm:space-x-2 hover:bg-gray-800/50 rounded-lg p-1 sm:p-2">
                        <UserAvatar 
                          username={displayName} 
                          avatarUrl={userProfile?.avatar_url}
                          size="sm" 
                        />
                        <span className="text-gray-300 text-xs sm:text-sm hidden sm:inline">
                          {displayName}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={signOut}
                    className="text-red-400 hover:text-red-300 px-2 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors border border-red-700 hover:border-red-600 bg-red-900/20 hover:bg-red-900/40"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Community Gallery
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore amazing images shared by our community. {!user && 'Sign in to upload your own images!'}
          </p>
        </div>

        {/* Gallery Content */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
          <SharedGallery 
            onUserClick={handleUserClick} 
            onUploadClick={handleUploadClick}
          />
        </div>
      </main>

      {/* Public User Profile Modal */}
      <PublicUserProfileModal
        isOpen={showPublicProfileModal}
        onClose={closePublicProfileModal}
        user={selectedUser}
      />
    </div>
  );
}
