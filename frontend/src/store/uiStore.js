import { create } from 'zustand';

export const useUiStore = create((set) => ({
  searchQuery: '',
  isSearchExpanded: false,
  activeModalItem: null, // Holds movie or tv data for DetailModal
  activeModalType: 'movie', // 'movie' or 'tv'

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSearchExpanded: (expanded) => set({ isSearchExpanded: expanded }),
  
  openDetailModal: (item, mediaType = 'movie') => {
    // Determine exact media type (might be in item.media_type or passed explicitly)
    const type = item.media_type || mediaType;
    set({ activeModalItem: item, activeModalType: type });
  },
  
  closeDetailModal: () => set({ activeModalItem: null }),
}));
