"use client";

import { useState } from 'react';
import { FiStar, FiTrendingUp, FiUsers, FiAward, FiMessageCircle, FiFilter } from 'react-icons/fi';

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Reviews', count: 1247 },
    { id: 'recent', label: 'Recent', count: 89 },
    { id: 'top-rated', label: 'Top Rated', count: 156 },
    { id: 'networks', label: 'Networks', count: 45 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
            Community Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover what real affiliate marketers are saying about their favorite networks. 
            Share your experiences and help others make informed decisions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-4">
              <FiStar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">1,247</h3>
            <p className="text-gray-600">Total Reviews</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto mb-4">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">892</h3>
            <p className="text-gray-600">Active Reviewers</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-4">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4.8</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl mx-auto mb-4">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">45</h3>
            <p className="text-gray-600">Networks Rated</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Reviews</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">John Doe</h3>
                <p className="text-sm text-gray-500">Verified Reviewer</p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">MaxBounty - Excellent Experience</h4>
            <p className="text-gray-600 leading-relaxed mb-4">
              "MaxBounty has been my go-to network for years. The offers are high-quality, 
              payouts are reliable, and their support team is incredibly helpful. Highly recommended!"
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>2 days ago</span>
              <span>•</span>
              <span>MaxBounty</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SM</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sarah Miller</h3>
                <p className="text-sm text-gray-500">Top Contributor</p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Ad Gain Media - Great Offers</h4>
            <p className="text-gray-600 leading-relaxed mb-4">
              "Ad Gain Media offers some of the best converting offers in the industry. 
              Their tracking is accurate and payments are always on time."
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>1 week ago</span>
              <span>•</span>
              <span>Ad Gain Media</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-amber-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
            <p className="text-xl mb-6 opacity-90">
              Help other affiliate marketers by sharing your honest review of the networks you've worked with.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg">
              <FiMessageCircle className="w-5 h-5" />
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 