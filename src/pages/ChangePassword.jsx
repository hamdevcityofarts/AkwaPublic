// ══════════════════════════════════════════════════
// src/pages/ChangePassword.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../store/slices/authSlice';
import { Lock, Eye, EyeOff, ArrowLeft, Loader, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const fieldClass = `w-full border border-gray-200 rounded-xl px-4 py-3 pr-10
  focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
  outline-none transition-all duration-200 bg-gray-50/50`;

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError(''); setSuccessMessage('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const validateForm = () => {
    if (!form.currentPassword) { setLocalError('Le mot de passe actuel est obligatoire'); return false; }
    if (!form.newPassword) { setLocalError('Le nouveau mot de passe est obligatoire'); return false; }
    if (form.newPassword.length < 6) { setLocalError('Le nouveau mot de passe doit contenir au moins 6 caractères'); return false; }
    if (form.newPassword !== form.confirmPassword) { setLocalError('Les mots de passe ne correspondent pas'); return false; }
    if (form.currentPassword === form.newPassword) { setLocalError('Le nouveau mot de passe doit être différent de l\'actuel'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await dispatch(changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })).unwrap();
      setSuccessMessage('Mot de passe modifié avec succès !');
      setLocalError('');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setLocalError(err || 'Erreur lors du changement de mot de passe');
      setSuccessMessage('');
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    const strengths = [
      { label: 'Très faible', color: 'bg-red-500' },
      { label: 'Faible', color: 'bg-orange-500' },
      { label: 'Moyen', color: 'bg-yellow-500' },
      { label: 'Fort', color: 'bg-green-500' },
      { label: 'Très fort', color: 'bg-green-600' }
    ];
    return { ...strengths[Math.min(strength, 4)], strength };
  };

  const passwordStrength = getPasswordStrength(form.newPassword);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 style={{ ...serif, fontWeight: 300, fontSize: "28px" }} className="text-gray-900 mb-4">Accès non autorisé</h2>
          <p style={{ ...sans, fontSize: "13px", fontWeight: 300 }} className="text-gray-500 mb-6">Veuillez vous connecter pour changer votre mot de passe.</p>
          <button onClick={() => navigate('/login')}
                  style={{ ...sans, fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1208", background: "linear-gradient(135deg,#e8c97a,#d4a033)", padding: "11px 24px", borderRadius: "32px", border: "none", cursor: "pointer" }}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">

        {/* En-tête */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)}
                  style={{ ...sans, fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em" }}
                  className="flex items-center text-gray-500 hover:text-gray-800 mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 style={{ ...serif, fontWeight: 300, fontSize: "30px", letterSpacing: "0.03em" }}
                  className="text-gray-900">
                Changer le mot de passe
              </h1>
              <p style={{ ...sans, fontSize: "11px", fontWeight: 300, letterSpacing: "0.06em" }}
                 className="text-gray-400">
                Sécurisez votre compte
              </p>
            </div>
          </div>
        </div>

        {/* Alertes */}
        {successMessage && (
          <div style={sans} className="mb-5 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl flex items-center text-xs">
            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {successMessage}
          </div>
        )}
        {(error || localError) && (
          <div style={sans} className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error || localError}
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Mot de passe actuel */}
              <div>
                <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                       className="block text-gray-500 mb-2">
                  <Lock className="w-3.5 h-3.5 inline mr-1" /> Mot de passe actuel
                </label>
                <div className="relative">
                  <input type={showPasswords.current ? 'text' : 'password'} name="currentPassword"
                         value={form.currentPassword} onChange={handleChange} required
                         style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                         className={fieldClass} placeholder="Votre mot de passe actuel" />
                  <button type="button" onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                       className="block text-gray-500 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input type={showPasswords.new ? 'text' : 'password'} name="newPassword"
                         value={form.newPassword} onChange={handleChange} required
                         style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                         className={fieldClass} placeholder="Au moins 6 caractères" />
                  <button type="button" onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Force du mot de passe */}
                {form.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span style={{ ...sans, fontSize: "9px", color: "#9ca3af", letterSpacing: "0.10em" }}>Force du mot de passe</span>
                      <span style={{ ...sans, fontSize: "9px", letterSpacing: "0.10em" }}
                            className={passwordStrength.color.replace('bg-', 'text-')}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                           style={{ width: `${(passwordStrength.strength + 1) * 20}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation */}
              <div>
                <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                       className="block text-gray-500 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input type={showPasswords.confirm ? 'text' : 'password'} name="confirmPassword"
                         value={form.confirmPassword} onChange={handleChange} required
                         style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                         className={fieldClass} placeholder="Confirmez votre nouveau mot de passe" />
                  <button type="button" onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {form.confirmPassword && (
                  <div className="mt-1">
                    {form.newPassword === form.confirmPassword ? (
                      <span style={{ ...sans, fontSize: "10px" }} className="text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Les mots de passe correspondent
                      </span>
                    ) : (
                      <span style={{ ...sans, fontSize: "10px" }} className="text-red-500 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> Les mots de passe ne correspondent pas
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Recommandations */}
              <div className="bg-gradient-to-br from-blue-50 to-amber-50/30 rounded-xl p-4 border border-gray-100">
                <h4 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-2">
                  Recommandations de sécurité
                </h4>
                <ul className="space-y-1">
                  {["Utilisez au moins 8 caractères", "Combinez lettres, chiffres et caractères spéciaux", "Évitez les mots de passe courants", "Ne réutilisez pas d'anciens mots de passe"].map((item) => (
                    <li key={item} style={{ ...sans, fontSize: "10px", fontWeight: 300, color: "#6b7280" }}
                        className="flex items-center gap-1.5">
                      <span className="text-amber-500">·</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => navigate(-1)}
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
                    <><Loader className="w-4 h-4 animate-spin" /> Modification...</>
                  ) : (
                    <><Shield className="w-4 h-4" /> Changer le mot de passe</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lien profil */}
        <div className="mt-5 text-center">
          <button onClick={() => navigate('/profile')}
                  style={{ ...sans, fontSize: "10px", letterSpacing: "0.10em", color: "#9ca3af" }}>
            ← Retour à mon profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;