// src/services/receiptService.js
import api from './api'

const receiptService = {
  /**
   * Télécharger le reçu d'une réservation
   * @param {string} reservationId - ID de la réservation
   * @returns {Promise<Blob>} - Le fichier PDF du reçu
   */
  downloadReceipt: async (reservationId) => {
    try {
      const response = await api.get(`/reservations/${reservationId}/receipt`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur téléchargement reçu:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement du reçu');
    }
  },

  /**
   * Générer une URL de reçu (si l'API retourne une URL)
   * @param {string} reservationId - ID de la réservation
   * @returns {Promise<string>} - URL du reçu
   */
  generateReceiptUrl: async (reservationId) => {
    try {
      const response = await api.get(`/reservations/${reservationId}/receipt-url`);
      
      if (response.data.success && response.data.receiptUrl) {
        return response.data.receiptUrl;
      }
      throw new Error('URL du reçu non disponible');
    } catch (error) {
      console.error('❌ Erreur génération URL reçu:', error);
      throw error;
    }
  },

  /**
   * Télécharger le fichier à partir d'un blob
   * @param {Blob} blob - Le blob PDF
   * @param {string} filename - Nom du fichier
   */
  downloadFileFromBlob: (blob, filename = 'receipt.pdf') => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Formater la date pour le nom du fichier
   * @param {Date} date - Date à formater
   * @returns {string} - Date formatée
   */
  formatDateForFilename: (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`;
  }
};

export default receiptService;