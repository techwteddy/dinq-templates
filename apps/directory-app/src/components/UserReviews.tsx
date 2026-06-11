'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FiStar, FiEye, FiUser, FiFilter, FiChevronDown, FiImage, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Review {
  id: string;
  network_slug: string;
  network_name: string;
  user_name: string;
  overall_rating: number;
  ease_of_use: number;
  payment_speed: number;
  support_quality: number;
  review_text: string;
  screenshot_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  likes_count?: number;
  dislikes_count?: number;
  user_vote?: 'like' | 'dislike' | null;
}

interface UserVote {
  id: string;
  user_id: string;
  review_id: string;
  vote_type: 'like' | 'dislike';
  created_at: string;
}

interface UserReviewsProps {
  networkSlug: string;
  networkName: string;
}

type FilterType = 'all' | 'payment-proofs';
type SortType = 'recent' | 'oldest' | 'popular';

// Helper function to get or create anonymous user ID
const getAnonymousUserId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let anonymousId = localStorage.getItem('anonymous_user_id');
  if (!anonymousId) {
    anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('anonymous_user_id', anonymousId);
  }
  return anonymousId;
};

export default function UserReviews({ networkSlug, networkName }: UserReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike' | null>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 13;

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Fetch reviews with vote counts
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('network_slug', networkSlug)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          setError('Failed to load reviews');
          return;
        }

        const reviewIds = (reviewsData || []).map(r => r.id);
        let userVotesData: any[] = [];

        if (user) {
          // Fetch authenticated user votes
          const { data: authVotes, error: votesError } = await supabase
            .from('user_votes')
            .select('*')
            .in('review_id', reviewIds)
            .eq('user_id', user.id);

          if (votesError) {
            console.error('Error fetching user votes:', votesError);
          } else {
            userVotesData = authVotes || [];
          }
        } else {
          // Fetch anonymous user votes
          const anonymousId = getAnonymousUserId();
          const { data: anonVotes, error: votesError } = await supabase
            .from('user_votes')
            .select('*')
            .in('review_id', reviewIds)
            .eq('user_id', anonymousId);

          if (votesError) {
            console.error('Error fetching anonymous votes:', votesError);
          } else {
            userVotesData = anonVotes || [];
          }
        }

        // Combine reviews with user vote data
        const reviewsWithVotes = (reviewsData || []).map(review => {
          const userVote = userVotesData.find(vote => vote.review_id === review.id);
          return {
            ...review,
            likes_count: review.likes_count || 0,
            dislikes_count: review.dislikes_count || 0,
            user_vote: userVote ? userVote.vote_type : null
          };
        });

        setReviews(reviewsWithVotes);
        
        // Set user votes state
        const votesMap: Record<string, 'like' | 'dislike' | null> = {};
        userVotesData.forEach(vote => {
          votesMap[vote.review_id] = vote.vote_type;
        });
        setUserVotes(votesMap);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [networkSlug, user]);

  const updateReviewCounts = async (reviewId: string, likeChange: number, dislikeChange: number) => {
    try {
      // First get current counts
      const { data: currentReview, error: fetchError } = await supabase
        .from('reviews')
        .select('likes_count, dislikes_count')
        .eq('id', reviewId)
        .single();

      if (fetchError) {
        console.error('Error fetching current counts:', fetchError);
        return;
      }

      // Update with new counts
      const { error } = await supabase
        .from('reviews')
        .update({
          likes_count: (currentReview.likes_count || 0) + likeChange,
          dislikes_count: (currentReview.dislikes_count || 0) + dislikeChange
        })
        .eq('id', reviewId);

      if (error) {
        console.error('Error updating review counts:', error);
      }
    } catch (err) {
      console.error('Error updating counts:', err);
    }
  };

  const updateUserVote = async (reviewId: string, voteType: 'like' | 'dislike', newVote: 'like' | 'dislike' | null) => {
    try {
      const userId = user ? user.id : getAnonymousUserId();
      
      if (newVote === null) {
        // Remove vote
        const { error } = await supabase
          .from('user_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error removing vote:', error);
        }
      } else {
        // Add or update vote
        const { error } = await supabase
          .from('user_votes')
          .upsert({
            user_id: userId,
            review_id: reviewId,
            vote_type: newVote
          }, {
            onConflict: 'user_id,review_id'
          });

        if (error) {
          console.error('Error adding vote:', error);
        }
      }
    } catch (err) {
      console.error('Error updating user vote:', err);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      const currentVote = userVotes[reviewId];
      let likeChange = 0;
      let dislikeChange = 0;
      
      if (currentVote === 'like') {
        // Remove like
        likeChange = -1;
        setUserVotes(prev => ({ ...prev, [reviewId]: null }));
      } else if (currentVote === 'dislike') {
        // Switch from dislike to like
        likeChange = 1;
        dislikeChange = -1;
        setUserVotes(prev => ({ ...prev, [reviewId]: 'like' }));
      } else {
        // Add like
        likeChange = 1;
        setUserVotes(prev => ({ ...prev, [reviewId]: 'like' }));
      }
      
      // Update database
      await updateUserVote(reviewId, 'like', currentVote === 'like' ? null : 'like');
      await updateReviewCounts(reviewId, likeChange, dislikeChange);
      
      // Update local state immediately for better UX
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { 
              ...review, 
              likes_count: (review.likes_count || 0) + likeChange,
              dislikes_count: (review.dislikes_count || 0) + dislikeChange,
              user_vote: currentVote === 'like' ? null : 'like'
            }
          : review
      ));
    } catch (err) {
      console.error('Error handling like:', err);
    }
  };

  const handleDislike = async (reviewId: string) => {
    try {
      const currentVote = userVotes[reviewId];
      let likeChange = 0;
      let dislikeChange = 0;
      
      if (currentVote === 'dislike') {
        // Remove dislike
        dislikeChange = -1;
        setUserVotes(prev => ({ ...prev, [reviewId]: null }));
      } else if (currentVote === 'like') {
        // Switch from like to dislike
        likeChange = -1;
        dislikeChange = 1;
        setUserVotes(prev => ({ ...prev, [reviewId]: 'dislike' }));
      } else {
        // Add dislike
        dislikeChange = 1;
        setUserVotes(prev => ({ ...prev, [reviewId]: 'dislike' }));
      }
      
      // Update database
      await updateUserVote(reviewId, 'dislike', currentVote === 'dislike' ? null : 'dislike');
      await updateReviewCounts(reviewId, likeChange, dislikeChange);
      
      // Update local state immediately for better UX
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { 
              ...review, 
              likes_count: (review.likes_count || 0) + likeChange,
              dislikes_count: (review.dislikes_count || 0) + dislikeChange,
              user_vote: currentVote === 'dislike' ? null : 'dislike'
            }
          : review
      ));
    } catch (err) {
      console.error('Error handling dislike:', err);
    }
  };

  // Filter reviews based on selected filter
  const filteredReviews = reviews.filter(review => {
    if (filter === 'payment-proofs') {
      return review.screenshot_url && review.screenshot_url.trim() !== '';
    }
    return true;
  });

  // Sort reviews based on selected sort option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'popular':
        // Sort by likes count (descending), then by dislikes count (ascending)
        const aScore = (a.likes_count || 0) - (a.dislikes_count || 0);
        const bScore = (b.likes_count || 0) - (b.dislikes_count || 0);
        return bScore - aScore;
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  // Reset to first page when filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy, reviews.length]);

  const reviewsWithProofs = reviews.filter(review => review.screenshot_url && review.screenshot_url.trim() !== '').length;

  if (loading) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#e6c77c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 sm:py-8">
        <p className="text-red-600 text-xs sm:text-base">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
          <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 text-xs sm:text-base">Be the first to review {networkName}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between bg-gradient-to-r from-[#fef7e6] to-[#fdf4d9] rounded-xl p-2 sm:p-4 border border-[#e6c77c]">
        {/* Filter Buttons */}
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-base ${
              filter === 'all'
                ? 'bg-[#e6c77c] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-[#fef7e6] border border-[#e6c77c]'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('payment-proofs')}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-base ${
              filter === 'payment-proofs'
                ? 'bg-[#e6c77c] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-[#fef7e6] border border-[#e6c77c]'
            }`}
          >
            Payment Proofs ({reviewsWithProofs})
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-white text-gray-700 rounded-lg border border-[#e6c77c] hover:bg-[#fef7e6] transition-all duration-200 text-xs sm:text-base"
          >
            <FiFilter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>
              {sortBy === 'recent' && 'Most Recent'}
              {sortBy === 'oldest' && 'Oldest First'}
              {sortBy === 'popular' && 'Most Popular'}
            </span>
            <FiChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1 sm:mt-2 bg-white border border-[#e6c77c] rounded-lg shadow-lg z-10 min-w-[120px] sm:min-w-[160px]">
              <button
                onClick={() => { setSortBy('recent'); setShowSortDropdown(false); }}
                className={`w-full text-left px-2 sm:px-4 py-1 sm:py-2 hover:bg-[#fef7e6] transition-colors text-xs sm:text-base ${
                  sortBy === 'recent' ? 'bg-[#fef7e6] text-[#bfa14a]' : 'text-gray-700'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                className={`w-full text-left px-2 sm:px-4 py-1 sm:py-2 hover:bg-[#fef7e6] transition-colors text-xs sm:text-base ${
                  sortBy === 'oldest' ? 'bg-[#fef7e6] text-[#bfa14a]' : 'text-gray-700'
                }`}
              >
                Oldest First
              </button>
              <button
                onClick={() => { setSortBy('popular'); setShowSortDropdown(false); }}
                className={`w-full text-left px-2 sm:px-4 py-1 sm:py-2 hover:bg-[#fef7e6] transition-colors text-xs sm:text-base ${
                  sortBy === 'popular' ? 'bg-[#fef7e6] text-[#bfa14a]' : 'text-gray-700'
                }`}
              >
                Most Popular
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-2 sm:space-y-3">
        {paginatedReviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded p-2 sm:p-3 text-xs sm:text-sm w-full flex flex-col gap-1">
            {/* Header: Avatar, Name, Date, Rating */}
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">{review.user_name}</span>
                <span className="flex items-center text-[#fbbf24] text-xs sm:text-sm ml-1">
                  {Array.from({length: review.overall_rating}).map((_,i) => <FiStar key={i} className="inline w-3 h-3 sm:w-4 sm:h-4" />)}
                </span>
              </div>
              <span className="text-gray-400 text-[10px] sm:text-xs whitespace-nowrap">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>
            </div>
            {/* Stats Badges Row (compact style) */}
            <div className="flex flex-row flex-wrap gap-1 mb-1">
              <span className="inline-flex items-center bg-blue-50 text-gray-500 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full">Ease <span className="ml-1 text-[#e57373] font-bold">{review.ease_of_use}</span></span>
              <span className="inline-flex items-center bg-blue-50 text-gray-500 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full">Payment <span className="ml-1 text-[#e57373] font-bold">{review.payment_speed}</span></span>
              <span className="inline-flex items-center bg-blue-50 text-gray-500 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full">Support <span className="ml-1 text-[#e57373] font-bold">{review.support_quality}</span></span>
            </div>
            {/* Review Text */}
            <div>
              <p className="text-gray-700 text-xs sm:text-sm leading-snug">{review.review_text}</p>
            </div>
            {/* Like/Dislike Buttons */}
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => handleLike(review.id)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs sm:text-sm border transition-all duration-200 ${review.user_vote === 'like' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 border-gray-200'}`}
              >
                <FiThumbsUp className={`w-3 h-3 ${review.user_vote === 'like' ? 'text-green-600' : ''}`} />
                <span>{review.likes_count || 0}</span>
              </button>
              <button
                onClick={() => handleDislike(review.id)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs sm:text-sm border transition-all duration-200 ${review.user_vote === 'dislike' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-200'}`}
              >
                <FiThumbsDown className={`w-3 h-3 ${review.user_vote === 'dislike' ? 'text-red-600' : ''}`} />
                <span>{review.dislikes_count || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-4 sm:mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium border border-[#e6c77c] transition-all duration-200 text-xs sm:text-base ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#bfa14a] hover:bg-[#fef7e6]'}`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium text-xs sm:text-base">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium border border-[#e6c77c] transition-all duration-200 text-xs sm:text-base ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#bfa14a] hover:bg-[#fef7e6]'}`}
          >
            Next
          </button>
        </div>
      )}

      {/* No Results Message */}
      {sortedReviews.length === 0 && (
        <div className="text-center py-8">
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-[#e6c77c] to-[#bfa14a] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
            <FiFilter className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
            {filter === 'payment-proofs' ? 'No Payment Proofs Found' : 'No Reviews Found'}
          </h3>
          <p className="text-gray-600 text-xs sm:text-base">
            {filter === 'payment-proofs' 
              ? 'No reviews with payment proofs found for this filter.'
              : 'No reviews match the current filter.'
            }
          </p>
        </div>
      )}
    </div>
  );
} 