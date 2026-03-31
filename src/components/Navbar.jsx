// ✅ src/components/Navbar.jsx — VERSION LUXE HÔTELIÈRE REDESIGNÉE
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
  Shield,
  BookOpen,
} from "lucide-react";

/*
  ─────────────────────────────────────────────────────────
  FONTS : Ajouter dans index.html ou index.css :
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  ─────────────────────────────────────────────────────────
*/

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setUserDropdownOpen(false);
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[data-mobile-toggle]')
      )
        setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    document.documentElement.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  /* ── Dropdown utilisateur ── */
  const UserDropdown = () => {
    if (!isAuthenticated || !user) return null;
    const isPremium = user.role === "premium" || user.role === "admin";

    return (
      <div className="relative z-50" ref={dropdownRef}>
        {/* Bouton avatar */}
        <button
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          title="Mon profil"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center text-stone-800 text-[11px] font-semibold tracking-wide shadow-md">
              {user.name?.charAt(0)}{user.surname?.charAt(0)}
            </div>
            {isPremium && (
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400 absolute -top-1 -right-1 drop-shadow" />
            )}
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/70 group-hover:text-white transition-all duration-300 ${
              userDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown panel */}
        {userDropdownOpen && (
          <div
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="absolute right-0 top-full mt-3 w-72 bg-white/97 backdrop-blur-2xl rounded-2xl shadow-2xl border border-stone-100 py-3 z-50"
          >
            {/* Header */}
            <div className="px-5 py-0 border-b border-stone-100 bg-gradient-to-br from-stone-50 to-amber-50/40 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm">
                    {user.name?.charAt(0)}{user.surname?.charAt(0)}
                  </div>
                  {isPremium && (
                    <Crown className="w-4 h-4 text-amber-500 fill-amber-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 truncate text-base tracking-wide"
                     style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
                    {user.name} {user.surname}
                  </p>
                  <p className="text-xs text-stone-400 truncate mt-0.5">{user.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-amber-50 text-amber-800 text-[10px] font-semibold rounded-full capitalize border border-amber-200/60 tracking-widest uppercase">
                {isPremium && <Star className="w-3 h-3 fill-amber-500 text-amber-500" />}
                {user.role}
              </span>
            </div>

            {/* Links */}
            <div className="py-2 space-y-0.5">
              {[
                { to: "/my-reservations", icon: <Calendar className="w-4 h-4" />, label: "Mes Réservations" },
                { to: "/profile", icon: <User className="w-4 h-4" />, label: "Mon Profil" },
                { to: "/change-password", icon: <Settings className="w-4 h-4" />, label: "Changer mot de passe" },
              ].map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all duration-200 mx-2 rounded-xl text-[13px] tracking-wide group"
                >
                  <span className="text-stone-400 group-hover:text-amber-500 transition-colors">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-2 mt-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-rose-500 hover:bg-rose-50 transition-all duration-200 rounded-xl mx-0 text-[13px] tracking-wide group"
                style={{ width: "calc(100% - 1rem)", marginLeft: "0.5rem" }}
              >
                <span className="text-rose-400 group-hover:text-rose-600 transition-colors">
                  <LogOut className="w-4 h-4" />
                </span>
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ── Lien nav desktop ── */
  const NavLinkItem = ({ to, children }) => (
    <NavLink
      to={to}
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
      className={({ isActive }) =>
        `relative px-5 py-2 font-medium transition-all duration-300 tracking-[0.12em] text-[15px] group ${
          isActive
            ? "text-white"
            : "text-white/75 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-amber-300/70 transition-all duration-500 ${
              isActive ? "w-4/5" : "w-0 group-hover:w-3/5"
            }`}
          />
        </>
      )}
    </NavLink>
  );

  /* ── Bouton icône d'action ── */
  const IconAction = ({ to, title, icon, badge }) => (
    <Link
      to={to}
      title={title}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/35 backdrop-blur-sm text-white/80 hover:text-white transition-all duration-300 group"
    >
      {icon}
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white/30" />
      )}
      {/* Tooltip */}
      <span
        style={{ fontFamily: "'Montserrat', sans-serif" }}
        className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white text-[10px] tracking-wider px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none"
      >
        {title}
      </span>
    </Link>
  );

  /* ── RENDER PRINCIPAL ── */
  return (
    <>
      {/* Inject Google Fonts si pas déjà dans index.html */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-black/25 backdrop-blur-2xl shadow-[0_4px_32px_rgba(0,0,0,0.18)] border-b border-white/8"
            : "bg-black/5 backdrop-blur-md"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 flex items-center h-[72px]">

         {/* ── LOGO (gauche) ── */}
<Link
  to="/"
  className="flex items-center gap-3 flex-shrink-0 group mr-6"
>
  <div className="flex items-center justify-center transition-transform duration-400 group-hover:scale-105">
    <img
      src={logo}
      alt="Grand Hotel Logo"
      className="h-12 w-12 object-contain drop-shadow-lg"
      style={{ width: '58px', height: '58px' }}
    />
  </div>
  <div className="hidden lg:block leading-tight">
    <h1
      style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.06em" }}
      className="text-[20px] font-light text-white drop-shadow-md tracking-wider"
    >
      Grand Hotel Akwa
    </h1>
    <p
      style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em" }}
      className="text-[8px] text-amber-300/80 font-light uppercase mt-0.5"
    >
      Luxury &amp; Comfort
    </p>
  </div>
</Link>

          {/* ── NAV CENTRALE (desktop) ── */}
          <nav className="hidden md:flex items-center justify-center flex-1 gap-1">
            <NavLinkItem to="/rooms">Chambres &amp; Suites</NavLinkItem>
            <span className="text-white/20 text-xs">·</span>
            <NavLinkItem to="/about">À Propos</NavLinkItem>
            <span className="text-white/20 text-xs">·</span>
            <NavLinkItem to="/contact">Contact</NavLinkItem>
          </nav>

          {/* ── ACTIONS DROITE (desktop) ── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-6">
            {/* Lien Conditions Générales — texte discret */}
            <Link
              to="/privacy-policy"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="px-3 py-1.5 text-white/55 hover:text-white/90 text-[10px] tracking-[0.18em] uppercase font-light border border-white/15 hover:border-white/30 rounded-full transition-all duration-300 mr-1 whitespace-nowrap"
            >
              Conditions
            </Link>

            {/* Divider */}
            <span className="w-px h-5 bg-white/20 mx-1" />

            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                {/* Réservations */}
                <IconAction
                  to="/my-reservations"
                  title="Mes Réservations"
                  icon={<Calendar className="w-4 h-4" />}
                />
                {/* Connexion */}
                <IconAction
                  to="/login"
                  title="Connexion"
                  icon={<User className="w-4 h-4" />}
                />
                {/* Inscription — bouton primaire doré */}
                <Link
                  to="/signup"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="ml-1 px-5 py-2 rounded-full text-stone-900 text-[11px] font-semibold tracking-[0.14em] uppercase bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 shadow-[0_2px_16px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_24px_rgba(251,191,36,0.35)] transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* ── BOUTON HAMBURGER (mobile) ── */}
          <button
            data-mobile-toggle
            className="md:hidden ml-auto p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════
            MENU MOBILE
        ═══════════════════════════════════════════════ */}
        {mobileMenuOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />
            <div
              ref={mobileMenuRef}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="md:hidden fixed top-0 left-0 right-0 h-screen bg-stone-950 z-50 overflow-y-auto"
            >
              {/* Header mobile */}
              <div className="sticky top-0 bg-stone-950 border-b border-white/10 z-10">
                <div className="px-6 py-4 flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
                    <img src={logo} alt="Grand Hotel" className="h-9 w-9 object-contain" />
                    <div>
                      <h1
                        style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}
                        className="text-lg font-light text-white"
                      >
                        Grand Hotel Akwa
                      </h1>
                      <p className="text-[8px] text-amber-400/70 tracking-[0.2em] uppercase">Luxury &amp; Comfort</p>
                    </div>
                  </Link>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-full bg-white/8 hover:bg-white/15 border border-white/15 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>

              {/* Contenu mobile */}
              <div className="px-6 py-8 space-y-1">
                {/* Navigation principale */}
                <p className="text-[9px] text-white/30 tracking-[0.25em] uppercase mb-4 px-2">Navigation</p>
                {[
                  { to: "/rooms", label: "Chambres & Suites" },
                  { to: "/about", label: "À Propos" },
                  { to: "/contact", label: "Contact" },
                ].map(({ to, label }) => (
                  <MobileNavLink key={to} to={to} onClick={closeMobileMenu}>
                    {label}
                  </MobileNavLink>
                ))}

                <MobileNavLink
                  to="/privacy-policy"
                  onClick={closeMobileMenu}
                  icon={<Shield className="w-4 h-4" />}
                  muted
                >
                  Conditions Générales
                </MobileNavLink>

                <div className="border-t border-white/10 my-6" />

                {isAuthenticated ? (
                  <>
                    <p className="text-[9px] text-white/30 tracking-[0.25em] uppercase mb-4 px-2">Mon Compte</p>
                    {/* Profil user */}
                    <div className="px-4 py-4 bg-white/5 rounded-2xl mb-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center text-stone-900 text-sm font-semibold">
                          {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
                        </div>
                        <div>
                          <p
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            className="text-white font-medium text-base"
                          >
                            {user?.name} {user?.surname}
                          </p>
                          <p className="text-white/40 text-[11px]">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <MobileNavLink to="/my-reservations" onClick={closeMobileMenu} icon={<Calendar className="w-4 h-4" />}>
                      Mes Réservations
                    </MobileNavLink>
                    <MobileNavLink to="/profile" onClick={closeMobileMenu} icon={<User className="w-4 h-4" />}>
                      Mon Profil
                    </MobileNavLink>
                    <MobileNavLink to="/change-password" onClick={closeMobileMenu} icon={<Settings className="w-4 h-4" />}>
                      Changer mot de passe
                    </MobileNavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all text-[13px] tracking-wide mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[9px] text-white/30 tracking-[0.25em] uppercase mb-4 px-2">Mon Compte</p>
                    <MobileNavLink to="/my-reservations" onClick={closeMobileMenu} icon={<Calendar className="w-4 h-4" />}>
                      Mes Réservations
                    </MobileNavLink>
                    <div className="pt-4 space-y-3">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center gap-2 w-full py-3.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-[12px] font-medium tracking-[0.15em] uppercase rounded-full transition-all duration-300"
                      >
                        <User className="w-4 h-4" />
                        Connexion
                      </Link>
                      <Link
                        to="/signup"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-amber-300 to-amber-400 text-stone-900 text-[12px] font-semibold tracking-[0.15em] uppercase rounded-full shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_28px_rgba(251,191,36,0.4)] transition-all duration-300"
                      >
                        S'inscrire
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}

/* ── Lien mobile réutilisable ── */
function MobileNavLink({ to, onClick, children, icon, muted }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-[13px] tracking-wide ${
        muted
          ? "text-white/35 hover:text-white/60 hover:bg-white/5"
          : "text-white/70 hover:text-white hover:bg-white/8"
      }`}
    >
      {icon && <span className={muted ? "text-white/30" : "text-amber-400/70"}>{icon}</span>}
      {children}
    </Link>
  );
}