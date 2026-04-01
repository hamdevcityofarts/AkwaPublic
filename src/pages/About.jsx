// src/pages/About.jsx — VERSION LUXE HÔTELIÈRE
import React from "react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

export default function About() {
  return (
    <div className="container-max py-12">
      {/* Eyebrow */}
      <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.30em", textTransform: "uppercase" }}
         className="text-amber-600/70 mb-3">
        Notre histoire
      </p>
      {/* Séparateur */}
      <div className="flex items-center gap-3 mb-4">
        <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
        <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,160,51,0.55),transparent)", display: "block" }} />
        <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
      </div>
      {/* Titre */}
      <h1 style={{ ...serif, fontWeight: 300, fontSize: "42px", letterSpacing: "0.03em" }}
          className="text-gray-900 mb-6">
        À Propos
      </h1>
      {/* Contenu */}
      <p style={{ ...sans, fontSize: "14px", fontWeight: 300, letterSpacing: "0.04em", lineHeight: 1.8 }}
         className="text-gray-600 max-w-2xl">
        Grand Hôtel Aéroport offre des services haut de gamme pour les voyageurs
        d'affaires et les touristes. Situé à proximité immédiate de l'aéroport,
        nous proposons navette, business center et suites premium.
      </p>
    </div>
  );
}