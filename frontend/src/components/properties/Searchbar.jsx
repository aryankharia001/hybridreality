import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ onSearch, className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Popular locations suggestion
  const popularLocations = [
   'Mumbai','Goa','Jaipur','Ahmedabad'
  ];

  // Example property IDs (can be replaced with actual recent IDs from your system)
  const recentPropertyIds = [1001, 1002, 1005, 1010];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Add click outside listener
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) return;

    // Update recent searches
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Check if query might be a property ID
  const isNumericSearch = (query) => {
    return /^\d+$/.test(query);
  };

  return (
    <div className={`relative ${className}`} ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search by location, property type, or ID #..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-20 py-3 rounded-lg border border-gray-200 
            focus:border-[var(--theme-hover-color-1)] focus:ring-2 focus:ring-blue-200 
            transition-all text-gray-800 placeholder-gray-400"
        />
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 
            text-gray-400 h-5 w-5" 
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              type="button"
              onClick={clearSearch}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 
                hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
          <button 
            type="submit"
            className="bg-[var(--theme-color-1)] text-white px-4 py-1.5 rounded-lg 
              hover:bg-[var(--theme-hover-color-1)] transition-colors flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg 
              shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            {/* Property ID search suggestion if input is numeric */}
            {isNumericSearch(searchQuery) && searchQuery.length > 0 && (
              <div className="p-2 border-b border-gray-100">
                <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                  Find by Property ID
                </h3>
                <button
                  onClick={() => {
                    handleSearch(searchQuery);
                  }}
                  className="w-full text-left px-3 py-2 bg-gray-50 
                    rounded-md flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                >
                  <Hash className="h-4 w-4 text-gray-400" />
                  Property #{searchQuery}
                </button>
              </div>
            )}

            {recentSearches.length > 0 && (
              <div className="p-2">
                <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                  Recent Searches
                </h3>
                {recentSearches.map((query, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => {
                      setSearchQuery(query);
                      handleSearch(query);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 
                      rounded-md flex items-center gap-2 text-gray-700"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    {query}
                  </button>
                ))}
              </div>
            )}

            {/* Property IDs Section */}
            <div className="border-t border-gray-100 p-2">
              <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                Properties by ID
              </h3>
              {recentPropertyIds.map((id, index) => (
                <button
                  key={`id-${index}`}
                  onClick={() => {
                    setSearchQuery(id.toString());
                    handleSearch(id.toString());
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 
                    rounded-md flex items-center gap-2 text-gray-700"
                >
                  <Hash className="h-4 w-4 text-gray-400" />
                  Property #{id}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 p-2">
              <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                Popular Locations
              </h3>
              {popularLocations.map((location, index) => (
                <button
                  key={`popular-${index}`}
                  onClick={() => {
                    setSearchQuery(location);
                    handleSearch(location);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 
                    rounded-md flex items-center gap-2 text-gray-700"
                >
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {location}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;