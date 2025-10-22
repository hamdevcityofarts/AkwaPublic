// src/components/HeroSection.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import img0 from "./ghimage.jpeg"
import img1 from "./ghImages.jpg"
import img2 from "./ghImg.jpg"

// ✅ CORRECTION : Retirer les accolades autour des images
const slides = [
  {
    id: 1,
    image: img0,  // ✅ Directement la variable
    title: "Grand Hôtel — Confort & Élégance près de l'aéroport",
    description: "Séjournez dans nos suites luxueuses, conçues pour les voyageurs exigeants."
  },
  {
    id: 2,
    image: img1,  // ✅ Directement la variable
    title: "Un Service Exceptionnel",
    description: "Notre équipe dévouée est à votre service 24h/24 pour rendre votre séjour inoubliable."
  },
  {
    id: 3,
    image: img2,  // ✅ Directement la variable
    title: "Cadre Idéal pour Voyageurs",
    description: "À quelques minutes de l'aéroport, profitez du calme et du confort absolu."
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-slide toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section className="hero-height relative overflow-hidden">
      {/* Slides */}
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
              alt={`Grand Hôtel - ${slide.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Erreur chargement image:', slide.image)
                e.target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1920&h=1080&fit=crop'
              }}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container-max relative z-10 h-full flex flex-col justify-center text-white">
        <div className="max-w-2xl glass p-6 rounded-lg transform transition-all duration-1000 ease-in-out">
          <h1 className="text-3xl md:text-4xl font-serif mb-2">
            {slides[currentSlide].title}
          </h1>
          <p className="mb-4 text-lg">
            {slides[currentSlide].description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/rooms" 
              className="px-5 py-2 rounded-full bg-white text-dark font-medium hover:bg-gray-100 transition-colors text-center"
            >
              Voir les chambres
            </Link>
            <Link 
              to="/booking" 
              className="px-5 py-2 rounded-full text-white btn-gradient shadow-soft hover:shadow-medium transition-shadow text-center"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}