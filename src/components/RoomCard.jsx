// src/components/RoomCard.jsx — VERSION LUXE HÔTELIÈRE
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, MapPin, Bed, Tag, Zap, X, Check, AlertCircle, Bell, MessageCircle, CreditCard } from 'lucide-react'
import { useSelector } from 'react-redux'
import ImageSlider from './ImageSlider'
import roomsService from '../services/roomsService'
import promoCodesService from '../services/promoCodesService'

// ── TEMPORARY WHATSAPP BYPASS ──
const TEMPORARY_WHATSAPP_BOOKING = process.env.REACT_APP_TEMPORARY_WHATSAPP_BOOKING === 'true' || true
const WHATSAPP_PHONE_NUMBER = process.env.REACT_APP_WHATSAPP_PHONE_NUMBER || '237699457655'
const buildWhatsAppMessage = (room, typeLabel) => {
  const defaultMessage = `Bonjour, je souhaite réserver la chambre ${room.name} (${typeLabel}) - N°${room.number}. Capacité : ${room.capacity} personne(s). Merci de me repondre pour finaliser ma réservation.`
  return process.env.REACT_APP_WHATSAPP_MESSAGE || defaultMessage
}

const serif = { fontFamily: "'Cormorant Garamond', serif" }
const sans  = { fontFamily: "'Montserrat', sans-serif" }

const RoomCard = ({ room }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [showPromoInput, setShowPromoInput]   = useState(false)
  const [promoCode, setPromoCode]             = useState('')
  const [verifying, setVerifying]             = useState(false)
  const [promoError, setPromoError]           = useState('')
  const [verifiedPromo, setVerifiedPromo]     = useState(null)
  const [roomPromos, setRoomPromos]           = useState([])
  const [loadingPromos, setLoadingPromos]     = useState(false)
  const [notification, setNotification]       = useState({ show: false, message: '', type: '' })

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000)
  }

  useEffect(() => {
    const loadRoomPromos = async () => {
      if (!room?._id) return
      setLoadingPromos(true)
      try {
        const response = await promoCodesService.getRoomPromos(room._id, room.price)
        if (response.success && response.availablePromos)
          setRoomPromos(response.availablePromos)
      } catch (error) {
        console.error('❌ Erreur chargement promos:', error)
      } finally {
        setLoadingPromos(false)
      }
    }
    loadRoomPromos()
  }, [room?._id])

  const getTypeLabel = (type) => ({
    standard: 'Standard', superior: 'Supérieure', deluxe: 'Deluxe',
    suite: 'Suite', family: 'Familiale', executive: 'Exécutive', presidential: 'Présidentielle'
  }[type] || type)

  const formatPrice  = (price) => roomsService.formatPrice(price)
  const statusBadge  = roomsService.getStatusBadge(room.status)
  const hasActivePromos = roomPromos.length > 0

  const verifyPromoCode = async () => {
    if (!promoCode.trim()) { setPromoError('Veuillez entrer un code promo'); return }
    setVerifying(true); setPromoError('')
    try {
      const response = await promoCodesService.verifyCodePromo(promoCode, room._id, 1, null, null, room.price)
      if (response.success) {
        setVerifiedPromo(response.codePromo); setPromoError('')
        showNotification(`🎉 Code appliqué ! Économie de ${formatPrice(response.codePromo.economie)}`, 'success')
      } else {
        setPromoError(response.message || 'Code promo invalide')
        setVerifiedPromo(null)
        showNotification(response.message || 'Code promo invalide', 'error')
      }
    } catch (error) {
      const msg = error.message || 'Erreur lors de la vérification'
      setPromoError(msg); setVerifiedPromo(null); showNotification(msg, 'error')
    } finally { setVerifying(false) }
  }

  const resetPromoCode = () => {
    setPromoCode(''); setVerifiedPromo(null); setPromoError(''); setShowPromoInput(false)
    showNotification('Code promo retiré', 'info')
  }

  // ── Logique originale de réservation (intégralement conservée) ──
  const originalReservationHandler = (e) => {
    e.preventDefault(); e.stopPropagation()
    const promoData = verifiedPromo ? {
      codePromo: verifiedPromo.code, prixOriginal: verifiedPromo.prixOriginal,
      prixReduit: verifiedPromo.prixReduit, economie: verifiedPromo.economie,
      dateDebut: verifiedPromo.dateDebut, dateFin: verifiedPromo.dateFin
    } : null
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking?room=${room._id}`, message: 'Connectez-vous pour réserver', promoData } })
    } else {
      navigate(`/booking?room=${room._id}`, { state: { promoData } })
    }
  }

  // ── Redirection WhatsApp (conservée intacte) ──
  const whatsappRedirectHandler = (e) => {
    e.preventDefault(); e.stopPropagation()
    const typeLabel = getTypeLabel(room.type)
    const message = buildWhatsAppMessage(room, typeLabel)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    showNotification(`📱 Demande envoyée via WhatsApp pour la chambre ${room.name}`, 'info')
  }

  // ── Point d'entrée bouton principal (bascule selon flag) ──
  const handleReservationClick = (e) => {
    if (room.status !== 'disponible') return
    if (TEMPORARY_WHATSAPP_BOOKING) {
      whatsappRedirectHandler(e)
    } else {
      originalReservationHandler(e)
    }
  }

  // ── ✅ NOUVEAU : Bouton CyberSource toujours disponible ──
  const handleOnlinePaymentClick = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (room.status !== 'disponible') return
    originalReservationHandler(e)
  }

  const handleCardClick = (e) => {
    if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('a'))
      navigate(`/rooms/${room._id}`)
  }

  const handleKeyPress = (e) => { if (e.key === 'Enter') verifyPromoCode() }

  const displayPrice         = verifiedPromo ? verifiedPromo.prixReduit : room.price
  const displayOriginalPrice = verifiedPromo ? verifiedPromo.prixOriginal : null

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer relative group
        border border-gray-100 hover:border-transparent
        shadow-sm hover:shadow-xl
        transition-all duration-400 hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* ── Toast notification ── */}
      {notification.show && (
        <div
          style={sans}
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg
            border max-w-xs w-11/12 transition-all duration-300 text-xs font-medium
            ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800'
              : notification.type === 'error'  ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'}`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 flex-shrink-0" />
            {notification.message}
          </div>
        </div>
      )}

      {/* ── Slider images ── */}
      <div className="relative h-52 overflow-hidden">
        <ImageSlider images={room.images} className="h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        <div className="absolute bottom-3 left-3 z-10">
          <span
            style={{ ...sans, fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-md"
          >
            {getTypeLabel(room.type)}
          </span>
        </div>

        <div className="absolute top-3 left-3 z-10">
          <span
            style={{ ...sans, fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}
            className={`px-2.5 py-1 rounded-full border ${statusBadge.color}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {hasActivePromos && (
          <div className="absolute top-3 right-3 z-10">
            <span
              style={{ ...sans, fontSize: "9px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase" }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Promo
            </span>
          </div>
        )}

        {room.images && room.images.length > 1 && (
          <div
            style={{ ...sans, fontSize: "9px", letterSpacing: "0.10em" }}
            className="absolute bottom-3 right-3 z-10 bg-black/55 text-white px-2 py-1 rounded-full"
          >
            {room.images.length} photos
          </div>
        )}
      </div>

      {/* ── Corps de la carte ── */}
      <div className="p-5">

        {/* Nom + prix */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3
              style={{ ...serif, fontWeight: 500, fontSize: "20px", letterSpacing: "0.03em" }}
              className="text-gray-900 leading-tight mb-0.5 truncate"
            >
              {room.name}
            </h3>
            <div style={{ width: 20, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 4 }} />
            <p style={{ ...sans, fontSize: "10px", letterSpacing: "0.14em", color: "#9ca3af" }}>
              #{room.number}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            {verifiedPromo ? (
              <>
                <div
                  style={{ ...sans, fontSize: "11px", color: "#9ca3af", textDecoration: "line-through" }}
                  className="mb-0.5"
                >
                  {formatPrice(displayOriginalPrice)}
                </div>
                <div style={{ ...serif, fontWeight: 400, fontSize: "24px", color: "#ea580c", lineHeight: 1 }}>
                  {formatPrice(displayPrice)}
                </div>
                <div
                  style={{ ...sans, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase" }}
                  className="mt-1 px-2 py-1 bg-green-50 text-green-700 rounded-full inline-block"
                >
                  -{formatPrice(verifiedPromo.economie)}
                </div>
              </>
            ) : (
              <>
                <div style={{ ...serif, fontWeight: 400, fontSize: "26px", color: "#2563eb", lineHeight: 1 }}>
                  {formatPrice(displayPrice)}
                </div>
                <div style={{ ...sans, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af" }} className="mt-1">
                  par nuit
                </div>
              </>
            )}
          </div>
        </div>

        {/* Infos capacité / lit / taille */}
        <div className="flex items-center gap-4 mb-4">
          {[
            { icon: <Users className="w-3.5 h-3.5" />, label: `${room.capacity} pers.` },
            { icon: <Bed className="w-3.5 h-3.5" />, label: room.bedType?.replace('_', ' ') },
            ...(room.size ? [{ icon: <MapPin className="w-3.5 h-3.5" />, label: room.size }] : []),
          ].map(({ icon, label }, i) => (
            <div
              key={i}
              style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#6b7280" }}
              className="flex items-center gap-1 capitalize"
            >
              <span className="text-gray-400">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Description */}
        {room.description && (
          <p
            style={{ ...sans, fontSize: "12px", fontWeight: 300, letterSpacing: "0.02em", color: "#6b7280" }}
            className="mb-4 line-clamp-1 leading-relaxed"
          >
            {room.description}
          </p>
        )}

        {/* ── Zone code promo ── */}
        {showPromoInput && (
          <div className="mb-4 p-3.5 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between mb-2.5">
              <label
                style={{ ...sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" }}
                className="text-blue-800 flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5" />
                Code promo
              </label>
              <button onClick={resetPromoCode} className="text-blue-400 hover:text-blue-700 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Votre code confidentiel"
                disabled={verifying}
                autoFocus
                style={{ ...sans, fontSize: "12px", letterSpacing: "0.08em" }}
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg
                  focus:ring-2 focus:ring-blue-400 focus:border-transparent
                  bg-white transition-all outline-none"
              />
              <button
                onClick={verifyPromoCode}
                disabled={verifying || !promoCode.trim()}
                style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg
                  hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
                  transition-colors"
              >
                {verifying ? '···' : 'OK'}
              </button>
            </div>

            {promoError && (
              <div style={sans} className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {promoError}
              </div>
            )}
            {verifiedPromo && (
              <div style={sans} className="flex items-center gap-2 mt-2 text-green-600 text-xs font-medium">
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
                Code appliqué — économie de {formatPrice(verifiedPromo.economie)}
              </div>
            )}
          </div>
        )}

        {/* ── Équipements ── */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                style={{ ...sans, fontSize: "10px", fontWeight: 300, letterSpacing: "0.06em" }}
                className="px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-full hover:bg-gray-100 transition-colors"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span
                style={{ ...sans, fontSize: "10px", color: "#9ca3af" }}
                className="px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100"
              >
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Boutons d'action ── */}
        <div className="flex gap-2">

          {/* Bouton code promo */}
          {hasActivePromos && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowPromoInput(!showPromoInput)
                if (showPromoInput) resetPromoCode()
              }}
              style={{ ...sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}
              className={`flex-none py-2.5 px-3 rounded-xl transition-all duration-200 ${
                showPromoInput
                  ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-sm'
              }`}
            >
              {showPromoInput ? 'Annuler' : '🎁 Code'}
            </button>
          )}

          {/* ✅ Bouton WhatsApp — conservé intact, toujours visible si TEMPORARY_WHATSAPP_BOOKING */}
          {TEMPORARY_WHATSAPP_BOOKING && (
            <button
              onClick={handleReservationClick}
              disabled={room.status !== 'disponible'}
              title="Réserver via WhatsApp"
              style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5
                ${room.status === 'disponible'
                  ? 'bg-gradient-to-br from-emerald-500 to-green-700 text-white hover:from-emerald-600 hover:to-green-800 shadow-sm hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {room.status === 'disponible' ? (
                <>
                  <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>WhatsApp</span>
                </>
              ) : (
                <span>Indisponible</span>
              )}
            </button>
          )}

          {/* ✅ NOUVEAU : Bouton paiement en ligne CyberSource */}
          <button
            onClick={handleOnlinePaymentClick}
            disabled={room.status !== 'disponible'}
            title="Payer en ligne par carte bancaire"
            style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5
              ${room.status === 'disponible'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {room.status === 'disponible' ? (
              <>
                <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Payer</span>
              </>
            ) : (
              <span>Indisponible</span>
            )}
          </button>

        </div>

        {/* Prix final si promo */}
        {verifiedPromo && room.status === 'disponible' && (
          <div className="mt-3 text-center">
            <p style={{ ...sans, fontSize: "10px", letterSpacing: "0.08em", color: "#9ca3af" }}>
              Prix final :{' '}
              <span style={{ ...serif, fontSize: "15px", color: "#ea580c", fontWeight: 400 }}>
                {formatPrice(displayPrice)}
              </span>
              <span className="ml-2 text-green-600">
                (économie : {formatPrice(verifiedPromo.economie)})
              </span>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default RoomCard