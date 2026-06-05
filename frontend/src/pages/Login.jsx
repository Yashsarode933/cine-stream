import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Chrome } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { login, googleLogin, loading, error, setError, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    // Check if Google Client ID is configured in the environment
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.log('VITE_GOOGLE_CLIENT_ID not found. Simulating Google OAuth Sign-in.');
      // Simulating a successful Google login response for portfolio presentation ease
      const mockPayload = {
        googleId: 'google_1122334455',
        email: 'google.demo.user@cinestream.com',
        name: 'John Doe (Google Demo)',
        avatar: 'avatar3',
        plan: 'premium'
      };

      const res = await googleLogin(mockPayload);
      if (res.success) {
        navigate('/');
      }
      return;
    }

    // Google GIS authentication flow
    try {
      // In production/Google configured environment, we load GIS library
      window.google?.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            // Fetch profile data using token, then login
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const profile = await userInfoRes.json();
            const payload = {
              googleId: profile.sub,
              email: profile.email,
              name: profile.name,
              avatar: 'avatar3',
            };
            const res = await googleLogin(payload);
            if (res.success) navigate('/');
          }
        },
      }).requestAccessToken();
    } catch (err) {
      setError('Google Sign-in failed. Please use standard email login or check credentials.');
    }
  };

  return (
    <div 
      className="relative min-h-screen bg-brand-black flex items-center justify-center px-4"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(20, 20, 20, 0.7) 0%, rgba(20, 20, 20, 0.7) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/7ca5b7c7-e7e0-4e20-9832-98b6f618482b/9a764d08-7d7b-4ad3-b183-5c7429177a1d/US-en-20240326-popsignuptwoweeks-perspective_yca_small.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header Logo */}
      <div className="absolute top-0 left-0 p-6 z-10">
        <h1 className="text-brand-red font-display text-4xl sm:text-5xl tracking-wider select-none cursor-pointer" onClick={() => navigate('/landing')}>
          CINESTREAM
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[450px] glass-card px-8 py-16 rounded-lg text-white z-10">
        <h2 className="text-3xl font-bold mb-8">Sign In</h2>

        {error && (
          <div className="bg-orange-600/20 border border-orange-600/50 text-orange-200 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email"
              value={email}
              onChange={(e) => {
                clearError();
                setEmail(e.target.value);
              }}
              placeholder="Email address"
              className="w-full bg-[#333] hover:bg-[#444] focus:bg-[#444] border-b-2 border-transparent focus:border-brand-red focus:outline-none px-5 py-4 rounded text-white placeholder-gray-400 transition"
              required
            />
          </div>

          <div>
            <input 
              type="password"
              value={password}
              onChange={(e) => {
                clearError();
                setPassword(e.target.value);
              }}
              placeholder="Password"
              className="w-full bg-[#333] hover:bg-[#444] focus:bg-[#444] border-b-2 border-transparent focus:border-brand-red focus:outline-none px-5 py-4 rounded text-white placeholder-gray-400 transition"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-red-700 disabled:bg-brand-red/50 text-white font-semibold py-3.5 rounded transition mt-4 flex items-center justify-center"
          >
            {loading ? <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div> : 'Sign In'}
          </button>
        </form>

        {/* OAuth Buttons */}
        <div className="mt-6">
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3.5 rounded transition flex items-center justify-center gap-3 mt-3 shadow"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            Continue with Google
          </button>
        </div>

        {/* Remember me & Help */}
        <div className="flex items-center justify-between text-brand-gray text-xs mt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-brand-red rounded bg-[#333] border-transparent"
            />
            Remember me
          </label>
          <span className="hover:underline cursor-pointer">Need help?</span>
        </div>

        {/* Footer Link */}
        <div className="text-brand-gray mt-12 text-sm">
          New to CineStream?{' '}
          <Link to="/register" className="text-white hover:underline font-semibold">
            Sign up now
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Login;
