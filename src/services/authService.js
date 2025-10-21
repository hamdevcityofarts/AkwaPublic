// src/services/authService.js
import api from './api'

const authService = {
  // Login avec nom, prénom et ID de réservation
  loginWithReservation: (name, surname, reservationId) => {
    return api.post('/auth/login-with-reservation', {
      name,
      surname,
      reservationId
    })
  },

  // Création automatique de compte via réservation
  autoRegisterWithReservation: (reservationData) => {
    return api.post('/auth/auto-register', reservationData)
  },

  // Vérifier le token
  verifyToken: () => {
    return api.get('/auth/verify')
  }
}

export default authService