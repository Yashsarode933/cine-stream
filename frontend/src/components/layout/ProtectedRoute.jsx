import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  // Show a full-screen loading spinner while restoring auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Netflix Logo / Text placeholder */}
          <h1 className="text-brand-red font-display text-6xl tracking-wider mb-8 animate-pulse">
            CINESTREAM
          </h1>
          <div className="w-16 h-16 border-t-4 border-brand-red border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  return children;
};

export default ProtectedRoute;
