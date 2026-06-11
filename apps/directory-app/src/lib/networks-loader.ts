import { Network } from '@/data/networks';
import affiliateNetworksData from '@/data/affiliate-networks.json';

export interface AffiliateNetworksData {
  networks: Network[];
}

export const loadNetworksFromJSON = (): Network[] => {
  try {
    const data = affiliateNetworksData as AffiliateNetworksData;
    return data.networks || [];
  } catch (error) {
    console.error('Error loading networks from JSON:', error);
    return [];
  }
};

export const getFeaturedNetworks = (count: number = 6): Network[] => {
  const networks = loadNetworksFromJSON();
  return networks.slice(0, count);
};

export const getAllNetworks = (): Network[] => {
  return loadNetworksFromJSON();
};

export const getNetworkById = (id: string): Network | undefined => {
  const networks = loadNetworksFromJSON();
  return networks.find(network => network.id === id);
};

export const getNetworkByName = (slug: string): Network | undefined => {
  const networks = loadNetworksFromJSON();
  // Convert slug to network name format
  const networkName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return networks.find(network => 
    network.name.toLowerCase() === networkName.toLowerCase() ||
    network.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
    network.name.toLowerCase().replace(/\s+/g, '') === slug.toLowerCase()
  );
};

export const getNetworkSlug = (networkName: string): string => {
  return networkName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export const getNetworksByCategory = (category: string): Network[] => {
  const networks = loadNetworksFromJSON();
  return networks.filter(network => network.category === category);
}; 