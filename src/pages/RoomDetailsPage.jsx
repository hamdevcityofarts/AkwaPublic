// src/pages/RoomDetailsPage.jsx (MODIFIÉ)
import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRoomById, clearCurrentRoom } from '../store/slices/roomsSlice'

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

  if (isLoading) {
    return <div className="container-max py-12 text-center">Chargement...</div>
  }

  if (error || !room) {
    return <div className="container-max py-12 text-center text-red-600">Chambre non trouvée</div>
  }

  const primaryImage = room.images?.find(img => img.isPrimary) || room.images?.[0]
  const otherImages = room.images?.filter(img => !img.isPrimary) || []

  return (
    <div className="container-max py-12">
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg overflow-hidden shadow-soft">
            <img
              src={primaryImage?.url || '/default-room.jpg'}
              alt={primaryImage?.alt || room.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {otherImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {otherImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  className="w-full h-28 object-cover rounded"
                  alt={image.alt || `Vue ${idx + 1} de ${room.name}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-serif mb-2">{room.name}</h2>
          <div className="text-gh-red font-semibold text-xl mb-3">
            {room.price}€ / nuit
          </div>
          <p className="text-gray-700 mb-4">{room.description}</p>

          <div className="glass p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Caractéristiques</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Type: {room.type}</li>
              <li>• Catégorie: {room.category}</li>
              <li>• Capacité: {room.capacity} personne(s)</li>
              <li>• Lit: {room.bedType}</li>
              {room.size && <li>• Surface: {room.size}</li>}
            </ul>
          </div>

          {room.amenities && room.amenities.length > 0 && (
            <div className="glass p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Équipements</h4>
              <ul className="text-sm text-gray-700">
                {room.amenities.map((amenity, index) => (
                  <li key={index}>• {amenity}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              to={`/booking?room=${room._id}`}
              className="px-5 py-2 rounded-full text-white btn-gradient"
            >
              Réserver
            </Link>
            <button className="px-5 py-2 rounded-full border">
              Demander un devis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}