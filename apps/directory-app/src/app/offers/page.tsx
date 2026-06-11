"use client";
import { useState, useEffect } from 'react';
import { getAllOffers } from '@/lib/offers-loader';
import { getAllNetworks } from '@/lib/networks-loader';
import OffersSection from '@/components/OffersSection';

export default function OffersPage() {
  const allOffers = getAllOffers();
  const allNetworks = getAllNetworks();

  return (
    <div className="min-h-screen bg-gray-50">
      <OffersSection offers={allOffers} networks={allNetworks} showPagination={true} />
    </div>
  );
} 