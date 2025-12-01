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
  },

 // Dans reservationsService.js, ajoutez ces méthodes :

// 📄 MÉTHODES DE REÇU
getReservationReceipt: (id) => {
  return api.get(`/reservations/${id}/receipt`, {
    responseType: 'blob',
    headers: {
      'Accept': 'text/html, application/pdf'
    }
  })
},

getReceiptDownload: (id) => {
  return api.get(`/reservations/${id}/receipt/download`, {
    responseType: 'blob'
  })
},

getReceiptUrl: (id) => {
  return api.get(`/reservations/${id}/receipt/url`)
},

// 📊 MÉTHODES DE STATISTIQUES
getReservationStats: () => {
  return api.get('/reservations/stats/overview')
},

getPromoCodeStats: () => {
  return api.get('/reservations/stats/promo-codes')
}
}

export default reservationsService;