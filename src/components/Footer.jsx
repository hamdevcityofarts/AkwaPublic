// ══════════════════════════════════════════════════
// src/components/Footer.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Crown, Star, Shield } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-purple-500 to-purple-900 text-white pt-14 pb-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-10">

          {/* Logo + description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-white to-blue-100 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 text-blue-600" />
                </div>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 absolute -top-1 -right-1" />
              </div>
              <h4 style={{ ...serif, fontWeight: 300, fontSize: "22px", letterSpacing: "0.08em" }}
                  className="text-white">
                Grand Hôtel
              </h4>
            </div>

            <p style={{ ...sans, fontSize: "13px", fontWeight: 300, letterSpacing: "0.04em", lineHeight: 1.75 }}
               className="text-blue-100/80 mb-6 max-w-sm">
              Confort et élégance à deux pas de l'aéroport. Service 24/7, navette
              et business center pour un séjour d'exception.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Shield className="w-3.5 h-3.5 text-green-400" />, label: "Sécurité" },
                { icon: <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />, label: "Luxe" },
                { icon: <div className="w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white" style={{ fontSize: "8px" }}>✓</span></div>, label: "24/7" },
              ].map(({ icon, label }) => (
                <div key={label}
                     className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl border border-white/20">
                  {icon}
                  <span style={{ ...sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em" }}
                        className="text-white">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h5 style={{ ...serif, fontWeight: 500, fontSize: "17px", letterSpacing: "0.06em" }}
                className="text-white mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              Navigation
            </h5>
            <ul className="space-y-3">
              {[
                { to: "/rooms", label: "Chambres & Suites" },
                { to: "/about", label: "À propos" },
                { to: "/contact", label: "Contact" },
                { to: "/my-reservations", label: "Mes Réservations" },
                { to: "/booking", label: "Réserver" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{ ...sans, fontSize: "12px", fontWeight: 300, letterSpacing: "0.06em" }}
                    className="text-blue-100/70 hover:text-white transition-all duration-300
                      hover:translate-x-1.5 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ ...serif, fontWeight: 500, fontSize: "17px", letterSpacing: "0.06em" }}
                className="text-white mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              Nous Contacter
            </h5>
            <div className="space-y-4">
              {[
                { icon: <MapPin className="w-4 h-4 text-blue-300" />, bg: "bg-blue-500/20", label: "A 4km de l'aéroport de", value: "Douala, Cameroun" },
                { icon: <Phone className="w-4 h-4 text-purple-300" />, bg: "bg-purple-500/20", label: "Téléphone", value: "(+237) 699 901 204" },
                { icon: <Mail className="w-4 h-4 text-green-300" />, bg: "bg-green-500/20", label: "Email", value: "aeroport@mygrandhotel.com" },
              ].map(({ icon, bg, label, value }) => (
                <div key={label} className="flex items-center gap-3 group">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase" }}
                       className="text-blue-100/50">
                      {label}
                    </p>
                    <p style={{ ...sans, fontSize: "12px", fontWeight: 400 }} className="text-white">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/15 my-6" />

        {/* Bas de page */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p style={{ ...sans, fontSize: "11px", fontWeight: 300, letterSpacing: "0.06em" }}
               className="text-blue-100/60">
              © {new Date().getFullYear()} Grand Hôtel Aéroport. Tous droits réservés.
            </p>
            <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.12em" }}
               className="text-blue-100/40 mt-1">
              L'excellence hôtelière réinventée
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            {[
              { to: "/privacy", label: "Confidentialité" },
              { to: "/terms", label: "Conditions" },
              { to: "/cookies", label: "Cookies" },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                    style={{ ...sans, fontSize: "10px", letterSpacing: "0.14em" }}
                    className="text-blue-100/55 hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
    </footer>
  );
}