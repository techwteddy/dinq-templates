// Utility functions to fetch network logos from Supabase storage

const SUPABASE_URL = 'https://hvhaavxjbujkpvbvftkj.supabase.co';
const STORAGE_BUCKET = 'logos';

/**
 * Get network logo URL from Supabase storage
 * @param networkName - The name of the network
 * @returns Promise<string> - The logo URL or placeholder URL
 */
export const getNetworkLogoFromSupabase = async (networkName: string): Promise<string> => {
  try {
    // Clean the network name for file naming
    const cleanName = networkName
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
    
    // Try different file extensions
    const extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    
    for (const ext of extensions) {
      const logoUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/logos/${cleanName}.${ext}`;
      
      // Check if the file exists by making a HEAD request
      const response = await fetch(logoUrl, { method: 'HEAD' });
      if (response.ok) {
        return logoUrl;
      }
    }
    
    // If no logo found, return placeholder
    return '/logos/placeholder.png';
  } catch (error) {
    console.error('Error fetching network logo:', error);
    return '/logos/placeholder.png';
  }
};

/**
 * Get network logo URL with fallback to local storage
 * @param networkName - The name of the network
 * @param localLogoPath - Optional local logo path
 * @returns Promise<string> - The logo URL
 */
export const getNetworkLogo = async (
  networkName: string, 
  localLogoPath?: string
): Promise<string> => {
  // If local logo path is provided, use it
  if (localLogoPath) {
    return localLogoPath;
  }
  
  // Try to fetch from Supabase
  return await getNetworkLogoFromSupabase(networkName);
};

/**
 * Batch fetch multiple network logos
 * @param networkNames - Array of network names
 * @returns Promise<Record<string, string>> - Object with network names as keys and logo URLs as values
 */
export const getNetworkLogosBatch = async (
  networkNames: string[]
): Promise<Record<string, string>> => {
  const logoPromises = networkNames.map(async (name) => {
    const logoUrl = await getNetworkLogoFromSupabase(name);
    return { name, logoUrl };
  });
  
  const results = await Promise.all(logoPromises);
  
  return results.reduce((acc, { name, logoUrl }) => {
    acc[name] = logoUrl;
    return acc;
  }, {} as Record<string, string>);
}; 