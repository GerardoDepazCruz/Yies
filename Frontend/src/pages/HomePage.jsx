import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DynamicMovieCarousel } from '../components/DynamicMovieCarousel';


const HomePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="flex flex-col items-center w-full">
      <h2 className="text-3xl lg:text-4xl font-semibold text-center mb-12">
        Lo más popular en YiesMovie
      </h2>
      
      <div className="w-full mt-4 space-y-12">

        <DynamicMovieCarousel 
          title="Series del Momento" 
          searchTerms={["Stranger Things", "The Boys", "The Last of Us", "Arcane"]}
          type="series" 
        />
        
        <DynamicMovieCarousel 
          title="Películas Populares" 
          searchTerms={["Bad Boys", "Oppenheimer", "Avengers", "Avatar", "Now You See Me"]}
          type="movie"
        />

        <DynamicMovieCarousel 
          title="Clásicos de Culto" 
          searchTerms={["Pulp Fiction"]}
          type="movie"
        />

        <DynamicMovieCarousel 
          title="Joyas de la Animación" 
          searchTerms={["Spider-Verse"]}
        />
      </div>
    </section>
  );
};

export default HomePage;