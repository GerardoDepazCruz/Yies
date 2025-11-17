import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-950 text-gray-400">
      <div className="container mx-auto px-4 pt-6 pb-3">
        
        {/* Contenedor principal del grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Logo y descripción */}
          <div className="md:col-span-1 lg:col-span-2">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              YiesMovie
            </h3>
            <p className="text-gray-400 max-w-sm">
              Tu radar para explorar el universo de las películas y series.
            </p>
          </div>

          {/* Col 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
              <li><Link to="/series" className="hover:text-yellow-400 transition-colors">Series</Link></li>
              <li><Link to="/peliculas" className="hover:text-yellow-400 transition-colors">Peliculas</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-yellow-400 transition-colors">Términos de Servicio</Link></li>
              <li><Link to="/" className="hover:text-yellow-400 transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>

        </div>

        {/* Barra de Copyright */}
        <div className="mt-6 pt-3 border-t border-gray-800 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} YiesMovie. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;