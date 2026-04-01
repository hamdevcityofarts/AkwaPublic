// src/pages/Contact.jsx — VERSION LUXE HÔTELIÈRE
import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

export default function Contact() {
  const [msg, setMsg] = React.useState({ name: "", email: "", message: "" });
  const handleChange = (e) =>
    setMsg({ ...msg, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message envoyé (simulation)");
  };

  return (
    <div className="container-max py-16">
      {/* En-tête section */}
      <div className="mb-12">
        <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.30em", textTransform: "uppercase" }}
           className="text-amber-600/70 mb-3">
          Parlons-nous
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
          <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,160,51,0.55),transparent)", display: "block" }} />
          <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
        </div>
        <h1 style={{ ...serif, fontWeight: 300, fontSize: "42px", letterSpacing: "0.03em" }}
            className="text-gray-900">
          Contact
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* ── Formulaire ── */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <h2 style={{ ...serif, fontWeight: 400, fontSize: "22px", letterSpacing: "0.04em" }}
              className="text-gray-900 mb-6">
            Envoyez-nous un message
          </h2>
          <div style={{ width: 20, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 24 }} />

          {/* Champ Nom */}
          <div className="mb-5">
            <label
              style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
              className="block text-gray-500 mb-2"
            >
              Nom
            </label>
            <input
              name="name"
              value={msg.name}
              onChange={handleChange}
              style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
                outline-none transition-all duration-200 bg-gray-50/50"
              placeholder="Votre nom"
            />
          </div>

          {/* Champ Email */}
          <div className="mb-5">
            <label
              style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
              className="block text-gray-500 mb-2"
            >
              Email
            </label>
            <input
              name="email"
              value={msg.email}
              onChange={handleChange}
              style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
                outline-none transition-all duration-200 bg-gray-50/50"
              placeholder="votre@email.com"
            />
          </div>

          {/* Champ Message */}
          <div className="mb-7">
            <label
              style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
              className="block text-gray-500 mb-2"
            >
              Message
            </label>
            <textarea
              name="message"
              value={msg.message}
              onChange={handleChange}
              rows={5}
              style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
                outline-none transition-all duration-200 bg-gray-50/50 resize-none"
              placeholder="Votre message..."
            />
          </div>

          {/* Bouton doré */}
          <button
            type="submit"
            style={{
              ...sans, fontSize: "10px", fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#1a1208",
              background: "linear-gradient(135deg, #e8c97a, #d4a033)",
              padding: "12px 30px", borderRadius: "32px", border: "none",
              cursor: "pointer",
              boxShadow: "0 3px 18px rgba(212,160,51,0.28)",
              transition: "all 0.3s"
            }}
          >
            Envoyer le message
          </button>
        </form>

        {/* ── Coordonnées ── */}
        <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50/40 rounded-2xl border border-gray-100">
          <h2 style={{ ...serif, fontWeight: 400, fontSize: "22px", letterSpacing: "0.04em" }}
              className="text-gray-900 mb-2">
            Nos Coordonnées
          </h2>
          <div style={{ width: 20, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 20 }} />

          <div className="space-y-5 mb-8">
            {[
              { icon: <MapPin className="w-4 h-4 text-blue-500" />, label: "Adresse", value: "À proximité de l'aéroport international" },
              { icon: <Phone className="w-4 h-4 text-green-500" />, label: "Téléphone", value: "+237 6X XX XX XX" },
              { icon: <Mail className="w-4 h-4 text-amber-500" />, label: "Email", value: "contact@grandhotel.example" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                  {icon}
                </div>
                <div>
                  <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                     className="text-gray-400 mb-0.5">
                    {label}
                  </p>
                  <p style={{ ...sans, fontSize: "13px", fontWeight: 300 }} className="text-gray-700">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Carte */}
          <div className="mt-4">
            <h3 style={{ ...serif, fontWeight: 400, fontSize: "18px", letterSpacing: "0.04em" }}
                className="text-gray-900 mb-3">
              Localisation
            </h3>
            <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
              <span style={{ ...sans, fontSize: "11px", color: "#9ca3af", letterSpacing: "0.10em" }}>
                Carte (intégrer Google Maps / Leaflet côté prod)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}