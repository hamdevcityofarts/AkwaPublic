// src/pages/PaymentSuccess.jsx (Frontend Public)
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Mail, Home, Calendar } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reservationId = searchParams.get('reservation');
    const paymentId = searchParams.get('payment');

    if (reservationId) {
      fetchDetails(reservationId, paymentId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  // Fonction de conversion Euro vers F CFA
  const convertToCFA = (amountInEuro) => {
    const exchangeRate = 655.957;
    return Math.round(amountInEuro * exchangeRate).toLocaleString('fr-FR');
  }

  const fetchDetails = async (reservationId, paymentId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Récupérer la réservation
      const resResponse = await fetch(import.meta.env.VITE_API_BASE_URL  + `/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await resResponse.json();
      
      if (resData.success) {
        setReservation(resData.reservation);
      }

      // Récupérer le paiement si ID fourni
      if (paymentId) {
        const payResponse = await fetch(import.meta.env.VITE_API_BASE_URL  + `/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const payData = await payResponse.json();
        
        if (payData.success) {
          setPayment(payData.payment);
        }
      }
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Logique de téléchargement du reçu
    const receiptData = {
      reservationId: reservation._id,
      clientName: `${reservation.client?.name} ${reservation.client?.surname}`,
      room: reservation.chambre?.name,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      nights: reservation.nights,
      amountCFA: convertToCFA(reservation.totalAmount),
      amountEUR: reservation.totalAmount,
      transactionId: payment?.transactionId,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    // Simulation de téléchargement
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reçu-${reservation._id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(import.meta.env.VITE_API_BASE_URL  + `/reservations/${reservation._id}/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        alert('Un email de confirmation a été envoyé avec succès !');
      } else {
        alert('Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur envoi email:', error);
      alert('Erreur lors de l\'envoi de l\'email');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* En-tête de confirmation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Paiement Confirmé !
          </h1>
          <p className="text-lg text-gray-600">
            Votre réservation a été confirmée avec succès
          </p>
        </div>

        {/* Détails de la réservation */}
        {reservation && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Détails de votre réservation
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Informations de réservation */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Informations
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Numéro de réservation:</span>
                    <p className="font-mono font-semibold">{reservation._id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Chambre:</span>
                    <p className="font-semibold">{reservation.chambre?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Type:</span>
                    <p className="capitalize">{reservation.chambre?.type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Client:</span>
                    <p className="font-semibold">{reservation.client?.name} {reservation.client?.surname}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Dates de séjour
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Arrivée:</span>
                    <p className="font-semibold">
                      {new Date(reservation.checkIn).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Départ:</span>
                    <p className="font-semibold">
                      {new Date(reservation.checkOut).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Durée:</span>
                    <p className="font-semibold">{reservation.nights} nuit(s)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Montant */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Montant total</p>
                  <p className="text-3xl font-bold text-green-600">
                    {convertToCFA(reservation.totalAmount)} FCFA
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Soit {reservation.totalAmount} €
                  </p>
                </div>
                {payment && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-mono text-sm">{payment.transactionId}</p>
                    <p className="text-sm text-gray-600 mt-1">Statut: 
                      <span className="text-green-600 font-semibold"> Payé</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Demandes spéciales */}
            {reservation.specialRequests && (
              <div className="border-t border-gray-200 mt-6 pt-6">
                <p className="text-sm text-gray-600 mb-2">Demandes spéciales:</p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded">{reservation.specialRequests}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Que faire maintenant ?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Télécharger le reçu</span>
            </button>
            
            <button
              onClick={handleSendEmail}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Renvoyer par email</span>
            </button>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            ℹ️ Informations importantes
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Check-in à partir de 15h00</li>
            <li>• Check-out avant 11h00</li>
            <li>• Une pièce d'identité sera demandée à l'arrivée</li>
            <li>• Annulation gratuite jusqu'à 48h avant l'arrivée</li>
            <li>• Paiement sécurisé via notre système</li>
          </ul>
        </div>

        {/* Boutons de navigation */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/my-reservations')}
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Voir mes réservations</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </button>
        </div>

        {/* Contact */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Des questions ? Contactez-nous :</p>
          <p className="mt-2">
            <a href="tel:+237XXXXXXXX" className="text-blue-600 hover:underline">
              +237 XX XX XX XX
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
};

export default PaymentSuccess;