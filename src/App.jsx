// src/App.jsx (MODIFIÉ)
import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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
import UserProfile from './pages/UserProfile' // ✅ NOUVEAU
import ChangePassword from './pages/ChangePassword' // ✅ NOUVEAU

export default function App() {
  const auth = useSelector((state) => state.auth)

  // ✅ CONSOLE LOG POUR SURVEILLER L'ÉTAT D'AUTHENTIFICATION
 /*useEffect(() => {
    console.log('🔐 ===== ÉTAT AUTHENTIFICATION =====');
    console.log('✅ Authentifié:', auth.isAuthenticated);
    console.log('👤 Utilisateur:', auth.user);
    console.log('🔄 Chargement en cours:', auth.isLoading);
    console.log('❌ Erreur:', auth.error);
    console.log('🔑 Token présent:', !!auth.token);
    
    if (auth.isAuthenticated && auth.user) {
      console.log('🎉 ===== INFOS UTILISATEUR CONNECTÉ =====');
      console.log('📛 Nom complet:', `${auth.user.name} ${auth.user.surname}`);
      console.log('📧 Email:', auth.user.email);
      console.log('📞 Téléphone:', auth.user.phone);
      console.log('🎯 Rôle:', auth.user.role);
      console.log('🏷️ ID:', auth.user.id);
      console.log('📅 Membre depuis:', auth.user.memberSince);
      console.log('🔑 Permissions:', auth.user.permissions);
    } else {
      console.log('🚫 Aucun utilisateur connecté');
    }
    console.log('=====================================');
  }, [auth])

  // ✅ AFFICHAGE DANS L'INTERFACE POUR LE DÉVELOPPEMENT
  const renderAuthDebug = () => {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="font-bold mb-1">🔐 État Auth (Dev)</div>
          <div className={`mb-1 ${auth.isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
            {auth.isAuthenticated ? '✅ Connecté' : '❌ Déconnecté'}
          </div>
          {auth.user && (
            <>
              <div>👤: {auth.user.name} {auth.user.surname}</div>
              <div>📧: {auth.user.email}</div>
              <div>🎯: {auth.user.role}</div>
            </>
          )}
        </div>
      )
    }
    return null
  }*/

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ AFFICHAGE DEBUG DANS L'INTERFACE */}
      {/*renderAuthDebug()*/}
      
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
          
          {/* ✅ ROUTES AUTHENTIFICATION */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* ✅ NOUVELLES ROUTES GESTION DE COMPTE */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          
          {/* ✅ ROUTES PAIEMENT */}
          <Route path="/payment/result" element={<PaymentResult />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}