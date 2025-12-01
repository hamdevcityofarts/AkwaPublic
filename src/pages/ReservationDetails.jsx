// src/pages/ReservationDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  MapPin, 
  Download,
  ArrowLeft,
  Building,
  Phone,
  Mail,
  FileText,
  Bed,
  Users,
  Shield,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Moon,
  Wallet
} from 'lucide-react';
import api from '../services/api';
import roomsService from '../services/roomsService';
import receiptService from '../services/receiptService';
import reservationsService from '../services/reservationsService';

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchReservationDetails();
  }, [id, isAuthenticated, navigate]);

  const fetchReservationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reservationsService.getReservationById(id);
      
      if (response.data.success) {
        setReservation(response.data.reservation);
      } else {
        setError('Impossible de charger les détails de la réservation');
      }
    } catch (error) {
      console.error('❌ Erreur chargement détails:', error);
      setError(error.response?.data?.message || 'Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return roomsService.formatPrice(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Confirmée' },
      partially_paid: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Partiellement payée' },
      pending_payment: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'En attente de paiement' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Annulée' },
      completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Terminée' },
      payment_failed: { color: 'bg-orange-100 text-orange-800', icon: XCircle, label: 'Paiement échoué' },
      pending: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'En attente' }
    };
    
    return configs[status] || configs.pending;
  };

  const handleDownloadReceipt = async () => {
    try {
      setDownloadingReceipt(true);
      setReceiptError(null);

      // Option 1: Essayer de télécharger directement le PDF
      try {
        const blob = await receiptService.downloadReceipt(id);
        
        // Générer un nom de fichier intelligent
        const filename = `reçu-${reservation._id}-${reservation.clientInfo?.name || 'client'}-${receiptService.formatDateForFilename(reservation.checkIn)}.pdf`;
        
        // Télécharger le fichier
        receiptService.downloadFileFromBlob(blob, filename);
        
        return; // Sortir si succès
      } catch (pdfError) {
        console.log('⚠️ Échec téléchargement PDF, tentative alternative...');
      }

      // Option 2: Générer une URL (si l'API le supporte)
      try {
        const receiptUrl = await receiptService.generateReceiptUrl(id);
        window.open(receiptUrl, '_blank');
      } catch (urlError) {
        console.log('⚠️ Échec génération URL');
      }

      // Option 3: Fallback - Générer un reçu simple côté client
      generateFallbackReceipt();
      
    } catch (error) {
      console.error('❌ Erreur téléchargement reçu:', error);
      setReceiptError('Impossible de générer le reçu. Veuillez réessayer plus tard.');
      alert('Erreur lors du téléchargement du reçu: ' + error.message);
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const generateFallbackReceipt = () => {
    // Créer un reçu HTML simple
    const receiptContent = `
      <html>
        <head>
          <title>Reçu Réservation ${reservation._id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .hotel-name { font-size: 24px; font-weight: bold; color: #1e40af; }
            .receipt-title { font-size: 20px; margin: 10px 0; }
            .section { margin: 20px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .label { font-weight: bold; color: #4b5563; }
            .value { color: #1f2937; }
            .total { font-size: 18px; font-weight: bold; color: #059669; margin-top: 20px; }
            .footer { margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hotel-name">HOTEL NOGA</div>
            <div class="receipt-title">REÇU DE RÉSERVATION</div>
            <div>${formatDateTime(new Date())}</div>
          </div>
          
          <div class="section">
            <div><strong>Référence:</strong> ${reservation._id}</div>
            <div><strong>Client:</strong> ${reservation.clientInfo?.name} ${reservation.clientInfo?.surname}</div>
            <div><strong>Email:</strong> ${reservation.clientInfo?.email}</div>
          </div>
          
          <div class="info-grid">
            <div>
              <div class="label">Chambre</div>
              <div class="value">${reservation.chambre?.name || 'Chambre'}</div>
            </div>
            <div>
              <div class="label">Prix par nuit</div>
              <div class="value">${formatPrice(reservation.chambre?.price || reservation.totalAmount / reservation.nights)}</div>
            </div>
            <div>
              <div class="label">Arrivée</div>
              <div class="value">${formatDate(reservation.checkIn)}</div>
            </div>
            <div>
              <div class="label">Départ</div>
              <div class="value">${formatDate(reservation.checkOut)}</div>
            </div>
            <div>
              <div class="label">Nombre de nuits</div>
              <div class="value">${reservation.nights}</div>
            </div>
            <div>
              <div class="label">Nombre de personnes</div>
              <div class="value">${reservation.guests} (${reservation.adults} adultes, ${reservation.children} enfants)</div>
            </div>
          </div>
          
          ${reservation.codePromoUtilise ? `
            <div class="section">
              <div><strong>Code promo appliqué:</strong> ${reservation.codePromoUtilise}</div>
              ${reservation.reductionAppliquee > 0 ? `<div><strong>Réduction:</strong> -${formatPrice(reservation.reductionAppliquee)}</div>` : ''}
            </div>
          ` : ''}
          
          <div class="total">
            TOTAL: ${formatPrice(reservation.totalAmount)}
          </div>
          
          <div class="section">
            <div><strong>Statut:</strong> ${getStatusConfig(reservation.status).label}</div>
            <div><strong>Option de paiement:</strong> ${reservation.paymentOption === 'first-night' ? 'Première nuit' : 
                reservation.paymentOption === 'partial' ? 'Partiel' : 'Complet'}</div>
            ${reservation.paiement?.paidAt ? `<div><strong>Payé le:</strong> ${formatDateTime(reservation.paiement.paidAt)}</div>` : ''}
          </div>
          
          <div class="footer">
            Ce document fait office de reçu pour la réservation mentionnée ci-dessus.<br>
            Pour toute question, contactez-nous à contact@hotelnoga.com<br>
            Généré le ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </body>
      </html>
    `;

    // Ouvrir dans une nouvelle fenêtre et imprimer
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // ✅ Calculer les heures restantes avant check-in
  const getHoursUntilCheckIn = (checkInDate) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const hoursRemaining = (checkIn - now) / (1000 * 60 * 60);
    return Math.max(0, Math.round(hoursRemaining));
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation non trouvée</h2>
          <p className="text-gray-600 mb-6">{error || 'Cette réservation n\'existe pas ou vous n\'y avez pas accès'}</p>
          <button
            onClick={() => navigate('/my-reservations')}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux réservations
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(reservation.status);
  const StatusIcon = statusConfig.icon;
  const hoursUntilCheckIn = getHoursUntilCheckIn(reservation.checkIn);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête avec bouton retour */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/my-reservations')}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux réservations
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Détails de la réservation</h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Référence: <span className="font-mono font-medium">#{reservation._id}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${statusConfig.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </span>
            
            <button
              onClick={handleDownloadReceipt}
              disabled={downloadingReceipt}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadingReceipt ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le reçu
                </>
              )}
            </button>
          </div>
        </div>
        
        {receiptError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{receiptError}</span>
          </div>
        )}
      </div>

      {/* Grille principale */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Colonne gauche - Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte de la chambre */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Informations du séjour
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Date d'arrivée
                  </p>
                  <p className="font-medium text-gray-900 text-lg">{formatDate(reservation.checkIn)}</p>
                  <p className="text-sm text-gray-500">à partir de 14h00</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Date de départ
                  </p>
                  <p className="font-medium text-gray-900 text-lg">{formatDate(reservation.checkOut)}</p>
                  <p className="text-sm text-gray-500">avant 12h00</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <Moon className="w-4 h-4 mr-1" />
                    Durée du séjour
                  </p>
                  <p className="font-medium text-gray-900 text-lg">{reservation.nights} nuit(s)</p>
                  <p className="text-sm text-gray-500">
                    {reservation.checkIn && reservation.checkOut && (
                      `Du ${new Date(reservation.checkIn).toLocaleDateString('fr-FR')} au ${new Date(reservation.checkOut).toLocaleDateString('fr-FR')}`
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Occupants
                  </p>
                  <p className="font-medium text-gray-900 text-lg">{reservation.guests} personne(s)</p>
                  <p className="text-sm text-gray-500">
                    {reservation.adults} adulte(s), {reservation.children} enfant(s)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de la chambre */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Bed className="w-5 h-5 mr-2 text-blue-600" />
              Détails de la chambre
            </h2>
            
            {reservation.chambre ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{reservation.chambre.name}</h3>
                    <p className="text-gray-600">{reservation.chambre.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Prix par nuit</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {formatPrice(reservation.chambre.price)}
                    </p>
                  </div>
                </div>
                
                {reservation.chambre.amenities && reservation.chambre.amenities.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Équipements inclus:</p>
                    <div className="flex flex-wrap gap-2">
                      {reservation.chambre.amenities.map((amenity, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {reservation.specialRequests && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Demandes spéciales:</p>
                    <p className="text-gray-700 italic">"{reservation.specialRequests}"</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Informations de la chambre non disponibles</p>
            )}
          </div>

          {/* Informations de paiement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              Détails du paiement
            </h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Option de paiement</p>
                  <p className="font-medium text-gray-900">
                    {reservation.paymentOption === 'first-night' ? 'Première nuit' : 
                     reservation.paymentOption === 'partial' ? 'Paiement partiel' : 'Paiement complet'}
                  </p>
                  {reservation.paymentOption === 'partial' && reservation.nightsToPay && (
                    <p className="text-sm text-gray-500">
                      {reservation.nightsToPay} nuit(s) payée(s) sur {reservation.nights}
                    </p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Méthode de paiement</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {reservation.paymentMethod || 'Carte bancaire'}
                  </p>
                </div>
              </div>
              
              {reservation.paiement && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Montant payé</span>
                    <span className="font-semibold">{formatPrice(reservation.paiement.amount)}</span>
                  </div>
                  
                  {reservation.paiement.paidAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Date du paiement</span>
                      <span className="font-medium">{formatDateTime(reservation.paiement.paidAt)}</span>
                    </div>
                  )}
                  
                  {reservation.paiement.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm">{reservation.paiement.transactionId}</span>
                    </div>
                  )}
                  
                  {reservation.paiement.status && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Statut du paiement</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        reservation.paiement.status === 'paid' ? 'bg-green-100 text-green-800' :
                        reservation.paiement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.paiement.status === 'paid' ? 'Payé' :
                         reservation.paiement.status === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite - Informations secondaires */}
        <div className="space-y-6">
          {/* Résumé financier */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Résumé financier</h2>
            
            <div className="space-y-3">
              {reservation.prixOriginal && reservation.prixOriginal !== reservation.totalAmount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prix original</span>
                  <span className="text-gray-500 line-through">{formatPrice(reservation.prixOriginal)}</span>
                </div>
              )}
              
              {reservation.codePromoUtilise && reservation.reductionAppliquee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Réduction ({reservation.codePromoUtilise})
                  </span>
                  <span className="text-green-600 font-medium">
                    -{formatPrice(reservation.reductionAppliquee)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">Montant total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(reservation.totalAmount)}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mt-2">
                Taxes et frais de service inclus
              </div>
            </div>
            
            {hoursUntilCheckIn < 48 && reservation.status === 'confirmed' && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold">Annulation impossible</p>
                    <p>Il reste {hoursUntilCheckIn}h avant votre arrivée. L'annulation n'est plus possible (règle des 48h).</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informations client */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Informations client
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                <p className="font-medium text-gray-900">
                  {reservation.clientInfo?.name} {reservation.clientInfo?.surname}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </p>
                <p className="font-medium text-gray-900">{reservation.clientInfo?.email}</p>
              </div>
              
              {reservation.clientInfo?.phone && (
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Téléphone
                  </p>
                  <p className="font-medium text-gray-900">{reservation.clientInfo.phone}</p>
                </div>
              )}
              
              {user?.role === 'admin' && reservation.client && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">ID Client</p>
                  <p className="font-mono text-sm text-gray-600">{reservation.client._id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informations de contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Besoin d'aide ?
            </h2>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Pour toute question concernant votre réservation, contactez notre service client.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>+237 6XX XXX XXX</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span>contact@hotelnoga.com</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>24h/24, 7j/7</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/contact')}
                className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
              >
                Contacter le support
              </button>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations techniques</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Source</span>
                <span className="font-medium capitalize">{reservation.source || 'Site web'}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Créée le</span>
                <span className="font-medium">{reservation.createdAt ? formatDateTime(reservation.createdAt) : 'N/A'}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mise à jour</span>
                <span className="font-medium">{reservation.updatedAt ? formatDateTime(reservation.updatedAt) : 'N/A'}</span>
              </div>
              
              {reservation.codePromo && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Code promo</span>
                  <span className="font-medium">{reservation.codePromoUtilise || 'N/A'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions supplémentaires */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            <p>Conservez ce reçu pour référence future.</p>
            <p>Présentez-le à la réception lors de votre arrivée.</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/my-reservations')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Mes réservations
            </button>
            
            <button
              onClick={handleDownloadReceipt}
              disabled={downloadingReceipt}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {downloadingReceipt ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                  Générer reçu
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 inline mr-2" />
                  Télécharger à nouveau
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}