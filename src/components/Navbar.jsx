// ✅ src/components/Navbar.jsx (VERSION TRANSPARENTE)
import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import logo from "../assets/ghLogo.png";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Calendar,
  Menu,
  X,
  Star,
  Crown,
} from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Effet de scroll pour l'ombre et la transparence
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      // Fermer le menu mobile si on clique à l'extérieur
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          !event.target.closest('button[class*="md:hidden"]')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // --- Dropdown utilisateur stylisé ---
  const UserDropdown = () => {
    if (!isAuthenticated || !user) return null;

    const isPremium = user.role === "premium" || user.role === "admin";

    return (
      <div className="relative z-50" ref={dropdownRef}>
        <button
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-white hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-soft group"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center text-gray-900 text-sm font-medium shadow-md">
              {user.name?.charAt(0)}{user.surname?.charAt(0)}
            </div>
            {isPremium && (
              <Crown className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 fill-yellow-400" />
            )}
          </div>
          <span className="text-sm font-semibold whitespace-nowrap group-hover:scale-105 transition-transform">
            Mon profil
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-all duration-300 ${
              userDropdownOpen ? "rotate-180 text-white" : "text-white/70 group-hover:text-white"
            }`}
          />
        </button>

        {userDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 py-3 z-50 animate-in fade-in-0 zoom-in-95">
            {/* En-tête du dropdown */}
            <div className="px-5 py-4 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-t-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    {user.name?.charAt(0)}{user.surname?.charAt(0)}
                  </div>
                  {isPremium && (
                    <Crown className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 fill-yellow-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate text-lg">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold rounded-full capitalize border border-blue-200/50">
                {isPremium ? <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> : null}
                {user.role}
              </span>
            </div>

            {/* Menu options */}
            <div className="py-2 space-y-1">
              <Link
                to="/my-reservations"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-700 transition-all duration-200 rounded-xl mx-2 group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Mes Réservations</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-700 transition-all duration-200 rounded-xl mx-2 group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Mon Profil</span>
              </Link>

              <Link
                to="/change-password"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-700 transition-all duration-200 rounded-xl mx-2 group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Changer mot de passe</span>
              </Link>
            </div>

            {/* Déconnexion */}
            <div className="border-t border-gray-100/50 pt-2 mt-2">
  <button
    onClick={handleLogout}
    className="flex items-center gap-3 w-full px-5 py-3 text-red-600 hover:bg-red-50/80 transition-all duration-200 rounded-xl group"
  >
    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
      <LogOut className="w-4 h-4 text-red-600" />
    </div>
    <span className="font-medium">Déconnexion</span>
  </button>
</div>
          </div>
        )}
      </div>
    );
  };

  // --- Lien de navigation stylisé ---
  const NavLinkItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap group ${
          isActive
            ? "text-white bg-white/20 shadow-soft backdrop-blur-sm"
            : "text-white/90 hover:text-white hover:bg-white/10 hover:shadow-soft backdrop-blur-sm"
        }`
      }
    >
      {children}
      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-3/5" />
    </NavLink>
  );

  // --- Structure principale ---
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled 
          ? "bg-black/20 backdrop-blur-xl shadow-2xl border-b border-white/10" 
          : "bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between py-3">
        {/* Logo avec effet de scale */}
        <Link 
          to="/" 
          className="flex items-center gap-3 flex-shrink-0 group"
        >
          <div className="w-16 h-16 md:w-18 md:h-18 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <img
              src={logo}
              alt="Grand Hotel Logo"
              className="h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow-lg"
            />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-white drop-shadow-lg">
              Grand Hotel
            </h1>
            <p className="text-xs text-white/80 font-medium">Luxury & Comfort</p>
          </div>
        </Link>

        {/* Navigation Desktop Stylisée */}
        <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
          <NavLinkItem to="/rooms">
            Chambres/Suites
          </NavLinkItem>
          <NavLinkItem to="/about">
            À propos
          </NavLinkItem>
          <NavLinkItem to="/contact">
            Contact
          </NavLinkItem>
        </nav>

        {/* Actions Desktop Stylisées */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/my-reservations"
                className="px-4 py-2.5 rounded-xl font-semibold text-white/90 hover:text-white hover:bg-white/10 hover:shadow-soft transition-all duration-300 whitespace-nowrap backdrop-blur-sm"
              >
                Mes Réservations
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl font-semibold text-white/90 hover:text-white hover:bg-white/10 hover:shadow-soft transition-all duration-300 whitespace-nowrap border border-white/20 backdrop-blur-sm"
              >
                Connexion
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 shadow-soft hover:shadow-medium transition-all duration-300 whitespace-nowrap hover:scale-105 transform border border-white/20 backdrop-blur-sm"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>

        {/* Bouton Menu Mobile Stylisé */}
        <button
          className="md:hidden p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:shadow-soft transition-all duration-300 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Menu Mobile - Au-dessus du contenu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay sombre */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 top-0"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Mobile */}
          <div 
            ref={mobileMenuRef}
            className="md:hidden fixed top-0 left-0 right-0 h-screen bg-white z-50 overflow-y-auto"
          >
            {/* Header du menu mobile */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <Link 
                  to="/" 
                  className="flex items-center gap-3"
                  onClick={closeMobileMenu}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img
                      src={logo}
                      alt="Grand Hotel Logo"
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Grand Hotel
                    </h1>
                  </div>
                </Link>
                
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Contenu du menu */}
            <div className="container mx-auto px-6 py-6">
              <div className="space-y-2">
                <MobileNavLink to="/rooms" onClick={closeMobileMenu}>
                  Chambres/Suites
                </MobileNavLink>
                <MobileNavLink to="/about" onClick={closeMobileMenu}>
                  À propos
                </MobileNavLink>
                <MobileNavLink to="/contact" onClick={closeMobileMenu}>
                  Contact
                </MobileNavLink>

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-3 border border-blue-200">
                        <p className="font-bold text-gray-900 text-sm">
                          {user?.name} {user?.surname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize mt-1">
                          {user.role === "premium" || user.role === "admin" ? (
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          ) : null}
                          {user.role}
                        </span>
                      </div>

                      <MobileNavLink
                        to="/my-reservations"
                        onClick={closeMobileMenu}
                        icon={<Calendar className="w-4 h-4" />}
                      >
                        Mes Réservations
                      </MobileNavLink>
                      <MobileNavLink
                        to="/profile"
                        onClick={closeMobileMenu}
                        icon={<User className="w-4 h-4" />}
                      >
                        Mon Profil
                      </MobileNavLink>
                      <MobileNavLink
                        to="/change-password"
                        onClick={closeMobileMenu}
                        icon={<Settings className="w-4 h-4" />}
                      >
                        Changer mot de passe
                      </MobileNavLink>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-left mt-2 border border-red-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span className="font-semibold">Déconnexion</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <MobileNavLink
                      to="/my-reservations"
                      onClick={closeMobileMenu}
                    >
                      Mes Réservations
                    </MobileNavLink>

                    <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block w-full text-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                      >
                        Connexion
                      </Link>
                      <Link
                        to="/signup"
                        onClick={closeMobileMenu}
                        className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-soft transition-all duration-300 transform hover:scale-105"
                      >
                        S'inscrire
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

// Composant réutilisable pour les liens du menu mobile stylisé
function MobileNavLink({ to, onClick, children, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-700 rounded-xl transition-all duration-200 font-semibold border border-transparent hover:border-blue-100/50"
    >
      {icon && <span className="mr-3 text-blue-600">{icon}</span>}
      {children}
    </Link>
  );
}