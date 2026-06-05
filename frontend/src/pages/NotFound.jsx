import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-md">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[120px] sm:text-[180px] font-extrabold leading-none text-brand-red/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-white">Page Not Found</span>
          </div>
        </div>

        {/* Message */}
        <p className="text-brand-gray text-sm sm:text-base leading-relaxed">
          The page you're looking for doesn't exist or has been moved to a different URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded transition border border-zinc-700 hover:border-zinc-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white font-semibold px-6 py-3 rounded transition"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
