export const TransactionMonitor = {
  transactions: [],
  
  // 🕒 SURVEILLANCE TEMPS RÉEL
  startRealTimeMonitoring() {
    setInterval(() => {
      this.checkPendingPayments();
      this.updateLiveStats();
    }, 10000); // Vérif toutes les 10 secondes
  },
  
  // 📋 VÉRIFIER LES PAIEMENTS EN ATTENTE
  checkPendingPayments() {
    const pendingPayments = JSON.parse(localStorage.getItem('cryptoPendingPayments') || '{}');
    const now = new Date();
    
    Object.entries(pendingPayments).forEach(([paymentId, payment]) => {
      const paymentTime = new Date(payment.timestamp);
      const expiryTime = new Date(paymentTime.getTime() + 30 * 60 * 1000);
      
      if (now > expiryTime && payment.status === 'pending') {
        payment.status = 'expired';
      }
    });
    
    localStorage.setItem('cryptoPendingPayments', JSON.stringify(pendingPayments));
    this.emitTransactionsUpdated();
  },
  
  // 📊 STATISTIQUES TEMPS RÉEL
  getTransactionStats() {
    const payments = JSON.parse(localStorage.getItem('cryptoPendingPayments') || '{}');
    const allPayments = Object.values(payments);
    
    return {
      total: allPayments.length,
      pending: allPayments.filter(p => p.status === 'pending').length,
      confirmed: allPayments.filter(p => p.status === 'confirmed').length,
      expired: allPayments.filter(p => p.status === 'expired').length,
      totalRevenue: allPayments
        .filter(p => p.status === 'confirmed')
        .reduce((sum, p) => sum + p.amount, 0),
      recent: allPayments
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
    };
  },
  
  // 🔥 ÉVÉNEMENTS TEMPS RÉEL
  emitTransactionsUpdated() {
    window.dispatchEvent(new CustomEvent('transactionsUpdated', {
      detail: this.getTransactionStats()
    }));
  }
};
