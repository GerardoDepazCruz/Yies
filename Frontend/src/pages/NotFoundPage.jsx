import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (counter === 0) return;

    const timer = setInterval(() => {
      setCounter((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [counter]);

  useEffect(() => {
    if (counter === 0) {
      navigate('/');
    }
  }, [counter, navigate]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-[60vh]">
      <h1 className="text-8xl md:text-9xl font-bold text-yellow-400">
        404
      </h1>
      <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
        Página No Encontrada
      </h2>
      <p className="text-lg text-gray-400 mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      
      <p className="text-gray-300 text-lg mb-8">
        Serás redirigido al inicio en 
        <span className="font-bold text-white text-xl mx-2">{counter}</span> 
        segundos...
      </p>
      
      <Link
        to="/"
        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold
                   hover:bg-yellow-300 transition-colors duration-200
                   text-lg shadow-lg"
      >
        Volver al Inicio Ahora
      </Link>
    </div>
  );
};

export default NotFoundPage;