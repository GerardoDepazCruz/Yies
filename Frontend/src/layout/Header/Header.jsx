import React, { useState } from "react";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { MenuIcon, CloseIcon } from "./Perfil";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Series", path: "/series" },
  { title: "Peliculas", path: "/peliculas" }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        
        {/* Componente Logo */}
        <Logo />

        {/* Componente de Navegación Desktop */}
        <DesktopNav links={navLinks} />

        {/* Botón de Menú Móvil */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMenuOpen && <MobileMenu links={navLinks} onClose={closeMenu} />}

    </header>
  );
};

export default Header;