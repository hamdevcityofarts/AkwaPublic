import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, CheckCircle, XCircle, Loader } from 'lucide-react';
import PaymentForm from './PaymentForm';
import roomsService from '../services/roomsService';

const BookingForm = ({ room }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(null);

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    specialRequests: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    return room.price * calculateNights();
  };

  // ✅ FORMATER LE PRIX EN XAF
  const formatPrice = (price) => {
    return roomsService.formatPrice(price);
  };

  // Étape 1: Créer la réservation
  const handleCreateReservation = async (e) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut) {
      setError('Veuillez sélectionner les dates');
      return;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    
    if (checkOutDate <= checkInDate) {
      setError('La date de départ doit être après la date d\'arrivée');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/booking');
        return;
      }

      console.log('🔹 Création réservation pour chambre:', room._id);

      const response = await fetch(process.env.API_BASE_URL + '/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chambreId: room._id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          adults: parseInt(formData.adults),
          children: parseInt(formData.children),
          guests: parseInt(formData.adults) + parseInt(formData.children),
          specialRequests: formData.specialRequests,
          paymentMethod: 'card',
          totalAmount: calculateTotal(),
          nights: calculateNights()
        })
      });

      const result = await response.json();

      console.log('🔹 Réponse création réservation:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erreur lors de la création de la réservation');
      }

      setReservation(result.reservation);
      setStep(2);
      console.log('✅ Réservation créée, passage à l\'étape paiement');
    } catch (err) {
      console.error('❌ Erreur création réservation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Succès du paiement
  const handlePaymentSuccess = (paymentResult) => {
    console.log('✅ Paiement réussi:', paymentResult);
    setStep(3);
  };

  // Étape 2: Échec du paiement
  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    setStep(1);
  };

  // Rendu selon l'étape
  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Réservation Confirmée !
          </h2>
          <p className="text-gray-600">
            Votre paiement a été traité avec succès
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold mb-3">Détails de votre réservation</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Numéro de réservation:</span>
              <span className="font-medium">{reservation._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chambre:</span>
              <span className="font-medium">{room.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dates:</span>
              <span className="font-medium">
                {new Date(formData.checkIn).toLocaleDateString('fr-FR')} - {new Date(formData.checkOut).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Montant payé:</span>
              <span className="font-medium text-green-600">
                {formatPrice(calculateTotal())}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/my-reservations')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Voir mes réservations
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Un email de confirmation a été envoyé à votre adresse
        </p>
      </div>
    );
  }

  if (step === 2 && reservation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setStep(1)}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            ← Retour aux informations
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <PaymentForm
          reservation={{
            ...reservation,
            totalAmount: calculateTotal()
          }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informations de réservation
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleCreateReservation} className="space-y-6">
              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date d'arrivée *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
                    onChange={(e) => handleChange('checkIn', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de départ *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut}
                    onChange={(e) => handleChange('checkOut', e.target.value)}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Nombre de personnes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Adultes *
                  </label>
                  <select
                    required
                    value={formData.adults}
                    onChange={(e) => handleChange('adults', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} adulte{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enfants
                  </label>
                  <select
                    value={formData.children}
                    onChange={(e) => handleChange('children', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} enfant{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Demandes spéciales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demandes spéciales (optionnel)
                </label>
                <textarea
                  rows="4"
                  value={formData.specialRequests}
                  onChange={(e) => handleChange('specialRequests', e.target.value)}
                  placeholder="Allergies, préférences, demandes particulières..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading || calculateNights() === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Continuer vers le paiement
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Récapitulatif */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h3 className="font-semibold text-lg mb-4">Récapitulatif</h3>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Chambre</div>
              <div className="font-medium">{room.name}</div>
            </div>

            {calculateNights() > 0 && (
              <>
                <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix par nuit:</span>
                    <span className="font-medium">{formatPrice(room.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nombre de nuits:</span>
                    <span className="font-medium">{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Personnes:</span>
                    <span className="font-medium">
                      {parseInt(formData.adults) + parseInt(formData.children)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="font-bold text-2xl text-blue-600">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;