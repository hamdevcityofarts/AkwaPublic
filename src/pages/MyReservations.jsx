// src/pages/MyReservations.jsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loginWithReservation, clearError } from '../store/slices/authSlice'
import { fetchUserReservations } from '../store/slices/reservationsSlice'

export default function MyReservations() {
  const dispatch = useDispatch()
  const { isAuthenticated, user, isLoading: authLoading, error: authError } = useSelector((state) => state.auth)
  const { reservations, isLoading: reservationsLoading } = useSelector((state) => state.reservations)
  
  const [loginForm, setLoginForm] = useState({
    name: '',
    surname: '',
    reservationId: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserReservations())
    }
  }, [isAuthenticated, dispatch])

  // Fonction de conversion Euro vers F CFA
  const convertToCFA = (priceInEuro) => {
    const exchangeRate = 655.957;
    return Math.round(priceInEuro * exchangeRate).toLocaleString('fr-FR');
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    dispatch(clearError())
    dispatch(loginWithReservation(loginForm))
  }

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    })
  }

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(process.env.API_BASE_URL + `/reservations/${reservationId}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          alert('Réservation annulée avec succès');
          dispatch(fetchUserReservations()); // Recharger les réservations
        } else {
          alert('Erreur lors de l\'annulation');
        }
      } catch (error) {
        console.error('Erreur annulation:', error);
        alert('Erreur lors de l\'annulation');
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container-max py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-soft">
          <h1 className="section-title text-center mb-6">Accéder à mes réservations</h1>
          
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom *</label>
              <input
                type="text"
                name="name"
                value={loginForm.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gh-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prénom *</label>
              <input
                type="text"
                name="surname"
                value={loginForm.surname}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gh-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ID de réservation *</label>
              <input
                type="text"
                name="reservationId"
                value={loginForm.reservationId}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gh-red"
                placeholder="Ex: 507f1f77bcf86cd799439011"
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gh-red text-white py-2 px-4 rounded-full hover:bg-gh-red-dark transition-colors disabled:opacity-50"
            >
              {authLoading ? 'Connexion...' : 'Accéder à mes réservations'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Première visite ?</strong><br />
              Votre compte est créé automatiquement lors de votre première réservation. 
              Utilisez le nom, prénom et l'ID de réservation reçu par email.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-max py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="section-title">Mes Réservations</h1>
        <div className="text-sm text-gray-600">
          Connecté en tant que: <span className="font-semibold">{user?.name} {user?.surname}</span>
        </div>
      </div>
      
      {reservationsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos réservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg mb-4">Vous n'avez aucune réservation.</p>
          <a href="/rooms" className="text-gh-red hover:underline font-semibold">
            Découvrir nos chambres
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="bg-white p-6 rounded-lg shadow-soft border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{reservation.chambre?.name}</h3>
                  <p className="text-gray-600">#{reservation._id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {reservation.status === 'confirmed' ? 'Confirmée' :
                   reservation.status === 'pending' ? 'En attente' :
                   reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Arrivée</p>
                  <p className="font-medium">{new Date(reservation.checkIn).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="font-medium">{new Date(reservation.checkOut).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium text-gh-red">{convertToCFA(reservation.totalAmount)} FCFA</p>
                  <p className="text-xs text-gray-500">{reservation.totalAmount} €</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {reservation.guests} personne(s) • {reservation.nights} nuit(s)
                </div>
                {reservation.status === 'pending' && (
                  <button 
                    onClick={() => handleCancelReservation(reservation._id)}
                    className="text-red-600 text-sm hover:underline font-medium"
                  >
                    Annuler la réservation
                  </button>
                )}
                {reservation.status === 'confirmed' && (
                  <button className="text-blue-600 text-sm hover:underline font-medium">
                    Voir les détails
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}