import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

export const useUserActions = () => {
  const queryClient = useQueryClient();

  // 1. WATCHLIST
  const useWatchlist = () => useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/user/watchlist');
      return data.watchlist || [];
    },
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: async (item) => {
      const { data } = await axiosInstance.post('/user/watchlist', item);
      return data.watchlistItem;
    },
    onSuccess: () => {
      // Invalidate watchlist cache to trigger automatic refetch
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (tmdbId) => {
      const { data } = await axiosInstance.delete(`/user/watchlist/${tmdbId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  // 2. WATCH HISTORY
  const useHistory = () => useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/user/history');
      return data.history || [];
    },
  });

  const logHistoryMutation = useMutation({
    mutationFn: async (historyData) => {
      const { data } = await axiosInstance.post('/user/history', historyData);
      return data.historyItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  // 3. RATINGS
  const useRatings = () => useQuery({
    queryKey: ['ratings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/user/ratings');
      return data.ratings || [];
    },
  });

  const rateContentMutation = useMutation({
    mutationFn: async (ratingData) => {
      const { data } = await axiosInstance.put('/user/rating', ratingData);
      return data.ratingItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    },
  });

  return {
    useWatchlist,
    addToWatchlist: addToWatchlistMutation.mutateAsync,
    isAddingToWatchlist: addToWatchlistMutation.isPending,
    removeFromWatchlist: removeFromWatchlistMutation.mutateAsync,
    isRemovingFromWatchlist: removeFromWatchlistMutation.isPending,
    
    useHistory,
    logHistory: logHistoryMutation.mutateAsync,
    
    useRatings,
    rateContent: rateContentMutation.mutateAsync,
  };
};
