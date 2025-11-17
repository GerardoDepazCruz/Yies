import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <p><strong>Nombre:</strong> {currentUser.name}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Rol:</strong> {currentUser.role}</p>
        <button 
          onClick={logout}
          className="mt-4 px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
