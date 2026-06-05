import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a raw axios instance for auth calls to prevent circular dependency with axios.js
const authClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  register: async (name, email, password, plan = 'standard') => {
    set({ loading: true, error: null });
    try {
      const response = await authClient.post('/auth/register', { name, email, password, plan });
      const { accessToken, user } = response.data;
      set({ accessToken, user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      set({ error: errMsg, loading: false });
      return { success: false, message: errMsg };
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authClient.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      set({ accessToken, user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      set({ error: errMsg, loading: false });
      return { success: false, message: errMsg };
    }
  },

  googleLogin: async (googlePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await authClient.post('/auth/google', googlePayload);
      const { accessToken, user } = response.data;
      set({ accessToken, user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Google sign-in failed';
      set({ error: errMsg, loading: false });
      return { success: false, message: errMsg };
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err.message);
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  updateUserProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      // Import axiosInstance dynamically to avoid initial load circular problems
      const { default: api } = await import('../api/axios');
      const response = await api.put('/user/profile', profileData);
      set({ user: response.data.user, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      set({ error: errMsg, loading: false });
      return { success: false, message: errMsg };
    }
  },

  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      // Attempt to refresh the access token first using cookies
      const refreshRes = await authClient.post('/auth/refresh');
      if (refreshRes.data.success) {
        const { accessToken } = refreshRes.data;
        set({ accessToken, isAuthenticated: true });

        // Retrieve user details
        const { default: api } = await import('../api/axios');
        const userRes = await api.get('/user/profile');
        set({ user: userRes.data.user, loading: false });
        return true;
      }
    } catch (err) {
      // If refresh fails, they just aren't logged in
      console.log('No active session found.');
    } finally {
      set({ loading: false });
    }
    return false;
  },
}));
