// src/pages/UserProfile.jsx (VERSION COMPLÈTE CORRIGÉE)
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, clearError } from '../store/slices/authSlice';
import { User, Mail, Phone, Save, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Nettoyer les erreurs au démontage
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Initialiser le formulaire
  useEffect(() => {
    if (user && !isInitialized) {
      setForm({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    // Effacer les erreurs locales
    if (localError) setLocalError('');
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setLocalError('Le nom est obligatoire');
      return false;
    }
    if (!form.email.trim()) {
      setLocalError('L\'email est obligatoire');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setLocalError('L\'email n\'est pas valide');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Effacer les erreurs précédentes
      dispatch(clearError());
      setLocalError('');

      const result = await dispatch(updateProfile(form)).unwrap();
      
      setSuccessMessage('Profil mis à jour avec succès !');
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setLocalError(err || 'Erreur lors de la mise à jour du profil');
    }
  };

  // Si non authentifié, le ProtectedRoute redirigera automatiquement
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles</p>
            </div>
          </div>
        </div>

        {/* Messages d'alerte */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center animate-in fade-in-0">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {(error || localError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-in fade-in-0">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error || localError}</span>
          </div>
        )}

        {/* Carte du profil */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Votre nom"
                    />
                  </div>

                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="surname"
                      value={form.surname}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>
              </div>

              {/* Coordonnées */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coordonnées</h3>
                
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="votre@email.com"
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="+237 XXX XX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Informations non modifiables */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Informations du compte</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Rôle :</span> 
                    <span className="ml-2 capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {user.role || 'Non spécifié'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Membre depuis :</span>
                    <span className="ml-2">
                      {user.memberSince ? new Date(user.memberSince).toLocaleDateString('fr-FR') : 'Non spécifié'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Statut :</span>
                    <span className="ml-2 capitalize bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {user.status || 'Actif'}
                    </span>
                  </div>
                  {user.lastLogin && (
                    <div>
                      <span className="font-medium">Dernière connexion :</span>
                      <span className="ml-2">
                        {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Actions supplémentaires */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/change-password')}
            disabled={isLoading}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Changer le mot de passe</h3>
                <p className="text-sm text-gray-600">Mettez à jour votre mot de passe</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/my-reservations')}
            disabled={isLoading}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-green-500 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mes réservations</h3>
                <p className="text-sm text-gray-600">Consultez votre historique</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;