import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, MapPin, Bed, Tag, Zap, X, Check, AlertCircle, Bell } from 'lucide-react'
import { useSelector } from 'react-redux'
import ImageSlider from './ImageSlider'
import roomsService from '../services/roomsService'
import promoCodesService from '../services/promoCodesService'

const RoomCard = ({ room }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
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

  // ✅ CHARGER LES PROMOS DE LA CHAMBRE AU MONTAGE
  useEffect(() => {
    const loadRoomPromos = async () => {
      if (!room?._id) return
      
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

    loadRoomPromos()
  }, [room?._id])

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

  // ✅ OBTENIR LE BADGE DE STATUT
  const statusBadge = roomsService.getStatusBadge(room.status);

  // ✅ VÉRIFIER SI LA CHAMBRE A DES CODES PROMO
  const hasActivePromos = roomPromos.length > 0;

  // ✅ VÉRIFIER LE CODE PROMO - MODIFIÉ POUR PERMETTRE LES PROMOS FUTURES
  const verifyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Veuillez entrer un code promo')
      return
    }
    
    setVerifying(true)
    setPromoError('')
    
    try {
      // ✅ MODIFICATION : Ne pas envoyer de dates pour la vérification RoomCard
      // On permet l'application même si la promo commence dans le futur
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

  // ✅ GESTION DU CLIC SUR "RÉSERVER" - TRANSMETTRE LE CODE PROMO
  const handleReservationClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Préparer les données de promo pour la réservation
    const promoData = verifiedPromo ? {
      codePromo: verifiedPromo.code,
      prixOriginal: verifiedPromo.prixOriginal,
      prixReduit: verifiedPromo.prixReduit,
      economie: verifiedPromo.economie,
      dateDebut: verifiedPromo.dateDebut,
      dateFin: verifiedPromo.dateFin
    } : null

    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/booking?room=${room._id}`,
          message: 'Connectez-vous ou créez un compte pour réserver cette chambre',
          promoData: promoData
        }
      })
    } else {
      navigate(`/booking?room=${room._id}`, {
        state: { promoData }
      })
    }
  }

  // ✅ GESTION DU CLIC SUR LA CARTE (sauf boutons)
  const handleCardClick = (e) => {
    if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('a')) {
      navigate(`/rooms/${room._id}`)
    }
  }

  // ✅ GESTION DE LA TOUCHE ENTRÉE DANS LE CHAMP CODE PROMO
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyPromoCode()
    }
  }

  // ✅ PRIX À AFFICHER - TOUJOURS LE PRIX NORMAL SAUF SI CODE APPLIQUÉ
  const displayPrice = verifiedPromo ? verifiedPromo.prixReduit : room.price
  const displayOriginalPrice = verifiedPromo ? verifiedPromo.prixOriginal : null

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* ✅ NOTIFICATION TOAST PERSONNALISÉE */}
      {notification.show && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg border max-w-sm w-11/12 transition-all duration-300 ${
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

      {/* ✅ SLIDER D'IMAGES */}
      <div className="relative h-56">
        <ImageSlider images={room.images} className="h-full" />
        
        {/* Badge type de chambre */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {getTypeLabel(room.type)}
          </span>
        </div>

        {/* ✅ BADGE STATUT */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
        </div>

        {/* ✅ BADGE PROMO SIMPLE - UNIQUEMENT LE BADGE */}
        {hasActivePromos && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              PROMO
            </span>
          </div>
        )}

        {/* Badge nombre d'images */}
        {room.images && room.images.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
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
            {/* ✅ AFFICHAGE PRIX UNIFORME - PAS DE PRIX BARRÉ SAUF SI CODE APPLIQUÉ */}
            {verifiedPromo ? (
              <div className="text-right">
                <div className="text-sm text-gray-400 line-through mb-1">
                  {formatPrice(displayOriginalPrice)}
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatPrice(displayPrice)}
                </div>
                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full mt-1">
                  Économie {formatPrice(verifiedPromo.economie)}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(displayPrice)}
                </div>
                <div className="text-xs text-gray-500 mt-1">par nuit</div>
              </div>
            )}
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

        {/* Équipements */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded transition-colors hover:bg-gray-200"
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

        {/* ✅ BOUTONS D'ACTION - SIMPLIFIÉS */}
        <div className="flex gap-2">
          {/* BOUTON CODE PROMO UNIQUEMENT SI LA CHAMBRE A DES PROMOS */}
          {hasActivePromos && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowPromoInput(!showPromoInput)
                if (showPromoInput) resetPromoCode()
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-center text-sm font-medium transition-all ${
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
            className={`${hasActivePromos ? 'flex-1' : 'w-full'} py-2 px-4 rounded-lg text-center text-xs font-medium transition-all ${
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
    </div>
  )
}

export default RoomCard