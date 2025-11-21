import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRoomById, clearCurrentRoom } from '../store/slices/roomsSlice'
import { Users, Bed, Ruler, ArrowLeft, Tag, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import ImageSlider from '../components/ImageSlider'
import roomsService from '../services/roomsService'

export default function RoomDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentRoom: room, isLoading, error } = useSelector((state) => state.rooms)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [roomPromos, setRoomPromos] = useState([])
  const [showAllPromos, setShowAllPromos] = useState(false)
  const [promosLoading, setPromosLoading] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchRoomById(id))
    }
    return () => {
      dispatch(clearCurrentRoom())
    }
  }, [id, dispatch])

  // ✅ CHARGER LES PROMOS DE LA CHAMBRE - CORRIGÉ
  useEffect(() => {
    if (room?._id) {
      loadRoomPromos()
    }
  }, [room])

  const loadRoomPromos = async () => {
    setPromosLoading(true)
    try {
      console.log(`🔍 Chargement des promos pour la chambre: ${room._id}`)
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/codepromo/room/${room._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        console.log(`ℹ️ Pas de promos pour cette chambre (${response.status})`)
        setRoomPromos([])
        return
      }

      const result = await response.json()

      if (result.success && result.availablePromos && result.availablePromos.length > 0) {
        console.log(`🎯 ${result.availablePromos.length} promo(s) trouvée(s)`)

        // Trier par meilleure réduction
        const sortedPromos = result.availablePromos.sort((a, b) => {
          const savingsA = a.economie || 0
          const savingsB = b.economie || 0
          return savingsB - savingsA
        })

        setRoomPromos(sortedPromos)
      } else {
        console.log('ℹ️ Aucune promo disponible')
        setRoomPromos([])
      }
    } catch (error) {
      console.error('❌ Erreur chargement promos:', error)
      setRoomPromos([])
    } finally {
      setPromosLoading(false)
    }
  }

  // ✅ GESTION DU CLIC SUR "RÉSERVER"
  const handleReservationClick = () => {
    if (!room?._id) return

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `/booking?room=${room._id}`,
          message: 'Connectez-vous pour réserver cette chambre'
        }
      })
    } else {
      navigate(`/booking?room=${room._id}`)
    }
  }

  // ✅ UTILISER LA MÊME FONCTION DE FORMATAGE
  const formatPrice = (price) => {
    return roomsService.formatPrice(price)
  }

  const hasPromos = roomPromos.length > 0
  const bestPromo = hasPromos ? roomPromos[0] : null
  const displayedPromos = showAllPromos ? roomPromos : roomPromos.slice(0, 3)

  if (isLoading || promosLoading) {
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
          <Link to="/rooms" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux chambres
          </Link>
        </div>
      </div>
    )
  }

  const getTypeLabel = (type) => {
    const typeLabels = {
      standard: 'Standard',
      superior: 'Supérieure',
      deluxe: 'Deluxe',
      suite: 'Suite',
      family: 'Familiale',
      executive: 'Exécutive',
      presidential: 'Présidentielle'
    }
    return typeLabels[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Link to="/rooms" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux chambres
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Slider d'images */}
          <div className="lg:col-span-8 relative">
            {/* ✅ BADGE PROMO SUR L'IMAGE */}
            {hasPromos && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">PROMOTION ACTIVE</span>
                </div>
              </div>
            )}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageSlider images={room.images} className="h-96 lg:h-[500px] w-full" />
            </div>
          </div>

          {/* Informations de la chambre - COLONNE PLUS ÉTROITE */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  {getTypeLabel(room.type)}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
                <p className="text-gray-500">Chambre #{room.number}</p>
              </div>

              {/* ✅ SECTION PRIX AVEC PROMO - COMPACTE */}
              <div
                className={`rounded-xl p-6 border ${
                  hasPromos
                    ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <p className="text-sm text-gray-600 mb-2">À partir de</p>

                <div className="flex items-baseline mb-3">
                  {/* PRIX PRINCIPAL */}
                  <div
                    className={`text-3xl font-bold ${hasPromos ? 'text-orange-600' : 'text-blue-600'}`}
                  >
                    {hasPromos ? formatPrice(bestPromo.prixReduit) : formatPrice(room.price)}
                  </div>

                  {/* ANCIEN PRIX BARRÉ */}
                  {hasPromos && (
                    <span className="text-xl text-gray-400 line-through ml-3">
                      {formatPrice(room.price)}
                    </span>
                  )}
                </div>

                {/* ✅ DÉTAILS DE LA PROMO */}
                {hasPromos && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-green-600 font-semibold text-sm">
                      <Zap className="w-4 h-4 mr-1" />
                      Économisez {formatPrice(bestPromo.economie)}
                      <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        -{bestPromo.pourcentageEconomie || Math.round((bestPromo.economie / room.price) * 100)}%
                      </span>
                    </div>
                    <div className="text-orange-600 text-xs">
                      ⚡ Code: <span className="font-mono font-bold">{bestPromo.code}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReservationClick}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    hasPromos
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {hasPromos ? 'Réserver avec promo' : 'Réserver maintenant'}
                </button>
              </div>

              {/* ✅ SECTION CODES PROMO DISPONIBLES */}
              {hasPromos && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
                  <h3 className="font-bold text-purple-900 mb-3 flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Codes promo ({roomPromos.length})
                  </h3>

                  <div className="space-y-3">
                    {displayedPromos.map((promo, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          index === 0
                            ? 'bg-white border-purple-300 shadow-sm'
                            : 'bg-purple-100/50 border-purple-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-mono font-bold text-purple-700">{promo.code}</span>
                              {index === 0 && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                  ⭐ Meilleure
                                </span>
                              )}
                            </div>
                            <p className="text-purple-600 text-xs">{promo.description}</p>
                          </div>

                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${
                                promo.type === 'percentage' ? 'text-green-600' : 'text-blue-600'
                              }`}
                            >
                              {promo.type === 'percentage' ? `${promo.value}%` : `-${formatPrice(promo.value)}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BOUTON VOIR PLUS/MOINS */}
                  {roomPromos.length > 3 && (
                    <button
                      onClick={() => setShowAllPromos(!showAllPromos)}
                      className="w-full mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center justify-center py-2"
                    >
                      {showAllPromos ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Voir moins
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Voir {roomPromos.length - 3} autres
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION ET CARACTÉRISTIQUES - EN DESSOUS */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          {/* Description */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{room.description}</p>
          </div>

          {/* Caractéristiques */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Caractéristiques</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Capacité</p>
                  <p className="font-semibold text-lg">{room.capacity} personnes</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Bed className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Type de lit</p>
                  <p className="font-semibold text-lg capitalize">{room.bedType?.replace('_', ' ')}</p>
                </div>
              </div>

              {room.size && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Ruler className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Surface</p>
                    <p className="font-semibold text-lg">{room.size}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Équipements - PLEINE LARGEUR */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Équipements & Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {room.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}