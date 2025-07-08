import { useState, useEffect, useCallback } from 'react';
import type { PropertyListing } from '../types';

const STORAGE_KEY = 'marketing_property_listings';

const sampleListings: PropertyListing[] = [
  // ... (use the sampleListings array from ListingManager.tsx)
];

export const useListings = () => {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setListings(stored ? JSON.parse(stored) : sampleListings);
        setLoading(false);
      } catch (e) {
        setError('Failed to load listings');
        setLoading(false);
      }
    }, 500);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  // CRUD operations
  const createListing = useCallback(async (data: Partial<PropertyListing>) => {
    setLoading(true);
    setError(null);
    return new Promise<PropertyListing>((resolve, reject) => {
      setTimeout(() => {
        try {
          const newListing: PropertyListing = {
            ...data,
            id: `listing-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: data.status || 'draft',
            featured: data.featured || false,
            priority: data.priority || 'medium',
            portals: data.portals || {},
            seoOptimization: data.seoOptimization || { metaTitle: '', metaDescription: '', keywords: [], slug: '' },
            amenities: data.amenities || [],
            media: data.media || { images: [], videos: [], virtualTour: '', floorPlans: [] },
            agent: data.agent || { id: '', name: '', phone: '', email: '', reraNumber: '' },
            specifications: data.specifications || { bedrooms: 0, bathrooms: 0, size: 0, furnished: 'unfurnished', parking: 0, balcony: false, view: '', floor: 0, totalFloors: 0 },
            area: data.area || '',
            subArea: data.subArea || '',
            address: data.address || '',
            price: data.price || 0,
            currency: data.currency || 'AED',
            saleType: data.saleType || 'sale',
            expiresAt: data.expiresAt || '',
          } as PropertyListing;
          setListings(prev => [newListing, ...prev]);
          setLoading(false);
          resolve(newListing);
        } catch (e) {
          setError('Failed to create listing');
          setLoading(false);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const updateListing = useCallback(async (id: string, updates: Partial<PropertyListing>) => {
    setLoading(true);
    setError(null);
    return new Promise<PropertyListing | null>((resolve, reject) => {
      setTimeout(() => {
        try {
          setListings(prev => {
            const idx = prev.findIndex(l => l.id === id);
            if (idx === -1) return prev;
            const updated = { ...prev[idx], ...updates, updatedAt: new Date().toISOString() };
            const newArr = [...prev];
            newArr[idx] = updated;
            resolve(updated);
            return newArr;
          });
          setLoading(false);
        } catch (e) {
          setError('Failed to update listing');
          setLoading(false);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const deleteListing = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        try {
          setListings(prev => prev.filter(l => l.id !== id));
          setLoading(false);
          resolve(true);
        } catch (e) {
          setError('Failed to delete listing');
          setLoading(false);
          reject(e);
        }
      }, 500);
    });
  }, []);

  // Simulate real-time updates (e.g., views, inquiries)
  useEffect(() => {
    const interval = setInterval(() => {
      setListings(prev => prev.map(l => {
        if (l.status === 'active') {
          // Simulate portal views/inquiries
          const portals = { ...l.portals };
          Object.keys(portals).forEach(portal => {
            if (portals[portal].published) {
              portals[portal] = {
                ...portals[portal],
                views: portals[portal].views + Math.floor(Math.random() * 10),
                inquiries: portals[portal].inquiries + Math.floor(Math.random() * 2),
                lastUpdated: new Date().toISOString()
              };
            }
          });
          return { ...l, portals };
        }
        return l;
      }));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Performance metrics aggregation
  const getPerformance = useCallback(() => {
    return listings.reduce((acc, l) => {
      acc.totalListings++;
      acc.totalViews += Object.values(l.portals).reduce((sum, p) => sum + p.views, 0);
      acc.totalInquiries += Object.values(l.portals).reduce((sum, p) => sum + p.inquiries, 0);
      return acc;
    }, { totalListings: 0, totalViews: 0, totalInquiries: 0 });
  }, [listings]);

  // SEO optimization tracking
  const getSEOStatus = useCallback(() => {
    return listings.map(l => ({
      id: l.id,
      metaTitle: l.seoOptimization.metaTitle,
      metaDescription: l.seoOptimization.metaDescription,
      keywords: l.seoOptimization.keywords,
      slug: l.seoOptimization.slug,
      optimized: !!(l.seoOptimization.metaTitle && l.seoOptimization.metaDescription && l.seoOptimization.keywords.length && l.seoOptimization.slug)
    }));
  }, [listings]);

  // Portal publishing automation (demo)
  const publishToPortal = useCallback(async (id: string, portal: string) => {
    setLoading(true);
    setError(null);
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        try {
          setListings(prev => prev.map(l => {
            if (l.id === id) {
              return {
                ...l,
                portals: {
                  ...l.portals,
                  [portal]: {
                    ...l.portals[portal],
                    published: true,
                    publishedAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                  }
                }
              };
            }
            return l;
          }));
          setLoading(false);
          resolve(true);
        } catch (e) {
          setError('Failed to publish to portal');
          setLoading(false);
          reject(e);
        }
      }, 800);
    });
  }, []);

  return {
    listings,
    loading,
    error,
    createListing,
    updateListing,
    deleteListing,
    getPerformance,
    getSEOStatus,
    publishToPortal
  };
}; 