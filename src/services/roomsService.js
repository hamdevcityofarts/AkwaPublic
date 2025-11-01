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

  // ✅ FORMATER LE PRIX EN XAF - SANS RÉDUCTION AUTOMATIQUE
  formatPrice: (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  },

  // ✅ AFFICHER LE SYMBOLE XAF
  getCurrencySymbol: () => {
    return 'FCFA';
  }
}

export default roomsService