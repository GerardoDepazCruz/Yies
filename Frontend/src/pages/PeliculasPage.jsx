import React from 'react';
import { MovieCarousel } from '../components/MovieCarousel';

const PeliculasPage = () => {
  return (
    <section className="w-full">
      <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-8">
        Explora las Mejores Películas
      </h2>
      
      <div className="w-full mt-4">
        <MovieCarousel 
          title="Acción y Aventura" 
          searchTerm="Avengers"
          type="movie"
        />
        <MovieCarousel 
          title="Ciencia Ficción" 
          searchTerm="Blade Runner"
          type="movie" 
        />
        <MovieCarousel 
          title="Clásicos del Crimen" 
          searchTerm="The Godfather"
          type="movie" 
        />
        <MovieCarousel 
          title="Animación" 
          searchTerm="Ghibli"
          type="movie" 
        />
      </div>
    </section>
  );
};

export default PeliculasPage;