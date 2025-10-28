// src/pages/RoomDetailsPage.jsx (Frontend Public)
import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRoomById, clearCurrentRoom } from '../store/slices/roomsSlice'
import { Users, Bed, Ruler, ArrowLeft } from 'lucide-react'
import ImageSlider from '../components/ImageSlider'

export default function RoomDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentRoom: room, isLoading, error } = useSelector((state) => state.rooms)

  useEffect(() => {
    if (id) {
      dispatch(fetchRoomById(id))
    }
    return () => {
      dispatch(clearCurrentRoom())
    }
  }, [id, dispatch])

  // Fonction de conversion Euro vers F CFA
  const convertToCFA = (priceInEuro) => {
    const exchangeRate = 655.957; // Taux de change fixe FCFA/Euro
    return Math.round(priceInEuro * exchangeRate).toLocaleString('fr-FR');
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chambre non trouvée</h2>
          <Link
            to="/rooms"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux chambres
          </Link>
        </div>
      </div>
    )
  }

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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Bouton retour */}
      <Link
        to="/rooms"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux chambres
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Slider d'images */}
        <div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <ImageSlider images={room.images} className="h-96" />
          </div>
        </div>

        {/* Informations de la chambre */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
              {getTypeLabel(room.type)}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
            <p className="text-gray-500">Chambre #{room.number}</p>
          </div>

          {/* Prix */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">À partir de</p>
                <div className="flex items-center text-3xl font-bold text-blue-600">
                  {convertToCFA(room.price)}
                  <span className="text-lg font-normal text-gray-600 ml-2">FCFA / nuit</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Soit environ {room.price} €
                </p>
              </div>
              <Link
                to={`/booking?room=${room._id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Réserver
              </Link>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{room.description}</p>
          </div>

          {/* Caractéristiques */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Caractéristiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Capacité</p>
                  <p className="font-medium">{room.capacity} personnes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Type de lit</p>
                  <p className="font-medium capitalize">{room.bedType?.replace('_', ' ')}</p>
                </div>
              </div>

              {room.size && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Surface</p>
                    <p className="font-medium">{room.size}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-gray-500">🏷️</div>
                <div>
                  <p className="text-sm text-gray-500">Catégorie</p>
                  <p className="font-medium capitalize">{room.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Équipements */}
          {room.amenities && room.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Équipements & Services</h3>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}