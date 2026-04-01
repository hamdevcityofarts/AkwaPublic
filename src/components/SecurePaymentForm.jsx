// ══════════════════════════════════════════════════
// src/components/SecurePaymentForm.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from 'react';
import { Shield, Loader, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const SecurePaymentForm = ({ reservation, onSuccess, onError }) => {
  const [loading, setLoading]           = useState(false);
  const [paymentParams, setPaymentParams] = useState(null);
  const [paymentUrl, setPaymentUrl]     = useState(null);
  const [mockMode, setMockMode]         = useState(false);
  const [error, setError]               = useState(null);
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

  const initiatePayment = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token;
      const paymentData = { reservationId: reservation._id };
      if (!isAuthenticated && reservation.clientInfo) paymentData.clientInfo = reservation.clientInfo;
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(isAuthenticated && { 'Authorization': `Bearer ${token}` }) },
        body: JSON.stringify(paymentData)
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Erreur lors de l\'initiation du paiement');
      console.log('✅ Paramètres de paiement reçus:', result);
      if (result.mockMode) {
        console.log('⚠️ Mode simulation activé');
        setMockMode(true); setPaymentParams(result.params); setLoading(false); return;
      }
      setPaymentUrl(result.paymentUrl); setPaymentParams(result.params);
      setTimeout(() => {
        if (formRef.current) { console.log('🔄 Redirection vers CyberSource...'); formRef.current.submit(); }
      }, 1000);
    } catch (err) {
      console.error('❌ Erreur initiation paiement:', err);
      setError(err.message); setLoading(false);
      if (onError) onError(err.message);
    }
  };

  const handleMockPayment = () => {
    console.log('🔧 Simulation de paiement...');
    setTimeout(() => { window.location.href = paymentParams.redirectUrl; }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">

      {/* En-tête */}
      <div className="text-center mb-7">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-green-600" />
        </div>
        <h2 style={{ ...serif, fontWeight: 300, fontSize: "28px", letterSpacing: "0.03em" }}
            className="text-gray-900 mb-2">
          Paiement Sécurisé
        </h2>
        <p style={{ ...sans, fontSize: "12px", fontWeight: 300, letterSpacing: "0.03em", color: "#9ca3af" }}>
          Vous allez être redirigé vers la page de paiement sécurisée de CyberSource
        </p>
      </div>

      {/* Résumé */}
      <div className="bg-gradient-to-br from-gray-50 to-amber-50/20 rounded-xl p-4 mb-5 border border-gray-100">
        <h3 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-3">
          Résumé
        </h3>
        <div style={{ width: 16, height: 1, background: "rgba(212,160,51,0.4)", marginBottom: 12 }} />
        <div className="space-y-2">
          {[
            { label: "Réservation", value: reservation._id.slice(-8), mono: true },
            { label: "Chambre", value: reservation.chambre?.name },
            { label: "Durée", value: `${reservation.nights} nuit(s)` },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex justify-between">
              <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>{label}</span>
              <span style={mono
                ? { fontFamily: "monospace", fontSize: "10px", color: "#6b7280" }
                : { ...sans, fontSize: "11px", fontWeight: 400, color: "#374151" }}>
                {value}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-gray-100 pt-2 mt-1">
            <span style={{ ...sans, fontSize: "11px", fontWeight: 500, color: "#374151" }}>Montant total</span>
            <span style={{ ...serif, fontWeight: 400, fontSize: "18px", color: "#16a34a" }}>
              {formatAmountCFA(reservation.totalAmount)}
            </span>
          </div>
          <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", textAlign: "right" }}>
            Soit {reservation.totalAmount} €
          </p>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div style={sans} className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div style={{ fontSize: "12px", fontWeight: 300, color: "#b91c1c" }}>{error}</div>
          </div>
        </div>
      )}

      {/* Mode simulation */}
      {mockMode && (
        <div style={sans} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#92400e", marginBottom: 2 }}>Mode Simulation</p>
              <p style={{ fontSize: "11px", fontWeight: 300, color: "#92400e" }}>
                Les clés CyberSource ne sont pas configurées. Le paiement sera simulé.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sécurité */}
      <div className="bg-green-50/60 border border-green-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p style={{ ...sans, fontSize: "11px", fontWeight: 600, color: "#15803d", marginBottom: 5 }}>
              Paiement 100% sécurisé
            </p>
            <ul className="space-y-1">
              {[
                "Aucune donnée bancaire collectée sur notre site",
                "Transaction chiffrée SSL/TLS",
                "Certifié PCI-DSS Level 1",
                "Processeur: Société Générale (CyberSource)",
              ].map((item) => (
                <li key={item} style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#16a34a" }}>
                  ✓ {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bouton principal */}
      {!loading && !paymentParams && (
        <button onClick={initiatePayment}
                style={{
                  ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#fff", background: "linear-gradient(135deg,#16a34a,#15803d)",
                  padding: "14px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%",
                  boxShadow: "0 3px 18px rgba(22,163,74,0.25)", transition: "all 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}>
          <Shield className="w-4 h-4" /> Procéder au paiement sécurisé
        </button>
      )}

      {loading && !mockMode && (
        <div className="text-center py-8">
          <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p style={{ ...serif, fontWeight: 400, fontSize: "18px" }} className="text-gray-700">
            Préparation du paiement…
          </p>
          <p style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af", marginTop: 6 }}>
            Vous allez être redirigé dans un instant
          </p>
        </div>
      )}

      {mockMode && (
        <button onClick={handleMockPayment}
                style={{
                  ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#fff", background: "linear-gradient(135deg,#d97706,#b45309)",
                  padding: "14px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}>
          <ExternalLink className="w-4 h-4" /> Simuler le paiement
        </button>
      )}

      {/* Formulaire caché redirection */}
      {paymentUrl && paymentParams && !mockMode && (
        <form ref={formRef} method="POST" action={paymentUrl} className="hidden">
          {Object.entries(paymentParams).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}

      {/* Légal + support */}
      <div className="mt-5 text-center">
        <p style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#9ca3af" }}>
          En procédant, vous acceptez nos{' '}
          <a href="/conditions" style={{ color: "#2563eb" }}>conditions générales de vente</a>
        </p>
      </div>
      <div className="mt-3 text-center border-t border-gray-100 pt-4">
        <p style={{ ...sans, fontSize: "10px", color: "#9ca3af" }}>
          Besoin d'aide ? Contactez-nous au{' '}
          <a href="tel:+237XXXXXXXX" style={{ color: "#2563eb" }}>+237 XX XX XX XX</a>
        </p>
      </div>
    </div>
  );
};

export default SecurePaymentForm;