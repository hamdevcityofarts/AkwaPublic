// ══════════════════════════════════════════════════
// src/pages/PaymentSuccess.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Mail, Home, Calendar } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const BtnGold = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)", padding: "13px 20px", borderRadius: "32px", border: "none", cursor: "pointer", boxShadow: "0 2px 14px rgba(212,160,51,0.24)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flex: 1 }}>
    {children}
  </button>
);
const BtnOutline = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "#374151", background: "#f9fafb", border: "1px solid #e5e7eb", padding: "13px 20px", borderRadius: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flex: 1 }}>
    {children}
  </button>
);
const BtnDark = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "#111827", padding: "13px 20px", borderRadius: "32px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flex: 1 }}>
    {children}
  </button>
);

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reservationId = searchParams.get('reservation');
    const paymentId = searchParams.get('payment');
    if (reservationId) { fetchDetails(reservationId, paymentId); }
    else { setLoading(false); }
  }, [searchParams]);

  const convertToCFA = (amountInEuro) => {
    const exchangeRate = 655.957;
    return Math.round(amountInEuro * exchangeRate).toLocaleString('fr-FR');
  };

  const fetchDetails = async (reservationId, paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const resResponse = await fetch(import.meta.env.VITE_API_BASE_URL + `/reservations/${reservationId}`, { headers: { Authorization: `Bearer ${token}` } });
      const resData = await resResponse.json();
      if (resData.success) setReservation(resData.reservation);
      if (paymentId) {
        const payResponse = await fetch(import.meta.env.VITE_API_BASE_URL + `/payments/${paymentId}`, { headers: { Authorization: `Bearer ${token}` } });
        const payData = await payResponse.json();
        if (payData.success) setPayment(payData.payment);
      }
    } catch (error) { console.error('Erreur chargement détails:', error); }
    finally { setLoading(false); }
  };

  const handleDownloadReceipt = () => {
    const receiptData = {
      reservationId: reservation._id,
      clientName: `${reservation.client?.name} ${reservation.client?.surname}`,
      room: reservation.chambre?.name, checkIn: reservation.checkIn, checkOut: reservation.checkOut,
      nights: reservation.nights, amountCFA: convertToCFA(reservation.totalAmount),
      amountEUR: reservation.totalAmount, transactionId: payment?.transactionId,
      date: new Date().toLocaleDateString('fr-FR')
    };
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `reçu-${reservation._id}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + `/reservations/${reservation._id}/send-confirmation`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      if (response.ok) { alert('Un email de confirmation a été envoyé avec succès !'); }
      else { alert('Erreur lors de l\'envoi de l\'email'); }
    } catch (error) { console.error('Erreur envoi email:', error); alert('Erreur lors de l\'envoi de l\'email'); }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border border-blue-600 border-t-transparent" />
          <p style={{ ...sans, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af" }} className="mt-4">
            Chargement…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h1 style={{ ...serif, fontWeight: 300, fontSize: "42px", letterSpacing: "0.03em" }} className="text-gray-900 mb-2">
            Paiement Confirmé !
          </h1>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }}>
            Votre réservation a été confirmée avec succès
          </p>
        </div>

        {/* Détails */}
        {reservation && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-5">
            <h2 style={{ ...serif, fontWeight: 400, fontSize: "22px", letterSpacing: "0.04em" }} className="text-gray-900 mb-1">
              Détails de votre réservation
            </h2>
            <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 20 }} />

            <div className="grid md:grid-cols-2 gap-7">
              <div className="space-y-3">
                <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9ca3af" }}>
                  Informations
                </p>
                {[
                  { label: "N° réservation", value: reservation._id, mono: true },
                  { label: "Chambre", value: reservation.chambre?.name },
                  { label: "Type", value: reservation.chambre?.type },
                  { label: "Client", value: `${reservation.client?.name} ${reservation.client?.surname}` },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <span style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#9ca3af" }}>{label}</span>
                    <p style={mono ? { fontFamily: "monospace", fontSize: "11px", fontWeight: 600 } : { ...sans, fontSize: "13px", fontWeight: 400 }} className="text-gray-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9ca3af" }}>
                  <Calendar className="w-3.5 h-3.5 inline mr-1" /> Dates de séjour
                </p>
                {[
                  { label: "Arrivée", value: new Date(reservation.checkIn).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: "Départ", value: new Date(reservation.checkOut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: "Durée", value: `${reservation.nights} nuit(s)` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#9ca3af" }}>{label}</span>
                    <p style={{ ...sans, fontSize: "13px", fontWeight: 400 }} className="text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Montant */}
            <div className="border-t border-gray-100 mt-6 pt-5 flex justify-between items-end">
              <div>
                <p style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#9ca3af" }}>Montant total</p>
                <p style={{ ...serif, fontWeight: 300, fontSize: "36px", color: "#16a34a", lineHeight: 1 }}>
                  {convertToCFA(reservation.totalAmount)} FCFA
                </p>
                <p style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af", marginTop: 2 }}>
                  Soit {reservation.totalAmount} €
                </p>
              </div>
              {payment && (
                <div className="text-right">
                  <p style={{ ...sans, fontSize: "10px", color: "#9ca3af" }}>Transaction ID</p>
                  <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#374151" }}>{payment.transactionId}</p>
                  <p style={{ ...sans, fontSize: "10px", color: "#16a34a", marginTop: 2, fontWeight: 500 }}>Statut : Payé</p>
                </div>
              )}
            </div>

            {reservation.specialRequests && (
              <div className="border-t border-gray-100 mt-5 pt-5">
                <p style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#9ca3af", marginBottom: 5 }}>Demandes spéciales</p>
                <p style={{ ...sans, fontSize: "12px", fontWeight: 300, fontStyle: "italic", color: "#374151" }}
                   className="bg-gray-50 p-3 rounded-xl">
                  {reservation.specialRequests}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-gray-100">
          <h3 style={{ ...serif, fontWeight: 500, fontSize: "18px" }} className="text-gray-900 mb-4">
            Que faire maintenant ?
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <BtnGold onClick={handleDownloadReceipt}>
              <Download className="w-4 h-4" /> Télécharger le reçu
            </BtnGold>
            <BtnOutline onClick={handleSendEmail}>
              <Mail className="w-4 h-4" /> Renvoyer par email
            </BtnOutline>
          </div>
        </div>

        {/* Infos importantes */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-5 mb-5">
          <h3 style={{ ...serif, fontWeight: 500, fontSize: "17px" }} className="text-blue-900 mb-2">
            ℹ️ Informations importantes
          </h3>
          <ul className="space-y-1">
            {["Check-in à partir de 15h00", "Check-out avant 11h00", "Pièce d'identité demandée à l'arrivée", "Annulation gratuite jusqu'à 48h avant l'arrivée", "Paiement sécurisé via notre système"].map(item => (
              <li key={item} style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#1e40af" }}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <BtnDark onClick={() => navigate('/my-reservations')}>
            <Calendar className="w-4 h-4" /> Voir mes réservations
          </BtnDark>
          <BtnOutline onClick={() => navigate('/')}>
            <Home className="w-4 h-4" /> Retour à l'accueil
          </BtnOutline>
        </div>

        {/* Contact */}
        <div style={{ ...sans, fontSize: "11px", textAlign: "center", color: "#9ca3af", marginTop: 24 }}>
          <p>Des questions ? Contactez-nous :</p>
          <p className="mt-1">
            <a href="tel:+237XXXXXXXX" style={{ color: "#2563eb" }}>+237 XX XX XX XX</a>
            {' · '}
            <a href="mailto:contact@grandhotel.com" style={{ color: "#2563eb" }}>contact@grandhotel.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;