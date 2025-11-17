import React from 'react';
import { HeaderSearchBar } from '../../components/HeaderSearchBar';
import { Perfil } from './Perfil';
import { NavLinks } from './NavLinks';

export const DesktopNav = ({ links }) => (
  <div className="hidden lg:flex items-center gap-8">
    <nav className="flex space-x-8 items-center">
      <NavLinks
        links={links}
        linkClassName="font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-200"
      />
    </nav>
    <HeaderSearchBar />
    <Perfil />
  </div>
);