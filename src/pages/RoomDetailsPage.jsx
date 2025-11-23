import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRoomById, clearCurrentRoom } from '../store/slices/roomsSlice'
import { Users, Bed, Ruler, ArrowLeft, Tag, Zap, X, Check, AlertCircle, Bell } from 'lucide-react'
import ImageSlider from '../components/ImageSlider'
import roomsService from '../services/roomsService'
import promoCodesService from '../services/promoCodesService'

export default function RoomDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentRoom: room, isLoading, error } = useSelector((state) => state.rooms)
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  // ✅ MÊME LOGIQUE QUE ROOMCARD
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [verifiedPromo, setVerifiedPromo] = useState(null)
  const [roomPromos, setRoomPromos] = useState([])
  const [loadingPromos, setLoadingPromos] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  // ✅ AFFICHER UNE NOTIFICATION
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 4000)
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchRoomById(id))
    }
    return () => {
      dispatch(clearCurrentRoom())
    }
  }, [id, dispatch])

  // ✅ CHARGER LES PROMOS DE LA CHAMBRE - MÊME LOGIQUE QUE ROOMCARD
  useEffect(() => {
    if (room?._id) {
      loadRoomPromos()
    }
  }, [room])

  const loadRoomPromos = async () => {
    setLoadingPromos(true)
    try {
      const response = await promoCodesService.getRoomPromos(room._id)
      if (response.success && response.availablePromos) {
        setRoomPromos(response.availablePromos)
        console.log(`✅ ${response.availablePromos.length} promo(s) chargée(s) pour ${room.name}`)
      }
    } catch (error) {
      console.error('❌ Erreur chargement promos:', error)
    } finally {
      setLoadingPromos(false)
    }
  }

  // ✅ VÉRIFIER SI LA CHAMBRE A DES CODES PROMO
  const hasActivePromos = roomPromos.length > 0

  // ✅ VÉRIFIER LE CODE PROMO - MÊME LOGIQUE QUE ROOMCARD
  const verifyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Veuillez entrer un code promo')
      return
    }
    
    setVerifying(true)
    setPromoError('')
    
    try {
      const response = await promoCodesService.verifyCodePromo(promoCode, room._id, 1)
      
      if (response.success) {
        setVerifiedPromo(response.codePromo)
        setPromoError('')
        showNotification(`🎉 Code promo appliqué ! Économie de ${formatPrice(response.codePromo.economie)}`, 'success')
      } else {
        setPromoError(response.message || 'Code promo invalide')
        setVerifiedPromo(null)
        showNotification(response.message || 'Code promo invalide', 'error')
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la vérification du code promo'
      setPromoError(errorMessage)
      setVerifiedPromo(null)
      showNotification(errorMessage, 'error')
    } finally {
      setVerifying(false)
    }
  }

  // ✅ RÉINITIALISER LE CODE PROMO
  const resetPromoCode = () => {
    setPromoCode('')
    setVerifiedPromo(null)
    setPromoError('')
    setShowPromoInput(false)
    showNotification('Code promo retiré', 'info')
  }

  // ✅ CORRECTION : GESTION DU CLIC SUR "RÉSERVER" - BIEN TRANSMETTRE LES DONNÉES PROMO
  const handleReservationClick = () => {
    if (!room?._id) return

    // ✅ PRÉPARER LES DONNÉES DE PROMO POUR LA RÉSERVATION - IDENTIQUE À ROOMCARD
    const promoData = verifiedPromo ? {
      codePromo: verifiedPromo.code,
      prixOriginal: verifiedPromo.prixOriginal,
      prixReduit: verifiedPromo.prixReduit,
      economie: verifiedPromo.economie,
      dateDebut: verifiedPromo.dateDebut,
      dateFin: verifiedPromo.dateFin,
      // ✅ AJOUTER LES DONNÉES NÉCESSAIRES POUR LE RECALCUL DANS BOOKING
      type: verifiedPromo.type,
      value: verifiedPromo.value,
      isValidForDates: true // Par défaut, la validation se fera dans Booking avec les dates
    } : null

    console.log('🚀 Navigation vers Booking avec données promo:', promoData)

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `/booking?room=${room._id}`,
          message: 'Connectez-vous pour réserver cette chambre',
          promoData: promoData // ✅ TRANSMETTRE LES DONNÉES PROMO
        }
      })
    } else {
      navigate(`/booking?room=${room._id}`, {
        state: { 
          promoData: promoData // ✅ TRANSMETTRE LES DONNÉES PROMO VERS BOOKING
        }
      })
    }
  }

  // ✅ GESTION DE LA TOUCHE ENTRÉE DANS LE CHAMP CODE PROMO
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyPromoCode()
    }
  }

  // ✅ UTILISER LA MÊME FONCTION DE FORMATAGE
  const formatPrice = (price) => {
    return roomsService.formatPrice(price)
  }

  // ✅ PRIX À AFFICHER - MÊME LOGIQUE QUE ROOMCARD
  const displayPrice = verifiedPromo ? verifiedPromo.prixReduit : room?.price
  const displayOriginalPrice = verifiedPromo ? verifiedPromo.prixOriginal : null

  if (isLoading || loadingPromos) {
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
        {/* ✅ NOTIFICATION TOAST PERSONNALISÉE */}
        {notification.show && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg border max-w-sm w-11/12 transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Bouton retour */}
        <Link to="/rooms" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux chambres
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Slider d'images */}
          <div className="lg:col-span-8 relative">
            {/* ✅ BADGE PROMO SIMPLE - UNIQUEMENT LE BADGE */}
            {hasActivePromos && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">PROMO</span>
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

              {/* ✅ SECTION PRIX - MÊME LOGIQUE QUE ROOMCARD */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">À partir de</p>

                {/* ✅ AFFICHAGE PRIX UNIFORME - PAS DE PRIX BARRÉ SAUF SI CODE APPLIQUÉ */}
                {verifiedPromo ? (
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 line-through mb-1">
                      {formatPrice(displayOriginalPrice)}
                    </div>
                    <div className="text-3xl font-bold text-orange-600">
                      {formatPrice(displayPrice)}
                    </div>
                    <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full mt-1">
                      Économie {formatPrice(verifiedPromo.economie)}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(displayPrice)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">par nuit</div>
                  </div>
                )}

                {/* ✅ CHAMP CODE PROMO - APPARAIT SEULEMENT QUAND L'UTILISATEUR CLIQUE */}
                {showPromoInput && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-blue-900 flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        Entrez votre code promo
                      </label>
                      <button
                        onClick={resetPromoCode}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Fermer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        placeholder="Votre code confidentiel"
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={verifying}
                        autoFocus
                      />
                      <button
                        onClick={verifyPromoCode}
                        disabled={verifying || !promoCode.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {verifying ? '...' : 'Vérifier'}
                      </button>
                    </div>

                    {/* Message d'erreur ou succès */}
                    {promoError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm animate-pulse">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{promoError}</span>
                      </div>
                    )}
                    
                    {verifiedPromo && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        <span>Code appliqué ! Économie de {formatPrice(verifiedPromo.economie)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* ✅ BOUTONS D'ACTION - MÊME LOGIQUE QUE ROOMCARD */}
                <div className="flex gap-2">
                  {/* BOUTON CODE PROMO UNIQUEMENT SI LA CHAMBRE A DES PROMOS */}
                  {hasActivePromos && (
                    <button
                      onClick={() => {
                        setShowPromoInput(!showPromoInput)
                        if (showPromoInput) resetPromoCode()
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg text-center text-sm font-medium transition-all ${
                        showPromoInput 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md'
                      }`}
                    >
                      {showPromoInput ? 'Annuler' : '🎁 Code Promo'}
                    </button>
                  )}
                  
                  {/* ✅ BOUTON RÉSERVER - TOUJOURS LE MÊME STYLE */}
                  <button
                    onClick={handleReservationClick}
                    disabled={room.status !== 'disponible'}
                    className={`${hasActivePromos ? 'flex-1' : 'w-full'} py-3 px-4 rounded-lg text-center text-sm font-medium transition-all ${
                      room.status === 'disponible'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {room.status === 'disponible' ? 'Réserver maintenant' : 'Indisponible'}
                  </button>
                </div>

                {/* ✅ INDICATEUR DE PRIX FINAL UNIQUEMENT SI CODE APPLIQUÉ */}
                {verifiedPromo && room.status === 'disponible' && (
                  <div className="mt-3 text-center">
                    <div className="text-xs text-gray-500">
                      Prix final: <span className="font-bold text-orange-600 text-sm">{formatPrice(displayPrice)}</span>
                      <span className="text-green-600 ml-2">
                        (Économie: {formatPrice(verifiedPromo.economie)})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ SECTION INFORMATIONS COMPLÉMENTAIRES */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Capacité</p>
                      <p className="font-medium">{room.capacity} personnes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Type de lit</p>
                      <p className="font-medium capitalize">{room.bedType?.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {room.size && (
                    <div className="flex items-center gap-3">
                      <Ruler className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Surface</p>
                        <p className="font-medium">{room.size}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-blue-600 text-lg">🏷️</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <p className={`font-medium ${
                        room.status === 'disponible' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {room.status === 'disponible' ? 'Disponible' : 'Indisponible'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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