import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="relative flex-shrink-0 w-[140px] sm:w-[200px] aspect-[2/3] bg-zinc-800 rounded-md overflow-hidden animate-pulse">
      {/* Aspect placeholder shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
    </div>
  );
};

export const RowSkeleton = ({ title = 'Loading...' }) => {
  return (
    <div className="space-y-2 py-4 pl-4 sm:pl-12">
      {/* Title placeholder */}
      <div className="h-6 w-40 bg-zinc-800 rounded animate-pulse"></div>
      
      {/* Horizontal row list of skeletons */}
      <div className="flex gap-4 overflow-hidden py-2 scrollbar-hide">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[56.25vw] min-h-[400px] max-h-[800px] bg-zinc-900 animate-pulse flex items-end">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-black/30"></div>
      <div className="relative z-10 w-full max-w-2xl px-6 sm:px-12 pb-16 space-y-4">
        <div className="h-12 w-64 bg-zinc-800 rounded"></div>
        <div className="h-4 w-96 bg-zinc-800 rounded"></div>
        <div className="h-4 w-80 bg-zinc-800 rounded"></div>
        <div className="flex gap-3">
          <div className="h-12 w-28 bg-zinc-800 rounded"></div>
          <div className="h-12 w-32 bg-zinc-800 rounded"></div>
        </div>
      </div>
    </div>
  );
};
