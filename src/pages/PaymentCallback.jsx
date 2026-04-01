// ══════════════════════════════════════════════════
// pages/PaymentCallback.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Home, Download, Calendar } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

// ── Bouton pill réutilisable ──
const BtnPrimary = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)", padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%", boxShadow: "0 2px 14px rgba(212,160,51,0.24)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
    {children}
  </button>
);
const BtnOutline = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "#374151", background: "#f9fafb", padding: "13px 0", borderRadius: "32px", border: "1px solid #e5e7eb", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
    {children}
  </button>
);
const BtnBlue = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "#2563eb", padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
    {children}
  </button>
);

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const [reservationId, setReservationId] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [reservation, setReservation] = useState(null);

  useEffect(() => { handleCallback(); }, []);

  const handleCallback = async () => {
    try {
      const resId = searchParams.get('reservation');
      const transId = searchParams.get('transaction');
      const errorMsg = searchParams.get('message');
      console.log('📥 Paramètres URL:', { resId, transId, errorMsg });
      if (errorMsg) { setStatus('error'); setMessage(decodeURIComponent(errorMsg)); return; }
      if (!resId) { setStatus('error'); setMessage('Numéro de réservation manquant'); return; }
      setReservationId(resId); setTransactionId(transId);
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + `/reservations/${resId}`, { headers });
      if (!response.ok) throw new Error('Impossible de récupérer la réservation');
      const data = await response.json();
      if (data.success && data.reservation) {
        setReservation(data.reservation);
        if (data.reservation.status === 'confirmed' && data.reservation.paiement?.status === 'paid') {
          setStatus('success'); setMessage('Paiement effectué avec succès !');
        } else { setStatus('error'); setMessage('Le paiement n\'a pas été confirmé'); }
      } else throw new Error('Réservation non trouvée');
    } catch (error) {
      console.error('❌ Erreur traitement callback:', error);
      setStatus('error'); setMessage(error.message || 'Une erreur est survenue');
    }
  };

  const formatAmountCFA = (amount) => {
    if (!amount) return '0 FCFA';
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  };

  const handleDownloadReceipt = () => {
    if (!reservation) return;
    const receiptData = {
      reservationId: reservation._id,
      clientName: reservation.clientInfo ? `${reservation.clientInfo.surname} ${reservation.clientInfo.name}` : 'Client',
      room: reservation.chambre?.name,
      checkIn: new Date(reservation.checkIn).toLocaleDateString('fr-FR'),
      checkOut: new Date(reservation.checkOut).toLocaleDateString('fr-FR'),
      nights: reservation.nights, amount: formatAmountCFA(reservation.totalAmount),
      transactionId, date: new Date().toLocaleDateString('fr-FR')
    };
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `recu-${reservation._id}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // ── Processing ──
  if (status === 'processing') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-5" />
          <h2 style={{ ...serif, fontWeight: 300, fontSize: "28px" }} className="text-gray-900 mb-2">
            Traitement en cours…
          </h2>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }}>
            Veuillez patienter pendant que nous vérifions votre paiement
          </p>
          <div style={{ ...sans, fontSize: "11px", color: "#9ca3af", marginTop: 16 }}>
            <p>⏱️ Cela peut prendre quelques secondes</p>
            <p className="mt-1">🔒 Connexion sécurisée</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Succès ──
  if (status === 'success' && reservation) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center mb-5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h1 style={{ ...serif, fontWeight: 300, fontSize: "38px", letterSpacing: "0.03em" }} className="text-gray-900 mb-2">
              Paiement Confirmé !
            </h1>
            <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }}>{message}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
            <h3 style={{ ...serif, fontWeight: 500, fontSize: "18px" }} className="text-gray-900 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Détails de votre réservation
            </h3>
            <div style={{ width: 16, height: 1, background: "rgba(212,160,51,0.4)", marginBottom: 14 }} />
            <div className="space-y-2.5">
              {[
                { label: "Numéro de réservation", value: reservation._id, mono: true },
                ...(transactionId ? [{ label: "Transaction ID", value: transactionId, mono: true }] : []),
                { label: "Chambre", value: reservation.chambre?.name },
                { label: "Arrivée", value: new Date(reservation.checkIn).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: "Départ", value: new Date(reservation.checkOut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: "Durée", value: `${reservation.nights} nuit(s)` },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex justify-between">
                  <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>{label}</span>
                  <span style={mono ? { fontFamily: "monospace", fontSize: "10px", color: "#6b7280" } : { ...sans, fontSize: "12px", fontWeight: 400, color: "#111" }}>
                    {value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t border-gray-100 pt-3 mt-1">
                <span style={{ ...sans, fontSize: "11px", fontWeight: 600, color: "#374151" }}>Montant payé</span>
                <span style={{ ...serif, fontWeight: 400, fontSize: "20px", color: "#16a34a" }}>{formatAmountCFA(reservation.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
            <p style={{ ...sans, fontSize: "11px", color: "#1e40af" }}>
              <strong>📧 Email de confirmation envoyé</strong><br />
              <span style={{ fontWeight: 300 }}>Un email a été envoyé à <strong>{reservation.clientInfo?.email}</strong></span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <button onClick={handleDownloadReceipt}
                    style={{ ...sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#374151", background: "#fff", border: "1px solid #e5e7eb", padding: "12px", borderRadius: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Download className="w-4 h-4" /> Télécharger le reçu
            </button>
            <BtnBlue onClick={() => navigate('/rooms')}>Voir nos chambres</BtnBlue>
          </div>
          <BtnOutline onClick={() => navigate('/')}><Home className="w-4 h-4" /> Retour à l'accueil</BtnOutline>

          <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-2">ℹ️ Informations importantes</h4>
            <ul className="space-y-1">
              {["Check-in à partir de 15h00", "Check-out avant 11h00", "Pièce d'identité demandée à l'arrivée", "Conservez ce numéro de réservation"].map(item => (
                <li key={item} style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#6b7280" }}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Erreur ──
  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center mb-5">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-9 h-9 text-red-500" />
            </div>
            <h1 style={{ ...serif, fontWeight: 300, fontSize: "30px", letterSpacing: "0.03em" }} className="text-gray-900 mb-2">
              Paiement Échoué
            </h1>
            <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }}>{message}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
            <p style={{ ...sans, fontSize: "11px", color: "#92400e" }}>
              <strong>Que faire maintenant ?</strong><br />
              <span style={{ fontWeight: 300 }}>• Vérifiez que votre carte est valide<br />• Contactez votre banque si le problème persiste<br />• Réessayez avec une autre carte</span>
            </p>
          </div>

          <div className="space-y-3">
            <BtnPrimary onClick={() => navigate('/booking')}>Faire une nouvelle réservation</BtnPrimary>
            <BtnOutline onClick={() => navigate('/')}><Home className="w-4 h-4" /> Retour à l'accueil</BtnOutline>
          </div>

          <div style={{ ...sans, fontSize: "11px", textAlign: "center", color: "#9ca3af", marginTop: 20 }}>
            <p>Besoin d'aide ?</p>
            <p className="mt-1">
              <a href="tel:+237656708074" style={{ color: "#2563eb" }}>+237 656 708 074</a>
              {' · '}
              <a href="mailto:contact@grandhotel.com" style={{ color: "#2563eb" }}>contact@grandhotel.com</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentCallback;