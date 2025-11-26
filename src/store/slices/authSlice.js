// src/store/slices/authSlice.js (CORRIGÉ DÉFINITIF)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'

// Fonction utilitaire pour récupérer les données du localStorage en toute sécurité
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user')
    if (user && user !== 'undefined' && user !== 'null' && user !== '"undefined"') {
      return JSON.parse(user)
    }
    return null
  } catch (error) {
    console.error('Erreur lors de la récupération du user:', error)
    return null
  }
}

// Fonction utilitaire pour récupérer le token en toute sécurité
const getStoredToken = () => {
  try {
    const token = localStorage.getItem('token')
    if (token && 
        token !== 'undefined' && 
        token !== 'null' && 
        token !== '"undefined"' &&
        token !== 'hundefined' &&
        token.length > 10) {
      return token
    }
    return null
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error)
    return null
  }
}

// ✅ NOUVEAU: Récupérer les réservations du localStorage
const getStoredReservations = () => {
  try {
    const reservations = localStorage.getItem('userReservations')
    if (reservations && reservations !== 'undefined' && reservations !== 'null') {
      return JSON.parse(reservations)
    }
    return []
  } catch (error) {
    console.error('Erreur récupération réservations:', error)
    return []
  }
}

// Nettoyage du localStorage au chargement
const cleanupLocalStorage = () => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  
  if (token && (token === 'undefined' || token === 'null' || token === '"undefined"' || token === 'hundefined')) {
    localStorage.removeItem('token')
    console.log('🗑️ Token corrompu nettoyé')
  }
  
  if (user && (user === 'undefined' || user === 'null' || user === '"undefined"')) {
    localStorage.removeItem('user')
    console.log('🗑️ User corrompu nettoyé')
  }
}

// Exécuter le nettoyage au chargement du module
cleanupLocalStorage()

// Thunk pour le login normal
export const login = createAsyncThunk(
  'auth/login',
 async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      
      // ✅ CHARGER LES RÉSERVATIONS APRÈS CONNEXION
      try {
        const reservationsResponse = await fetchUserReservations(response.data.token)
        if (reservationsResponse.data && reservationsResponse.data.reservations) {
          localStorage.setItem('userReservations', JSON.stringify(reservationsResponse.data.reservations))
        }
      } catch (reservationError) {
        console.warn('⚠️ Impossible de charger les réservations:', reservationError)
      }
      
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de connexion')
    }
  }
)

// Thunk pour l'inscription normale  
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'inscription')
    }
  }
)

// ✅ NOUVEAU: Fonction pour charger les réservations utilisateur
const fetchUserReservations = async (token) => {
  const API_URL = import.meta.env.VITE_BASE_API_URL
  const response = await fetch(`${API_URL}/reservations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return await response.json()
}


// ✅ NOUVEAU: Thunk pour rafraîchir les réservations
export const refreshUserReservations = createAsyncThunk(
  'auth/refreshReservations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      if (!auth.token) {
        throw new Error('Non authentifié')
      }
      
      const response = await fetchUserReservations(auth.token)
      if (response.success) {
        return response.reservations || []
      } else {
        throw new Error(response.message || 'Erreur chargement réservations')
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)





// ✅ NOUVEAU: Mettre à jour le profil
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du profil')
    }
  }
)

// ✅ NOUVEAU: Changer le mot de passe
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(passwordData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du changement de mot de passe')
    }
  }
)

// ✅ NOUVEAU: Vérifier l'authentification
export const verifyAuth = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.verifyToken()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Session invalide')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
    isLoading: false,
    error: null,
    reservations: getStoredReservations(), // ✅ NOUVEAU: Réservations dans le state auth
    reservationsLoading: false

  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.reservations = [] // ✅ VIDER LES RÉSERVATIONS
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userReservations')
    },
    clearError: (state) => {
      state.error = null
    },
    // ✅ NOUVEAU: Forcer la déconnexion en cas de token invalide
      forceLogout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.reservations = []
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userReservations')
    },
    // ✅ NOUVEAU: Mettre à jour les réservations localement
    updateReservations: (state, action) => {
      state.reservations = action.payload
      localStorage.setItem('userReservations', JSON.stringify(action.payload))
    },
    // ✅ NOUVEAU: Ajouter une réservation
    addReservation: (state, action) => {
      state.reservations.unshift(action.payload)
      localStorage.setItem('userReservations', JSON.stringify(state.reservations))
    }
  },

  
  
  extraReducers: (builder) => {
    builder
      // Login
     .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        
        if (action.payload.token && action.payload.user) {
          localStorage.setItem('token', action.payload.token)
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userReservations')
      })
      // ✅ Refresh Reservations
      .addCase(refreshUserReservations.pending, (state) => {
        state.reservationsLoading = true
      })
      .addCase(refreshUserReservations.fulfilled, (state, action) => {
        state.reservationsLoading = false
        state.reservations = action.payload
        localStorage.setItem('userReservations', JSON.stringify(action.payload))
      })
      .addCase(refreshUserReservations.rejected, (state, action) => {
        state.reservationsLoading = false
        console.error('Erreur rafraîchissement réservations:', action.payload)
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        // Validation des données avant stockage
        if (action.payload.token && action.payload.user) {
          localStorage.setItem('token', action.payload.token)
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        // Nettoyer en cas d'erreur
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
      // ✅ Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        // Validation avant stockage
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // ✅ Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false
        // Le mot de passe est changé, pas besoin de mettre à jour l'user
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // ✅ Verify Auth
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
  }
})

export const { 
  loginSuccess, 
  logout, 
  clearError, 
  forceLogout, 
  updateReservations, 
  addReservation 
} = authSlice.actions

export default authSlice.reducer