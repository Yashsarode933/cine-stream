import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const ContentRow = ({ title, items = [], mediaType = 'movie' }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Function to inspect scroll coordinates and update arrow visibility
  const updateArrowsVisibility = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const rowEl = rowRef.current;
    if (rowEl) {
      updateArrowsVisibility();
      rowEl.addEventListener('scroll', updateArrowsVisibility);
      
      const resizeObserver = new ResizeObserver(() => updateArrowsVisibility());
      resizeObserver.observe(rowEl);

      return () => {
        rowEl.removeEventListener('scroll', updateArrowsVisibility);
        resizeObserver.disconnect();
      };
    }
  }, [items]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="py-2 pl-4 sm:pl-12 relative group/row">
      {/* Category Title */}
      <h3 className="text-sm sm:text-2xl font-bold text-[#e5e5e5] hover:text-white transition-colors cursor-pointer select-none">
        {title}
      </h3>

      {/* Row Wrapper */}
      <div className="relative">
        
        {/* Left Scroll Trigger Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 bg-black/50 hover:bg-black/70 flex items-center justify-center text-white z-30 transition-all duration-200 opacity-0 group-hover/row:opacity-100 hover:scale-105 rounded-r border-r border-white/5"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        )}

        {/* Right Scroll Trigger Arrow */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 bg-black/50 hover:bg-black/70 flex items-center justify-center text-white z-30 transition-all duration-200 opacity-0 group-hover/row:opacity-100 hover:scale-105 rounded-l border-l border-white/5"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        )}

        {/* Horizontal Card Track */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hide pt-20 pb-12 scroll-smooth movie-card-row"
        >
          {items.map((item, index) => {
            // Dynamic translation sizing calculation based on viewport width
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
            const tDist = isMobile ? 24 : 36; // Shifting amount
            
            let xTranslation = 0;
            if (hoveredIndex !== null && hoveredIndex !== index) {
              if (hoveredIndex === 0) {
                // First card hovered: translate all rightward siblings by double spacing
                if (index > 0) xTranslation = tDist * 2;
              } else if (hoveredIndex === items.length - 1) {
                // Last card hovered: translate all leftward siblings by double spacing
                if (index < items.length - 1) xTranslation = -tDist * 2;
              } else {
                // Middle card hovered: shift leftward items left, rightward items right
                if (index < hoveredIndex) {
                  xTranslation = -tDist;
                } else if (index > hoveredIndex) {
                  xTranslation = tDist;
                }
              }
            }

            return (
              <MovieCard 
                key={item.id || `movie-${index}`}
                item={item}
                mediaType={mediaType}
                index={index}
                isHovered={hoveredIndex === index}
                hoveredIndex={hoveredIndex}
                xTranslation={xTranslation}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                totalItems={items.length}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContentRow;
