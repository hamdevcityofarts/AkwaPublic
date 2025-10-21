// src/pages/Rooms.jsx (MODIFIÉ)
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
      <div className="container-max py-12">
        <div className="text-center">Chargement des chambres...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-max py-12">
        <div className="text-center text-red-600">Erreur: {error}</div>
      </div>
    )
  }

  return (
    <div className="container-max py-12">
      <h1 className="section-title">Toutes nos chambres</h1>
      <div className="grid gap-6 rooms-grid">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  )
}