const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const cybersourceService = require('./cybersourceService');

class PaymentService {
  /**
   * 🔹 TRAITER UN PAIEMENT COMPLET
   */
  async processPayment(paymentRequest) {
    try {
      const { reservationId, paymentMethod, cardData, amount } = paymentRequest;

      // Vérifier la réservation
      const reservation = await Reservation.findById(reservationId)
        .populate('client')
        .populate('chambre');
      
      if (!reservation) {
        throw new Error('Réservation non trouvée');
      }

      if (reservation.status === 'cancelled') {
        throw new Error('Cette réservation a été annulée');
      }

      // Préparer les données pour Cybersource
      const cybersourceData = {
        reservationId: reservation._id.toString(),
        type: 'full',
        amount: amount,
        currency: 'XAF',
        clientName: `${reservation.client.surname} ${reservation.client.name}`,
        clientEmail: reservation.client.email,
        cardData: cardData
      };

      // Appeler Cybersource
      const paymentResult = await cybersourceService.processPayment(cybersourceData);

      // Créer l'enregistrement de paiement
      const payment = await Payment.create({
        reservation: reservationId,
        client: reservation.client._id,
        amount: amount,
        currency: 'XAF',
        type: 'full',
        method: paymentMethod,
        status: paymentResult.success ? 'completed' : 'failed',
        transactionId: paymentResult.transactionId,
        gateway: paymentResult.gateway,
        gatewayResponse: paymentResult,
        cardLast4: cardData.number.slice(-4),
        cardBrand: this.getCardBrand(cardData.number)
      });

      // Mettre à jour la réservation
      if (paymentResult.success) {
        reservation.status = 'confirmed';
        reservation.paiement = {
          amount: amount,
          currency: 'XAF',
          paidAt: new Date(),
          method: paymentMethod,
          status: 'paid',
          transactionId: paymentResult.transactionId
        };
        await reservation.save();
      }

      return {
        success: paymentResult.success,
        payment: payment,
        message: paymentResult.message,
        declineReason: paymentResult.declineReason
      };

    } catch (error) {
      console.error('❌ Erreur traitement paiement:', error);
      throw error;
    }
  }

  /**
   * 🔹 SIMULER UN PAIEMENT (Développement)
   */
  async mockPayment(reservationId) {
    try {
      const reservation = await Reservation.findById(reservationId)
        .populate('client')
        .populate('chambre');

      if (!reservation) {
        throw new Error('Réservation non trouvée');
      }

      // Simulation réussie
      const mockResult = {
        success: true,
        status: 'AUTHORIZED',
        transactionId: `MOCK-${Date.now()}`,
        amount: reservation.totalAmount,
        currency: 'XAF',
        message: 'Paiement simulé avec succès',
        gateway: 'mock'
      };

      // Créer le paiement
      const payment = await Payment.create({
        reservation: reservationId,
        client: reservation.client._id,
        amount: reservation.totalAmount,
        currency: 'XAF',
        type: 'full',
        method: 'card',
        status: 'completed',
        transactionId: mockResult.transactionId,
        gateway: 'mock',
        gatewayResponse: mockResult
      });

      // Mettre à jour la réservation
      reservation.status = 'confirmed';
      reservation.paiement = {
        amount: reservation.totalAmount,
        currency: 'XAF',
        paidAt: new Date(),
        method: 'card',
        status: 'paid',
        transactionId: mockResult.transactionId
      };
      await reservation.save();

      return {
        success: true,
        payment: payment,
        message: 'Paiement d\'acompte simulé avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur paiement simulé:', error);
      throw error;
    }
  }

  /**
   * 🔹 TRAITER UN REMBOURSEMENT
   */
  async processRefund(paymentId, refundData) {
    try {
      const { amount, reason } = refundData;

      // Récupérer le paiement original
      const originalPayment = await Payment.findById(paymentId)
        .populate('reservation')
        .populate('client');

      if (!originalPayment) {
        throw new Error('Paiement non trouvé');
      }

      if (originalPayment.status !== 'completed') {
        throw new Error('Seuls les paiements complétés peuvent être remboursés');
      }

      const refundAmount = amount || originalPayment.amount;

      // Appeler Cybersource pour le remboursement
      const refundResult = await cybersourceService.processRefund(
        originalPayment.transactionId,
        refundAmount,
        originalPayment.currency
      );

      // Créer l'enregistrement de remboursement
      const refundPayment = await Payment.create({
        reservation: originalPayment.reservation._id,
        client: originalPayment.client._id,
        amount: refundAmount,
        currency: originalPayment.currency,
        type: 'refund',
        method: originalPayment.method,
        status: refundResult.success ? 'completed' : 'failed',
        transactionId: refundResult.transactionId,
        gateway: originalPayment.gateway,
        gatewayResponse: refundResult,
        refundOf: originalPayment._id,
        refundedAmount: refundAmount,
        reason: reason
      });

      // Mettre à jour le paiement original
      if (refundResult.success) {
        if (refundAmount === originalPayment.amount) {
          originalPayment.status = 'refunded';
        } else {
          originalPayment.status = 'partially_refunded';
        }
        originalPayment.refundedAmount = refundAmount;
        await originalPayment.save();

        // Mettre à jour la réservation
        const reservation = await Reservation.findById(originalPayment.reservation._id);
        if (reservation && reservation.paiement) {
          reservation.paiement.status = 'refunded';
          await reservation.save();
        }
      }

      return {
        success: refundResult.success,
        payment: refundPayment,
        message: refundResult.message
      };

    } catch (error) {
      console.error('❌ Erreur remboursement:', error);
      throw error;
    }
  }

  /**
   * 🔹 DÉTECTER LA MARQUE DE CARTE
   */
  getCardBrand(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    
    return 'Unknown';
  }

  /**
   * 🔹 OBTENIR LES STATISTIQUES DE PAIEMENT
   */
  async getPaymentStats() {
    const stats = await Payment.aggregate([
      {
        $match: {
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          averageTransaction: { $avg: '$amount' }
        }
      }
    ]);

    return stats[0] || { totalRevenue: 0, totalTransactions: 0, averageTransaction: 0 };
  }
}

module.exports = new PaymentService();