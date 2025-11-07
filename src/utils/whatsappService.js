// src/utils/whatsappService.js
export const WhatsAppService = {
  
  // ✅ FORMATAGE COMPLET AVEC OUTRE-MER
  formatPhoneNumber(phone) {
    if (!phone) return null;
    
    // Supprimer uniquement les espaces, garder le +
    let cleanPhone = phone.replace(/\s/g, '');
    
    // Vérifier et corriger le format international
    if (cleanPhone.startsWith('00')) {
      // Convertir 00... en +...
      cleanPhone = '+' + cleanPhone.substring(2);
    } else if (this.isFrenchOverseasNumber(cleanPhone)) {
      // Numéro d'outre-mer → garder tel quel avec +
      if (!cleanPhone.startsWith('+')) {
        cleanPhone = '+' + cleanPhone;
      }
    } else if (cleanPhone.startsWith('0') && !cleanPhone.startsWith('+')) {
      // Numéro France métropolitaine sans indicatif → ajouter +33
      cleanPhone = '+33' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('+')) {
      // Numéro sans indicatif → supposer que c'est un numéro français
      cleanPhone = '+33' + cleanPhone;
    }
    
    // Vérifier la longueur minimale
    if (cleanPhone.length < 8) {
      console.warn('❌ Numéro trop court:', cleanPhone);
      return null;
    }
    
    console.log('✅ Numéro formaté:', cleanPhone);
    return cleanPhone;
  },

  // ✅ DÉTECTION DES NUMÉROS D'OUTRE-MER FRANÇAIS
  isFrenchOverseasNumber(phone) {
    const overseasPrefixes = [
      '590', // Guadeloupe, Saint-Martin, Saint-Barthélemy
      '594', // Guyane
      '596', // Martinique
      '262', // La Réunion, Mayotte
      '508', // Saint-Pierre-et-Miquelon
      '690', // Wallis-et-Futuna
      '687'  // Nouvelle-Calédonie
    ];

    const cleanPhone = phone.replace(/\s/g, '');
    
    // Vérifier les formats avec indicatif
    for (const prefix of overseasPrefixes) {
      if (cleanPhone.startsWith(prefix) || 
          cleanPhone.startsWith('+' + prefix) ||
          cleanPhone.startsWith('00' + prefix)) {
        return true;
      }
    }
    
    return false;
  },

  // ✅ VALIDATION AMÉLIORÉE AVEC OUTRE-MER
  validatePhoneNumber(phone) {
    if (!phone) {
      return { 
        isValid: false, 
        error: 'Numéro de téléphone requis' 
      };
    }
    
    const formattedPhone = this.formatPhoneNumber(phone);
    const isOverseas = this.isFrenchOverseasNumber(phone);
    
    if (!formattedPhone) {
      return { 
        isValid: false, 
        error: 'Format de numéro invalide. Ex: +33 6 12 34 56 78 ou 06 12 34 56 78' 
      };
    }
    
    // Vérification plus poussée du format international
    const internationalRegex = /^\+\d{8,15}$/;
    if (!internationalRegex.test(formattedPhone)) {
      return { 
        isValid: false, 
        error: 'Format international invalide. Le numéro doit commencer par + suivi de 8 à 15 chiffres' 
      };
    }
    
    return { 
      isValid: true, 
      cleanPhone: formattedPhone,
      isOverseas: isOverseas,
      territory: isOverseas ? this.getFrenchTerritory(phone) : 'France métropolitaine',
      whatsappLink: `https://wa.me/${formattedPhone}`
    };
  },

  // ✅ GÉNÉRER LES MESSAGES AVEC FORMATAGE CORRECT
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

🌍 *Service client :* Ouvert à tous les territoires français

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

  // ✅ GÉNÉRER UN LIEN POUR UN GAGNANT
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
🌍 *Livraison :* Partout en France et Outre-Mer

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

🌍 *Fonctionne partout :* France métropolitaine et Outre-Mer

Merci de faire connaître notre tombola ! 🤝
    `.trim();

    return {
      link: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(referralMessage)}`,
      message: referralMessage,
      validation: validation
    };
  },

  // ✅ TESTER LE FORMATAGE
  testPhoneFormat(phone) {
    const validation = this.validatePhoneNumber(phone);
    return {
      original: phone,
      formatted: validation.cleanPhone,
      isValid: validation.isValid,
      isOverseas: validation.isOverseas,
      territory: validation.territory,
      error: validation.error,
      whatsappLink: validation.whatsappLink,
      testLinks: validation.isValid ? this.generateMessageLinks(phone, 'Test', ['1234', '5678'], 10) : null
    };
  },

  // ✅ IDENTIFIER LE TERRITOIRE
  getFrenchTerritory(phone) {
    const cleanPhone = phone.replace(/\s/g, '');
    
    const territories = {
      '590': 'Guadeloupe • Saint-Martin • Saint-Barthélemy',
      '594': 'Guyane française',
      '596': 'Martinique', 
      '262': 'La Réunion • Mayotte',
      '508': 'Saint-Pierre-et-Miquelon',
      '690': 'Wallis-et-Futuna',
      '687': 'Nouvelle-Calédonie'
    };

    for (const [prefix, territory] of Object.entries(territories)) {
      if (cleanPhone.includes(prefix)) {
        return territory;
      }
    }
    
    return 'France métropolitaine';
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
      let message = '✅ Format valide';
      if (validation.isOverseas) {
        message += ` • ${validation.territory}`;
      }
      
      return { 
        isValid: true, 
        message: message,
        formatted: validation.cleanPhone,
        territory: validation.territory
      };
    } else {
      return { 
        isValid: false, 
        message: validation.error
      };
    }
  },

  // ✅ LISTE DES TERRITOIRES SUPPORTÉS (POUR L'AIDE)
  getSupportedTerritories() {
    return {
      'France métropolitaine': ['+33', '06', '07'],
      'Guadeloupe • Saint-Martin • Saint-Barthélemy': ['+590', '0690'],
      'Guyane française': ['+594', '0694'], 
      'Martinique': ['+596', '0696'],
      'La Réunion • Mayotte': ['+262', '0262'],
      'Saint-Pierre-et-Miquelon': ['+508', '0508'],
      'Wallis-et-Futuna': ['+690', '0690'],
      'Nouvelle-Calédonie': ['+687', '0687']
    };
  }
};
