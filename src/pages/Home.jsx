// src/pages/Home.jsx
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

        // Prendre les 6 premières chambres comme "populaires"
        const popularRooms = response.data.chambres?.slice(0, 3) || [];
        setRooms(popularRooms);
      } catch (err) {
        console.error("Erreur lors du chargement des chambres:", err);
        setError(
          "Impossible de charger les chambres. Veuillez réessayer plus tard."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularRooms();
  }, []);

  // Services de l'hôtel
  const services = [
    {
      icon: <Car className="w-6 h-6" />,
      title: "Navette Aéroport",
      description:
        "Service gratuit 24/7 vers l'aéroport international de Douala",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "WiFi Haut Débit",
      description: "Connexion fibre optique dans tout l'hôtel",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Petit-déjeuner",
      description: "Buffet international inclus",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Fitness Center",
      description: "Salle de sport équipée 24h/24",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Restaurant Gastronomique",
      description: "Cuisine locale et internationale",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sécurité 24/7",
      description: "Surveillance et coffre-fort",
      color: "from-gray-500 to-gray-600",
    },
  ];

  // Témoignages
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Voyageuse d'affaires",
      content:
        "Un service exceptionnel ! La navette aéroport m'a sauvé la vie pour mon vol tôt le matin.",
      rating: 5,
      image: "👩‍💼",
    },
    {
      name: "Jean et Sophie Martin",
      role: "Lune de miel",
      content:
        "Chambre romantique avec vue magnifique. Le personnel est aux petits soins !",
      rating: 5,
      image: "👩‍❤️‍👨",
    },
    {
      name: "Thomas Leroy",
      role: "Famille avec enfants",
      content:
        "Parfait pour les familles. Les enfants ont adoré la piscine et le petit-déjeuner.",
      rating: 4,
      image: "👨‍👩‍👧‍👦",
    },
  ];

  // Statistiques
  const stats = [
    { number: 5000, label: "Clients satisfaits", suffix: "+" },
    { number: 98, label: "Taux de recommandation", suffix: "%" },
    { number: 24, label: "Service client", suffix: "/7" },
    { number: 4.8, label: "Note moyenne", suffix: "" },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Section Statistiques */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-serif">
                  <AnimatedCounter
                    end={stat.number}
                    duration={2500}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-blue-100 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Section Chambres Populaires */}
      <section className="py-16 bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Nos Chambres d'Exception
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos chambres et suites soigneusement conçues pour allier
              confort, élégance et technologies modernes.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 text-lg">
                Chargement de nos chambres...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Aucune chambre disponible pour le moment.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Voir toutes nos chambres
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      {/* Section Services */}
      <section className="py-16 bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Nos Services Premium
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour un séjour mémorable et
              productif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Section Témoignages */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les expériences authentiques de nos clients satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Section Réservation Facile */}
      <section className="py-16 bg-white">
        <div className="container-max">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                  Prêt pour une Expérience Inoubliable ?
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  Réservez dès maintenant et bénéficiez de nos meilleurs tarifs
                  avec annulation gratuite jusqu'à 24h avant votre arrivée.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Meilleur prix garanti",
                    "Annulation gratuite",
                    "Paiement sécurisé",
                    "Confirmation immédiate",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/booking"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    <Calendar className="w-5 h-5" />
                    Réserver Maintenant
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 text-center"
                  >
                    <Phone className="w-5 h-5" />
                    Nous Contacter
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: <Award className="w-8 h-8" />,
                    text: "Certifié Excellence",
                  },
                  {
                    icon: <Shield className="w-8 h-8" />,
                    text: "Paiement Sécurisé",
                  },
                  { icon: <Clock className="w-8 h-8" />, text: "Support 24/7" },
                  {
                    icon: <Users className="w-8 h-8" />,
                    text: "Service Personnalisé",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
                  >
                    <div className="flex justify-center mb-2">{item.icon}</div>
                    <p className="text-sm text-blue-100">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="container-max relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Informations texte */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Grand Hôtel Luxe - Localisation Privilégiée
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Situé dans un{" "}
                  <strong className="text-white">
                    emplacement stratégique à Douala
                  </strong>
                  , notre hôtel vous offre un accès facile aux principaux points
                  d'intérêt de la ville tout en garantissant calme et
                  tranquillité.
                </p>
              </div>

              {/* Avantages de localisation EXACTE */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Quartier Privilégié
                    </h4>
                    <p className="text-blue-100 text-sm">
                      Emplacement résidentiel calme
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Proche Aéroport
                    </h4>
                    <p className="text-blue-100 text-sm">
                      Environ 5-10 minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Accès Facile
                    </h4>
                    <p className="text-blue-100 text-sm">
                      Routes principales à proximité
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Sécurité</h4>
                    <p className="text-blue-100 text-sm">
                      Quartier sécurisé 24h/24
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations pratiques EXACTES */}
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-400" />
                  Informations de Localisation
                </h4>
                <div className="space-y-3 text-blue-100">
                  <div className="flex justify-between">
                    <span>Adresse:</span>
                    <span className="text-white font-semibold text-right">
                      Grand Hôtel Luxe, Douala
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance aéroport:</span>
                    <span className="text-white font-semibold">
                      ~5-10 minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport:</span>
                    <span className="text-white font-semibold text-right">
                      Taxi disponible 24/7
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact guidance:</span>
                    <span className="text-white font-semibold">
                       (+237) 699 901 204
                    </span>
                  </div>
                </div>
              </div>

              {/* Services de transport */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-400" />
                  Services de Transport
                </h5>
                <ul className="text-blue-100 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Navette aéroport sur réservation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Service taxi 24h/24</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Parking privé sécurisé gratuit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Location de voitures avec chauffeur</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Carte interactive */}
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-2xl p-2 shadow-2xl">
                <HotelMap />
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://maps.google.com/?q=Grand+hôtel+luxe+Douala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold group"
                >
                  <Navigation className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Itinéraire Google Maps
                </a>
                <a
                  href="tel:+237656708074"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold group"
                >
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Appeler pour guidance
                </a>
              </div>

              {/* Instructions d'accès */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-100 text-sm">
                      <strong>Conseil d'accès:</strong> Depuis l'aéroport,
                      prenez la route principale vers le centre-ville. Notre
                      hôtel est facilement repérable avec sa façade élégante et
                      notre panneau lumineux. Appelez-nous pour des instructions
                      détaillées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Composant ArrowRight pour le bouton
const ArrowRight = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);