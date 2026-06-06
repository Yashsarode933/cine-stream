import express from 'express';
import {
  getTrending,
  getMoviesByCategory,
  getTVByCategory,
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
  getTVDetails,
  getTVVideos,
  getTVCredits,
  getSimilarTV,
  searchMulti,
  getGenres,
  discoverContent,
  getPersonDetails,
  getPersonCredits,
} from '../controllers/tmdbController.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// Define TMDB Routes with caching rules

// 30 min cache for lists/feeds
router.get('/trending', cacheMiddleware(1800), getTrending);
router.get('/movies/:category', cacheMiddleware(1800), getMoviesByCategory);
router.get('/tv/:category', cacheMiddleware(1800), getTVByCategory);

// 1 hour cache for details, credits, videos, and recommendations
router.get('/movie/:id', cacheMiddleware(3600), getMovieDetails);
router.get('/movie/:id/videos', cacheMiddleware(3600), getMovieVideos);
router.get('/movie/:id/credits', cacheMiddleware(3600), getMovieCredits);
router.get('/movie/:id/similar', cacheMiddleware(3600), getSimilarMovies);

router.get('/tv/:id', cacheMiddleware(3600), getTVDetails);
router.get('/tv/:id/videos', cacheMiddleware(3600), getTVVideos);
router.get('/tv/:id/credits', cacheMiddleware(3600), getTVCredits);
router.get('/tv/:id/similar', cacheMiddleware(3600), getSimilarTV);

// Genres list cached for 1 hour
router.get('/genres', cacheMiddleware(3600), getGenres);

// Discover cached for 30 minutes
router.get('/discover', cacheMiddleware(1800), discoverContent);

// Search is real-time (no caching)
router.get('/search', searchMulti);

// Person/Actor routes (1 hour cache)
router.get('/person/:id', cacheMiddleware(3600), getPersonDetails);
router.get('/person/:id/credits', cacheMiddleware(3600), getPersonCredits);

export default router;
