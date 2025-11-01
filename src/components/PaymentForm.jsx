import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, Shield, CheckCircle } from 'lucide-react';

const PaymentForm = ({ reservation, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cardData, setCardData] = useState({
    number: '',
    holderName: '',
    expiry: '',
    cvv: ''
  });

  // ✅ FONCTION DE CONVERSION EURO → F CFA
  const convertToCFA = (amountInEuro) => {
    const exchangeRate = 655.957;
    return Math.round(amountInEuro * exchangeRate);
  };

  // ✅ FORMATAGE MONTANT F CFA
  const formatAmountCFA = (amountInEuro) => {
    const amountInCFA = convertToCFA(amountInEuro);
    return `${amountInCFA.toLocaleString('fr-FR')} FCFA`;
  };

  // Validation du numéro de carte (Luhn algorithm)
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  // Formater le numéro de carte (groupes de 4)
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g);
    return formatted ? formatted.join(' ') : cleaned;
  };

  // Formater la date d'expiration (MM/YY)
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Détecter le type de carte
  const detectCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return { type: 'visa', icon: '💳', name: 'Visa' };
    if (/^5[1-5]/.test(cleaned)) return { type: 'mastercard', icon: '💳', name: 'Mastercard' };
    if (/^3[47]/.test(cleaned)) return { type: 'amex', icon: '💳', name: 'American Express' };
    if (/^6(?:011|5)/.test(cleaned)) return { type: 'discover', icon: '💳', name: 'Discover' };
    
    return { type: 'unknown', icon: '💳', name: 'Carte' };
  };

  // Gestion des changements de champs
  const handleChange = (field, value) => {
    let formattedValue = value;

    if (field === 'number') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length > 19) return;
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Effacer l'erreur du champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Validation complète du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Numéro de carte
    if (!cardData.number) {
      newErrors.number = 'Numéro de carte requis';
    } else if (!validateCardNumber(cardData.number)) {
      newErrors.number = 'Numéro de carte invalide';
    }

    // Titulaire
    if (!cardData.holderName || cardData.holderName.trim().length < 3) {
      newErrors.holderName = 'Nom du titulaire requis (min. 3 caractères)';
    }

    // Date d'expiration
    if (!cardData.expiry) {
      newErrors.expiry = 'Date d\'expiration requise';
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = 'Format invalide (MM/YY)';
    } else {
      const [month, year] = cardData.expiry.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiry = 'Mois invalide';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = 'Carte expirée';
      }
    }

    // CVV
    if (!cardData.cvv) {
      newErrors.cvv = 'CVV requis';
    } else if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      newErrors.cvv = 'CVV invalide (3-4 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le paiement
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token;

      // Convertir le montant en F CFA pour l'API
      const amountInCFA = convertToCFA(reservation.totalAmount);

      // Données de base
      const paymentData = {
        reservationId: reservation._id,
        paymentMethod: 'card',
        cardData: {
          number: cardData.number.replace(/\s/g, ''),
          expiry: cardData.expiry,
          cvv: cardData.cvv,
          holderName: cardData.holderName
        },
        amount: reservation.totalAmount, // Montant original en Euro
        amountInCFA: amountInCFA, // Montant converti en F CFA
        currency: 'XAF'
      };

      let endpoint = process.env.API_BASE_URL + '/payments/process';
      let headers = {
        'Content-Type': 'application/json'
      };

      // Choisir la bonne route selon l'authentification
      if (isAuthenticated) {
        // Utilisateur connecté (dashboard)
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Visiteur public
        endpoint = process.env.API_BASE_URL + '/payments/process/public';
        paymentData.clientInfo = {
          name: reservation.clientInfo?.name || 'Client',
          surname: reservation.clientInfo?.surname || 'Public',
          email: reservation.clientInfo?.email || reservation.clientEmail,
          phone: reservation.clientInfo?.phone || ''
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erreur lors du traitement du paiement');
      }

      // Succès
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('❌ Erreur paiement:', error);
      if (onError) {
        onError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const cardType = detectCardType(cardData.number);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* En-tête sécurisé */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Paiement Sécurisé</h2>
        <div className="flex items-center text-green-600">
          <Shield className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Sécurisé</span>
        </div>
      </div>

      {/* Résumé de la réservation */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Résumé de la réservation</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Chambre:</span>
            <span className="font-medium">{reservation.chambre?.name || 'Chambre'}</span>
          </div>
          <div className="flex justify-between">
            <span>Durée:</span>
            <span className="font-medium">{reservation.nights} nuit(s)</span>
          </div>
          <div className="flex justify-between">
            <span>Période:</span>
            <span className="font-medium">
              {new Date(reservation.checkIn).toLocaleDateString('fr-FR')} - {new Date(reservation.checkOut).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>

      {/* Montant */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="text-sm text-gray-600 mb-1">Montant à payer</div>
        <div className="text-3xl font-bold text-blue-600">
          {formatAmountCFA(reservation.totalAmount)}
        </div>
        <div className="text-xs text-gray-500 mt-2 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
          Soit {reservation.totalAmount} € (taux: 1€ = 655.957 FCFA)
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Numéro de carte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de carte
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => handleChange('number', e.target.value)}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.number ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              maxLength="19"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <span className="text-2xl">{cardType.icon}</span>
              {cardData.number.length > 0 && (
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                  {cardType.name}
                </span>
              )}
            </div>
          </div>
          {errors.number && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.number}
            </div>
          )}
        </div>

        {/* Nom du titulaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du titulaire
          </label>
          <input
            type="text"
            value={cardData.holderName}
            onChange={(e) => handleChange('holderName', e.target.value.toUpperCase())}
            placeholder="NOM PRÉNOM"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.holderName ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.holderName && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.holderName}
            </div>
          )}
        </div>

        {/* Expiration et CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'expiration
            </label>
            <input
              type="text"
              value={cardData.expiry}
              onChange={(e) => handleChange('expiry', e.target.value)}
              placeholder="MM/AA"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.expiry ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              maxLength="5"
            />
            {errors.expiry && (
              <div className="flex items-center mt-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.expiry}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code de sécurité
            </label>
            <div className="relative">
              <input
                type="password"
                value={cardData.cvv}
                onChange={(e) => handleChange('cvv', e.target.value)}
                placeholder="123"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                maxLength="4"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            {errors.cvv && (
              <div className="flex items-center mt-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.cvv}
              </div>
            )}
          </div>
        </div>

        {/* Avertissement sécurité */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-semibold">Paiement 100% sécurisé</p>
              <p className="text-xs mt-1">
                Vos données bancaires sont chiffrées et protégées. Aucune information n'est stockée sur nos serveurs.
                Certification PCI DSS Level 1.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de paiement */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Traitement en cours...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Payer {formatAmountCFA(reservation.totalAmount)}
            </>
          )}
        </button>

        {/* Informations supplémentaires */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <p>
            En procédant au paiement, vous acceptez nos{' '}
            <a href="/conditions" className="text-blue-600 hover:underline font-medium">
              conditions générales de vente
            </a>
          </p>
          <p className="mt-1">
            Paiement traité par Cybersource - Société Générale
          </p>
        </div>
      </form>

      {/* Cartes acceptées */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center mb-3">
          Cartes bancaires acceptées
        </div>
        <div className="flex justify-center space-x-6 text-2xl">
          <span title="Visa">💳</span>
          <span title="Mastercard">💳</span>
          <span title="American Express">💳</span>
        </div>
        <div className="text-center text-xs text-gray-400 mt-2">
          Visa • Mastercard • American Express
        </div>
      </div>

      {/* Support */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Besoin d'aide ?{' '}
          <a href="tel:+237XXXXXXXX" className="text-blue-600 hover:underline">
            +237 XX XX XX XX
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;