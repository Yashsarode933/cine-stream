import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Play, Plus, Check, Volume2, VolumeX, ThumbsUp, Star, Share2 } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useUserActions } from '../../hooks/useUserActions';
import ShareButton from '../ui/ShareButton';
import {
  useMovieDetailsQuery,
  useTVDetailsQuery,
  useMovieVideosQuery,
  useTVVideosQuery,
  useMovieCreditsQuery,
  useTVCreditsQuery,
  useSimilarMoviesQuery,
  useSimilarTVQuery,
} from '../../hooks/useTMDB';

const DetailModal = () => {
  const { activeModalItem, activeModalType, closeDetailModal } = useUiStore();
  const [isMuted, setIsMuted] = useState(true);
  const [trailerKey, setTrailerKey] = useState('');
  const navigate = useNavigate();

  const itemId = activeModalItem?.id;
  const isMovie = activeModalType === 'movie';

  // Watchlist & Ratings
  const { useWatchlist, addToWatchlist, removeFromWatchlist } = useUserActions();
  const { data: watchlist = [] } = useWatchlist();
  const isAddedToWatchlist = watchlist.some((w) => w.tmdbId === itemId);

  // Queries for details
  const { data: movieDetails, isLoading: loadingMovie } = useMovieDetailsQuery(isMovie ? itemId : null);
  const { data: tvDetails, isLoading: loadingTV } = useTVDetailsQuery(!isMovie ? itemId : null);
  
  const { data: movieVideos } = useMovieVideosQuery(isMovie ? itemId : null);
  const { data: tvVideos } = useTVVideosQuery(!isMovie ? itemId : null);

  const { data: movieCast } = useMovieCreditsQuery(isMovie ? itemId : null);
  const { data: tvCast } = useTVCreditsQuery(!isMovie ? itemId : null);

  const { data: similarMovies } = useSimilarMoviesQuery(isMovie ? itemId : null);
  const { data: similarTV } = useSimilarTVQuery(!isMovie ? itemId : null);

  const details = isMovie ? movieDetails : tvDetails;
  const videos = isMovie ? movieVideos : tvVideos;
  const cast = isMovie ? movieCast : tvCast;
  const similar = isMovie ? similarMovies : similarTV;

  // Find trailer key
  useEffect(() => {
    if (videos && videos.length > 0) {
      const trailer = videos.find(
        (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setTrailerKey(videos[0].key);
      }
    } else {
      setTrailerKey('');
    }
  }, [videos]);

  // Log watch history when modal opens (simulating starting the show!)
  const { logHistory } = useUserActions();
  useEffect(() => {
    if (activeModalItem && details) {
      logHistory({
        tmdbId: itemId,
        mediaType: activeModalType,
        title: details.title || details.name,
        posterPath: details.poster_path,
        progress: Math.floor(Math.random() * 50) + 10, // Simulate randomized progress bar
      });
    }
  }, [activeModalItem, details]);

  if (!activeModalItem) return null;

  const title = details?.title || details?.name || activeModalItem.title || activeModalItem.name;
  const releaseYear = details?.release_date?.split('-')[0] || details?.first_air_date?.split('-')[0] || '';
  const runtime = details?.runtime 
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` 
    : details?.episode_run_time?.[0] 
    ? `${details.episode_run_time[0]}m`
    : '';

  const getBackdropUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1200&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/original${path}`;
  };

  const backdropPath = details?.backdrop_path || activeModalItem.backdrop_path;
  const backdropUrl = getBackdropUrl(backdropPath);

  const handleWatchlistToggle = async () => {
    try {
      if (isAddedToWatchlist) {
        await removeFromWatchlist(itemId);
      } else {
        await addToWatchlist({
          tmdbId: itemId,
          mediaType: activeModalType,
          title,
          posterPath: details?.poster_path || activeModalItem.poster_path,
        });
      }
    } catch (err) {
      console.error('Watchlist toggle failed in modal:', err.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-10 items-start pt-16">
        
        {/* Blur overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDetailModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-4xl bg-brand-darkGray rounded-xl overflow-hidden shadow-2xl z-10 text-white scrollbar-hide my-8"
        >
          {/* Close trigger button */}
          <button 
            onClick={closeDetailModal}
            className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/80 rounded-full p-2 border border-white/10 hover:scale-105 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* YouTube Trailer / Backdrop Header */}
          <div className="relative aspect-[16/9] w-full bg-black">
            {trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                title={title}
                className="w-full h-full object-cover scale-[1]"
                frameBorder="0"
                allow="autoplay; encrypted-media"
              ></iframe>
            ) : (
              <img 
                src={backdropUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Dark Mask layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-darkGray via-black/10 to-transparent"></div>

            {/* Audio & Play Overlays */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <button 
                  className="bg-white hover:bg-white/80 text-black font-bold px-6 py-2.5 rounded flex items-center justify-center gap-2 transition hover:scale-105"
                  onClick={() => alert(`Playing ${title}...`)}
                >
                  <Play className="w-5 h-5 fill-current" /> Play
                </button>
                
                <button 
                  onClick={handleWatchlistToggle}
                  className="border border-gray-400 hover:border-white text-white rounded-full p-2.5 flex items-center justify-center transition hover:bg-white/10 hover:scale-105"
                  aria-label="Add to watchlist"
                >
                  {isAddedToWatchlist ? <Check className="w-5 h-5 text-green-500" /> : <Plus className="w-5 h-5" />}
                </button>

                {/* Share Button */}
                <ShareButton
                  title={title}
                  description={details?.overview || activeModalItem.overview || ''}
                  mediaType={activeModalType}
                  itemId={itemId}
                />
              </div>

              {trailerKey && (
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="border border-gray-400 hover:border-white text-white rounded-full p-2.5 flex items-center justify-center transition hover:bg-white/10 hover:scale-105"
                  aria-label="Mute Toggle"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          {/* Details & Body Layout */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Meta & Info columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Description & Metadata */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                  <span className="text-green-500 font-bold">
                    {details?.vote_average ? `${Math.round(details.vote_average * 10)}% Match` : ''}
                  </span>
                  <span>{releaseYear}</span>
                  {runtime && <span>{runtime}</span>}
                  <span className="border border-white/30 px-1.5 rounded text-xs tracking-wider uppercase">HD</span>
                  {details?.number_of_seasons && (
                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs">
                      {details.number_of_seasons} {details.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-netflix-sans select-text">
                  {title}
                </h3>

                <p className="text-gray-300 leading-relaxed text-sm sm:text-base select-text">
                  {details?.overview || activeModalItem.overview || 'No description available.'}
                </p>
              </div>

              {/* Right Column: Cast & Genres info */}
              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <span className="text-gray-500">Genres: </span>
                  <span className="text-gray-200">
                    {details?.genres?.map((g) => g.name).join(', ') || 'Drama'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">Original Language: </span>
                  <span className="text-gray-200 uppercase">
                    {details?.original_language || 'en'}
                  </span>
                </div>

                {details?.vote_count > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Rating: </span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-gray-200">{details.vote_average.toFixed(1)} / 10 ({details.vote_count} votes)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cast Credits list */}
            {cast && cast.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-200">Cast & Characters</h4>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                  {cast.slice(0, 10).map((actor) => {
                    const picUrl = actor.profile_path
                      ? (actor.profile_path.startsWith('http') ? actor.profile_path : `https://image.tmdb.org/t/p/w185${actor.profile_path}`)
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';
                    return (
                      <button
                        key={actor.id}
                        onClick={() => {
                          closeDetailModal();
                          navigate(`/actor/${actor.id}`);
                        }}
                        className="flex-shrink-0 w-24 text-center space-y-1 group cursor-pointer"
                      >
                        <img 
                          src={picUrl} 
                          alt={actor.name} 
                          className="w-16 h-16 rounded-full object-cover mx-auto border border-white/10 group-hover:border-brand-red transition-colors"
                        />
                        <p className="text-xs font-bold text-gray-200 truncate group-hover:text-brand-red transition-colors">{actor.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Similar titles row */}
            {similar && similar.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xl font-bold text-white">More Like This</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {similar.slice(0, 4).map((sItem) => {
                    const sPoster = sItem.poster_path
                      ? (sItem.poster_path.startsWith('http') ? sItem.poster_path : `https://image.tmdb.org/t/p/w500${sItem.poster_path}`)
                      : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200&auto=format&fit=crop';
                    return (
                      <div 
                        key={sItem.id}
                        onClick={() => {
                          useUiStore.getState().openDetailModal(sItem, activeModalType);
                        }}
                        className="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 border border-white/5"
                      >
                        <img src={sPoster} alt={sItem.title || sItem.name} className="w-full aspect-[2/3] object-cover" />
                        <div className="p-3 space-y-1">
                          <h5 className="font-semibold text-sm truncate">{sItem.title || sItem.name}</h5>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="text-green-500 font-bold">{Math.round(sItem.vote_average * 10)}% match</span>
                            <span>{sItem.release_date ? sItem.release_date.split('-')[0] : sItem.first_air_date ? sItem.first_air_date.split('-')[0] : ''}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};

export default DetailModal;
