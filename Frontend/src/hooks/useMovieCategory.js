import { useState, useEffect } from 'react';
import { searchMovies } from '../services/omdb';

export const useMovieCategory = ({ search, type }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const newMovies = await searchMovies({ search, type });
        // La API a veces devuelve solo 10, tomamos los primeros 8 para un carrusel limpio.
        if (newMovies) {
          setMovies(newMovies.slice(0, 8));
        } else {
          setMovies([]);
        }
        
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [search, type]); // Se ejecuta cada vez que 'search' o 'type' cambien

  return { movies, loading, error };
};