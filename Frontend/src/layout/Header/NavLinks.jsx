import React from 'react';
import { Link } from 'react-router-dom';

export const NavLinks = ({ links, linkClassName, onLinkClick }) => {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.title}
          to={link.path}
          className={linkClassName}
          onClick={onLinkClick}
        >
          {link.title}
        </Link>
      ))}
    </>
  );
};