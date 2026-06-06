import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Check, ThumbsUp, ThumbsDown, ChevronDown, Share2 } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useUserActions } from '../../hooks/useUserActions';
import axiosInstance from '../../api/axios';
import ShareButton from '../ui/ShareButton';

const MovieCard = ({
  item,
  mediaType = 'movie',
  index,
  isHovered,
  hoveredIndex,
  xTranslation,
  onHoverStart,
  onHoverEnd,
  totalItems
}) => {
  const [trailerKey, setTrailerKey] = useState('');
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const hoverTimeoutRef = useRef(null);
  
  // Internal hover state for grid layouts (when parent hover props aren't provided)
  const [internalIsHovered, setInternalIsHovered] = useState(false);
  
  // Use parent hover state if available, otherwise use internal state
  const effectiveIsHovered = isHovered !== undefined ? isHovered : internalIsHovered;

  const openDetailModal = useUiStore((state) => state.openDetailModal);

  const type = item.media_type || mediaType;
  const itemId = item.id;
  const title = item.title || item.name || item.original_title || 'Title';

  // User Watchlist & Ratings actions
  const { useWatchlist, addToWatchlist, removeFromWatchlist, useRatings, rateContent } = useUserActions();
  const { data: watchlist = [] } = useWatchlist();
  const { data: ratings = [] } = useRatings();

  const isAddedToWatchlist = watchlist.some((w) => w.tmdbId === itemId);
  const activeRating = ratings.find((r) => r.tmdbId === itemId)?.rating; // 'like' or 'dislike'

  // Poster & Backdrop image resolutions
  const getPosterUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const getBackdropUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w780${path}`;
  };

  const posterUrl = getPosterUrl(item.poster_path);
  const backdropUrl = getBackdropUrl(item.backdrop_path);

  // Fetch trailer key only on hover (lazy loading)
  const fetchTrailer = async () => {
    if (trailerKey) return;
    setIsLoadingTrailer(true);
    try {
      const { data } = await axiosInstance.get(`/tmdb/${type}/${itemId}/videos`);
      const trailers = data.results || [];
      const officialTrailer = trailers.find(
        (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
      );
      if (officialTrailer) {
        setTrailerKey(officialTrailer.key);
      } else if (trailers.length > 0) {
        setTrailerKey(trailers[0].key);
      }
    } catch (error) {
      console.error('Failed to load trailer on card hover:', error.message);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (onHoverStart) {
        onHoverStart();
      } else {
        setInternalIsHovered(true);
      }
      fetchTrailer();
    }, 400); // slightly shorter 400ms delay for snappier experience
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (onHoverEnd && effectiveIsHovered) {
      onHoverEnd();
    } else if (!onHoverEnd) {
      setInternalIsHovered(false);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    try {
      if (isAddedToWatchlist) {
        removeFromWatchlist(itemId);
      } else {
        addToWatchlist({
          tmdbId: itemId,
          mediaType: type,
          title,
          posterPath: item.poster_path,
        });
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err.message);
    }
  };

  const handleRatingClick = (e, rType) => {
    e.stopPropagation();
    try {
      rateContent({
        tmdbId: itemId,
        mediaType: type,
        rating: rType,
      });
    } catch (err) {
      console.error('Error rating content:', err.message);
    }
  };

  // Determine dynamic transform origin based on card's horizontal column placement in the row
  const getTransformOrigin = () => {
    if (index === 0) return 'left center';
    if (totalItems && index === totalItems - 1) return 'right center';
    return 'center center';
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => openDetailModal(item, type)}
      animate={{
        scale: effectiveIsHovered ? 1.35 : 1,
        x: xTranslation || 0,
        // Dim non-hovered sibling cards when a card in the row is active (only in row mode)
        opacity: onHoverStart && hoveredIndex !== null && !effectiveIsHovered ? 0.45 : 1
      }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
      style={{
        transformOrigin: getTransformOrigin(),
        zIndex: effectiveIsHovered ? 50 : 10
      }}
      className="relative w-[140px] sm:w-[200px] aspect-[2/3] cursor-pointer select-none flex-shrink-0 rounded-md"
    >
      {/* Standard Poster State (always visible) */}
      <img
        src={posterUrl}
        alt={title}
        className="w-full h-full object-cover rounded-md shadow-md"
        loading="lazy"
      />

      {/* Expanded Hover Card Overlay */}
      {effectiveIsHovered && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent rounded-md flex flex-col justify-end animate-fadeIn"
          onClick={(e) => { e.stopPropagation(); openDetailModal(item, type); }}
        >
          {/* Body Content */}
          <div className="p-3.5 space-y-2.5">
            {/* Action Buttons Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); openDetailModal(item, type); }}
                    className="bg-white hover:bg-white/80 text-black rounded-full p-1.5 flex items-center justify-center transition"
                    aria-label="Play"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <button
                    onClick={handleWatchlistToggle}
                    className="border border-gray-400 hover:border-white text-white rounded-full p-1.5 flex items-center justify-center transition hover:bg-white/10"
                    aria-label="Toggle Watchlist"
                  >
                    {isAddedToWatchlist ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={(e) => handleRatingClick(e, 'like')}
                    className={`border rounded-full p-1.5 flex items-center justify-center transition hover:bg-white/10 ${activeRating === 'like' ? 'border-brand-red text-brand-red bg-brand-red/5' : 'border-gray-400 text-white'
                      }`}
                    aria-label="Like"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleRatingClick(e, 'dislike')}
                    className={`border rounded-full p-1.5 flex items-center justify-center transition hover:bg-white/10 ${activeRating === 'dislike' ? 'border-brand-red text-brand-red bg-brand-red/5' : 'border-gray-400 text-white'
                      }`}
                    aria-label="Dislike"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Share Button */}
                  <ShareButton
                    title={title}
                    description={item.overview || ''}
                    mediaType={type}
                    itemId={itemId}
                  />
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); openDetailModal(item, type); }}
                  className="border border-gray-400 hover:border-white text-white rounded-full p-1.5 flex items-center justify-center transition hover:bg-white/10"
                  aria-label="Show Details"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

            {/* Quick Metadata */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-gray-200">
                <span className="text-green-500 font-extrabold">{Math.round(item.vote_average * 10)}% Match</span>
                <span>{item.release_date ? item.release_date.split('-')[0] : item.first_air_date ? item.first_air_date.split('-')[0] : ''}</span>
                <span className="border border-white/30 px-1 rounded text-[7px] tracking-wider uppercase font-semibold">HD</span>
              </div>
              <h4 className="font-bold text-xs text-white truncate">{title}</h4>
            </div>

            {/* Genre labels */}
            <div className="flex flex-wrap gap-1">
              {item.genre_ids?.slice(0, 2).map((gId, idx) => {
                const allGenres = [
                  { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' },
                  { id: 878, name: 'Sci-Fi' }, { id: 27, name: 'Horror' }, { id: 9648, name: 'Mystery' }
                ];
                const genreName = allGenres.find(g => g.id === gId)?.name || 'Drama';
                return (
                  <span key={idx} className="text-[8px] font-bold text-gray-400 px-1.5 py-0.5 bg-zinc-800 rounded">
                    {genreName}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;
