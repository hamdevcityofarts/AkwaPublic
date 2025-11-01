// pages/PaymentCancel.jsx - PAGE D'ANNULATION
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Home, ArrowLeft, Phone, Mail } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get('reservation');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Paiement Annulé
          </h1>
          <p className="text-gray-600">
            Vous avez annulé le processus de paiement
          </p>
          {reservationId && (
            <p className="text-sm text-gray-500 mt-2">
              Réservation : <code className="bg-gray-100 px-2 py-1 rounded text-xs">{reservationId}</code>
            </p>
          )}
        </div>

        {/* Informations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Votre réservation est toujours en attente</strong>
            <br />
            Aucun montant n'a été débité de votre compte. Vous pouvez réessayer le paiement à tout moment ou faire une nouvelle réservation.
          </p>
        </div>

        {/* Raisons possibles */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">Raisons courantes d'annulation :</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Je veux vérifier les détails de ma réservation</li>
            <li>• Je préfère utiliser une autre carte</li>
            <li>• J'ai besoin de plus de temps pour décider</li>
            <li>• Je veux modifier mes dates de séjour</li>
            <li>• J'ai changé d'avis</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {reservationId && (
            <button
              onClick={() => navigate(`/booking?room=${reservationId}`)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au paiement
            </button>
          )}
          
          <button
            onClick={() => navigate('/booking')}
            className="w-full bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            Faire une nouvelle réservation
          </button>
          
          <button
            onClick={() => navigate('/rooms')}
            className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Choisir une autre chambre
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </button>
        </div>

        {/* Support */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">
            Besoin d'aide pour finaliser votre réservation ?
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              <a href="tel:+237656708074" className="text-blue-600 hover:underline font-medium">
                +237 656 708 074
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              <a href="mailto:contact@grandhotel.com" className="text-blue-600 hover:underline font-medium">
                contact@grandhotel.com
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Notre équipe est disponible 24/7 pour vous assister
          </p>
        </div>

        {/* Note informative */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>
            Votre réservation restera en attente pendant <strong>24 heures</strong>.
            <br />
            Passé ce délai, elle sera automatiquement annulée.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;