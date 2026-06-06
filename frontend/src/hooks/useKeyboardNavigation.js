import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../store/uiStore';

/**
 * Custom hook for global keyboard navigation
 * Provides Netflix-like keyboard controls for the application
 */
export const useKeyboardNavigation = () => {
  const navigate = useNavigate();
  const { closeDetailModal, activeModalItem } = useUiStore();

  // Handle key down events
  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey } = event;

    // Close modal with Escape
    if (key === 'Escape' && activeModalItem) {
      event.preventDefault();
      closeDetailModal();
      return;
    }

    // Navigation shortcuts (only when not in input/textarea)
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
    if (isInput) return;

    // Go to home page with 'g' + 'h' (like GitHub)
    if (key === 'h' && (ctrlKey || metaKey)) {
      event.preventDefault();
      navigate('/');
      return;
    }

    // Go to search with '/' or 'g' + 's'
    if ((key === '/' && !isInput) || (key === 's' && (ctrlKey || metaKey))) {
      event.preventDefault();
      navigate('/search');
      // Focus search input after navigation
      setTimeout(() => {
        const searchInput = document.querySelector('input[placeholder="Search..."]');
        if (searchInput) searchInput.focus();
      }, 100);
      return;
    }

    // Go to My List with 'g' + 'm'
    if (key === 'm' && (ctrlKey || metaKey)) {
      event.preventDefault();
      navigate('/mylist');
      return;
    }

    // Go to Profile with 'g' + 'p'
    if (key === 'p' && (ctrlKey || metaKey)) {
      event.preventDefault();
      navigate('/profile');
      return;
    }

    // Arrow key navigation for content rows
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const activeRow = document.querySelector('.movie-card-row:hover');
      if (activeRow) {
        event.preventDefault();
        const scrollAmount = activeRow.clientWidth * 0.8;
        const direction = key === 'ArrowLeft' ? -1 : 1;
        activeRow.scrollBy({
          left: direction * scrollAmount,
          behavior: 'smooth',
        });
      }
    }

    // Tab navigation enhancement for cards
    if (key === 'Tab') {
      const focusedCard = document.activeElement.closest('.movie-card');
      if (focusedCard) {
        // Add visual focus indicator
        focusedCard.style.outline = '2px solid #E50914';
        focusedCard.style.outlineOffset = '2px';
      }
    }
  }, [navigate, closeDetailModal, activeModalItem]);

  // Set up event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

/**
 * Hook for horizontal scroll navigation with keyboard
 * To be used on content rows
 */
export const useRowKeyboardNavigation = (rowRef) => {
  const handleKeyDown = useCallback((event) => {
    if (!rowRef.current) return;

    // Only handle if a card in this row is focused
    if (!rowRef.current.contains(document.activeElement)) return;

    const { key } = event;
    const cardWidth = 200; // Approximate card width including gap

    if (key === 'ArrowRight') {
      event.preventDefault();
      rowRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth',
      });
    } else if (key === 'ArrowLeft') {
      event.preventDefault();
      rowRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth',
      });
    }
  }, [rowRef]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    row.addEventListener('keydown', handleKeyDown);
    return () => {
      row.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, rowRef]);
};

export default useKeyboardNavigation;