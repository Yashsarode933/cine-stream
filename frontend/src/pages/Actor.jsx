import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Star, ExternalLink, Film } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import MovieCard from '../components/content/MovieCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { usePersonDetailsQuery, usePersonCreditsQuery } from '../hooks/useTMDB';

const Actor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: person, isLoading: loadingPerson } = usePersonDetailsQuery(id);
  const { data: credits, isLoading: loadingCredits } = usePersonCreditsQuery(id);

  if (loadingPerson || loadingCredits) {
    return (
      <div className="min-h-screen bg-brand-black text-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 pt-28 space-y-8">
          <CardSkeleton />
        </main>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Actor not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-brand-red hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop';

  const knownFor = credits?.cast?.slice(0, 12) || [];
  const genderMap = { 0: 'Non-binary', 1: 'Female', 2: 'Male', 3: 'Non-binary' };

  return (
    <div className="min-h-screen bg-brand-black text-white pb-24">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-28 space-y-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-gray hover:text-white transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Actor Profile Header */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <img
              src={profileUrl}
              alt={person.name}
              className="w-full max-w-md mx-auto rounded-lg shadow-2xl border border-white/10"
            />
          </motion.div>

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-netflix-sans mb-2">
                {person.name}
              </h1>
              {person.also_known_as?.length > 0 && (
                <p className="text-sm text-brand-gray">
                  Also known as: {person.also_known_as.slice(0, 3).join(', ')}
                </p>
              )}
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-brand-gray uppercase tracking-wider">Known For</p>
                <p className="font-semibold">{person.known_for_department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-brand-gray uppercase tracking-wider">Gender</p>
                <p className="font-semibold">{genderMap[person.gender] || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-brand-gray uppercase tracking-wider">Born</p>
                <p className="font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {person.birthday
                    ? new Date(person.birthday).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
              {person.deathday && (
                <div className="space-y-1">
                  <p className="text-xs text-brand-gray uppercase tracking-wider">Died</p>
                  <p className="font-semibold">
                    {new Date(person.deathday).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-brand-gray uppercase tracking-wider">Birthplace</p>
                <p className="font-semibold text-sm">{person.place_of_birth || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-brand-gray uppercase tracking-wider">Popularity</p>
                <p className="font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  {person.popularity?.toFixed(1)}
                </p>
              </div>
            </div>

            {/* External Links */}
            {person.imdb_id && (
              <a
                href={`https://www.imdb.com/name/${person.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-red hover:text-red-400 transition text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                View on IMDb
              </a>
            )}
          </motion.div>
        </section>

        {/* Biography */}
        {person.biography && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Film className="w-6 h-6 text-brand-red" />
              Biography
            </h2>
            <p className="text-gray-300 leading-relaxed max-w-4xl">
              {person.biography}
            </p>
          </section>
        )}

        {/* Known For / Filmography */}
        {knownFor.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">
              Known For
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {knownFor.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  mediaType={item.media_type || (item.title ? 'movie' : 'tv')}
                />
              ))}
            </div>
          </section>
        )}

        {/* Acting Credits */}
        {credits?.cast?.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">
              Acting Credits
            </h2>
            <div className="space-y-3">
              {credits.cast.slice(0, 20).map((credit) => {
                const posterPath = credit.poster_path || credit.profile_path;
                const posterUrl = posterPath
                  ? `https://image.tmdb.org/t/p/w92${posterPath}`
                  : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200&auto=format&fit=crop';
                
                const title = credit.title || credit.name || 'Unknown';
                const character = credit.character || 'Unknown Character';
                const year = credit.release_date?.split('-')[0] || credit.first_air_date?.split('-')[0] || 'N/A';

                return (
                  <Link
                    key={credit.id}
                    to={`/genre/${credit.media_type || 'movie'}/${credit.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition group"
                  >
                    <img
                      src={posterUrl}
                      alt={title}
                      className="w-12 h-18 object-cover rounded border border-white/10"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-brand-red transition">
                        {title}
                      </h4>
                      <p className="text-sm text-brand-gray">{character}</p>
                      <p className="text-xs text-gray-500 mt-1">{year}</p>
                    </div>
                    {credit.vote_average && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="font-semibold">
                          {Math.round(credit.vote_average * 10)}%
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Actor;