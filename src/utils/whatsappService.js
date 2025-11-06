// src/utils/whatsappService.js
export const WhatsAppService = {
  
  // ✅ FORMATAGE CORRECT POUR LES NUMÉROS INTERNATIONAUX
  formatPhoneNumber(phone) {
    if (!phone) return null;
    
    // Supprimer uniquement les espaces, garder le +
    let cleanPhone = phone.replace(/\s/g, '');
    
    // Vérifier et corriger le format international
    if (cleanPhone.startsWith('00')) {
      // Convertir 00... en +...
      cleanPhone = '+' + cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('0') && !cleanPhone.startsWith('+')) {
      // Numéro français sans indicatif → ajouter +33
      cleanPhone = '+33' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('+')) {
      // Numéro sans indicatif → supposer que c'est un numéro français
      cleanPhone = '+33' + cleanPhone;
    }
    
    // Vérifier la longueur minimale
    if (cleanPhone.length < 10) {
      console.warn('❌ Numéro trop court:', cleanPhone);
      return null;
    }
    
    console.log('✅ Numéro formaté:', cleanPhone);
    return cleanPhone;
  },

  // ✅ VALIDATION AMÉLIORÉE DU NUMÉRO
  validatePhoneNumber(phone) {
    if (!phone) {
      return { 
        isValid: false, 
        error: 'Numéro de téléphone requis' 
      };
    }
    
    const formattedPhone = this.formatPhoneNumber(phone);
    
    if (!formattedPhone) {
      return { 
        isValid: false, 
        error: 'Format de numéro invalide. Ex: +33 6 12 34 56 78 ou 06 12 34 56 78' 
      };
    }
    
    // Vérification plus poussée du format international
    const internationalRegex = /^\+\d{10,15}$/;
    if (!internationalRegex.test(formattedPhone)) {
      return { 
        isValid: false, 
        error: 'Format international invalide. Le numéro doit commencer par + suivi de 10 à 15 chiffres' 
      };
    }
    
    return { 
      isValid: true, 
      cleanPhone: formattedPhone,
      whatsappLink: `https://wa.me/${formattedPhone}`
    };
  },

  // Générer les liens WhatsApp pré-remplis
  generateMessageLinks(phone, name, ticketNumbers, amount) {
    const validation = this.validatePhoneNumber(phone);
    if (!validation.isValid) {
      console.warn('❌ Numéro invalide:', validation.error);
      return null;
    }
    
    const formattedPhone = validation.cleanPhone;
    const ticketsList = ticketNumbers.join(', ');
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    // Message de confirmation d'achat
    const purchaseMessage = `
🎫 *CONFIRMATION D'ACHAT - Tombola Excursion* 🎪

Bonjour ${name} ! 

✅ *VOTRE ACHAT EST CONFIRMÉ !*
• Tickets : ${ticketNumbers.length} 
• Numéros : ${ticketsList}
• Montant : ${amount}€
• Date : ${currentDate}

📅 *Prochain tirage :* À suivre sur notre site
🎁 *Lots à gagner :* Voyages, high-tech, cadeaux exclusifs !
📺 *Suivez le live :* ${window.location.origin}/#/live

Merci pour votre participation ! 🍀
    `.trim();

    // Message de rappel de tirage
    const reminderMessage = `
🔔 *RAPPEL TIRAGE - Tombola Excursion* 🎪

Bonjour ${name} !

📅 *TIRAGE EN DIRECT CE SOIR !*
⏰ *Horaire :* 20h00
📺 *Lien direct :* ${window.location.origin}/#/live

🎯 *Vos tickets :* ${ticketsList}

Ne manquez pas le tirage ! 🤞
    `.trim();

    return {
      purchaseConfirmation: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(purchaseMessage)}`,
      drawReminder: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(reminderMessage)}`,
      rawMessages: {
        purchase: purchaseMessage,
        reminder: reminderMessage
      },
      validation: validation
    };
  },

  // Générer un lien pour un gagnant
  generateWinnerLink(phone, name, prize, ticketNumber) {
    const validation = this.validatePhoneNumber(phone);
    if (!validation.isValid) {
      console.warn('❌ Numéro invalide pour le gagnant:', validation.error);
      return null;
    }
    
    const formattedPhone = validation.cleanPhone;
    
    const winnerMessage = `
🏆 *VOUS AVEZ GAGNÉ ! - Tombola Excursion* 🎪

FÉLICITATIONS ${name} ! 🎉

🎁 *VOUS AVEZ GAGNÉ :* ${prize}
🎫 *Avec le ticket n°:* ${ticketNumber}

📞 *Pour récupérer votre lot :*
Contactez-nous au 01 23 45 67 89
ou par email : contact@tombola-excursion.fr

⏰ *Délai :* 30 jours pour réclamer votre prix

Félicitations encore ! 🥳
    `.trim();

    return {
      link: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(winnerMessage)}`,
      message: winnerMessage,
      validation: validation
    };
  },

  // ✅ GÉNÉRER UN LIEN DE CONTACT GÉNÉRAL
  generateContactLink(message = '') {
    const defaultMessage = `
📞 *CONTACT - Tombola Excursion* 🎪

Bonjour ! 

Je souhaite obtenir des informations sur la tombola.

Pouvez-vous me renseigner ?
    `.trim();
    
    const finalMessage = message || defaultMessage;
    const contactPhone = '+33123456789'; // Numéro de contact par défaut formaté international
    
    return `https://wa.me/${contactPhone}?text=${encodeURIComponent(finalMessage)}`;
  },

  // ✅ GÉNÉRER UN MESSAGE DE PARRAINAGE
  generateReferralLink(phone, name, referralCode) {
    const validation = this.validatePhoneNumber(phone);
    if (!validation.isValid) {
      console.warn('❌ Numéro invalide pour le parrainage:', validation.error);
      return null;
    }
    
    const formattedPhone = validation.cleanPhone;
    
    const referralMessage = `
👥 *PARRAINAGE - Tombola Excursion* 🎪

Bonjour ${name} !

🎁 *FAITES GAGNER VOS AMIS !*
Partagez votre code de parrainage :

🔑 *VOTRE CODE :* ${referralCode}

💡 *Comment ça marche ?*
1. Vos amis utilisent votre code à l'achat
2. Vous gagnez 1 point par parrainage
3. Après 5 points → 1 TICKET GRATUIT !

📱 *Lien d'inscription :* ${window.location.origin}

Merci de faire connaître notre tombola ! 🤝
    `.trim();

    return {
      link: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(referralMessage)}`,
      message: referralMessage,
      validation: validation
    };
  },

  // ✅ TESTER LE FORMATAGE (UTILE POUR LE DÉBUGAGE)
  testPhoneFormat(phone) {
    const validation = this.validatePhoneNumber(phone);
    return {
      original: phone,
      formatted: validation.cleanPhone,
      isValid: validation.isValid,
      error: validation.error,
      whatsappLink: validation.whatsappLink,
      testLinks: validation.isValid ? this.generateMessageLinks(phone, 'Test', ['1234', '5678'], 10) : null
    };
  },

  // ✅ GÉNÉRER UN LIEN WHATSAPP SIMPLE (SANS MESSAGE PRÉ-REMPLI)
  generateSimpleLink(phone) {
    const validation = this.validatePhoneNumber(phone);
    if (!validation.isValid) return null;
    
    return validation.whatsappLink;
  },

  // ✅ VALIDATION EN TEMPS RÉEL POUR LES FORMULAIRES
  validatePhoneInRealTime(phone) {
    if (!phone) {
      return { isValid: false, message: 'Saisissez votre numéro' };
    }
    
    // Validation basique de longueur
    if (phone.replace(/\s/g, '').length < 8) {
      return { isValid: false, message: 'Numéro trop court' };
    }
    
    const validation = this.validatePhoneNumber(phone);
    
    if (validation.isValid) {
      return { 
        isValid: true, 
        message: '✅ Format valide',
        formatted: validation.cleanPhone
      };
    } else {
      return { 
        isValid: false, 
        message: validation.error
      };
    }
  }
};
