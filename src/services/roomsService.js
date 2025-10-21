// src/services/roomsService.js
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
  }
}

export default roomsService