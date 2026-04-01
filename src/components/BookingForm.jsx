// ══════════════════════════════════════════════════
// src/components/BookingForm.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, CheckCircle, XCircle, Loader } from 'lucide-react';
import PaymentForm from './PaymentForm';
import roomsService from '../services/roomsService';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const fieldClass = `w-full border border-gray-200 rounded-xl px-4 py-3
  focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
  outline-none transition-all duration-200 bg-gray-50/50`;

const labelClass = { ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" };

const BookingForm = ({ room }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(null);

  const [formData, setFormData] = useState({
    checkIn: '', checkOut: '', adults: 1, children: 0, specialRequests: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const calculateTotal = () => room.price * calculateNights();

  const formatPrice = (price) => roomsService.formatPrice(price);

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    if (!formData.checkIn || !formData.checkOut) { setError('Veuillez sélectionner les dates'); return; }
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    if (checkOutDate <= checkInDate) { setError('La date de départ doit être après la date d\'arrivée'); return; }
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login?redirect=/booking'); return; }
      console.log('🔹 Création réservation pour chambre:', room._id);
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          chambreId: room._id, checkIn: formData.checkIn, checkOut: formData.checkOut,
          adults: parseInt(formData.adults), children: parseInt(formData.children),
          guests: parseInt(formData.adults) + parseInt(formData.children),
          specialRequests: formData.specialRequests, paymentMethod: 'card',
          totalAmount: calculateTotal(), nights: calculateNights()
        })
      });
      const result = await response.json();
      console.log('🔹 Réponse création réservation:', result);
      if (!response.ok || !result.success) throw new Error(result.message || 'Erreur lors de la création de la réservation');
      setReservation(result.reservation); setStep(2);
      console.log('✅ Réservation créée, passage à l\'étape paiement');
    } catch (err) {
      console.error('❌ Erreur création réservation:', err);
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handlePaymentSuccess = (paymentResult) => { console.log('✅ Paiement réussi:', paymentResult); setStep(3); };
  const handlePaymentError = (errorMessage) => { setError(errorMessage); setStep(1); };

  // ── ÉTAPE 3 : CONFIRMATION ──
  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 style={{ ...serif, fontWeight: 300, fontSize: "34px", letterSpacing: "0.03em" }}
              className="text-gray-900 mb-2">
            Réservation Confirmée !
          </h2>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300 }} className="text-gray-500">
            Votre paiement a été traité avec succès
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-2xl p-6 mb-7 text-left border border-gray-100">
          <h3 style={{ ...serif, fontWeight: 500, fontSize: "18px" }} className="text-gray-900 mb-4">
            Détails de votre réservation
          </h3>
          <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 14 }} />
          <div className="space-y-3">
            {[
              { label: "Numéro de réservation", value: reservation._id, mono: true },
              { label: "Chambre", value: room.name },
              { label: "Dates", value: `${new Date(formData.checkIn).toLocaleDateString('fr-FR')} — ${new Date(formData.checkOut).toLocaleDateString('fr-FR')}` },
              { label: "Montant payé", value: formatPrice(calculateTotal()), highlight: true },
            ].map(({ label, value, mono, highlight }) => (
              <div key={label} className="flex justify-between items-baseline">
                <span style={{ ...sans, fontSize: "11px", letterSpacing: "0.08em", color: "#9ca3af" }}>{label}</span>
                <span style={highlight
                  ? { ...serif, fontWeight: 400, fontSize: "18px", color: "#16a34a" }
                  : mono
                  ? { fontFamily: "monospace", fontSize: "11px", color: "#6b7280" }
                  : { ...sans, fontSize: "13px", fontWeight: 400, color: "#111" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => navigate('/my-reservations')}
                  style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)", padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%", boxShadow: "0 2px 14px rgba(212,160,51,0.28)" }}>
            Voir mes réservations
          </button>
          <button onClick={() => navigate('/')}
                  style={{ ...sans, fontSize: "10px", fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b7280", background: "#f9fafb", padding: "13px 0", borderRadius: "32px", border: "1px solid #e5e7eb", cursor: "pointer", width: "100%" }}>
            Retour à l'accueil
          </button>
        </div>

        <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 20 }}>
          Un email de confirmation a été envoyé à votre adresse
        </p>
      </div>
    );
  }

  // ── ÉTAPE 2 : PAIEMENT ──
  if (step === 2 && reservation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={() => setStep(1)}
                  style={{ ...sans, fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", color: "#2563eb" }}
                  className="flex items-center hover:opacity-75 transition-opacity">
            ← Retour aux informations
          </button>
        </div>
        {error && (
          <div style={sans} className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
            <XCircle className="w-4 h-4 mr-2" /> {error}
          </div>
        )}
        <PaymentForm
          reservation={{ ...reservation, totalAmount: calculateTotal() }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  // ── ÉTAPE 1 : FORMULAIRE ──
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-7">

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 style={{ ...serif, fontWeight: 300, fontSize: "28px", letterSpacing: "0.03em" }}
                className="text-gray-900 mb-1">
              Informations de réservation
            </h2>
            <div style={{ width: 20, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 24 }} />

            {error && (
              <div style={sans} className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
                <XCircle className="w-4 h-4 mr-2" /> {error}
              </div>
            )}

            <form onSubmit={handleCreateReservation} className="space-y-5">
              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { field: "checkIn", label: "Date d'arrivée", icon: <Calendar className="w-3.5 h-3.5 inline mr-1" />, min: new Date().toISOString().split('T')[0], minField: null },
                  { field: "checkOut", label: "Date de départ", icon: <Calendar className="w-3.5 h-3.5 inline mr-1" />, min: formData.checkIn || new Date().toISOString().split('T')[0], minField: "checkIn" },
                ].map(({ field, label, icon, min }) => (
                  <div key={field}>
                    <label style={{ ...labelClass }} className="block text-gray-500 mb-2">
                      {icon} {label} *
                    </label>
                    <input type="date" required value={formData[field]}
                           onChange={(e) => handleChange(field, e.target.value)}
                           min={min}
                           style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                           className={fieldClass} />
                  </div>
                ))}
              </div>

              {/* Personnes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label style={labelClass} className="block text-gray-500 mb-2">
                    <Users className="w-3.5 h-3.5 inline mr-1" /> Adultes *
                  </label>
                  <select required value={formData.adults}
                          onChange={(e) => handleChange('adults', e.target.value)}
                          style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                          className={fieldClass}>
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} adulte{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelClass} className="block text-gray-500 mb-2">Enfants</label>
                  <select value={formData.children}
                          onChange={(e) => handleChange('children', e.target.value)}
                          style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                          className={fieldClass}>
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} enfant{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Demandes spéciales */}
              <div>
                <label style={labelClass} className="block text-gray-500 mb-2">
                  Demandes spéciales (optionnel)
                </label>
                <textarea rows="4" value={formData.specialRequests}
                          onChange={(e) => handleChange('specialRequests', e.target.value)}
                          placeholder="Allergies, préférences, demandes particulières..."
                          style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                          className={`${fieldClass} resize-none`} />
              </div>

              {/* Bouton */}
              <button type="submit" disabled={loading || calculateNights() === 0}
                      style={{
                        ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)",
                        padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%",
                        boxShadow: "0 3px 18px rgba(212,160,51,0.28)", transition: "all 0.3s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        opacity: (loading || calculateNights() === 0) ? 0.6 : 1
                      }}>
                {loading ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Création en cours...</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Continuer vers le paiement</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Récapitulatif */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 style={{ ...serif, fontWeight: 500, fontSize: "19px" }} className="text-gray-900 mb-1">
              Récapitulatif
            </h3>
            <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 16 }} />

            <div className="mb-3">
              <span style={{ ...sans, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9ca3af" }}>Chambre</span>
              <p style={{ ...serif, fontWeight: 400, fontSize: "17px" }} className="text-gray-900">{room.name}</p>
            </div>

            {calculateNights() > 0 && (
              <>
                <div className="border-t border-gray-100 pt-4 mb-4 space-y-2.5">
                  {[
                    { label: "Prix par nuit", value: formatPrice(room.price) },
                    { label: "Nombre de nuits", value: `${calculateNights()}` },
                    { label: "Personnes", value: `${parseInt(formData.adults) + parseInt(formData.children)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-baseline">
                      <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>{label}</span>
                      <span style={{ ...sans, fontSize: "12px", fontWeight: 400, color: "#374151" }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span style={{ ...sans, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280" }}>
                      Total
                    </span>
                    <span style={{ ...serif, fontWeight: 400, fontSize: "26px", color: "#2563eb" }}>
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;