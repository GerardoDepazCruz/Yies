import React from 'react';
import { MovieCard } from './MovieCard';

export const MovieList = ({ movies }) => {
  const hasMovies = movies?.length > 0;

  return (
    hasMovies
      ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              id={movie.id}
              title={movie.title}
              year={movie.year}
              poster={movie.poster}
            />
          ))}
        </div>
      )
      : (
        <p className="text-center text-gray-400 text-2xl mt-10">
          No se encontraron películas.
        </p>
      )
  );
};