import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

// API functions
const getTrending = async () => {
  const { data } = await axiosInstance.get('/tmdb/trending');
  return data.results || [];
};

const getMovies = async (category) => {
  const { data } = await axiosInstance.get(`/tmdb/movies/${category}`);
  return data.results || [];
};

const getTVShows = async (category) => {
  const { data } = await axiosInstance.get(`/tmdb/tv/${category}`);
  return data.results || [];
};

const getMovieDetails = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/movie/${id}`);
  return data;
};

const getTVDetails = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/tv/${id}`);
  return data;
};

const getMovieVideos = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/movie/${id}/videos`);
  return data.results || [];
};

const getTVVideos = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/tv/${id}/videos`);
  return data.results || [];
};

const getMovieCredits = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/movie/${id}/credits`);
  return data.cast || [];
};

const getTVCredits = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/tv/${id}/credits`);
  return data.cast || [];
};

const getSimilarMovies = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/movie/${id}/similar`);
  return data.results || [];
};

const getSimilarTV = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/tv/${id}/similar`);
  return data.results || [];
};

const getGenres = async () => {
  const { data } = await axiosInstance.get('/tmdb/genres');
  return data; // returns { movieGenres: [...], tvGenres: [...] }
};

const searchContent = async ({ query, type }) => {
  const { data } = await axiosInstance.get('/tmdb/search', {
    params: { q: query, type },
  });
  return data.results || [];
};

const discoverContent = async ({ genre, type, sort, page }) => {
  const { data } = await axiosInstance.get('/tmdb/discover', {
    params: { genre, type, sort, page },
  });
  return data.results || [];
};

const getPersonDetails = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/person/${id}`);
  return data;
};

const getPersonCredits = async (id) => {
  const { data } = await axiosInstance.get(`/tmdb/person/${id}/credits`);
  return data;
};

// React Query hooks wrapper
export const useTrendingQuery = () => useQuery({ queryKey: ['trending'], queryFn: getTrending });

export const useMoviesQuery = (category) => useQuery({
  queryKey: ['movies', category],
  queryFn: () => getMovies(category),
});

export const useTVShowsQuery = (category) => useQuery({
  queryKey: ['tv', category],
  queryFn: () => getTVShows(category),
});

export const useMovieDetailsQuery = (id) => useQuery({
  queryKey: ['movieDetails', id],
  queryFn: () => getMovieDetails(id),
  enabled: !!id,
});

export const useTVDetailsQuery = (id) => useQuery({
  queryKey: ['tvDetails', id],
  queryFn: () => getTVDetails(id),
  enabled: !!id,
});

export const useMovieVideosQuery = (id) => useQuery({
  queryKey: ['movieVideos', id],
  queryFn: () => getMovieVideos(id),
  enabled: !!id,
});

export const useTVVideosQuery = (id) => useQuery({
  queryKey: ['tvVideos', id],
  queryFn: () => getTVVideos(id),
  enabled: !!id,
});

export const useMovieCreditsQuery = (id) => useQuery({
  queryKey: ['movieCredits', id],
  queryFn: () => getMovieCredits(id),
  enabled: !!id,
});

export const useTVCreditsQuery = (id) => useQuery({
  queryKey: ['tvCredits', id],
  queryFn: () => getTVCredits(id),
  enabled: !!id,
});

export const useSimilarMoviesQuery = (id) => useQuery({
  queryKey: ['similarMovies', id],
  queryFn: () => getSimilarMovies(id),
  enabled: !!id,
});

export const useSimilarTVQuery = (id) => useQuery({
  queryKey: ['similarTV', id],
  queryFn: () => getSimilarTV(id),
  enabled: !!id,
});

export const useGenresQuery = () => useQuery({ queryKey: ['genres'], queryFn: getGenres });

export const useSearchQuery = (query, type = 'all') => useQuery({
  queryKey: ['search', query, type],
  queryFn: () => searchContent({ query, type }),
  enabled: !!query,
  keepPreviousData: true,
});

export const useDiscoverQuery = ({ genre, type, sort, page }) => useQuery({
  queryKey: ['discover', { genre, type, sort, page }],
  queryFn: () => discoverContent({ genre, type, sort, page }),
  keepPreviousData: true,
});

// Person/Actor queries
export const usePersonDetailsQuery = (id) => useQuery({
  queryKey: ['personDetails', id],
  queryFn: () => getPersonDetails(id),
  enabled: !!id,
});

export const usePersonCreditsQuery = (id) => useQuery({
  queryKey: ['personCredits', id],
  queryFn: () => getPersonCredits(id),
  enabled: !!id,
});
