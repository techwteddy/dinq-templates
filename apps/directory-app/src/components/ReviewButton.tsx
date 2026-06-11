"use client";

import { useState, useEffect } from 'react';
import ReviewModal from './ReviewModal';

interface ReviewButtonProps {
  networkName: string;
  networkSlug: string;
  className?: string;
}

export default function ReviewButton({ networkName, networkSlug, className }: ReviewButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      if (event.detail.networkSlug === networkSlug) {
        setIsModalOpen(true);
      }
    };

    window.addEventListener('openReviewModal', handleOpenModal as EventListener);
    
    return () => {
      window.removeEventListener('openReviewModal', handleOpenModal as EventListener);
    };
  }, [networkSlug]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitted = () => {
    // Refresh the page or update reviews
    window.location.reload();
  };

  return (
    <>
      <button 
        className={className ? className : "inline-flex items-center px-6 py-2 bg-gradient-to-r from-[#bfa14a] to-[#e6c77c] hover:from-[#e6c77c] hover:to-[#bfa14a] text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-sm"}
        onClick={() => setIsModalOpen(true)}
      >
        Write Review
      </button>
      <ReviewModal
        open={isModalOpen}
        onClose={handleCloseModal}
        networkName={networkName}
        networkSlug={networkSlug}
        onSubmitted={handleSubmitted}
      />
    </>
  );
} 