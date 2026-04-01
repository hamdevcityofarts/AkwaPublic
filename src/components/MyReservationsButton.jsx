// ══════════════════════════════════════════════════
// src/components/MyReservationsButton.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
 
export default function MyReservationsButton() {
  const { isAuthenticated } = useSelector((state) => state.auth)
 
  return (
    <Link
      to="/my-reservations"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "10px", fontWeight: 500,
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.75)",
        border: "1px solid rgba(255,255,255,0.25)",
        padding: "8px 18px", borderRadius: "32px",
        display: "inline-flex", alignItems: "center", gap: 7,
        transition: "all 0.3s", textDecoration: "none",
        marginLeft: 16
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      Mes Réservations
    </Link>
  )
}
 