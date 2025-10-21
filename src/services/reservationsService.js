// src/services/reservationsService.js
import api from './api'

const reservationsService = {
  createReservation: (reservationData) => {
    return api.post('/reservations', reservationData)
  },

  getUserReservations: () => {
    return api.get('/reservations')
  },

  getReservationById: (id) => {
    return api.get(`/reservations/${id}`)
  },

  cancelReservation: (id) => {
    return api.put(`/reservations/${id}/cancel`)
  }
}

export default reservationsService