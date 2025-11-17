import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage";
import SearchPage from "../pages/SearchPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import SeriesPage from '../pages/SeriesPage';
import PeliculasPage from '../pages/PeliculasPage';
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import AdminDashboardPage from "../layout/Admin/AdminDashboardPage";
import { ProtectedRoute, AdminRoute } from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminDashboardPage />,
    errorElement: <NotFoundPage />,
    children: [
      // Rutas Protegidas
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
        ]
      }

    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "movie/:id", element: <MovieDetailPage /> },
      { path: 'series', element: <SeriesPage /> },
      { path: 'peliculas', element: <PeliculasPage /> },

      // Rutas Protegidas
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
        ]
      },

      // Rutas de Admin
      {
        element: <AdminRoute />,
        children: [
          { path: 'admin-dashboard', element: <AdminDashboardPage /> },
        ]
      }
    ],
  },
  // Rutas que no usan MainLayout
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
