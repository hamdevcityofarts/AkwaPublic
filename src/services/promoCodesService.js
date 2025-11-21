// public/src/services/promoCodesService.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ✅ RÉCUPÉRER TOUS LES CODES PROMO (ADMIN)
export const getCodesPromo = async () => {
  try {
    console.log('🔄 Récupération des codes promo (ADMIN)...');
    const response = await fetch(`${API_BASE}/codepromo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Codes promo récupérés:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur récupération codes promo:', error);
    throw error;
  }
};

// ✅ VÉRIFIER UN CODE PROMO (PUBLIC) - MODIFIÉ POUR INCLURE LES DATES
export const verifyCodePromo = async (code, chambreId, nights = 1, checkin = null, checkout = null) => {
  try {
    console.log('🔍 Vérification code promo:', { code, chambreId, nights, checkin, checkout });
    
    const requestBody = {
      code: code.toUpperCase(),
      chambreId,
      nights: parseInt(nights)
    };

    // ✅ AJOUT : Inclure les dates si fournies
    if (checkin && checkout) {
      requestBody.checkin = checkin;
      requestBody.checkout = checkout;
    }

    const response = await fetch(`${API_BASE}/codepromo/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (!response.ok) {
      console.warn('⚠️ Code promo invalide:', result.message);
      return { success: false, message: result.message };
    }

    console.log('✅ Code promo valide:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur vérification code promo:', error);
    return {
      success: false,
      message: 'Erreur lors de la vérification du code promo'
    };
  }
};

// ✅ OBTENIR LES STATISTIQUES (PUBLIC)
export const getPromoCodeStats = async () => {
  try {
    console.log('📊 Récupération statistiques codes promo...');
    const response = await fetch(`${API_BASE}/codepromo/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Stats récupérées:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur récupération stats:', error);
    throw error;
  }
};

// ✅ OBTENIR LES PROMOS ACTIVES (PUBLIC)
export const getActivePromos = async () => {
  try {
    console.log('🔥 Récupération promos actives...');
    const response = await fetch(`${API_BASE}/codepromo/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Promos actives:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur récupération promos actives:', error);
    throw error;
  }
};

// ✅ OBTENIR LES PROMOS POUR UNE CHAMBRE (PUBLIC)
export const getRoomPromos = async (roomId) => {
  try {
    console.log(`🏨 Récupération promos pour chambre ${roomId}...`);
    
    const response = await fetch(`${API_BASE}/codepromo/room/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn(`⚠️ Pas de promos pour cette chambre (${response.status})`);
      return { success: false, availablePromos: [] };
    }

    const result = await response.json();
    console.log(`✅ Promos trouvées pour ${roomId}:`, result.availablePromos?.length || 0);
    return result;
  } catch (error) {
    console.error(`❌ Erreur récupération promos chambre ${roomId}:`, error);
    return { success: false, availablePromos: [] };
  }
};

// ✅ MÉTHODES UTILITAIRES
export const calculateDiscount = (originalPrice, discountType, discountValue) => {
  if (!originalPrice || !discountValue) return 0;

  const price = parseFloat(originalPrice);
  const value = parseFloat(discountValue);

  if (discountType === 'percentage') {
    const percentage = Math.min(value, 100);
    return (price * percentage) / 100;
  } else if (discountType === 'fixed') {
    return Math.min(value, price);
  }

  return 0;
};

export const formatDiscount = (discountType, discountValue) => {
  if (discountType === 'percentage') {
    return `${discountValue}%`;
  } else if (discountType === 'fixed') {
    return formatAmount(discountValue);
  }
  return 'Aucune réduction';
};

export const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF'
  }).format(amount);
};

export const isCodeExpired = (validityDate) => {
  if (!validityDate) return false;
  return new Date(validityDate) < new Date();
};

export const isCodeActive = (promoCode) => {
  if (!promoCode) return false;

  const now = new Date();
  const startDate = new Date(promoCode.dateDebut);
  const endDate = new Date(promoCode.dateFin);

  return promoCode.statut === 'actif' &&
    now >= startDate &&
    now <= endDate &&
    (!promoCode.utilisationMax || (promoCode.utilisationActuelle || 0) < promoCode.utilisationMax);
};

// ✅ TEST DE CONNEXION COMPLET
export const testConnection = async () => {
  try {
    console.log('🧪 Test connexion API promos (PUBLIC)...');

    const statsResponse = await getPromoCodeStats();
    console.log('✅ Stats:', statsResponse);

    const activeResponse = await getActivePromos();
    console.log('✅ Promos actives:', activeResponse);

    return {
      stats: statsResponse,
      active: activeResponse,
      message: 'Test complet effectué (PUBLIC)'
    };
  } catch (error) {
    console.error('❌ Test connexion échoué:', error);
    throw error;
  }
};

// ✅ EXPORT PAR DÉFAUT POUR LA COMPATIBILITÉ
const promoCodesService = {
  getCodesPromo,
  verifyCodePromo,
  getPromoCodeStats,
  getActivePromos,
  getRoomPromos,
  calculateDiscount,
  formatDiscount,
  formatAmount,
  isCodeExpired,
  isCodeActive,
  testConnection
};

export default promoCodesService;