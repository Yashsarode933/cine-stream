import React, { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { useTrendingQuery } from '../../hooks/useTMDB';
import { useUiStore } from '../../store/uiStore';
import { HeroSkeleton } from '../ui/LoadingSkeleton';

const HeroBanner = () => {
  const { data: trending, isLoading, isError } = useTrendingQuery();
  const [activeIdx, setActiveIdx] = useState(0);
  const openDetailModal = useUiStore((state) => state.openDetailModal);

  // Auto-rotate hero featured items every 8 seconds
  useEffect(() => {
    if (!trending || trending.length === 0) return;

    const interval = setInterval(() => {
      // Pick next index, looping back to 0
      setActiveIdx((prev) => (prev + 1) % Math.min(trending.length, 10)); // Cycle through top 10 trending items
    }, 8000);

    return () => clearInterval(interval);
  }, [trending]);

  if (isLoading) return <HeroSkeleton />;
  if (isError || !trending || trending.length === 0) return null;

  const item = trending[activeIdx];
  const title = item.title || item.name || item.original_title || 'Featured Title';
  const backdropUrl = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1470&auto=format&fit=crop';

  // Truncate text utility
  const truncate = (str, num) => {
    if (!str) return '';
    return str.length > num ? str.slice(0, num) + '...' : str;
  };

  const handlePlayClick = () => {
    // Open detail modal with auto-play trigger
    openDetailModal(item);
  };

  const handleInfoClick = () => {
    openDetailModal(item);
  };

  return (
    <div className="relative w-full h-[56.25vw] min-h-[450px] max-h-[850px] overflow-hidden select-none bg-brand-black">
      {/* Background Poster */}
      <img
        src={backdropUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000 transform scale-105"
      />

      {/* Shadows and Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-black/30 z-10" />

      {/* Info Container */}
      <div className="absolute bottom-[20%] left-6 sm:left-12 z-20 max-w-xl sm:max-w-2xl space-y-4">
        {/* Release type / Category */}
        <span className="bg-red-600/90 text-white text-[10px] sm:text-xs font-bold tracking-widest px-2.5 py-1 rounded">
          {item.media_type === 'tv' ? 'TV SHOW' : 'MOVIE'}
        </span>

        {/* Cinematic Title */}
        <h2 className="text-3xl sm:text-6xl font-extrabold tracking-tight font-netflix-sans text-white drop-shadow-lg leading-tight uppercase">
          {title}
        </h2>

        {/* Metadata Details */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-200">
          <span className="text-green-500">{Math.round(item.vote_average * 10)}% Match</span>
          <span>{item.release_date ? item.release_date.split('-')[0] : item.first_air_date ? item.first_air_date.split('-')[0] : ''}</span>
          <span className="border border-white/30 px-1 rounded text-[10px] tracking-wider uppercase">HD</span>
        </div>

        {/* Truncated Summary */}
        <p className="text-sm sm:text-lg text-gray-200 drop-shadow leading-relaxed font-normal">
          {truncate(item.overview, 180)}
        </p>

        {/* CTA Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handlePlayClick}
            className="flex items-center justify-center gap-2 bg-white hover:bg-white/80 text-black font-semibold px-6 py-2.5 sm:px-8 sm:py-3.5 rounded text-sm sm:text-base shadow transition"
          >
            <Play className="w-5 h-5 fill-current" /> Play
          </button>

          <button
            onClick={handleInfoClick}
            className="flex items-center justify-center gap-2 bg-gray-500/40 hover:bg-gray-500/60 text-white font-semibold px-6 py-2.5 sm:px-8 sm:py-3.5 rounded text-sm sm:text-base border border-transparent hover:border-white/20 shadow transition"
          >
            <Info className="w-5 h-5" /> More Info
          </button>
        </div>
      </div>

      {/* Floating details (e.g. maturity rating index) */}
      <div className="absolute right-0 bottom-[22%] z-20 flex items-center gap-2 pl-4 pr-6 py-1 border-l-4 border-gray-400 bg-black/40">
        <span className="text-[10px] sm:text-xs tracking-wider uppercase font-bold text-gray-200">
          {item.media_type === 'tv' ? 'TV-14' : 'PG-13'}
        </span>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {trending.slice(0, 10).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === activeIdx 
                ? 'bg-white scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
