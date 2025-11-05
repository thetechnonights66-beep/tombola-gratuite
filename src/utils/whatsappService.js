// src/utils/whatsappService.js
export const WhatsAppService = {
  
  // Générer les liens WhatsApp pré-remplis
  generateMessageLinks(phone, name, ticketNumbers) {
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
• Date : ${currentDate}

📅 *Prochain tirage :* À suivre sur notre site
🎁 *Lots à gagner :* Voyages, high-tech, cadeaux exclusifs !

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
  }
};
