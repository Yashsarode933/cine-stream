import React, { useState, useEffect } from 'react';
import { useUiStore } from '../store/uiStore';
import { useSearchQuery } from '../hooks/useTMDB';
import Navbar from '../components/layout/Navbar';
import MovieCard from '../components/content/MovieCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { Trash2, Film, Clock } from 'lucide-react';

const Search = () => {
  const searchQuery = useUiStore((state) => state.searchQuery);
  const setSearchQuery = useUiStore((state) => state.setSearchQuery);
  
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [activeType, setActiveType] = useState('all'); // 'all', 'movie', 'tv'
  const [recentSearches, setRecentSearches] = useState([]);

  // Debounce the global search query to prevent flooding the server
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load recent searches from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('cinestream_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save query to recent searches when search is executed
  useEffect(() => {
    if (debouncedQuery.trim() !== '') {
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== debouncedQuery.toLowerCase());
        const updated = [debouncedQuery, ...filtered].slice(0, 5); // Store top 5
        localStorage.setItem('cinestream_recent_searches', JSON.stringify(updated));
        return updated;
      });
    }
  }, [debouncedQuery]);

  const { data: results = [], isLoading, isError } = useSearchQuery(debouncedQuery, activeType);

  const clearHistory = () => {
    localStorage.removeItem('cinestream_recent_searches');
    setRecentSearches([]);
  };

  const handleRecentClick = (term) => {
    setSearchQuery(term);
    useUiStore.getState().setSearchExpanded(true);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white pb-24">
      {/* Header */}
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-28 space-y-8">
        {/* Search header / title */}
        <div>
          <h2 className="text-xl sm:text-2xl text-brand-gray">
            {searchQuery ? (
              <span>Search results for: <strong className="text-white">"{searchQuery}"</strong></span>
            ) : (
              <span>Search CineStream</span>
            )}
          </h2>
        </div>

        {/* Filter chips (All, Movies, TV Shows) */}
        {searchQuery && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveType('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition ${
                activeType === 'all' ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveType('movie')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition ${
                activeType === 'movie' ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveType('tv')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition ${
                activeType === 'tv' ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
            >
              TV Shows
            </button>
          </div>
        )}

        {/* Search Results Display */}
        {searchQuery ? (
          isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 pt-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 pt-4">
              {results.map((item) => (
                <MovieCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
              <Film className="w-16 h-16 text-brand-gray animate-pulse" />
              <h3 className="text-xl font-bold">No results found</h3>
              <p className="text-sm text-brand-gray leading-relaxed">
                Your search for "{searchQuery}" did not return any matches. Try checking the spelling or searching for another title.
              </p>
            </div>
          )
        ) : (
          /* Landing state / Search history */
          <div className="max-w-xl py-6 space-y-6">
            {recentSearches.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold tracking-wider text-brand-gray flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    RECENT SEARCHES
                  </h4>
                  <button 
                    onClick={clearHistory}
                    className="text-xs text-brand-red hover:underline flex items-center gap-1 focus:outline-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear History
                  </button>
                </div>
                <ul className="space-y-1">
                  {recentSearches.map((term, index) => (
                    <li 
                      key={index}
                      onClick={() => handleRecentClick(term)}
                      className="px-4 py-3 bg-brand-darkGray hover:bg-zinc-800 rounded cursor-pointer transition text-sm text-gray-300 hover:text-white"
                    >
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-brand-darkGray/50 border border-white/5 rounded-lg p-8 text-center text-brand-gray space-y-2">
                <p className="text-sm">Find your next favorite film or series.</p>
                <p className="text-xs text-zinc-500">Type in the search bar above to query by title, cast, or genres.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
