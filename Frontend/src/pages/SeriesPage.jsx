import React from 'react';
import { MovieCarousel } from '../components/MovieCarousel';

const SeriesPage = () => {
  return (
    <section className="w-full">
      <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-8">
        Explora las Mejores Series
      </h2>

      <div className="w-full mt-4">
        <MovieCarousel 
          title="Series de Crimen Populares" 
          searchTerm="Breaking Bad"
          type="series" 
        />
        <MovieCarousel 
          title="Fantasía Épica" 
          searchTerm="Game of Thrones"
          type="series" 
        />
        <MovieCarousel 
          title="Comedias Clásicas" 
          searchTerm="Friends"
          type="series" 
        />
        <MovieCarousel 
          title="Misterio y Sci-Fi" 
          searchTerm="Stranger Things"
          type="series" 
        />
      </div>
    </section>
  );
};

export default SeriesPage;