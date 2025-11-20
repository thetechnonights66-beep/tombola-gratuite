// src/utils/cryptoPaymentService.js
export const CryptoPaymentService = {
  
  // ✅ CONFIGURATION DES CRYPTOMONNAIES SUPPORTÉES
  SUPPORTED_CRYPTOS: {
    BTC: { name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin' },
    ETH: { name: 'Ethereum', symbol: 'ETH', network: 'ERC20' },
    USDT: { name: 'Tether', symbol: 'USDT', network: 'TRC20' },
    BNB: { name: 'Binance Coin', symbol: 'BNB', network: 'BEP20' },
    SOL: { name: 'Solana', symbol: 'SOL', network: 'Solana' }
  },

  // ✅ GÉNÉRATION D'ADRESSE DE PAIEMENT
  generatePaymentAddress(crypto, amount, ticketCount, participantInfo) {
    const paymentId = `TOMBO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentData = {
      id: paymentId,
      crypto: crypto,
      amount: amount,
      ticketCount: ticketCount,
      participant: participantInfo,
      timestamp: new Date().toISOString(),
      status: 'pending',
      requiredAmount: this.calculateRequiredAmount(crypto, amount)
    };

    // Sauvegarder la transaction en attente
    this.savePendingPayment(paymentData);
    
    return {
      paymentId: paymentId,
      crypto: crypto,
      amount: amount,
      requiredAmount: paymentData.requiredAmount,
      walletAddress: this.getWalletAddress(crypto),
      instructions: this.getPaymentInstructions(crypto, paymentData.requiredAmount),
      qrCode: this.generateQRCode(crypto, paymentData.requiredAmount),
      expiry: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };
  },

  // ✅ CALCUL DU MONTANT REQUIS (avec frais réseau)
  calculateRequiredAmount(crypto, amount) {
    const baseAmount = parseFloat(amount);
    const fees = {
      BTC: 0.0005, // frais réseau Bitcoin
      ETH: 0.003,  // frais gas Ethereum
      USDT: 1,     // frais TRC20
      BNB: 0.001,  // frais BEP20
      SOL: 0.0001  // frais Solana
    };

    return (baseAmount + (fees[crypto] || 0)).toFixed(8);
  },

  // ✅ ADRESSES WALLET (À CONFIGURER AVEC VOS VRAIES ADRESSES)
  getWalletAddress(crypto) {
    const addresses = {
      BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      ETH: '0x742d35Cc6634C0532925a3b8D4a7b8a6C4aBfC7A',
      USDT: 'TBaegYz3ZqgTg2n1pCq7QhQd1qLr9n4vWX',
      BNB: 'bnb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      SOL: 'So1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    };
    
    return addresses[crypto] || 'ADDRESS_NOT_CONFIGURED';
  },

  // ✅ GÉNÉRATION QR CODE
  generateQRCode(crypto, amount) {
    const address = this.getWalletAddress(crypto);
    const qrData = `${crypto}:${address}?amount=${amount}`;
    
    // Utiliser un service QR code (ex: QRServer.com)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  },

  // ✅ INSTRUCTIONS DE PAIEMENT
  getPaymentInstructions(crypto, amount) {
    const instructions = {
      BTC: `
        • Envoyez EXACTEMENT ${amount} BTC
        • Réseau: Bitcoin (BTC)
        • Adresse: ${this.getWalletAddress('BTC')}
        • Ne pas envoyer depuis un exchange
        • Confirmation requise: 2 blocs
      `,
      ETH: `
        • Envoyez EXACTEMENT ${amount} ETH
        • Réseau: Ethereum (ERC20)
        • Adresse: ${this.getWalletAddress('ETH')}
        • Prévoir les frais de gas
        • Confirmation requise: 12 blocs
      `,
      USDT: `
        • Envoyez EXACTEMENT ${amount} USDT
        • Réseau: Tron (TRC20) UNIQUEMENT
        • Adresse: ${this.getWalletAddress('USDT')}
        • Pas de frais supplémentaires
        • Confirmation rapide
      `,
      BNB: `
        • Envoyez EXACTEMENT ${amount} BNB
        • Réseau: Binance Smart Chain (BEP20)
        • Adresse: ${this.getWalletAddress('BNB')}
        • Faibles frais de réseau
      `,
      SOL: `
        • Envoyez EXACTEMENT ${amount} SOL
        • Réseau: Solana
        • Adresse: ${this.getWalletAddress('SOL')}
        • Transactions ultra-rapides
        • Frais négligeables
      `
    };
    
    return instructions[crypto] || 'Instructions non disponibles pour cette crypto.';
  },

  // ✅ SAUVEGARDE DES PAIEMENTS EN ATTENTE
  savePendingPayment(paymentData) {
    const pendingPayments = this.getPendingPayments();
    pendingPayments[paymentData.id] = paymentData;
    localStorage.setItem('cryptoPendingPayments', JSON.stringify(pendingPayments));
  },

  // ✅ RÉCUPÉRATION DES PAIEMENTS EN ATTENTE
  getPendingPayments() {
    return JSON.parse(localStorage.getItem('cryptoPendingPayments') || '{}');
  },

  // ✅ VÉRIFICATION MANUELLE DU PAIEMENT
  async checkPaymentStatus(paymentId) {
    const pendingPayments = this.getPendingPayments();
    const payment = pendingPayments[paymentId];
    
    if (!payment) {
      return { status: 'not_found', message: 'Paiement non trouvé' };
    }

    // Ici vous intégreriez votre API de vérification
    // Pour l'instant, simulation manuelle
    return {
      status: 'pending',
      message: 'En attente de confirmation. Vérifiez votre wallet.',
      payment: payment
    };
  },

  // ✅ MARQUER UN PAIEMENT COMME CONFIRMÉ
  confirmPayment(paymentId, transactionHash) {
    const pendingPayments = this.getPendingPayments();
    const payment = pendingPayments[paymentId];
    
    if (payment) {
      payment.status = 'confirmed';
      payment.transactionHash = transactionHash;
      payment.confirmedAt = new Date().toISOString();
      
      // Sauvegarder
      localStorage.setItem('cryptoPendingPayments', JSON.stringify(pendingPayments));
      
      // Émettre un événement de paiement confirmé
      window.dispatchEvent(new CustomEvent('cryptoPaymentConfirmed', {
        detail: payment
      }));
      
      return payment;
    }
    
    return null;
  },

  // ✅ NETTOYAGE DES PAIEMENTS EXPIRÉS
  cleanupExpiredPayments() {
    const pendingPayments = this.getPendingPayments();
    const now = new Date();
    
    Object.keys(pendingPayments).forEach(paymentId => {
      const payment = pendingPayments[paymentId];
      const paymentTime = new Date(payment.timestamp);
      const expiryTime = new Date(paymentTime.getTime() + 30 * 60 * 1000); // 30 minutes
      
      if (now > expiryTime) {
        delete pendingPayments[paymentId];
      }
    });
    
    localStorage.setItem('cryptoPendingPayments', JSON.stringify(pendingPayments));
  }
};
