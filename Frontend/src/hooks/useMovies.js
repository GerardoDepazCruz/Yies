import { useState, useRef, useCallback } from 'react';
import { searchMovies } from '../services/omdb';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFirstSearch, setIsFirstSearch] = useState(true);
  const previousSearch = useRef(null);

  const getMovies = useCallback(async ({ search }) => {
    if (search === previousSearch.current) return;

    try {
      // En cuanto 'getMovies' se llama, ya no es la primera búsqueda
      setIsFirstSearch(false); 
      setLoading(true);
      setError(null);
      previousSearch.current = search;
      
      const newMovies = await searchMovies({ search });
      setMovies(newMovies);
      
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Devolvemos el nuevo estado
  return { movies, loading, error, getMovies, isFirstSearch };
};