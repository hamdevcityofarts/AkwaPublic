// ══════════════════════════════════════════════════
// src/pages/MyPromoCodes.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Copy, BarChart2, Calendar, Moon, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { getMyCodes } from '../services/promoCodesService';
import roomsService from '../services/roomsService';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

export default function MyPromoCodes() {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);
  const [copied, setCopied] = useState('');

  const formatPrice = (p) => roomsService.formatPrice(p);

  useEffect(() => { loadCodes(); }, []);

  const loadCodes = async () => {
    try {
      setLoading(true);
      const result = await getMyCodes();
      setCodes(result.codesPromo || []);
    } catch (err) {
      setError('Erreur lors du chargement de vos codes promo');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 2500);
  };

  const getStatusStyle = (code) => {
    const now = new Date();
    if (code.statut !== 'actif') return { label: 'Inactif', cls: 'bg-gray-100 text-gray-600' };
    if (new Date(code.dateFin) < now) return { label: 'Expiré', cls: 'bg-red-100 text-red-700' };
    if (code.utilisationActuelle >= code.utilisationMax) return { label: 'Épuisé', cls: 'bg-orange-100 text-orange-700' };
    return { label: 'Actif', cls: 'bg-green-100 text-green-700' };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border border-blue-600 border-t-transparent mb-4" />
        <p style={{ ...sans, fontSize: "12px", color: "#9ca3af" }}>Chargement de vos codes…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* En-tête */}
        <div className="mb-8">
          <button onClick={() => navigate('/profile')}
                  style={{ ...sans, fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", color: "#6b7280" }}
                  className="flex items-center gap-2 mb-5 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour au profil
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 style={{ ...serif, fontWeight: 300, fontSize: "30px", letterSpacing: "0.03em" }} className="text-gray-900">
                Mes Codes Promo
              </h1>
              <p style={{ ...sans, fontSize: "11px", fontWeight: 300 }} className="text-gray-400">
                Suivez les performances de vos codes promotionnels
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div style={sans} className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        {codes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 style={{ ...serif, fontWeight: 300, fontSize: "22px" }} className="text-gray-600 mb-2">
              Aucun code promo
            </h3>
            <p style={{ ...sans, fontSize: "12px", fontWeight: 300 }} className="text-gray-400">
              Vous n'avez pas encore de code promo attribué.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {codes.map((code) => {
              const status = getStatusStyle(code);
              const isExpanded = expandedCode === code._id;
              const stats = code.stats || {};

              return (
                <div key={code._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* Header du code */}
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">

                      {/* Code + description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 700, color: "#7c3aed", letterSpacing: "0.08em" }}>
                            {code.code}
                          </span>
                          <button onClick={() => copyCode(code.code)}
                                  className="text-gray-300 hover:text-purple-600 transition-colors"
                                  title="Copier">
                            <Copy className="w-4 h-4" />
                          </button>
                          {copied === code.code && (
                            <span style={{ ...sans, fontSize: "10px", color: "#16a34a" }}>Copié !</span>
                          )}
                          <span style={{ ...sans, fontSize: "10px", fontWeight: 600 }}
                                className={`px-2 py-0.5 rounded-full ${status.cls}`}>
                            {status.label}
                          </span>
                        </div>
                        <p style={{ ...sans, fontSize: "12px", fontWeight: 300, color: "#6b7280" }} className="mb-3">
                          {code.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <span style={{ ...sans, fontSize: "11px", color: "#9ca3af" }} className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(code.dateDebut).toLocaleDateString('fr-FR')} → {new Date(code.dateFin).toLocaleDateString('fr-FR')}
                          </span>
                          <span style={{ ...sans, fontSize: "11px", color: "#9ca3af" }}>
                            Réduction : <strong style={{ color: "#374151" }}>
                              {code.type === 'percentage' ? `${code.value}%` : `${code.value} FCFA`}
                            </strong>
                          </span>
                          <span style={{ ...sans, fontSize: "11px", color: "#9ca3af" }}>
                            Utilisations : <strong style={{ color: "#374151" }}>{code.utilisationActuelle} / {code.utilisationMax}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Stats rapides */}
                      <div className="flex gap-3 flex-shrink-0">
                        {[
                          { icon: <BarChart2 className="w-4 h-4" />, value: stats.nombreReservations || 0, label: 'Réservations', color: '#7c3aed' },
                          { icon: <Moon className="w-4 h-4" />, value: stats.totalNuits || 0, label: 'Nuitées', color: '#0ea5e9' },
                          { icon: <CreditCard className="w-4 h-4" />, value: formatPrice(stats.totalMontant || 0), label: 'Généré', color: '#16a34a', small: true },
                        ].map(({ icon, value, label, color, small }) => (
                          <div key={label} className="text-center bg-gray-50 rounded-xl px-4 py-3 min-w-[80px]">
                            <div style={{ color }} className="flex justify-center mb-1">{icon}</div>
                            <div style={{ ...serif, fontWeight: 400, fontSize: small ? "13px" : "20px", color, lineHeight: 1.1 }}>
                              {value}
                            </div>
                            <div style={{ ...sans, fontSize: "9px", color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bouton détails réservations */}
                    {(stats.nombreReservations || 0) > 0 && (
                      <button
                        onClick={() => setExpandedCode(isExpanded ? null : code._id)}
                        style={{ ...sans, fontSize: "11px", fontWeight: 500, color: "#7c3aed" }}
                        className="mt-4 flex items-center gap-1.5 hover:opacity-75 transition-opacity"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? 'Masquer' : 'Voir'} les réservations
                      </button>
                    )}
                  </div>

                  {/* Tableau réservations */}
                  {isExpanded && code.reservations?.length > 0 && (
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-purple-50">
                          <tr>
                            {['Client', 'Chambre', 'Arrivée', 'Départ', 'Nuits', 'Montant', 'Statut'].map(h => (
                              <th key={h} style={{ ...sans, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#7c3aed" }}
                                  className="px-5 py-3 text-left font-medium">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {code.reservations.map((res) => (
                            <tr key={res._id} className="hover:bg-gray-50">
                              <td style={{ ...sans, fontSize: "12px", fontWeight: 300, color: "#374151" }} className="px-5 py-3">
                                {res.client
                                  ? `${res.client.name} ${res.client.surname}`
                                  : `${res.clientInfo?.name || ''} ${res.clientInfo?.surname || ''}`}
                              </td>
                              <td style={{ ...sans, fontSize: "12px", color: "#6b7280" }} className="px-5 py-3">
                                {res.chambre?.name || '—'}
                              </td>
                              <td style={{ ...sans, fontSize: "12px", color: "#6b7280" }} className="px-5 py-3">
                                {new Date(res.checkIn).toLocaleDateString('fr-FR')}
                              </td>
                              <td style={{ ...sans, fontSize: "12px", color: "#6b7280" }} className="px-5 py-3">
                                {new Date(res.checkOut).toLocaleDateString('fr-FR')}
                              </td>
                              <td style={{ ...sans, fontSize: "12px", fontWeight: 500, color: "#374151" }} className="px-5 py-3">
                                {res.nights}
                              </td>
                              <td style={{ ...serif, fontSize: "14px", color: "#2563eb" }} className="px-5 py-3">
                                {formatPrice(res.totalAmount)}
                              </td>
                              <td className="px-5 py-3">
                                <span style={{ ...sans, fontSize: "10px", fontWeight: 500 }}
                                      className={`px-2.5 py-1 rounded-full ${
                                        res.status === 'confirmed' || res.status === 'completed'
                                          ? 'bg-green-100 text-green-700'
                                          : res.status === 'partially_paid' || res.status === 'pending_payment'
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-gray-100 text-gray-500'
                                      }`}>
                                  {res.status === 'confirmed' ? 'Confirmée'
                                    : res.status === 'completed' ? 'Terminée'
                                    : res.status === 'partially_paid' ? 'Partiel'
                                    : res.status === 'pending_payment' ? 'En attente'
                                    : res.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}