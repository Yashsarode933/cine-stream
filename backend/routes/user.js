import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getWatchHistory,
  logWatchHistory,
  addOrUpdateRating,
  getRatings,
  getProfile,
  updateProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply route protection middleware to all user routes
router.use(protect);

// Watchlist routes
router.route('/watchlist')
  .get(getWatchlist)
  .post(addToWatchlist);
router.delete('/watchlist/:tmdbId', removeFromWatchlist);

// History routes
router.route('/history')
  .get(getWatchHistory)
  .post(logWatchHistory);

// Rating routes
router.put('/rating', addOrUpdateRating);
router.get('/ratings', getRatings);

// Profile routes
router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

export default router;
