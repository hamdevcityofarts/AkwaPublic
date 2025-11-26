import React from "react";

export default function Contact() {
  const [msg, setMsg] = React.useState({ name: "", email: "", message: "" });
  const handleChange = (e) =>
    setMsg({ ...msg, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message envoyé (simulation)");
  };

  return (
    <div className="container-max py-12">
      <h1 className="section-title">Contact</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-soft"
        >
          <div className="mb-4">
            <label className="block text-sm mb-1">Nom</label>
            <input
              name="name"
              value={msg.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              value={msg.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Message</label>
            <textarea
              name="message"
              value={msg.message}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded px-3 py-2"
            ></textarea>
          </div>
          <button className="px-5 py-2 rounded-full text-white btn-gradient">
            Envoyer
          </button>
        </form>

        <div className="p-6 bg-gh-pearl rounded-lg">
          <h4 className="font-semibold mb-2">Nos coordonnées</h4>
          <p className="text-sm text-gray-700">
            Adresse: À proximité de l'aéroport international
          </p>
          <p className="text-sm text-gray-700">Tel: +237 6X XX XX XX</p>
          <p className="text-sm text-gray-700">
            Email: contact@grandhotel.example
          </p>

          <div className="mt-4">
            <h5 className="font-semibold mb-2">Localisation</h5>
            <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
              Carte (intégrer Google Maps / Leaflet côté prod)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}