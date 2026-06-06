import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';

// Layout / Pages
import ErrorBoundary from './components/ui/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Genre from './pages/Genre';
import Actor from './pages/Actor';
import MyList from './pages/MyList';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import DetailModal from './components/content/DetailModal';

// Create TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes cache stale time
    },
  },
});

// Inner component that uses router-dependent hooks
const AppRoutes = () => {
  // Initialize global keyboard navigation (must be inside Router context)
  useKeyboardNavigation();

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Authentication / Marketing Routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Application Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/genre/:type/:id" 
          element={
            <ProtectedRoute>
              <Genre />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/actor/:id" 
          element={
            <ProtectedRoute>
              <Actor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mylist" 
          element={
            <ProtectedRoute>
              <MyList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* 404 Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global Movie/TV Show Details Modal */}
      <DetailModal />
    </ErrorBoundary>
  );
};

// Main App component
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Run on mount to check if user has active refresh token cookie
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;