// src/utils/whatsappService.js
export const WhatsAppService = {
  
  // Générer les liens WhatsApp pré-remplis
  generateMessageLinks(phone, name, ticketNumbers, amount) {
    if (!phone) return null;
    
    // Nettoyer le numéro (supprimer espaces, +, etc.)
    const cleanPhone = phone.replace(/[\s+]/g, '');
    
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
      purchaseConfirmation: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(purchaseMessage)}`,
      drawReminder: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(reminderMessage)}`,
      rawMessages: {
        purchase: purchaseMessage,
        reminder: reminderMessage
      }
    };
  },

  // Générer un lien pour un gagnant
  generateWinnerLink(phone, name, prize, ticketNumber) {
    if (!phone) return null;
    
    const cleanPhone = phone.replace(/[\s+]/g, '');
    
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

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(winnerMessage)}`;
  },

  // ✅ NOUVELLE FONCTION : Valider le format du numéro
  validatePhoneNumber(phone) {
    if (!phone) return { isValid: false, error: 'Numéro requis' };
    
    // Nettoyer le numéro
    const cleanPhone = phone.replace(/[\s+]/g, '');
    
    // Regex pour numéros français (06, 07, +33)
    const frenchPhoneRegex = /^(?:(?:\+|00)33|0)[1-9](\d{2}){4}$/;
    
    if (!frenchPhoneRegex.test(cleanPhone)) {
      return { 
        isValid: false, 
        error: 'Format invalide. Ex: +33 6 12 34 56 78 ou 06 12 34 56 78' 
      };
    }
    
    return { isValid: true, cleanPhone };
  },

  // ✅ NOUVELLE FONCTION : Générer un lien de contact général
  generateContactLink(message = '') {
    const defaultMessage = `
📞 *CONTACT - Tombola Excursion* 🎪

Bonjour ! 

Je souhaite obtenir des informations sur la tombola.

Pouvez-vous me renseigner ?
    `.trim();
    
    const finalMessage = message || defaultMessage;
    const contactPhone = '33123456789'; // Numéro de contact par défaut
    
    return `https://wa.me/${contactPhone}?text=${encodeURIComponent(finalMessage)}`;
  },

  // ✅ NOUVELLE FONCTION : Générer un message de parrainage
  generateReferralLink(phone, name, referralCode) {
    if (!phone) return null;
    
    const cleanPhone = this.validatePhoneNumber(phone).cleanPhone;
    
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

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(referralMessage)}`;
  }
};
