// ══════════════════════════════════════════════════
// src/pages/Rooms.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import RoomCard from '../components/RoomCard'
import { fetchRooms } from '../store/slices/roomsSlice'

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

export default function Rooms() {
  const dispatch = useDispatch()
  const { rooms, isLoading, error } = useSelector((state) => state.rooms)
  const [roomsWithPromos, setRoomsWithPromos] = useState([])
  const [loadingPromos, setLoadingPromos] = useState(false)

  useEffect(() => { dispatch(fetchRooms()) }, [dispatch])

  useEffect(() => {
    if (rooms.length > 0) loadPromosForAllRooms()
  }, [rooms])

  const loadPromosForAllRooms = async () => {
    setLoadingPromos(true)
    try {
      console.group('🏨 CHARGEMENT DES PROMOS - ANALYSE COMPLÈTE')
      console.log('📊 Nombre total de chambres:', rooms.length)
      console.table(rooms.map(room => ({ ID: room._id, Nom: room.name, Numéro: room.number, Type: room.type, Prix: `${room.price?.toLocaleString()} FCFA`, Statut: room.status })))

      const roomsWithPromosData = await Promise.all(
        rooms.map(async (room) => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/codepromo/room/${room._id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            if (!response.ok) return { ...room, activePromos: [], bestPromo: null }
            const result = await response.json()
            if (result.success && result.availablePromos && result.availablePromos.length > 0) {
              const sortedPromos = result.availablePromos.sort((a, b) => (b.economie || 0) - (a.economie || 0))
              return { ...room, activePromos: sortedPromos, bestPromo: sortedPromos[0] }
            }
          } catch (error) { console.error(`🚨 Erreur pour ${room.name}:`, error) }
          return { ...room, activePromos: [], bestPromo: null }
        })
      )

      const roomsWithActivePromos = roomsWithPromosData.filter(room => room.activePromos && room.activePromos.length > 0)
      console.log('\n📈 RÉSULTATS FINAUX:')
      console.log(`🏨 Total chambres: ${roomsWithPromosData.length}`)
      console.log(`🔥 Chambres avec promos: ${roomsWithActivePromos.length}`)
      if (roomsWithActivePromos.length > 0) {
        roomsWithActivePromos.forEach((room, index) => {
          const bestPromo = room.bestPromo
          const reduction = bestPromo.type === 'percentage' ? `${bestPromo.value}%` : `${bestPromo.value.toLocaleString()} FCFA`
          console.log(`${index + 1}. ${room.name} (#${room.number}) - ${room.activePromos.length} promo(s)`)
          console.log(`   💰 Prix: ${room.price?.toLocaleString()} → ${bestPromo.prixReduit?.toLocaleString()} FCFA`)
          console.log(`   🎯 Meilleure: ${bestPromo.code} (${reduction}) - Économie: ${bestPromo.economie?.toLocaleString()} FCFA`)
        })
      }
      console.groupEnd()
      setRoomsWithPromos(roomsWithPromosData)
    } catch (error) {
      console.error('🚨 Erreur générale chargement promos:', error)
      setRoomsWithPromos(rooms.map(room => ({ ...room, activePromos: [], bestPromo: null })))
    } finally { setLoadingPromos(false) }
  }

  if (isLoading || loadingPromos) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border border-blue-600 border-t-transparent" />
          <p style={{ ...sans, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase" }}
             className="mt-5 text-gray-400">
            {loadingPromos ? 'Chargement des promotions…' : 'Chargement des chambres…'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div style={sans} className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-semibold text-sm">Erreur</p>
          <p className="text-sm font-light">{error}</p>
        </div>
      </div>
    )
  }

  const roomsWithActivePromos = roomsWithPromos.filter(room => room.activePromos && room.activePromos.length > 0).length

  return (
    <div className="container mx-auto px-4 py-16">
      {/* En-tête */}
      <div className="mb-12">
        <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.30em", textTransform: "uppercase" }}
           className="text-amber-600/70 mb-3">
          Nos hébergements
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
          <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,160,51,0.55),transparent)", display: "block" }} />
          <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
        </div>
        <h1 style={{ ...serif, fontWeight: 300, fontSize: "42px", letterSpacing: "0.03em" }}
            className="text-gray-900 mb-2">
          Nos Chambres
        </h1>
        <p style={{ ...sans, fontSize: "13px", fontWeight: 300, letterSpacing: "0.04em" }}
           className="text-gray-500">
          Découvrez notre sélection de chambres et suites
        </p>

        {/* Bannière promotions */}
        {roomsWithActivePromos > 0 && (
          <div className="mt-5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/60 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-xl">
                  <span className="text-orange-600 text-base">🔥</span>
                </div>
                <div>
                  <h3 style={{ ...serif, fontWeight: 500, fontSize: "17px" }} className="text-orange-900">
                    Promotions en cours !
                  </h3>
                  <p style={{ ...sans, fontSize: "11px", fontWeight: 300 }} className="text-orange-700">
                    {roomsWithActivePromos} chambre(s) avec des réductions exceptionnelles
                  </p>
                </div>
              </div>
              <span style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em" }}
                    className="bg-orange-500 text-white px-3 py-1.5 rounded-full">
                - Jusqu'à{' '}
                {Math.max(
                  ...roomsWithPromos
                    .filter(room => room.activePromos && room.activePromos.length > 0)
                    .map(room => {
                      const bestPromo = room.activePromos[0]
                      return bestPromo?.type === 'percentage' ? bestPromo.value : Math.round((bestPromo?.economie / room.price) * 100) || 0
                    })
                )}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grille chambres */}
      {roomsWithPromos.length === 0 ? (
        <div className="text-center py-16">
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300 }} className="text-gray-400">
            Aucune chambre disponible pour le moment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {roomsWithPromos.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  )
}