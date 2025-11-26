import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserReservations } from '../store/slices/reservationsSlice'
import { refreshUserReservations } from '../store/slices/authSlice'
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Loader, User } from 'lucide-react'
import roomsService from '../services/roomsService'
import api from '../services/api'

export default function MyReservations() {
  const dispatch = useDispatch()
  const { isAuthenticated, user, reservations: authReservations, reservationsLoading } = useSelector((state) => state.auth)
  const { reservations: sliceReservations, isLoading: sliceLoading } = useSelector((state) => state.reservations)
  
  // ✅ UTILISER LES RÉSERVATIONS DE AUTH SLICE (plus à jour)
  const reservations = authReservations.length > 0 ? authReservations : sliceReservations;
  const isLoading = reservationsLoading || sliceLoading;
  
  const [cancelLoading, setCancelLoading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Chargement des réservations pour utilisateur:', user?._id)
      // ✅ CHARGER DANS LES DEUX SLICES PÊUR COMPATIBILITÉ
      dispatch(fetchUserReservations())
      dispatch(refreshUserReservations())
    }
  }, [isAuthenticated, dispatch, user])

  // ✅ FORMATER LE PRIX EN XAF
  const formatPrice = (price) => {
    return roomsService.formatPrice(price);
  }

  // ✅ CALCULER LES HEURES RESTANTES AVANT CHECK-IN
  const getHoursUntilCheckIn = (checkInDate) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const hoursRemaining = (checkIn - now) / (1000 * 60 * 60);
    return Math.max(0, Math.round(hoursRemaining));
  }

  // ✅ VÉRIFIER SI ANNULATION POSSIBLE (48H)
  const canCancelReservation = (reservation) => {
    if (reservation.status !== 'confirmed' && reservation.status !== 'partially_paid') {
      return { 
        allowed: false, 
        reason: 'Cette réservation ne peut pas être annulée' 
      };
    }

    const hoursRemaining = getHoursUntilCheckIn(reservation.checkIn);
    
    if (hoursRemaining < 48) {
      return { 
        allowed: false, 
        reason: `Annulation impossible : moins de 48h avant le séjour (${hoursRemaining}h restantes)` 
      };
    }

    return { 
      allowed: true, 
      hoursRemaining 
    };
  }

  // ✅ GESTIONNAIRE D'ANNULATION
  const handleCancelReservation = async (reservation) => {
    const cancellationCheck = canCancelReservation(reservation);

    if (!cancellationCheck.allowed) {
      alert(cancellationCheck.reason);
      return;
    }

    const confirmMessage = `Êtes-vous sûr de vouloir annuler cette réservation ?\n\n` +
      `Chambre : ${reservation.chambre?.name}\n` +
      `Dates : ${new Date(reservation.checkIn).toLocaleDateString('fr-FR')} - ${new Date(reservation.checkOut).toLocaleDateString('fr-FR')}\n` +
      `Montant : ${formatPrice(reservation.totalAmount)}`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setCancelLoading(reservation._id);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        `/reservations/${reservation._id}/cancel`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        alert('Réservation annulée avec succès');
        // ✅ RAFRAÎCHIR LES DEUX SOURCES DE RÉSERVATIONS
        dispatch(fetchUserReservations())
        dispatch(refreshUserReservations())
      }
    } catch (error) {
      console.error('❌ Erreur annulation:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'annulation';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setCancelLoading(null);
    }
  }

  // ✅ OBTENIR LE BADGE DE STATUT
  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Confirmée'
      },
      partially_paid: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Clock className="w-4 h-4" />,
        label: 'Partiellement payée'
      },
      pending_payment: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="w-4 h-4" />,
        label: 'En attente de paiement'
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Annulée'
      },
      completed: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Terminée'
      }
    };

    const config = statusConfig[status] || statusConfig.pending_payment;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  }

  // ✅ AFFICHER LES INFORMATIONS CLIENT (pour debug)
  const renderClientInfo = (reservation) => {
    if (reservation.client) {
      return (
        <div className="text-xs text-gray-500 mt-1">
          <User className="w-3 h-3 inline mr-1" />
          {reservation.client.name} {reservation.client.surname}
        </div>
      );
    }
    return null;
  }

  // ✅ AFFICHAGE PENDANT CHARGEMENT
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connexion requise
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à vos réservations
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Réservations</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos réservations et consultez votre historique
          </p>
          {/* ✅ DEBUG: Afficher l'ID utilisateur */}
          <p className="text-xs text-gray-400 mt-1">
            ID Utilisateur: {user?._id} | {reservations.length} réservation(s)
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Connecté en tant que</p>
          <p className="font-semibold text-gray-900">
            {user?.surname} {user?.name}
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement de vos réservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-4">Vous n'avez aucune réservation.</p>
          <a 
            href="/rooms" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Découvrir nos chambres
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation) => {
            const cancellationCheck = canCancelReservation(reservation);
            const hoursUntilCheckIn = getHoursUntilCheckIn(reservation.checkIn);

            return (
              <div key={reservation._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {reservation.chambre?.name || 'Chambre'}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono mt-1">
                        #{reservation._id}
                      </p>
                      {/* ✅ AFFICHER INFO CLIENT */}
                      {renderClientInfo(reservation)}
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>
                  
                  {/* Informations */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Arrivée
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Départ
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="font-bold text-blue-600 text-lg">
                        {formatPrice(reservation.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Détails supplémentaires */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
                    <span>{reservation.guests} personne(s)</span>
                    <span>•</span>
                    <span>{reservation.nights} nuit(s)</span>
                    {reservation.paymentOption !== 'full' && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">
                          {reservation.nightsToPay} nuit(s) payée(s)
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* ✅ AVERTISSEMENT 48H */}
                  {(reservation.status === 'confirmed' || reservation.status === 'partially_paid') && hoursUntilCheckIn < 48 && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold">Annulation impossible</p>
                        <p>Il reste {hoursUntilCheckIn}h avant votre arrivée. L'annulation n'est plus possible (règle des 48h).</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {reservation.status === 'confirmed' && hoursUntilCheckIn >= 48 && (
                        <span className="text-green-600 font-medium">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Annulation possible ({hoursUntilCheckIn}h restantes)
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {/* Bouton annulation */}
                      {(reservation.status === 'confirmed' || reservation.status === 'partially_paid') && (
                        <button 
                          onClick={() => handleCancelReservation(reservation)}
                          disabled={!cancellationCheck.allowed || cancelLoading === reservation._id}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                            cancellationCheck.allowed && cancelLoading !== reservation._id
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {cancelLoading === reservation._id ? (
                            <>
                              <Loader className="w-4 h-4 mr-1 animate-spin" />
                              Annulation...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Annuler
                            </>
                          )}
                        </button>
                      )}
                      
                      {/* Bouton détails */}
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200">
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