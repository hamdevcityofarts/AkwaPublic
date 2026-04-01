// ══════════════════════════════════════════════════
// pages/PaymentResult.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Home, Download, Calendar, AlertTriangle, Printer } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const BtnGold = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)", padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%", boxShadow: "0 2px 14px rgba(212,160,51,0.24)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
    {children}
  </button>
);
const BtnOutline = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "#374151", background: "#f9fafb", border: "1px solid #e5e7eb", padding: "13px 0", borderRadius: "32px", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
    {children}
  </button>
);
const BtnGreen = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "linear-gradient(135deg,#16a34a,#15803d)", padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
    {children}
  </button>
);

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status       = searchParams.get('status');
  const reservationId = searchParams.get('reservation');
  const transactionId = searchParams.get('transaction');
  const amount        = searchParams.get('amount');
  const errorMessage  = searchParams.get('message');
  const errorCode     = searchParams.get('code');

  useEffect(() => {
    console.log('🔍 Paramètres URL:', { status, reservationId, transactionId, amount, errorMessage, errorCode });
  }, []);

  const formatAmountCFA = (amt) => {
    if (!amt) return '0 FCFA';
    return `${parseInt(amt).toLocaleString('fr-FR')} FCFA`;
  };

  const handleDownloadPDF = () => {
    const receiptHTML = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Reçu de Paiement - Grand Hotel</title>
<style>body{font-family:'Segoe UI',sans-serif;max-width:800px;margin:0 auto;padding:40px;background:#f5f5f5}.receipt{background:white;padding:40px;border-radius:10px;box-shadow:0 0 20px rgba(0,0,0,0.1)}.header{text-align:center;border-bottom:3px solid #2563eb;padding-bottom:20px;margin-bottom:30px}.header h1{color:#1e40af;margin:0;font-size:32px}.success-badge{background:#10b981;color:white;padding:10px 20px;border-radius:20px;display:inline-block;margin:20px 0;font-weight:bold}.info-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e5e7eb}.total-section{background:#f0fdf4;padding:20px;border-radius:8px;margin:30px 0;border:2px solid #10b981}.total-row{display:flex;justify-content:space-between;font-size:24px;font-weight:bold;color:#047857}.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:2px solid #e5e7eb;color:#6b7280;font-size:12px}</style></head>
<body><div class="receipt"><div class="header"><img src="/assets/ghLogo.png" alt="Grand Hotel" style="height:80px;margin-bottom:20px;"><p>Hotel Grand Lux</p><p>Douala Cameroun</p><div class="success-badge">✓ PAIEMENT CONFIRMÉ</div></div>
<div class="info-row"><span>Date :</span><span>${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
<div class="info-row"><span>N° réservation :</span><span style="font-family:monospace">${reservationId || 'N/A'}</span></div>
<div class="info-row"><span>Transaction ID :</span><span style="font-family:monospace">${transactionId || 'N/A'}</span></div>
<div class="info-row"><span>Statut :</span><span style="color:#10b981;font-weight:bold">PAYÉ</span></div>
<div class="info-row"><span>Méthode :</span><span>Carte bancaire</span></div>
<div class="total-section"><div class="total-row"><span>MONTANT TOTAL PAYÉ :</span><span>${formatAmountCFA(amount)}</span></div></div>
<div class="footer"><p><strong>Grand Hotel — Aéroport</strong></p><p>Tél : (+237) 699 901 204 | Email : aeroport@mygrandhotel.com</p><p style="margin-top:10px;color:#10b981;font-weight:bold">✓ Paiement sécurisé par CyberSource (Société Générale)</p></div></div></body></html>`;
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) { printWindow.onload = () => { setTimeout(() => { printWindow.print(); }, 500); }; }
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ── Succès ──
  if (status && status === 'success') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center mb-5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <img src="/assets/ghLogo.png" alt="Grand Hotel" className="h-14 mx-auto mb-4" />
            <h1 style={{ ...serif, fontWeight: 300, fontSize: "38px", letterSpacing: "0.03em" }} className="text-gray-900 mb-2">
              Paiement Confirmé !
            </h1>
            <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }}>
              Votre réservation a été confirmée avec succès
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
            <h3 style={{ ...serif, fontWeight: 500, fontSize: "18px" }} className="text-gray-900 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Détails de votre paiement
            </h3>
            <div style={{ width: 16, height: 1, background: "rgba(212,160,51,0.4)", marginBottom: 14 }} />
            <div className="space-y-2.5">
              {reservationId && (
                <div className="flex justify-between">
                  <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>Numéro de réservation</span>
                  <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 600, color: "#2563eb" }}>{reservationId}</span>
                </div>
              )}
              {transactionId && (
                <div className="flex justify-between">
                  <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>Transaction ID</span>
                  <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#6b7280" }}>{transactionId}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline border-t border-gray-100 pt-3">
                <span style={{ ...sans, fontSize: "11px", fontWeight: 600, color: "#374151" }}>Montant payé</span>
                <span style={{ ...serif, fontWeight: 400, fontSize: "22px", color: "#16a34a" }}>{formatAmountCFA(amount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
            <p style={{ ...sans, fontSize: "11px", color: "#1e40af" }}>
              <strong>📧 Reçu détaillé envoyé par email</strong><br />
              <span style={{ fontWeight: 300 }}>Un email avec tous les détails vous sera envoyé sous peu.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <BtnGreen onClick={handleDownloadPDF}><Printer className="w-4 h-4" /> Imprimer la confirmation</BtnGreen>
            <BtnOutline onClick={() => navigate('/')}><Home className="w-4 h-4" /> Retour à l'accueil</BtnOutline>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" /> Informations importantes
            </h4>
            <ul className="space-y-1">
              {["Check-in : À partir de 15h00", "Check-out : Avant 11h00", "Pièce d'identité valide demandée à l'arrivée", "Présentez cette confirmation à la réception", "Le reçu détaillé sera envoyé par email"].map(item => (
                <li key={item} style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#6b7280" }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Erreur ──
  if (status && status === 'error') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center mb-5">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-9 h-9 text-red-500" />
            </div>
            <img src="/assets/ghLogo.png" alt="Grand Hotel" className="h-14 mx-auto mb-4" />
            <h1 style={{ ...serif, fontWeight: 300, fontSize: "30px", letterSpacing: "0.03em" }} className="text-gray-900 mb-2">
              Paiement Échoué
            </h1>
            <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }}>
              {errorMessage ? decodeURIComponent(errorMessage) : 'Une erreur est survenue lors du paiement'}
            </p>
            {errorCode && (
              <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 6 }}>
                Code erreur : <code className="bg-gray-100 px-2 py-0.5 rounded">{errorCode}</code>
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
            <p style={{ ...sans, fontSize: "11px", color: "#92400e" }}>
              <strong>Que faire maintenant ?</strong><br />
              <span style={{ fontWeight: 300 }}>• Vérifiez que votre carte est valide<br />• Assurez-vous que les informations sont correctes<br />• Contactez votre banque si le problème persiste</span>
            </p>
          </div>

          <div className="space-y-3">
            <BtnGold onClick={() => navigate('/booking')}>Faire une nouvelle réservation</BtnGold>
            <BtnOutline onClick={() => navigate('/')}><Home className="w-4 h-4" /> Retour à l'accueil</BtnOutline>
          </div>

          <div style={{ ...sans, fontSize: "11px", textAlign: "center", color: "#9ca3af", marginTop: 20, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
            <p style={{ fontWeight: 500, color: "#374151", marginBottom: 4 }}>Besoin d'aide ?</p>
            <a href="tel:+237656708074" style={{ color: "#2563eb" }}>+237 656 708 074</a>
          </div>
        </div>
      </div>
    );
  }

  // ── Aucun statut ──
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-5" />
        <img src="/assets/ghLogo.png" alt="Grand Hotel" className="h-14 mx-auto mb-4" />
        <h2 style={{ ...serif, fontWeight: 300, fontSize: "26px" }} className="text-gray-900 mb-2">
          Paramètres Manquants
        </h2>
        <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }} className="mb-6">
          Aucune information de paiement détectée
        </p>
        <BtnOutline onClick={() => navigate('/')}><Home className="w-4 h-4" /> Retour à l'accueil</BtnOutline>
      </div>
    </div>
  );
};

export default PaymentResult;