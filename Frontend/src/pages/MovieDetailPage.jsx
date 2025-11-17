import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { Spinner } from "../components/Spinner";
import { MovieCarousel } from "../components/MovieCarousel";

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const MovieDetailPage = () => {
  const { id } = useParams();
  const { movie, loading, error } = useMovieDetail({ id });
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-2xl h-[60vh]">
        <p>{error}</p>
        <Link to="/" className="text-yellow-400 text-lg mt-4 block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const placeholderImage =
    "https://via.placeholder.com/400x600.png?text=No+Poster";
  const imageUrl = movie.poster === "N/A" ? placeholderImage : movie.poster;

  const mainGenre = movie.genre?.split(", ")[0];

  return (
    <>
      {/* BOTÓN VOLVER */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 font-semibold mb-6 transition-colors duration-200"
      >
        <BackArrowIcon />
        Volver
      </button>

      <article className="bg-gray-700 shadow-xl rounded-lg overflow-hidden md:max-w-6xl mx-auto">
        <div className="md:flex">
          {/* Columna Izquierda: Poster */}
          <div className="md:w-1/3">
            <img
              src={imageUrl}
              alt={`Poster de ${movie.title}`}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Columna Derecha: Información */}
          <div className="md:w-2/3 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            <p className="text-2xl text-gray-400 mb-4">{movie.year}</p>

            {/* Píldoras de Info (Género, Duración) */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-gray-600 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                {movie.runtime}
              </span>
              {movie.genre?.split(", ").map((g) => (
                <span
                  key={g}
                  className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Trama (Plot) */}
            <h3 className="text-xl font-semibold text-white mb-2">Trama</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{movie.plot}</p>

            {/* Más Detalles (Director, Actores) */}
            <div className="border-t border-gray-600 pt-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-white">Director:</strong>{" "}
                {movie.director}
              </p>
              <p className="text-gray-300">
                <strong className="text-white">Actores:</strong> {movie.actors}
              </p>
            </div>

            {/* Ratings */}
            <div className="flex gap-4 mt-6 pt-4 border-t border-gray-600">
              {movie.rating && movie.rating !== "N/A" && (
                <div className="text-center">
                  <span className="text-3xl font-bold text-yellow-400">
                    {movie.rating}
                  </span>
                  <span className="text-gray-400 block text-sm">/ 10</span>
                  <span className="text-gray-300 block text-sm font-semibold">
                    IMDb
                  </span>
                </div>
              )}
              {movie.metascore && movie.metascore !== "N/A" && (
                <div className="text-center">
                  <span className="bg-green-600 text-white text-3xl font-bold px-3 py-1 rounded">
                    {movie.metascore}
                  </span>
                  <span className="text-gray-300 block text-sm font-semibold mt-1">
                    Metascore
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
      {/* CARRUSEL DE GÉNERO SIMILAR */}
      {mainGenre && (
        <div className="w-full mt-16">
          <MovieCarousel
            title={`Más del género: ${mainGenre}`}
            searchTerm={mainGenre}
          />
        </div>
      )}
    </>
  );
};

export default MovieDetailPage;
