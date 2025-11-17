import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import ScrollToTop from '../components/ScrollToTop';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <ScrollToTop />
      
      <Header />
      
      <main className="grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;