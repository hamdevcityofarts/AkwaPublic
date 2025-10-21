import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-8">
      <div className="container-max grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-serif text-xl text-gh-gold">Grand Hôtel</h4>
          <p className="text-sm text-gray-300 mt-2">
            Confort et élégance à deux pas de l'aéroport. Service 24/7, navette
            et business center.
          </p>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Liens</h5>
          <ul className="text-sm text-gray-300">
            <li>
              <Link to="/rooms">Chambres</Link>
            </li>
            <li>
              <Link to="/about">À propos</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Contact</h5>
          <p className="text-sm text-gray-300">+237 6X XX XX XX</p>
          <p className="text-sm text-gray-300">contact@grandhotel.example</p>
        </div>
      </div>
      <div className="mt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Grand Hôtel Aéroport. Tous droits réservés.
      </div>
    </footer>
  );
}
