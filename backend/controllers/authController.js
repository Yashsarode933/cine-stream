import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const getAccessSecret = () => process.env.JWT_SECRET || 'jwt_secret_fallback_123456';
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret_fallback_123456';

// Helper: Generate Access Token (15 minutes)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, getAccessSecret(), { expiresIn: '15m' });
};

// Helper: Generate Refresh Token (7 days)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, getRefreshSecret(), { expiresIn: '7d' });
};

// Helper: Set Refresh Token Cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Lax is better for development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, plan } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      plan: plan || 'standard',
    });

    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      setRefreshTokenCookie(res, refreshToken);

      return res.status(201).json({
        success: true,
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
        },
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // If registered via Google and has no password
    if (user.googleId && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was registered using Google. Please log in using Google.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Google Authentication (Sign in or Register)
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  const { googleId, email, name, avatar, plan } = req.body;

  try {
    if (!googleId || !email || !name) {
      return res.status(400).json({ success: false, message: 'Invalid Google authentication payload' });
    }

    // Try finding the user by googleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with the same email
      user = await User.findOne({ email });

      if (user) {
        // Link googleId to existing user
        user.googleId = googleId;
        if (!user.name) user.name = name;
        await user.save();
      } else {
        // Create new Google user
        user = await User.create({
          name,
          email,
          googleId,
          avatar: avatar || 'avatar1',
          plan: plan || 'standard',
        });
      }
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    return res.status(500).json({ success: false, message: 'Server error during Google auth' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, getRefreshSecret());
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user._id);
    return res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token verification error:', error.message);
    return res.status(401).json({ success: false, message: 'Refresh token invalid or expired' });
  }
};

// @desc    Logout / clear cookies
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.json({ success: true, message: 'Logged out successfully' });
};
