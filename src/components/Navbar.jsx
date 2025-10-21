// src/components/Navbar.jsx (MODIFIÉ)
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from 'react-redux'
import MyReservationsButton from './MyReservationsButton'
import logo from "../assets/ghLogo.png";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <header className="bg-white shadow-sm">
      <div className="container-max flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          
            <div className="w-20 h-20 rounded-lg flex items-center justify-center ">
                       <img 
                         src={logo} // Utilisez la variable importée directement
                         alt="Grand Hotel Logo" 
                         className="h-18 w-18 object-contain" // Ajustez selon votre logo
                       />
                     </div>
        
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              isActive ? "text-gh-red font-medium" : "text-gray-700"
            }
          >
            Chambres
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-gh-red font-medium" : "text-gray-700"
            }
          >
            À propos
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-gh-red font-medium" : "text-gray-700"
            }
          >
            Contact
          </NavLink>
          
          <MyReservationsButton />
          
          <Link
            to="/booking"
            className="ml-4 inline-block px-5 py-2 rounded-full text-white btn-gradient shadow-soft"
          >
            Réserver
          </Link>
        </nav>

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-md border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 6h18M3 12h18M3 18h18"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-3">
          <Link
            to="/rooms"
            className="block py-2"
            onClick={() => setOpen(false)}
          >
            Chambres
          </Link>
          <Link
            to="/about"
            className="block py-2"
            onClick={() => setOpen(false)}
          >
            À propos
          </Link>
          <Link
            to="/contact"
            className="block py-2"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/my-reservations"
            className="block py-2"
            onClick={() => setOpen(false)}
          >
            Mes Réservations
          </Link>
          <Link
            to="/booking"
            className="block py-2 mt-2 bg-gh-red text-white text-center rounded-full"
          >
            Réserver
          </Link>
        </div>
      )}
    </div>
  );
}