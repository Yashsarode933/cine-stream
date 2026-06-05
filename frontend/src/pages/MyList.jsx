import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import MovieCard from '../components/content/MovieCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { useUserActions } from '../hooks/useUserActions';
import { Film, Plus } from 'lucide-react';

const MyList = () => {
  const navigate = useNavigate();
  const { useWatchlist } = useUserActions();
  const { data: watchlist = [], isLoading, isError } = useWatchlist();

  // Map backend model properties back to expected standard TMDB format
  const watchlistItems = watchlist.map((wItem) => ({
    id: wItem.tmdbId,
    media_type: wItem.mediaType,
    title: wItem.title,
    name: wItem.title,
    poster_path: wItem.posterPath,
    backdrop_path: wItem.posterPath, // approximation
    vote_average: 8.0, // fallback average
  }));

  return (
    <div className="min-h-screen bg-brand-black text-white pb-24">
      {/* Navigation Header */}
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-28 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-netflix-sans">
            My List
          </h2>
        </div>

        {/* Watchlist Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : watchlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 animate-fadeIn">
            {watchlistItems.map((item) => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto space-y-4">
            <div className="bg-zinc-800/60 p-4 rounded-full border border-white/5 shadow-inner">
              <Film className="w-10 h-10 text-brand-red animate-pulse" />
            </div>
            <h3 className="text-xl font-bold">Your List is empty</h3>
            <p className="text-xs text-brand-gray leading-relaxed">
              Add movies and TV shows to your watchlist by clicking the "+" button on cards or hero banners.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-white hover:bg-white/80 text-black text-xs font-bold px-6 py-2.5 rounded transition shadow flex items-center justify-center gap-1.5"
            >
              Browse Content
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyList;
