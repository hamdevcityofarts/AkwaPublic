// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import roomsReducer from './slices/roomsSlice'
import reservationsReducer from './slices/reservationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    reservations: reservationsReducer,
  },
})