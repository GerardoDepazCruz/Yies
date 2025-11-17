import { useState, useEffect } from 'react';
import { getMovieById } from '../services/omdb';

export const useMovieDetail = ({ id }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const movieData = await getMovieById({ id });
        setMovie(movieData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]); // Se ejecuta cada vez que el 'id' de la URL cambie

  return { movie, loading, error };
};