// public/src/services/promoCodesService.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ── Calcul interne de la réduction ──
const computePromoFields = (codePromo, roomPrice) => {
  if (!codePromo || !roomPrice) return codePromo;
  const price = parseFloat(roomPrice);
  const value = parseFloat(codePromo.value);
  let economie = 0;

  if (codePromo.type === 'percentage') {
    economie = Math.round((price * Math.min(value, 100)) / 100);
  } else if (codePromo.type === 'fixed') {
    economie = Math.min(value, price);
  }

  return {
    ...codePromo,
    prixOriginal: price,
    prixReduit: Math.max(0, Math.round(price - economie)),
    economie: Math.round(economie)
  };
};

// ✅ RÉCUPÉRER TOUS LES CODES PROMO (ADMIN)
export const getCodesPromo = async () => {
  try {
    const response = await fetch(`${API_BASE}/codepromo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur récupération codes promo:', error);
    throw error;
  }
};

// ✅ VÉRIFIER UN CODE PROMO (PUBLIC)
export const verifyCodePromo = async (code, chambreId, nights = 1, checkin = null, checkout = null, roomPrice = null) => {
  try {
    console.log('🔍 Vérification code promo:', { code, chambreId, nights });

    const requestBody = {
      code: code.toUpperCase(),
      chambreId,
      nights: parseInt(nights)
    };
    if (checkin && checkout) {
      requestBody.checkin = checkin;
      requestBody.checkout = checkout;
    }

    const response = await fetch(`${API_BASE}/codepromo/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message };
    }

    // Calcul des champs prixOriginal / prixReduit / economie
    if (result.success && result.codePromo && roomPrice) {
      result.codePromo = computePromoFields(result.codePromo, roomPrice);
    }

    console.log('✅ Code promo valide:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur vérification code promo:', error);
    return { success: false, message: 'Erreur lors de la vérification du code promo' };
  }
};

// ✅ OBTENIR LES PROMOS POUR UNE CHAMBRE (PUBLIC)
export const getRoomPromos = async (roomId, roomPrice = null) => {
  try {
    const response = await fetch(`${API_BASE}/codepromo/room/${roomId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      return { success: false, availablePromos: [] };
    }

    const result = await response.json();

    // Le backend retourne { codesPromo: [...] }, on normalise en availablePromos
    let promos = result.availablePromos || result.codesPromo || [];

    // Calcul des champs économie si on a le prix de la chambre
    if (roomPrice && promos.length > 0) {
      promos = promos.map(p => computePromoFields(p, roomPrice));
    }

    console.log(`✅ Promos trouvées pour ${roomId}:`, promos.length);
    return { success: true, availablePromos: promos };
  } catch (error) {
    console.error(`❌ Erreur récupération promos chambre ${roomId}:`, error);
    return { success: false, availablePromos: [] };
  }
};

// ✅ OBTENIR LES STATISTIQUES (PUBLIC)
export const getPromoCodeStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/codepromo/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur récupération stats:', error);
    throw error;
  }
};

// ✅ OBTENIR LES PROMOS ACTIVES (PUBLIC)
export const getActivePromos = async () => {
  try {
    const response = await fetch(`${API_BASE}/codepromo/active`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur récupération promos actives:', error);
    throw error;
  }
};

// ✅ MÉTHODES UTILITAIRES
export const calculateDiscount = (originalPrice, discountType, discountValue) => {
  if (!originalPrice || !discountValue) return 0;
  const price = parseFloat(originalPrice);
  const value = parseFloat(discountValue);
  if (discountType === 'percentage') return (price * Math.min(value, 100)) / 100;
  if (discountType === 'fixed') return Math.min(value, price);
  return 0;
};

export const formatDiscount = (discountType, discountValue) => {
  if (discountType === 'percentage') return `${discountValue}%`;
  if (discountType === 'fixed') return formatAmount(discountValue);
  return 'Aucune réduction';
};

export const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount);
};

export const isCodeExpired = (validityDate) => {
  if (!validityDate) return false;
  return new Date(validityDate) < new Date();
};

export const isCodeActive = (promoCode) => {
  if (!promoCode) return false;
  const now = new Date();
  return promoCode.statut === 'actif' &&
    now >= new Date(promoCode.dateDebut) &&
    now <= new Date(promoCode.dateFin) &&
    (!promoCode.utilisationMax || (promoCode.utilisationActuelle || 0) < promoCode.utilisationMax);
};

export const testConnection = async () => {
  try {
    const statsResponse = await getPromoCodeStats();
    const activeResponse = await getActivePromos();
    return { stats: statsResponse, active: activeResponse, message: 'Test complet effectué (PUBLIC)' };
  } catch (error) {
    console.error('❌ Test connexion échoué:', error);
    throw error;
  }
};

const promoCodesService = {
  getCodesPromo, verifyCodePromo, getPromoCodeStats,
  getActivePromos, getRoomPromos, calculateDiscount,
  formatDiscount, formatAmount, isCodeExpired, isCodeActive, testConnection
};

export default promoCodesService;