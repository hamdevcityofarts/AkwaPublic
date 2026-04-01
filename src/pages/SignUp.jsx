// ══════════════════════════════════════════════════
// src/pages/SignUp.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import { User, Mail, Lock, Phone, AlertCircle, Loader, Eye, EyeOff, CheckCircle } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const fieldClass = `w-full border border-gray-200 rounded-xl px-4 py-3
  focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
  outline-none transition-all duration-200 bg-gray-50/50`;

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '', surname: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  const redirectTo = location.state?.from || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo || '/booking', {
        replace: true,
        state: { message: 'Compte créé avec succès ! Vous pouvez maintenant effectuer une réservation.' }
      });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const validateForm = () => {
    if (!form.name || !form.surname || !form.email || !form.password) { dispatch(clearError()); return false; }
    if (form.password.length < 6) { dispatch(clearError()); return false; }
    if (form.password !== form.confirmPassword) { dispatch(clearError()); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const userData = { name: form.name, surname: form.surname, email: form.email, phone: form.phone, password: form.password, role: 'client' };
      await dispatch(register(userData)).unwrap();
    } catch (err) {
      console.error('❌ Erreur inscription:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">

          {/* En-tête */}
          <div className="text-center mb-8">
            <p style={{ ...sans, fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase" }}
               className="text-amber-600/70 mb-3">
              Rejoignez-nous
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
              <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,160,51,0.55),transparent)", display: "block" }} />
              <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
            </div>
            <h1 style={{ ...serif, fontWeight: 300, fontSize: "36px", letterSpacing: "0.03em" }}
                className="text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p style={{ ...sans, fontSize: "12px", fontWeight: 300, letterSpacing: "0.04em" }}
               className="text-gray-500">
              Inscrivez-vous pour effectuer une réservation
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div style={sans} className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom / Prénom */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "name", label: "Nom", placeholder: "Doe" },
                { name: "surname", label: "Prénom", placeholder: "John" },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                         className="block text-gray-500 mb-2">
                    {label}
                  </label>
                  <input type="text" name={name} value={form[name]}
                         onChange={handleChange} required disabled={isLoading}
                         style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                         className={fieldClass} placeholder={placeholder} />
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                     className="block text-gray-500 mb-2">
                <Mail className="w-3.5 h-3.5 inline mr-1" /> Email
              </label>
              <input type="email" name="email" value={form.email}
                     onChange={handleChange} required disabled={isLoading}
                     style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                     className={fieldClass} placeholder="john.doe@example.com" />
            </div>

            {/* Téléphone */}
            <div>
              <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                     className="block text-gray-500 mb-2">
                <Phone className="w-3.5 h-3.5 inline mr-1" /> Téléphone (optionnel)
              </label>
              <input type="tel" name="phone" value={form.phone}
                     onChange={handleChange} disabled={isLoading}
                     style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                     className={fieldClass} placeholder="+237 XXX XX XX XX" />
            </div>

            {/* Mot de passe */}
            <div>
              <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                     className="block text-gray-500 mb-2">
                <Lock className="w-3.5 h-3.5 inline mr-1" /> Mot de passe
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                       onChange={handleChange} required disabled={isLoading}
                       style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                       className={fieldClass} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p style={{ ...sans, fontSize: "10px", color: "#9ca3af", marginTop: 4 }}>Au moins 6 caractères</p>
            </div>

            {/* Confirmation */}
            <div>
              <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                     className="block text-gray-500 mb-2">
                Confirmer le mot de passe
              </label>
              <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                     onChange={handleChange} required disabled={isLoading}
                     style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                     className={fieldClass} placeholder="••••••••" />
            </div>

            {/* Bouton */}
            <button type="submit" disabled={isLoading}
                    style={{
                      ...sans, fontSize: "10px", fontWeight: 600,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "#1a1208",
                      background: "linear-gradient(135deg,#e8c97a,#d4a033)",
                      padding: "13px 0", borderRadius: "32px", border: "none",
                      cursor: "pointer", width: "100%", marginTop: 8,
                      boxShadow: "0 3px 18px rgba(212,160,51,0.28)",
                      transition: "all 0.3s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      opacity: isLoading ? 0.6 : 1
                    }}>
              {isLoading ? (
                <><Loader className="w-4 h-4 animate-spin" /> Création...</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Créer mon compte</>
              )}
            </button>
          </form>

          {/* Liens */}
          <div className="mt-6 text-center">
            <p style={{ ...sans, fontSize: "11px", fontWeight: 300 }} className="text-gray-500">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" state={{ from: redirectTo }}
                    style={{ ...sans, fontSize: "11px", fontWeight: 500, color: "#2563eb" }}>
                Se connecter
              </Link>
            </p>
          </div>
          <div className="mt-3 text-center">
            <Link to="/" style={{ ...sans, fontSize: "10px", letterSpacing: "0.10em", color: "#9ca3af" }}>
              ← Retour à l'accueil
            </Link>
          </div>

          {/* Avantages */}
          <div className="mt-7 p-5 bg-gradient-to-br from-blue-50 to-amber-50/30 rounded-xl border border-gray-100">
            <h3 style={{ ...serif, fontWeight: 500, fontSize: "16px" }} className="text-gray-900 mb-3">
              Avantages du compte
            </h3>
            <ul className="space-y-1.5">
              {["Gérer vos réservations", "Historique de séjours", "Annulation en ligne (48h avant)", "Offres exclusives"].map((item) => (
                <li key={item} style={{ ...sans, fontSize: "11px", fontWeight: 300 }} className="text-gray-600 flex items-center gap-2">
                  <span className="text-amber-500 text-xs">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;