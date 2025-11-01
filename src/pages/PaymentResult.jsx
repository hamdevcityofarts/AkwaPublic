// pages/PaymentResult.jsx - VERSION MISE À JOUR AVEC COMPTE AUTOMATIQUE
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Home, Download, Calendar, AlertTriangle, Printer, User, Key, Mail } from 'lucide-react';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  // ✅ Récupération des paramètres URL
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get('status');
  const reservationId = searchParams.get('reservation');
  const transactionId = searchParams.get('transaction');
  const amount = searchParams.get('amount');
  const errorMessage = searchParams.get('message');
  const errorCode = searchParams.get('code');
  
  // ✅ NOUVEAUX PARAMÈTRES : Compte automatique
  const autoAccount = searchParams.get('autoAccount') === 'true';
  const clientEmail = searchParams.get('clientEmail');
  const clientPassword = searchParams.get('clientPassword');
  const clientId = searchParams.get('clientId');

  // 🐛 DEBUG - Afficher les paramètres dans la console
  useEffect(() => {
    console.log('🔍 Paramètres URL:', {
      status,
      reservationId,
      transactionId,
      amount,
      errorMessage,
      errorCode,
      autoAccount,
      clientEmail,
      clientPassword: clientPassword ? '***' : null,
      clientId
    });

    // Afficher automatiquement les identifiants si compte créé
    if (autoAccount && clientEmail && clientPassword) {
      setShowCredentials(true);
    }
  }, []);

  // Formater le montant en XAF
  const formatAmountCFA = (amt) => {
    if (!amt) return '0 FCFA';
    return `${parseInt(amt).toLocaleString('fr-FR')} FCFA`;
  };

  // ✅ NOUVELLE FONCTION : Copier les identifiants
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  };

  // ✅ FONCTION : Télécharger le reçu (inchangée)
  const handleDownloadPDF = () => {
    // ... (le code existant reste inchangé)
    const receiptHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Reçu de Paiement - Grand Hotel</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: #f5f5f5; }
        .receipt { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1e40af; margin: 0; font-size: 32px; }
        .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .info-section { margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .info-label { color: #6b7280; font-weight: 500; }
        .info-value { color: #111827; font-weight: 600; }
        .total-section { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 30px 0; border: 2px solid #10b981; }
        .total-row { display: flex; justify-content: space-between; font-size: 24px; font-weight: bold; color: #047857; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        .important-info { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .transaction-id { font-family: 'Courier New', monospace; background: #f3f4f6; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
        .credentials-box { background: #dbeafe; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; margin: 20px 0; }
        .credential-item { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #93c5fd; }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>🏨 Grand Hotel</h1>
            <p>Aéroport International de Yaoundé-Nsimalen</p>
            <p>Cameroun</p>
            <div class="success-badge">✓ PAIEMENT CONFIRMÉ</div>
        </div>

        <div class="info-section">
            <h2 style="color: #1e40af; margin-bottom: 20px;">Reçu de Paiement</h2>
            
            <div class="info-row">
                <span class="info-label">Date d'émission:</span>
                <span class="info-value">${new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
            </div>

            <div class="info-row">
                <span class="info-label">Numéro de réservation:</span>
                <span class="info-value transaction-id">${reservationId || 'N/A'}</span>
            </div>

            <div class="info-row">
                <span class="info-label">Transaction ID:</span>
                <span class="info-value transaction-id">${transactionId || 'N/A'}</span>
            </div>

            ${autoAccount && clientEmail ? `
            <div class="credentials-box">
                <h3 style="color: #1e40af; margin-bottom: 15px;">🎉 Votre compte client a été créé !</h3>
                <div class="credential-item">
                    <strong>Email:</strong> ${clientEmail}
                </div>
                <div class="credential-item">
                    <strong>Mot de passe:</strong> ${clientPassword}
                </div>
                <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                    Conservez précieusement ces identifiants pour accéder à votre compte.
                </p>
            </div>
            ` : ''}
        </div>

        <div class="info-section">
            <h3 style="color: #1e40af; margin-bottom: 15px;">Informations de Paiement</h3>
            
            <div class="info-row">
                <span class="info-label">Statut:</span>
                <span class="info-value" style="color: #10b981; font-weight: bold;">PAYÉ</span>
            </div>

            <div class="info-row">
                <span class="info-label">Méthode de paiement:</span>
                <span class="info-value">Carte bancaire</span>
            </div>

            <div class="info-row">
                <span class="info-label">Processeur:</span>
                <span class="info-value">CyberSource (Société Générale)</span>
            </div>
        </div>

        <div class="total-section">
            <div class="total-row">
                <span>MONTANT TOTAL PAYÉ:</span>
                <span>${formatAmountCFA(amount)}</span>
            </div>
        </div>

        <div class="important-info">
            <h3>⚠️ Informations Importantes</h3>
            <ul>
                <li><strong>Check-in:</strong> À partir de 15h00</li>
                <li><strong>Check-out:</strong> Avant 11h00</li>
                <li><strong>Document requis:</strong> Pièce d'identité valide</li>
                <li><strong>Confirmation:</strong> Présentez ce reçu ou le numéro de réservation à la réception</li>
                <li><strong>Reçu complet:</strong> Un reçu détaillé sera envoyé par email</li>
                ${autoAccount ? '<li><strong>Compte client:</strong> Vos identifiants sont inclus dans ce reçu</li>' : ''}
            </ul>
        </div>

        <div class="footer">
            <p><strong>Grand Hotel - Aéroport Nsimalen</strong></p>
            <p>Tél: +237 656 708 074 | Email: contact@grandhotel.com</p>
            <p style="margin-top: 10px; font-size: 10px;">
                Ce document est une confirmation de paiement électronique.<br>
                Conservez-le précieusement pour votre séjour.
            </p>
            <p style="margin-top: 10px; color: #10b981; font-weight: bold;">
                ✓ Paiement sécurisé par CyberSource (Société Générale)
            </p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ========== SUCCÈS ==========
  if (status && status === 'success') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* En-tête de succès */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Paiement Confirmé !
            </h1>
            <p className="text-lg text-gray-600">
              Votre réservation a été confirmée avec succès
            </p>
            {autoAccount && (
              <div className="mt-4 inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">Compte client créé automatiquement</span>
              </div>
            )}
          </div>

          {/* ✅ NOUVEAU : SECTION IDENTIFIANTS COMPTE */}
          {autoAccount && clientEmail && clientPassword && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Key className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">
                  🎉 Votre compte client a été créé !
                </h3>
              </div>
              
              <p className="text-blue-800 mb-4">
                Vous pouvez maintenant vous connecter à votre espace client avec ces identifiants :
              </p>

              <div className="space-y-3 mb-4">
                {/* Email */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-mono font-semibold text-gray-900">{clientEmail}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(clientEmail)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Copier
                    </button>
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Key className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Mot de passe</div>
                        <div className="font-mono font-semibold text-gray-900">
                          {showCredentials ? clientPassword : '••••••••'}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowCredentials(!showCredentials)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {showCredentials ? 'Masquer' : 'Afficher'}
                      </button>
                      <button
                        onClick={() => copyToClipboard(clientPassword)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Copier
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Important :</strong> Conservez précieusement ces identifiants. 
                  Vous en aurez besoin pour accéder à votre compte et gérer vos réservations.
                </p>
              </div>
            </div>
          )}

          {/* Détails du paiement */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Détails de votre paiement
            </h3>
            <div className="space-y-3">
              {reservationId && (
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-gray-600">Numéro de réservation:</span>
                  <span className="font-mono font-semibold text-blue-600">{reservationId}</span>
                </div>
              )}
              {transactionId && (
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs text-gray-500">{transactionId}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-3 bg-green-50 -mx-6 px-6 py-3 rounded">
                <span className="text-gray-900">Montant payé:</span>
                <span className="text-green-600">
                  {formatAmountCFA(amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation email */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>📧 Reçu détaillé envoyé par email</strong>
              <br />
              Un email avec tous les détails de votre réservation et le reçu complet vous sera envoyé sous peu.
            </p>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Printer className="w-5 h-5" />
              <span>Imprimer la confirmation</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>

          {/* Informations importantes */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
              Informations importantes
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Check-in:</strong> À partir de 15h00</li>
              <li>• <strong>Check-out:</strong> Avant 11h00</li>
              <li>• Une pièce d'identité valide sera demandée à l'arrivée</li>
              <li>• Présentez cette confirmation ou le numéro de réservation à la réception</li>
              <li>• Le reçu détaillé sera envoyé par email automatiquement</li>
              {autoAccount && (
                <li>• <strong>Vos identifiants de connexion</strong> sont disponibles ci-dessus</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ========== ERREUR ==========
  if (status && status === 'error') {
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
              {errorMessage ? decodeURIComponent(errorMessage) : 'Une erreur est survenue lors du paiement'}
            </p>
            {errorCode && (
              <p className="text-sm text-gray-500 mt-2">
                Code erreur : <code className="bg-gray-100 px-2 py-1 rounded">{errorCode}</code>
              </p>
            )}
          </div>

          {/* Informations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-900">
              <strong>Que faire maintenant ?</strong>
              <br />
              • Vérifiez que votre carte est valide et dispose de fonds suffisants
              <br />
              • Assurez-vous que les informations saisies sont correctes
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
              className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>

          {/* Support */}
          <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
            <p className="font-semibold mb-2">Besoin d'aide ?</p>
            <p>
              <a href="tel:+237656708074" className="text-blue-600 hover:underline">
                +237 656 708 074
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== AUCUN STATUT ==========
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Paramètres Manquants
        </h2>
        <p className="text-gray-600 mb-6">
          Aucune information de paiement détectée
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Retour à l'accueil</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;