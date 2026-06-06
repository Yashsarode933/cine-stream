import axios from 'axios';
import { mockItems, mockGenres, getMockDetails, getMockVideos, getMockCast } from '../config/mockData.js';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Check if we should run in mock mode
const isMockMode = () => {
  const apiKey = process.env.TMDB_API_KEY;
  return !apiKey || apiKey === 'YOUR_TMDB_API_KEY_HERE';
};

// Helper: Get Axios client config with API key parameter injected
const getTMDBClient = () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (isMockMode()) {
    throw new Error('TMDB API Key is missing. Running in mock mode.');
  }

  return axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: apiKey,
    },
  });
};

// Generic helper to fetch from TMDB endpoint and return data
const fetchFromTMDB = async (endpoint, params = {}) => {
  try {
    const client = getTMDBClient();
    const response = await client.get(endpoint, { params: { ...client.defaults.params, ...params } });
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error fetching ${endpoint}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.status_message || `Failed to fetch from TMDB: ${error.message}`);
  }
};

// @desc    Get trending content (all)
// @route   GET /api/tmdb/trending
export const getTrending = async (req, res) => {
  try {
    if (isMockMode()) {
      return res.json({ results: mockItems });
    }
    const data = await fetchFromTMDB('/trending/all/week');
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get movies by category
// @route   GET /api/tmdb/movies/:category
export const getMoviesByCategory = async (req, res) => {
  const { category } = req.params;
  const { page } = req.query;

  if (isMockMode()) {
    const movies = mockItems.filter(i => i.media_type === 'movie');
    return res.json({ results: movies });
  }

  const categoryMap = {
    popular: 'popular',
    'top-rated': 'top_rated',
    'now-playing': 'now_playing',
    upcoming: 'upcoming',
  };

  const tmdbCategory = categoryMap[category];
  if (!tmdbCategory) {
    return res.status(400).json({ success: false, message: 'Invalid movie category' });
  }

  try {
    const data = await fetchFromTMDB(`/movie/${tmdbCategory}`, { page });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get TV shows by category
// @route   GET /api/tmdb/tv/:category
export const getTVByCategory = async (req, res) => {
  const { category } = req.params;
  const { page } = req.query;

  if (isMockMode()) {
    const tvShows = mockItems.filter(i => i.media_type === 'tv');
    return res.json({ results: tvShows });
  }

  const categoryMap = {
    popular: 'popular',
    'top-rated': 'top_rated',
    'airing-today': 'airing_today',
  };

  const tmdbCategory = categoryMap[category];
  if (!tmdbCategory) {
    return res.status(400).json({ success: false, message: 'Invalid TV category' });
  }

  try {
    const data = await fetchFromTMDB(`/tv/${tmdbCategory}`, { page });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Movie Details
// @route   GET /api/tmdb/movie/:id
export const getMovieDetails = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      const details = getMockDetails(id);
      if (!details) return res.status(404).json({ success: false, message: 'Movie not found' });
      return res.json(details);
    }
    const data = await fetchFromTMDB(`/movie/${id}`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Movie Videos (trailers)
// @route   GET /api/tmdb/movie/:id/videos
export const getMovieVideos = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      return res.json(getMockVideos(id));
    }
    const data = await fetchFromTMDB(`/movie/${id}/videos`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Movie Credits (cast & crew)
// @route   GET /api/tmdb/movie/:id/credits
export const getMovieCredits = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      return res.json({ cast: getMockCast(id) });
    }
    const data = await fetchFromTMDB(`/movie/${id}/credits`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Similar Movies
// @route   GET /api/tmdb/movie/:id/similar
export const getSimilarMovies = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      const similar = mockItems.filter(i => i.media_type === 'movie' && i.id !== Number(id));
      return res.json({ results: similar });
    }
    const data = await fetchFromTMDB(`/movie/${id}/similar`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get TV Show Details
// @route   GET /api/tmdb/tv/:id
export const getTVDetails = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      const details = getMockDetails(id);
      if (!details) return res.status(404).json({ success: false, message: 'TV show not found' });
      return res.json(details);
    }
    const data = await fetchFromTMDB(`/tv/${id}`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get TV Videos
// @route   GET /api/tmdb/tv/:id/videos
export const getTVVideos = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      return res.json(getMockVideos(id));
    }
    const data = await fetchFromTMDB(`/tv/${id}/videos`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get TV Credits
// @route   GET /api/tmdb/tv/:id/credits
export const getTVCredits = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      return res.json({ cast: getMockCast(id) });
    }
    const data = await fetchFromTMDB(`/tv/${id}/credits`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Similar TV Shows
// @route   GET /api/tmdb/tv/:id/similar
export const getSimilarTV = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      const similar = mockItems.filter(i => i.media_type === 'tv' && i.id !== Number(id));
      return res.json({ results: similar });
    }
    const data = await fetchFromTMDB(`/tv/${id}/similar`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search Movie, TV, or Person
// @route   GET /api/tmdb/search
export const searchMulti = async (req, res) => {
  const { q, type } = req.query;
  if (!q) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  try {
    if (isMockMode()) {
      const query = q.toLowerCase();
      let filtered = mockItems.filter(i =>
        i.title.toLowerCase().includes(query) ||
        i.overview.toLowerCase().includes(query)
      );
      if (type && type !== 'all') {
        filtered = filtered.filter(i => i.media_type === type);
      }
      return res.json({ results: filtered });
    }

    let endpoint = '/search/multi';
    if (type === 'movie') endpoint = '/search/movie';
    if (type === 'tv') endpoint = '/search/tv';
    if (type === 'person') endpoint = '/search/person';

    const data = await fetchFromTMDB(endpoint, { query: q });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Genre Lists
// @route   GET /api/tmdb/genres
export const getGenres = async (req, res) => {
  try {
    if (isMockMode()) {
      return res.json(mockGenres);
    }

    const [movieGenres, tvGenres] = await Promise.all([
      fetchFromTMDB('/genre/movie/list'),
      fetchFromTMDB('/genre/tv/list'),
    ]);

    return res.json({
      movieGenres: movieGenres.genres,
      tvGenres: tvGenres.genres,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Discover Content (by genre, sort order, and page)
// @route   GET /api/tmdb/discover
export const discoverContent = async (req, res) => {
  const { genre, type, sort, page } = req.query;
  const mediaType = type === 'tv' ? 'tv' : 'movie';

  if (isMockMode()) {
    let results = mockItems.filter(i => i.media_type === mediaType);
    if (genre) {
      results = results.filter(i => i.genre_ids.includes(Number(genre)));
    }
    // Simple mock sort
    if (sort === 'vote_average.desc') {
      results.sort((a, b) => b.vote_average - a.vote_average);
    } else {
      // Default mock sort by popularity
      results.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    }
    return res.json({ results });
  }

  const params = {
    page: page || 1,
  };

  if (genre) {
    params.with_genres = genre;
  }

  if (sort) {
    params.sort_by = sort;
  }

  try {
    const data = await fetchFromTMDB(`/discover/${mediaType}`, params);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Person/Actor Details
// @route   GET /api/tmdb/person/:id
export const getPersonDetails = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      // Mock person data
      return res.json({
        id: Number(id),
        name: 'Mock Actor',
        biography: 'This is a mock biography for the actor. In a real implementation, this would contain detailed information about the actor\'s life and career.',
        birthday: '1980-01-15',
        deathday: null,
        gender: 2,
        known_for_department: 'Acting',
        place_of_birth: 'Los Angeles, California, USA',
        popularity: 15.5,
        profile_path: null,
        also_known_as: ['Mock Actor', 'M. Actor'],
        imdb_id: 'nm0000001',
        homepage: null,
      });
    }
    const data = await fetchFromTMDB(`/person/${id}`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Person/Actor Credits (filmography)
// @route   GET /api/tmdb/person/:id/credits
export const getPersonCredits = async (req, res) => {
  const { id } = req.params;
  try {
    if (isMockMode()) {
      // Mock credits data
      return res.json({
        cast: mockItems.slice(0, 8).map(item => ({
          ...item,
          character: 'Main Character',
          order: Math.floor(Math.random() * 10),
        })),
        crew: mockItems.slice(0, 3).map(item => ({
          ...item,
          job: 'Producer',
          department: 'Production',
        })),
      });
    }
    const data = await fetchFromTMDB(`/person/${id}/combined_credits`);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

