import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SearchResult {
  id: string;
  type: 'lead' | 'property' | 'campaign' | 'workflow' | 'agent' | 'document';
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, any>;
  score: number;
}

export interface SearchHistory {
  query: string;
  timestamp: string;
  resultCount: number;
}

interface SearchContextType {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  history: SearchHistory[];
  loading: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  clearHistory: () => void;
  addToHistory: (query: string, resultCount: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dubai_search_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('dubai_search_history', JSON.stringify(history));
  }, [history]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Simulated search function
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'lead',
        title: 'Ahmed Al-Rashid',
        description: 'Interested in Marina apartment, +971 50 123 4567',
        url: '/leads/1',
        metadata: { phone: '+971 50 123 4567', location: 'Dubai Marina' },
        score: 0.95
      },
      {
        id: '2',
        type: 'property',
        title: 'Marina View Apartment',
        description: '2BR, 1,200 sqft, AED 2.5M, Dubai Marina',
        url: '/properties/2',
        metadata: { price: 'AED 2.5M', area: '1,200 sqft', type: 'Apartment' },
        score: 0.88
      },
      {
        id: '3',
        type: 'campaign',
        title: 'Downtown Properties Campaign',
        description: 'Facebook campaign, 10,000 impressions, 2.5% CTR',
        url: '/marketing/campaigns/3',
        metadata: { platform: 'Facebook', impressions: '10,000', ctr: '2.5%' },
        score: 0.82
      },
      {
        id: '4',
        type: 'workflow',
        title: 'Lead Qualification Workflow',
        description: 'Automated lead scoring and qualification process',
        url: '/orchestration/workflows/4',
        metadata: { status: 'Active', executions: '150' },
        score: 0.78
      },
      {
        id: '5',
        type: 'agent',
        title: 'Sarah Johnson',
        description: 'Senior Property Consultant, 15 years experience',
        url: '/admin/agents/5',
        metadata: { experience: '15 years', role: 'Senior Consultant' },
        score: 0.75
      }
    ].filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
    setLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        search(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    // Focus search input after modal opens
    setTimeout(() => {
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  const addToHistory = useCallback((searchQuery: string, resultCount: number) => {
    const newHistoryItem: SearchHistory = {
      query: searchQuery,
      timestamp: new Date().toISOString(),
      resultCount
    };

    setHistory(prev => {
      const filtered = prev.filter(item => item.query !== searchQuery);
      return [newHistoryItem, ...filtered].slice(0, 10); // Keep last 10 searches
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('dubai_search_history');
  }, []);

  const value: SearchContextType = {
    isOpen,
    query,
    results,
    history,
    loading,
    openSearch,
    closeSearch,
    setQuery,
    search,
    clearHistory,
    addToHistory
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 