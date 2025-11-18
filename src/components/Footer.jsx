import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Crown, Star, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-purple-500 to-purple-900 text-white pt-12 pb-6 overflow-hidden">
      {/* Effet de fond avec des éléments décoratifs */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="container-max relative z-10">
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Colonne Logo et Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-blue-600" />
                </div>
                <Star className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 fill-yellow-400" />
              </div>
              <h4 className="font-serif text-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Grand Hôtel
              </h4>
            </div>
            <p className="text-blue-100/90 text-lg leading-relaxed mb-6 max-w-md">
              Confort et élégance à deux pas de l'aéroport. Service 24/7, navette
              et business center pour un séjour d'exception.
            </p>
            
            {/* Badges de confiance */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">Sécurité</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-white">Luxe</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
                <span className="text-sm font-medium text-white">24/7</span>
              </div>
            </div>
          </div>

          {/* Colonne Liens rapides */}
          <div>
            <h5 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Navigation
            </h5>
            <ul className="space-y-3">
              {[
                { to: "/rooms", label: "Chambres & Suites" },
                { to: "/about", label: "À propos" },
                { to: "/contact", label: "Contact" },
                { to: "/my-reservations", label: "Mes Réservations" },
                { to: "/booking", label: "Réserver" }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className="text-blue-100/80 hover:text-white transition-all duration-300 hover:translate-x-2 flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Contact */}
          <div>
            <h5 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Nous Contacter
            </h5>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-100/90 text-sm">A 4km de l'aéroport de</p>
                  <p className="text-white font-medium">Douala, Cameroun</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Phone className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-blue-100/90 text-sm">Téléphone</p>
                  <p className="text-white font-medium"> (+237) 699 901 204</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Mail className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <p className="text-blue-100/90 text-sm">Email</p>
                  <p className="text-white font-medium"> aeroport@mygrandhotel.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/20 my-8"></div>

        {/* Section basse */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-blue-100/70 text-sm">
              © {new Date().getFullYear()} Grand Hôtel Aéroport. Tous droits réservés.
            </p>
            <p className="text-blue-100/50 text-xs mt-1">
              L'excellence hôtelière réinventée
            </p>
          </div>
          
          {/* Liens légaux */}
          <div className="flex flex-wrap gap-6 text-sm">
            <Link to="/privacy" className="text-blue-100/70 hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-blue-100/70 hover:text-white transition-colors">
              Conditions
            </Link>
            <Link to="/cookies" className="text-blue-100/70 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Élément décoratif bas */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
    </footer>
  );
}