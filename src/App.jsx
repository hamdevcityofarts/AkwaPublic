// src/App.jsx (VERSION COMPLÈTE AVEC ROUTES PROTÉGÉES)
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetailsPage from './pages/RoomDetailsPage'
import Booking from './pages/Booking'
import About from './pages/About'
import Contact from './pages/Contact'
import MyReservations from './pages/MyReservations'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import PaymentResult from './pages/PaymentResult'
import PaymentCancel from './pages/PaymentCancel'
import UserProfile from './pages/UserProfile'
import ChangePassword from './pages/ChangePassword'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/payment/result" element={<PaymentResult />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          
          {/* Routes protégées */}
          <Route 
            path="/booking" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-reservations" 
            element={
              <ProtectedRoute>
                <MyReservations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}