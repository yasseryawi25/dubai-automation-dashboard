import { useState, useEffect, useCallback } from 'react';
import type { SocialMediaPost, SocialPlatform } from '../types';

const STORAGE_KEY = 'marketing_content_posts';
const PLATFORM_KEY = 'marketing_content_platforms';

const samplePlatforms: SocialPlatform[] = [
  { name: 'instagram', connected: true, accountName: '@dubai_properties', followers: 12547, lastSync: '2024-07-08T09:30:00+04:00', postingEnabled: true, analyticsEnabled: true },
  { name: 'facebook', connected: true, accountName: 'Dubai Properties Pro', followers: 8934, lastSync: '2024-07-08T09:15:00+04:00', postingEnabled: true, analyticsEnabled: true },
  { name: 'linkedin', connected: true, accountName: 'Ahmad Al-Mansouri', followers: 3456, lastSync: '2024-07-08T08:45:00+04:00', postingEnabled: true, analyticsEnabled: true },
  { name: 'tiktok', connected: false, accountName: '', followers: 0, lastSync: '', postingEnabled: false, analyticsEnabled: false }
];

export const useContentData = () => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedPlatforms = localStorage.getItem(PLATFORM_KEY);
        setPosts(stored ? JSON.parse(stored) : []);
        setPlatforms(storedPlatforms ? JSON.parse(storedPlatforms) : samplePlatforms);
        setLoading(false);
      } catch (e) {
        setError('Failed to load content data');
        setLoading(false);
      }
    }, 500);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);
  useEffect(() => {
    localStorage.setItem(PLATFORM_KEY, JSON.stringify(platforms));
  }, [platforms]);

  // CRUD operations
  const createPost = useCallback(async (postData: Partial<SocialMediaPost>) => {
    setLoading(true);
    setError(null);
    return new Promise<SocialMediaPost>((resolve, reject) => {
      setTimeout(() => {
        try {
          const newPost: SocialMediaPost = {
            ...postData,
            id: `post-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: postData.status || 'draft',
            engagement: postData.engagement || { likes: 0, comments: 0, shares: 0, views: 0, clickThroughRate: 0 },
            platforms: postData.platforms || [],
            media: postData.media || [],
            hashtags: postData.hashtags || [],
            mentions: postData.mentions || [],
            language: postData.language || 'en',
          } as SocialMediaPost;
          setPosts(prev => [newPost, ...prev]);
          setLoading(false);
          resolve(newPost);
        } catch (e) {
          setError('Failed to create post');
          setLoading(false);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const updatePost = useCallback(async (id: string, updates: Partial<SocialMediaPost>) => {
    setLoading(true);
    setError(null);
    return new Promise<SocialMediaPost | null>((resolve, reject) => {
      setTimeout(() => {
        try {
          setPosts(prev => {
            const idx = prev.findIndex(p => p.id === id);
            if (idx === -1) return prev;
            const updated = { ...prev[idx], ...updates, updatedAt: new Date().toISOString() };
            const newArr = [...prev];
            newArr[idx] = updated;
            resolve(updated);
            return newArr;
          });
          setLoading(false);
        } catch (e) {
          setError('Failed to update post');
          setLoading(false);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const deletePost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        try {
          setPosts(prev => prev.filter(p => p.id !== id));
          setLoading(false);
          resolve(true);
        } catch (e) {
          setError('Failed to delete post');
          setLoading(false);
          reject(e);
        }
      }, 500);
    });
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(prev => prev.map(post => {
        if (post.status === 'published') {
          // Simulate engagement growth
          return {
            ...post,
            engagement: {
              ...post.engagement,
              views: post.engagement.views + Math.floor(Math.random() * 10),
              likes: post.engagement.likes + Math.floor(Math.random() * 2),
              comments: post.engagement.comments + Math.floor(Math.random() * 1),
              shares: post.engagement.shares + Math.floor(Math.random() * 1),
              clickThroughRate: post.engagement.clickThroughRate
            }
          };
        }
        return post;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Platform integration status
  const updatePlatform = useCallback((name: string, updates: Partial<SocialPlatform>) => {
    setPlatforms(prev => prev.map(p => p.name === name ? { ...p, ...updates } : p));
  }, []);

  // Content performance tracking (aggregate)
  const getPerformance = useCallback(() => {
    return posts.reduce((acc, post) => {
      acc.totalPosts++;
      acc.totalViews += post.engagement.views;
      acc.totalLikes += post.engagement.likes;
      acc.totalComments += post.engagement.comments;
      acc.totalShares += post.engagement.shares;
      return acc;
    }, { totalPosts: 0, totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0 });
  }, [posts]);

  return {
    posts,
    platforms,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    updatePlatform,
    getPerformance
  };
}; 