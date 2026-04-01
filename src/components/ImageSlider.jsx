// ══════════════════════════════════════════════════
// src/components/ImageSlider.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const sans = { fontFamily: "'Montserrat', sans-serif" }

const ImageSlider = ({ images = [], className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageError, setImageError] = useState({})

  const defaultImage = {
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop&auto=format',
    alt: 'Chambre d\'hôtel',
    isPrimary: true
  }

  const displayImages = images && images.length > 0 ? images : [defaultImage]

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const handleImageError = (index) => {
    console.error('❌ Erreur chargement image:', displayImages[index]?.url)
    setImageError(prev => ({ ...prev, [index]: true }))
  }

  const getCurrentImageUrl = () => {
    const currentImage = displayImages[currentIndex]
    if (imageError[currentIndex]) return defaultImage.url
    return currentImage?.url || defaultImage.url
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="w-full h-full overflow-hidden bg-gray-200">
        <img
          src={getCurrentImageUrl()}
          alt={displayImages[currentIndex]?.alt || 'Image de chambre'}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={() => handleImageError(currentIndex)}
        />
      </div>

      {displayImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2
              w-8 h-8 rounded-full bg-black/45 hover:bg-black/65
              flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-all duration-300
              border border-white/20"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2
              w-8 h-8 rounded-full bg-black/45 hover:bg-black/65
              flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-all duration-300
              border border-white/20"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          {/* Indicateurs — tirets ambrés pour actif */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {displayImages.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-400 rounded-full ${
                  index === currentIndex
                    ? 'w-5 h-1.5 bg-amber-300'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>

          {/* Compteur */}
          <div
            style={{ ...sans, fontSize: "9px", letterSpacing: "0.14em" }}
            className="absolute top-3 right-3 bg-black/50 text-white px-2.5 py-1 rounded-full"
          >
            {currentIndex + 1} / {displayImages.length}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageSlider