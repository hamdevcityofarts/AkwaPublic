// components/SecurePaymentForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Shield, Loader, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const SecurePaymentForm = ({ reservation, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentParams, setPaymentParams] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [mockMode, setMockMode] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

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

  // Initier le paiement
  const initiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token;

      // Données de base
      const paymentData = {
        reservationId: reservation._id
      };

      // Si non authentifié, ajouter les infos client
      if (!isAuthenticated && reservation.clientInfo) {
        paymentData.clientInfo = reservation.clientInfo;
      }

      // Appel API pour initier le paiement
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erreur lors de l\'initiation du paiement');
      }

      console.log('✅ Paramètres de paiement reçus:', result);

      // Vérifier si en mode simulation
      if (result.mockMode) {
        console.log('⚠️ Mode simulation activé');
        setMockMode(true);
        setPaymentParams(result.params);
        setLoading(false);
        return;
      }

      // Mode réel - Préparer la redirection
      setPaymentUrl(result.paymentUrl);
      setPaymentParams(result.params);

      // Soumettre automatiquement le formulaire après un court délai
      setTimeout(() => {
        if (formRef.current) {
          console.log('🔄 Redirection vers CyberSource...');
          formRef.current.submit();
        }
      }, 1000);

    } catch (err) {
      console.error('❌ Erreur initiation paiement:', err);
      setError(err.message);
      setLoading(false);
      if (onError) {
        onError(err.message);
      }
    }
  };

  // Gérer le paiement simulé
  const handleMockPayment = () => {
    console.log('🔧 Simulation de paiement...');
    
    // Simuler un délai de traitement
    setTimeout(() => {
      // Rediriger vers le callback simulé
      window.location.href = paymentParams.redirectUrl;
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* En-tête */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Paiement Sécurisé
        </h2>
        <p className="text-sm text-gray-600">
          Vous allez être redirigé vers la page de paiement sécurisée de CyberSource
        </p>
      </div>

      {/* Résumé */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Résumé</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Réservation:</span>
            <span className="font-medium font-mono text-xs">{reservation._id.slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Chambre:</span>
            <span className="font-medium">{reservation.chambre?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Durée:</span>
            <span className="font-medium">{reservation.nights} nuit(s)</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-900 font-semibold">Montant total:</span>
            <span className="font-bold text-green-600">
              {formatAmountCFA(reservation.totalAmount)}
            </span>
          </div>
          <div className="text-xs text-gray-500 text-right">
            Soit {reservation.totalAmount} €
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">{error}</div>
          </div>
        </div>
      )}

      {/* Mode simulation */}
      {mockMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Mode Simulation</p>
              <p>Les clés CyberSource ne sont pas configurées. Le paiement sera simulé.</p>
            </div>
          </div>
        </div>
      )}

      {/* Sécurité */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-semibold mb-1">Paiement 100% sécurisé</p>
            <ul className="space-y-1 text-xs">
              <li>✓ Aucune donnée bancaire collectée sur notre site</li>
              <li>✓ Transaction chiffrée SSL/TLS</li>
              <li>✓ Certifié PCI-DSS Level 1</li>
              <li>✓ Processeur: Société Générale (CyberSource)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Boutons */}
      {!loading && !paymentParams && (
        <button
          onClick={initiatePayment}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center shadow-lg"
        >
          <Shield className="w-5 h-5 mr-2" />
          Procéder au paiement sécurisé
        </button>
      )}

      {loading && !mockMode && (
        <div className="text-center py-8">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Préparation du paiement...</p>
          <p className="text-sm text-gray-500 mt-2">
            Vous allez être redirigé dans un instant
          </p>
        </div>
      )}

      {mockMode && (
        <button
          onClick={handleMockPayment}
          className="w-full bg-yellow-600 text-white py-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Simuler le paiement
        </button>
      )}

      {/* Formulaire caché pour redirection */}
      {paymentUrl && paymentParams && !mockMode && (
        <form
          ref={formRef}
          method="POST"
          action={paymentUrl}
          className="hidden"
        >
          {Object.entries(paymentParams).map(([key, value]) => (
            <input
              key={key}
              type="hidden"
              name={key}
              value={value}
            />
          ))}
        </form>
      )}

      {/* Informations */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>En procédant au paiement, vous acceptez nos</p>
        <a href="/conditions" className="text-blue-600 hover:underline">
          conditions générales de vente
        </a>
      </div>

      {/* Support */}
      <div className="mt-4 text-center border-t pt-4">
        <p className="text-xs text-gray-500">
          Besoin d'aide ? Contactez-nous au{' '}
          <a href="tel:+237XXXXXXXX" className="text-blue-600 hover:underline">
            +237 XX XX XX XX
          </a>
        </p>
      </div>
    </div>
  );
};

export default SecurePaymentForm;