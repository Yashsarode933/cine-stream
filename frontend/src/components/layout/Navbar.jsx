import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, ChevronDown, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import NotificationPanel from '../ui/NotificationPanel';

const avatars = {
  avatar1: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
  avatar2: 'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88151s9r7640243e.jpg',
  avatar3: 'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg',
  avatar4: 'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-vnl1thqiej011wre.jpg',
  avatar5: 'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-2ygzwtcfuctu10uq.jpg',
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const { searchQuery, setSearchQuery, isSearchExpanded, setSearchExpanded } = useUiStore();
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Scroll effect to transition transparent-to-solid
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync navigation on search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() !== '') {
      if (location.pathname !== '/search') {
        navigate('/search');
      }
    } else {
      if (location.pathname === '/search') {
        navigate('/');
      }
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/landing');
  };

  const currentAvatar = avatars[user?.avatar] || avatars.avatar1;

  return (
    <nav 
      className={`fixed top-0 w-full z-40 transition-colors duration-300 px-6 sm:px-12 py-4 flex items-center justify-between ${
        isScrolled ? 'bg-brand-black shadow-md border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      {/* Left side: Logo & Navigation Links */}
      <div className="flex items-center gap-8">
        <h1 
          onClick={() => { setSearchQuery(''); navigate('/'); }}
          className="text-brand-red font-display text-3xl sm:text-4xl tracking-wider select-none cursor-pointer hover:opacity-90 transition-opacity"
        >
          CINESTREAM
        </h1>

        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link 
            to="/" 
            className={`transition-colors ${location.pathname === '/' && !searchQuery ? 'text-white font-semibold' : 'text-brand-gray hover:text-gray-300'}`}
          >
            Home
          </Link>
          <Link 
            to="/genre/tv/all" 
            className={`transition-colors ${location.pathname.startsWith('/genre/tv') ? 'text-white font-semibold' : 'text-brand-gray hover:text-gray-300'}`}
          >
            TV Shows
          </Link>
          <Link 
            to="/genre/movie/all" 
            className={`transition-colors ${location.pathname.startsWith('/genre/movie') ? 'text-white font-semibold' : 'text-brand-gray hover:text-gray-300'}`}
          >
            Movies
          </Link>
          <Link 
            to="/mylist" 
            className={`transition-colors ${location.pathname === '/mylist' ? 'text-white font-semibold' : 'text-brand-gray hover:text-gray-300'}`}
          >
            My List
          </Link>
        </div>
      </div>

      {/* Right side: Search, Notifications & Profile Dropdown */}
      <div className="flex items-center gap-5">
        
        {/* Search Bar */}
        <div className="flex items-center bg-black/40 border border-white/20 rounded px-2.5 py-1.5 transition-all duration-300">
          <button 
            onClick={() => {
              setSearchExpanded(!isSearchExpanded);
              if (!isSearchExpanded) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }
            }}
            className="text-white hover:opacity-85 focus:outline-none"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <input 
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Titles, people, genres..."
            className={`bg-transparent text-sm text-white focus:outline-none transition-width duration-300 placeholder-gray-400 ${
              isSearchExpanded || searchQuery ? 'w-40 sm:w-64 ml-2.5 opacity-100' : 'w-0 opacity-0 pointer-events-none'
            }`}
          />
        </div>

        {/* Notifications Panel */}
        <NotificationPanel />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 focus:outline-none"
          >
            <img 
              src={currentAvatar} 
              alt="Profile" 
              className="w-8 h-8 rounded object-cover border border-white/10"
            />
            <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-brand-black/95 border border-white/10 rounded-md shadow-xl py-2 text-sm z-50">
              <div className="px-4 py-2 border-b border-white/10 flex flex-col">
                <span className="font-semibold text-white truncate">{user?.name}</span>
                <span className="text-xs text-brand-gray truncate">{user?.email}</span>
                <span className="text-[10px] text-brand-red font-bold uppercase mt-1">
                  Plan: {user?.plan || 'Standard'}
                </span>
              </div>
              
              <Link 
                to="/profile" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-brand-gray hover:text-white hover:bg-zinc-800 transition"
              >
                <Settings className="w-4 h-4" />
                Manage Profiles
              </Link>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-brand-gray hover:text-white hover:bg-zinc-800 transition border-t border-white/10 mt-1"
              >
                <LogOut className="w-4 h-4 text-brand-red" />
                Sign Out of CineStream
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
export { avatars };
