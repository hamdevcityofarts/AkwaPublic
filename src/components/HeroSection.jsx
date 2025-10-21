import React from 'react'
import { Link } from 'react-router-dom'


export default function HeroSection(){
return (
<section className="hero-height relative bg-cover bg-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1501117716987-c8e2f0f8b4d1?auto=format&fit=crop&w=1600&q=60')`}}>
<div className="absolute inset-0 bg-black/40"></div>
<div className="container-max relative z-10 h-full flex flex-col justify-center text-white">
<div className="max-w-2xl glass p-6 rounded-lg">
<h1 className="text-3xl md:text-4xl font-serif mb-2">Grand Hôtel — Confort & Élégance près de l'aéroport</h1>
<p className="mb-4">Séjournez dans nos suites luxueuses, conçues pour les voyageurs exigeants.</p>
<div className="flex gap-3">
<Link to="/rooms" className="px-5 py-2 rounded-full bg-white text-dark font-medium">Voir les chambres</Link>
<Link to="/booking" className="px-5 py-2 rounded-full text-white btn-gradient shadow-soft">Réserver maintenant</Link>
</div>
</div>
</div>
</section>
)
}