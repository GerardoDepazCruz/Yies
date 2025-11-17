import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>

);

export const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const Perfil = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfile = () => {
    setOpen(false);
    navigate('/profile');
  };

  const handleSettings = () => {
    setOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  const avatar = currentUser?.avatar_url || null;
  const displayName = currentUser?.name || currentUser?.email || 'Usuario';

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-label="Abrir menú de perfil"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-700"
      >
        {avatar ? (
          <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
            {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 w-56">
          <div className="px-4 py-3 border-b border-gray-600 flex items-center gap-3">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-white">{displayName}</div>
              {currentUser?.email && <div className="text-xs text-gray-300">{currentUser.email}</div>}
            </div>
          </div>

          <div className="py-1">
            <ul>
              <li onClick={handleProfile} className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white">Mi Perfil</li>
              <li onClick={handleSettings} className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white">Configuración</li>
              <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-red-400">Cerrar Sesión</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};