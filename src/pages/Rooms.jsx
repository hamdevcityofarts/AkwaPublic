// src/pages/Rooms.jsx (Frontend Public)
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import RoomCard from '../components/RoomCard'
import { fetchRooms } from '../store/slices/roomsSlice'

export default function Rooms() {
  const dispatch = useDispatch()
  const { rooms, isLoading, error } = useSelector((state) => state.rooms)

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des chambres...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Erreur</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Nos Chambres</h1>
        <p className="text-gray-600">Découvrez notre sélection de chambres et suites</p>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune chambre disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  )
}