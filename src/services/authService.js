// src/services/authService.js (MODIFIÉ)
import api from './api'

const authService = {
  // Login normal
  login: (credentials) => {
    return api.post('/auth/login', credentials)
  },

  // Register normal
  register: (userData) => {
    return api.post('/auth/register', userData)
  },

  // ✅ NOUVEAU: Mettre à jour le profil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },


  // ✅ NOUVEAU: Changer le mot de passe

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

   verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login avec nom, prénom et ID de réservation (si nécessaire)
  loginWithReservation: (name, surname, reservationId) => {
    return api.post('/auth/login-with-reservation', {
      name,
      surname,
      reservationId
    })
  },

  // Création automatique de compte via réservation (si nécessaire)
  autoRegisterWithReservation: (reservationData) => {
    return api.post('/auth/auto-register', reservationData)
  }
}

export default authService