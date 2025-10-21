// src/components/RoomCard.jsx (MODIFIÉ)
import React from "react";
import { Link } from "react-router-dom";

export default function RoomCard({ room }) {
  const primaryImage = room.images?.find(img => img.isPrimary) || room.images?.[0]
  
  return (
    <article className="bg-white rounded-lg shadow-soft overflow-hidden">
      <img 
        className="card-img" 
        src={primaryImage?.url || '/default-room.jpg'} 
        alt={primaryImage?.alt || room.name} 
      />
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">{room.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{room.type} • {room.category}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gh-red font-semibold">{room.price}€ / nuit</div>
            <div className="text-xs text-gray-500">
              Capacité: {room.capacity} personne(s)
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              to={`/rooms/${room._id}`}
              className="text-sm px-3 py-2 rounded-full border border-gray-200"
            >
              Détails
            </Link>
            <Link
              to={`/booking?room=${room._id}`}
              className="text-sm px-3 py-2 rounded-full text-white btn-gradient"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}