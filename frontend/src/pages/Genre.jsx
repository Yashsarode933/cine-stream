import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import MovieCard from '../components/content/MovieCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { useGenresQuery, useDiscoverQuery } from '../hooks/useTMDB';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const Genre = () => {
  const { type, id } = useParams(); // type: 'movie' or 'tv', id: genreId or 'all'
  const navigate = useNavigate();

  const [genreId, setGenreId] = useState(id === 'all' ? '' : id);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);

  // Reset page and genre state when route params change
  useEffect(() => {
    setGenreId(id === 'all' ? '' : id);
    setPage(1);
  }, [type, id]);

  // Query genres list
  const { data: genresData } = useGenresQuery();
  const genres = type === 'tv' ? genresData?.tvGenres || [] : genresData?.movieGenres || [];

  // Query discover list
  const { data: items = [], isLoading, isError } = useDiscoverQuery({
    genre: genreId,
    type,
    sort: sortBy,
    page,
  });

  const handleGenreChange = (e) => {
    const selected = e.target.value;
    if (selected === '') {
      navigate(`/genre/${type}/all`);
    } else {
      navigate(`/genre/${type}/${selected}`);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const activeGenreName = genres.find(g => String(g.id) === String(genreId))?.name || 'All';

  return (
    <div className="min-h-screen bg-brand-black text-white pb-24">
      {/* Header Navigation */}
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-28 space-y-8">
        
        {/* Explore Sub-Header (Genre Dropdown & Sorting Options) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold capitalize tracking-tight font-netflix-sans">
              {type === 'tv' ? 'TV Shows' : 'Movies'}
              <span className="text-brand-red font-normal ml-3 text-lg sm:text-2xl">
                ({activeGenreName})
              </span>
            </h2>
            
            {/* Genre Select Dropdown */}
            <select
              value={genreId}
              onChange={handleGenreChange}
              className="bg-black/50 border border-zinc-700 hover:border-gray-500 rounded px-3 py-1.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red cursor-pointer transition font-semibold"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-brand-gray" />
            
            {/* Sort Select Dropdown */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="bg-black/50 border border-zinc-700 hover:border-gray-500 rounded px-3 py-1.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red cursor-pointer transition font-semibold"
            >
              <option value="popularity.desc">Popularity</option>
              <option value="vote_average.desc">Rating</option>
              <option value="primary_release_date.desc">Release Date</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {items.map((item) => (
              <MovieCard key={item.id} item={item} mediaType={type} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-brand-gray space-y-2">
            <p className="text-lg">No content found matching these parameters.</p>
            <p className="text-sm text-zinc-500">Try modifying your filter categories or select another genre.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {items.length > 0 && (
          <div className="flex items-center justify-center gap-4 pt-10">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || isLoading}
              className="border border-zinc-700 hover:border-white disabled:border-zinc-800 disabled:text-zinc-600 hover:bg-white/5 text-white rounded p-2.5 flex items-center justify-center transition disabled:pointer-events-none"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold select-none text-brand-gray">
              Page <strong className="text-white">{page}</strong>
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading || items.length < 20} // TMDB pages contain 20 items. If less, we're at the end.
              className="border border-zinc-700 hover:border-white disabled:border-zinc-800 disabled:text-zinc-600 hover:bg-white/5 text-white rounded p-2.5 flex items-center justify-center transition disabled:pointer-events-none"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default Genre;
