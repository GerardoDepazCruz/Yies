import { useState, useEffect } from 'react';
import { searchMovies } from '../services/omdb';

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const useDynamicSearch = ({ searchTerms, type }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Array.isArray(searchTerms) || searchTerms.length === 0) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const searchPromises = searchTerms.map(term => 
          searchMovies({ search: term, type: type })
        );

        const allResults = await Promise.all(searchPromises);

        const combinedMovies = allResults.flat().filter(Boolean);

        const shuffledMovies = shuffleArray(combinedMovies);

        setMovies(shuffledMovies.slice(0, 8));

      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [JSON.stringify(searchTerms), type]); 

  return { movies, loading, error };
};