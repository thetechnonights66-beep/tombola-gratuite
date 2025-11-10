// src/utils/analyticsService.js
export const AnalyticsService = {
  
  // ✅ INITIALISATION
  init() {
    if (!localStorage.getItem('tombolaAnalytics')) {
      const initialAnalytics = {
        sessions: [],
        purchases: [],
        referrals: [],
        pageViews: [],
        conversions: [],
        userBehavior: {},
        created: new Date().toISOString()
      };
      localStorage.setItem('tombolaAnalytics', JSON.stringify(initialAnalytics));
    }
  },

  // ✅ SUIVI DES SESSIONS
  trackSession() {
    const sessionId = 'session_' + Date.now();
    const sessionData = {
      id: sessionId,
      startTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language
    };

    this.updateAnalytics(data => ({
      ...data,
      sessions: [...data.sessions, sessionData]
    }));

    return sessionId;
  },

  // ✅ SUIVI DES PAGES VUES
  trackPageView(page, referrer = document.referrer) {
    const pageView = {
      page,
      timestamp: new Date().toISOString(),
      referrer,
      sessionId: this.getCurrentSessionId()
    };

    this.updateAnalytics(data => ({
      ...data,
      pageViews: [...data.pageViews, pageView]
    }));
  },

  // ✅ SUIVI DES ACHATS
  trackPurchase(purchaseData) {
    const purchase = {
      ...purchaseData,
      timestamp: new Date().toISOString(),
      sessionId: this.getCurrentSessionId(),
      conversionValue: purchaseData.amount
    };

    this.updateAnalytics(data => ({
      ...data,
      purchases: [...data.purchases, purchase],
      conversions: [...data.conversions, { type: 'purchase', ...purchase }]
    }));

    this.calculateROI();
  },

  // ✅ SUIVI DES PARRAINAGES
  trackReferral(action, data) {
    const referral = {
      action,
      ...data,
      timestamp: new Date().toISOString(),
      sessionId: this.getCurrentSessionId()
    };

    this.updateAnalytics(data => ({
      ...data,
      referrals: [...data.referrals, referral]
    }));
  },

  // ✅ COMPORTEMENT UTILISATEUR
  trackUserBehavior(action, data = {}) {
    const behavior = {
      action,
      ...data,
      timestamp: new Date().toISOString(),
      sessionId: this.getCurrentSessionId()
    };

    this.updateAnalytics(data => ({
      ...data,
      userBehavior: {
        ...data.userBehavior,
        [action]: [...(data.userBehavior[action] || []), behavior]
      }
    }));
  },

  // ✅ STATISTIQUES AVANCÉES
  getAdvancedStats() {
    const analytics = this.getAnalytics();
    const purchases = analytics.purchases || [];
    const referrals = analytics.referrals || [];
    const pageViews = analytics.pageViews || [];
    const sessions = analytics.sessions || [];

    // Taux de conversion
    const totalVisitors = [...new Set(sessions.map(s => s.id))].length;
    const totalPurchases = purchases.length;
    const conversionRate = totalVisitors > 0 ? (totalPurchases / totalVisitors * 100) : 0;

    // ROI Parrainage
    const referralPurchases = purchases.filter(p => p.referralCode);
    const referralRevenue = referralPurchases.reduce((sum, p) => sum + p.amount, 0);
    const referralCost = analytics.referralTicketsGiven * 5; // Coût des tickets offerts
    const referralROI = referralCost > 0 ? ((referralRevenue - referralCost) / referralCost * 100) : 0;

    // Comportement utilisateur
    const pageViewCounts = pageViews.reduce((acc, pv) => {
      acc[pv.page] = (acc[pv.page] || 0) + 1;
      return acc;
    }, {});

    const popularPages = Object.entries(pageViewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Points de friction
    const abandonedCarts = analytics.userBehavior?.addToCart || [];
    const formAbandons = analytics.userBehavior?.formStart || [];
    
    const frictionPoints = {
      cartAbandonmentRate: abandonedCarts.length > 0 ? 
        (abandonedCarts.filter(ac => !ac.completed).length / abandonedCarts.length * 100) : 0,
      formAbandonmentRate: formAbandons.length > 0 ? 
        (formAbandons.filter(f => !f.completed).length / formAbandons.length * 100) : 0
    };

    return {
      // 📈 Métriques de base
      totalVisitors,
      totalPurchases,
      totalRevenue: purchases.reduce((sum, p) => sum + p.amount, 0),
      averageOrderValue: totalPurchases > 0 ? purchases.reduce((sum, p) => sum + p.amount, 0) / totalPurchases : 0,

      // 🎯 Conversion
      conversionRate: conversionRate.toFixed(2),
      
      // 👥 Parrainage
      totalReferrals: referrals.length,
      referralConversions: referralPurchases.length,
      referralRevenue,
      referralROI: referralROI.toFixed(2),
      referralEfficiency: totalPurchases > 0 ? (referralPurchases.length / totalPurchases * 100).toFixed(2) : 0,

      // 📊 Comportement
      popularPages,
      sessionDuration: this.calculateAverageSessionDuration(),
      bounceRate: this.calculateBounceRate(),

      // ⚠️ Points de friction
      frictionPoints,

      // 📅 Tendances
      dailyStats: this.getDailyStats(),
      hourlyPeaks: this.getHourlyPeaks()
    };
  },

  // ✅ CALCUL DURÉE MOYENNE DES SESSIONS
  calculateAverageSessionDuration() {
    const sessions = this.getAnalytics().sessions || [];
    if (sessions.length === 0) return '0s';

    const durations = sessions.map(s => {
      const start = new Date(s.startTime);
      const end = s.endTime ? new Date(s.endTime) : new Date();
      return (end - start) / 1000; // en secondes
    });

    const avgSeconds = durations.reduce((a, b) => a + b, 0) / durations.length;
    return avgSeconds < 60 ? `${Math.round(avgSeconds)}s` : `${Math.round(avgSeconds / 60)}min`;
  },

  // ✅ CALCUL TAUX DE REBOND
  calculateBounceRate() {
    const sessions = this.getAnalytics().sessions || [];
    const pageViews = this.getAnalytics().pageViews || [];

    if (sessions.length === 0) return '0%';

    const singlePageSessions = sessions.filter(session => {
      const sessionPageViews = pageViews.filter(pv => pv.sessionId === session.id);
      return sessionPageViews.length <= 1;
    });

    return ((singlePageSessions.length / sessions.length) * 100).toFixed(1) + '%';
  },

  // ✅ STATISTIQUES QUOTIDIENNES
  getDailyStats() {
    const purchases = this.getAnalytics().purchases || [];
    const dailyStats = {};

    purchases.forEach(purchase => {
      const date = new Date(purchase.timestamp).toLocaleDateString('fr-FR');
      if (!dailyStats[date]) {
        dailyStats[date] = { purchases: 0, revenue: 0 };
      }
      dailyStats[date].purchases++;
      dailyStats[date].revenue += purchase.amount;
    });

    return dailyStats;
  },

  // ✅ HEURES DE POINTE
  getHourlyPeaks() {
    const pageViews = this.getAnalytics().pageViews || [];
    const hourlyCounts = {};

    pageViews.forEach(pv => {
      const hour = new Date(pv.timestamp).getHours();
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    });

    return Object.entries(hourlyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hour, count]) => ({ hour: `${hour}h`, count }));
  },

  // ✅ RAPPORT DÉTAILLÉ
  generateReport() {
    const stats = this.getAdvancedStats();
    
    return {
      summary: {
        période: 'Depuis le début',
        chiffreAffaires: `€${stats.totalRevenue}`,
        visiteursUniques: stats.totalVisitors,
        tauxConversion: `${stats.conversionRate}%`
      },
      performance: {
        panierMoyen: `€${stats.averageOrderValue.toFixed(2)}`,
        duréeMoyenneSession: stats.sessionDuration,
        tauxRebond: stats.bounceRate
      },
      parrainage: {
        revenusParrainage: `€${stats.referralRevenue}`,
        ROI: `${stats.referralROI}%`,
        efficacité: `${stats.referralEfficiency}%`
      },
      comportement: {
        pagesPopulaires: stats.popularPages,
        heuresPointes: stats.hourlyPeaks
      },
      améliorations: {
        tauxAbandonPanier: `${stats.frictionPoints.cartAbandonmentRate.toFixed(1)}%`,
        tauxAbandonFormulaire: `${stats.frictionPoints.formAbandonmentRate.toFixed(1)}%`
      }
    };
  },

  // ✅ UTILITAIRES
  getAnalytics() {
    return JSON.parse(localStorage.getItem('tombolaAnalytics') || '{}');
  },

  updateAnalytics(updater) {
    const current = this.getAnalytics();
    const updated = updater(current);
    localStorage.setItem('tombolaAnalytics', JSON.stringify(updated));
  },

  getCurrentSessionId() {
    return sessionStorage.getItem('currentSessionId');
  },

  setCurrentSessionId(sessionId) {
    sessionStorage.setItem('currentSessionId', sessionId);
  },

  // ✅ NETTOYAGE (pour tests)
  clearAnalytics() {
    localStorage.removeItem('tombolaAnalytics');
    this.init();
  }
};
