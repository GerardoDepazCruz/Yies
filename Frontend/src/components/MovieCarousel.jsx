import React from "react";
import { useMovieCategory } from "../hooks/useMovieCategory";
import { MovieCard } from "./MovieCard";
import { Spinner } from "./Spinner";

export const MovieCarousel = ({ title, searchTerm }) => {
  const { movies, loading, error } = useMovieCategory({ search: searchTerm });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-72">
          <Spinner />
        </div>
      );
    }

    if (error || !movies || movies.length === 0) {
      return (
        <p className="text-gray-500 h-72 flex items-center justify-center">
          No se pudieron cargar películas para esta categoría.
        </p>
      );
    }

    return (
      <div
        className="
          flex overflow-x-auto space-x-6 py-4 
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-track]:bg-gray-700
          [&::-webkit-scrollbar-thumb]:bg-yellow-400
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-track]:rounded-full
        "
      >
        {movies.map((movie) => (
          <div key={movie.id} className="shrink-0 w-60">
            <MovieCard {...movie} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mb-8">
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      {renderContent()}
    </div>
  );
};
