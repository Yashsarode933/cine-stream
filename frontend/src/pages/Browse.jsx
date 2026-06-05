import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroBanner from '../components/content/HeroBanner';
import ContentRow from '../components/content/ContentRow';
import { RowSkeleton } from '../components/ui/LoadingSkeleton';
import { 
  useTrendingQuery, 
  useMoviesQuery, 
  useTVShowsQuery, 
  useDiscoverQuery 
} from '../hooks/useTMDB';
import { useUserActions } from '../hooks/useUserActions';

const Browse = () => {
  // 1. Fetch TMDB Proxy lists
  const { data: trending, isLoading: loadingTrending } = useTrendingQuery();
  const { data: popularMovies, isLoading: loadingPopular } = useMoviesQuery('popular');
  const { data: popularTV, isLoading: loadingPopularTV } = useTVShowsQuery('popular');
  const { data: topRatedTV, isLoading: loadingTopRatedTV } = useTVShowsQuery('top-rated');

  // 2. Fetch specific genre channels
  const { data: actionMovies, isLoading: loadingAction } = useDiscoverQuery({ genre: '28', type: 'movie' });
  const { data: comedyMovies, isLoading: loadingComedy } = useDiscoverQuery({ genre: '35', type: 'movie' });
  const { data: horrorMovies, isLoading: loadingHorror } = useDiscoverQuery({ genre: '27', type: 'movie' });
  const { data: sciFiMovies, isLoading: loadingSciFi } = useDiscoverQuery({ genre: '878', type: 'movie' });

  // 3. Fetch User-specific lists (watchlist + history)
  const { useWatchlist, useHistory } = useUserActions();
  const { data: watchlist = [] } = useWatchlist();
  const { data: history = [] } = useHistory();

  // Filter watch history items with progress < 100% to display in "Continue Watching"
  const continueWatching = history.filter((item) => item.progress < 100).map((hItem) => {
    // Map watch history model attributes back to expected TMDB item shape
    return {
      id: hItem.tmdbId,
      media_type: hItem.mediaType,
      title: hItem.title,
      name: hItem.title,
      poster_path: hItem.posterPath,
      backdrop_path: hItem.posterPath, // approximation
      progress: hItem.progress,
      vote_average: 7.5, // placeholder
    };
  });

  const watchlistItems = watchlist.map((wItem) => {
    return {
      id: wItem.tmdbId,
      media_type: wItem.mediaType,
      title: wItem.title,
      name: wItem.title,
      poster_path: wItem.posterPath,
      backdrop_path: wItem.posterPath, // approximation
      vote_average: 8.0, // placeholder
    };
  });

  const showSkeletons = loadingTrending || loadingPopular || loadingPopularTV || loadingTopRatedTV;

  return (
    <div className="min-h-screen bg-brand-black pb-24 text-white overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Billboard */}
      <HeroBanner />

      {/* Row Listings */}
      <div className="relative z-30 space-y-2 md:space-y-6">
        
        {/* Render Skeletons if loading */}
        {showSkeletons ? (
          <>
            <RowSkeleton title="Trending Now" />
            <RowSkeleton title="Popular Movies" />
            <RowSkeleton title="Popular TV Shows" />
          </>
        ) : (
          <>
            {/* 1. Continue Watching (if history exists) */}
            {continueWatching.length > 0 && (
              <div className="relative">
                <ContentRow title="Continue Watching" items={continueWatching} />
              </div>
            )}

            {/* 2. Trending Now */}
            <ContentRow title="Trending Now" items={trending} />

            {/* 4. Action & Adventure */}
            {loadingAction ? <RowSkeleton title="Action Thrillers" /> : (
              <ContentRow title="Action Thrillers" items={actionMovies} mediaType="movie" />
            )}

            {/* 5. Popular on CineStream (Movies) */}
            <ContentRow title="Popular Movies" items={popularMovies} mediaType="movie" />

            {/* 6. Comedy Shows */}
            {loadingComedy ? <RowSkeleton title="Comedy Club" /> : (
              <ContentRow title="Comedy Club" items={comedyMovies} mediaType="movie" />
            )}

            {/* 7. Trending TV Shows */}
            <ContentRow title="Popular TV Shows" items={popularTV} mediaType="tv" />

            {/* 8. Science Fiction & Fantasy */}
            {loadingSciFi ? <RowSkeleton title="Sci-Fi & Fantasy" /> : (
              <ContentRow title="Sci-Fi & Fantasy" items={sciFiMovies} mediaType="movie" />
            )}

            {/* 9. Horror & Suspense */}
            {loadingHorror ? <RowSkeleton title="Horror & Suspense" /> : (
              <ContentRow title="Horror & Suspense" items={horrorMovies} mediaType="movie" />
            )}

            {/* 10. Critics' Choices */}
            <ContentRow title="Top Rated TV Shows" items={topRatedTV} mediaType="tv" />
          </>
        )}

      </div>
    </div>
  );
};

export default Browse;
