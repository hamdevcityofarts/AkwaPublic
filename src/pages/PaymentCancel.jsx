// ══════════════════════════════════════════════════
// pages/PaymentCancel.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Home, ArrowLeft, Phone, Mail } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const BtnPrimary = ({ onClick, children, style = {} }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)", padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%", boxShadow: "0 2px 14px rgba(212,160,51,0.24)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...style }}>
    {children}
  </button>
);
const BtnBlue = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "#2563eb", padding: "13px 0", borderRadius: "32px", border: "none", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
    {children}
  </button>
);
const BtnOutline = ({ onClick, children }) => (
  <button onClick={onClick}
          style={{ ...sans, fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "#374151", background: "#f9fafb", border: "1px solid #e5e7eb", padding: "13px 0", borderRadius: "32px", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
    {children}
  </button>
);

export const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get('reservation');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center mb-5">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-9 h-9 text-orange-500" />
          </div>
          <h1 style={{ ...serif, fontWeight: 300, fontSize: "30px", letterSpacing: "0.03em" }}
              className="text-gray-900 mb-2">
            Paiement Annulé
          </h1>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300, color: "#9ca3af" }}>
            Vous avez annulé le processus de paiement
          </p>
          {reservationId && (
            <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 8 }}>
              Réservation : <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{reservationId}</code>
            </p>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-4">
          <p style={{ ...sans, fontSize: "11px", color: "#1e40af" }}>
            <strong>Votre réservation est toujours en attente</strong><br />
            <span style={{ fontWeight: 300 }}>Aucun montant n'a été débité. Vous pouvez réessayer à tout moment.</span>
          </p>
        </div>

        {/* Raisons */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <p style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-2">
            Raisons courantes d'annulation
          </p>
          <ul className="space-y-1">
            {[
              "Je veux vérifier les détails de ma réservation",
              "Je préfère utiliser une autre carte",
              "J'ai besoin de plus de temps pour décider",
              "Je veux modifier mes dates de séjour",
              "J'ai changé d'avis",
            ].map((item) => (
              <li key={item} style={{ ...sans, fontSize: "11px", fontWeight: 300, color: "#6b7280" }}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {reservationId && (
            <BtnPrimary onClick={() => navigate(`/booking?room=${reservationId}`)}>
              <ArrowLeft className="w-4 h-4" /> Retour au paiement
            </BtnPrimary>
          )}
          <BtnBlue onClick={() => navigate('/booking')}>Faire une nouvelle réservation</BtnBlue>
          <BtnOutline onClick={() => navigate('/rooms')}>Choisir une autre chambre</BtnOutline>
          <BtnOutline onClick={() => navigate('/')}><Home className="w-4 h-4" /> Retour à l'accueil</BtnOutline>
        </div>

        {/* Support */}
        <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-3">
            Besoin d'aide pour finaliser ?
          </h4>
          <div className="space-y-2">
            {[
              { icon: <Phone className="w-3.5 h-3.5 text-blue-500" />, href: "tel:+237656708074", label: "+237 656 708 074" },
              { icon: <Mail className="w-3.5 h-3.5 text-blue-500" />, href: "mailto:contact@grandhotel.com", label: "contact@grandhotel.com" },
            ].map(({ icon, href, label }) => (
              <div key={href} className="flex items-center gap-2">
                {icon}
                <a href={href} style={{ ...sans, fontSize: "12px", fontWeight: 400, color: "#2563eb" }}>{label}</a>
              </div>
            ))}
          </div>
          <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 8 }}>
            Notre équipe est disponible 24/7 pour vous assister
          </p>
        </div>

        <p style={{ ...sans, fontSize: "10px", textAlign: "center", color: "#9ca3af", marginTop: 14 }}>
          Votre réservation restera en attente pendant <strong>24 heures</strong>.<br />
          Passé ce délai, elle sera automatiquement annulée.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;