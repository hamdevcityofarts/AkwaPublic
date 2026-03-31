// src/pages/Home.jsx — VERSION LUXE HÔTELIÈRE (typographie cohérente avec Navbar)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedCounter from "../components/AnimatedCounter";
import { Navigation } from "lucide-react";
import HotelMap from "../components/HotelMap";
import {
  Star,
  Shield,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Utensils,
  MapPin,
  Clock,
  Phone,
  Mail,
  Award,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";
import HeroSection from "../components/HeroSection";
import RoomCard from "../components/RoomCard";
import roomsService from "../services/roomsService";

/*
  ─────────────────────────────────────────────────────────
  FONTS — déjà chargées via la Navbar (même import Google Fonts) :
  Cormorant Garamond + Montserrat
  ─────────────────────────────────────────────────────────
*/

// ─── Constantes typographiques réutilisables ───
const T = {
  display: { fontFamily: "'Cormorant Garamond', serif" },
  body: { fontFamily: "'Montserrat', sans-serif" },
};

// ─── Composant séparateur section ───
const SectionSep = () => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <span style={{ ...T.body, fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase" }}
          className="text-amber-500/70">
      ·
    </span>
    <span style={{ width: 28, height: 1, background: "linear-gradient(90deg, transparent, #d4a033, transparent)", display: "block" }} />
    <span style={{ ...T.body, fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase" }}
          className="text-amber-500/70">
      ·
    </span>
  </div>
);

// ─── En-tête de section réutilisable ───
const SectionHeader = ({ eyebrow, title, subtitle, light = false }) => (
  <div className="text-center mb-14">
    {eyebrow && (
      <p style={{ ...T.body, fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase" }}
         className={`mb-3 ${light ? "text-amber-300/70" : "text-amber-600/80"}`}>
        {eyebrow}
      </p>
    )}
    <SectionSep />
    <h2
      style={{ ...T.display, fontWeight: 300, letterSpacing: "0.03em" }}
      className={`text-4xl md:text-5xl mb-5 ${light ? "text-white" : "text-gray-900"}`}
    >
      {title}
    </h2>
    {subtitle && (
      <p style={{ ...T.body, fontWeight: 300, fontSize: "15px", letterSpacing: "0.04em" }}
         className={`max-w-2xl mx-auto leading-relaxed ${light ? "text-blue-100/80" : "text-gray-500"}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// ─── Bouton CTA principal (doré, cohérent Navbar) ───
const GoldBtn = ({ to, children, className = "" }) => (
  <Link
    to={to}
    style={{ ...T.body, fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}
    className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-stone-900
      bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300
      shadow-[0_3px_18px_rgba(212,160,51,0.28)] hover:shadow-[0_6px_28px_rgba(212,160,51,0.42)]
      transition-all duration-300 hover:scale-105 ${className}`}
  >
    {children}
  </Link>
);

// ─── Bouton CTA secondaire (contour blanc) ───
const OutlineBtn = ({ to, href, children, className = "" }) => {
  const cls = `inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full
    border border-white/30 text-white/80 hover:text-white hover:border-white/60
    transition-all duration-300 ${className}`;
  const style = { ...T.body, fontSize: "11px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase" };
  if (href) return <a href={href} style={style} className={cls}>{children}</a>;
  return <Link to={to} style={style} className={cls}>{children}</Link>;
};

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await roomsService.getRooms();
        const popularRooms = response.data.chambres?.slice(0, 3) || [];
        setRooms(popularRooms);
      } catch (err) {
        console.error("Erreur lors du chargement des chambres:", err);
        setError("Impossible de charger les chambres. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularRooms();
  }, []);

  const services = [
    { icon: <Car className="w-5 h-5" />, title: "Navette Aéroport", description: "Service gratuit 24/7 vers l'aéroport international de Douala", color: "from-blue-500 to-blue-600" },
    { icon: <Wifi className="w-5 h-5" />, title: "WiFi Haut Débit", description: "Connexion fibre optique dans tout l'hôtel", color: "from-green-500 to-green-600" },
    { icon: <Coffee className="w-5 h-5" />, title: "Petit-déjeuner", description: "Buffet international inclus", color: "from-amber-500 to-amber-600" },
    { icon: <Dumbbell className="w-5 h-5" />, title: "Fitness Center", description: "Salle de sport équipée 24h/24", color: "from-red-500 to-red-600" },
    { icon: <Utensils className="w-5 h-5" />, title: "Restaurant Gastronomique", description: "Cuisine locale et internationale", color: "from-purple-500 to-purple-600" },
    { icon: <Shield className="w-5 h-5" />, title: "Sécurité 24/7", description: "Surveillance et coffre-fort", color: "from-gray-500 to-gray-600" },
  ];

  const testimonials = [
    { name: "Marie Dubois", role: "Voyageuse d'affaires", content: "Un service exceptionnel ! La navette aéroport m'a sauvé la vie pour mon vol tôt le matin.", rating: 5, image: "👩‍💼" },
    { name: "Jean et Sophie Martin", role: "Lune de miel", content: "Chambre romantique avec vue magnifique. Le personnel est aux petits soins !", rating: 5, image: "👩‍❤️‍👨" },
    { name: "Thomas Leroy", role: "Famille avec enfants", content: "Parfait pour les familles. Les enfants ont adoré la piscine et le petit-déjeuner.", rating: 4, image: "👨‍👩‍👧‍👦" },
  ];

  const stats = [
    { number: 5000, label: "Clients satisfaits", suffix: "+" },
    { number: 98, label: "Taux de recommandation", suffix: "%" },
    { number: 24, label: "Service client", suffix: "/7" },
    { number: 4.8, label: "Note moyenne", suffix: "" },
  ];

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <HeroSection />

      {/* ─── SECTION STATISTIQUES ─── */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-5">
        <div className="container-max">
          {/* Eyebrow */}
          <p style={{ ...T.body, fontSize: "9px", letterSpacing: "0.30em", textTransform: "uppercase" }}
             className="text-center text-blue-200/60 mb-10">
            Grand Hôtel en chiffres
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in-up group" style={{ animationDelay: `${index * 150}ms` }}>
                {/* Nombre */}
                <div
                  style={{ ...T.display, fontWeight: 300, letterSpacing: "0.02em" }}
                  className="text-4xl md:text-5xl lg:text-6xl text-white mb-2"
                >
                  <AnimatedCounter end={stat.number} duration={2500} suffix={stat.suffix} />
                </div>
                {/* Trait décoratif */}
                <div className="w-6 h-px bg-amber-300/50 mx-auto mb-2" />
                {/* Label */}
                <div style={{ ...T.body, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                     className="text-blue-100/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION CHAMBRES POPULAIRES ─── */}
      <section className="py-24 bg-gray-50">
        <div className="container-max">
          <SectionHeader
            eyebrow="Nos hébergements"
            title="Chambres d'Exception"
            subtitle="Découvrez nos chambres et suites soigneusement conçues pour allier confort, élégance et technologies modernes."
          />

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border border-blue-600 border-t-transparent" />
              <p style={{ ...T.body, fontSize: "13px", letterSpacing: "0.12em" }}
                 className="mt-5 text-gray-400 uppercase tracking-widest">
                Chargement en cours…
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md mx-auto">
                <p style={T.body} className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  style={{ ...T.body, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                  className="mt-5 px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <p style={{ ...T.body, fontSize: "14px" }} className="text-center py-12 text-gray-400">
              Aucune chambre disponible pour le moment.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>
              <div className="text-center">
                <GoldBtn to="/rooms">
                  Voir toutes nos chambres
                  <ArrowRight className="w-4 h-4" />
                </GoldBtn>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── SECTION SERVICES ─── */}
      <section className="py-24 bg-white">
        <div className="container-max">
          <SectionHeader
            eyebrow="Inclus dans votre séjour"
            title="Services Premium"
            subtitle="Tout ce dont vous avez besoin pour un séjour mémorable et productif."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-7 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                {/* Icône */}
                <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                {/* Titre service */}
                <h3
                  style={{ ...T.display, fontWeight: 500, fontSize: "20px", letterSpacing: "0.03em" }}
                  className="text-gray-900 mb-2"
                >
                  {service.title}
                </h3>
                {/* Trait */}
                <div className="w-5 h-px bg-amber-300/60 mb-3" />
                {/* Description */}
                <p style={{ ...T.body, fontSize: "13px", fontWeight: 300, letterSpacing: "0.02em" }}
                   className="text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION TÉMOIGNAGES ─── */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-max">
          <SectionHeader
            eyebrow="Ils nous ont fait confiance"
            title="Ce Que Disent Nos Clients"
            subtitle="Découvrez les expériences authentiques de nos clients satisfaits."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-400 border border-gray-100/80 group"
              >
                {/* Guillemets décoratifs */}
                <div
                  style={{ ...T.display, fontSize: "56px", fontWeight: 300, lineHeight: 1, color: "rgba(212,160,51,0.18)" }}
                  className="mb-2 select-none"
                >
                  "
                </div>

                {/* Texte */}
                <p style={{ ...T.body, fontSize: "13px", fontWeight: 300, letterSpacing: "0.02em" }}
                   className="text-gray-600 leading-relaxed mb-6 italic">
                  {testimonial.content}
                </p>

                {/* Étoiles */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>

                {/* Trait de séparation */}
                <div className="w-8 h-px bg-amber-200 mb-5" />

                {/* Auteur */}
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{testimonial.image}</div>
                  <div>
                    <h4 style={{ ...T.display, fontWeight: 500, fontSize: "16px" }}
                        className="text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p style={{ ...T.body, fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase" }}
                       className="text-gray-400 mt-0.5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION RÉSERVATION CTA ─── */}
      <section className="py-20 bg-white">
        <div className="container-max">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-10 md:p-14 text-white overflow-hidden relative">
            {/* Décor interne */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
              {/* Colonne gauche */}
              <div>
                {/* Eyebrow */}
                <p style={{ ...T.body, fontSize: "9px", letterSpacing: "0.30em", textTransform: "uppercase" }}
                   className="text-blue-200/60 mb-4">
                  Offre exclusive
                </p>
                <h2
                  style={{ ...T.display, fontWeight: 300, letterSpacing: "0.02em" }}
                  className="text-4xl md:text-5xl text-white mb-5 leading-tight"
                >
                  Prêt pour une Expérience Inoubliable ?
                </h2>
                <div className="w-10 h-px bg-amber-300/50 mb-6" />
                <p style={{ ...T.body, fontSize: "13px", fontWeight: 300, letterSpacing: "0.03em" }}
                   className="text-blue-100/80 mb-8 leading-relaxed">
                  Réservez dès maintenant et bénéficiez de nos meilleurs tarifs avec annulation gratuite jusqu'à 24h avant votre arrivée.
                </p>

                {/* Check list */}
                <ul className="space-y-3 mb-9">
                  {["Meilleur prix garanti", "Annulation gratuite", "Paiement sécurisé", "Confirmation immédiate"].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
                      <span style={{ ...T.body, fontSize: "13px", fontWeight: 300, letterSpacing: "0.04em" }}
                            className="text-blue-100/90">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <GoldBtn to="/booking">
                    <Calendar className="w-4 h-4" />
                    Réserver Maintenant
                  </GoldBtn>
                  <OutlineBtn to="/contact">
                    <Phone className="w-4 h-4" />
                    Nous Contacter
                  </OutlineBtn>
                </div>
              </div>

              {/* Colonne droite — badges */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Award className="w-6 h-6" />, label: "Certifié Excellence" },
                  { icon: <Shield className="w-6 h-6" />, label: "Paiement Sécurisé" },
                  { icon: <Clock className="w-6 h-6" />, label: "Support 24/7" },
                  { icon: <Users className="w-6 h-6" />, label: "Service Personnalisé" },
                ].map((item, index) => (
                  <div key={index} className="bg-white/8 border border-white/12 rounded-2xl p-5 text-center backdrop-blur-sm hover:bg-white/14 transition-colors duration-300 group">
                    <div className="flex justify-center mb-3 text-blue-200 group-hover:text-amber-300 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <p style={{ ...T.body, fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 400 }}
                       className="text-blue-100/70">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION LOCALISATION ─── */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
        {/* Décors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

        <div className="container-max relative z-10">
          {/* En-tête section */}
          <div className="text-center mb-16">
            <p style={{ ...T.body, fontSize: "9px", letterSpacing: "0.30em", textTransform: "uppercase" }}
               className="text-amber-300/60 mb-3">
              Douala · Cameroun
            </p>
            <SectionSep />
            <h2
              style={{ ...T.display, fontWeight: 300, letterSpacing: "0.03em" }}
              className="text-4xl md:text-5xl text-white mb-5"
            >
              Localisation Privilégiée
            </h2>
            <p style={{ ...T.body, fontSize: "14px", fontWeight: 300, letterSpacing: "0.04em" }}
               className="text-blue-100/60 max-w-xl mx-auto">
              Situé dans un emplacement stratégique, notre hôtel vous offre un accès facile aux principaux points d'intérêt de la ville.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* ── Colonne infos ── */}
            <div className="space-y-7">
              {/* Avantages */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <MapPin className="w-5 h-5 text-blue-400" />, color: "bg-blue-500/15", title: "Quartier Privilégié", sub: "Emplacement résidentiel calme" },
                  { icon: <Car className="w-5 h-5 text-green-400" />, color: "bg-green-500/15", title: "Proche Aéroport", sub: "Environ 5–10 minutes" },
                  { icon: <Navigation className="w-5 h-5 text-amber-400" />, color: "bg-amber-500/15", title: "Accès Facile", sub: "Routes principales à proximité" },
                  { icon: <Shield className="w-5 h-5 text-purple-400" />, color: "bg-purple-500/15", title: "Sécurité", sub: "Quartier sécurisé 24h/24" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/8 hover:border-white/16 transition-all duration-300">
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ ...T.display, fontWeight: 500, fontSize: "16px" }} className="text-white mb-0.5">
                        {item.title}
                      </h4>
                      <p style={{ ...T.body, fontSize: "11px", fontWeight: 300, letterSpacing: "0.03em" }} className="text-blue-100/60">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Infos pratiques */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/8">
                <h4
                  style={{ ...T.display, fontWeight: 500, fontSize: "18px", letterSpacing: "0.04em" }}
                  className="text-white mb-5 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-red-400" />
                  Informations de Localisation
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Adresse", value: "Grand Hôtel Luxe, Douala" },
                    { label: "Distance aéroport", value: "~5–10 minutes" },
                    { label: "Transport", value: "Taxi disponible 24/7" },
                    { label: "Contact guidance", value: "(+237) 699 901 204" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-baseline border-b border-white/6 pb-3">
                      <span style={{ ...T.body, fontSize: "11px", letterSpacing: "0.10em" }} className="text-blue-100/50">
                        {label}
                      </span>
                      <span style={{ ...T.display, fontWeight: 400, fontSize: "15px" }} className="text-white text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services transport */}
              <div className="bg-blue-500/8 border border-blue-500/20 rounded-2xl p-5">
                <h5
                  style={{ ...T.display, fontWeight: 500, fontSize: "17px" }}
                  className="text-white mb-4 flex items-center gap-2"
                >
                  <Car className="w-4 h-4 text-blue-400" />
                  Services de Transport
                </h5>
                <ul className="space-y-2.5">
                  {[
                    "Navette aéroport sur réservation",
                    "Service taxi 24h/24",
                    "Parking privé sécurisé gratuit",
                    "Location de voitures avec chauffeur",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 flex-shrink-0" />
                      <span style={{ ...T.body, fontSize: "12px", fontWeight: 300, letterSpacing: "0.03em" }} className="text-blue-100/75">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Colonne carte ── */}
            <div className="space-y-5">
              <div className="bg-gray-800/60 rounded-2xl p-2 shadow-2xl border border-white/8">
                <HotelMap />
              </div>

              {/* Boutons action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://maps.google.com/?q=Grand+hôtel+luxe+Douala"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...T.body, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" }}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 group"
                >
                  <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Google Maps
                </a>
                <a
                  href="tel:+237656708074"
                  style={{ ...T.body, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" }}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 group"
                >
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Appeler
                </a>
              </div>

              {/* Conseil accès */}
              <div className="bg-amber-500/8 border border-amber-500/18 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Car className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p style={{ ...T.body, fontSize: "12px", fontWeight: 300, letterSpacing: "0.02em" }} className="text-amber-100/80 leading-relaxed">
                    <span style={{ fontWeight: 500 }}>Conseil d'accès :</span> Depuis l'aéroport, prenez la route principale vers le centre-ville. Notre hôtel est facilement repérable avec sa façade élégante et notre panneau lumineux. Appelez-nous pour des instructions détaillées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Flèche réutilisable ───
const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);