// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../store/slices/authSlice';
import { Lock, Eye, EyeOff, ArrowLeft, Loader, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setLocalError('');
    setSuccessMessage('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const validateForm = () => {
    if (!form.currentPassword) {
      setLocalError('Le mot de passe actuel est obligatoire');
      return false;
    }
    if (!form.newPassword) {
      setLocalError('Le nouveau mot de passe est obligatoire');
      return false;
    }
    if (form.newPassword.length < 6) {
      setLocalError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (form.currentPassword === form.newPassword) {
      setLocalError('Le nouveau mot de passe doit être différent de l\'actuel');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })).unwrap();
      
      setSuccessMessage('Mot de passe modifié avec succès !');
      setLocalError('');
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Effacer le message de succès après 5 secondes
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

    return strengths[Math.min(strength, 4)];
  };

  const passwordStrength = getPasswordStrength(form.newPassword);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour changer votre mot de passe.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Changer le mot de passe</h1>
              <p className="text-gray-600">Sécurisez votre compte</p>
            </div>
          </div>
        </div>

        {/* Messages d'alerte */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {(error || localError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error || localError}</span>
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Mot de passe actuel *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                    placeholder="Au moins 6 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Indicateur de force du mot de passe */}
                {form.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Force du mot de passe :</span>
                      <span className={passwordStrength.color.replace('bg-', 'text-')}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength + 1) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation du mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Indicateur de correspondance */}
                {form.confirmPassword && (
                  <div className="mt-1">
                    {form.newPassword === form.confirmPassword ? (
                      <span className="text-green-600 text-xs flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Les mots de passe correspondent
                      </span>
                    ) : (
                      <span className="text-red-600 text-xs flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Les mots de passe ne correspondent pas
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Recommandations de sécurité */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 text-sm">Recommandations de sécurité</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Utilisez au moins 8 caractères</li>
                  <li>• Combinez lettres, chiffres et caractères spéciaux</li>
                  <li>• Évitez les mots de passe courants</li>
                  <li>• Ne réutilisez pas d'anciens mots de passe</li>
                </ul>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Modification...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Changer le mot de passe
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lien vers le profil */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Retour à mon profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;