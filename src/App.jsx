// src/App.jsx (MODIFIÉ)
import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetailsPage from './pages/RoomDetailsPage'
import Booking from './pages/Booking'
import About from './pages/About'
import Contact from './pages/Contact'
import MyReservations from './pages/MyReservations'
import { autoRegisterWithReservation } from './store/slices/authSlice'

export default function App() {
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-reservations" element={<MyReservations />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}