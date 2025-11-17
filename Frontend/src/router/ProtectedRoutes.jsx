import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Para rutas que solo usuarios logueados pueden ver
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Para rutas que solo los administradores pueden ver
export const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Podríamos redirigir a una página de "No autorizado" o a la home
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
