// ══════════════════════════════════════════════════
// src/pages/Login.jsx — LUXE HÔTELIÈRE
// ══════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'Montserrat', sans-serif" };

const fieldClass = `w-full border border-gray-200 rounded-xl px-4 py-3
  focus:ring-2 focus:ring-amber-300/40 focus:border-amber-400
  outline-none transition-all duration-200 bg-gray-50/50`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const redirectTo = location.state?.from || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
    } catch (err) {
      console.error('❌ Erreur connexion:', err);
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
              Votre espace
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
              <span style={{ width: 24, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,160,51,0.55),transparent)", display: "block" }} />
              <span style={{ color: "rgba(212,169,106,0.5)", fontSize: "10px" }}>·</span>
            </div>
            <h1 style={{ ...serif, fontWeight: 300, fontSize: "36px", letterSpacing: "0.03em" }}
                className="text-gray-900 mb-2">
              Connexion
            </h1>
            <p style={{ ...sans, fontSize: "12px", fontWeight: 300, letterSpacing: "0.04em" }}
               className="text-gray-500">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div style={sans} className="mb-5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center text-xs">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {location.state?.message && (
            <div style={{ ...sans, fontSize: "12px" }} className="mb-5 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-xl">
              {location.state.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                     className="block text-gray-500 mb-2">
                <Mail className="w-3.5 h-3.5 inline mr-1" />
                Email
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required disabled={isLoading}
                style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                className={fieldClass}
                placeholder="votre@email.com"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label style={{ ...sans, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}
                     className="block text-gray-500 mb-2">
                <Lock className="w-3.5 h-3.5 inline mr-1" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} required disabled={isLoading}
                  style={{ ...sans, fontSize: "13px", fontWeight: 300 }}
                  className={fieldClass}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bouton */}
            <button type="submit" disabled={isLoading}
                    style={{
                      ...sans, fontSize: "10px", fontWeight: 600,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "#1a1208",
                      background: "linear-gradient(135deg,#e8c97a,#d4a033)",
                      padding: "13px 0", borderRadius: "32px", border: "none",
                      cursor: "pointer", width: "100%",
                      boxShadow: "0 3px 18px rgba(212,160,51,0.28)",
                      transition: "all 0.3s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      opacity: isLoading ? 0.6 : 1
                    }}>
              {isLoading ? (
                <><Loader className="w-4 h-4 animate-spin" /> Connexion...</>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Liens */}
          <div className="mt-6 text-center">
            <p style={{ ...sans, fontSize: "11px", fontWeight: 300 }} className="text-gray-500">
              Pas encore de compte ?{' '}
              <Link to="/signup" state={{ from: redirectTo }}
                    style={{ ...sans, fontSize: "11px", fontWeight: 500, color: "#2563eb" }}>
                Créer un compte
              </Link>
            </p>
          </div>
          <div className="mt-3 text-center">
            <Link to="/"
                  style={{ ...sans, fontSize: "10px", letterSpacing: "0.10em", color: "#9ca3af" }}>
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;