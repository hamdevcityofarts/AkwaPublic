// ══════════════════════════════════════════════════
// src/pages/UserProfile.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, clearError } from '../store/slices/authSlice';
import { User, Mail, Phone, Save, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const fieldClass = `w-full border border-gray-200 rounded-xl px-4 py-3
  focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
  outline-none transition-all duration-200 bg-gray-50/50`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPromoCodes, setHasPromoCodes] = useState(false);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  useEffect(() => {
    if (user && !isInitialized) {
      setForm({ name: user.name || '', surname: user.surname || '', email: user.email || '', phone: user.phone || '' });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  useEffect(() => {
    // Vérifier si l'utilisateur a des codes promo
    const checkPromoCodes = async () => {
      try {
        const result = await import('../services/promoCodesService')
          .then(m => m.getMyCodes());
        setHasPromoCodes((result.codesPromo || []).length > 0);
      } catch { /* silencieux */ }
    };
    if (user) checkPromoCodes();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (localError) setLocalError('');
  };

  const validateForm = () => {
    if (!form.name.trim()) { setLocalError('Le nom est obligatoire'); return false; }
    if (!form.email.trim()) { setLocalError('L\'email est obligatoire'); return false; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setLocalError('L\'email n\'est pas valide'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      dispatch(clearError()); setLocalError('');
      await dispatch(updateProfile(form)).unwrap();
      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setLocalError(err || 'Erreur lors de la mise à jour du profil');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300 }} className="text-gray-500">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  const secondaryActions = [
    {
      onClick: () => navigate('/change-password'),
      iconBg: "bg-amber-100",
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Changer le mot de passe",
      sub: "Mettez à jour votre mot de passe"
    },
    {
      onClick: () => navigate('/my-reservations'),
      iconBg: "bg-green-100",
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "Mes réservations",
      sub: "Consultez votre historique"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* En-tête */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} disabled={isLoading}
                  style={{ ...sans, fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em" }}
                  className="flex items-center text-gray-500 hover:text-gray-800 mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 style={{ ...serif, fontWeight: 300, fontSize: "30px", letterSpacing: "0.03em" }}
                  className="text-gray-900">
                Mon Profil
              </h1>
              <p style={{ ...sans, fontSize: "11px", fontWeight: 300, letterSpacing: "0.06em" }}
                 className="text-gray-400">
                Gérez vos informations personnelles
              </p>
            </div>
          </div>
        </div>

        {/* Alertes */}
        {successMessage && (
          <div style={sans} className="mb-5 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl flex items-center text-xs">
            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {successMessage}
          </div>
        )}
        {(error || localError) && (
          <div style={sans} className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {error || localError}
          </div>
        )}

        {/* Carte */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Infos personnelles */}
              <div>
                <h3 style={{ ...serif, fontWeight: 500, fontSize: "19px", letterSpacing: "0.04em" }}
                    className="text-gray-900 mb-1">
                  Informations personnelles
                </h3>
                <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 16 }} />

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "name", label: "Nom", placeholder: "Votre nom" },
                    { name: "surname", label: "Prénom", placeholder: "Votre prénom" },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                             className="block text-gray-500 mb-2">
                        {label} {name === "name" && "*"}
                      </label>
                      <input type="text" name={name} value={form[name]}
                             onChange={handleChange} required={name === "name"} disabled={isLoading}
                             style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                             className={fieldClass} placeholder={placeholder} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordonnées */}
              <div>
                <h3 style={{ ...serif, fontWeight: 500, fontSize: "19px", letterSpacing: "0.04em" }}
                    className="text-gray-900 mb-1">
                  Coordonnées
                </h3>
                <div style={{ width: 18, height: 1, background: "rgba(212,160,51,0.45)", marginBottom: 16 }} />

                <div className="space-y-4">
                  <div>
                    <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                           className="block text-gray-500 mb-2">
                      <Mail className="w-3.5 h-3.5 inline mr-1" /> Email *
                    </label>
                    <input type="email" name="email" value={form.email}
                           onChange={handleChange} required disabled={isLoading}
                           style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                           className={fieldClass} placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                           className="block text-gray-500 mb-2">
                      <Phone className="w-3.5 h-3.5 inline mr-1" /> Téléphone
                    </label>
                    <input type="tel" name="phone" value={form.phone}
                           onChange={handleChange} disabled={isLoading}
                           style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                           className={fieldClass} placeholder="+237 XXX XX XX XX" />
                  </div>
                </div>
              </div>

              {/* Infos non modifiables */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-5 border border-gray-100">
                <h4 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-3">
                  Informations du compte
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { label: "Rôle", value: user.role || 'Non spécifié', badge: true, color: "bg-blue-100 text-blue-800" },
                    { label: "Membre depuis", value: user.memberSince ? new Date(user.memberSince).toLocaleDateString('fr-FR') : 'Non spécifié' },
                    { label: "Statut", value: user.status || 'Actif', badge: true, color: "bg-green-100 text-green-800" },
                    ...(user.lastLogin ? [{ label: "Dernière connexion", value: new Date(user.lastLogin).toLocaleDateString('fr-FR') }] : []),
                  ].map(({ label, value, badge, color }) => (
                    <div key={label} style={{ ...sans, fontSize: "11px" }} className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">{label} :</span>
                      {badge ? (
                        <span style={{ fontSize: "9px", letterSpacing: "0.10em", textTransform: "uppercase" }}
                              className={`px-2 py-0.5 rounded-full capitalize ${color}`}>
                          {value}
                        </span>
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => navigate(-1)} disabled={isLoading}
                        style={{ ...sans, fontSize: "10px", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase" }}
                        className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={isLoading}
                        style={{
                          ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
                          color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)",
                          padding: "10px 20px", borderRadius: "14px", border: "none", cursor: "pointer", flex: 1,
                          boxShadow: "0 2px 12px rgba(212,160,51,0.24)", transition: "all 0.3s",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          opacity: isLoading ? 0.6 : 1
                        }}>
                  {isLoading ? (
                    <><Loader className="w-4 h-4 animate-spin" /> Mise à jour...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Enregistrer les modifications</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Actions secondaires */}
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          {secondaryActions.map(({ onClick, iconBg, icon, title, sub }) => (
            <button key={title} onClick={onClick} disabled={isLoading}
                    className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-amber-300/50 transition-colors text-left shadow-sm group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  {icon}
                </div>
                <div>
                  <h3 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900">{title}</h3>
                  <p style={{ ...sans, fontSize: "11px", fontWeight: 300 }} className="text-gray-400">{sub}</p>
                </div>
              </div>
            </button>
          ))}
          {hasPromoCodes && (
            <button
              onClick={() => navigate('/my-promo-codes')}
              disabled={isLoading}
              className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-purple-300/50 transition-colors text-left shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 10V5a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900">Mes codes promo</h3>
                  <p style={{ ...sans, fontSize: "11px", fontWeight: 300 }} className="text-gray-400">Suivez vos performances</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;