// src/App.jsx (VERSION MISE À JOUR AVEC SECURE ACCEPTANCE)
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetailsPage from './pages/RoomDetailsPage'
import Booking from './pages/Booking'
import About from './pages/About'
import Contact from './pages/Contact'
import MyReservations from './pages/MyReservations'

// ✅ IMPORTS POUR SECURE ACCEPTANCE
import PaymentResult from './pages/PaymentResult' // ✅ NOUVEAU
import PaymentCancel from './pages/PaymentCancel'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Routes existantes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          
          {/* ✅ ROUTES SECURE ACCEPTANCE CORRIGÉES */}
          <Route path="/payment/result" element={<PaymentResult />} /> {/* ✅ CHANGÉ */}
          <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}