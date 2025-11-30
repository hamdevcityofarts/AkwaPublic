import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import PaymentForm from '../components/SecurePaymentForm';
import { Calendar, Users, AlertCircle, CheckCircle, Loader, CreditCard } from 'lucide-react';
import roomsService from '../services/roomsService';
import reservationsService from '../services/reservationsService';

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const roomId = searchParams.get('room');

  // ✅ ÉTATS SIMPLIFIÉS
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  // ✅ ÉTAT PROMO - UNIQUEMENT POUR LES DONNÉES REÇUES
  const [activePromo, setActivePromo] = useState(null);

  // États existants pour les options de paiement
  const [paymentOption, setPaymentOption] = useState('full');
  const [partialNights, setPartialNights] = useState(1);

  // Formulaire
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    checkin: '',
    checkout: '',
    adults: 1,
    children: 0,
    roomId: roomId || '',
    specialRequests: ''
  });

  // ✅ RÉCUPÉRER LES DONNÉES PROMO DEPUIS LA NAVIGATION
  useEffect(() => {
    if (location.state?.promoData) {
      console.log('🎯 Promo reçue depuis navigation:', location.state.promoData);
      setActivePromo(location.state.promoData);
      
      // ✅ RÉINITIALISER LES DATES SI ELLES NE SONT PAS DANS L'INTERVALLE
      const { checkin, checkout } = form;
      if (checkin || checkout) {
        const promoStart = new Date(location.state.promoData.dateDebut);
        const promoEnd = new Date(location.state.promoData.dateFin);
        
        if (checkin && new Date(checkin) < promoStart) {
          setForm(prev => ({ ...prev, checkin: '' }));
        }
        if (checkout && new Date(checkout) > promoEnd) {
          setForm(prev => ({ ...prev, checkout: '' }));
        }
      }
    }
  }, [location.state]);

  // ✅ CALCULER LES DATES MIN/MAX POUR LES CALENDRIERS
  const getDateConstraints = () => {
    if (activePromo) {
      // ✅ AVEC PROMO : RESTREINDRE AUX DATES DE VALIDITÉ
      const promoStart = new Date(activePromo.dateDebut);
      const promoEnd = new Date(activePromo.dateFin);
      
      return {
        minDate: promoStart.toISOString().split('T')[0],
        maxDate: promoEnd.toISOString().split('T')[0],
        minCheckout: form.checkin || promoStart.toISOString().split('T')[0]
      };
    } else {
      // ✅ SANS PROMO : DATES STANDARD
      const today = new Date().toISOString().split('T')[0];
      return {
        minDate: today,
        maxDate: null, // Pas de restriction max sans promo
        minCheckout: form.checkin || today
      };
    }
  };

  const dateConstraints = getDateConstraints();

  // ✅ FORMATER LE PRIX EN XAF
  const formatPrice = (price) => {
    return roomsService.formatPrice(price);
  };

  // Charger les chambres disponibles
  useEffect(() => {
    loadRooms();
  }, []);

  // Pré-sélectionner la chambre si ID dans URL
  useEffect(() => {
    if (roomId && rooms.length > 0) {
      const room = rooms.find(r => r._id === roomId);
      if (room) {
        setSelectedRoom(room);
        setForm(prev => ({ ...prev, roomId: roomId }));
      }
    }
  }, [roomId, rooms]);

  const loadRooms = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/chambres');
      const data = await response.json();
      if (data.success) {
        setRooms(data.chambres || []);
      }
    } catch (err) {
      console.error('Erreur chargement chambres:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'roomId') {
      const room = rooms.find(r => r._id === value);
      setSelectedRoom(room);
      // ✅ RÉINITIALISER LA PROMO SI LA CHAMBRE CHANGE
      setActivePromo(null);
    }

    // ✅ RÉINITIALISER CHECKOUT SI CHECKIN CHANGE
    if (name === 'checkin') {
      setForm(prev => ({ ...prev, checkout: '' }));
    }
  };

  // Gestion du changement d'option de paiement
  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
    if (option !== 'partial') {
      setPartialNights(1);
    }
  };

  // Gestion du changement du nombre de nuits partielles
  const handlePartialNightsChange = (e) => {
    const nights = parseInt(e.target.value);
    const totalNights = calculateNights();
    
    if (nights >= 1 && nights <= totalNights) {
      setPartialNights(nights);
    }
  };

  // Calculer le nombre de nuits
  const calculateNights = () => {
    if (form.checkin && form.checkout) {
      const checkIn = new Date(form.checkin);
      const checkOut = new Date(form.checkout);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  // ✅ CALCULER LE MONTANT SELON L'OPTION CHOISIE (PRIX PROMO SI ACTIF)
  const calculateAmountToPay = () => {
    if (!selectedRoom) return 0;
    
    const totalNights = calculateNights();
    
    // ✅ PRIX DE BASE : PROMO SI ACTIVE, SINON PRIX NORMAL
    const basePricePerNight = activePromo ? activePromo.prixReduit : selectedRoom.price;

    switch (paymentOption) {
      case 'first-night':
        return basePricePerNight;
      
      case 'partial':
        const nightsToPay = Math.min(partialNights, totalNights);
        return basePricePerNight * nightsToPay;
      
      case 'full':
      default:
        return basePricePerNight * totalNights;
    }
  };

  // ✅ CALCULER LE MONTANT FINAL (TOUJOURS AVEC PROMO SI ACTIVE)
  const calculateFinalAmount = () => {
    return Math.round(calculateAmountToPay());
  };

  // Obtenir le nombre de nuits à payer
  const getNightsToPay = () => {
    const totalNights = calculateNights();
    
    switch (paymentOption) {
      case 'first-night':
        return 1;
      
      case 'partial':
        return Math.min(partialNights, totalNights);
      
      case 'full':
      default:
        return totalNights;
    }
  };

  // Obtenir la description de l'option de paiement
  const getPaymentOptionDescription = () => {
    const nightsToPay = getNightsToPay();
    const totalNights = calculateNights();
    
    switch (paymentOption) {
      case 'first-night':
        return `Première nuit (sur ${totalNights} nuits totales)`;
      
      case 'partial':
        return `${nightsToPay} nuit${nightsToPay > 1 ? 's' : ''} (sur ${totalNights} nuits totales)`;
      
      case 'full':
        return `Totalité (${totalNights} nuit${totalNights > 1 ? 's' : ''})`;
      
      default:
        return '';
    }
  };

// FONCTION POUR REDIRIGER VERS CYBERSOURCE - VERSION CORRIGÉE ET SÉCURISÉE
const redirectToCyberSource = (paymentData) => {
  console.log('🚀 Redirection vers CyberSource...', paymentData);
  
  try {
    // ✅ VALIDATION COMPLÈTE DES DONNÉES
    if (!paymentData) {
      throw new Error('Aucune donnée de paiement reçue');
    }
    
    if (!paymentData.form_data || typeof paymentData.form_data !== 'object') {
      throw new Error('Données de formulaire manquantes ou invalides');
    }
    
    if (!paymentData.form_action) {
      throw new Error('URL de redirection manquante');
    }
    
    // Vérifier que form_data n'est pas vide
    const formDataKeys = Object.keys(paymentData.form_data);
    if (formDataKeys.length === 0) {
      throw new Error('Aucun champ de formulaire trouvé');
    }
    
    console.log(`📋 ${formDataKeys.length} champs de formulaire détectés`);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.form_action;
    form.style.display = 'none';
    
    // ✅ BOUCLE SÉCURISÉE avec gestion d'erreur
    formDataKeys.forEach(key => {
      const value = paymentData.form_data[key];
      
      if (value != null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
        console.log(`🔹 Champ ajouté: ${key} = ${value}`);
      }
    });
    
    document.body.appendChild(form);
    console.log('📤 Soumission du formulaire CyberSource...');
    form.submit();
    
  } catch (error) {
    console.error('❌ Erreur lors de la redirection CyberSource:', error);
    setError(`Erreur de paiement: ${error.message}. Veuillez utiliser le paiement alternatif.`);
    setStep(2); // Retour au fallback de paiement local
  }
};
  // Étape 1: Créer la réservation sans authentification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validations existantes
    if (!form.roomId) {
      setError('Veuillez sélectionner une chambre');
      return;
    }

    if (!form.name || !form.surname || !form.email) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!form.checkin || !form.checkout) {
      setError('Veuillez sélectionner les dates');
      return;
    }

    const checkInDate = new Date(form.checkin);
    const checkOutDate = new Date(form.checkout);

    if (checkOutDate <= checkInDate) {
      setError('La date de départ doit être après la date d\'arrivée');
      return;
    }

    if (calculateNights() === 0) {
      setError('La réservation doit être d\'au moins 1 nuit');
      return;
    }

    // ✅ VALIDATION STRICTE DES DATES PAR RAPPORT À LA PROMO
    if (activePromo) {
      const promoStart = new Date(activePromo.dateDebut);
      const promoEnd = new Date(activePromo.dateFin);
      
      if (checkInDate < promoStart || checkOutDate > promoEnd) {
        setError(`Les dates doivent être strictement comprises entre ${promoStart.toLocaleDateString('fr-FR')} et ${promoEnd.toLocaleDateString('fr-FR')} pour bénéficier de cette promotion`);
        return;
      }
    }

    setLoading(true);

    try {
      console.log('🔹 Début création réservation publique...');

      // Données de réservation avec code promo
      const reservationData = {
        chambreId: form.roomId,
        checkIn: form.checkin,
        checkOut: form.checkout,
        adults: parseInt(form.adults),
        children: parseInt(form.children),
        guests: parseInt(form.adults) + parseInt(form.children),
        specialRequests: form.specialRequests,
        paymentMethod: 'card',
        paymentOption: paymentOption,
        nightsToPay: getNightsToPay(),
        // ✅ INCLURE LE CODE PROMO SEULEMENT SI ACTIF
        codePromo: activePromo ? activePromo.codePromo : undefined,
        clientInfo: {
          name: form.name,
          surname: form.surname,
          email: form.email,
          phone: form.phone
        }
      };

      console.log('🔹 Données réservation:', reservationData);

      const reservationResponse = await fetch(import.meta.env.VITE_API_BASE_URL + '/reservations/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      });

      const reservationResult = await reservationResponse.json();

      console.log('🔹 Réponse création réservation:', reservationResult);

      if (!reservationResponse.ok || !reservationResult.success) {
        throw new Error(reservationResult.message || 'Erreur lors de la création de la réservation');
      }

      console.log('✅ Réservation créée:', reservationResult.reservation);
      setReservation(reservationResult.reservation);
      
      if (reservationResult.payment) {
        console.log('💰 Données de paiement reçues:', reservationResult.payment);
        setPaymentData(reservationResult.payment);
        
        setTimeout(() => {
          redirectToCyberSource(reservationResult.payment);
        }, 100);
        
      } else {
        setStep(2);
        console.log('✅ Passage à l\'étape 2 (paiement local)');
      }

    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.message || 'Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Paiement manuel (fallback si CyberSource échoue)
  const handlePaymentSuccess = (paymentResult) => {
    console.log('✅ Paiement réussi:', paymentResult);
    setStep(3);
  };

  // Étape 2: Échec du paiement
  const handlePaymentError = (errorMessage) => {
    console.error('❌ Erreur paiement:', errorMessage);
    setError(errorMessage);
  };

  // Retour à l'étape 1
  const handleBackToForm = () => {
    setStep(1);
    setError(null);
  };

  // COMPOSANT DE REDIRECTION CYBERSOURCE
  const CyberSourceRedirect = () => {
    useEffect(() => {
      if (paymentData) {
        console.log('🔄 Redirection automatique vers CyberSource...');
        redirectToCyberSource(paymentData);
      }
    }, [paymentData]);

    return (
      <div className="container-max py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CreditCard className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Redirection vers le paiement sécurisé</h1>
            <p className="text-gray-600 mb-4">
              Vous allez être redirigé vers la plateforme de paiement sécurisée CyberSource...
            </p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-4">
              Si la redirection ne se fait pas automatiquement, 
              <button 
                onClick={() => redirectToCyberSource(paymentData)}
                className="text-blue-600 hover:text-blue-700 underline ml-1"
              >
                cliquez ici
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ========== RENDU ÉTAPE 3 : CONFIRMATION ==========
  if (step === 3 && reservation) {
    return (
      <div className="container-max py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Réservation Confirmée !</h1>
            <p className="text-gray-600">
              Votre paiement a été traité avec succès
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3">Détails de votre réservation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Numéro:</span>
                <span className="font-medium font-mono text-xs">{reservation._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chambre:</span>
                <span className="font-medium">{selectedRoom?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dates:</span>
                <span className="font-medium">
                  {new Date(form.checkin).toLocaleDateString('fr-FR')} au {new Date(form.checkout).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nuits totales:</span>
                <span className="font-medium">{calculateNights()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Option de paiement:</span>
                <span className="font-medium capitalize">{getPaymentOptionDescription()}</span>
              </div>
              
              {/* ✅ Affichage de la réduction si promo active */}
              {activePromo && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Réduction appliquée:</span>
                    <span className="font-medium">-{formatPrice(activePromo.economie)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Code promo:</span>
                    <span className="font-medium">{activePromo.codePromo}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-600 font-semibold">Montant payé:</span>
                <span className="font-bold text-green-600 text-lg">
                  {formatPrice(reservation.totalAmount || calculateFinalAmount())}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-left">
            <p className="font-semibold text-blue-900 mb-2">📧 Email de confirmation envoyé</p>
            <p className="text-blue-700">
              Un email de confirmation a été envoyé à <strong>{form.email}</strong> avec tous les détails de votre réservation.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-5 py-3 rounded-full text-white btn-gradient font-semibold hover:opacity-90 transition-opacity"
            >
              🏠 Retour à l'accueil
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Conservez votre numéro de réservation pour toute correspondance future
          </p>
        </div>
      </div>
    );
  }

  // ========== RENDU REDIRECTION CYBERSOURCE ==========
  if (paymentData) {
    return <CyberSourceRedirect />;
  }

  // ========== RENDU ÉTAPE 2 : PAIEMENT LOCAL (FALLBACK) ==========
  if (step === 2 && reservation) {
    return (
      <div className="container-max py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleBackToForm}
              className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium mb-4"
            >
              ← Retour aux informations
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <PaymentForm
            reservation={{
              ...reservation,
              totalAmount: calculateFinalAmount(),
              clientEmail: form.email,
              clientName: `${form.surname} ${form.name}`
            }}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    );
  }

  // ========== RENDU ÉTAPE 1 : FORMULAIRE RÉSERVATION ==========
  return (
    <div className="container-max py-12">
      <h1 className="section-title">Réserver une chambre</h1>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-soft"
      >
        {/* ✅ INDICATION PROMO ACTIVE */}
        {activePromo && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-800">🎟️ Code promo actif</p>
                <p className="text-sm text-green-700">
                  Validité: {new Date(activePromo.dateDebut).toLocaleDateString('fr-FR')} au {new Date(activePromo.dateFin).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {activePromo.codePromo}
              </span>
            </div>
          </div>
        )}

        {/* Sélection de la chambre */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Chambre *</label>
          <select
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Sélectionnez une chambre</option>
            {rooms.map(room => (
              <option key={room._id} value={room._id}>
                {room.name} - {formatPrice(room.price)}/nuit
              </option>
            ))}
          </select>
        </div>

        {/* Informations client */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre nom"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prénom *</label>
            <input
              name="surname"
              value={form.surname}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre prénom"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+237 XXX XX XX XX"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Arrivée *
            </label>
            <input
              name="checkin"
              value={form.checkin}
              onChange={handleChange}
              type="date"
              min={dateConstraints.minDate}
              max={dateConstraints.maxDate || undefined}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {activePromo && (
              <p className="text-xs text-gray-500 mt-1">
                Min: {new Date(activePromo.dateDebut).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Départ *
            </label>
            <input
              name="checkout"
              value={form.checkout}
              onChange={handleChange}
              type="date"
              min={dateConstraints.minCheckout}
              max={dateConstraints.maxDate || undefined}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {activePromo && (
              <p className="text-xs text-gray-500 mt-1">
                Max: {new Date(activePromo.dateFin).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>

        {/* Nombre de personnes */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              Adultes *
            </label>
            <input
              name="adults"
              value={form.adults}
              onChange={handleChange}
              type="number"
              min={1}
              max={10}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Enfants</label>
            <input
              name="children"
              value={form.children}
              onChange={handleChange}
              type="number"
              min={0}
              max={10}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Options de paiement */}
        {calculateNights() > 0 && selectedRoom && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Options de paiement</label>
            
            <div className="space-y-3">
              {/* Option 1: Première nuit seulement */}
              <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentOption"
                  value="first-night"
                  checked={paymentOption === 'first-night'}
                  onChange={() => handlePaymentOptionChange('first-night')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Payer la première nuit seulement</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Sécurisez votre réservation en payant seulement la première nuit ({formatPrice(activePromo ? activePromo.prixReduit : selectedRoom.price)})
                  </div>
                </div>
              </label>

              {/* Option 2: Nombre partiel de nuits */}
              <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentOption"
                  value="partial"
                  checked={paymentOption === 'partial'}
                  onChange={() => handlePaymentOptionChange('partial')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Payer un nombre partiel de nuits</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Choisissez combien de nuits vous souhaitez payer maintenant
                  </div>
                  
                  {paymentOption === 'partial' && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Nombre de nuits à payer:</span>
                      <select
                        value={partialNights}
                        onChange={handlePartialNightsChange}
                        className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: calculateNights() }, (_, i) => i + 1).map(night => (
                          <option key={night} value={night}>
                            {night} nuit{night > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: Totalité (comportement actuel) */}
              <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentOption"
                  value="full"
                  checked={paymentOption === 'full'}
                  onChange={() => handlePaymentOptionChange('full')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Payer la totalité du séjour</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Payez l'intégralité de votre séjour en une seule fois
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Demandes spéciales */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Demandes spéciales (optionnel)</label>
          <textarea
            name="specialRequests"
            value={form.specialRequests}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Allergies, préférences, demandes particulières..."
          />
        </div>

        {/* ✅ RÉCAPITULATIF SIMPLIFIÉ ET COHÉRENT */}
        {calculateNights() > 0 && selectedRoom && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-900">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Chambre:</span>
                <span className="font-medium">{selectedRoom.name}</span>
              </div>
              
              {/* ✅ AFFICHAGE COHÉRENT : PRIX PROMO OU NORMAL */}
              {activePromo ? (
                <>
                  <div className="flex justify-between text-gray-400">
                    <span>Prix original:</span>
                    <span className="line-through">{formatPrice(selectedRoom.price)}/nuit</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Prix promo:</span>
                    <span className="font-medium">{formatPrice(activePromo.prixReduit)}/nuit</span>
                  </div>
                  <div className="flex justify-between text-green-600 text-xs">
                    <span>Économie:</span>
                    <span className="font-medium">-{formatPrice(activePromo.economie)}/nuit</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-700">Prix par nuit:</span>
                  <span className="font-medium">{formatPrice(selectedRoom.price)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-700">Nuits totales:</span>
                <span className="font-medium">{calculateNights()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Option choisie:</span>
                <span className="font-medium">{getPaymentOptionDescription()}</span>
              </div>
              
              {/* ✅ INDICATION PROMO APPLIQUÉE */}
              {activePromo && (
                <div className="flex justify-between text-green-600 text-xs">
                  <span>Code promo appliqué:</span>
                  <span className="font-medium">{activePromo.codePromo}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold border-t border-blue-300 pt-2 mt-2">
                <span className="text-blue-900">Montant à payer:</span>
                <span className="text-blue-600">
                  {formatPrice(calculateFinalAmount())}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BOUTON DE SOUMISSION */}
        <button
          className="w-full px-6 py-3 text-sm rounded-full text-white btn-gradient disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 hover:scale-105"
          type="submit"
          disabled={loading || !form.roomId || calculateNights() === 0}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            `Payer ${formatPrice(calculateFinalAmount())}`
          )}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          🔒 Paiement sécurisé via Cybersource (Société Générale)
        </p>
      </form>
    </div>
  );
}