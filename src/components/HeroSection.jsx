// src/components/HeroSection.jsx — VERSION LUXE HÔTELIÈRE
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import img0 from "./ghimage.JPG"
import img1 from "./ghImages.jpeg"
import img2 from "./ghImg.JPG"

const slides = [
  {
    id: 1,
    image: img0,
    eyebrow: "Bienvenue au Grand Hôtel",
    title: "Confort & Élégance",
    titleItalic: "pour vous acceuillir !",
    description: " Notre équipe dévouée est à votre service 24h/24 pour rendre votre séjour inoubliable."
  },
  {
    id: 2,
    image: img1,
    eyebrow: "Notre engagement",
    title: "Un Cadre",
    titleItalic: "Exceptionnel",
    description: "En Plein Coeur d'Akwa le centre des Affaires de Douala."
  },
  {
    id: 3,
    image: img2,
    eyebrow: "Situation idéale",
    title: "Cadre Idéal",
    titleItalic: "pour Voyageurs",
    description: "À quelques minutes de l'aéroport, profitez du calme et du confort absolu."
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const changeSlide = (index) => {
    if (transitioning || index === currentSlide) return
    setTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setTransitioning(false), 700)
  }

  const nextSlide = () => changeSlide((currentSlide + 1) % slides.length)
  const prevSlide = () => changeSlide((currentSlide - 1 + slides.length) % slides.length)

  return (
    <section className="hero-height relative overflow-hidden">
      {/* ── Slides images ── */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={`Grand Hôtel — ${slide.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1920&h=1080&fit=crop'
              }}
            />
            {/* Dégradé sombre bas pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/15" />
          </div>
        ))}
      </div>

      {/* ── Flèche gauche ── */}
      <button
        onClick={prevSlide}
        aria-label="Slide précédent"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 rounded-full
          bg-white/10 hover:bg-white/22 border border-white/22 hover:border-white/40
          backdrop-blur-sm flex items-center justify-center
          transition-all duration-300 group"
      >
        <ChevronLeft className="w-4 h-4 text-white/80 group-hover:text-white" />
      </button>

      {/* ── Flèche droite ── */}
      <button
        onClick={nextSlide}
        aria-label="Slide suivant"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 rounded-full
          bg-white/10 hover:bg-white/22 border border-white/22 hover:border-white/40
          backdrop-blur-sm flex items-center justify-center
          transition-all duration-300 group"
      >
        <ChevronRight className="w-4 h-4 text-white/80 group-hover:text-white" />
      </button>

      {/* ── Indicateurs ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            aria-label={`Aller au slide ${index + 1}`}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide
                ? 'w-7 h-1.5 bg-amber-300'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/65'
            }`}
          />
        ))}
      </div>

      {/* ── Numéro slide ── */}
      <div
        className="absolute bottom-8 right-7 z-20"
        style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.16em", color: "rgba(255,255,255,0.40)" }}
      >
        {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* ── Trait vertical décoratif gauche ── */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-300/20 to-transparent z-10 pointer-events-none" />

      {/* ── Contenu slide ── */}
      <div className="container-max relative z-10 h-full flex flex-col justify-end pb-24 md:pb-20">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <p
            key={`eyebrow-${currentSlide}`}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(212,169,106,0.80)",
              animation: "fadeSlideUp 0.6s ease both"
            }}
            className="mb-3"
          >
            {slides[currentSlide].eyebrow}
          </p>

          {/* Séparateur doré */}
          <div className="flex items-center gap-3 mb-4">
            <span style={{ color: "rgba(212,169,106,0.45)", fontSize: "10px" }}>·</span>
            <span style={{ width: 28, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,160,51,0.6), transparent)", display: "block" }} />
            <span style={{ color: "rgba(212,169,106,0.45)", fontSize: "10px" }}>·</span>
          </div>

          {/* Titre principal */}
          <h1
            key={`title-${currentSlide}`}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              letterSpacing: "0.03em",
              lineHeight: 1.1,
              animation: "fadeSlideUp 0.7s 0.1s ease both"
            }}
            className="text-4xl md:text-6xl text-white mb-1"
          >
            {slides[currentSlide].title}
          </h1>
          <h1
            key={`titleI-${currentSlide}`}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.03em",
              lineHeight: 1.1,
              color: "rgba(255,255,255,0.82)",
              animation: "fadeSlideUp 0.7s 0.18s ease both"
            }}
            className="text-4xl md:text-6xl mb-5"
          >
            {slides[currentSlide].titleItalic}
          </h1>

          {/* Description */}
          <p
            key={`desc-${currentSlide}`}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.68)",
              animation: "fadeSlideUp 0.7s 0.25s ease both"
            }}
            className="mb-8 max-w-sm leading-relaxed"
          >
            {slides[currentSlide].description}
          </p>

          {/* CTA Buttons */}
          <div
            key={`cta-${currentSlide}`}
            style={{ animation: "fadeSlideUp 0.7s 0.32s ease both" }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {/* Bouton doré principal */}
            <Link
              to="/rooms"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#1a1208",
                background: "linear-gradient(135deg, #e8c97a, #d4a033)",
                padding: "12px 26px",
                borderRadius: "32px",
                boxShadow: "0 3px 18px rgba(212,160,51,0.30)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s",
                textDecoration: "none"
              }}
            >
              Voir les chambres
            </Link>

            {/* Bouton contour blanc */}
            <Link
              to="/booking"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "10px",
                fontWeight: 400,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.80)",
                border: "1px solid rgba(255,255,255,0.30)",
                padding: "12px 26px",
                borderRadius: "32px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s",
                textDecoration: "none"
              }}
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
      </div>

      {/* ── Keyframes animation ── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}