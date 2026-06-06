import React from 'react';

/**
 * Maturity Rating Badge Component
 * Displays age-appropriate content ratings
 */
const MaturityRating = ({ rating, className = '' }) => {
  // Map TMDB certification to display rating
  const getRatingDisplay = (certification) => {
    const ratings = {
      'G': { label: 'G', color: 'bg-green-600', description: 'General Audiences' },
      'PG': { label: 'PG', color: 'bg-blue-600', description: 'Parental Guidance' },
      'PG-13': { label: 'PG-13', color: 'bg-yellow-600', description: 'Parents Strongly Cautioned' },
      'R': { label: 'R', color: 'bg-orange-600', description: 'Restricted' },
      'NC-17': { label: 'NC-17', color: 'bg-red-600', description: 'Adults Only' },
      'TV-Y': { label: 'TV-Y', color: 'bg-green-600', description: 'All Children' },
      'TV-Y7': { label: 'TV-Y7', color: 'bg-green-600', description: 'Older Children' },
      'TV-G': { label: 'TV-G', color: 'bg-green-600', description: 'General Audience' },
      'TV-PG': { label: 'TV-PG', color: 'bg-blue-600', description: 'Parental Guidance' },
      'TV-14': { label: 'TV-14', color: 'bg-yellow-600', description: 'Parents Strongly Cautioned' },
      'TV-MA': { label: 'TV-MA', color: 'bg-red-600', description: 'Mature Audience' },
    };

    return ratings[certification] || { label: 'NR', color: 'bg-gray-600', description: 'Not Rated' };
  };

  const ratingInfo = getRatingDisplay(rating);

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <span className={`${ratingInfo.color} text-white text-xs font-bold px-2 py-1 rounded`}>
        {ratingInfo.label}
      </span>
      <span className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">
        {ratingInfo.description}
      </span>
    </div>
  );
};

/**
 * Maturity Rating Filter Component
 * Allows users to filter content by maturity rating
 */
export const MaturityRatingFilter = ({ selectedRatings = [], onRatingChange }) => {
  const ratings = [
    { id: 'G', label: 'G' },
    { id: 'PG', label: 'PG' },
    { id: 'PG-13', label: 'PG-13' },
    { id: 'R', label: 'R' },
    { id: 'NC-17', label: 'NC-17' },
    { id: 'TV-Y', label: 'TV-Y' },
    { id: 'TV-Y7', label: 'TV-Y7' },
    { id: 'TV-G', label: 'TV-G' },
    { id: 'TV-PG', label: 'TV-PG' },
    { id: 'TV-14', label: 'TV-14' },
    { id: 'TV-MA', label: 'TV-MA' },
  ];

  const handleToggle = (ratingId) => {
    if (selectedRatings.includes(ratingId)) {
      onRatingChange(selectedRatings.filter(r => r !== ratingId));
    } else {
      onRatingChange([...selectedRatings, ratingId]);
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Maturity Rating
      </h4>
      <div className="flex flex-wrap gap-2">
        {ratings.map((rating) => (
          <button
            key={rating.id}
            onClick={() => handleToggle(rating.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 border ${
              selectedRatings.includes(rating.id)
                ? 'bg-brand-red text-white border-brand-red'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500 hover:text-white'
            }`}
          >
            {rating.label}
          </button>
        ))}
      </div>
      {selectedRatings.length > 0 && (
        <button
          onClick={() => onRatingChange([])}
          className="text-xs text-brand-red hover:underline mt-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default MaturityRating;