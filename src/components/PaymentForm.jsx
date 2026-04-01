// ══════════════════════════════════════════════════
// src/components/PaymentForm.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, Shield, CheckCircle } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const fieldBase = `w-full px-4 py-3 border rounded-xl
  focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
  outline-none transition-all duration-200 bg-gray-50/50`;

const labelStyle = { ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" };

const PaymentForm = ({ reservation, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cardData, setCardData] = useState({ number: '', holderName: '', expiry: '', cvv: '' });

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

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    let sum = 0; let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      if (isEven) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit; isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g);
    return formatted ? formatted.join(' ') : cleaned;
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    return cleaned;
  };

  const detectCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return { type: 'visa', icon: '💳', name: 'Visa' };
    if (/^5[1-5]/.test(cleaned)) return { type: 'mastercard', icon: '💳', name: 'Mastercard' };
    if (/^3[47]/.test(cleaned)) return { type: 'amex', icon: '💳', name: 'American Express' };
    if (/^6(?:011|5)/.test(cleaned)) return { type: 'discover', icon: '💳', name: 'Discover' };
    return { type: 'unknown', icon: '💳', name: 'Carte' };
  };

  const handleChange = (field, value) => {
    let formattedValue = value;
    if (field === 'number') { formattedValue = formatCardNumber(value); if (formattedValue.replace(/\s/g, '').length > 19) return; }
    else if (field === 'expiry') { formattedValue = formatExpiry(value); if (formattedValue.length > 5) return; }
    else if (field === 'cvv') { formattedValue = value.replace(/\D/g, ''); if (formattedValue.length > 4) return; }
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!cardData.number) { newErrors.number = 'Numéro de carte requis'; }
    else if (!validateCardNumber(cardData.number)) { newErrors.number = 'Numéro de carte invalide'; }
    if (!cardData.holderName || cardData.holderName.trim().length < 3) { newErrors.holderName = 'Nom du titulaire requis (min. 3 caractères)'; }
    if (!cardData.expiry) { newErrors.expiry = 'Date d\'expiration requise'; }
    else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) { newErrors.expiry = 'Format invalide (MM/YY)'; }
    else {
      const [month, year] = cardData.expiry.split('/').map(Number);
      const now = new Date(); const currentYear = now.getFullYear() % 100; const currentMonth = now.getMonth() + 1;
      if (month < 1 || month > 12) { newErrors.expiry = 'Mois invalide'; }
      else if (year < currentYear || (year === currentYear && month < currentMonth)) { newErrors.expiry = 'Carte expirée'; }
    }
    if (!cardData.cvv) { newErrors.cvv = 'CVV requis'; }
    else if (cardData.cvv.length < 3 || cardData.cvv.length > 4) { newErrors.cvv = 'CVV invalide (3-4 chiffres)'; }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token;
      const amountInCFA = convertToCFA(reservation.totalAmount);
      const paymentData = {
        reservationId: reservation._id, paymentMethod: 'card',
        cardData: { number: cardData.number.replace(/\s/g, ''), expiry: cardData.expiry, cvv: cardData.cvv, holderName: cardData.holderName },
        amount: reservation.totalAmount, amountInCFA, currency: 'XAF'
      };
      let endpoint = import.meta.env.VITE_API_BASE_URL + '/payments/process';
      let headers = { 'Content-Type': 'application/json' };
      if (isAuthenticated) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        endpoint = import.meta.env.VITE_API_BASE_URL + '/payments/process/public';
        paymentData.clientInfo = {
          name: reservation.clientInfo?.name || 'Client', surname: reservation.clientInfo?.surname || 'Public',
          email: reservation.clientInfo?.email || reservation.clientEmail, phone: reservation.clientInfo?.phone || ''
        };
      }
      const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(paymentData) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Erreur lors du traitement du paiement');
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error('❌ Erreur paiement:', error);
      if (onError) onError(error.message);
    } finally { setLoading(false); }
  };

  const cardType = detectCardType(cardData.number);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h2 style={{ ...serif, fontWeight: 300, fontSize: "28px", letterSpacing: "0.03em" }}
              className="text-gray-900">
            Paiement Sécurisé
          </h2>
          <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginTop: 5 }} />
        </div>
        <div className="flex items-center gap-1.5 text-green-600">
          <Shield className="w-4 h-4" />
          <span style={{ ...sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Sécurisé
          </span>
        </div>
      </div>

      {/* Résumé réservation */}
      <div className="bg-gradient-to-br from-gray-50 to-amber-50/20 rounded-xl p-4 mb-5 border border-gray-100">
        <h3 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-3">
          Résumé de la réservation
        </h3>
        <div className="space-y-1.5">
          {[
            { label: "Chambre", value: reservation.chambre?.name || 'Chambre' },
            { label: "Durée", value: `${reservation.nights} nuit(s)` },
            { label: "Période", value: `${new Date(reservation.checkIn).toLocaleDateString('fr-FR')} — ${new Date(reservation.checkOut).toLocaleDateString('fr-FR')}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>{label}</span>
              <span style={{ ...sans, fontSize: "11px", fontWeight: 400, color: "#374151" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Montant */}
      <div className="bg-blue-50/60 rounded-xl p-4 mb-6 border border-blue-100/60">
        <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9ca3af" }} className="mb-1">
          Montant à payer
        </p>
        <p style={{ ...serif, fontWeight: 300, fontSize: "32px", color: "#2563eb", lineHeight: 1 }}>
          {formatAmountCFA(reservation.totalAmount)}
        </p>
        <div style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 6 }} className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          Soit {reservation.totalAmount} € (taux: 1€ = 655.957 FCFA)
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Numéro de carte */}
        <div>
          <label style={labelStyle} className="block text-gray-500 mb-2">Numéro de carte</label>
          <div className="relative">
            <input type="text" value={cardData.number}
                   onChange={(e) => handleChange('number', e.target.value)}
                   placeholder="1234 5678 9012 3456"
                   style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                   className={`${fieldBase} ${errors.number ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
                   maxLength="19" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-xl">{cardType.icon}</span>
              {cardData.number.length > 0 && (
                <span style={{ ...sans, fontSize: "9px", color: "#9ca3af", letterSpacing: "0.10em" }}
                      className="bg-white px-2 py-0.5 rounded border border-gray-100">
                  {cardType.name}
                </span>
              )}
            </div>
          </div>
          {errors.number && (
            <div style={{ ...sans, fontSize: "10px" }} className="flex items-center mt-1 text-red-500 gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.number}
            </div>
          )}
        </div>

        {/* Titulaire */}
        <div>
          <label style={labelStyle} className="block text-gray-500 mb-2">Nom du titulaire</label>
          <input type="text" value={cardData.holderName}
                 onChange={(e) => handleChange('holderName', e.target.value.toUpperCase())}
                 placeholder="NOM PRÉNOM"
                 style={{ ...sans, fontSize: "13px", fontWeight: 300, letterSpacing: "0.08em" }}
                 className={`${fieldBase} ${errors.holderName ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`} />
          {errors.holderName && (
            <div style={{ ...sans, fontSize: "10px" }} className="flex items-center mt-1 text-red-500 gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.holderName}
            </div>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle} className="block text-gray-500 mb-2">Expiration</label>
            <input type="text" value={cardData.expiry}
                   onChange={(e) => handleChange('expiry', e.target.value)}
                   placeholder="MM/AA"
                   style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                   className={`${fieldBase} ${errors.expiry ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
                   maxLength="5" />
            {errors.expiry && (
              <div style={{ ...sans, fontSize: "10px" }} className="flex items-center mt-1 text-red-500 gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.expiry}
              </div>
            )}
          </div>
          <div>
            <label style={labelStyle} className="block text-gray-500 mb-2">Code de sécurité</label>
            <div className="relative">
              <input type="password" value={cardData.cvv}
                     onChange={(e) => handleChange('cvv', e.target.value)}
                     placeholder="123"
                     style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                     className={`${fieldBase} ${errors.cvv ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
                     maxLength="4" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
            {errors.cvv && (
              <div style={{ ...sans, fontSize: "10px" }} className="flex items-center mt-1 text-red-500 gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.cvv}
              </div>
            )}
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-green-50/60 border border-green-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p style={{ ...sans, fontSize: "11px", fontWeight: 600, color: "#15803d" }} className="mb-1">
                Paiement 100% sécurisé
              </p>
              <p style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#16a34a" }}>
                Vos données bancaires sont chiffrées et protégées. Aucune information n'est stockée sur nos serveurs. Certification PCI DSS Level 1.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton paiement */}
        <button type="submit" disabled={loading}
                style={{
                  ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#fff", background: loading ? "#9ca3af" : "linear-gradient(135deg,#16a34a,#15803d)",
                  padding: "14px 0", borderRadius: "32px", border: "none", cursor: loading ? "not-allowed" : "pointer", width: "100%",
                  boxShadow: loading ? "none" : "0 3px 18px rgba(22,163,74,0.25)", transition: "all 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}>
          {loading ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Traitement...</>
          ) : (
            <><CreditCard className="w-4 h-4" /> Payer {formatAmountCFA(reservation.totalAmount)}</>
          )}
        </button>

        {/* Légal */}
        <p style={{ ...sans, fontSize: "10px", fontWeight: 300, textAlign: "center", color: "#9ca3af" }}>
          En procédant, vous acceptez nos{' '}
          <a href="/conditions" style={{ color: "#2563eb" }}>conditions générales de vente</a>
          <br />Paiement traité par Cybersource — Société Générale
        </p>
      </form>

      {/* Cartes acceptées */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9ca3af", textAlign: "center", marginBottom: 10 }}>
          Cartes bancaires acceptées
        </p>
        <div className="flex justify-center gap-6 text-2xl">
          <span title="Visa">💳</span>
          <span title="Mastercard">💳</span>
          <span title="American Express">💳</span>
        </div>
        <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", textAlign: "center", marginTop: 6 }}>
          Visa · Mastercard · American Express
        </p>
      </div>

      {/* Support */}
      <div className="mt-4 text-center">
        <p style={{ ...sans, fontSize: "10px", color: "#9ca3af" }}>
          Besoin d'aide ?{' '}
          <a href="tel:+237XXXXXXXX" style={{ color: "#2563eb" }}>+237 XX XX XX XX</a>
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;