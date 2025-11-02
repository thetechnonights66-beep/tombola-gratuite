// Système de vérification et validation des emails
export const EmailVerification = {
  
  // ✅ VALIDER LE FORMAT D'UN EMAIL
  validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // ✅ VÉRIFIER SI L'EMAIL EXISTE DÉJÀ
  checkDuplicateEmail(email, currentParticipants = []) {
    return currentParticipants.some(participant => 
      participant.email.toLowerCase() === email.toLowerCase()
    );
  },

  // ✅ VÉRIFIER LES EMAILS SUSPECTS (FAUX EMAILS)
  checkSuspiciousEmail(email) {
    const suspiciousPatterns = [
      /test@/i,
      /example@/i,
      /admin@/i,
      /fake@/i,
      /temp@/i,
      /123@/i,
      /aaa@/i,
      /abc@/i,
      /no-reply@/i,
      /noreply@/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(email));
  },

  // ✅ VÉRIFIER LES DOMAINES DE FAÇON APPROFONDIE
  checkEmailDomain(email) {
    const domain = email.split('@')[1];
    const freeDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'aol.com', 'protonmail.com', 'icloud.com', 'mail.com',
      'yandex.com', 'zoho.com', 'gmx.com'
    ];

    const suspiciousDomains = [
      'tempmail.com', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'throwawaymail.com', 'fakeinbox.com',
      'temp-mail.org', 'trashmail.com', 'disposablemail.com'
    ];

    if (suspiciousDomains.includes(domain)) {
      return { valid: false, reason: 'Domaine jetable détecté' };
    }

    if (freeDomains.includes(domain)) {
      return { valid: true, reason: 'Domaine gratuit standard' };
    }

    return { valid: true, reason: 'Domaine personnalisé' };
  },

  // ✅ ANALYSE COMPLÈTE D'UN EMAIL
  analyzeEmail(email, currentParticipants = []) {
    const results = {
      email: email,
      isValidFormat: this.validateEmailFormat(email),
      isDuplicate: this.checkDuplicateEmail(email, currentParticipants),
      isSuspicious: this.checkSuspiciousEmail(email),
      domainAnalysis: this.checkEmailDomain(email),
      score: 0
    };

    // Calculer un score de confiance
    if (results.isValidFormat) results.score += 30;
    if (!results.isDuplicate) results.score += 30;
    if (!results.isSuspicious) results.score += 20;
    if (results.domainAnalysis.valid) results.score += 20;

    // Déterminer le statut
    if (results.score >= 80) {
      results.status = 'excellent';
    } else if (results.score >= 60) {
      results.status = 'bon';
    } else if (results.score >= 40) {
      results.status = 'moyen';
    } else {
      results.status = 'faible';
    }

    return results;
  },

  // ✅ GÉNÉRER UN RAPPORT DES EMAILS DOUTEUX
  generateSuspiciousEmailsReport(participants) {
    const suspiciousEmails = participants.map(participant => {
      const analysis = this.analyzeEmail(participant.email, participants);
      return {
        participant: participant.name,
        email: participant.email,
        analysis: analysis
      };
    }).filter(item => item.analysis.status === 'faible' || item.analysis.isDuplicate);

    return {
      totalParticipants: participants.length,
      suspiciousCount: suspiciousEmails.length,
      suspiciousEmails: suspiciousEmails,
      summary: {
        duplicates: suspiciousEmails.filter(e => e.analysis.isDuplicate).length,
        invalidFormat: suspiciousEmails.filter(e => !e.analysis.isValidFormat).length,
        suspiciousPatterns: suspiciousEmails.filter(e => e.analysis.isSuspicious).length,
        disposableDomains: suspiciousEmails.filter(e => !e.analysis.domainAnalysis.valid).length
      }
    };
  },

  // ✅ ENVOYER UN EMAIL DE VÉRIFICATION (SIMULATION)
  sendVerificationEmail(email, participantName) {
    // En production, vous utiliseriez un service comme SendGrid, Mailjet, etc.
    console.log(`📧 Email de vérification envoyé à: ${email}`);
    
    return {
      success: true,
      message: `Email de vérification envoyé à ${participantName} (${email})`,
      timestamp: new Date().toISOString()
    };
  }
};
