import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.png';

export const Logo = () => (
  <Link
    to="/"
    className="tracking-wider"
  >
    <img 
      src={logoImage} 
      alt="YiesMovie Logo" 
      className="h-10 w-auto"
    />
  </Link>
);