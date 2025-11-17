import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { searchMovies } from "../services/omdb";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

export const HeaderSearchBar = ({ onSearchComplete }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);

  // Efecto para buscar en la API
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setIsLoading(true);
      searchMovies({ search: debouncedQuery })
        .then((newMovies) => {
          setResults(newMovies || []);
          setIsLoading(false);
          setIsDropdownOpen(true);
        })
        .catch((error) => {
          console.error("Error en la búsqueda:", error.message);
          setIsLoading(false);
          setResults([]);
          setIsDropdownOpen(true);
        });
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length > 0) {
      navigate(`/search?q=${query}`);
      setQuery("");
      setResults([]);
      setIsDropdownOpen(false);

      if (onSearchComplete) {
        onSearchComplete();
      }
    }
  };

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setIsDropdownOpen(false);

    if (onSearchComplete) {
      onSearchComplete();
    }
  };


  const handleBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full lg:w-64">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={handleBlur}
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </div>
      </div>

      {/* EL DROPDOWN DE RESULTADOS */}
      {isDropdownOpen && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && <p className="p-4 text-gray-300">Buscando...</p>}

          {!isLoading && results.length > 0 && (
            <ul>
              {results.slice(0, 5).map((movie) => (
                <li
                  key={movie.id}
                  className="border-b border-gray-600 last:border-b-0"
                >
                  <Link
                    to={`/movie/${movie.id}`}
                    onClick={handleResultClick}
                    className="flex items-center p-3 hover:bg-gray-600 transition-colors"
                  >
                    <img
                      src={
                        movie.poster === "N/A"
                          ? "https://via.placeholder.com/50x75"
                          : movie.poster
                      }
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded mr-3"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/50x75.png?text=No+Poster";
                      }}
                    />
                    <div>
                      <p className="text-white font-semibold">{movie.title}</p>
                      <p className="text-gray-400 text-sm">{movie.year}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Botón "Ver más resultados" */}
          {!isLoading && results.length > 5 && (
            <Link
              to={`/search?q=${query}`}
              onClick={handleResultClick}
              className="block p-4 text-center font-bold text-yellow-400 hover:bg-gray-600 rounded-b-lg"
            >
              Ver más resultados ({results.length})
            </Link>
          )}

          {!isLoading && results.length === 0 && debouncedQuery.length > 2 && (
            <p className="p-4 text-gray-300">No se encontraron resultados.</p>
          )}
        </div>
      )}
    </form>
  );
};
