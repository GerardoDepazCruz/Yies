import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import { MovieList } from '../components/MovieList';
import { Spinner } from '../components/Spinner';
import { SearchBar } from '../components/SearchBar';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; 

  const { movies, loading, error, getMovies } = useMovies();

  useEffect(() => {
    if (query) {
      getMovies({ search: query });
    }
  }, [query, getMovies]);

  const handleSearch = ({ search }) => {
    setSearchParams({ q: search });
  };

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;
    return <MovieList movies={movies} />;
  };

  return (
    <section className="w-full">
      <SearchBar onSearch={handleSearch} initialValue={query} />
      
      <h2 className="text-3xl font-semibold text-white mb-8">
        Resultados para: <span className="text-yellow-400">"{query}"</span>
      </h2>
      
      {renderContent()}
    </section>
  );
};

export default SearchPage;