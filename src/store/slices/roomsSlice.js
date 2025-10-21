// src/store/slices/roomsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import roomsService from '../../services/roomsService'

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roomsService.getRooms()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des chambres')
    }
  }
)

export const fetchRoomById = createAsyncThunk(
  'rooms/fetchRoomById',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await roomsService.getRoomById(roomId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement de la chambre')
    }
  }
)

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    currentRoom: null,
    isLoading: false,
    error: null
  },
  reducers: {
    clearCurrentRoom: (state) => {
      state.currentRoom = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all rooms
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.isLoading = false
        state.rooms = action.payload.chambres
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch room by ID
      .addCase(fetchRoomById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentRoom = action.payload.chambre
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearCurrentRoom, clearError } = roomsSlice.actions
export default roomsSlice.reducer