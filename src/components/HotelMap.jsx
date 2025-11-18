// src/components/HotelMap.jsx
import React from 'react';

const HotelMap = () => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.929722399566!2d9.732157875022864!3d4.034764295938973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10610d689c12c44f%3A0x1891439c1bb63d7a!2sGrand%20h%C3%B4tel%20luxe!5e0!3m2!1sfr!2scm!4v1763464201823!5m2!1sfr!2scm" 
        width="100%" 
        height="100%" 
        style={{ border: 0, minHeight: '450px' }}
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Localisation exacte du Grand Hôtel Luxe - Douala"
        className="rounded-xl"
      />
    </div>
  );
};

export default HotelMap;