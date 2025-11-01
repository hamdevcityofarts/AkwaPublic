// pages/PaymentCallback.jsx - VERSION SIMPLIFIÉE
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Home, Download, Calendar } from 'lucide-react';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  const [reservationId, setReservationId] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // ✅ RÉCUPÉRER LES PARAMÈTRES DE L'URL
      const resId = searchParams.get('reservation');
      const transId = searchParams.get('transaction');
      const errorMsg = searchParams.get('message');

      console.log('📥 Paramètres URL:', { resId, transId, errorMsg });

      // Si message d'erreur dans URL, c'est un échec
      if (errorMsg) {
        setStatus('error');
        setMessage(decodeURIComponent(errorMsg));
        return;
      }

      // Si pas de réservation ID, erreur
      if (!resId) {
        setStatus('error');
        setMessage('Numéro de réservation manquant');
        return;
      }

      setReservationId(resId);
      setTransactionId(transId);

      // ✅ RÉCUPÉRER LES DÉTAILS DE LA RÉSERVATION
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(import.meta.env.VITE_API_BASE_URL + `/reservations/${resId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer la réservation');
      }

      const data = await response.json();

      if (data.success && data.reservation) {
        setReservation(data.reservation);
        
        // Vérifier le statut du paiement
        if (data.reservation.status === 'confirmed' && data.reservation.paiement?.status === 'paid') {
          setStatus('success');
          setMessage('Paiement effectué avec succès !');
        } else {
          setStatus('error');
          setMessage('Le paiement n\'a pas été confirmé');
        }
      } else {
        throw new Error('Réservation non trouvée');
      }

    } catch (error) {
      console.error('❌ Erreur traitement callback:', error);
      setStatus('error');
      setMessage(error.message || 'Une erreur est survenue');
    }
  };

  // Formater le montant en XAF
  const formatAmountCFA = (amount) => {
    if (!amount) return '0 FCFA';
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  };

  // Télécharger le reçu
  const handleDownloadReceipt = () => {
    if (!reservation) return;
    
    const receiptData = {
      reservationId: reservation._id,
      clientName: reservation.clientInfo ? 
        `${reservation.clientInfo.surname} ${reservation.clientInfo.name}` : 
        'Client',
      room: reservation.chambre?.name,
      checkIn: new Date(reservation.checkIn).toLocaleDateString('fr-FR'),
      checkOut: new Date(reservation.checkOut).toLocaleDateString('fr-FR'),
      nights: reservation.nights,
      amount: formatAmountCFA(reservation.totalAmount),
      transactionId: transactionId,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    // Créer un blob et télécharger
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu-${reservation._id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Rendu pendant le traitement
  if (status === 'processing') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Traitement en cours...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous vérifions votre paiement
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <p>⏱️ Cela peut prendre quelques secondes</p>
            <p className="mt-2">🔒 Connexion sécurisée</p>
          </div>
        </div>
      </div>
    );
  }

  // Rendu en cas de succès
  if (status === 'success' && reservation) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* En-tête de succès */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Paiement Confirmé !
            </h1>
            <p className="text-lg text-gray-600">
              {message}
            </p>
          </div>

          {/* Détails de la réservation */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Détails de votre réservation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Numéro de réservation:</span>
                <span className="font-mono font-semibold">{reservation._id}</span>
              </div>
              {transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs">{transactionId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chambre:</span>
                <span className="font-medium">{reservation.chambre?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Arrivée:</span>
                <span className="font-medium">
                  {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Départ:</span>
                <span className="font-medium">
                  {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Durée:</span>
                <span className="font-medium">{reservation.nights} nuit(s)</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-3">
                <span className="text-gray-900 font-semibold">Montant payé:</span>
                <span className="text-green-600 font-bold text-lg">
                  {formatAmountCFA(reservation.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation email */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>📧 Email de confirmation envoyé</strong>
              <br />
              Un email avec tous les détails de votre réservation a été envoyé à{' '}
              <strong>{reservation.clientInfo?.email}</strong>
            </p>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Télécharger le reçu</span>
            </button>
            
            <button
              onClick={() => navigate('/rooms')}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Voir nos chambres</span>
            </button>
          </div>

          {/* Retour accueil */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </button>

          {/* Informations importantes */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              ℹ️ Informations importantes
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check-in à partir de 15h00</li>
              <li>• Check-out avant 11h00</li>
              <li>• Une pièce d'identité sera demandée à l'arrivée</li>
              <li>• Conservez ce numéro de réservation</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Rendu en cas d'erreur
  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* En-tête d'erreur */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement Échoué
            </h1>
            <p className="text-gray-600">
              {message}
            </p>
          </div>

          {/* Informations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-900">
              <strong>Que faire maintenant ?</strong>
              <br />
              • Vérifiez que votre carte est valide et dispose de fonds suffisants
              <br />
              • Contactez votre banque si le problème persiste
              <br />
              • Réessayez avec une autre carte de paiement
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/booking')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Faire une nouvelle réservation
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>

          {/* Support */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Besoin d'aide ?</p>
            <p className="mt-2">
              <a href="tel:+237656708074" className="text-blue-600 hover:underline">
                +237 656 708 074
              </a>
              {' | '}
              <a href="mailto:contact@grandhotel.com" className="text-blue-600 hover:underline">
                contact@grandhotel.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentCallback;