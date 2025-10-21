// src/store/slices/reservationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reservationsService from '../../services/reservationsService'

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await reservationsService.createReservation(reservationData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la réservation')
    }
  }
)

export const fetchUserReservations = createAsyncThunk(
  'reservations/fetchUserReservations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reservationsService.getUserReservations()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des réservations')
    }
  }
)

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState: {
    reservations: [],
    currentReservation: null,
    isLoading: false,
    error: null
  },
  reducers: {
    clearCurrentReservation: (state) => {
      state.currentReservation = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Create reservation
      .addCase(createReservation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentReservation = action.payload.reservation
        state.reservations.push(action.payload.reservation)
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch user reservations
      .addCase(fetchUserReservations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserReservations.fulfilled, (state, action) => {
        state.isLoading = false
        state.reservations = action.payload.reservations
      })
      .addCase(fetchUserReservations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearCurrentReservation, clearError } = reservationsSlice.actions
export default reservationsSlice.reducer