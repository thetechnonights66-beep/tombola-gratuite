// src/utils/referralSystem.js
// Système complet de parrainage avec gestion des récompenses et détection de fraude

export const ReferralSystem = {
  
  // ✅ INITIALISATION DU SYSTÈME
  init() {
    if (!localStorage.getItem('tombolaReferrals')) {
      localStorage.setItem('tombolaReferrals', JSON.stringify([]));
    }
    if (!localStorage.getItem('suspendedReferrers')) {
      localStorage.setItem('suspendedReferrers', JSON.stringify([]));
    }
    if (!localStorage.getItem('referralAdminLog')) {
      localStorage.setItem('referralAdminLog', JSON.stringify([]));
    }
  },

  // ✅ RÉCUPÉRER TOUS LES PARRAINAGES
  getReferrals() {
    this.init();
    return JSON.parse(localStorage.getItem('tombolaReferrals')) || [];
  },

  // ✅ SAUVEGARDER LES PARRAINAGES
  saveReferrals(referrals) {
    localStorage.setItem('tombolaReferrals', JSON.stringify(referrals));
  },

  // ✅ GÉNÉRER UN CODE DE PARRAINAGE UNIQUE
  generateReferralCode(userId, userName) {
    const baseName = userName.split(' ')[0].toUpperCase();
    const randomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `TOMBO-${baseName}-${randomCode}`;
  },

  // ✅ TROUVER UN PARRAIN PAR SON CODE
  findReferrerByCode(referralCode) {
    const participants = JSON.parse(localStorage.getItem('tombolaTickets') || '[]');
    const emails = [...new Set(participants.map(p => p.email))];
    
    // Chercher dans les participants existants
    for (let email of emails) {
      const testCode = this.generateReferralCode(Date.now(), email.split('@')[0]);
      if (testCode === referralCode) {
        const participant = participants.find(p => p.email === email);
        return participant ? { email: participant.email, name: participant.participant } : null;
      }
    }
    return null;
  },

  // ✅ ENREGISTRER UN NOUVEAU PARRAINAGE
  registerReferral(referralCode, newParticipant) {
    console.log('🎯 Tentative d\'enregistrement parrainage:', { referralCode, newParticipant });
    
    const referrals = this.getReferrals();
    const referrer = this.findReferrerByCode(referralCode);
    
    if (!referrer) {
      return { 
        success: false, 
        message: '❌ Code de parrainage invalide. Vérifiez le code et réessayez.' 
      };
    }

    // Vérifier si ce filleul a déjà utilisé un code
    const alreadyReferred = referrals.find(r => r.referred === newParticipant.email);
    if (alreadyReferred) {
      return { 
        success: false, 
        message: '❌ Vous avez déjà utilisé un code de parrainage. Un seul code est autorisé par participant.' 
      };
    }

    const newReferral = {
      id: Date.now(),
      referralCode,
      referrer: referrer.email,
      referrerName: referrer.name,
      referred: newParticipant.email,
      referredName: newParticipant.name,
      date: new Date().toISOString(),
      status: 'pending', // pending, validated, rewarded
      ticketsEarned: 0,
      ipAddress: 'unknown' // En production, récupérer l'IP réelle
    };

    referrals.push(newReferral);
    this.saveReferrals(referrals);

    console.log('✅ Parrainage enregistré avec succès:', newReferral);

    return { 
      success: true, 
      message: `🎉 Parrainage enregistré avec succès ! Vous parrainez ${referrer.name}.`,
      referrerName: referrer.name
    };
  },

  // ✅ VALIDER UN PARRAINAGE (quand le filleul achète)
  validateReferral(referredEmail) {
    console.log('🔍 Validation du parrainage pour:', referredEmail);
    
    const referrals = this.getReferrals();
    const referral = referrals.find(r => 
      r.referred === referredEmail && r.status === 'pending'
    );

    if (referral) {
      referral.status = 'validated';
      referral.validatedAt = new Date().toISOString();
      this.saveReferrals(referrals);
      
      console.log('✅ Parrainage validé:', referral);

      // Vérifier si le parrain mérite une récompense
      this.checkAndRewardReferrer(referral.referrer);
      
      return true;
    }
    return false;
  },

  // ✅ VÉRIFIER ET ATTRIBUER LES RÉCOMPENSES
  checkAndRewardReferrer(referrerEmail) {
    console.log('🎁 Vérification des récompenses pour:', referrerEmail);
    
    const referrals = this.getReferrals();
    const validReferrals = referrals.filter(r => 
      r.referrer === referrerEmail && r.status === 'validated'
    );

    console.log(`📊 ${referrerEmail} a ${validReferrals.length} parrainages validés`);

    // 1 ticket gratuit après 5 parrainages validés
    if (validReferrals.length >= 5) {
      console.log('🎯 Attribution de récompense!');
      
      const tickets = this.giveReward(referrerEmail, 1);
      
      // Marquer comme récompensé
      validReferrals.forEach(ref => {
        ref.status = 'rewarded';
        ref.rewardedAt = new Date().toISOString();
        ref.ticketsEarned += 1;
      });
      
      this.saveReferrals(referrals);

      // Journaliser la récompense
      this.logAdminAction({
        action: 'AUTO_REWARD',
        referrer: referrerEmail,
        tickets: 1,
        reason: `5 parrainages validés - ${validReferrals.length} au total`,
        timestamp: new Date().toISOString()
      });

      return tickets;
    }

    return null;
  },

  // ✅ ATTRIBUER DES TICKETS GRATUITS
  giveReward(email, ticketCount) {
    console.log(`🎫 Attribution de ${ticketCount} ticket(s) à ${email}`);
    
    const TicketStorage = {
      addTicket(ticketData) {
        const tickets = JSON.parse(localStorage.getItem('tombolaTickets') || '[]');
        const newTicket = {
          id: Date.now() + Math.random(),
          number: Math.floor(1000 + Math.random() * 9000),
          purchaseDate: new Date().toISOString(),
          price: ticketData.price,
          participant: ticketData.participant,
          email: ticketData.email,
          isDrawn: false,
          drawResult: null,
          source: ticketData.source
        };
        tickets.push(newTicket);
        localStorage.setItem('tombolaTickets', JSON.stringify(tickets));
        return newTicket;
      }
    };

    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
      const ticket = TicketStorage.addTicket({
        number: Math.floor(1000 + Math.random() * 9000),
        price: 0, // Gratuit
        participant: 'Récompense parrainage',
        email: email,
        source: 'referral_reward'
      });
      tickets.push(ticket);
    }
    
    console.log(`✅ ${ticketCount} ticket(s) attribué(s) à ${email}`);
    return tickets;
  },

  // ✅ STATISTIQUES GLOBALES POUR L'ADMIN
  getAdminStats() {
    const referrals = this.getReferrals();
    const participants = JSON.parse(localStorage.getItem('tombolaTickets') || '[]');
    
    const activeReferrers = [...new Set(referrals.map(r => r.referrer))];
    const totalRewardsGiven = referrals.filter(r => r.status === 'rewarded').length;
    const validatedReferrals = referrals.filter(r => r.status === 'validated').length;
    
    return {
      totalReferrals: referrals.length,
      activeReferrers: activeReferrers.length,
      conversionRate: referrals.length > 0 ? 
        (validatedReferrals / referrals.length * 100).toFixed(1) : 0,
      totalRewardsGiven,
      topReferrers: this.getTopReferrers(10),
      recentReferrals: referrals.slice(-10).reverse(),
      fraudFlags: this.detectFraudPatterns(),
      performance: {
        dailyAverage: (referrals.length / 30).toFixed(1),
        avgTicketsPerReferrer: activeReferrers.length > 0 ? 
          (totalRewardsGiven / activeReferrers.length).toFixed(1) : 0
      }
    };
  },

  // ✅ TOP DES PARRAINS
  getTopReferrers(limit = 10) {
    const referrals = this.getReferrals();
    const referrerStats = {};
    
    referrals.forEach(ref => {
      if (!referrerStats[ref.referrer]) {
        referrerStats[ref.referrer] = {
          email: ref.referrer,
          name: ref.referrerName || 'Inconnu',
          totalReferrals: 0,
          validated: 0,
          rewards: 0,
          lastActivity: ref.date
        };
      }
      
      referrerStats[ref.referrer].totalReferrals++;
      if (ref.status === 'validated') referrerStats[ref.referrer].validated++;
      if (ref.status === 'rewarded') referrerStats[ref.referrer].rewards++;
      if (new Date(ref.date) > new Date(referrerStats[ref.referrer].lastActivity)) {
        referrerStats[ref.referrer].lastActivity = ref.date;
      }
    });

    return Object.values(referrerStats)
      .sort((a, b) => b.validated - a.validated)
      .slice(0, limit);
  },

  // ✅ DÉTECTION DE FRAUDE
  detectFraudPatterns() {
    const referrals = this.getReferrals();
    const flags = [];

    // Détection de multi-comptes (même email filleul avec différents parrains)
    const referredMap = {};
    referrals.forEach(ref => {
      if (!referredMap[ref.referred]) {
        referredMap[ref.referred] = [];
      }
      referredMap[ref.referred].push(ref.referrer);
    });

    // Signaler les filluels avec plus de 3 parrains différents
    Object.entries(referredMap).forEach(([referred, referrers]) => {
      if (referrers.length > 3) {
        flags.push({
          type: 'MULTI_ACCOUNT',
          description: `Le filleul ${referred} a été parrainé par ${referrers.length} personnes différentes`,
          referred,
          referrers: referrers.slice(0, 3),
          severity: 'HIGH',
          recommendation: 'Vérifier la légitimité des comptes'
        });
      }
    });

    // Détection de parrains trop actifs (plus de 10 parrainages/jour)
    const today = new Date().toISOString().split('T')[0];
    const todayReferrals = referrals.filter(ref => 
      ref.date.split('T')[0] === today
    );
    
    const dailyReferrerCount = {};
    todayReferrals.forEach(ref => {
      dailyReferrerCount[ref.referrer] = (dailyReferrerCount[ref.referrer] || 0) + 1;
    });

    Object.entries(dailyReferrerCount).forEach(([referrer, count]) => {
      if (count > 10) {
        flags.push({
          type: 'EXCESSIVE_ACTIVITY',
          description: `Le parrain ${referrer} a enregistré ${count} parrainages aujourd'hui`,
          referrer,
          count,
          severity: 'MEDIUM',
          recommendation: 'Surveiller l\'activité pour détecter les abus'
        });
      }
    });

    return flags;
  },

  // ✅ RÉCOMPENSE MANUELLE PAR L'ADMIN
  manualReward(referrerEmail, ticketCount, reason) {
    console.log(`🎁 Récompense manuelle: ${ticketCount} ticket(s) pour ${referrerEmail}`);
    
    const tickets = this.giveReward(referrerEmail, ticketCount);
    
    // Journalisation admin
    const adminLog = {
      action: 'MANUAL_REWARD',
      admin: 'system',
      referrer: referrerEmail,
      tickets: ticketCount,
      reason: reason || 'Récompense administrative',
      timestamp: new Date().toISOString()
    };
    
    this.logAdminAction(adminLog);
    
    return { 
      success: true, 
      message: `✅ ${ticketCount} ticket(s) attribué(s) manuellement à ${referrerEmail}`,
      tickets 
    };
  },

  // ✅ SUSPENDRE UN PARRAIN
  suspendReferrer(email, reason) {
    const suspended = this.getSuspendedReferrers();
    suspended.push({
      email,
      reason: reason || 'Suspension administrative',
      suspendedAt: new Date().toISOString(),
      suspendedBy: 'admin'
    });
    
    localStorage.setItem('suspendedReferrers', JSON.stringify(suspended));
    
    return { 
      success: true, 
      message: `🚫 Le parrain ${email} a été suspendu pour: ${reason}` 
    };
  },

  // ✅ RÉINITIALISER LES STATS D'UN PARRAIN
  resetReferrerStats(email) {
    const referrals = this.getReferrals();
    const updatedReferrals = referrals.filter(ref => ref.referrer !== email);
    this.saveReferrals(updatedReferrals);
    
    return { 
      success: true, 
      message: `🔄 Toutes les statistiques de parrainage de ${email} ont été réinitialisées` 
    };
  },

  // ✅ RÉCUPÉRER LES PARRAINS SUSPENDUS
  getSuspendedReferrers() {
    return JSON.parse(localStorage.getItem('suspendedReferrers')) || [];
  },

  // ✅ JOURNALISATION DES ACTIONS ADMIN
  logAdminAction(logEntry) {
    const logs = JSON.parse(localStorage.getItem('referralAdminLog')) || [];
    logs.push(logEntry);
    localStorage.setItem('referralAdminLog', JSON.stringify(logs.slice(-100))); // Garder les 100 derniers
  },

  // ✅ STATISTIQUES UTILISATEUR
  getUserStats(userEmail) {
    const referrals = this.getReferrals();
    const userReferrals = referrals.filter(ref => ref.referrer === userEmail);
    
    return {
      totalReferrals: userReferrals.length,
      validatedReferrals: userReferrals.filter(ref => ref.status === 'validated').length,
      pendingReferrals: userReferrals.filter(ref => ref.status === 'pending').length,
      ticketsEarned: userReferrals.reduce((sum, ref) => sum + ref.ticketsEarned, 0),
      progress: Math.min((userReferrals.filter(ref => ref.status === 'validated').length / 5) * 100, 100)
    };
  }
};
