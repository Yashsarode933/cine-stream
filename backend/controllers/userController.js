import Watchlist from '../models/Watchlist.js';
import WatchHistory from '../models/WatchHistory.js';
import Rating from '../models/Rating.js';
import User from '../models/User.js';

// ==========================================
// 1. WATCHLIST (CRUD)
// ==========================================

// @desc    Get user's watchlist
// @route   GET /api/user/watchlist
// @access  Protected
export const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user._id }).sort({ addedAt: -1 });
    return res.json({ success: true, watchlist });
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving watchlist' });
  }
};

// @desc    Add title to watchlist
// @route   POST /api/user/watchlist
// @access  Protected
export const addToWatchlist = async (req, res) => {
  const { tmdbId, mediaType, title, posterPath } = req.body;

  if (!tmdbId || !mediaType || !title) {
    return res.status(400).json({ success: false, message: 'Please provide tmdbId, mediaType, and title' });
  }

  try {
    const watchlistItem = await Watchlist.findOneAndUpdate(
      { userId: req.user._id, tmdbId },
      { mediaType, title, posterPath, addedAt: new Date() },
      { upsert: true, new: true }
    );

    return res.status(201).json({ success: true, watchlistItem });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return res.status(500).json({ success: false, message: 'Server error adding to watchlist' });
  }
};

// @desc    Remove title from watchlist
// @route   DELETE /api/user/watchlist/:tmdbId
// @access  Protected
export const removeFromWatchlist = async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const deleted = await Watchlist.findOneAndDelete({ userId: req.user._id, tmdbId: Number(tmdbId) });
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Watchlist item not found' });
    }

    return res.json({ success: true, message: 'Item removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return res.status(500).json({ success: false, message: 'Server error removing from watchlist' });
  }
};

// ==========================================
// 2. WATCH HISTORY
// ==========================================

// @desc    Get user's watch history
// @route   GET /api/user/history
// @access  Protected
export const getWatchHistory = async (req, res) => {
  try {
    const history = await WatchHistory.find({ userId: req.user._id }).sort({ watchedAt: -1 });
    return res.json({ success: true, history });
  } catch (error) {
    console.error('Error getting history:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving watch history' });
  }
};

// @desc    Log a watched title (upsert progress)
// @route   POST /api/user/history
// @access  Protected
export const logWatchHistory = async (req, res) => {
  const { tmdbId, mediaType, title, posterPath, progress } = req.body;

  if (!tmdbId || !mediaType || !title) {
    return res.status(400).json({ success: false, message: 'Please provide tmdbId, mediaType, and title' });
  }

  try {
    const historyItem = await WatchHistory.findOneAndUpdate(
      { userId: req.user._id, tmdbId },
      {
        mediaType,
        title,
        posterPath,
        progress: progress !== undefined ? progress : 0,
        watchedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return res.json({ success: true, historyItem });
  } catch (error) {
    console.error('Error logging history:', error);
    return res.status(500).json({ success: false, message: 'Server error logging watch history' });
  }
};

// ==========================================
// 3. RATINGS
// ==========================================

// @desc    Add or update rating (like/dislike)
// @route   PUT /api/user/rating
// @access  Protected
export const addOrUpdateRating = async (req, res) => {
  const { tmdbId, mediaType, rating } = req.body;

  if (!tmdbId || !mediaType || !rating) {
    return res.status(400).json({ success: false, message: 'Please provide tmdbId, mediaType, and rating' });
  }

  if (!['like', 'dislike'].includes(rating)) {
    return res.status(400).json({ success: false, message: 'Rating must be either like or dislike' });
  }

  try {
    const ratingItem = await Rating.findOneAndUpdate(
      { userId: req.user._id, tmdbId },
      { mediaType, rating, createdAt: new Date() },
      { upsert: true, new: true }
    );

    return res.json({ success: true, ratingItem });
  } catch (error) {
    console.error('Error rating content:', error);
    return res.status(500).json({ success: false, message: 'Server error rating content' });
  }
};

// = desc    Get ratings list for current user
// @route   GET /api/user/ratings
// @access  Protected
export const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.user._id });
    return res.json({ success: true, ratings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error getting ratings' });
  }
};

// ==========================================
// 4. USER PROFILE
// ==========================================

// @desc    Get user profile data
// @route   GET /api/user/profile
// @access  Protected
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

// @desc    Update avatar, display name, or plan
// @route   PUT /api/user/profile
// @access  Protected
export const updateProfile = async (req, res) => {
  const { name, avatar, plan } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (plan) user.plan = plan;

    const updatedUser = await user.save();

    return res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        plan: updatedUser.plan,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};
