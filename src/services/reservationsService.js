import api from './api'

const reservationsService = {
  createReservation: (reservationData) => {
    return api.post('/reservations', reservationData)
  },

  createReservationPublic: (reservationData) => {
    return api.post('/reservations/public', reservationData)
  },

  getUserReservations: () => {
    return api.get('/reservations')
  },

  // ✅ NOUVEAU: Récupérer une réservation spécifique
  getReservationById: (id) => {
    return api.get(`/reservations/${id}`)
  },

  cancelReservation: (id) => {
    return api.put(`/reservations/${id}/cancel`)
  },

  // ✅ FORMATER LE MONTANT EN XAF
  formatAmount: (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  },

  // ✅ AFFICHER LE SYMBOLE XAF
  getCurrencySymbol: () => {
    return 'FCFA';
  },

  // ✅ NOUVEAU: Vérifier si une réservation appartient à l'utilisateur
  isUserReservation: (reservation, userId) => {
    return reservation.client && reservation.client._id === userId;
  }
}

export default reservationsService;