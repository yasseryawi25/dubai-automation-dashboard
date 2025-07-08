import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowUpRight, Users, Home, BarChart2, MessageCircle, Settings, FileText } from 'lucide-react';
import { useSearch } from './SearchProvider';
import { SearchResult } from './SearchProvider';

const GlobalSearch: React.FC = () => {
  const { isOpen, query, results, history, loading, closeSearch, setQuery, addToHistory } = useSearch();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          closeSearch();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, closeSearch]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    addToHistory(query, results.length);
    window.location.href = result.url;
    closeSearch();
  };

  const handleHistoryClick = (historyItem: any) => {
    setQuery(historyItem.query);
    setShowSuggestions(false);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'lead': return <Users className="w-4 h-4" />;
      case 'property': return <Home className="w-4 h-4" />;
      case 'campaign': return <MessageCircle className="w-4 h-4" />;
      case 'workflow': return <Settings className="w-4 h-4" />;
      case 'agent': return <Users className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'lead': return 'Lead';
      case 'property': return 'Property';
      case 'campaign': return 'Campaign';
      case 'workflow': return 'Workflow';
      case 'agent': return 'Agent';
      case 'document': return 'Document';
      default: return 'Other';
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'lead': return 'bg-blue-100 text-blue-700';
      case 'property': return 'bg-green-100 text-green-700';
      case 'campaign': return 'bg-purple-100 text-purple-700';
      case 'workflow': return 'bg-orange-100 text-orange-700';
      case 'agent': return 'bg-indigo-100 text-indigo-700';
      case 'document': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mt-20 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            data-search-input
            type="text"
            placeholder="Search leads, properties, campaigns, workflows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="flex-1 border-none outline-none text-lg"
            style={{ minHeight: 44 }}
          />
          <button
            onClick={closeSearch}
            className="p-2 hover:bg-gray-100 rounded-full"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {!query && showSuggestions && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h3>
              {history.length === 0 ? (
                <p className="text-sm text-gray-400">No recent searches</p>
              ) : (
                <div className="space-y-2">
                  {history.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded text-left"
                      style={{ minHeight: 44 }}
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="flex-1">{item.query}</span>
                      <span className="text-xs text-gray-400">{item.resultCount} results</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {query && (
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
                  <span className="ml-2 text-gray-500">Searching...</span>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
                </div>
              ) : (
                <div ref={resultsRef} className="space-y-1">
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full p-3 text-left rounded-lg transition-colors ${
                        index === selectedIndex ? 'bg-primary-gold text-white' : 'hover:bg-gray-50'
                      }`}
                      style={{ minHeight: 44 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded ${index === selectedIndex ? 'bg-white bg-opacity-20' : getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${index === selectedIndex ? 'text-white' : 'text-gray-900'}`}>
                              {result.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              index === selectedIndex 
                                ? 'bg-white bg-opacity-20 text-white' 
                                : getTypeColor(result.type)
                            }`}>
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          <p className={`text-sm ${index === selectedIndex ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                            {result.description}
                          </p>
                          {result.metadata && (
                            <div className="flex items-center gap-2 mt-1">
                              {Object.entries(result.metadata).slice(0, 2).map(([key, value]) => (
                                <span key={key} className={`text-xs ${index === selectedIndex ? 'text-white text-opacity-70' : 'text-gray-400'}`}>
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ArrowUpRight className={`w-4 h-4 ${index === selectedIndex ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Press Enter to select, Esc to close</span>
            <span>{results.length} results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch; 