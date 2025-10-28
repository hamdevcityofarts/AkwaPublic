import React from 'react'
import { Link } from 'react-router-dom'
import { Users, MapPin, Bed } from 'lucide-react'
import ImageSlider from './ImageSlider'
import roomsService from '../services/roomsService'

const RoomCard = ({ room }) => {
  const getTypeLabel = (type) => {
    const typeLabels = {
      'standard': 'Standard',
      'superior': 'Supérieure',
      'deluxe': 'Deluxe',
      'suite': 'Suite',
      'family': 'Familiale',
      'executive': 'Exécutive',
      'presidential': 'Présidentielle'
    }
    return typeLabels[type] || type
  }

  // ✅ FORMATER LE PRIX EN XAF
  const formatPrice = (price) => {
    return roomsService.formatPrice(price);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* ✅ SLIDER D'IMAGES */}
      <div className="relative h-56">
        <ImageSlider images={room.images} className="h-full" />
        
        {/* Badge type de chambre par-dessus le slider */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {getTypeLabel(room.type)}
          </span>
        </div>

        {/* Badge nombre d'images */}
        {room.images && room.images.length > 1 && (
          <div className="absolute top-3 right-3 z-10 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
            {room.images.length} photos
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Titre et prix */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{room.name}</h3>
            <p className="text-sm text-gray-500">#{room.number}</p>
          </div>
          <div className="text-right ml-3">
            {/* ✅ PRIX EN XAF */}
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(room.price)}
            </div>
            <span className="text-xs text-gray-500">par nuit</span>
          </div>
        </div>

        {/* Informations */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{room.capacity} pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span className="capitalize">{room.bedType?.replace('_', ' ')}</span>
          </div>
          {room.size && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{room.size}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {room.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Équipements */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{room.amenities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Link
            to={`/rooms/${room._id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Voir détails
          </Link>
          <Link
            to={`/booking?room=${room._id}`}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Réserver
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RoomCard