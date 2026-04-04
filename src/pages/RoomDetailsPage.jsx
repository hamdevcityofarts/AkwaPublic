// ══════════════════════════════════════════════════
// src/pages/RoomDetailsPage.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRoomById, clearCurrentRoom } from '../store/slices/roomsSlice'
import { Users, Bed, Ruler, ArrowLeft, Tag, Zap, X, Check, AlertCircle, Bell } from 'lucide-react'
import ImageSlider from '../components/ImageSlider'
import roomsService from '../services/roomsService'
import promoCodesService from '../services/promoCodesService'

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

export default function RoomDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentRoom: room, isLoading, error } = useSelector((state) => state.rooms)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoCode, setPromoCode]           = useState('')
  const [verifying, setVerifying]           = useState(false)
  const [promoError, setPromoError]         = useState('')
  const [verifiedPromo, setVerifiedPromo]   = useState(null)
  const [roomPromos, setRoomPromos]         = useState([])
  const [loadingPromos, setLoadingPromos]   = useState(false)
  const [notification, setNotification]     = useState({ show: false, message: '', type: '' })

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => { setNotification({ show: false, message: '', type: '' }) }, 4000)
  }

  useEffect(() => {
    if (id) dispatch(fetchRoomById(id))
    return () => { dispatch(clearCurrentRoom()) }
  }, [id, dispatch])

  useEffect(() => { if (room?._id) loadRoomPromos() }, [room])

  const loadRoomPromos = async () => {
    setLoadingPromos(true)
    try {
      // ✅ FIX : passer room.price pour calculer prixReduit/economie
      const response = await promoCodesService.getRoomPromos(room._id, room.price)
      if (response.success && response.availablePromos) {
        setRoomPromos(response.availablePromos)
        console.log(`✅ ${response.availablePromos.length} promo(s) chargée(s) pour ${room.name}`)
      }
    } catch (error) { console.error('❌ Erreur chargement promos:', error) }
    finally { setLoadingPromos(false) }
  }

  const hasActivePromos = roomPromos.length > 0

  const verifyPromoCode = async () => {
    if (!promoCode.trim()) { setPromoError('Veuillez entrer un code promo'); return }
    setVerifying(true); setPromoError('')
    try {
      // ✅ FIX : passer room.price pour calculer prixReduit/economie
      const response = await promoCodesService.verifyCodePromo(promoCode, room._id, 1, null, null, room.price)
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
      setPromoError(errorMessage); setVerifiedPromo(null); showNotification(errorMessage, 'error')
    } finally { setVerifying(false) }
  }

  const resetPromoCode = () => {
    setPromoCode(''); setVerifiedPromo(null); setPromoError('')
    setShowPromoInput(false); showNotification('Code promo retiré', 'info')
  }

  const handleReservationClick = () => {
    if (!room?._id) return
    const promoData = verifiedPromo ? {
      codePromo: verifiedPromo.code,
      prixOriginal: verifiedPromo.prixOriginal,
      prixReduit: verifiedPromo.prixReduit,
      economie: verifiedPromo.economie,
      dateDebut: verifiedPromo.dateDebut,
      dateFin: verifiedPromo.dateFin,
      type: verifiedPromo.type,
      value: verifiedPromo.value,
      isValidForDates: true
    } : null
    console.log('🚀 Navigation vers Booking avec données promo:', promoData)
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking?room=${room._id}`, message: 'Connectez-vous pour réserver cette chambre', promoData } })
    } else {
      navigate(`/booking?room=${room._id}`, { state: { promoData } })
    }
  }

  const handleKeyPress = (e) => { if (e.key === 'Enter') verifyPromoCode() }
  const formatPrice = (price) => roomsService.formatPrice(price)
  const displayPrice = verifiedPromo ? verifiedPromo.prixReduit : room?.price
  const displayOriginalPrice = verifiedPromo ? verifiedPromo.prixOriginal : null

  const getTypeLabel = (type) => ({
    standard:'Standard', superior:'Supérieure', deluxe:'Deluxe',
    suite:'Suite', family:'Familiale', executive:'Exécutive', presidential:'Présidentielle'
  }[type] || type)

  if (isLoading || loadingPromos) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border border-blue-600 border-t-transparent" />
          <p style={{ ...sans, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 16 }} className="text-gray-400">
            Chargement…
          </p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 style={{ ...serif, fontWeight: 300, fontSize: "28px" }} className="text-gray-900 mb-4">Chambre non trouvée</h2>
          <Link to="/rooms" className="inline-flex items-center gap-2"
                style={{ ...sans, fontSize: "12px", fontWeight: 400, color: "#2563eb" }}>
            <ArrowLeft className="w-4 h-4" /> Retour aux chambres
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        {/* Toast notification */}
        {notification.show && (
          <div style={sans}
               className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg border max-w-sm w-11/12 transition-all duration-300 text-xs font-medium ${
                 notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800'
                 : notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800'
                 : 'bg-blue-50 border-blue-200 text-blue-800'
               }`}>
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 flex-shrink-0" />
              {notification.message}
            </div>
          </div>
        )}

        {/* Bouton retour */}
        <Link to="/rooms" className="inline-flex items-center gap-2 mb-7"
              style={{ ...sans, fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", color: "#6b7280" }}>
          <ArrowLeft className="w-4 h-4" /> Retour aux chambres
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Slider */}
          <div className="lg:col-span-8 relative">
            {hasActivePromos && (
              <div className="absolute top-4 left-4 z-10">
                <div style={{ ...sans, fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}
                     className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> PROMO
                </div>
              </div>
            )}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageSlider images={room.images} className="h-96 lg:h-[500px] w-full" />
            </div>
          </div>

          {/* Colonne infos */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-5">

              {/* Titre */}
              <div>
                <span style={{ ...sans, fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full mb-3">
                  {getTypeLabel(room.type)}
                </span>
                <h1 style={{ ...serif, fontWeight: 300, fontSize: "32px", letterSpacing: "0.03em", lineHeight: 1.1 }}
                    className="text-gray-900 mb-1">
                  {room.name}
                </h1>
                <div style={{ width: 20, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 5 }} />
                <p style={{ ...sans, fontSize: "10px", letterSpacing: "0.14em", color: "#9ca3af" }}>
                  Chambre #{room.number}
                </p>
              </div>

              {/* Prix + promo */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>
                  À partir de
                </p>

                {verifiedPromo ? (
                  <div className="mb-4">
                    <div style={{ ...sans, fontSize: "11px", color: "#9ca3af", textDecoration: "line-through", marginBottom: 2 }}>
                      {formatPrice(displayOriginalPrice)}
                    </div>
                    <div style={{ ...serif, fontWeight: 400, fontSize: "30px", color: "#ea580c", lineHeight: 1 }}>
                      {formatPrice(displayPrice)}
                    </div>
                    <div style={{ ...sans, fontSize: "9px", letterSpacing: "0.10em", textTransform: "uppercase" }}
                         className="mt-2 px-2.5 py-1 bg-green-50 text-green-700 rounded-full inline-block">
                      Économie {formatPrice(verifiedPromo.economie)}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div style={{ ...serif, fontWeight: 400, fontSize: "32px", color: "#2563eb", lineHeight: 1 }}>
                      {formatPrice(displayPrice)}
                    </div>
                    <div style={{ ...sans, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", marginTop: 4 }}>
                      par nuit
                    </div>
                  </div>
                )}

                {/* Champ code promo */}
                {showPromoInput && (
                  <div className="mb-4 p-3.5 bg-gradient-to-br from-blue-50 to-purple-50/40 border border-blue-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2.5">
                      <label style={{ ...sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1e40af" }}
                             className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Code promo
                      </label>
                      <button onClick={resetPromoCode} className="text-blue-400 hover:text-blue-700 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <input type="text" value={promoCode}
                             onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                             onKeyPress={handleKeyPress}
                             placeholder="Votre code confidentiel"
                             style={{ ...sans, fontSize: "12px", fontWeight: 300, letterSpacing: "0.08em" }}
                             className="flex-1 px-3 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400 outline-none transition-all"
                             disabled={verifying} autoFocus />
                      <button onClick={verifyPromoCode} disabled={verifying || !promoCode.trim()}
                              style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase" }}
                              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        {verifying ? '···' : 'OK'}
                      </button>
                    </div>
                    {promoError && (
                      <div style={{ ...sans, fontSize: "10px" }} className="flex items-center gap-1.5 text-red-500">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {promoError}
                      </div>
                    )}
                    {verifiedPromo && (
                      <div style={{ ...sans, fontSize: "10px", fontWeight: 500 }} className="flex items-center gap-1.5 text-green-600">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" /> Code appliqué ! Économie de {formatPrice(verifiedPromo.economie)}
                      </div>
                    )}
                  </div>
                )}

                {/* Boutons action */}
                <div className="flex gap-2">
                  {hasActivePromos && (
                    <button onClick={() => { setShowPromoInput(!showPromoInput); if (showPromoInput) resetPromoCode() }}
                            style={{ ...sans, fontSize: "9px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}
                            className={`flex-1 py-2.5 px-3 rounded-xl transition-all duration-200 ${
                              showPromoInput
                                ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-sm'
                            }`}>
                      {showPromoInput ? 'Annuler' : '🎁 Code'}
                    </button>
                  )}
                  <button onClick={handleReservationClick} disabled={room.status !== 'disponible'}
                          style={{ ...sans, fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}
                          className={`${hasActivePromos ? 'flex-1' : 'w-full'} py-2.5 px-4 rounded-xl transition-all duration-200 ${
                            room.status === 'disponible'
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}>
                    {room.status === 'disponible' ? 'Réserver' : 'Indisponible'}
                  </button>
                </div>

                {verifiedPromo && room.status === 'disponible' && (
                  <p style={{ ...sans, fontSize: "10px", textAlign: "center", color: "#9ca3af", marginTop: 10 }}>
                    Prix final :{' '}
                    <span style={{ ...serif, fontSize: "16px", color: "#ea580c", fontWeight: 400 }}>{formatPrice(displayPrice)}</span>
                    <span className="text-green-600 ml-2">(économie : {formatPrice(verifiedPromo.economie)})</span>
                  </p>
                )}
              </div>

              {/* Infos chambre */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 style={{ ...serif, fontWeight: 500, fontSize: "17px" }} className="text-gray-900 mb-1">
                  Informations
                </h3>
                <div style={{ width: 14, height: 1, background: "rgba(212,160,51,0.4)", marginBottom: 14 }} />
                <div className="space-y-3">
                  {[
                    { icon: <Users className="w-4 h-4 text-blue-500" />, label: "Capacité", value: `${room.capacity} personnes` },
                    { icon: <Bed className="w-4 h-4 text-blue-500" />, label: "Type de lit", value: room.bedType?.replace('_', ' '), capitalize: true },
                    ...(room.size ? [{ icon: <Ruler className="w-4 h-4 text-blue-500" />, label: "Surface", value: room.size }] : []),
                    { icon: <span style={{ fontSize: "14px" }}>🏷️</span>, label: "Statut", value: room.status === 'disponible' ? 'Disponible' : 'Indisponible', color: room.status === 'disponible' ? '#16a34a' : '#ef4444' },
                  ].map(({ icon, label, value, capitalize, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">{icon}</div>
                      <div>
                        <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af" }}>{label}</p>
                        <p style={{ ...sans, fontSize: "13px", fontWeight: 400, color: color || "#111", textTransform: capitalize ? "capitalize" : undefined }}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description + caractéristiques */}
        <div className="grid lg:grid-cols-2 gap-7 mt-12">
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
            <h2 style={{ ...serif, fontWeight: 300, fontSize: "26px", letterSpacing: "0.03em" }} className="text-gray-900 mb-1">
              Description
            </h2>
            <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 14 }} />
            <p style={{ ...sans, fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "#374151" }}>
              {room.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
            <h3 style={{ ...serif, fontWeight: 300, fontSize: "26px", letterSpacing: "0.03em" }} className="text-gray-900 mb-1">
              Caractéristiques
            </h3>
            <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 14 }} />
            <div className="grid gap-3">
              {[
                { icon: <Users className="w-5 h-5 text-blue-500" />, label: "Capacité", value: `${room.capacity} personnes` },
                { icon: <Bed className="w-5 h-5 text-blue-500" />, label: "Type de lit", value: room.bedType?.replace('_', ' '), capitalize: true },
                ...(room.size ? [{ icon: <Ruler className="w-5 h-5 text-blue-500" />, label: "Surface", value: room.size }] : []),
              ].map(({ icon, label, value, capitalize }) => (
                <div key={label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  {icon}
                  <div>
                    <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af" }}>{label}</p>
                    <p style={{ ...serif, fontWeight: 400, fontSize: "18px", color: "#111", textTransform: capitalize ? "capitalize" : undefined }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Équipements */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 mt-7">
            <h3 style={{ ...serif, fontWeight: 300, fontSize: "26px", letterSpacing: "0.03em" }} className="text-gray-900 mb-1">
              Équipements &amp; Services
            </h3>
            <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 18 }} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {room.amenities.map((amenity, index) => (
                <div key={index}
                     className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors">
                  <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                  <span style={{ ...sans, fontSize: "12px", fontWeight: 300, color: "#374151" }}>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}