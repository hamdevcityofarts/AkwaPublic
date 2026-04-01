// ══════════════════════════════════════════════════
// src/pages/MyReservations.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserReservations } from '../store/slices/reservationsSlice'
import { refreshUserReservations } from '../store/slices/authSlice'
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Loader, User } from 'lucide-react'
import roomsService from '../services/roomsService'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

export default function MyReservations() {
  const dispatch = useDispatch()
  const { isAuthenticated, user, reservations: authReservations, reservationsLoading } = useSelector((state) => state.auth)
  const { reservations: sliceReservations, isLoading: sliceLoading } = useSelector((state) => state.reservations)

  const reservations = authReservations.length > 0 ? authReservations : sliceReservations;
  const isLoading = reservationsLoading || sliceLoading;

  const [cancelLoading, setCancelLoading] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserReservations())
      dispatch(refreshUserReservations())
    }
  }, [isAuthenticated, dispatch, user])

  const formatPrice = (price) => roomsService.formatPrice(price)

  const getHoursUntilCheckIn = (checkInDate) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const hoursRemaining = (checkIn - now) / (1000 * 60 * 60);
    return Math.max(0, Math.round(hoursRemaining));
  }

  const canCancelReservation = (reservation) => {
    if (reservation.status !== 'confirmed' && reservation.status !== 'partially_paid') {
      return { allowed: false, reason: 'Cette réservation ne peut pas être annulée' };
    }
    const hoursRemaining = getHoursUntilCheckIn(reservation.checkIn);
    if (hoursRemaining < 48) {
      return { allowed: false, reason: `Annulation impossible : moins de 48h avant le séjour (${hoursRemaining}h restantes)` };
    }
    return { allowed: true, hoursRemaining };
  }

  const handleCancelReservation = async (reservation) => {
    const cancellationCheck = canCancelReservation(reservation);
    if (!cancellationCheck.allowed) { alert(cancellationCheck.reason); return; }
    const confirmMessage = `Êtes-vous sûr de vouloir annuler cette réservation ?\n\nChambre : ${reservation.chambre?.name}\nDates : ${new Date(reservation.checkIn).toLocaleDateString('fr-FR')} - ${new Date(reservation.checkOut).toLocaleDateString('fr-FR')}\nMontant : ${formatPrice(reservation.totalAmount)}`;
    if (!window.confirm(confirmMessage)) return;
    setCancelLoading(reservation._id); setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/reservations/${reservation._id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        alert('Réservation annulée avec succès');
        dispatch(fetchUserReservations()); dispatch(refreshUserReservations());
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'annulation';
      setError(errorMessage); alert(errorMessage);
    } finally { setCancelLoading(null); }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Confirmée' },
      partially_paid: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock className="w-3.5 h-3.5" />, label: 'Partiellement payée' },
      pending_payment: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-3.5 h-3.5" />, label: 'En attente de paiement' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-3.5 h-3.5" />, label: 'Annulée' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Terminée' }
    };
    const config = statusConfig[status] || statusConfig.pending_payment;
    return (
      <span style={{ ...sans, fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${config.bg} ${config.text}`}>
        {config.icon} {config.label}
      </span>
    );
  }

  const renderClientInfo = (reservation) => {
    if (reservation.client) {
      return (
        <div style={{ ...sans, fontSize: "10px" }} className="text-gray-400 mt-1 flex items-center gap-1">
          <User className="w-3 h-3" />
          {reservation.client.name} {reservation.client.surname}
        </div>
      );
    }
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 style={{ ...serif, fontWeight: 300, fontSize: "28px" }} className="text-gray-900 mb-2">Connexion requise</h2>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300 }} className="text-gray-500 mb-6">Vous devez être connecté pour accéder à vos réservations</p>
          <a href="/login"
             style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)", padding: "11px 24px", borderRadius: "32px", display: "inline-block", boxShadow: "0 2px 12px rgba(212,160,51,0.24)", textDecoration: "none" }}>
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase" }}
             className="text-amber-600/70 mb-3">
            Espace personnel
          </p>
          <div className="flex items-center gap-3 mb-3">
            <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
            <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,160,51,0.55),transparent)", display: "block" }} />
            <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
          </div>
          <h1 style={{ ...serif, fontWeight: 300, fontSize: "38px", letterSpacing: "0.03em" }}
              className="text-gray-900 mb-1">
            Mes Réservations
          </h1>
          <p style={{ ...sans, fontSize: "12px", fontWeight: 300, letterSpacing: "0.04em" }}
             className="text-gray-500">
            Gérez vos réservations et consultez votre historique
          </p>
          <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 4 }}>
            ID Utilisateur: {user?._id} | {reservations.length} réservation(s)
          </p>
        </div>
        <div className="text-right">
          <p style={{ ...sans, fontSize: "10px", letterSpacing: "0.10em", color: "#9ca3af" }}>Connecté en tant que</p>
          <p style={{ ...serif, fontWeight: 400, fontSize: "18px" }} className="text-gray-900">
            {user?.surname} {user?.name}
          </p>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div style={sans} className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Chargement */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border border-blue-600 border-t-transparent" />
          <p style={{ ...sans, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase" }}
             className="mt-5 text-gray-400">
            Chargement de vos réservations…
          </p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <p style={{ ...serif, fontWeight: 300, fontSize: "22px" }} className="text-gray-500 mb-4">
            Vous n'avez aucune réservation.
          </p>
          <a href="/rooms"
             style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)", padding: "11px 24px", borderRadius: "32px", display: "inline-block", boxShadow: "0 2px 12px rgba(212,160,51,0.24)", textDecoration: "none" }}>
            Découvrir nos chambres
          </a>
        </div>
      ) : (
        <div className="grid gap-5">
          {reservations.map((reservation) => {
            const cancellationCheck = canCancelReservation(reservation);
            const hoursUntilCheckIn = getHoursUntilCheckIn(reservation.checkIn);

            return (
              <div key={reservation._id}
                   className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-amber-200/60 transition-colors duration-300">
                <div className="p-6">
                  {/* En-tête carte */}
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3 style={{ ...serif, fontWeight: 500, fontSize: "22px", letterSpacing: "0.03em" }}
                          className="text-gray-900">
                        {reservation.chambre?.name || 'Chambre'}
                      </h3>
                      <p style={{ ...sans, fontSize: "10px", fontFamily: "monospace", color: "#9ca3af", marginTop: 3 }}>
                        #{reservation._id}
                      </p>
                      {renderClientInfo(reservation)}
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>

                  {/* Infos */}
                  <div className="grid md:grid-cols-3 gap-4 mb-5">
                    {[
                      { icon: <Calendar className="w-3.5 h-3.5" />, label: "Arrivée", value: new Date(reservation.checkIn).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) },
                      { icon: <Calendar className="w-3.5 h-3.5" />, label: "Départ", value: new Date(reservation.checkOut).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) },
                      { icon: null, label: "Total", value: formatPrice(reservation.totalAmount), highlight: true },
                    ].map(({ icon, label, value, highlight }) => (
                      <div key={label}>
                        <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 3 }}
                           className="flex items-center gap-1">
                          {icon} {label}
                        </p>
                        <p style={highlight
                          ? { ...serif, fontWeight: 400, fontSize: "20px", color: "#2563eb" }
                          : { ...sans, fontSize: "13px", fontWeight: 400, color: "#111" }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Détails séjour */}
                  <div style={{ ...sans, fontSize: "11px", fontWeight: 300, letterSpacing: "0.04em" }}
                       className="flex items-center gap-3 text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <span>{reservation.guests} personne(s)</span>
                    <span className="text-gray-300">•</span>
                    <span>{reservation.nights} nuit(s)</span>
                    {reservation.paymentOption !== 'full' && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-600 font-medium">{reservation.nightsToPay} nuit(s) payée(s)</span>
                      </>
                    )}
                  </div>

                  {/* Avertissement 48h */}
                  {(reservation.status === 'confirmed' || reservation.status === 'partially_paid') && hoursUntilCheckIn < 48 && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div style={sans} className="text-yellow-800 text-xs">
                        <p className="font-semibold">Annulation impossible</p>
                        <p className="font-light">Il reste {hoursUntilCheckIn}h avant votre arrivée. L'annulation n'est plus possible (règle des 48h).</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div style={{ ...sans, fontSize: "10px" }} className="text-gray-400">
                      {reservation.status === 'confirmed' && hoursUntilCheckIn >= 48 && (
                        <span className="text-green-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Annulation possible ({hoursUntilCheckIn}h restantes)
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {/* Annulation */}
                      {(reservation.status === 'confirmed' || reservation.status === 'partially_paid') && (
                        <button
                          onClick={() => handleCancelReservation(reservation)}
                          disabled={!cancellationCheck.allowed || cancelLoading === reservation._id}
                          style={{ ...sans, fontSize: "9px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}
                          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                            cancellationCheck.allowed && cancelLoading !== reservation._id
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                              : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                          }`}>
                          {cancelLoading === reservation._id ? (
                            <><Loader className="w-3.5 h-3.5 animate-spin" /> Annulation...</>
                          ) : (
                            <><XCircle className="w-3.5 h-3.5" /> Annuler</>
                          )}
                        </button>
                      )}

                      {/* Détails */}
                      <button
                        onClick={() => navigate(`/reservation/${reservation._id}`)}
                        style={{ ...sans, fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}
                        className="px-3.5 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
                        Voir détails
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}