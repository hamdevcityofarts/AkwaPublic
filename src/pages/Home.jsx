// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
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
        
        // Prendre les 3 premières chambres comme "populaires"
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

  return (
    <div>
      <HeroSection />

      <section className="container-max py-12">
        <h2 className="section-title">Nos chambres populaires</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gh-red"></div>
            <p className="mt-2 text-gray-600">Chargement des chambres...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-gh-red text-white rounded-full text-sm hover:bg-gh-red-dark transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucune chambre disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 rooms-grid">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-gh-pearl py-12">
        <div className="container-max">
          <h2 className="section-title">Pourquoi choisir Grand Hôtel ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 glass rounded-lg">
              <h3 className="font-semibold mb-2">Navette aéroport</h3>
              <p className="text-sm text-gray-700">
                Service de navette 24/7 pour l'aéroport.
              </p>
            </div>
            <div className="p-6 glass rounded-lg">
              <h3 className="font-semibold mb-2">Business Center</h3>
              <p className="text-sm text-gray-700">
                Salles de réunion et services d'impression.
              </p>
            </div>
            <div className="p-6 glass rounded-lg">
              <h3 className="font-semibold mb-2">Petit-déjeuner premium</h3>
              <p className="text-sm text-gray-700">
                Buffet international inclus pour les réservations premium.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}