// ══════════════════════════════════════════════════
// src/pages/Booking.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import PaymentForm from '../components/SecurePaymentForm';
import { Calendar, Users, AlertCircle, CheckCircle, Loader, CreditCard } from 'lucide-react';
import roomsService from '../services/roomsService';
import reservationsService from '../services/reservationsService';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const fieldClass = `w-full border border-gray-200 rounded-xl px-4 py-3
  focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
  outline-none transition-all duration-200 bg-gray-50/50`;

const labelStyle = { ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" };

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const roomId = searchParams.get('room');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [activePromo, setActivePromo] = useState(null);
  const [paymentOption, setPaymentOption] = useState('full');
  const [partialNights, setPartialNights] = useState(1);

  const [form, setForm] = useState({
    name: '', surname: '', email: '', phone: '',
    checkin: '', checkout: '', adults: 1, children: 0,
    roomId: roomId || '', specialRequests: ''
  });

  useEffect(() => {
    if (location.state?.promoData) {
      console.log('🎯 Promo reçue depuis navigation:', location.state.promoData);
      setActivePromo(location.state.promoData);
      const { checkin, checkout } = form;
      if (checkin || checkout) {
        const promoStart = new Date(location.state.promoData.dateDebut);
        const promoEnd = new Date(location.state.promoData.dateFin);
        if (checkin && new Date(checkin) < promoStart) setForm(prev => ({ ...prev, checkin: '' }));
        if (checkout && new Date(checkout) > promoEnd) setForm(prev => ({ ...prev, checkout: '' }));
      }
    }
  }, [location.state]);

  const getDateConstraints = () => {
    if (activePromo) {
      const promoStart = new Date(activePromo.dateDebut);
      const promoEnd = new Date(activePromo.dateFin);
      return { minDate: promoStart.toISOString().split('T')[0], maxDate: promoEnd.toISOString().split('T')[0], minCheckout: form.checkin || promoStart.toISOString().split('T')[0] };
    } else {
      const today = new Date().toISOString().split('T')[0];
      return { minDate: today, maxDate: null, minCheckout: form.checkin || today };
    }
  };

  const dateConstraints = getDateConstraints();
  const formatPrice = (price) => roomsService.formatPrice(price);

  useEffect(() => { loadRooms(); }, []);

  useEffect(() => {
    if (roomId && rooms.length > 0) {
      const room = rooms.find(r => r._id === roomId);
      if (room) { setSelectedRoom(room); setForm(prev => ({ ...prev, roomId })); }
    }
  }, [roomId, rooms]);

  const loadRooms = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/chambres');
      const data = await response.json();
      if (data.success) setRooms(data.chambres || []);
    } catch (err) { console.error('Erreur chargement chambres:', err); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'roomId') { const room = rooms.find(r => r._id === value); setSelectedRoom(room); setActivePromo(null); }
    if (name === 'checkin') setForm(prev => ({ ...prev, checkout: '' }));
  };

  const handlePaymentOptionChange = (option) => { setPaymentOption(option); if (option !== 'partial') setPartialNights(1); };

  const handlePartialNightsChange = (e) => {
    const nights = parseInt(e.target.value);
    const totalNights = calculateNights();
    if (nights >= 1 && nights <= totalNights) setPartialNights(nights);
  };

  const calculateNights = () => {
    if (form.checkin && form.checkout) {
      const checkIn = new Date(form.checkin); const checkOut = new Date(form.checkout);
      const diffDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const calculateBaseAmount = () => {
    if (!selectedRoom) return 0;
    const totalNights = calculateNights(); const basePricePerNight = selectedRoom.price;
    switch (paymentOption) {
      case 'first-night': return basePricePerNight;
      case 'partial': return basePricePerNight * Math.min(partialNights, totalNights);
      default: return basePricePerNight * totalNights;
    }
  };

  const calculateAmountWithPromo = () => {
    if (!selectedRoom || !activePromo) return 0;
    const totalNights = calculateNights(); const promoPricePerNight = activePromo.prixReduit;
    switch (paymentOption) {
      case 'first-night': return promoPricePerNight;
      case 'partial': return promoPricePerNight * Math.min(partialNights, totalNights);
      default: return promoPricePerNight * totalNights;
    }
  };

  const calculateFinalAmount = () => activePromo ? Math.round(calculateAmountWithPromo()) : Math.round(calculateBaseAmount());

  const getNightsToPay = () => {
    const totalNights = calculateNights();
    switch (paymentOption) {
      case 'first-night': return 1;
      case 'partial': return Math.min(partialNights, totalNights);
      default: return totalNights;
    }
  };

  const getPaymentOptionDescription = () => {
    const nightsToPay = getNightsToPay(); const totalNights = calculateNights();
    switch (paymentOption) {
      case 'first-night': return `Première nuit (sur ${totalNights} nuits totales)`;
      case 'partial': return `${nightsToPay} nuit${nightsToPay > 1 ? 's' : ''} (sur ${totalNights} nuits totales)`;
      default: return `Totalité (${totalNights} nuit${totalNights > 1 ? 's' : ''})`;
    }
  };

  const redirectToCyberSource = (paymentData) => {
    console.log('🚀 Redirection vers CyberSource...', paymentData);
    try {
      if (!paymentData) throw new Error('Aucune donnée de paiement reçue');
      if (!paymentData.form_data || typeof paymentData.form_data !== 'object') throw new Error('Données de formulaire manquantes ou invalides');
      if (!paymentData.form_action) throw new Error('URL de redirection manquante');
      const formDataKeys = Object.keys(paymentData.form_data);
      if (formDataKeys.length === 0) throw new Error('Aucun champ de formulaire trouvé');
      console.log(`📋 ${formDataKeys.length} champs de formulaire détectés`);
      const form = document.createElement('form');
      form.method = 'POST'; form.action = paymentData.form_action; form.style.display = 'none';
      formDataKeys.forEach(key => {
        const value = paymentData.form_data[key];
        if (value != null) { const input = document.createElement('input'); input.type = 'hidden'; input.name = key; input.value = value.toString(); form.appendChild(input); }
      });
      document.body.appendChild(form); console.log('📤 Soumission du formulaire CyberSource...'); form.submit();
    } catch (error) {
      console.error('❌ Erreur lors de la redirection CyberSource:', error);
      setError(`Erreur de paiement: ${error.message}. Veuillez utiliser le paiement alternatif.`); setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    if (!form.roomId) { setError('Veuillez sélectionner une chambre'); return; }
    if (!form.name || !form.surname || !form.email) { setError('Veuillez remplir tous les champs obligatoires'); return; }
    if (!form.checkin || !form.checkout) { setError('Veuillez sélectionner les dates'); return; }
    const checkInDate = new Date(form.checkin); const checkOutDate = new Date(form.checkout);
    if (checkOutDate <= checkInDate) { setError('La date de départ doit être après la date d\'arrivée'); return; }
    if (calculateNights() === 0) { setError('La réservation doit être d\'au moins 1 nuit'); return; }
    if (activePromo) {
      const promoStart = new Date(activePromo.dateDebut); const promoEnd = new Date(activePromo.dateFin);
      if (checkInDate < promoStart || checkOutDate > promoEnd) {
        setError(`Les dates doivent être strictement comprises entre ${promoStart.toLocaleDateString('fr-FR')} et ${promoEnd.toLocaleDateString('fr-FR')} pour bénéficier de cette promotion`); return;
      }
    }
    setLoading(true);
    try {
      console.log('🔹 Début création réservation publique...');
      const finalAmount = calculateFinalAmount();
      const reservationData = {
        chambreId: form.roomId, checkIn: form.checkin, checkOut: form.checkout,
        adults: parseInt(form.adults), children: parseInt(form.children),
        guests: parseInt(form.adults) + parseInt(form.children),
        specialRequests: form.specialRequests, paymentMethod: 'card',
        paymentOption, nightsToPay: getNightsToPay(),
        codePromo: activePromo ? activePromo.codePromo : undefined,
        prixTotal: finalAmount,
        clientInfo: { name: form.name, surname: form.surname, email: form.email, phone: form.phone }
      };
      console.log('🔹 Données réservation envoyées au backend:', { prixTotal: finalAmount, codePromo: activePromo ? activePromo.codePromo : 'AUCUN', paymentOption, nightsToPay: getNightsToPay() });
      const reservationResponse = await fetch(import.meta.env.VITE_API_BASE_URL + '/reservations/public', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reservationData)
      });
      const reservationResult = await reservationResponse.json();
      console.log('🔹 Réponse création réservation:', reservationResult);
      if (!reservationResponse.ok || !reservationResult.success) throw new Error(reservationResult.message || 'Erreur lors de la création de la réservation');
      console.log('✅ Réservation créée:', reservationResult.reservation);
      setReservation(reservationResult.reservation);
      if (reservationResult.payment) {
        console.log('💰 Données de paiement reçues (montant envoyé):', reservationResult.payment.form_data?.amount);
        setPaymentData(reservationResult.payment);
        setTimeout(() => { redirectToCyberSource(reservationResult.payment); }, 100);
      } else {
        setStep(2); console.log('✅ Passage à l\'étape 2 (paiement local)');
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.message || 'Erreur lors de la création de la réservation');
    } finally { setLoading(false); }
  };

  const handlePaymentSuccess = (paymentResult) => { console.log('✅ Paiement réussi:', paymentResult); setStep(3); };
  const handlePaymentError = (errorMessage) => { console.error('❌ Erreur paiement:', errorMessage); setError(errorMessage); };
  const handleBackToForm = () => { setStep(1); setError(null); };

  // COMPOSANT DE REDIRECTION CYBERSOURCE
  const CyberSourceRedirect = () => {
    useEffect(() => {
      if (paymentData) { console.log('🔄 Redirection automatique vers CyberSource...'); redirectToCyberSource(paymentData); }
    }, [paymentData]);
    return (
      <div className="container-max py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <CreditCard className="w-14 h-14 text-blue-500 mx-auto mb-5" />
          <h1 style={{ ...serif, fontWeight: 300, fontSize: "26px" }} className="text-gray-900 mb-2">
            Redirection vers le paiement sécurisé
          </h1>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }} className="mb-6">
            Vous allez être redirigé vers la plateforme de paiement sécurisée CyberSource…
          </p>
          <div className="animate-spin rounded-full h-10 w-10 border border-blue-500 border-t-transparent mx-auto" />
          <p style={{ ...sans, fontSize: "11px", color: "#9ca3af", marginTop: 16 }}>
            Si la redirection ne se fait pas automatiquement,{' '}
            <button onClick={() => redirectToCyberSource(paymentData)} style={{ color: "#2563eb" }}>
              cliquez ici
            </button>
          </p>
        </div>
      </div>
    );
  };

  // ── ÉTAPE 3 : CONFIRMATION ──
  if (step === 3 && reservation) {
    return (
      <div className="container-max py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h1 style={{ ...serif, fontWeight: 300, fontSize: "36px", letterSpacing: "0.03em" }} className="text-gray-900 mb-2">
            Réservation Confirmée !
          </h1>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }} className="mb-7">
            Votre paiement a été traité avec succès
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-amber-50/20 rounded-2xl p-6 mb-6 text-left border border-gray-100">
            <h3 style={{ ...serif, fontWeight: 500, fontSize: "18px" }} className="text-gray-900 mb-4">
              Détails de votre réservation
            </h3>
            <div style={{ width: 16, height: 1, background: "rgba(212,160,51,0.4)", marginBottom: 14 }} />
            <div className="space-y-3">
              {[
                { label: "Numéro", value: reservation._id, mono: true },
                { label: "Chambre", value: selectedRoom?.name },
                { label: "Dates", value: `${new Date(form.checkin).toLocaleDateString('fr-FR')} au ${new Date(form.checkout).toLocaleDateString('fr-FR')}` },
                { label: "Nuits totales", value: `${calculateNights()}` },
                { label: "Option de paiement", value: getPaymentOptionDescription() },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex justify-between items-baseline">
                  <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>{label}</span>
                  <span style={mono ? { fontFamily: "monospace", fontSize: "10px", color: "#6b7280" } : { ...sans, fontSize: "12px", fontWeight: 400, color: "#111" }}>
                    {value}
                  </span>
                </div>
              ))}
              {activePromo && (
                <>
                  <div className="flex justify-between items-baseline">
                    <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>Réduction appliquée</span>
                    <span style={{ ...sans, fontSize: "12px", color: "#16a34a" }}>-{formatPrice(activePromo.economie)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span style={{ ...sans, fontSize: "10px", color: "#9ca3af" }}>Code promo</span>
                    <span style={{ ...sans, fontSize: "10px", fontWeight: 500, color: "#6b7280" }}>{activePromo.codePromo}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-baseline border-t border-gray-100 pt-3 mt-1">
                <span style={{ ...sans, fontSize: "11px", fontWeight: 500, color: "#374151" }}>Montant payé</span>
                <span style={{ ...serif, fontWeight: 400, fontSize: "20px", color: "#16a34a" }}>
                  {formatPrice(reservation.totalAmount || calculateFinalAmount())}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-6 text-left">
            <p style={{ ...sans, fontSize: "11px", fontWeight: 600, color: "#1e40af" }} className="mb-1">
              📧 Email de confirmation envoyé
            </p>
            <p style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#3b82f6" }}>
              Un email a été envoyé à <strong>{form.email}</strong> avec tous les détails.
            </p>
          </div>

          <button onClick={() => navigate('/')}
                  style={{
                    ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
                    color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)",
                    padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%",
                    boxShadow: "0 2px 14px rgba(212,160,51,0.28)"
                  }}>
            🏠 Retour à l'accueil
          </button>
          <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 16 }}>
            Conservez votre numéro de réservation pour toute correspondance future
          </p>
        </div>
      </div>
    );
  }

  // ── REDIRECTION CYBERSOURCE ──
  if (paymentData) return <CyberSourceRedirect />;

  // ── ÉTAPE 2 : PAIEMENT LOCAL ──
  if (step === 2 && reservation) {
    return (
      <div className="container-max py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button onClick={handleBackToForm}
                    style={{ ...sans, fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", color: "#2563eb" }}
                    className="flex items-center mb-4 hover:opacity-75 transition-opacity">
              ← Retour aux informations
            </button>
          </div>
          {error && (
            <div style={sans} className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
            </div>
          )}
          <PaymentForm
            reservation={{ ...reservation, totalAmount: calculateFinalAmount(), clientEmail: form.email, clientName: `${form.surname} ${form.name}` }}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    );
  }

  // ── ÉTAPE 1 : FORMULAIRE ──
  return (
    <div className="container-max py-16">
      {/* En-tête */}
      <div className="max-w-2xl mx-auto mb-8">
        <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase" }}
           className="text-amber-600/70 mb-3">
          Votre séjour
        </p>
        <div className="flex items-center gap-3 mb-3">
          <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
          <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,160,51,0.55),transparent)", display: "block" }} />
          <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
        </div>
        <h1 style={{ ...serif, fontWeight: 300, fontSize: "38px", letterSpacing: "0.03em" }}
            className="text-gray-900">
          Réserver une chambre
        </h1>
      </div>

      {/* Erreur globale */}
      {error && (
        <div style={sans} className="max-w-2xl mx-auto mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

        {/* Badge promo active */}
        {activePromo && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ ...sans, fontSize: "11px", fontWeight: 600, color: "#15803d" }}>🎟️ Code promo actif</p>
                <p style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#16a34a", marginTop: 2 }}>
                  Validité : {new Date(activePromo.dateDebut).toLocaleDateString('fr-FR')} au {new Date(activePromo.dateFin).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.10em" }}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {activePromo.codePromo}
              </span>
            </div>
          </div>
        )}

        {/* Sélection chambre */}
        <div className="mb-5">
          <label style={labelStyle} className="block text-gray-500 mb-2">Chambre *</label>
          <select name="roomId" value={form.roomId} onChange={handleChange} required
                  style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                  className={fieldClass}>
            <option value="">Sélectionnez une chambre</option>
            {rooms.map(room => (
              <option key={room._id} value={room._id}>{room.name} — {formatPrice(room.price)}/nuit</option>
            ))}
          </select>
        </div>

        {/* Infos client */}
        <div className="grid gap-4 md:grid-cols-2 mb-5">
          {[
            { name: "name", label: "Nom", placeholder: "Votre nom", required: true },
            { name: "surname", label: "Prénom", placeholder: "Votre prénom", required: true },
            { name: "email", label: "Email", placeholder: "votre@email.com", type: "email", required: true },
            { name: "phone", label: "Téléphone", placeholder: "+237 XXX XX XX XX", type: "tel" },
          ].map(({ name, label, placeholder, type = "text", required = false }) => (
            <div key={name}>
              <label style={labelStyle} className="block text-gray-500 mb-2">{label} {required && "*"}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange}
                     required={required} placeholder={placeholder}
                     style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                     className={fieldClass} />
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid gap-4 md:grid-cols-2 mb-5">
          <div>
            <label style={labelStyle} className="block text-gray-500 mb-2">
              <Calendar className="w-3.5 h-3.5 inline mr-1" /> Arrivée *
            </label>
            <input type="date" name="checkin" value={form.checkin} onChange={handleChange} required
                   min={dateConstraints.minDate} max={dateConstraints.maxDate || undefined}
                   style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                   className={fieldClass} />
            {activePromo && <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 3 }}>Min : {new Date(activePromo.dateDebut).toLocaleDateString('fr-FR')}</p>}
          </div>
          <div>
            <label style={labelStyle} className="block text-gray-500 mb-2">
              <Calendar className="w-3.5 h-3.5 inline mr-1" /> Départ *
            </label>
            <input type="date" name="checkout" value={form.checkout} onChange={handleChange} required
                   min={dateConstraints.minCheckout} max={dateConstraints.maxDate || undefined}
                   style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                   className={fieldClass} />
            {activePromo && <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 3 }}>Max : {new Date(activePromo.dateFin).toLocaleDateString('fr-FR')}</p>}
          </div>
        </div>

        {/* Personnes */}
        <div className="grid gap-4 md:grid-cols-2 mb-5">
          {[
            { name: "adults", label: "Adultes", icon: <Users className="w-3.5 h-3.5 inline mr-1" />, min: 1, max: 10, required: true },
            { name: "children", label: "Enfants", min: 0, max: 10 },
          ].map(({ name, label, icon, min, max, required = false }) => (
            <div key={name}>
              <label style={labelStyle} className="block text-gray-500 mb-2">{icon}{label} {required && "*"}</label>
              <input type="number" name={name} value={form[name]} onChange={handleChange}
                     min={min} max={max} required={required}
                     style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                     className={fieldClass} />
            </div>
          ))}
        </div>

        {/* Options de paiement */}
        {calculateNights() > 0 && selectedRoom && (
          <div className="mb-5">
            <label style={labelStyle} className="block text-gray-500 mb-3">Options de paiement</label>
            <div className="space-y-2">
              {[
                {
                  value: "first-night",
                  title: "Payer la première nuit seulement",
                  desc: `Sécurisez votre réservation en payant seulement la première nuit (${formatPrice(activePromo ? activePromo.prixReduit : selectedRoom.price)})`
                },
                {
                  value: "partial",
                  title: "Payer un nombre partiel de nuits",
                  desc: "Choisissez combien de nuits vous souhaitez payer maintenant"
                },
                {
                  value: "full",
                  title: "Payer la totalité du séjour",
                  desc: "Payez l'intégralité de votre séjour en une seule fois"
                },
              ].map(({ value, title, desc }) => (
                <label key={value}
                       className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                         paymentOption === value ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200 hover:bg-gray-50/50'
                       }`}>
                  <input type="radio" name="paymentOption" value={value}
                         checked={paymentOption === value}
                         onChange={() => handlePaymentOptionChange(value)}
                         className="mt-1 accent-amber-500" />
                  <div className="flex-1">
                    <div style={{ ...sans, fontSize: "12px", fontWeight: 500, color: "#111" }}>{title}</div>
                    <div style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af", marginTop: 2 }}>{desc}</div>
                    {value === 'partial' && paymentOption === 'partial' && (
                      <div className="mt-2 flex items-center gap-2">
                        <span style={{ ...sans, fontSize: "11px", color: "#6b7280" }}>Nuits à payer :</span>
                        <select value={partialNights} onChange={handlePartialNightsChange}
                                style={{ ...sans, fontSize: "11px" }}
                                className="border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-amber-300/40 outline-none">
                          {Array.from({ length: calculateNights() }, (_, i) => i + 1).map(night => (
                            <option key={night} value={night}>{night} nuit{night > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Demandes spéciales */}
        <div className="mb-5">
          <label style={labelStyle} className="block text-gray-500 mb-2">Demandes spéciales (optionnel)</label>
          <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} rows="3"
                    placeholder="Allergies, préférences, demandes particulières..."
                    style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                    className={`${fieldClass} resize-none`} />
        </div>

        {/* Récapitulatif */}
        {calculateNights() > 0 && selectedRoom && (
          <div className="bg-gradient-to-br from-blue-50/80 to-amber-50/20 rounded-xl p-5 mb-6 border border-blue-100/60">
            <h3 style={{ ...serif, fontWeight: 500, fontSize: "18px" }} className="text-blue-900 mb-3">
              Récapitulatif
            </h3>
            <div style={{ width: 16, height: 1, background: "rgba(212,160,51,0.4)", marginBottom: 12 }} />
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>Chambre</span>
                <span style={{ ...sans, fontSize: "12px", fontWeight: 400, color: "#111" }}>{selectedRoom.name}</span>
              </div>
              {activePromo ? (
                <>
                  <div className="flex justify-between">
                    <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>Prix original</span>
                    <span style={{ ...sans, fontSize: "11px", textDecoration: "line-through", color: "#9ca3af" }}>{formatPrice(selectedRoom.price)}/nuit</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#16a34a" }}>Prix promo</span>
                    <span style={{ ...sans, fontSize: "12px", fontWeight: 500, color: "#16a34a" }}>{formatPrice(activePromo.prixReduit)}/nuit</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ ...sans, fontSize: "10px", color: "#9ca3af" }}>Économie</span>
                    <span style={{ ...sans, fontSize: "10px", fontWeight: 500, color: "#16a34a" }}>-{formatPrice(activePromo.economie)}/nuit</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>Prix par nuit</span>
                  <span style={{ ...sans, fontSize: "12px", fontWeight: 400, color: "#111" }}>{formatPrice(selectedRoom.price)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>Nuits totales</span>
                <span style={{ ...sans, fontSize: "12px", fontWeight: 400, color: "#111" }}>{calculateNights()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#9ca3af" }}>Option choisie</span>
                <span style={{ ...sans, fontSize: "12px", fontWeight: 400, color: "#111" }}>{getPaymentOptionDescription()}</span>
              </div>
              {activePromo && (
                <div className="flex justify-between">
                  <span style={{ ...sans, fontSize: "10px", color: "#9ca3af" }}>Code promo appliqué</span>
                  <span style={{ ...sans, fontSize: "10px", fontWeight: 500, color: "#16a34a" }}>{activePromo.codePromo}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline border-t border-blue-100 pt-3 mt-1">
                <span style={{ ...sans, fontSize: "11px", fontWeight: 600, color: "#1e40af" }}>Montant à payer</span>
                <span style={{ ...serif, fontWeight: 400, fontSize: "24px", color: "#2563eb" }}>
                  {formatPrice(calculateFinalAmount())}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bouton soumettre */}
        <button type="submit" disabled={loading || !form.roomId || calculateNights() === 0}
                style={{
                  ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)",
                  padding: "14px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%",
                  boxShadow: "0 3px 18px rgba(212,160,51,0.28)", transition: "all 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: (loading || !form.roomId || calculateNights() === 0) ? 0.6 : 1
                }}>
          {loading ? (
            <><Loader className="w-4 h-4 animate-spin" /> Création en cours...</>
          ) : (
            `Payer ${formatPrice(calculateFinalAmount())}`
          )}
        </button>

        <p style={{ ...sans, fontSize: "10px", textAlign: "center", color: "#9ca3af", marginTop: 12 }}>
          🔒 Paiement sécurisé via Cybersource (Société Générale)
        </p>
      </form>
    </div>
  );
}