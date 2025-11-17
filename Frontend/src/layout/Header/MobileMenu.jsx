import React from 'react';
import { HeaderSearchBar } from '../../components/HeaderSearchBar';
import { NavLinks } from './NavLinks';

export const MobileMenu = ({ links, onClose }) => (
  <nav className="lg:hidden absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-sm shadow-xl z-50">
    <div className="flex flex-col items-center py-4">
      <div className="w-full px-4 mb-4">
        <HeaderSearchBar onSearchComplete={onClose} />
      </div>

      <NavLinks
        links={links}
        linkClassName="font-medium text-lg text-gray-200 py-3 w-full text-center hover:bg-gray-800 transition-colors duration-200"
        onLinkClick={onClose}
      />
    </div>
  </nav>
);