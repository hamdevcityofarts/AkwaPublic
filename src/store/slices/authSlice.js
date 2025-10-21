// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'

// Thunk pour la connexion avec nom/prénom/ID réservation
export const loginWithReservation = createAsyncThunk(
  'auth/loginWithReservation',
  async ({ name, surname, reservationId }, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithReservation(name, surname, reservationId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de connexion')
    }
  }
)

// Thunk pour la création automatique de compte via réservation
export const autoRegisterWithReservation = createAsyncThunk(
  'auth/autoRegisterWithReservation',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await authService.autoRegisterWithReservation(reservationData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du compte')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login avec réservation
      .addCase(loginWithReservation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithReservation.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginWithReservation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Auto-registration avec réservation
      .addCase(autoRegisterWithReservation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(autoRegisterWithReservation.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(autoRegisterWithReservation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer