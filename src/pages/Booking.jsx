import React from "react";

export default function Booking() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    checkin: "",
    checkout: "",
    guests: 1,
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // in real app: validate, calculate total, redirect to payment (Cybersource integration on backend)
    alert("Simulation: continuer vers paiement (intégration backend requise)");
  };

  return (
    <div className="container-max py-12">
      <h1 className="section-title">Réserver une chambre</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white p-6 rounded-lg shadow-soft"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Nom complet</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Arrivée</label>
            <input
              name="checkin"
              value={form.checkin}
              onChange={handleChange}
              type="date"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Départ</label>
            <input
              name="checkout"
              value={form.checkout}
              onChange={handleChange}
              type="date"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Personnes</label>
            <input
              name="guests"
              value={form.guests}
              onChange={handleChange}
              type="number"
              min={1}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            className="px-5 py-2 rounded-full text-white btn-gradient"
            type="submit"
          >
            Continuer vers le paiement
          </button>
          <div className="text-sm text-gray-600">
            Le paiement sécurisé pour l'acompte (1ère nuitée) se fera via
            Cybersource (intégration backend requise).
          </div>
        </div>
      </form>
    </div>
  );
}
