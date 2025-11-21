import api from './api'

const roomsService = {
  getRooms: () => {
    return api.get('/chambres')
  },

  getRoomById: (id) => {
    return api.get(`/chambres/${id}`)
  },

  checkAvailability: (roomId, checkIn, checkOut) => {
    return api.post('/chambres/check-availability', {
      roomId,
      checkIn,
      checkOut
    })
  },

  // ✅ NOUVEAU: Vérifier le code promo
  verifyPromoCode: async (chambreId, promoCode) => {
    try {
      const response = await api.post('/chambres/verify-promo', {
        chambreId,
        promoCode
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✅ FORMATER LE PRIX EN XAF
  formatPrice: (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  },

  // ✅ AFFICHER LE SYMBOLE XAF
  getCurrencySymbol: () => {
    return 'FCFA';
  },

  // ✅ NOUVEAU: Obtenir le badge de statut
  getStatusBadge: (status) => {
    const statusConfig = {
      disponible: {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Disponible'
      },
      occupée: {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Occupée'
      },
      maintenance: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Maintenance'
      }
    };
    return statusConfig[status] || statusConfig.disponible;
  }
}

export default roomsService